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
    answers: { engage: "", explore: "", elaborate: "", reflection: "" },
    misconceptionAnswers: {},
    exploreVisited: [],
    simulationStep: 1,
    checkpointAnswer: "",
    quiz: { answers: {}, submitted: false, score: null },
    reflectionJournal: { learned: "", misconception: "", curious: "" }
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
        checkpointAnswer: ["attachment", "biosynthesis", "release"].includes(saved.checkpointAnswer) ? saved.checkpointAnswer : "",
        quiz: sanitizeQuiz(saved.quiz),
        reflectionJournal: sanitizeReflectionJournal(saved.reflectionJournal)
      };
    } catch (error) {
      console.warn("Progres lokal tidak dapat dibaca:", error);
      return { ...defaultState, completed: [], answers: { ...defaultState.answers }, misconceptionAnswers: {}, exploreVisited: [], simulationStep: 1, checkpointAnswer: "", quiz: { answers: {}, submitted: false, score: null }, reflectionJournal: { learned: "", misconception: "", curious: "" } };
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

  function sanitizeQuiz(value) {
    const result = { answers: {}, submitted: false, score: null };
    if (!value || typeof value !== "object") return result;
    const validIds = ["q1", "q2", "q3", "q4", "q5"];
    if (value.answers && typeof value.answers === "object") {
      validIds.forEach(id => {
        if (typeof value.answers[id] === "string" && ["a", "b", "c", "d"].includes(value.answers[id])) {
          result.answers[id] = value.answers[id];
        }
      });
    }
    result.submitted = value.submitted === true;
    result.score = Number.isFinite(value.score) ? Math.max(0, Math.min(100, value.score)) : null;
    return result;
  }

  function sanitizeReflectionJournal(value) {
    const result = { learned: "", misconception: "", curious: "" };
    if (!value || typeof value !== "object") return result;
    ["learned", "misconception", "curious"].forEach(key => {
      if (typeof value[key] === "string") result[key] = value[key];
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
    const previousPageId = state.currentPage;
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
    if (validId === "reflection" && previousPageId !== "reflection") launchConfetti();
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


  // EXPLAIN: revisit the student's saved Engage self-check without scoring.
  const explainQuestionData = {
    q1: {
      answerId: "explain-answer-q1",
      noteId: "explain-note-q1",
      correct: "salah",
      aligned: "Pilihan awalmu sudah sejalan dengan penjelasan ilmiah. Ingat, virus bersifat aseluler—bukan organisme bersel tunggal.",
      reconsider: "Tidak apa-apa jika awalnya kamu memilih jawaban berbeda. Banyak orang mengira virus adalah sel yang sangat kecil; kuncinya, virus tidak tersusun atas sel."
    },
    q2: {
      answerId: "explain-answer-q2",
      noteId: "explain-note-q2",
      correct: "salah",
      aligned: "Pilihan awalmu sudah sejalan dengan penjelasan ilmiah. Virus dan bakteri berbeda dari susunan dasar dan cara bereproduksinya.",
      reconsider: "Wajar jika virus dan bakteri tampak mirip karena keduanya dapat berkaitan dengan penyakit. Namun, bakteri adalah sel hidup, sedangkan virus merupakan partikel aseluler."
    },
    q3: {
      answerId: "explain-answer-q3",
      noteId: "explain-note-q3",
      correct: "salah",
      aligned: "Pilihan awalmu sudah sejalan dengan penjelasan ilmiah. Virus memerlukan sel inang yang sesuai untuk menghasilkan partikel baru.",
      reconsider: "Jika kamu sempat mengira virus bisa berkembang biak sendiri, itu kesempatan bagus untuk memperbaiki pemahaman. Virus perlu memanfaatkan mesin sel inang untuk membuat komponen virus baru."
    }
  };

  function renderEngageReview() {
    Object.entries(explainQuestionData).forEach(([questionId, data]) => {
      const answer = state.misconceptionAnswers[questionId];
      const answerEl = document.getElementById(data.answerId);
      const noteEl = document.getElementById(data.noteId);
      if (!answer) {
        answerEl.textContent = "Belum dijawab";
        answerEl.classList.add("is-unanswered");
        noteEl.textContent = "Kamu belum menyimpan jawaban untuk pernyataan ini pada fase Engage. Kamu tetap bisa mempelajari fakta ilmiahnya di atas.";
      } else {
        answerEl.textContent = answer === "benar" ? "Benar" : "Salah";
        answerEl.classList.remove("is-unanswered");
        noteEl.textContent = answer === data.correct ? data.aligned : data.reconsider;
      }
    });
  }

  document.getElementById("continue-elaborate").addEventListener("click", () => {
    completePhase("explain");
    renderPage("elaborate");
  });

  renderEngageReview();


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


  // ELABORATE: swipeable case cards and saved application response.
  const caseCarousel = document.getElementById("case-carousel");
  const caseCards = [...document.querySelectorAll(".case-card")];
  const caseDots = [...document.querySelectorAll("[data-case-index]")];
  const caseCarouselStatus = document.getElementById("case-carousel-status");
  const elaborateAnswer = document.getElementById("elaborate-answer");
  const elaborateFeedback = document.getElementById("elaborate-feedback");
  const elaborateCharCount = document.getElementById("elaborate-char-count");
  const continueEvaluateButton = document.getElementById("continue-evaluate");
  const caseNames = ["COVID-19", "Demam Berdarah Dengue", "HIV"];

  function updateCaseCarouselStatus() {
    let nearestIndex = 0;
    let smallestDistance = Infinity;
    const containerLeft = caseCarousel.getBoundingClientRect().left;
    caseCards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - containerLeft - 3);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    });
    caseCarouselStatus.textContent = "Kartu " + (nearestIndex + 1) + " dari 3 · " + caseNames[nearestIndex];
    caseDots.forEach((dot, index) => {
      const active = index === nearestIndex;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  caseCarousel.addEventListener("scroll", updateCaseCarouselStatus, { passive: true });
  caseDots.forEach(dot => {
    dot.addEventListener("click", () => {
      const card = caseCards[Number(dot.dataset.caseIndex)];
      if (card) caseCarousel.scrollTo({ left: card.offsetLeft - caseCarousel.offsetLeft, behavior: "smooth" });
    });
  });

  elaborateAnswer.value = state.answers.elaborate || "";
  function updateElaborateAnswerUI() {
    const length = elaborateAnswer.value.trim().length;
    elaborateCharCount.textContent = length + " karakter";
    continueEvaluateButton.disabled = length === 0;
  }
  elaborateAnswer.addEventListener("input", () => {
    state.answers.elaborate = elaborateAnswer.value;
    saveState();
    updateElaborateAnswerUI();
    elaborateFeedback.textContent = "";
  });

  continueEvaluateButton.addEventListener("click", () => {
    const response = elaborateAnswer.value.trim();
    if (!response) {
      elaborateFeedback.textContent = "Tulis jawaban singkat terlebih dahulu agar bisa melanjutkan.";
      elaborateAnswer.focus();
      return;
    }
    state.answers.elaborate = response;
    saveState();
    completePhase("elaborate");
    renderPage("evaluate");
  });

  updateCaseCarouselStatus();
  updateElaborateAnswerUI();


  
  // EVALUATE: 5-question formative quiz, one question per screen.
  const quizQuestions = [
    {
      id: "q1",
      prompt: "Bagian manakah yang membawa informasi genetik SARS-CoV-2?",
      options: [
        { value: "a", text: "Spike protein" },
        { value: "b", text: "RNA" },
        { value: "c", text: "Envelope lipid" },
        { value: "d", text: "Reseptor sel inang" }
      ],
      correct: "b",
      explanation: "SARS-CoV-2 membawa materi genetik berupa RNA. Spike membantu pengikatan ke sel target, sedangkan envelope merupakan selubung lipid."
    },
    {
      id: "q2",
      prompt: "Pada tahap Attachment (Pelekatan), apa yang terjadi?",
      options: [
        { value: "a", text: "Komponen virus baru dirakit" },
        { value: "b", text: "Virus dilepaskan dari sel inang" },
        { value: "c", text: "Virus mengenali dan menempel pada reseptor sel inang" },
        { value: "d", text: "Materi genetik virus disalin" }
      ],
      correct: "c",
      explanation: "Attachment adalah tahap pengenalan dan pelekatan virus pada reseptor sel inang yang sesuai, bukan tahap perakitan atau pelepasan."
    },
    {
      id: "q3",
      prompt: "Apa makna tahap Uncoating (Pelepasan selubung)?",
      options: [
        { value: "a", text: "Materi genetik virus dilepaskan dari selubung atau kapsidnya" },
        { value: "b", text: "Virus melekat pada reseptor sel" },
        { value: "c", text: "Virus baru keluar dari sel" },
        { value: "d", text: "Nyamuk memindahkan virus ke manusia" }
      ],
      correct: "a",
      explanation: "Uncoating membuka atau melepaskan pelindung genom sehingga materi genetik virus dapat digunakan pada tahap berikutnya."
    },
    {
      id: "q4",
      prompt: "Pada tahap Biosintesis/Replikasi, proses utama yang berlangsung adalah…",
      options: [
        { value: "a", text: "Virus hanya menempel pada permukaan sel" },
        { value: "b", text: "Sel inang langsung pecah sebelum komponen virus dibuat" },
        { value: "c", text: "Virus tidak berinteraksi dengan sel inang" },
        { value: "d", text: "Materi genetik disalin dan komponen virus diproduksi dengan bantuan sel inang" }
      ],
      correct: "d",
      explanation: "Pada biosintesis, virus menggunakan mesin sel inang untuk menyalin materi genetik dan menghasilkan komponen virus seperti protein."
    },
    {
      id: "q5",
      prompt: "Urutan manakah yang tepat untuk tiga tahap akhir pada model enam tahap yang dipelajari?",
      options: [
        { value: "a", text: "Entry → Attachment → Release" },
        { value: "b", text: "Uncoating → Attachment → Assembly" },
        { value: "c", text: "Biosintesis/Replikasi → Assembly → Release" },
        { value: "d", text: "Release → Biosintesis/Replikasi → Entry" }
      ],
      correct: "c",
      explanation: "Dalam model enam tahap ini, komponen virus dibuat pada tahap biosintesis, dirakit pada tahap assembly, lalu partikel baru dilepaskan pada tahap release."
    }
  ];

  const quizPlayPanel = document.getElementById("quiz-play-panel");
  const quizResultPanel = document.getElementById("quiz-result-panel");
  const quizQuestionCount = document.getElementById("quiz-question-count");
  const quizAnsweredCount = document.getElementById("quiz-answered-count");
  const quizProgressFill = document.getElementById("quiz-progress-fill");
  const quizQuestionNumber = document.getElementById("quiz-question-number");
  const quizQuestionText = document.getElementById("quiz-question-text");
  const quizOptions = document.getElementById("quiz-options");
  const quizFeedback = document.getElementById("quiz-feedback");
  const quizPreviousButton = document.getElementById("quiz-previous");
  const quizNextButton = document.getElementById("quiz-next");
  const quizRetryButton = document.getElementById("quiz-retry");
  const quizToReflectionButton = document.getElementById("quiz-to-reflection");
  let currentQuizIndex = 0;

  function countQuizAnswers() {
    return quizQuestions.filter(question => Boolean(state.quiz.answers[question.id])).length;
  }

  function renderQuizQuestion() {
    const question = quizQuestions[currentQuizIndex];
    const chosen = state.quiz.answers[question.id] || "";
    quizQuestionCount.textContent = "SOAL " + (currentQuizIndex + 1) + " DARI " + quizQuestions.length;
    quizAnsweredCount.textContent = countQuizAnswers() + "/" + quizQuestions.length + " dijawab";
    quizProgressFill.style.width = ((currentQuizIndex + 1) / quizQuestions.length * 100) + "%";
    quizQuestionNumber.textContent = "PERTANYAAN " + String(currentQuizIndex + 1).padStart(2, "0");
    quizQuestionText.textContent = question.prompt;
    quizOptions.replaceChildren();

    question.options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.setAttribute("aria-pressed", String(chosen === option.value));
      const letter = document.createElement("span");
      letter.className = "quiz-option__letter";
      letter.textContent = option.value.toUpperCase();
      const textNode = document.createElement("span");
      textNode.className = "quiz-option__text";
      textNode.textContent = option.text;
      button.append(letter, textNode);
      if (chosen === option.value) button.classList.add("is-selected");
      if (chosen && option.value === question.correct) button.classList.add("is-correct");
      if (chosen && chosen === option.value && chosen !== question.correct) button.classList.add("is-wrong");
      button.addEventListener("click", () => selectQuizAnswer(question, option.value));
      quizOptions.append(button);
    });

    quizFeedback.hidden = !chosen;
    quizFeedback.className = "quiz-feedback";
    if (chosen) {
      const isCorrect = chosen === question.correct;
      quizFeedback.classList.add(isCorrect ? "is-correct" : "is-wrong");
      const explanation = isCorrect
        ? "Tepat! " + question.explanation
        : "Belum tepat. " + question.explanation;
      quizFeedback.textContent = explanation;
    }

    quizPreviousButton.disabled = currentQuizIndex === 0;
    quizNextButton.disabled = !chosen;
    quizNextButton.innerHTML = currentQuizIndex === quizQuestions.length - 1
      ? "Lihat Skor Akhir <span aria-hidden=\"true\">→</span>"
      : "Selanjutnya <span aria-hidden=\"true\">→</span>";
  }

  function selectQuizAnswer(question, value) {
    if (state.quiz.submitted) return;
    state.quiz.answers[question.id] = value;
    saveState();
    renderQuizQuestion();
  }

  function calculateQuizScore() {
    return quizQuestions.reduce((score, question) => score + (state.quiz.answers[question.id] === question.correct ? 1 : 0), 0);
  }

  function submitQuiz() {
    if (countQuizAnswers() < quizQuestions.length) {
      showToast("Jawab semua soal terlebih dahulu.");
      return;
    }
    const correctCount = calculateQuizScore();
    state.quiz.submitted = true;
    state.quiz.score = Math.round(correctCount / quizQuestions.length * 100);
    saveState();
    completePhase("evaluate");
    renderQuizResults();
  }

  function renderQuizResults() {
    quizPlayPanel.hidden = true;
    quizResultPanel.hidden = false;
    const correctCount = calculateQuizScore();
    const score = Math.round(correctCount / quizQuestions.length * 100);
    document.getElementById("quiz-final-score").textContent = String(score);
    document.getElementById("quiz-correct-count").textContent = correctCount + " dari " + quizQuestions.length + " jawaban benar";
    document.getElementById("quiz-result-title").textContent = score === 100 ? "Sempurna! 🎉" : score >= 60 ? "Bagus, terus bertumbuh! 🌟" : "Terus berlatih, Penjelajah! 💪";
    document.getElementById("quiz-result-summary").textContent = score === 100
      ? "Kamu memahami konsep yang diujikan dengan sangat baik. Pertahankan rasa ingin tahumu!"
      : score >= 60
        ? "Kamu sudah memahami banyak konsep. Tinjau kembali umpan balik soal dan terus asah pemahamanmu."
        : "Hasil ini adalah potret belajar saat ini, bukan batas kemampuanmu. Baca kembali penjelasan dan coba lagi.";
    const review = document.getElementById("quiz-review");
    review.replaceChildren();
    quizQuestions.forEach((question, index) => {
      const chosen = state.quiz.answers[question.id];
      const optionChosen = question.options.find(option => option.value === chosen);
      const correctOption = question.options.find(option => option.value === question.correct);
      const correct = chosen === question.correct;
      const item = document.createElement("div");
      item.className = "quiz-review-item " + (correct ? "is-correct" : "is-wrong");
      const mark = document.createElement("span");
      mark.className = "quiz-review-mark";
      mark.textContent = correct ? "✓" : "!";
      const content = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = "Soal " + (index + 1) + ": " + (correct ? "Benar" : "Perlu ditinjau");
      const details = document.createElement("span");
      details.textContent = "Jawabanmu: " + (optionChosen ? optionChosen.text : "Tidak dijawab") + (correct ? "" : " · Jawaban tepat: " + correctOption.text);
      content.append(title, details);
      item.append(mark, content);
      review.append(item);
    });
  }

  quizNextButton.addEventListener("click", () => {
    if (!state.quiz.answers[quizQuestions[currentQuizIndex].id]) return;
    if (currentQuizIndex < quizQuestions.length - 1) {
      currentQuizIndex += 1;
      renderQuizQuestion();
    } else {
      submitQuiz();
    }
  });

  quizPreviousButton.addEventListener("click", () => {
    if (currentQuizIndex > 0) {
      currentQuizIndex -= 1;
      renderQuizQuestion();
    }
  });

  quizRetryButton.addEventListener("click", () => {
    state.quiz = { answers: {}, submitted: false, score: null };
    state.completed = state.completed.filter(id => id !== "evaluate");
    currentQuizIndex = 0;
    saveState();
    quizResultPanel.hidden = true;
    quizPlayPanel.hidden = false;
    renderQuizQuestion();
    showToast("Kuis diulang. Semangat mencoba lagi!");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  quizToReflectionButton.addEventListener("click", () => {
    if (!state.quiz.submitted) return;
    renderPage("reflection");
  });

  function restoreQuizUI() {
    if (state.quiz.submitted && countQuizAnswers() === quizQuestions.length) {
      renderQuizResults();
    } else {
      state.quiz.submitted = false;
      state.quiz.score = null;
      quizResultPanel.hidden = true;
      quizPlayPanel.hidden = false;
      const firstUnanswered = quizQuestions.findIndex(question => !state.quiz.answers[question.id]);
      currentQuizIndex = firstUnanswered < 0 ? quizQuestions.length - 1 : firstUnanswered;
      renderQuizQuestion();
    }
  }

  // REFLECTION: journal answers persist locally, and the badge celebrates completion.
  const journalFields = {
    learned: document.getElementById("reflection-learned"),
    misconception: document.getElementById("reflection-misconception"),
    curious: document.getElementById("reflection-curious")
  };
  const reflectionSaveStatus = document.getElementById("reflection-save-status");
  const reflectionSaveButton = document.getElementById("reflection-save-all");
  let journalSaveTimer;

  Object.entries(journalFields).forEach(([key, field]) => {
    field.value = state.reflectionJournal[key] || "";
    field.addEventListener("input", () => {
      state.reflectionJournal[key] = field.value;
      reflectionSaveStatus.textContent = "Menyimpan jurnal…";
      window.clearTimeout(journalSaveTimer);
      journalSaveTimer = window.setTimeout(() => {
        saveState();
        reflectionSaveStatus.textContent = "Tersimpan otomatis di perangkat ini.";
      }, 250);
    });
  });

  reflectionSaveButton.addEventListener("click", () => {
    Object.entries(journalFields).forEach(([key, field]) => {
      state.reflectionJournal[key] = field.value;
    });
    saveState();
    reflectionSaveStatus.textContent = "Jurnal refleksi berhasil disimpan. Terima kasih sudah meluangkan waktu untuk berpikir.";
    showToast("Jurnal refleksi tersimpan.");
  });

  function launchConfetti() {
    const layer = document.getElementById("confetti-layer");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    layer.replaceChildren();
    const palette = ["#8E44AD", "#C39BD3", "#F39C12", "#27AE60", "#2980B9", "#E74C3C", "#F7DC6F"];
    for (let i = 0; i < 58; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.setProperty("--left", (Math.random() * 100) + "%");
      piece.style.setProperty("--size", (5 + Math.random() * 7) + "px");
      piece.style.setProperty("--color", palette[i % palette.length]);
      piece.style.setProperty("--drift", ((Math.random() - 0.5) * 180) + "px");
      piece.style.setProperty("--spin", (360 + Math.random() * 900) + "deg");
      piece.style.setProperty("--duration", (2.1 + Math.random() * 1.6) + "s");
      piece.style.setProperty("--delay", (Math.random() * 0.65) + "s");
      layer.append(piece);
    }
    window.setTimeout(() => layer.replaceChildren(), 4300);
  }



  renderPage(phases.some(phase => phase.id === state.currentPage) ? state.currentPage : "home", { persist: false, scroll: false });
})();
