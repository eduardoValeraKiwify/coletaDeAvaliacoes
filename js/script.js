import initCarregarColaboradores from "./modules/colaboradores.js";
import { calcularMedias, salvarMedias } from "./modules/medias.js";
window.onload = () => {
  initCarregarColaboradores();
  document
    .getElementById("botaoCalcularMedias")
    .addEventListener("click", calcularMedias);

  document
    .getElementById("botaoSalvarMedias")
    .addEventListener("click", salvarMedias);
};
