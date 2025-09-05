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

function renderColaboradores() {
  const tbody = document.querySelector("#colaboradoresTable tbody");
  tbody.innerHTML = "";
  colaboradores.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="px-6 py-3">${c.nome}</td><td class="px-6 py-3">${c.email}</td><td class="px-6 py-3 text-center">${c.funcao}</td>`;
    tbody.appendChild(tr);
  });
}

async function initCarregarColaboradores() {
  initIconLoading(document.getElementById("colaboradoresTitle"), true);
  colaboradores = await fetchJSON(GAS_URL + "?action=getColaboradores");
  initIconLoading(document.getElementById("colaboradoresTitle"));
  renderColaboradores();
}

export default async function initColetorPage() {
  const session = await sessionCheck();

  if (session) {
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
