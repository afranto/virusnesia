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
    answers: { engage: "", explore: "", reflection: "" },
    misconceptionAnswers: {},
    exploreVisited: [],
    simulationStep: 1,
    checkpointAnswer: ""
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
        answers: { ...defaultState.answers, ...(saved.answers && typeof saved.answers === "object" ? saved.answers : {}) },
        misconceptionAnswers: sanitizeMisconceptions(saved.misconceptionAnswers),
        exploreVisited: Array.isArray(saved.exploreVisited) ? saved.exploreVisited.filter(id => ["rna", "capsid", "envelope", "spike"].includes(id)) : [],
        simulationStep: Number.isInteger(saved.simulationStep) ? Math.min(6, Math.max(1, saved.simulationStep)) : 1,
        checkpointAnswer: ["attachment", "biosynthesis", "release"].includes(saved.checkpointAnswer) ? saved.checkpointAnswer : ""
      };
    } catch (error) {
      console.warn("Progres lokal tidak dapat dibaca:", error);
      return { ...defaultState, completed: [], answers: { ...defaultState.answers }, misconceptionAnswers: {}, exploreVisited: [], simulationStep: 1, checkpointAnswer: "" };
    }
  }

  function sanitizeMisconceptions(value) {
    const result = {};
    if (!value || typeof value !== "object") return result;
    ["q1", "q2", "q3"].forEach(key => {
      if (value[key] === "benar" || value[key] === "salah") result[key] = value[key];
    });
    return result;
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

  const engageQuestionIds = ["q1", "q2", "q3"];
  const engageStatus = document.getElementById("engage-status");
  const continueExploreButton = document.getElementById("continue-explore");

  function updateEngageStatus() {
    engageQuestionIds.forEach(questionId => {
      const savedValue = state.misconceptionAnswers[questionId];
      document.querySelectorAll('input[name="' + questionId + '"]').forEach(input => {
        input.checked = input.value === savedValue;
      });
    });
    const answeredCount = engageQuestionIds.filter(id => Boolean(state.misconceptionAnswers[id])).length;
    const ready = answeredCount === engageQuestionIds.length;
    continueExploreButton.disabled = !ready;
    if (ready) {
      engageStatus.textContent = "Terima kasih. Jawaban awalmu tersimpan—belum ada skor atau penilaian. Ingat pilihanmu dan bandingkan kembali setelah mempelajari konsep pada fase Explain.";
      engageStatus.classList.add("is-ready");
    } else {
      engageStatus.textContent = "Kamu sudah menjawab " + answeredCount + " dari 3 pernyataan. Jawab semuanya untuk membuka fase berikutnya.";
      engageStatus.classList.remove("is-ready");
    }
  }

  engageQuestionIds.forEach(questionId => {
    document.querySelectorAll('input[name="' + questionId + '"]').forEach(input => {
      input.addEventListener("change", () => {
        state.misconceptionAnswers[questionId] = input.value;
        saveState();
        updateEngageStatus();
      });
    });
  });

  continueExploreButton.addEventListener("click", () => {
    const allAnswered = engageQuestionIds.every(id =>
      state.misconceptionAnswers[id] === "benar" || state.misconceptionAnswers[id] === "salah"
    );
    if (!allAnswered) {
      updateEngageStatus();
      return;
    }
    completePhase("engage");
    renderPage("explore");
  });

  updateEngageStatus();

  // EXPLORE: structural hotspots and a six-stage infection simulation.
  const hotspotInfo = {
    rna: {
      title: "Asam nukleat (RNA)",
      text: "SARS-CoV-2 membawa materi genetik berupa RNA. Informasi genetik ini digunakan sel inang untuk membuat komponen virus baru."
    },
    capsid: {
      title: "Kapsid",
      text: "Kapsid adalah selubung protein yang melindungi materi genetik virus. Pada SARS-CoV-2, protein nukleokapsid berikatan dengan RNA; ilustrasi ini menyederhanakan struktur bagian dalam virus."
    },
    envelope: {
      title: "Envelope (selubung)",
      text: "Envelope adalah membran lipid yang menyelubungi partikel SARS-CoV-2. Selubung ini berasal dari membran sel inang dan menjadi tempat tertanamnya beberapa protein virus."
    },
    spike: {
      title: "Spike protein",
      text: "Protein spike berada di permukaan SARS-CoV-2 dan membantu virus mengenali serta berikatan dengan reseptor pada sel inang."
    }
  };

  const hotspotTitle = document.getElementById("hotspot-info-title");
  const hotspotText = document.getElementById("hotspot-info-text");
  const hotspotCount = document.getElementById("hotspot-count");
  const hotspotProgressFill = document.getElementById("hotspot-progress-fill");
  const hotspotStatus = document.getElementById("hotspot-status");
  const continueReplicationButton = document.getElementById("continue-replication");
  const replicationTab = document.getElementById("tab-replication");
  const exploreTabs = [...document.querySelectorAll("[data-explore-tab]")];
  const structurePanel = document.getElementById("explore-structure-panel");
  const replicationPanel = document.getElementById("explore-replication-panel");

  function updateHotspotProgress() {
    const visited = new Set(state.exploreVisited);
    const count = visited.size;
    hotspotCount.textContent = count + " dari 4 bagian";
    hotspotProgressFill.style.width = (count / 4 * 100) + "%";
    continueReplicationButton.disabled = count !== 4;
    replicationTab.disabled = count !== 4;
    document.querySelectorAll("[data-hotspot]").forEach(button => {
      const isVisited = visited.has(button.dataset.hotspot);
      button.classList.toggle("is-visited", isVisited);
      if (button.classList.contains("hotspot")) {
        button.setAttribute("aria-pressed", String(isVisited && button.dataset.hotspot === state.lastHotspot));
      }
    });
    document.querySelectorAll(".hotspot-chip").forEach(button => {
      button.classList.toggle("is-visited", visited.has(button.dataset.hotspot));
    });
    hotspotStatus.textContent = count === 4
      ? "Hebat! Keempat bagian sudah kamu jelajahi. Simulasi replikasi kini terbuka."
      : "Kunjungi " + (4 - count) + " hotspot lagi untuk membuka simulasi replikasi.";
  }

  function showHotspot(id) {
    const info = hotspotInfo[id];
    if (!info) return;
    state.lastHotspot = id;
    if (!state.exploreVisited.includes(id)) state.exploreVisited.push(id);
    hotspotTitle.textContent = info.title;
    hotspotText.textContent = info.text;
    document.querySelector(".hotspot-info__label").textContent = "BAGIAN VIRUS";
    saveState();
    updateHotspotProgress();
  }

  document.querySelectorAll("[data-hotspot]").forEach(button => {
    button.addEventListener("click", () => showHotspot(button.dataset.hotspot));
  });

  function showExploreTab(tabName) {
    const isStructure = tabName === "structure";
    exploreTabs.forEach(tab => {
      const active = tab.dataset.exploreTab === tabName;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    structurePanel.hidden = !isStructure;
    replicationPanel.hidden = isStructure;
    if (!isStructure) renderSimulationStep(state.simulationStep);
  }

  exploreTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      if (tab.disabled) return;
      showExploreTab(tab.dataset.exploreTab);
    });
  });

  continueReplicationButton.addEventListener("click", () => {
    if (state.exploreVisited.length !== 4) return;
    state.simulationStep = 1;
    saveState();
    showExploreTab("replication");
    renderSimulationStep(1);
    replicationPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const simulationStages = [
    {
      short: "Attachment", title: "Attachment (Pelekatan)",
      description: "Virus mengenali dan menempel pada reseptor tertentu di permukaan sel inang. Kecocokan antara protein virus dan reseptor membantu menentukan sel yang dapat diinfeksi.",
      caption: "Virus mendekati reseptor sel inang."
    },
    {
      short: "Entry", title: "Entry (Penetrasi)",
      description: "Setelah melekat, virus atau materi genetiknya masuk ke dalam sel inang. Cara masuknya dapat berbeda-beda, bergantung pada jenis virus.",
      caption: "Virus atau genomnya memasuki sel."
    },
    {
      short: "Uncoating", title: "Uncoating (Pelepasan selubung)",
      description: "Selubung atau kapsid dibuka sehingga materi genetik virus dapat tersedia di dalam sel untuk tahap berikutnya.",
      caption: "Materi genetik dilepaskan dari selubungnya."
    },
    {
      short: "Biosintesis", title: "Biosintesis/Replikasi",
      description: "Materi genetik virus disalin dan sel inang digunakan untuk menghasilkan komponen virus, seperti asam nukleat dan protein virus.",
      caption: "Sel inang membantu membuat komponen virus."
    },
    {
      short: "Assembly", title: "Assembly (Perakitan)",
      description: "Komponen-komponen virus yang telah dibuat dirakit menjadi partikel virus baru. Partikel yang terbentuk kemudian dapat melanjutkan proses infeksi.",
      caption: "Komponen virus dirakit menjadi virion baru."
    },
    {
      short: "Release", title: "Release (Pelepasan)",
      description: "Partikel virus baru keluar dari sel inang. Pelepasan dapat terjadi melalui mekanisme berbeda, termasuk budding pada virus berselubung seperti SARS-CoV-2.",
      caption: "Partikel virus baru keluar dari sel."
    }
  ];

  const stageVisual = document.getElementById("stage-visual");
  const stageStepCount = document.getElementById("simulation-step-count");
  const stageShort = document.getElementById("simulation-stage-short");
  const simulationTrackFill = document.getElementById("simulation-track-fill");
  const stageStepLabel = document.getElementById("stage-step-label");
  const stageTitle = document.getElementById("stage-title");
  const stageDescription = document.getElementById("stage-description");
  const visualCaption = document.getElementById("visual-caption");
  const previousStageButton = document.getElementById("stage-previous");
  const repeatStageButton = document.getElementById("stage-repeat");
  const nextStageButton = document.getElementById("stage-next");
  const checkpoint = document.getElementById("replication-checkpoint");
  const checkpointFeedback = document.getElementById("checkpoint-feedback");
  const continueExplainButton = document.getElementById("continue-explain");

  function renderSimulationStep(step) {
    const safeStep = Math.min(6, Math.max(1, step));
    state.simulationStep = safeStep;
    const data = simulationStages[safeStep - 1];
    stageStepCount.textContent = "TAHAP " + safeStep + " DARI 6";
    stageShort.textContent = data.short;
    simulationTrackFill.style.width = (safeStep / 6 * 100) + "%";
    stageStepLabel.textContent = "TAHAP " + safeStep;
    stageTitle.textContent = data.title;
    stageDescription.textContent = data.description;
    visualCaption.textContent = data.caption;
    stageVisual.className = "stage-visual stage-visual--" + safeStep;
    stageVisual.setAttribute("aria-label", "Visualisasi tahap " + safeStep + ": " + data.title);
    previousStageButton.disabled = safeStep === 1;
    nextStageButton.disabled = false;
    nextStageButton.textContent = safeStep === 6 ? "Selesaikan simulasi ✓" : "Selanjutnya →";
    checkpoint.hidden = safeStep !== 6 || !state.simulationFinished;
    if (safeStep !== 6) {
      state.simulationFinished = false;
      checkpoint.hidden = true;
    }
    saveState();
  }

  previousStageButton.addEventListener("click", () => {
    if (state.simulationStep > 1) renderSimulationStep(state.simulationStep - 1);
  });

  repeatStageButton.addEventListener("click", () => {
    renderSimulationStep(state.simulationStep);
    showToast("Tahap diulangi: " + simulationStages[state.simulationStep - 1].title);
  });

  nextStageButton.addEventListener("click", () => {
    if (state.simulationStep < 6) {
      renderSimulationStep(state.simulationStep + 1);
      return;
    }
    state.simulationFinished = true;
    checkpoint.hidden = false;
    nextStageButton.disabled = true;
    nextStageButton.textContent = "Simulasi selesai ✓";
    saveState();
    checkpoint.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  document.querySelectorAll('input[name="checkpoint-answer"]').forEach(input => {
    input.addEventListener("change", () => {
      state.checkpointAnswer = input.value;
      saveState();
      const correct = input.value === "biosynthesis";
      checkpointFeedback.textContent = correct
        ? "Tepat! Biosintesis/Replikasi adalah tahap ketika materi genetik disalin dan komponen virus diproduksi."
        : "Belum tepat. Coba ingat tahap yang berfokus pada penyalinan materi genetik dan pembuatan komponen virus.";
      checkpointFeedback.classList.toggle("is-correct", correct);
      checkpointFeedback.classList.toggle("is-incorrect", !correct);
      continueExplainButton.disabled = !correct;
    });
  });

  continueExplainButton.addEventListener("click", () => {
    if (state.checkpointAnswer !== "biosynthesis" || !state.simulationFinished) return;
    completePhase("explore");
    renderPage("explain");
  });

  function restoreCheckpoint() {
    if (state.checkpointAnswer) {
      const input = document.querySelector('input[name="checkpoint-answer"][value="' + state.checkpointAnswer + '"]');
      if (input) {
        input.checked = true;
        const correct = state.checkpointAnswer === "biosynthesis";
        checkpointFeedback.textContent = correct
          ? "Tepat! Biosintesis/Replikasi adalah tahap ketika materi genetik disalin dan komponen virus diproduksi."
          : "Belum tepat. Coba ingat tahap yang berfokus pada penyalinan materi genetik dan pembuatan komponen virus.";
        checkpointFeedback.classList.toggle("is-correct", correct);
        checkpointFeedback.classList.toggle("is-incorrect", !correct);
        continueExplainButton.disabled = !correct;
      }
    }
    nextStageButton.disabled = state.simulationStep === 6 && Boolean(state.simulationFinished);
    if (state.simulationFinished) {
      checkpoint.hidden = false;
      nextStageButton.textContent = "Simulasi selesai ✓";
    }
  }

  updateHotspotProgress();
  renderSimulationStep(state.simulationStep);
  restoreCheckpoint();

  function bindAnswer(buttonId, fieldId, answerKey, feedbackId, successMessage) {
    const button = document.getElementById(buttonId);
    const field = document.getElementById(fieldId);
    const feedback = document.getElementById(feedbackId);
    field.value = state.answers[answerKey] || "";
    button.addEventListener("click", () => {
      state.answers[answerKey] = field.value.trim();
      saveState();
      feedback.textContent = successMessage;
      if (state.answers[answerKey]) completePhase(answerKey);
      showToast("Catatan tersimpan.");
    });
  }

  bindAnswer("save-reflection", "reflection-answer", "reflection", "reflection-feedback", "Refleksi tersimpan.");

  renderPage(phases.some(phase => phase.id === state.currentPage) ? state.currentPage : "home", { persist: false, scroll: false });
})();
