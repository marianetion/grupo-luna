const viewer = document.querySelector("#productViewer");
const arButtons = document.querySelectorAll(".ar-button, .primary-action");
const shareButton = document.querySelector(".secondary-action");

const models = [
  {
    src: "models/calistenia-mfc-02.glb",
    iosSrc: "models/calistenia-mfc-02.usdz",
    alt: "Equipo de Calistenia MFC-02",
  }
];

let currentModelIndex = 0;

function applyModel(model) {
  viewer.src = model.src;
  viewer.setAttribute("ios-src", model.iosSrc);
  viewer.alt = model.alt;
}

arButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (typeof viewer.activateAR === "function") {
      viewer.activateAR();
    }
  });
});

shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: "Visualízalo en Realidad Aumentada",
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(window.location.href);
    shareButton.textContent = "Enlace copiado";
    window.setTimeout(() => {
      shareButton.textContent = "Compartir enlace";
    }, 1600);
    return;
  }

  window.prompt("Copia este enlace:", window.location.href);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

  currentModelIndex =
    event.key === "ArrowRight"
      ? (currentModelIndex + 1) % models.length
      : (currentModelIndex - 1 + models.length) % models.length;

  applyModel(models[currentModelIndex]);
});

applyModel(models[currentModelIndex]);
