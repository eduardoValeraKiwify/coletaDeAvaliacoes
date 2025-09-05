import { supabaseInit } from "./supabase.js";
import { GAS_URL } from "./gas.js";
import { initIconLoading } from "./utils.js";
import { fetchJSON, fetchPage } from "./fetch.js";
import { calcularMedias, salvarMedias } from "./medias.js";
import logout from "./logout.js";
import sessionCheck from "./session.js";

export let colaboradores = [];

let colaboradoresTeste = [
  {
    nome: "Ana Laura da Silva Barragana Vera",
    email: "ana.silva@kiwify.com.br",
    funcao: "CS",
  },
  {
    nome: "Isabelle Nascimento de Faria da Silva",
    email: "isabelle.nascimento@kiwify.com.br",
    funcao: "CS",
  },
  {
    nome: "Henrique Petri Silva",
    email: "henrique.petri@kiwify.com.br",
    funcao: "CS",
  },
  {
    nome: "Lucas Xavier Ferreira",
    email: "lucas.xavier@kiwify.com.br",
    funcao: "CS",
  },
  {
    nome: "Magno da silva Alves",
    email: "magno.alves@kiwify.com.br",
    funcao: "CS",
  },
  {
    nome: "Maria Eduarda Sinfães Fonseca",
    email: "maria.sinfaes@kiwify.com.br",
    funcao: "CS",
  },
  {
    nome: "Pedro Henrique Machado Braz",
    email: "pedro.braz@kiwify.com.br",
    funcao: "CS",
  },
  {
    nome: "Vitória Helena Tosta Silva",
    email: "vitoria.silva@kiwify.com.br",
    funcao: "CS",
  },
  {
    nome: "Bruna de Abreu Salmerón",
    email: "bruna.salmeron@kiwify.com.br",
    funcao: "Service",
  },
  {
    nome: "Gustavo da Silva Fontes",
    email: "gustavo.fontes@kiwify.com.br",
    funcao: "Service",
  },
  {
    nome: "Eduardo Valera",
    email: "eduardo.valera@kiwify.com.br",
    funcao: "CS",
  },
  { nome: "John Doe", email: "john.doe@kiwify.com.br", funcao: "CS" },
];

// Inicializa o formulário de adicionar
async function inicializarFormulario() {
  const select = document.getElementById("novoFuncao");

  // Carregar funções
  const { data: funcoes, error } = await supabaseInit
    .from("funcoes")
    .select("id, nome")
    .order("nome");

  if (error) {
    console.error("Erro ao buscar funções:", error);
    return;
  }

  funcoes.forEach((f) => {
    const option = document.createElement("option");
    option.value = f.id;
    option.textContent = f.nome;
    select.appendChild(option);
  });

  // Botão adicionar
  document
    .getElementById("btnAdicionar")
    .addEventListener("click", async () => {
      const nome = document.getElementById("novoNome").value.trim();
      const email = document.getElementById("novoEmail").value.trim();
      const funcao_id = parseInt(select.value, 10);

      if (!nome || !email) {
        alert("Preencha nome e email!");
        return;
      }

      const { data, error } = await supabaseInit
        .from("colaboradores")
        .insert([{ nome, email, funcao_id }])
        .select(
          `
        id,
        nome,
        email,
        criado_em,
        funcoes (nome)
      `
        );

      if (error) {
        console.error("Erro ao adicionar colaborador:", error);
        alert("Erro ao adicionar colaborador!");
      } else {
        colaboradores.push(data[0]);
        console.log(data[0]);
        renderColaboradores();
        document.getElementById("novoNome").value = "";
        document.getElementById("novoEmail").value = "";
        select.selectedIndex = 0;
      }
    });
}

