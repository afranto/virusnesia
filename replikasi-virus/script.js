(() => {
  "use strict";

  const STORAGE_KEY = "petualanganMikroskopis.v1";
  const phases = [
    { id: "home", label: "Beranda" },
    { id: "engage", label: "Engage" },
    { id: "explore", label: "Explore" },
    { id: "explain", label: "Explain" },
    { id: "elaborate", label: "Elaborate" },
    { id: "evaluate", label: "Evaluate" },
    { id: "reflection", label: "Refleksi" }
  ];
  const completionPhases = ["engage", "explore", "explain", "elaborate", "evaluate", "reflection"];

  const defaultState = {
    currentPage: "home",
    completed: [],
    answers: { engage: "", explore: "", reflection: "" }
  };

  let state = loadState();
  const pages = [...document.querySelectorAll(".page[data-phase]")];
  const navItems = [...document.querySelectorAll(".nav-item[data-go]")];
  const progressBar = document.getElementById("progress-bar");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const phaseLabel = document.getElementById("phase-label");
  const toast = document.getElementById("toast");
  let toastTimer;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || typeof saved !== "object") return JSON.parse(JSON.stringify(defaultState));
      return {
        ...defaultState,
        ...saved,
        completed: Array.isArray(saved.completed) ? saved.completed.filter(id => completionPhases.includes(id)) : [],
        answers: { ...defaultState.answers, ...(saved.answers && typeof saved.answers === "object" ? saved.answers : {}) }
      };
    } catch (error) {
      console.warn("Progres lokal tidak dapat dibaca:", error);
      return { ...defaultState, completed: [], answers: { ...defaultState.answers } };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn("Progres belum dapat disimpan di perangkat ini:", error);
      showToast("Penyimpanan lokal tidak tersedia di browser ini.");
      return false;
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2500);
  }

  function updateProgress() {
    const percent = Math.round((state.completed.length / completionPhases.length) * 100);
    progressFill.style.width = percent + "%";
    progressLabel.textContent = percent + "% selesai";
    progressBar.setAttribute("aria-valuenow", String(percent));
    phaseLabel.textContent = (phases.find(phase => phase.id === state.currentPage) || phases[0]).label;
  }

  function renderPage(pageId, options = {}) {
    const validId = phases.some(phase => phase.id === pageId) ? pageId : "home";
    state.currentPage = validId;
    pages.forEach(page => {
      const active = page.dataset.phase === validId;
      page.classList.toggle("is-active", active);
      page.hidden = !active;
    });
    navItems.forEach(button => {
      const active = button.dataset.go === validId;
      button.classList.toggle("is-current", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    updateProgress();
    if (options.persist !== false) saveState();
    if (options.scroll !== false) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completePhase(phaseId) {
    if (!completionPhases.includes(phaseId)) return;
    if (!state.completed.includes(phaseId)) state.completed.push(phaseId);
    saveState();
    updateProgress();
    showToast("Fase " + (phases.find(p => p.id === phaseId)?.label || phaseId) + " ditandai selesai.");
  }

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => renderPage(button.dataset.go));
  });

  document.querySelectorAll("[data-complete]").forEach(button => {
    button.addEventListener("click", () => completePhase(button.dataset.complete));
  });

  function bindAnswer(buttonId, fieldId, answerKey, feedbackId, successMessage) {
    const button = document.getElementById(buttonId);
    const field = document.getElementById(fieldId);
    const feedback = document.getElementById(feedbackId);
    field.value = state.answers[answerKey] || "";
    button.addEventListener("click", () => {
      state.answers[answerKey] = field.value.trim();
      saveState();
      feedback.textContent = successMessage;
      showToast("Catatan tersimpan.");
    });
  }

  bindAnswer("save-engage", "engage-answer", "engage", "engage-feedback", "Dugaan awal tersimpan. Kamu bisa melanjutkan eksplorasi.");
  bindAnswer("save-explore", "explore-note", "explore", "explore-feedback", "Catatan eksplorasi tersimpan.");
  bindAnswer("save-reflection", "reflection-answer", "reflection", "reflection-feedback", "Refleksi tersimpan.");

  renderPage(phases.some(phase => phase.id === state.currentPage) ? state.currentPage : "home", { persist: false, scroll: false });
})();
