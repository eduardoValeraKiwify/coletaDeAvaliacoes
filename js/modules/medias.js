import { extrairFormId, initIconLoading, statusMensagem } from "./utils.js";
import { fetchJSON } from "./fetch.js";
import { GAS_URL } from "./gas.js";
import { colaboradores } from "./coletor.js";

function renderMedias(medias) {
  const tbody = document.querySelector("#mediasTable tbody");
  tbody.innerHTML = "";

  medias.forEach((m, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="px-6 py-3">${m.nome}</td>
      <td class="px-6 py-3">${m.email}</td>
      <td class="px-6 py-3">${m.funcao}</td>
      <td class="px-6 py-3">
        <input type="number" step="0.01" min="0" max="10"
          value="${m.mediaFinal}"
          data-index="${index}"
          class="border rounded px-2 py-1 w-24 text-center"/>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Listener para capturar alterações
  tbody.querySelectorAll("input[type=number]").forEach((input) => {
    input.addEventListener("change", (e) => {
      const idx = e.target.dataset.index;
      medias[idx].mediaFinal = parseFloat(e.target.value).toFixed(2);
    });
  });
}

export async function calcularMedias() {
  const id1 = extrairFormId(document.getElementById("formUrl1").value.trim());
  const id2 = extrairFormId(document.getElementById("formUrl2").value.trim());
  if (!id1 || !id2) {
    statusMensagem(
      this,
      "Informe URLs válidas para ambos formulários!",
      "alerta"
    );
    return;
  }

  if (!colaboradores.length) {
    statusMensagem(
      this,
      "A lista de colaboradores não foi carregada",
      "alerta",
      false
    );
    return;
  }

  initIconLoading(this, true);

  const respostas = await fetchJSON(
    GAS_URL +
      "?action=getFormResponses&formIds=" +
      encodeURIComponent(id1 + "," + id2)
  );
  const medias = [];

  for (let c of colaboradores) {
    const r = respostas[c.email] || {};
    const nota1 =
      r.form1 && typeof r.form1.notaFinal !== "undefined"
        ? Number(r.form1.notaFinal)
        : 1;
    const nota2 =
      r.form2 && typeof r.form2.notaFinal !== "undefined"
        ? Number(r.form2.notaFinal)
        : 1;
    const mediaFinal = ((nota1 + nota2) / 2).toFixed(2);
    medias.push({
      nome: c.nome,
      email: c.email,
      funcao: c.funcoes.nome,
      mediaFinal,
    });
  }

  renderMedias(medias);
  initIconLoading(this, false);
  statusMensagem(this, "Médias calculadas com sucesso!", "sucesso", false);
}

export async function salvarMedias() {
  initIconLoading(this, true);
  const rows = document.querySelectorAll("#mediasTable tbody tr");
  if (!Array.from(rows).length) {
    statusMensagem(this, "Não há médias para salvar!", "alerta");
    initIconLoading(this, false);
    return;
  }
  const medias = Array.from(rows).map((tr) => {
    const cells = tr.querySelectorAll("td");
    return {
      nome: cells[0].textContent,
      email: cells[1].textContent,
      funcao: cells[2].textContent,
      mediaFinal: parseFloat(cells[3].querySelector("input").value) || 0,
    };
  });

  const cs = medias.filter((m) => m.funcao === "CS");
  const service = medias.filter((m) => m.funcao === "Service");

  const mes = document.getElementById("mesSelect").value;
  const ano = document.getElementById("anoSelect").value;
  const colunaCS = mes + "./" + ano.slice(-2);

  const mesesMap = {
    jan: "01",
    fev: "02",
    mar: "03",
    abr: "04",
    mai: "05",
    jun: "06",
    jul: "07",
    ago: "08",
    set: "09",
    out: "10",
    nov: "11",
    dez: "12",
  };
  const mesNum = mesesMap[mes];
  const dataService = `01/${mesNum}/${ano}`;

  const payloadCS = {
    coluna: colunaCS,
    dados: cs.map((c) => ({ nome: c.nome, nota: c.mediaFinal })),
  };
  const payloadService = {
    data: dataService,
    dados: service.map((c) => ({ nome: c.nome, nota: c.mediaFinal })),
  };

  await fetch(
    GAS_URL +
      "?action=saveNotasCS&payload=" +
      encodeURIComponent(JSON.stringify(payloadCS))
  );
  await fetch(
    GAS_URL +
      "?action=saveNotasService&payload=" +
      encodeURIComponent(JSON.stringify(payloadService))
  );

  initIconLoading(this, false);
  statusMensagem(this, "Médias salvas com sucesso!", "sucesso");
}