// Renderiza a tabela de colaboradores
async function renderColaboradores() {
  const tbody = document.querySelector("#colaboradoresTable tbody");
  tbody.innerHTML = "";

  const { data: funcoes, error } = await supabaseInit
    .from("funcoes")
    .select("id, nome")
    .order("nome");

  if (error) {
    console.error("Erro ao buscar funções:", error);
    return;
  }

  colaboradores.forEach((c) => {
    const tr = document.createElement("tr");

    // Nome
    const tdNome = document.createElement("td");
    tdNome.className = "px-6 py-3";
    tdNome.textContent = c.nome;

    // Email
    const tdEmail = document.createElement("td");
    tdEmail.className = "px-6 py-3";
    tdEmail.textContent = c.email;

    // Função (select)
    const tdFuncao = document.createElement("td");
    tdFuncao.className = "px-6 py-3 text-center relative";

    const selectWrapper = document.createElement("div");
    selectWrapper.className = "relative inline-block";

    const select = document.createElement("select");
    select.className =
      "border rounded px-2 py-1 bg-white focus:ring focus:ring-blue-300 transition-colors duration-300";

    funcoes.forEach((f) => {
      const option = document.createElement("option");
      option.value = f.id;
      option.textContent = f.nome;
      console.log(f.nome, c.funcoes.nome);
      if (f.nome === c.funcoes.nome) option.selected = true;
      select.appendChild(option);
    });

    // Spinner
    const spinner = document.createElement("span");
    spinner.className =
      "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin hidden";

    selectWrapper.appendChild(select);
    selectWrapper.appendChild(spinner);
    tdFuncao.appendChild(selectWrapper);

    select.addEventListener("change", async (e) => {
      const novoFuncaoId = parseInt(e.target.value, 10);
      spinner.classList.remove("hidden");

      const { error } = await supabaseInit
        .from("colaboradores")
        .update({ funcao_id: novoFuncaoId })
        .eq("id", c.id);

      spinner.classList.add("hidden");

      if (error) {
        tdFuncao.classList.add("bg-red-200");
        setTimeout(() => tdFuncao.classList.remove("bg-red-200"), 1500);
      } else {
        const funcaoSelecionada = funcoes.find((f) => f.id === novoFuncaoId);
        c.funcoes.nome = funcaoSelecionada.nome;
        tdFuncao.classList.add("bg-green-200");
        setTimeout(() => tdFuncao.classList.remove("bg-green-200"), 1500);
      }
    });

    // Excluir
    const tdExcluir = document.createElement("td");
    tdExcluir.className = "px-6 py-3 text-center";

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "❌";
    btnExcluir.className = "text-red-500 hover:text-red-700 font-bold";

    btnExcluir.addEventListener("click", async () => {
      if (!confirm(`Deseja excluir ${c.nome}?`)) return;

      const { error } = await supabaseInit
        .from("colaboradores")
        .delete()
        .eq("id", c.id);

      if (error) {
        tdExcluir.classList.add("bg-red-200");
        setTimeout(() => tdExcluir.classList.remove("bg-red-200"), 1500);
      } else {
        colaboradores = colaboradores.filter((col) => col.id !== c.id);
        renderColaboradores();
      }
    });

    tdExcluir.appendChild(btnExcluir);

    // Monta linha
    tr.appendChild(tdNome);
    tr.appendChild(tdEmail);
    tr.appendChild(tdFuncao);
    tr.appendChild(tdExcluir);

    tbody.appendChild(tr);
  });
}

async function initCarregarColaboradores() {
  initIconLoading(document.getElementById("colaboradoresTitle"), true);
  const { data, error } = await supabaseInit
    .from("colaboradores")
    .select(
      `
        id,
        nome,
        email,
        criado_em,
        funcoes (nome)
      `
    )
    .order("nome");

  if (error) {
    console.error("Erro ao buscar colaboradores:", error);
    return;
  }
  initIconLoading(document.getElementById("colaboradoresTitle"));
  colaboradores = data;
  renderColaboradores();
}

export default async function initColetorPage() {
  const session = await sessionCheck();

  if (session) {
    inicializarFormulario();
    initCarregarColaboradores();
    document.getElementById("botaoCalcularMedias") &&
      document
        .getElementById("botaoCalcularMedias")
        .addEventListener("click", calcularMedias);

    document.getElementById("botaoSalvarMedias") &&
      document
        .getElementById("botaoSalvarMedias")
        .addEventListener("click", salvarMedias);

    function handleLogout() {
      if (document.getElementById("logoutLink")) {
        document
          .getElementById("logoutLink")
          .addEventListener("click", async function (event) {
            event.preventDefault();
            const { success, error } = await logout();

            if (!success) {
              console.error("Erro ao sair:", error);
              return;
            }

            fetchPage("index.html");
          });
      }
    }

    handleLogout();
  } else {
    fetchPage("index.html");
  }
}
