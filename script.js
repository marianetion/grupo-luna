const viewer = document.querySelector("#productViewer");

const openTutorialButton =
  document.querySelector("#openTutorial");

const closeTutorialButton =
  document.querySelector("#closeTutorial");

const tutorialModal =
  document.querySelector("#tutorialModal");

const tutorialNextButton =
  document.querySelector("#tutorialNext");

const tutorialScreens =
  document.querySelectorAll(".tutorial-screen");

const tutorialDots =
  document.querySelectorAll(".tutorial-dot");

const shareButton =
  document.querySelector(".secondary-action");

const startARButton =
  document.querySelector("#startAR");

  /* =========================================================
   SWIPE DEL TUTORIAL
========================================================= */

let touchStartX = 0;
let touchStartY = 0;

const SWIPE_THRESHOLD = 50;


/*
 * Inicio del gesto
 */
tutorialModal?.addEventListener(
  "touchstart",
  (event) => {

    if (!tutorialModal.classList.contains("is-open")) {
      return;
    }

    const touch = event.changedTouches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

  },
  { passive: true }
);


/*
 * Final del gesto
 */
tutorialModal?.addEventListener(
  "touchend",
  (event) => {

    if (!tutorialModal.classList.contains("is-open")) {
      return;
    }

    const touch = event.changedTouches[0];

    const deltaX =
      touch.clientX - touchStartX;

    const deltaY =
      touch.clientY - touchStartY;


    /*
     * Si el movimiento vertical es mayor
     * que el horizontal, no lo consideramos
     * un swipe.
     */
    if (
      Math.abs(deltaY) >
      Math.abs(deltaX)
    ) {
      return;
    }


    /*
     * Ignorar movimientos pequeños.
     */
    if (
      Math.abs(deltaX) <
      SWIPE_THRESHOLD
    ) {
      return;
    }


    /*
     * Swipe hacia la izquierda:
     * siguiente pantalla.
     */
    if (deltaX < 0) {

      if (
        currentTutorialScreen <
        totalTutorialScreens - 1
      ) {

        currentTutorialScreen++;

        updateTutorial();

      }

      return;
    }


    /*
     * Swipe hacia la derecha:
     * pantalla anterior.
     */
    if (deltaX > 0) {

      if (
        currentTutorialScreen > 0
      ) {

        currentTutorialScreen--;

        updateTutorial();

      }

    }

  },
  { passive: true }
);


/* =========================================================
   MODELOS
========================================================= */

const models = [
  {
    src: "models/calistenia-mfc-02.glb",
    iosSrc: "models/calistenia-mfc-02.usdz",
    alt: "Equipo de Calistenia MFC-02",
  },
];

let currentModelIndex = 0;


/* =========================================================
   MODELO ACTUAL
========================================================= */

function applyModel(model) {

  viewer.src = model.src;

  viewer.setAttribute(
    "ios-src",
    model.iosSrc
  );

  viewer.alt = model.alt;

}


/* =========================================================
   TUTORIAL
========================================================= */

let currentTutorialScreen = 0;

const totalTutorialScreens =
  tutorialScreens.length;


/**
 * Actualiza visualmente la pantalla
 * actual del tutorial.
 */
function updateTutorial() {

  tutorialScreens.forEach(
    (screen, index) => {

      screen.classList.toggle(
        "active",
        index === currentTutorialScreen
      );

    }
  );


  tutorialDots.forEach(
    (dot, index) => {

      dot.classList.toggle(
        "active",
        index === currentTutorialScreen
      );

    }
  );


  const isLastScreen =
    currentTutorialScreen ===
    totalTutorialScreens - 1;


  /*
   * Siguiente solamente aparece
   * en las tarjetas 1 y 2.
   */
  tutorialNextButton.style.display =
    isLastScreen
      ? "none"
      : "block";


  /*
   * El botón para iniciar AR solamente
   * aparece en la tarjeta 3.
   */
  startARButton.style.display =
    isLastScreen
      ? "inline-flex"
      : "none";
}


/**
 * Abre el tutorial desde la primera
 * pantalla.
 */
function openTutorial() {

  currentTutorialScreen = 0;

  updateTutorial();

  tutorialModal.classList.add("is-open");

  tutorialModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "tutorial-open"
  );

}


/**
 * Cierra el tutorial.
 */
function closeTutorial() {

  tutorialModal.classList.remove(
    "is-open"
  );

  tutorialModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "tutorial-open"
  );

}


/**
 * Avanza una pantalla.
 *
 * En la última pantalla se
 * activa la realidad aumentada.
 */
function nextTutorialScreen() {

  if (
    currentTutorialScreen <
    totalTutorialScreens - 1
  ) {

    currentTutorialScreen++;

    updateTutorial();

  }

startARButton?.addEventListener(
  "click",
  () => {

    closeTutorial();

    if (
      typeof viewer.activateAR ===
      "function"
    ) {

      viewer.activateAR();

    }

  }
);

}


/* =========================================================
   EVENTOS DEL TUTORIAL
========================================================= */

openTutorialButton?.addEventListener(
  "click",
  openTutorial
);


closeTutorialButton?.addEventListener(
  "click",
  closeTutorial
);


tutorialNextButton?.addEventListener(
  "click",
  nextTutorialScreen
);


/*
 * También permitimos hacer click
 * directamente en los indicadores.
 */
tutorialDots.forEach(
  (dot) => {

    dot.addEventListener(
      "click",
      () => {

        const screen =
          Number(
            dot.dataset.dot
          );

        if (
          Number.isNaN(screen)
        ) {
          return;
        }

        currentTutorialScreen =
          screen;

        updateTutorial();

      }
    );

  }
);


/*
 * Cerrar haciendo click fuera
 * de la tarjeta.
 */
tutorialModal?.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      tutorialModal
    ) {

      closeTutorial();

    }

  }
);


/*
 * Cerrar con ESC.
 */
document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      tutorialModal.classList.contains(
        "is-open"
      )
    ) {

      closeTutorial();

    }

  }
);


/* =========================================================
   COMPARTIR
========================================================= */

shareButton?.addEventListener(
  "click",
  async () => {

    const shareData = {
      title: document.title,
      text: "Visualízalo en Realidad Aumentada",
      url: window.location.href,
    };


    try {

      if (
        navigator.share
      ) {

        await navigator.share(
          shareData
        );

        return;

      }


      if (
        navigator.clipboard?.writeText
      ) {

        await navigator.clipboard.writeText(
          window.location.href
        );

        const originalContent =
          shareButton.innerHTML;

        shareButton.innerHTML =
          `<span>Enlace copiado</span>`;

        window.setTimeout(
          () => {

            shareButton.innerHTML =
              originalContent;

          },
          1600
        );

        return;

      }


      window.prompt(
        "Copia este enlace:",
        window.location.href
      );

    } catch (error) {

      /*
       * El usuario puede cancelar
       * navigator.share().
       */
      if (
        error.name !==
        "AbortError"
      ) {

        console.error(
          "Error al compartir:",
          error
        );

      }

    }

  }
);


/* =========================================================
   CAMBIO DE MODELO
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft"
    ) {

      return;

    }


    currentModelIndex =
      event.key === "ArrowRight"
        ? (
            currentModelIndex + 1
          ) % models.length
        : (
            currentModelIndex -
            1 +
            models.length
          ) % models.length;


    applyModel(
      models[currentModelIndex]
    );

  }
);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

applyModel(
  models[currentModelIndex]
);

updateTutorial();
