import { fetchPage } from "./fetch.js";
import sessionCheck from "./session.js";
import signIn from "./signIn.js";

export default async function initLogin() {
  const session = await sessionCheck();

  if (!session) {
    document.getElementById("loginForm") &&
      document
        .getElementById("loginForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();

          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          const { success, data, error } = await signIn(email, password);

          if (!success) {
            console.log("Usuário ou senha inválidos. Tente novamente.");
            return;
          }
          fetchPage("coletor.html");
        });

    return;
  }

  fetchPage("coletor.html");
}
