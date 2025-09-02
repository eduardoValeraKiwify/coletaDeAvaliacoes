function statusMensagem(
  elementoReferencia,
  mensagem = "Mensagem padrão",
  tipo = "alerta"
) {
  const statusContainer = elementoReferencia.nextElementSibling;
  if (statusContainer.classList.contains("container-status")) {
    if (tipo === "sucesso") {
      statusContainer.innerHTML = `
        <!-- Sucesso -->
        <div class="flex items-center gap-2 p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clip-rule="evenodd" />
          </svg>
          <span>${mensagem}</span>
        </div>
      `;
    } else if (tipo === "erro") {
      statusContainer.innerHTML = `
        <!-- Erro -->
        <div class="flex items-center gap-2 p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
          <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11h2v4h-2V7zm0 6h2v2h-2v-2z" clip-rule="evenodd" />
          </svg>
          <span>${mensagem}</span>
        </div>
      `;
    } else {
      statusContainer.innerHTML = `
        <!-- Alerta -->
        <div class="flex items-center gap-2 p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50" role="alert">
          <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.366-.756 1.42-.756 1.786 0l7.451 15.377A1 1 0 0116.451 20H3.549a1 1 0 01-.894-1.524L8.257 3.1zM11 15a1 1 0 11-2 0 1 1 0 012 0zm-1-2a.75.75 0 01-.75-.75V8a.75.75 0 011.5 0v4.25A.75.75 0 0110 13z" clip-rule="evenodd" />
          </svg>
          <span>${mensagem}</span>
        </div>
      `;
    }

    statusContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      statusContainer.innerHTML = "";
    }, 5000);
  }
}

function toggleLoading(button, isLoading = false) {
  if (isLoading) {
    button.innerHTML = `<img src="../img/loading_icon.gif" height="20" width="20"> ${button.innerHTML}`;
    button.disabled = true;
  } else {
    button.disabled = false;
    button.innerHTML = button.innerText;
  }
}

function renderMedias(medias) {
  const tbody = document.querySelector("#mediasTable tbody");
  tbody.innerHTML = "";
  medias.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="px-6 py-3">${m.nome}</td><td class="px-6 py-3">${m.email}</td><td class="px-6 py-3">${m.funcao}</td><td class="px-6 py-3">${m.mediaFinal}</td>`;
    tbody.appendChild(tr);
  });
}

async function calcularMedias() {
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

  toggleLoading(this, true);

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
    medias.push({ nome: c.nome, email: c.email, funcao: c.funcao, mediaFinal });
  }

  renderMedias(medias);
  toggleLoading(this, false);
}

document
  .getElementById("botaoCalcularMedia")
  .addEventListener("click", calcularMedias);
