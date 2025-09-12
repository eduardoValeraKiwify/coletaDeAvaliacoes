export async function fetchJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

export function replaceContent(newText) {
  const newHtml = document.createElement("div");
  newHtml.innerHTML = newText;
  const oldContent = document.querySelector(".main");
  const newContent = newHtml.querySelector(".main");

  if (newContent.classList.contains("coletorPage")) {
    oldContent.parentElement.classList.value =
      "bg-gray-50 text-gray-800 min-h-screen p-6";
    oldContent.classList.value = "main coletorPage";
  } else if (newContent.classList.contains("loginPage")) {
    oldContent.parentElement.classList.value =
      "bg-gray-50 min-h-screen flex items-center justify-center px-4";
    oldContent.classList.value =
      "main loginPage w-full h-full flex items-center justify-center";
  }

  oldContent.innerHTML = newContent.innerHTML;
}

async function loadModuleForPage(url) {
  if (url === "/" || url === "index.html" || url === "/index.html") {
    const { default: initLogin } = await import("./login.js");
    initLogin();
  }

  if (url === "coletor.html" || url === "/coletor.html") {
    const { default: initColetorPage } = await import("./coletor.js");
    initColetorPage();
  }
}

export async function fetchPage(url) {
  const pageResponse = await fetch(url);
  const pageText = await pageResponse.text();
  replaceContent(pageText);
  window.history.pushState(null, null, url);
  await loadModuleForPage(url);
}

export function initFetchPage() {
  window.addEventListener("popstate", () => {
    fetchPage(window.location.pathname);
  });

  loadModuleForPage(window.location.pathname);
}
