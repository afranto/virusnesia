
// Global Navigation Controller
let currentSection = 'landing';
const unlockedBadges = {
  badge1: false,
  badge2: false,
  badge3: false,
  badge4: false
};

function navigateTo(sectionId) {
  document.querySelectorAll('.spa-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById('section-' + sectionId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentSection = sectionId;
    updateHeaderNav();
  }
}

function updateHeaderNav() {
  document.querySelectorAll('.pip-step').forEach(btn => btn.classList.remove('active'));
  const currentBtn = document.getElementById('pip-' + currentSection);
  if (currentBtn) {
    currentBtn.classList.add('active');
  } else if (currentSection === 'landing') {
    const landingBtn = document.getElementById('pip-landing');
    if (landingBtn) landingBtn.classList.add('active');
  }
}

function unlockBadge(badgeNum) {
  unlockedBadges['badge' + badgeNum] = true;
  const el = document.getElementById('badge-icon-' + badgeNum);
  if (el) el.classList.add('unlocked');
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) drawer.classList.toggle('open');
}

function scrollToElement(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// 10 VIRUSES DATASET (Strictly adhering to specifications)


// CURRENT STATE
let currentVirusIndex = 0;
let quiz1CurrentIndex = 0;
let quiz1Answers = {};
let miniGameTargetIndex = 0;
let miniGameClueStep = 1;
let miniGameScore = 0;

// INIT FUNCTION
document.addEventListener("DOMContentLoaded", () => {
  initVirusSidebar();
  renderCurrentVirus();
  initMiniGame();
  renderQuiz1Question();
});

function initVirusSidebar() {
  const container = document.getElementById("virusSidebarList");
  container.innerHTML = "";
  VIRUSES_DATA.forEach((v, idx) => {
    const btn = document.createElement("button");
    btn.className = `virus-nav-btn ${idx === 0 ? 'active' : ''}`;
    btn.style.setProperty("--nav-accent", v.accentColor);
    btn.onclick = () => selectVirus(idx);
    btn.innerHTML = `
      <div class="virus-nav-info">
        <span class="virus-nav-icon" style="background: ${v.accentColor};"></span>
        <div>
          <div style="font-weight: 600; color: #fff;">${v.name}</div>
          <div class="virus-nav-tag">${v.tag}</div>
        </div>
      </div>
      <span style="font-size: 0.7rem; color: var(--text-dim);">${v.size.split(' ')[0]}</span>
    `;
    container.appendChild(btn);
  });
}

function selectVirus(idx) {
  currentVirusIndex = idx;
  document.querySelectorAll(".virus-nav-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === idx);
  });
  renderCurrentVirus();
}

function renderCurrentVirus() {
  const v = VIRUSES_DATA[currentVirusIndex];

  // Header info
  document.getElementById("v-badge-dot").style.backgroundColor = v.accentColor;
  document.getElementById("v-title").innerText = v.name;
  document.getElementById("v-subtitle").innerText = v.subtitle;
  document.getElementById("v-envelope-badge").innerText = v.envelope === "Ya" ? "Beramplop Lipid" : "Non-Amplop";
  document.getElementById("v-genome-badge").innerText = v.genome.split(' ')[0];

  // Panel A: SVG Exterior
  renderPanelA(v);

  // Panel B: SVG Cross Section
  renderPanelB(v);

  // Tab 1: Struktur
  document.getElementById("spec-amplop").innerText = v.envelope === "Ya" ? "Ya (Bilayer lipid)" : "Tidak (Non-amplop)";
  document.getElementById("spec-kapsid").innerText = v.capsid;
  document.getElementById("spec-genom").innerText = v.genome;
  document.getElementById("spec-ukuran").innerText = v.size;

  const protContainer = document.getElementById("protein-list-container");
  protContainer.innerHTML = v.proteins.map(p => `
    <div style="background: #090e17; border-left: 3px solid ${v.accentColor}; padding: 0.65rem 0.85rem; border-radius: 0 0.4rem 0.4rem 0;">
      <strong style="color: #fff; font-size: 0.85rem;">${p.name}:</strong>
      <span style="color: #cbd5e1; font-size: 0.825rem; margin-left: 0.35rem;">${p.desc}</span>
    </div>
  `).join('');

  // Tab 2: Genom (Panel C)
  renderPanelC(v);

  // Tab 3: Patogenesis & Kotak Konteks Indonesia
  const patoContainer = document.getElementById("patogenesis-steps");
  patoContainer.innerHTML = v.pathogenesis.map((step, idx) => `
    <div style="display: flex; gap: 0.75rem; align-items: flex-start; background: #090e17; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border-subtle);">
      <div style="background: #1e293b; color: #38bdf8; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">
        ${idx + 1}
      </div>
      <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.5;">${step}</p>
    </div>
  `).join('');
  document.getElementById("indo-context-text").innerText = v.indoContext;

  // Tab 4: Replikasi & Simpulan LKM
  document.getElementById("replikasi-siklus-badge").innerText = "Siklus " + v.replicationCycle;
  document.getElementById("replikasi-inang").innerText = v.host;
  const repliContainer = document.getElementById("replikasi-steps");
  repliContainer.innerHTML = v.replicationSteps.map((step, idx) => `
    <div style="display: flex; gap: 0.75rem; align-items: flex-start; background: #090e17; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border-subtle);">
      <div style="background: ${v.accentColor}; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">
        ${idx + 1}
      </div>
      <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.5;">${step}</p>
    </div>
  `).join('');
  document.getElementById("lkm-summary-text").innerText = `"${v.lkmSummary}"`;

  // Tab 5: Size chart
  renderSizeChart(v.id);
}

// SCIENTIFIC SVG RENDERERS (PANEL A & B)
function renderPanelA(v) {
  const container = document.getElementById("panelA-viewport");
  let svgContent = "";

  if (v.id === "dengue") {
    // Smooth exterior with 90 tangential dimers forming herringbone pattern
    svgContent = `
      <svg width="220" height="220" viewBox="0 0 200 200" class="svg-rotator">
        <circle cx="100" cy="100" r="75" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
        <!-- Herringbone tangential dimers -->
        <g stroke="#f87171" stroke-width="3" stroke-linecap="round" opacity="0.9">
          <line x1="80" y1="50" x2="100" y2="40"/><line x1="100" y1="40" x2="120" y2="50"/>
          <line x1="80" y1="65" x2="100" y2="55"/><line x1="100" y1="55" x2="120" y2="65"/>
          <line x1="55" y1="80" x2="70" y2="100"/><line x1="70" y1="100" x2="55" y2="120"/>
          <line x1="70" y1="80" x2="85" y2="100"/><line x1="85" y1="100" x2="70" y2="120"/>
          <line x1="145" y1="80" x2="130" y2="100"/><line x1="130" y1="100" x2="145" y2="120"/>
          <line x1="130" y1="80" x2="115" y2="100"/><line x1="115" y1="100" x2="130" y2="120"/>
          <line x1="80" y1="135" x2="100" y2="145"/><line x1="100" y1="145" x2="120" y2="135"/>
          <line x1="80" y1="150" x2="100" y2="160"/><line x1="100" y1="160" x2="120" y2="150"/>
          <circle cx="100" cy="100" r="16" fill="#b91c1c" stroke="#fca5a5" stroke-dasharray="4 2"/>
        </g>
      </svg>
    `;
  } else if (v.id === "influenza") {
    // HA trimers (~4) and NA tetramers mushroom (~1)
    svgContent = `
      <svg width="220" height="220" viewBox="0 0 200 200" class="svg-rotator">
        <circle cx="100" cy="100" r="60" fill="#4c1d95" stroke="#6d28d9" stroke-width="2"/>
        <!-- HA Rod spikes (light purple) -->
        ${generateRadialSpikes(100, 100, 60, 20, 18, "#c084fc", "rod")}
        <!-- NA Mushroom spikes (dark purple) -->
        ${generateRadialSpikes(100, 100, 60, 24, 6, "#581c87", "mushroom")}
      </svg>
    `;
  } else if (v.id === "sarscov2") {
    // S protein trimers prominent ~20nm
    svgContent = `
      <svg width="220" height="220" viewBox="0 0 200 200" class="svg-rotator">
        <circle cx="100" cy="100" r="55" fill="#0f172a" stroke="#0284c7" stroke-width="3"/>
        <!-- Corona Spike trimers -->
        ${generateRadialSpikes(100, 100, 55, 30, 24, "#38bdf8", "coronaSpike")}
      </svg>
    `;
  } else if (v.id === "hiv") {
    // gp120/gp41 spikes
    svgContent = `
      <svg width="220" height="220" viewBox="0 0 200 200" class="svg-rotator">
        <circle cx="100" cy="100" r="65" fill="#78350f" stroke="#b45309" stroke-width="2"/>
        ${generateRadialSpikes(100, 100, 65, 18, 16, "#fbbf24", "hivSpike")}
      </svg>
    `;
  } else if (v.id === "t4") {
    // Complex morphology
    svgContent = `
      <svg width="220" height="240" viewBox="0 0 200 240">
        <!-- Elongated Icosahedral Head -->
        <polygon points="100,15 135,35 135,75 100,95 65,75 65,35" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
        <polygon points="100,15 100,95 65,75 65,35" fill="#166534" opacity="0.6"/>
        <!-- Collar / Neck -->
        <rect x="94" y="95" width="12" height="6" fill="#86efac"/>
        <!-- Contractile Sheath -->
        <rect x="92" y="101" width="16" height="65" fill="#16a34a" stroke="#22c55e" stroke-width="1.5"/>
        <g stroke="#86efac" stroke-width="1.5">
          <line x1="92" y1="110" x2="108" y2="110"/><line x1="92" y1="120" x2="108" y2="120"/>
          <line x1="92" y1="130" x2="108" y2="130"/><line x1="92" y1="140" x2="108" y2="140"/>
          <line x1="92" y1="150" x2="108" y2="150"/><line x1="92" y1="160" x2="108" y2="160"/>
        </g>
        <!-- Hexagonal Baseplate -->
        <polygon points="100,166 118,172 118,176 100,180 82,176 82,172" fill="#14532d" stroke="#86efac" stroke-width="1.5"/>
        <!-- Long tail fibers (6) -->
        <path d="M82,174 L50,195 L30,225" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M86,176 L65,200 L55,230" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M96,178 L85,210 L80,235" stroke="#16a34a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M104,178 L115,210 L120,235" stroke="#16a34a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M114,176 L135,200 L145,230" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M118,174 L150,195 L170,225" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>
    `;
  } else if (v.id === "rabies") {
    // Bullet shaped with ~400 G spikes
    svgContent = `
      <svg width="220" height="240" viewBox="0 0 200 240" style="transform: rotate(-10deg);">
        <!-- Bullet body -->
        <path d="M60,180 L60,80 C60,40 140,40 140,80 L140,180 Z" fill="#9a3412" stroke="#ea580c" stroke-width="2.5"/>
        <!-- G Trimer knobs on surface -->
        <g stroke="#fdba74" stroke-width="2">
          <circle cx="100" cy="22" r="3" fill="#ffedd5"/><line x1="100" y1="25" x2="100" y2="40"/>
          <circle cx="75" cy="32" r="3" fill="#ffedd5"/><line x1="75" y1="35" x2="82" y2="48"/>
          <circle cx="125" cy="32" r="3" fill="#ffedd5"/><line x1="125" y1="35" x2="118" y2="48"/>
          <circle cx="50" cy="70" r="3" fill="#ffedd5"/><line x1="50" y1="70" x2="60" y2="70"/>
          <circle cx="50" cy="110" r="3" fill="#ffedd5"/><line x1="50" y1="110" x2="60" y2="110"/>
          <circle cx="50" cy="150" r="3" fill="#ffedd5"/><line x1="50" y1="150" x2="60" y2="150"/>
          <circle cx="150" cy="70" r="3" fill="#ffedd5"/><line x1="150" y1="70" x2="140" y2="70"/>
          <circle cx="150" cy="110" r="3" fill="#ffedd5"/><line x1="150" y1="110" x2="140" y2="110"/>
          <circle cx="150" cy="150" r="3" fill="#ffedd5"/><line x1="150" y1="150" x2="140" y2="150"/>
        </g>
      </svg>
    `;
  } else if (v.id === "hpv") {
    // T=7d precise lattice 72 pentamers
    svgContent = `
      <svg width="220" height="220" viewBox="0 0 200 200" class="svg-rotator">
        <circle cx="100" cy="100" r="75" fill="#064e3b" stroke="#059669" stroke-width="2"/>
        <!-- T=7d geometric pentamer pattern -->
        <g fill="#34d399" stroke="#065f46" stroke-width="1.5">
          ${generateT7dLattice(100, 100, 68)}
        </g>
      </svg>
    `;
  } else if (v.id === "tmv") {
    // Vertical rod 300x18 nm with helical grooves and 4 nm central canal
    svgContent = `
      <svg width="120" height="260" viewBox="0 0 100 260">
        <!-- Cylindrical Rod Body -->
        <rect x="30" y="20" width="40" height="220" rx="4" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
        <!-- Central Canal (4 nm scale) -->
        <line x1="50" y1="20" x2="50" y2="240" stroke="#082f49" stroke-width="7"/>
        <!-- Helical ellipses lines -->
        <g stroke="#7dd3fc" stroke-width="1.5" opacity="0.8">
          ${[...Array(14)].map((_, i) => `<ellipse cx="50" cy="${35 + i * 15}" rx="19" ry="4" fill="none"/>`).join('')}
        </g>
      </svg>
    `;
  } else if (v.id === "adeno") {
    // Icosahedral + 12 long fibers with knob domain
    svgContent = `
      <svg width="230" height="230" viewBox="0 0 220 220" class="svg-rotator">
        <!-- Icosahedral Body -->
        <polygon points="110,40 165,70 165,150 110,180 55,150 55,70" fill="#831843" stroke="#f472b6" stroke-width="3"/>
        <polygon points="110,40 165,70 110,180" fill="#9d174d" opacity="0.6"/>
        <polygon points="110,40 55,70 110,180" fill="#701a75" opacity="0.4"/>
        <!-- Long Fibers (~37 nm) with Knob -->
        <g stroke="#fbcfe8" stroke-width="2">
          <line x1="110" y1="40" x2="110" y2="10"/><circle cx="110" cy="8" r="4.5" fill="#f472b6"/>
          <line x1="165" y1="70" x2="195" y2="50"/><circle cx="197" cy="48" r="4.5" fill="#f472b6"/>
          <line x1="165" y1="150" x2="195" y2="170"/><circle cx="197" cy="172" r="4.5" fill="#f472b6"/>
          <line x1="110" y1="180" x2="110" y2="210"/><circle cx="110" cy="212" r="4.5" fill="#f472b6"/>
          <line x1="55" y1="150" x2="25" y2="170"/><circle cx="23" cy="172" r="4.5" fill="#f472b6"/>
          <line x1="55" y1="70" x2="25" y2="50"/><circle cx="23" cy="48" r="4.5" fill="#f472b6"/>
        </g>
      </svg>
    `;
  } else if (v.id === "zika") {
    // Similar to Dengue smooth, but Domain III exposed
    svgContent = `
      <svg width="220" height="220" viewBox="0 0 200 200" class="svg-rotator">
        <circle cx="100" cy="100" r="75" fill="#881337" stroke="#9f1239" stroke-width="2"/>
        <!-- Domain III exposed dots -->
        <g stroke="#fda4af" stroke-width="3" stroke-linecap="round">
          <line x1="80" y1="50" x2="100" y2="40"/><circle cx="100" cy="40" r="3.5" fill="#ffe4e6"/>
          <line x1="100" y1="40" x2="120" y2="50"/>
          <line x1="55" y1="80" x2="70" y2="100"/><circle cx="70" cy="100" r="3.5" fill="#ffe4e6"/>
          <line x1="70" y1="100" x2="55" y2="120"/>
          <line x1="145" y1="80" x2="130" y2="100"/><circle cx="130" cy="100" r="3.5" fill="#ffe4e6"/>
          <line x1="130" y1="100" x2="145" y2="120"/>
          <line x1="80" y1="150" x2="100" y2="160"/><circle cx="100" cy="160" r="3.5" fill="#ffe4e6"/>
          <line x1="100" y1="160" x2="120" y2="150"/>
        </g>
      </svg>
    `;
  }

  container.innerHTML = svgContent;
}

function renderPanelB(v) {
  const container = document.getElementById("panelB-viewport");
  let svgContent = "";

  if (v.id === "dengue") {
    svgContent = `
      <svg width="290" height="260" viewBox="0 0 320 280">
        <!-- E protein tangensial (merah) -->
        <circle cx="140" cy="140" r="100" fill="#b91c1c" stroke="#ef4444" stroke-width="3"/>
        <!-- prM/M protein (merah muda) -->
        <circle cx="140" cy="140" r="92" fill="#f87171" stroke="#fca5a5" stroke-width="2"/>
        <!-- Lipid Bilayer (oranye tipis) -->
        <circle cx="140" cy="140" r="82" fill="#78350f" stroke="#f97316" stroke-width="3"/>
        <!-- Capsid / C protein (oranye) -->
        <circle cx="140" cy="140" r="70" fill="#ea580c" stroke="#fdba74" stroke-width="2"/>
        <!-- +ssRNA genome coiled kuning -->
        <circle cx="140" cy="140" r="50" fill="#1e293b"/>
        <path d="M115,140 Q130,110 150,140 T165,140 T135,160 T145,120 T125,140" fill="none" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>

        <!-- Leader lines and labels -->
        <g stroke="#94a3b8" stroke-width="1.2">
          <line x1="140" y1="40" x2="220" y2="25"/><circle cx="220" cy="25" r="2" fill="#38bdf8"/>
          <line x1="210" y1="75" x2="245" y2="65"/><circle cx="245" cy="65" r="2" fill="#38bdf8"/>
          <line x1="205" y1="110" x2="245" y2="105"/><circle cx="245" cy="105" r="2" fill="#38bdf8"/>
          <line x1="190" y1="170" x2="240" y2="185"/><circle cx="240" cy="185" r="2" fill="#38bdf8"/>
          <line x1="150" y1="140" x2="235" y2="225"/><circle cx="235" cy="225" r="2" fill="#38bdf8"/>
        </g>
        <text x="225" y="24" fill="#fff" font-size="9" font-weight="700">PROTEIN E (TANGENSIAL)</text>
        <text x="225" y="34" fill="#94a3b8" font-size="7.5">Dimer herringbone datar</text>

        <text x="250" y="64" fill="#fff" font-size="9" font-weight="700">PROTEIN prM/M</text>
        <text x="250" y="74" fill="#94a3b8" font-size="7.5">Proteksi translasi asam</text>

        <text x="250" y="104" fill="#fff" font-size="9" font-weight="700">LIPID BILAYER</text>
        <text x="250" y="114" fill="#94a3b8" font-size="7.5">Membran inang turunan RE</text>

        <text x="245" y="184" fill="#fff" font-size="9" font-weight="700">KAPSID (PROTEIN C)</text>
        <text x="245" y="194" fill="#94a3b8" font-size="7.5">Cangkang pelindung dalam</text>

        <text x="240" y="224" fill="#fff" font-size="9" font-weight="700">+ssRNA GENOM</text>
        <text x="240" y="234" fill="#94a3b8" font-size="7.5">10,7 kb asam nukleat</text>

        <!-- Scale bar (50 nm diameter) -->
        <g class="scale-bar-svg" transform="translate(15, 250)">
          <rect x="0" y="0" width="85" height="18" fill="rgba(0,0,0,0.8)" rx="3" stroke="#334155"/>
          <line x1="8" y1="9" x2="55" y2="9" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="60" y="12" fill="#f8fafc" font-size="8" font-family="monospace">50 nm</text>
        </g>
      </svg>
    `;
  } else if (v.id === "influenza") {
    svgContent = `
      <svg width="290" height="260" viewBox="0 0 320 280">
        <!-- Spikes + Membrane + M1 + 8 RNP in 7+1 pattern -->
        <circle cx="130" cy="140" r="80" fill="#2e1065" stroke="#7c3aed" stroke-width="2"/>
        <circle cx="130" cy="140" r="74" fill="#4c1d95" stroke="#a78bfa" stroke-width="4"/>
        <!-- M1 matrix layer -->
        <circle cx="130" cy="140" r="68" fill="#1e1b4b" stroke="#581c87" stroke-width="3"/>
        <!-- 8 RNP segments in 7+1 pattern -->
        <!-- 1 Center -->
        <circle cx="130" cy="140" r="8" fill="#3b82f6" stroke="#93c5fd" stroke-width="2"/>
        <!-- 7 Surrounding -->
        ${[...Array(7)].map((_, i) => {
          const a = (i * 2 * Math.PI) / 7;
          return `<circle cx="${130 + 36 * Math.cos(a)}" cy="${140 + 36 * Math.sin(a)}" r="7" fill="#60a5fa" stroke="#dbeafe" stroke-width="1.5"/>`;
        }).join('')}

        <!-- Spikes extending out -->
        <line x1="130" y1="60" x2="130" y2="40" stroke="#c084fc" stroke-width="4"/>
        <circle cx="130" cy="38" r="3" fill="#c084fc"/>
        <line x1="60" y1="140" x2="42" y2="140" stroke="#581c87" stroke-width="3"/>

        <!-- Leader lines -->
        <line x1="130" y1="40" x2="210" y2="35" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="130" y1="68" x2="210" y2="75" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="130" y1="140" x2="210" y2="135" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="155" y1="165" x2="210" y2="190" stroke="#94a3b8" stroke-width="1.2"/>

        <text x="215" y="34" fill="#fff" font-size="9" font-weight="700">HA & NA SPIKES</text>
        <text x="215" y="44" fill="#94a3b8" font-size="7.5">HA menonjol ~14 nm</text>

        <text x="215" y="74" fill="#fff" font-size="9" font-weight="700">M1 MATRIX LAYER</text>
        <text x="215" y="84" fill="#94a3b8" font-size="7.5">Tepat di bawah amplop lipid</text>

        <text x="215" y="134" fill="#fff" font-size="9" font-weight="700">8 RNP (POLA 7+1)</text>
        <text x="215" y="144" fill="#94a3b8" font-size="7.5">7 mengelilingi 1 segmen pusat</text>

        <text x="215" y="190" fill="#fff" font-size="9" font-weight="700">M2 ION CHANNEL</text>
        <text x="215" y="200" fill="#94a3b8" font-size="7.5">Kanal proton uncoating</text>

        <!-- Scale bar (100 nm) -->
        <g class="scale-bar-svg" transform="translate(15, 250)">
          <rect x="0" y="0" width="90" height="18" fill="rgba(0,0,0,0.8)" rx="3" stroke="#334155"/>
          <line x1="8" y1="9" x2="62" y2="9" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="68" y="12" fill="#f8fafc" font-size="8" font-family="monospace">100 nm</text>
        </g>
      </svg>
    `;
  } else if (v.id === "hiv") {
    svgContent = `
      <svg width="290" height="260" viewBox="0 0 320 280">
        <!-- Outer envelope -->
        <circle cx="130" cy="140" r="90" fill="#451a03" stroke="#f59e0b" stroke-width="2.5"/>
        <!-- Matrix p17 -->
        <circle cx="130" cy="140" r="80" fill="#78350f" stroke="#d97706" stroke-width="2"/>
        
        <!-- CONICAL CAPSID (BENTUK KERUCUT TERPANCUNG) -->
        <polygon points="105,80 155,80 145,190 115,190" fill="#1c1917" stroke="#fbbf24" stroke-width="2.5"/>

        <!-- Inside capsid: 2x RNA + Enzymes -->
        <path d="M125,95 Q135,115 125,135 T135,155 T125,175" fill="none" stroke="#fef08a" stroke-width="2.5"/>
        <path d="M135,95 Q125,115 135,135 T125,155 T135,175" fill="none" stroke="#fde047" stroke-width="2.5"/>
        <circle cx="130" cy="115" r="4" fill="#38bdf8" title="Reverse Transcriptase"/>
        <circle cx="130" cy="145" r="3.5" fill="#f43f5e" title="Integrase"/>

        <!-- Leader lines -->
        <line x1="130" y1="50" x2="220" y2="40" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="130" y1="80" x2="220" y2="85" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="140" y1="130" x2="220" y2="135" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="130" y1="170" x2="220" y2="185" stroke="#94a3b8" stroke-width="1.2"/>

        <text x="225" y="38" fill="#fff" font-size="9" font-weight="700">gp120 / gp41 TRIMS</text>
        <text x="225" y="48" fill="#94a3b8" font-size="7.5">Spikula reseptor CD4</text>

        <text x="225" y="84" fill="#fff" font-size="9" font-weight="700">MA (MATRIX / p17)</text>
        <text x="225" y="94" fill="#94a3b8" font-size="7.5">Lapisan penopang amplop</text>

        <text x="225" y="134" fill="#fff" font-size="9" font-weight="700">KAPSID KONIK (p24)</text>
        <text x="225" y="144" fill="#fbbf24" font-size="7.5">Ciri paling khas HIV</text>

        <text x="225" y="184" fill="#fff" font-size="9" font-weight="700">2x ssRNA + ENZIM</text>
        <text x="225" y="194" fill="#94a3b8" font-size="7.5">RT, Integrase, Protease</text>

        <!-- Scale bar (120 nm) -->
        <g class="scale-bar-svg" transform="translate(15, 250)">
          <rect x="0" y="0" width="95" height="18" fill="rgba(0,0,0,0.8)" rx="3" stroke="#334155"/>
          <line x1="8" y1="9" x2="68" y2="9" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="72" y="12" fill="#f8fafc" font-size="8" font-family="monospace">120 nm</text>
        </g>
      </svg>
    `;
  } else if (v.id === "rabies") {
    svgContent = `
      <svg width="290" height="260" viewBox="0 0 320 280">
        <!-- Bullet cross section -->
        <path d="M70,220 L70,80 C70,30 170,30 170,80 L170,220 Z" fill="#431407" stroke="#ea580c" stroke-width="2"/>
        <!-- M single layer (CATATAN: RABV HANYA SATU LAPISAN M) -->
        <path d="M76,215 L76,82 C76,38 164,38 164,82 L164,215 Z" fill="#7c2d12" stroke="#f97316" stroke-width="1.5"/>
        <!-- Helical RNP with rib-like pattern -->
        <g stroke="#38bdf8" stroke-width="3" stroke-linecap="round">
          ${[...Array(10)].map((_, i) => `<line x1="86" y1="${80 + i * 13}" x2="154" y2="${80 + i * 13}"/>`).join('')}
        </g>
        <path d="M120,60 L120,205" stroke="#facc15" stroke-width="2" stroke-dasharray="3 2"/>

        <!-- Leader lines -->
        <line x1="170" y1="70" x2="225" y2="55" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="164" y1="120" x2="225" y2="105" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="154" y1="150" x2="225" y2="155" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="120" y1="180" x2="225" y2="200" stroke="#94a3b8" stroke-width="1.2"/>

        <text x="230" y="54" fill="#fff" font-size="9" font-weight="700">GLIKOPROTEIN G</text>
        <text x="230" y="64" fill="#94a3b8" font-size="7.5">~400 trimer permukaan</text>

        <text x="230" y="104" fill="#fff" font-size="9" font-weight="700">SATU LAPISAN M</text>
        <text x="230" y="114" fill="#94a3b8" font-size="7.5">Tunggal (beda dari VSV)</text>

        <text x="230" y="154" fill="#fff" font-size="9" font-weight="700">RNP HELIKS</text>
        <text x="230" y="164" fill="#94a3b8" font-size="7.5">Pola rusuk (rib-like)</text>

        <text x="230" y="200" fill="#fff" font-size="9" font-weight="700">−ssRNA GENOM</text>
        <text x="230" y="210" fill="#94a3b8" font-size="7.5">Tertanam dalam alur N</text>

        <!-- Scale bar (180 nm) -->
        <g class="scale-bar-svg" transform="translate(15, 250)">
          <rect x="0" y="0" width="95" height="18" fill="rgba(0,0,0,0.8)" rx="3" stroke="#334155"/>
          <line x1="8" y1="9" x2="68" y2="9" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="72" y="12" fill="#f8fafc" font-size="8" font-family="monospace">180 nm</text>
        </g>
      </svg>
    `;
  } else if (v.id === "tmv") {
    // DUA SUB-PANEL: End-on + Longitudinal
    svgContent = `
      <svg width="300" height="260" viewBox="0 0 320 280">
        <!-- Sub-panel 1: End-on (Tampak dari atas) -->
        <g transform="translate(80, 75)">
          <circle cx="0" cy="0" r="55" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
          <!-- Coat protein radial rings -->
          ${[...Array(16)].map((_, i) => `<line x1="0" y1="0" x2="${50 * Math.cos(i*Math.PI/8)}" y2="${50 * Math.sin(i*Math.PI/8)}" stroke="#0284c7" stroke-width="1.5"/>`).join('')}
          <!-- ssRNA ring dashed -->
          <circle cx="0" cy="0" r="30" fill="none" stroke="#facc15" stroke-width="3" stroke-dasharray="4 3"/>
          <!-- Central canal 4 nm -->
          <circle cx="0" cy="0" r="14" fill="#082f49" stroke="#0284c7" stroke-width="2"/>
        </g>
        <text x="35" y="145" fill="#fff" font-size="8.5" font-weight="700">Tampak Atas (End-on)</text>
        <text x="45" y="157" fill="#38bdf8" font-size="7.5">Kanal 4 nm di pusat</text>

        <!-- Sub-panel 2: Longitudinal -->
        <g transform="translate(45, 175)">
          <rect x="0" y="0" width="80" height="45" rx="3" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
          <line x1="0" y1="22" x2="80" y2="22" stroke="#082f49" stroke-width="8"/>
          <path d="M5,22 L15,14 L25,30 L35,14 L45,30 L55,14 L65,30 L75,22" fill="none" stroke="#facc15" stroke-width="2.5"/>
        </g>
        <text x="35" y="235" fill="#fff" font-size="8.5" font-weight="700">Tampak Samping (Longitudinal)</text>

        <!-- Leader lines -->
        <line x1="135" y1="50" x2="200" y2="40" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="110" y1="75" x2="200" y2="85" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="80" y1="75" x2="200" y2="135" stroke="#94a3b8" stroke-width="1.2"/>

        <text x="205" y="38" fill="#fff" font-size="9" font-weight="700">COAT PROTEIN (CP)</text>
        <text x="205" y="48" fill="#94a3b8" font-size="7.5">2.130 subunit identik</text>

        <text x="205" y="84" fill="#fff" font-size="9" font-weight="700">ssRNA GENOM</text>
        <text x="205" y="94" fill="#94a3b8" font-size="7.5">Tertanam dalam alur heliks</text>

        <text x="205" y="134" fill="#fff" font-size="9" font-weight="700">KANAL SENTRAL 4 nm</text>
        <text x="205" y="144" fill="#94a3b8" font-size="7.5">Rongga kosong sumbu tengah</text>

        <!-- Scale bar (18 nm diameter / 300 nm panjang) -->
        <g class="scale-bar-svg" transform="translate(15, 250)">
          <rect x="0" y="0" width="120" height="18" fill="rgba(0,0,0,0.8)" rx="3" stroke="#334155"/>
          <line x1="8" y1="9" x2="45" y2="9" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="50" y="12" fill="#f8fafc" font-size="7.5" font-family="monospace">18 nm (300 nm rod)</text>
        </g>
      </svg>
    `;
  } else {
    // Generic detailed cross section for SARS-CoV-2, T4, HPV, Adeno, Zika
    svgContent = `
      <svg width="290" height="260" viewBox="0 0 320 280">
        <circle cx="130" cy="140" r="85" fill="#090e17" stroke="${v.accentColor}" stroke-width="3"/>
        <circle cx="130" cy="140" r="70" fill="#1e293b" stroke="${v.accentColor}" stroke-width="1.5" stroke-dasharray="4 2"/>
        <circle cx="130" cy="140" r="45" fill="#0f172a"/>
        <!-- Internal coiled DNA / RNA -->
        <path d="M105,140 Q130,105 155,140 T130,165 T120,125" fill="none" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"/>

        <!-- Leader lines -->
        <line x1="130" y1="55" x2="220" y2="45" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="130" y1="70" x2="220" y2="95" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="130" y1="140" x2="220" y2="155" stroke="#94a3b8" stroke-width="1.2"/>

        <text x="225" y="44" fill="#fff" font-size="9" font-weight="700">PROTEIN STRUKTURAL</text>
        <text x="225" y="54" fill="#94a3b8" font-size="7.5">Cangkang kapsid luar</text>

        <text x="225" y="94" fill="#fff" font-size="9" font-weight="700">LAPISAN DALAM</text>
        <text x="225" y="104" fill="#94a3b8" font-size="7.5">${v.envelope === 'Ya' ? 'Membran lipid bilayer' : 'Protein cangkang sekunder'}</text>

        <text x="225" y="154" fill="#fff" font-size="9" font-weight="700">GENOM ${v.genome.split(' ')[0]}</text>
        <text x="225" y="164" fill="#94a3b8" font-size="7.5">${v.genome}</text>

        <!-- Scale bar -->
        <g class="scale-bar-svg" transform="translate(15, 250)">
          <rect x="0" y="0" width="85" height="18" fill="rgba(0,0,0,0.8)" rx="3" stroke="#334155"/>
          <line x1="8" y1="9" x2="50" y2="9" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="55" y="12" fill="#f8fafc" font-size="8" font-family="monospace">${v.size.split(' ')[0]}</text>
        </g>
      </svg>
    `;
  }

  container.innerHTML = svgContent;
}

function renderPanelC(v) {
  const container = document.getElementById("panelC-genomeTrack");
  container.innerHTML = v.genomeMap.map(seg => `
    <div class="genome-seg" style="width: ${seg.width}%; background: ${seg.color};">
      <span>${seg.name}</span>
      <div class="tooltip-popup">
        <strong>${seg.name}</strong>: ${seg.func}
      </div>
    </div>
  `).join('');

  document.getElementById("genom-panjang").innerText = v.genomeStats.length;
  document.getElementById("genom-protein-count").innerText = v.genomeStats.proteins;
  document.getElementById("genom-tipe").innerText = v.genomeStats.polarity;
  document.getElementById("genom-kategori").innerText = v.genomeStats.category;

  const mutasiBox = document.getElementById("mutasi-kunci-box");
  if (v.mutations) {
    mutasiBox.style.display = "block";
    document.getElementById("mutasi-kunci-desc").innerText = v.mutations;
  } else {
    mutasiBox.style.display = "none";
  }
}

function renderSizeChart(activeId) {
  const chartContainer = document.getElementById("size-chart-bars");
  const sizes = [
    { name: "HPV", nm: 52, dim: "52 nm (diameter)" },
    { name: "Zika (ZIKV)", nm: 50, dim: "50 nm (diameter)" },
    { name: "Dengue (DENV)", nm: 50, dim: "50 nm (diameter)" },
    { name: "TMV", nm: 300, dim: "18 nm (diameter) / 300 nm (panjang)" },
    { name: "Rabies (RABV)", nm: 180, dim: "75 nm (diameter) / 180 nm (panjang)" },
    { name: "Adenovirus", nm: 127, dim: "90 nm (diameter) + fiber ~127 nm total" },
    { name: "Influenza A", nm: 100, dim: "100 nm (diameter)" },
    { name: "SARS-CoV-2", nm: 100, dim: "100 nm (diameter)" },
    { name: "HIV", nm: 120, dim: "120 nm (diameter)" },
    { name: "Fag T4", nm: 200, dim: "Kepala 100×70 nm + ekor 100 nm" }
  ];

  chartContainer.innerHTML = sizes.map(item => {
    // max width scale relative to 300nm = 100%
    const pct = Math.min(100, Math.max(12, (item.nm / 300) * 100));
    const is100nm = item.nm === 100;
    return `
      <div style="display: grid; grid-template-columns: 140px 1fr 180px; align-items: center; gap: 0.75rem;">
        <span style="font-size: 0.8rem; font-weight: 600; color: #fff;">${item.name}</span>
        <div style="background: #1e293b; height: 16px; border-radius: 4px; overflow: hidden; position: relative;">
          <div style="width: ${pct}%; height: 100%; background: ${is100nm ? '#38bdf8' : '#2563eb'}; border-radius: 4px; transition: width 0.5s ease;"></div>
        </div>
        <span style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">${item.dim}</span>
      </div>
    `;
  }).join('');
}

// HELPER SVG GENERATORS
function generateRadialSpikes(cx, cy, r, len, count, color, type) {
  let str = "";
  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + (r + len) * Math.cos(angle);
    const y2 = cy + (r + len) * Math.sin(angle);
    if (type === "rod") {
      str += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
      str += `<circle cx="${x2}" cy="${y2}" r="3" fill="${color}"/>`;
    } else if (type === "mushroom") {
      str += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5"/>`;
      str += `<circle cx="${x2}" cy="${y2}" r="4.5" fill="${color}"/>`;
    } else if (type === "coronaSpike") {
      str += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
      str += `<circle cx="${x2}" cy="${y2}" r="5" fill="${color}" stroke="#0369a1" stroke-width="1"/>`;
    } else if (type === "hivSpike") {
      str += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3"/>`;
      str += `<polygon points="${x2-3},${y2-3} ${x2+3},${y2-3} ${x2},${y2+4}" fill="${color}"/>`;
    }
  }
  return str;
}

function generateT7dLattice(cx, cy, r) {
  // 72 pentamers arranged symmetrically
  let str = "";
  for (let i = 0; i < 18; i++) {
    const a = (i * 2 * Math.PI) / 18;
    str += `<circle cx="${cx + r * Math.cos(a)}" cy="${cy + r * Math.sin(a)}" r="6"/>`;
  }
  for (let i = 0; i < 12; i++) {
    const a = (i * 2 * Math.PI) / 12;
    str += `<circle cx="${cx + (r * 0.65) * Math.cos(a)}" cy="${cy + (r * 0.65) * Math.sin(a)}" r="6.5"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const a = (i * 2 * Math.PI) / 6;
    str += `<circle cx="${cx + (r * 0.32) * Math.cos(a)}" cy="${cy + (r * 0.32) * Math.sin(a)}" r="6.5"/>`;
  }
  str += `<circle cx="${cx}" cy="${cy}" r="7" fill="#6ee7b7"/>`;
  return str;
}

// EXP TAB SWITCHER
function switchExpTab(tabId) {
  document.querySelectorAll(".exp-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content-pane").forEach(pane => pane.classList.remove("active"));
  
  event.target.classList.add("active");
  const targetPane = document.getElementById("tab-pane-" + tabId);
  if (targetPane) targetPane.classList.add("active");
}

function copyLKMText() {
  const text = document.getElementById("lkm-summary-text").innerText.replace(/^"|"$/g, '');
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("btnCopyLKM");
    btn.innerText = "✓ Tersalin!";
    btn.style.color = "#34d399";
    setTimeout(() => {
      btn.innerText = "📋 Salin Teks";
      btn.style.color = "";
    }, 2000);
  });
}

// MINI-GAME: "SIAPA AKU?"
function initMiniGame() {
  miniGameTargetIndex = Math.floor(Math.random() * VIRUSES_DATA.length);
  miniGameClueStep = 1;
  document.getElementById("btn-next-clue").disabled = false;
  document.getElementById("game-feedback").style.display = "none";
  renderMiniGameClues();
  renderMiniGameButtons();
}

function renderMiniGameClues() {
  const v = VIRUSES_DATA[miniGameTargetIndex];
  const clueBox = document.getElementById("clue-list");
  const clues = [
    `Petunjuk 1 (Tipe Genom): Memiliki materi genetik ${v.genome}`,
    `Petunjuk 2 (Amplop): ${v.envelope === "Ya" ? "Memiliki amplop lipid bilayer" : "TIDAK memiliki amplop lipid (non-amplop)"}`,
    `Petunjuk 3 (Bentuk Kapsid): Morfologi kapsid ${v.capsid}`,
    `Petunjuk 4 (Ukuran): Dimensi virion ${v.size}`,
    `Petunjuk 5 (Inang Spesifik): Menyerang spesifik ${v.host.split(';')[0]}`
  ];

  clueBox.innerHTML = clues.slice(0, miniGameClueStep).map((c, i) => `
    <div style="font-size: 0.85rem; color: #cbd5e1; background: #0f172a; padding: 0.4rem 0.65rem; border-radius: 4px; border-left: 2px solid #38bdf8;">
      ${c}
    </div>
  `).join('');
}

function renderMiniGameButtons() {
  const container = document.getElementById("game-guess-buttons");
  // Pick 4 options including target
  let options = [VIRUSES_DATA[miniGameTargetIndex]];
  while (options.length < 4) {
    const r = VIRUSES_DATA[Math.floor(Math.random() * VIRUSES_DATA.length)];
    if (!options.some(o => o.id === r.id)) options.push(r);
  }
  options.sort(() => Math.random() - 0.5);

  container.innerHTML = options.map(opt => `
    <button class="btn btn-secondary btn-sm" onclick="guessMiniGame('${opt.id}')">
      ${opt.name.split(' (')[0]}
    </button>
  `).join('');
}

function nextClue() {
  if (miniGameClueStep < 5) {
    miniGameClueStep++;
    renderMiniGameClues();
  }
  if (miniGameClueStep === 5) {
    document.getElementById("btn-next-clue").disabled = true;
  }
}

function guessMiniGame(virusId) {
  const target = VIRUSES_DATA[miniGameTargetIndex];
  const fb = document.getElementById("game-feedback");
  fb.style.display = "block";

  if (virusId === target.id) {
    const points = 6 - miniGameClueStep; // 5 down to 1
    miniGameScore += points;
    document.getElementById("game-score-display").innerText = miniGameScore;
    fb.innerHTML = `<span style="color: #34d399; font-weight: 700;">✓ Tepat sekali!</span> Ini adalah <strong>${target.name}</strong>. Kamu memperoleh <strong>+${points} Poin</strong>.`;
    document.querySelectorAll("#game-guess-buttons button").forEach(b => b.disabled = true);
    document.getElementById("btn-next-clue").disabled = true;
  } else {
    fb.innerHTML = `<span style="color: #f43f5e; font-weight: 700;">✗ Belum tepat.</span> Coba baca petunjuk lebih teliti atau buka petunjuk berikutnya!`;
  }
}

// ASESMEN FORMATIF 1 (Bloom C4) LOGIC
function renderQuiz1Question() {
  const q = QUIZ1_QUESTIONS[quiz1CurrentIndex];
  document.getElementById("q1-num").innerText = quiz1CurrentIndex + 1;
  document.getElementById("q1-question").innerText = q.question;
  
  const optContainer = document.getElementById("q1-options");
  const hasAnswered = quiz1Answers[quiz1CurrentIndex] !== undefined;
  const selected = quiz1Answers[quiz1CurrentIndex];

  optContainer.innerHTML = q.options.map((opt, i) => {
    let cls = "option-btn";
    if (hasAnswered) {
      if (i === q.correct) cls += " selected-correct";
      else if (i === selected) cls += " selected-wrong";
    }
    return `
      <button class="${cls}" onclick="answerQuiz1(${i})" ${hasAnswered ? 'disabled' : ''}>
        ${opt}
      </button>
    `;
  }).join('');

  const fb = document.getElementById("q1-feedback");
  if (hasAnswered) {
    fb.className = `quiz-feedback show ${selected === q.correct ? 'feedback-correct' : 'feedback-wrong'}`;
    fb.innerHTML = `<strong>${selected === q.correct ? '✓ Jawaban Tepat!' : '✗ Jawaban Belum Tepat.'}</strong> ${q.feedback}`;
  } else {
    fb.className = "quiz-feedback";
    fb.innerHTML = "";
  }

  document.getElementById("btn-q1-prev").disabled = quiz1CurrentIndex === 0;
  document.getElementById("btn-q1-next").innerText = (quiz1CurrentIndex === QUIZ1_QUESTIONS.length - 1) ? "Lihat Hasil Asesmen" : "Selanjutnya →";
}

function answerQuiz1(optionIdx) {
  if (quiz1Answers[quiz1CurrentIndex] !== undefined) return;
  quiz1Answers[quiz1CurrentIndex] = optionIdx;
  renderQuiz1Question();
}

function navQuiz1(dir) {
  if (dir === 1 && quiz1CurrentIndex === QUIZ1_QUESTIONS.length - 1) {
    showQuiz1Results();
    return;
  }
  quiz1CurrentIndex += dir;
  renderQuiz1Question();
}

function showQuiz1Results() {
  document.getElementById("q1-card").style.display = "none";
  const resBox = document.getElementById("q1-result-box");
  resBox.style.display = "block";

  let score = 0;
  QUIZ1_QUESTIONS.forEach((q, i) => {
    if (quiz1Answers[i] === q.correct) score++;
  });

  document.getElementById("q1-result-score").innerText = `Skor Kamu: ${score} dari 5 Soal Benar`;
  const msg = document.getElementById("q1-result-msg");
  if (score >= 3) {
    unlockBadge(1);
    msg.innerHTML = `Selamat! Kamu telah mencapai ambang batas kompetensi Bloom C4 dan berhasil meraih <strong style="color:#fff;">Badge 🔬 "Pengenal Virus"</strong>. Silakan lanjutkan ke Modul 2 untuk menganalisis siklus replikasi virus.`;
  } else {
    msg.innerHTML = `Kamu memperoleh ${score}/5. Kamu perlu minimal 3/5 benar untuk membuka Badge 🔬. Jangan ragu untuk me-review kembali data karakteristik 10 virus di atas dan mencoba lagi!`;
  }
}

function resetQuiz1() {
  quiz1Answers = {};
  quiz1CurrentIndex = 0;
  document.getElementById("q1-card").style.display = "block";
  document.getElementById("q1-result-box").style.display = "none";
  renderQuiz1Question();
}

// ========================================================
// MODUL 2: LOGIC & DATA
// ========================================================
let currentCycleModel = 'litik';
let litikCurrentStep = 0;
let lisogenikCurrentStep = 0;
let lisogenikActivated = false;

const LITIK_STEPS_DATA = [
  {
    title: "1. Adsorbsi (Penempelan Spesifik)",
    badge: "Tahap 1: Adsorbsi",
    desc: "Long tail fibers (serabut ekor panjang) Fag T4 mengenali molekul reseptor lipopolisakarida (LPS) dan protein membran luar OmpC pada dinding sel bakteri Escherichia coli secara sangat spesifik.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <!-- Bacterial wall -->
        <rect x="20" y="180" width="240" height="40" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
        <text x="140" y="205" fill="#86efac" font-size="11" font-weight="700" text-anchor="middle">Dinding Sel E. coli (LPS & Peptidoglikan)</text>
        <!-- T4 Phage approaching -->
        <g transform="translate(100, 40)">
          <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
          <rect x="36" y="70" width="8" height="40" fill="#16a34a"/>
          <path d="M30,110 L15,140" stroke="#4ade80" stroke-width="2.5"/>
          <path d="M50,110 L65,140" stroke="#4ade80" stroke-width="2.5"/>
        </g>
      </svg>
    `
  },
  {
    title: "2. Injeksi (Penetrasi DNA)",
    badge: "Tahap 2: Injeksi",
    desc: "Selubung ekor (contractile sheath) T4 berkontraksi memendek; jarum tabung penetrasi internal menembus dinding peptidoglikan bakteri dibantu enzim lisozim T4, lalu menginjeksikan 169 kb dsDNA lurus ke sitoplasma inang.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <rect x="20" y="160" width="240" height="60" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
        <g transform="translate(100, 60)">
          <!-- Contracted sheath -->
          <polygon points="40,5 65,20 65,45 40,55 15,45 15,20" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
          <rect x="37" y="55" width="6" height="25" fill="#15803d" stroke="#86efac" stroke-width="1.5"/>
          <line x1="40" y1="80" x2="40" y2="135" stroke="#facc15" stroke-width="3.5" stroke-dasharray="4 2"/>
        </g>
        <text x="140" y="205" fill="#facc15" font-size="10" font-weight="700" text-anchor="middle">dsDNA Fag Diinjeksikan ke Sitoplasma</text>
      </svg>
    `
  },
  {
    title: "3. Ekspresi Gen Awal (Early Expression)",
    badge: "Tahap 3: Ekspresi Awal",
    desc: "DNA Fag T4 mengambil alih RNA polimerase inang. Enzim nuklease awal mendegradasi kromosom bakteri E. coli menjadi nukleotida bebas, menghentikan seluruh sintesis sel inang secara total.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <rect x="20" y="40" width="240" height="170" rx="10" fill="#052e16" stroke="#22c55e" stroke-width="2"/>
        <!-- Degraded host DNA fragments -->
        <path d="M40,70 Q60,90 80,70" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
        <path d="M180,60 Q200,80 220,60" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
        <text x="140" y="80" fill="#ef4444" font-size="9" text-anchor="middle">DNA Bakteri Dihancurkan!</text>
        <!-- Viral transcription bubble -->
        <circle cx="140" cy="130" r="30" fill="#166534" stroke="#4ade80" stroke-width="2"/>
        <text x="140" y="134" fill="#facc15" font-size="9" font-weight="700" text-anchor="middle">Transkripsi Early</text>
      </svg>
    `
  },
  {
    title: "4. Replikasi DNA Fag T4",
    badge: "Tahap 4: Replikasi DNA",
    desc: "Mesin replikasi DNA T4 menyintesis ratusan salinan dsDNA identik melalui molekul intermediat concatemeric bercabang panjang dengan kecepatan tinggi.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <rect x="20" y="40" width="240" height="170" rx="10" fill="#052e16" stroke="#22c55e" stroke-width="2"/>
        <!-- Multiple copies of coiled viral DNA -->
        <g stroke="#facc15" stroke-width="2.5" fill="none">
          <path d="M50,90 Q90,60 130,90 T210,90"/>
          <path d="M60,130 Q100,100 140,130 T220,130"/>
          <path d="M50,170 Q90,140 130,170 T210,170"/>
        </g>
        <text x="140" y="60" fill="#facc15" font-size="10" font-weight="700" text-anchor="middle">Multiplikasi Masif dsDNA Fag</text>
      </svg>
    `
  },
  {
    title: "5. Sintesis Protein Struktural (Late Genes)",
    badge: "Tahap 5: Sintesis Late",
    desc: "Late genes diekspresikan untuk memproduksi ribuan komponen struktural terpisah: protein kepala ikosahedral, selubung ekor kontraktil, lempeng dasar (baseplate), dan serabut ekor secara mandiri.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <rect x="20" y="40" width="240" height="170" rx="10" fill="#052e16" stroke="#22c55e" stroke-width="2"/>
        <!-- Scattered phage parts -->
        <polygon points="60,70 75,80 75,95 60,105 45,95 45,80" fill="#15803d" stroke="#4ade80" stroke-width="1.5"/>
        <polygon points="130,70 145,80 145,95 130,105 115,95 115,80" fill="#15803d" stroke="#4ade80" stroke-width="1.5"/>
        <rect x="180" y="75" width="6" height="25" fill="#16a34a"/>
        <rect x="70" y="140" width="6" height="25" fill="#16a34a"/>
        <!-- Fibers -->
        <path d="M140,140 L160,170" stroke="#4ade80" stroke-width="2"/>
        <path d="M180,140 L200,170" stroke="#4ade80" stroke-width="2"/>
        <text x="140" y="195" fill="#86efac" font-size="10" font-weight="700" text-anchor="middle">Komponen Kepala, Ekor & Serabut Diproduksi</text>
      </svg>
    `
  },
  {
    title: "6. Perakitan Mandiri (Self-Assembly)",
    badge: "Tahap 6: Perakitan (Assembly)",
    desc: "DNA dikemas padat ke dalam kepala ikosahedral oleh motor translokase; leher, tabung ekor, selubung kontraktil, baseplate, dan 6 tail fibers dirangkai sempurna membentuk ~100–200 virion anakan matang.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <rect x="20" y="40" width="240" height="170" rx="10" fill="#052e16" stroke="#22c55e" stroke-width="2"/>
        <!-- 3 Fully assembled virions inside -->
        <g transform="translate(45, 60) scale(0.65)">
          <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
          <rect x="36" y="70" width="8" height="35" fill="#16a34a"/>
          <path d="M25,105 L15,130 M55,105 L65,130" stroke="#4ade80" stroke-width="2"/>
        </g>
        <g transform="translate(125, 60) scale(0.65)">
          <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
          <rect x="36" y="70" width="8" height="35" fill="#16a34a"/>
          <path d="M25,105 L15,130 M55,105 L65,130" stroke="#4ade80" stroke-width="2"/>
        </g>
        <g transform="translate(85, 120) scale(0.65)">
          <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
          <rect x="36" y="70" width="8" height="35" fill="#16a34a"/>
          <path d="M25,105 L15,130 M55,105 L65,130" stroke="#4ade80" stroke-width="2"/>
        </g>
        <text x="140" y="55" fill="#22c55e" font-size="10" font-weight="700" text-anchor="middle">100–200 Fag Utuh Siap Dilepas</text>
      </svg>
    `
  },
  {
    title: "7. Lisis Sel & Pelepasan Virion (Lysis)",
    badge: "Tahap 7: Lisis",
    desc: "Enzim holin melubangi membran sitoplasma bakteri, disusul endolisin (T4 lysozyme) yang mencerna dinding peptidoglikan hingga sel bakteri E. coli pecah (lisis) seketika dalam 25 menit infeksi!",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <!-- Ruptured bacterium -->
        <path d="M30,50 Q100,20 160,55 Q200,30 250,70 Q240,140 260,180 Q180,210 110,190 Q40,210 20,150 Q40,100 30,50" fill="#450a0a" stroke="#ef4444" stroke-width="3" stroke-dasharray="6 3"/>
        <!-- Escaping virions -->
        <g transform="translate(10, 30) scale(0.6)">
          <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
          <rect x="36" y="70" width="8" height="30" fill="#16a34a"/>
        </g>
        <g transform="translate(200, 110) scale(0.6)">
          <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
          <rect x="36" y="70" width="8" height="30" fill="#16a34a"/>
        </g>
        <g transform="translate(100, 140) scale(0.6)">
          <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
          <rect x="36" y="70" width="8" height="30" fill="#16a34a"/>
        </g>
        <text x="140" y="110" fill="#fca5a5" font-size="12" font-weight="800" text-anchor="middle">LISIS TOTAL! E. coli PECAH</text>
      </svg>
    `
  }
];

const LISOGENIK_STEPS_DATA = [
  {
    title: "1. Attachment & Fusi Membran",
    badge: "Tahap 1: Fusi (Fase 1)",
    phase: "Fase 1: Integrasi Provirus",
    desc: "Glikoprotein gp120 permukaan amplop HIV mengenali reseptor CD4 dan koreseptor chemokine (CCR5/CXCR4) pada limfosit T manusia, memicu fusi membran via gp41 dan injeksi kapsid konik p24 ke sitosol.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <rect x="20" y="160" width="240" height="60" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
        <text x="140" y="200" fill="#c7d2fe" font-size="10" font-weight="700" text-anchor="middle">Membran Limfosit T CD4+ Manusia</text>
        <circle cx="140" cy="80" r="45" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
        <polygon points="125,50 155,50 150,110 130,110" fill="#1c1917" stroke="#f59e0b" stroke-width="1.5"/>
        <line x1="140" y1="125" x2="140" y2="160" stroke="#f59e0b" stroke-width="3" stroke-dasharray="3 2"/>
        <text x="140" y="145" fill="#fbbf24" font-size="9" text-anchor="middle">Fusi gp120-CD4</text>
      </svg>
    `
  },
  {
    title: "2. Reverse Transcription (RNA → dsDNA)",
    badge: "Tahap 2: Transkripsi Balik",
    phase: "Fase 1: Integrasi Provirus",
    desc: "Enzim Reverse Transcriptase (RT) mentranskripsi balik 2 salinan +ssRNA HIV menjadi complementary DNA (cDNA) untai tunggal, kemudian menduplikasi menjadi dsDNA proviral komplementer di sitoplasma.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <rect x="20" y="30" width="240" height="180" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="140" y="55" fill="#94a3b8" font-size="10" text-anchor="middle">Sitoplasma Limfosit</text>
        <!-- Reverse Transcription illustration -->
        <path d="M50,90 Q140,70 230,90" stroke="#facc15" stroke-width="3" fill="none"/>
        <text x="140" y="85" fill="#facc15" font-size="9" text-anchor="middle">+ssRNA Viral Cetakan</text>
        <!-- RT Enzyme circle -->
        <circle cx="140" cy="120" r="22" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <text x="140" y="124" fill="#fff" font-size="9" font-weight="700" text-anchor="middle">Enzim RT</text>
        <path d="M50,150 Q140,130 230,150" stroke="#38bdf8" stroke-width="3" fill="none"/>
        <path d="M50,156 Q140,136 230,156" stroke="#38bdf8" stroke-width="3" fill="none"/>
        <text x="140" y="175" fill="#38bdf8" font-size="9" text-anchor="middle">dsDNA Proviral Baru Sintesis</text>
      </svg>
    `
  },
  {
    title: "3. Integrasi Provirus ke Kromosom Inang",
    badge: "Tahap 3: Integrasi",
    phase: "Fase 1: Integrasi Provirus",
    desc: "dsDNA proviral masuk ke nukleus melalui nuclear pore complex. Enzim Integrase memotong untai kromosom manusia dan menyisipkan DNA HIV secara kovalen permanen menjadi PROVIRUS.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <!-- Nucleus border -->
        <circle cx="140" cy="120" r="95" fill="#020617" stroke="#6366f1" stroke-width="2.5" stroke-dasharray="8 3"/>
        <text x="140" y="50" fill="#818cf8" font-size="10" font-weight="700" text-anchor="middle">NUKLEUS SEL CD4+</text>
        <!-- Host chromosome with viral insertion -->
        <path d="M55,130 Q90,110 115,130" stroke="#94a3b8" stroke-width="4" fill="none"/>
        <path d="M115,130 L165,130" stroke="#f59e0b" stroke-width="5" fill="none"/>
        <path d="M165,130 Q190,150 225,130" stroke="#94a3b8" stroke-width="4" fill="none"/>
        <text x="140" y="115" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">PROVIRUS TERINTEGRASI</text>
        <text x="140" y="165" fill="#94a3b8" font-size="8.5" text-anchor="middle">DNA Inang (Kromosom Manusia)</text>
      </svg>
    `
  },
  {
    title: "4. Fase Latensi Lisogenik (Tertidur Bertahun-tahun)",
    badge: "Tahap 4: Latensi",
    phase: "Fase 1: Integrasi Provirus",
    desc: "Provirus ikut menduplikasi saat sel CD4+ membelah secara normal. Tidak ada partikel virus bebas yang diproduksi, sehingga virus 'tidak terlihat' (laten) oleh sistem imun inang selama 5–10 tahun!",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <!-- Two divided cells with provirus -->
        <g transform="translate(45, 60)">
          <circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <line x1="25" y1="40" x2="55" y2="40" stroke="#f59e0b" stroke-width="4"/>
          <text x="40" y="60" fill="#fbbf24" font-size="8" font-weight="700" text-anchor="middle">Provirus A</text>
        </g>
        <g transform="translate(155, 60)">
          <circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <line x1="25" y1="40" x2="55" y2="40" stroke="#f59e0b" stroke-width="4"/>
          <text x="40" y="60" fill="#fbbf24" font-size="8" font-weight="700" text-anchor="middle">Provirus B</text>
        </g>
        <text x="140" y="165" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Membelah Bersama Sel Tanpa Merusak!</text>
        <text x="140" y="185" fill="#94a3b8" font-size="8.5" text-anchor="middle">(Klik tombol hijau 'Aktifkan Reaktivasi' untuk memicu siklus litik)</text>
      </svg>
    `
  },
  {
    title: "5. Reaktivasi Transkripsi (Stres Seluler)",
    badge: "Tahap 5: Reaktivasi",
    phase: "Fase 2: Reaktivasi Siklus Litik",
    desc: "Stres fisiologis, sitokin, atau aktivasi faktor transkripsi inang (seperti NF-κB) mengikat LTR promoter provirus, mengaktifkan transkripsi RNA polimerase II untuk menyintesis mRNA dan genomic RNA HIV.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <circle cx="140" cy="120" r="95" fill="#450a0a" stroke="#ef4444" stroke-width="2.5"/>
        <text x="140" y="55" fill="#f87171" font-size="10" font-weight="700" text-anchor="middle">STRES SELULER: NF-κB AKTIF!</text>
        <line x1="60" y1="120" x2="220" y2="120" stroke="#f59e0b" stroke-width="4"/>
        <!-- Transcribed mRNAs shooting out -->
        <path d="M140,120 Q160,80 180,95" stroke="#facc15" stroke-width="3" fill="none"/>
        <path d="M120,120 Q100,150 80,140" stroke="#facc15" stroke-width="3" fill="none"/>
        <text x="140" y="175" fill="#facc15" font-size="9" font-weight="700" text-anchor="middle">Transkripsi mRNA Viral Masif Dimulai</text>
      </svg>
    `
  },
  {
    title: "6. Translasi Poliprotein Gag-Pol & Env",
    badge: "Tahap 6: Translasi",
    phase: "Fase 2: Reaktivasi Siklus Litik",
    desc: "mRNA HIV ditranslasi oleh ribosom inang menjadi rantai panjang poliprotein Gag, Gag-Pol, dan glikoprotein Env (gp160). Protein dipotong parsial dan dikirim ke membran sel.",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <rect x="20" y="40" width="240" height="160" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <!-- Ribosome reading mRNA -->
        <ellipse cx="140" cy="100" rx="30" ry="18" fill="#047857" stroke="#10b981" stroke-width="2"/>
        <path d="M50,100 L230,100" stroke="#facc15" stroke-width="2.5"/>
        <!-- Emerging polypeptide chain -->
        <path d="M140,118 Q150,150 170,160" stroke="#f97316" stroke-width="4" fill="none"/>
        <text x="140" y="65" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Ribosom Mentranslasi Poliprotein Gag-Pol</text>
      </svg>
    `
  },
  {
    title: "7. Perakitan, Budding & Kematangan Protease (Litik)",
    badge: "Tahap 7: Budding & Lisis",
    phase: "Fase 2: Reaktivasi Siklus Litik",
    desc: "Virion imatur bertunas (budding) keluar membran limfosit CD4+. Enzim Protease memotong Gag membentuk kapsid konik p24 yang matang infeksius. Produksi masif virion menyebabkan kematian apoptosis sel CD4+ (imunodefisiensi)!",
    svg: `
      <svg width="280" height="240" viewBox="0 0 280 240">
        <!-- Cell membrane budding -->
        <path d="M20,180 Q100,180 120,140 Q140,100 160,140 Q180,180 260,180" fill="none" stroke="#6366f1" stroke-width="3"/>
        <!-- Budding HIV virion -->
        <circle cx="140" cy="100" r="32" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
        <polygon points="130,85 150,85 146,115 134,115" fill="#1c1917" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="140" y="45" fill="#ef4444" font-size="10" font-weight="700" text-anchor="middle">Virion Bebas Dilepas & Sel CD4+ Hancur</text>
        <text x="140" y="210" fill="#94a3b8" font-size="8.5" text-anchor="middle">Kapsid konik matang oleh protease viral</text>
      </svg>
    `
  }
];

function acknowledgeM2Mindful() {
  document.getElementById("btn-m2-mindful").innerText = "✓ Mindful Prediksi Dicatat";
  document.getElementById("btn-m2-mindful").style.background = "#10b981";
  document.getElementById("m2-mindful-card").style.borderColor = "#10b981";
}

function switchCycleModel(model) {
  currentCycleModel = model;
  if (model === 'litik') {
    document.getElementById("cycle-litik-pane").style.display = "block";
    document.getElementById("cycle-lisogenik-pane").style.display = "none";
    document.getElementById("btn-tab-litik").className = "btn btn-primary btn-sm";
    document.getElementById("btn-tab-lisogenik").className = "btn btn-secondary btn-sm";
    renderLitikStep();
  } else {
    document.getElementById("cycle-litik-pane").style.display = "none";
    document.getElementById("cycle-lisogenik-pane").style.display = "block";
    document.getElementById("btn-tab-litik").className = "btn btn-secondary btn-sm";
    document.getElementById("btn-tab-lisogenik").className = "btn btn-primary btn-sm";
    renderLisogenikStep();
  }
}

function renderLitikStep() {
  const step = LITIK_STEPS_DATA[litikCurrentStep];
  document.getElementById("litik-svg-viewport").innerHTML = step.svg;
  document.getElementById("litik-step-pill").innerText = `TAHAP ${litikCurrentStep + 1} / 7`;
  document.getElementById("litik-title-badge").innerText = step.badge;
  document.getElementById("litik-step-title").innerText = step.title;
  document.getElementById("litik-step-desc").innerText = step.desc;
  document.getElementById("litik-step-counter").innerText = litikCurrentStep + 1;

  document.getElementById("btn-litik-prev").disabled = (litikCurrentStep === 0);
  document.getElementById("btn-litik-next").disabled = (litikCurrentStep === LITIK_STEPS_DATA.length - 1);
}

function navLitikStep(dir) {
  litikCurrentStep += dir;
  renderLitikStep();
}

function renderLisogenikStep() {
  const step = LISOGENIK_STEPS_DATA[lisogenikCurrentStep];
  document.getElementById("lisogenik-svg-viewport").innerHTML = step.svg;
  document.getElementById("lisogenik-step-pill").innerText = `TAHAP ${lisogenikCurrentStep + 1} / 7 · ${step.phase.toUpperCase()}`;
  document.getElementById("lisogenik-phase-badge").innerText = step.phase;
  document.getElementById("lisogenik-step-title").innerText = step.title;
  document.getElementById("lisogenik-step-desc").innerText = step.desc;
  document.getElementById("liso-step-counter").innerText = lisogenikCurrentStep + 1;

  document.getElementById("btn-liso-prev").disabled = (lisogenikCurrentStep === 0);
  document.getElementById("btn-liso-next").disabled = (lisogenikCurrentStep === LISOGENIK_STEPS_DATA.length - 1);

  // Button Reaktivasi di step 3 (index 3 = tahap 4)
  const btnReactivate = document.getElementById("btn-liso-reactivate");
  if (lisogenikCurrentStep === 3 && !lisogenikActivated) {
    btnReactivate.style.display = "inline-flex";
  } else {
    btnReactivate.style.display = "none";
  }
}

function navLisogenikStep(dir) {
  lisogenikCurrentStep += dir;
  renderLisogenikStep();
}

function triggerReaktivasiLiso() {
  lisogenikActivated = true;
  lisogenikCurrentStep = 4; // Maju ke tahap 5 Reaktivasi
  renderLisogenikStep();
}

// DRAG & SORT ACTIVITY LOGIC
const DRAG_ITEMS_DATA = [
  { id: "d1", text: "Sel inang selalu mengalami lisis pecah", correctCol: "litik" },
  { id: "d2", text: "Materi genetik terintegrasi ke kromosom inang (Provirus/Profag)", correctCol: "lisogenik" },
  { id: "d3", text: "Menghasilkan ratusan virion baru dalam hitungan menit-jam", correctCol: "litik" },
  { id: "d4", text: "Virus dapat 'tidur' bertahun-tahun tanpa gejala", correctCol: "lisogenik" },
  { id: "d5", text: "Model klasik: Bakteriofag T4 (virulen)", correctCol: "litik" },
  { id: "d6", text: "Model klasik: HIV (Human Immunodeficiency Virus)", correctCol: "lisogenik" },
  { id: "d7", text: "Menggunakan mesin ribosom & ATP sel inang untuk sintesis", correctCol: "keduanya" }
];

let dragItemStates = {};

function initDragActivity() {
  const pool = document.getElementById("drag-source-cards");
  pool.innerHTML = "";
  document.getElementById("target-litik").innerHTML = "";
  document.getElementById("target-lisogenik").innerHTML = "";
  document.getElementById("target-keduanya").innerHTML = "";
  document.getElementById("drag-feedback-box").style.display = "none";

  DRAG_ITEMS_DATA.forEach(item => {
    dragItemStates[item.id] = 'pool';
    const el = document.createElement("div");
    el.className = "drag-item";
    el.id = "card-" + item.id;
    el.draggable = true;
    el.ondragstart = (e) => e.dataTransfer.setData("text/plain", item.id);
    el.onclick = () => promptMoveCard(item.id);
    el.innerHTML = `<span>${item.text}</span>`;
    pool.appendChild(el);
  });
  updateDragCounts();
}

function allowDrop(e) { e.preventDefault(); }
function handleDrop(e, colName) {
  e.preventDefault();
  const itemId = e.dataTransfer.getData("text/plain");
  placeItemInCol(itemId, colName);
}

function promptMoveCard(itemId) {
  // Mobile-friendly click fallback
  const current = dragItemStates[itemId];
  let target = 'litik';
  if (current === 'pool') target = 'litik';
  else if (current === 'litik') target = 'lisogenik';
  else if (current === 'lisogenik') target = 'keduanya';
  else target = 'pool';
  placeItemInCol(itemId, target);
}

function placeItemInCol(itemId, colName) {
  const item = DRAG_ITEMS_DATA.find(d => d.id === itemId);
  const cardEl = document.getElementById("card-" + itemId);
  if (!item || !cardEl) return;

  dragItemStates[itemId] = colName;
  if (colName === 'pool') {
    document.getElementById("drag-source-cards").appendChild(cardEl);
    cardEl.className = "drag-item";
  } else {
    document.getElementById("target-" + colName).appendChild(cardEl);
    if (colName === item.correctCol) {
      cardEl.className = "drag-item correct";
    } else {
      cardEl.className = "drag-item wrong";
    }
  }
  updateDragCounts();
  checkDragCompletion();
}

function updateDragCounts() {
  let cL = 0, cLi = 0, cK = 0;
  Object.values(dragItemStates).forEach(st => {
    if (st === 'litik') cL++;
    if (st === 'lisogenik') cLi++;
    if (st === 'keduanya') cK++;
  });
  document.getElementById("count-litik").innerText = `${cL} Item`;
  document.getElementById("count-lisogenik").innerText = `${cLi} Item`;
  document.getElementById("count-keduanya").innerText = `${cK} Item`;
}

function checkDragCompletion() {
  const allAssigned = Object.values(dragItemStates).every(st => st !== 'pool');
  if (allAssigned) {
    let correctCount = 0;
    DRAG_ITEMS_DATA.forEach(d => {
      if (dragItemStates[d.id] === d.correctCol) correctCount++;
    });
    const fb = document.getElementById("drag-feedback-box");
    fb.style.display = "block";
    if (correctCount === DRAG_ITEMS_DATA.length) {
      fb.className = "quiz-feedback show feedback-correct";
      fb.innerHTML = `<strong>🎉 Sempurna! (7/7 Benar)</strong> Kamu berhasil mengklasifikasikan karakteristik siklus litik dan lisogenik secara akurat!`;
    } else {
      fb.className = "quiz-feedback show feedback-wrong";
      fb.innerHTML = `<strong>Kamu memperoleh ${correctCount} dari 7 benar.</strong> Kartu berbingkai merah berada di kolom yang kurang tepat. Klik atau geser kartu untuk memperbaikinya!`;
    }
  }
}

function resetDragActivity() {
  initDragActivity();
}

function submitCausalEssayM2() {
  document.getElementById("causal-essay-feedback").style.display = "block";
}

// ASESMEN FORMATIF 2 QUESTIONS (Bloom C3–C4)
const QUIZ2_QUESTIONS = [
  {
    id: 6,
    question: "Urutan tahapan siklus litik yang runtut dan benar pada replikasi Bakteriofag T4 adalah...",
    options: [
      "A. Adsorbsi → Injeksi → Sintesis (Ekspresi & Replikasi) → Perakitan → Lisis",
      "B. Penetrasi → Adsorbsi → Sintesis → Lisis → Perakitan",
      "C. Adsorbsi → Sintesis → Injeksi → Perakitan → Lisis",
      "D. Injeksi → Adsorbsi → Replikasi → Lisis → Perakitan",
      "E. Adsorbsi → Penetrasi → Sintesis → Lisis → Perakitan"
    ],
    correct: 0, // A
    feedback: "Benar! (Pilihan A). Siklus litik berlangsung melalui: (1) Adsorbsi penempelan serabut ekor, (2) Injeksi genom dsDNA via kontraksi sheath, (3) Sintesis ekspresi enzim dan replikasi materi genetik, (4) Perakitan mandiri virion utuh, dan (5) Lisis dinding sel bakteri via enzim lisozim."
  },
  {
    id: 7,
    question: "Pada siklus lisogenik, materi genetik virus yang terintegrasi secara stabil ke dalam kromosom sel inang disebut profag (atau provirus pada sel hewan). Kondisi apa yang paling tepat menggambarkan keuntungan strategi replikasi lisogenik ini bagi kelangsungan hidup virus?",
    options: [
      "A. Virus dapat menghasilkan ratusan virion per detik melebihi kapasitas siklus litik",
      "B. Virus dapat 'bersembunyi' dari deteksi sistem imun dan memperbanyak materi genetiknya secara pasif bersamaan dengan setiap siklus pembelahan mitosis sel inang tanpa merusak inangnya",
      "C. Provirus memiliki susunan nukleotida yang jauh lebih tahan panas dibanding partikel virion bebas",
      "D. Siklus lisogenik menghasilkan protein kapsid struktural dengan kecepatan transkripsi ganda",
      "E. Semua virus lisogenik dipastikan dapat langsung mengubah seluruh sel inang menjadi sel tumor"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Keunggulan evolusioner siklus lisogenik adalah latensi tersembunyi. Dengan menyisip ke genom sel inang, materi genetik virus ikut digandakan setiap kali sel inang membelah tanpa memicu respons imun sitotoksik karena tidak ada protein virus asing yang diekspresikan pada membran luar sel."
  },
  {
    id: 8,
    question: "Fag T4 bereplikasi melalui siklus litik cepat (menghasilkan ~100–200 fag baru dalam 25 menit), sedangkan HIV mengutamakan lisogenik dan dapat laten bertahun-tahun. Mengapa perbedaan strategi ini terjadi? Kaitkan dengan karakteristik INANG masing-masing virus!",
    options: [
      "A. Fag T4 lebih agresif semata-mata karena dimensi virionnya jauh lebih besar daripada HIV",
      "B. HIV harus laten karena genomnya memiliki ukuran yang jauh lebih panjang dari Fag T4",
      "C. Fag T4 menarget bakteri yang tidak memiliki sistem imun adaptif; sebaliknya HIV menarget sel imun manusia yang sangat tangguh sehingga strategi laten mutlak diperlukan untuk menghindari eliminasi imun sebelum transmisi",
      "D. Perbedaan ini terjadi karena materi genetik T4 adalah RNA sedangkan HIV dsDNA linear",
      "E. HIV menggunakan lisogenik karena limfosit T CD4+ membelah ribuan kali lebih cepat daripada bakteri E. coli"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Bakteri E. coli adalah sel prokariotik tunggal tanpa memori imun adaptif (hanya barier CRISPR), sehingga T4 mengandalkan strategi virulen lisis kilat. Sebaliknya, manusia memiliki sistem imun adaptif berbasis sel T sitotoksik dan antibodi; jika HIV langsung litik masif, inang akan cepat musnah atau virion bebas tereliminasi sebelum sempat menular."
  },
  {
    id: 9,
    question: "Seorang peneliti farmakologi merancang molekul obat yang secara spesifik menghambat aktivitas enzim Reverse Transcriptase (RT) HIV. Berdasarkan pemahaman tahapan lisogenik HIV, mengapa penghambatan enzim RT sangat efektif mencegah infeksi permanen?",
    options: [
      "A. Tanpa enzim RT yang fungsional, ssRNA HIV tidak dapat diubah menjadi cDNA/dsDNA sehingga enzim Integrase tidak memiliki substrat untuk disisipkan ke kromosom sel inang (provirus gagal terbentuk)",
      "B. RT adalah satu-satunya enzim yang dimiliki HIV sehingga penghambatannya menghentikan penempelan gp120",
      "C. Penghambatan RT secara langsung merusak amplop lipid bilayer HIV",
      "D. Tanpa RT, sel limfosit inang kehilangan kemampuan membelah",
      "E. RT bertugas menyintesis protein kapsid konik p24"
    ],
    correct: 0, // A
    feedback: "Benar! (Pilihan A). Langkah awal krusial siklus lisogenik HIV adalah mengubah ssRNA menjadi dsDNA proviral via Reverse Transcriptase. Obat golongan RT Inhibitor (seperti AZT, Lamivudine, Tenofovir) menghentikan polimerisasi DNA viral, sehingga tidak ada dsDNA yang bisa diintegrasikan ke kromosom inang oleh Integrase."
  },
  {
    id: 10,
    question: "Pada siklus litik Fag T4, tahap 'assembly' (perakitan) melibatkan sintesis kepala, ekor selubung kontraktil, baseplate, dan serabut ekor secara independen sebelum disatukan. Mengapa proses perakitan T4 jauh lebih rumit dibanding perakitan HIV yang hanya melibatkan pertunasan sederhana di membran?",
    options: [
      "A. Fag T4 memiliki ukuran genom lebih kecil sehingga kapsidnya harus dirakit dari luar",
      "B. Fag T4 memiliki morfologi kompleks (struktur kepala ikosahedral + ekor heliks kontraktil fungsional + baseplate + 6 fibers) yang masing-masing harus dirakit melalui jalur perakitan independen sebelum dihubungkan, berbeda dari HIV yang hanya butuh cangkang membran konsentris",
      "C. Perakitan T4 berlangsung di retikulum endoplasma bakteri yang tidak memiliki ribosom",
      "D. HIV lebih sederhana karena sel hewan tidak memiliki asam nukleat",
      "E. Kompleksitas T4 semata-mata karena virionnya tidak memiliki materi genetik di awal perakitan"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Fag T4 adalah salah satu virus dengan morfologi paling kompleks di dunia biologi. Ekor kontraktil T4 bertindak sebagai mesin injeksi mekanik presisi, sehingga lempeng dasar, tabung tengah, selubung heliks kontraktil, dan serabut ekor harus dirakit secara independen via jalur biokimia terpisah sebelum digabungkan dengan kepala berisi DNA."
  }
];

let quiz2CurrentIndex = 0;
let quiz2Answers = {};

function renderQuiz2Question() {
  const q = QUIZ2_QUESTIONS[quiz2CurrentIndex];
  document.getElementById("q2-num").innerText = quiz2CurrentIndex + 1;
  document.getElementById("q2-question").innerText = q.question;

  const optContainer = document.getElementById("q2-options");
  const hasAnswered = quiz2Answers[quiz2CurrentIndex] !== undefined;
  const selected = quiz2Answers[quiz2CurrentIndex];

  optContainer.innerHTML = q.options.map((opt, i) => {
    let cls = "option-btn";
    if (hasAnswered) {
      if (i === q.correct) cls += " selected-correct";
      else if (i === selected) cls += " selected-wrong";
    }
    return `
      <button class="${cls}" onclick="answerQuiz2(${i})" ${hasAnswered ? 'disabled' : ''}>
        ${opt}
      </button>
    `;
  }).join('');

  const fb = document.getElementById("q2-feedback");
  if (hasAnswered) {
    fb.className = `quiz-feedback show ${selected === q.correct ? 'feedback-correct' : 'feedback-wrong'}`;
    fb.innerHTML = `<strong>${selected === q.correct ? '✓ Jawaban Tepat!' : '✗ Jawaban Belum Tepat.'}</strong> ${q.feedback}`;
  } else {
    fb.className = "quiz-feedback";
    fb.innerHTML = "";
  }

  document.getElementById("btn-q2-prev").disabled = quiz2CurrentIndex === 0;
  document.getElementById("btn-q2-next").innerText = (quiz2CurrentIndex === QUIZ2_QUESTIONS.length - 1) ? "Lihat Hasil Asesmen" : "Selanjutnya →";
}

function answerQuiz2(idx) {
  if (quiz2Answers[quiz2CurrentIndex] !== undefined) return;
  quiz2Answers[quiz2CurrentIndex] = idx;
  renderQuiz2Question();
}

function navQuiz2(dir) {
  if (dir === 1 && quiz2CurrentIndex === QUIZ2_QUESTIONS.length - 1) {
    showQuiz2Results();
    return;
  }
  quiz2CurrentIndex += dir;
  renderQuiz2Question();
}

function showQuiz2Results() {
  document.getElementById("q2-card").style.display = "none";
  const resBox = document.getElementById("q2-result-box");
  resBox.style.display = "block";

  let score = 0;
  QUIZ2_QUESTIONS.forEach((q, i) => {
    if (quiz2Answers[i] === q.correct) score++;
  });

  document.getElementById("q2-result-score").innerText = `Skor Kamu: ${score} dari 5 Soal Benar`;
  const msg = document.getElementById("q2-result-msg");
  if (score >= 3) {
    unlockBadge(2);
    msg.innerHTML = `Luar biasa! Pemahamanmu mengenai dinamika replikasi litik vs lisogenik sangat solid. Kamu resmi meraih <strong style="color:#fff;">Badge 🧬 "Analis Replikasi"</strong>. Mari lanjutkan ke Modul 3 untuk mempelajari peranan virus dalam ekosistem dan kehidupan!`;
  } else {
    msg.innerHTML = `Kamu memperoleh ${score}/5. Syarat membuka Badge 🧬 adalah minimal 3/5 benar. Silakan review kembali animasi siklus replikasi dan coba lagi!`;
  }
}

function resetQuiz2() {
  quiz2Answers = {};
  quiz2CurrentIndex = 0;
  document.getElementById("q2-card").style.display = "block";
  document.getElementById("q2-result-box").style.display = "none";
  renderQuiz2Question();
}

// ========================================================
// MODUL 3: LOGIC & DATA
// ========================================================
let refleksiModul3Text = "";

function saveJurnalRefleksi() {
  const val = document.getElementById("jurnal-virus-input").value.trim();
  if (val) {
    refleksiModul3Text = val;
    document.getElementById("jurnal-saved-alert").style.display = "block";
    document.getElementById("refleksi-awal-display").innerText = `"${val}"`;
  }
}

const MAP_DATA = {
  diy: {
    title: "D.I. Yogyakarta (Program Wolbachia NEJM 2021)",
    cat: "Penelitian Pengendalian Biologis Vektor DBD",
    desc: "Pelepasan nyamuk Aedes aegypti ber-Wolbachia di Yogyakarta (Utarini dkk., 2021) menurunkan kasus DBD 77% dan rawat inap 86%. Menjadi rujukan ilmiah virologi internasional.",
    src: "Sumber: The New England Journal of Medicine (2021)"
  },
  jabar: {
    title: "Jawa Barat (Beban Kasus DBD Tahunan)",
    cat: "Endemisitas Demam Berdarah Dengue",
    desc: "Jawa Barat secara berkala mencatatkan jumlah kasus absolut DBD tertinggi di Indonesia (sering melampaui 20.000 kasus/tahun) karena kepadatan penduduk dan curah hujan tropis.",
    src: "Sumber: Profil Kesehatan Indonesia, Kemenkes RI (2023)"
  },
  ntt: {
    title: "Nusa Tenggara Timur (KLB Rabies 2023)",
    cat: "Kejadian Luar Biasa Zoonosis Rabies",
    desc: "KLB Rabies di Pulau Flores dan Lembata mencatat lebih dari 12.576 kasus gigitan hewan penular rabies (HPR). Mengingat transmisi retrograde aksonal, penyediaan VAR (Vaksin Anti Rabies) dan SAR sangat mendesak.",
    src: "Sumber: Laporan KLB Dinas Kesehatan Provinsi NTT (2023)"
  },
  bali: {
    title: "Bali (Wilayah Endemik Rabies)",
    cat: "Zoonosis Anjing Penular Rabies",
    desc: "Sejak KLB 2008, Bali terus menjalankan vaksinasi massal anjing liar dan anjing peliharaan sebagai reservoir utama guna mempertahankan herd immunity hewan.",
    src: "Sumber: Ditjen P2P Kemenkes RI"
  },
  dki: {
    title: "DKI Jakarta (Pusat Layanan ARV ODHA)",
    cat: "Epidemiologi HIV & Terapi Antiretroviral",
    desc: "Jakarta memiliki akses faskes penanganan HIV terlengkap dengan cakupan viral load testing dan terapi kombinasi ARV (HAART) pada lebih dari 70.000 ODHA terdata.",
    src: "Sumber: Laporan Perkembangan HIV/AIDS Kemenkes (2023)"
  },
  papua: {
    title: "Papua & Papua Pegunungan (Beban HIV Khusus)",
    cat: "Epidemi HIV Populasi Umum",
    desc: "Berbeda dari provinsi lain yang terkonsentrasi pada populasi kunci, epidemi HIV di Tanah Papua berada pada tingkat general epidemic (melibatkan populasi umum) dengan tantangan geografis faskes.",
    src: "Sumber: Komisi Penanggulangan AIDS (KPA) Nasional"
  },
  sumut: {
    title: "Sumatera Utara (Kluster H5N1 Karo 2006)",
    cat: "Kluster Keluarga Flu Burung Bersejarah",
    desc: "Kluster 8 kasus fatal H5N1 di Karo (2006) sempat memicu penyelidikan global mendalam terhadap kemungkinan transmisi terbatas antar-manusia (limited human-to-human transmission).",
    src: "Sumber: WHO Communicable Disease Surveillance Report (2006)"
  },
  tangerang: {
    title: "Tangerang Banten (Kasus Fatal H5N1 Pertama 2005)",
    cat: "Titik Awal Transmisi Zoonosis H5N1 ke Manusia",
    desc: "Kasus perdana flu burung pada manusia di Indonesia terkonfirmasi laboratorium pada Juli 2005 di Tangerang, mengawali kesiapsiagaan pandemi zoonotik nasional.",
    src: "Sumber: Badan Litbangkes Kemenkes RI"
  }
};

function showMapDetail(key) {
  const data = MAP_DATA[key];
  if (!data) return;
  const pop = document.getElementById("map-info-popup");
  pop.style.display = "block";
  document.getElementById("map-popup-title").innerText = data.title;
  document.getElementById("map-popup-category").innerText = data.cat;
  document.getElementById("map-popup-desc").innerText = data.desc;
  document.getElementById("map-popup-source").innerText = data.src;
}

function filterMap(type) {
  const dots = document.querySelectorAll(".map-province-dot");
  dots.forEach(d => {
    if (type === 'all' || d.getAttribute("data-type") === type) {
      d.style.display = "block";
    } else {
      d.style.display = "none";
    }
  });
}

// STORY RINA & DBD DATA
const STORY_DBD_PANELS = [
  {
    num: 1,
    time: "Hari 0 · Pagi Hari",
    title: "1. Gigitan Nyamuk di Yogyakarta",
    icon: "🦟",
    text: "Saat sedang belajar di sekolah di Yogyakarta, seekor nyamuk Aedes aegypti betina menggigit lengan Rina. Melalui kelenjar ludahnya, nyamuk menyuntikkan ribuan partikel virion Dengue langsung menembus kapiler dermis kulit."
  },
  {
    num: 2,
    time: "Hari 1 · Perjalanan ke Darah",
    title: "2. Virus Memasuki Aliran Darah",
    icon: "🩸",
    text: "Dimer protein E permukaan halus Dengue segera mengenali molekul reseptor heparan sulfat dan DC-SIGN pada sel dendritik epidermis (sel Langerhans) serta monosit darah tepi Rina."
  },
  {
    num: 3,
    time: "Hari 2–3 · Replikasi Intraseluler",
    title: "3. Pembajakan Retikulum Endoplasma",
    icon: "🏭",
    text: "Virion Dengue masuk via endositosis, melepaskan +ssRNA, dan membajak retikulum endoplasma monosit Rina untuk mereplikasi jutaan virion anakan. Pelepasan protein NS1 memicu aktivasi sistem komplemen."
  },
  {
    num: 4,
    time: "Hari 3–5 · Fase Demam Akut",
    title: "4. Demam Tinggi & Trombosit Turun",
    icon: "🌡️",
    text: "Rina mengalami demam mendadak 39°C disertai nyeri sendi hebat. Hasil tes laboratorium Puskesmas menunjukkan jumlah trombosit Rina mulai merosot turun di bawah 100.000/µL akibat kebocoran vaskular."
  },
  {
    num: 5,
    time: "Hari 5–6 · Fase Kritis di Puskesmas",
    title: "5. Perawatan Terhidrasi di Faskes",
    icon: "🏥",
    text: "Rina segera dirawat intensif di Puskesmas rawat inap dengan pemantauan cairan infus kristaloid ketat untuk mencegah sindrom syok dengue (DSS) saat suhu tubuh mulai turun (fase kritis)."
  },
  {
    num: 6,
    time: "Hari 7+ · Fase Pemulihan",
    title: "6. Sembuh Total Berkat Imunitas Adaptif",
    icon: "🛡️",
    text: "Sistem imun adaptif Rina (antibodi IgM & IgG penetralisir terhadap protein E serta sel limfosit T sitotoksik) berhasil membersihkan seluruh virion Dengue dari sirkulasi. Rina sembuh dengan imunitas seumur hidup terhadap serotipe tersebut!"
  }
];

let currentStoryIndex = 0;

function renderStoryPanel() {
  const panel = STORY_DBD_PANELS[currentStoryIndex];
  document.getElementById("story-panel-num").innerText = panel.num;
  document.getElementById("story-time-badge").innerText = panel.time;
  document.getElementById("story-panel-title").innerText = panel.title;
  document.getElementById("story-panel-text").innerText = panel.text;
  document.getElementById("story-icon").innerText = panel.icon;

  document.getElementById("btn-story-prev").disabled = (currentStoryIndex === 0);
  document.getElementById("btn-story-next").innerText = (currentStoryIndex === STORY_DBD_PANELS.length - 1) ? "Selesai Membaca Narasi ✓" : "Lanjut Panel Berikutnya →";
}

function navStory(dir) {
  if (dir === 1 && currentStoryIndex === STORY_DBD_PANELS.length - 1) {
    return;
  }
  currentStoryIndex += dir;
  renderStoryPanel();
}

// SORTER "MERUGIKAN ATAU MENGUNTUNGKAN?"
const PERANAN_ITEMS = [
  { id: "p1", title: "DBD (Demam Berdarah Dengue)", cat: "rugi" },
  { id: "p2", title: "COVID-19 (Pneumonia Akut)", cat: "rugi" },
  { id: "p3", title: "Rabies Ensefalitis Fatal", cat: "rugi" },
  { id: "p4", title: "HIV / Imunodefisiensi CD4+", cat: "rugi" },
  { id: "p5", title: "Influenza Pandemi (H5N1)", cat: "rugi" },
  { id: "p6", title: "HPV (Karsinoma Leher Rahim)", cat: "rugi" },
  { id: "p7", title: "Terapi Fag (Alternatif Antibiotik AMR)", cat: "untung" },
  { id: "p8", title: "Vaksin Berbasis Virus Lemah/Inaktif", cat: "untung" },
  { id: "p9", title: "Vektor Terapi Gen (Adenovirus/AAV)", cat: "untung" },
  { id: "p10", title: "Bioinsektisida Pembasmi Hama (Baculovirus)", cat: "untung" },
  { id: "p11", title: "TMV: Merusak Tembakau vs Model Riset Virologi Pertama Beijerinck 1898", cat: "konteks" }
];

let perananState = {};

function initPerananSorter() {
  const pool = document.getElementById("peran-pool");
  pool.innerHTML = "";
  document.getElementById("col-peran-rugi").innerHTML = "";
  document.getElementById("col-peran-untung").innerHTML = "";
  document.getElementById("col-peran-konteks").innerHTML = "";

  PERANAN_ITEMS.forEach(item => {
    perananState[item.id] = 'pool';
    const el = document.createElement("button");
    el.className = "btn btn-secondary btn-sm";
    el.id = "btn-peran-" + item.id;
    el.innerText = item.title;
    el.onclick = () => movePeranan(item.id);
    pool.appendChild(el);
  });
}

function movePeranan(id) {
  const cur = perananState[id];
  let next = 'rugi';
  if (cur === 'pool') next = 'rugi';
  else if (cur === 'rugi') next = 'untung';
  else if (cur === 'untung') next = 'konteks';
  else next = 'pool';

  perananState[id] = next;
  const btn = document.getElementById("btn-peran-" + id);

  if (next === 'pool') {
    document.getElementById("peran-pool").appendChild(btn);
    btn.className = "btn btn-secondary btn-sm";
  } else if (next === 'rugi') {
    document.getElementById("col-peran-rugi").appendChild(btn);
    btn.className = "btn btn-sm";
    btn.style.background = "rgba(244, 63, 94, 0.2)";
    btn.style.border = "1px solid #f43f5e";
    btn.style.color = "#fda4af";
  } else if (next === 'untung') {
    document.getElementById("col-peran-untung").appendChild(btn);
    btn.className = "btn btn-sm";
    btn.style.background = "rgba(16, 185, 129, 0.2)";
    btn.style.border = "1px solid #10b981";
    btn.style.color = "#6ee7b7";
  } else {
    document.getElementById("col-peran-konteks").appendChild(btn);
    btn.className = "btn btn-sm";
    btn.style.background = "rgba(56, 189, 248, 0.2)";
    btn.style.border = "1px solid #38bdf8";
    btn.style.color = "#7dd3fc";
  }
}

function resetPerananSorter() {
  initPerananSorter();
}

function submitBridgeEssayM3() {
  document.getElementById("bridge-essay-feedback").style.display = "block";
}

// ASESMEN FORMATIF 3 QUESTIONS (Bloom C2)
const QUIZ3_QUESTIONS = [
  {
    id: 11,
    question: "Pernyataan mana yang paling TEPAT dan ilmiah mengenai peran menguntungkan virus dalam kehidupan manusia?",
    options: [
      "A. Semua virus di muka bumi bersifat patogen berbahaya tanpa ada sisi positif",
      "B. Virus hanya bermanfaat jika sudah dimusnahkan seluruh protein amplopnya",
      "C. Bakteriofag dapat dimanfaatkan sebagai terapi fag untuk membunuh bakteri patogen yang kebal antibiotik, dan beberapa virus non-patogenik dimodifikasi menjadi vektor pengantar gen dalam terapi gen",
      "D. Virus hanya menguntungkan di lingkungan laboratorium kultur sel buatan, tidak di alam liar",
      "E. Virus yang menguntungkan adalah virus yang telah diubah menjadi bakteri"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Di bidang bioteknologi kesehatan modern, bakteriofag digunakan dalam phage therapy untuk membunuh bakteri resisten antibiotik, adenovirus/AAV digunakan sebagai vektor terapi gen pengantar materi genetik terapeutik, dan baculovirus digunakan sebagai bioinsektisida ramah lingkungan."
  },
  {
    id: 12,
    question: "Demam Berdarah Dengue (DBD) adalah penyakit endemik di seluruh wilayah Indonesia. Mengapa DBD tidak dapat ditularkan secara langsung dari orang ke orang melalui droplet batuk/bicara seperti virus flu atau COVID-19?",
    options: [
      "A. Karena virus Dengue terlalu kecil sehingga langsung jatuh ke tanah",
      "B. Virus Dengue membutuhkan vektor biologis nyamuk Aedes aegypti — protein E Dengue berevolusi mengikat reseptor di kelenjar ludah nyamuk dan sel monosit darah, serta tidak memiliki afinitas terhadap epitel saluran napas manusia untuk transmisi droplet",
      "C. Virus Dengue langsung mengalami inaktivasi begitu terkena oksigen udara terbuka",
      "D. Sistem imun pernapasan manusia selalu memproduksi enzim pemecah protein E di tenggorokan",
      "E. Virion Dengue hanya bisa bertahan di dalam air tawar bersih"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Setiap virus memiliki tropisme jaringan inang spesifik yang ditentukan oleh protein permukaannya. Protein E Dengue berikatan dengan reseptor sel kelenjar saliva nyamuk dan monosit manusia di peredaran darah, bukan pada sel bersilia epitel hidung/paru, sehingga transmisi droplet dari manusia ke manusia mustahil terjadi."
  },
  {
    id: 13,
    question: "Tobacco Mosaic Virus (TMV) menyebabkan penyakit mosaik parah pada tanaman tembakau dan tomat di Indonesia. Mengapa petani yang memanen daun tembakau terinfeksi TMV setiap hari sama sekali tidak tertular penyakit mosaik pada organ tubuhnya?",
    options: [
      "A. Coat protein TMV tidak memiliki domain pengenal reseptor pada sel mamalia — tanpa proses attachment spesifik, virus tidak dapat menginisiasi infeksi ke sel manusia",
      "B. TMV langsung hancur karena suhu kulit tangan manusia terlalu panas",
      "C. Semua petani memiliki antibodi alami bawaan terhadap seluruh virus tanaman",
      "D. Ukuran TMV (300 nm) terlalu besar untuk masuk ke pori-pori kulit",
      "E. TMV hanya dapat aktif jika sel target memiliki pigmen fotosintesis kloroplas"
    ],
    correct: 0, // A
    feedback: "Benar! (Pilihan A). Keberhasilan awal infeksi virus bersandar pada interaksi spesifik ligand-reseptor (kunci dan gembok). Subunit Coat Protein TMV berevolusi mengenali luka mekanik dinding sel tumbuhan, dan tidak memiliki konformasi protein yang mampu menempel pada reseptor membran sel manusia."
  },
  {
    id: 14,
    question: "Program Wolbachia di Yogyakarta berhasil menurunkan kasus DBD hingga 77% (Utarini et al., 2021, NEJM). Bakteri Wolbachia dimasukkan ke dalam telur nyamuk Aedes aegypti untuk menghambat replikasi virus Dengue. Pendekatan ini merupakan contoh nyata dari...",
    options: [
      "A. Pembuatan vaksin genetik mRNA pada manusia",
      "B. Terapi gen penggantian kromosom somatik",
      "C. Pengendalian vektor secara biologis (biological control) — memanfaatkan interaksi mikroorganisme alami untuk memutus kompetensi transmisi virus",
      "D. Produksi antibodi monoklonal sintetis skala industri",
      "E. Pengembangan obat antivirus inhibitor polimerase baru"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Wolbachia adalah metode biokontrol (pengendalian hayati). Bakteri Wolbachia hidup sebagai endosimbion alami di dalam sel nyamuk Aedes aegypti, bersaing memperebutkan nutrisi esensial (lipid) dengan virus Dengue sehingga virus tidak mampu bereplikasi dan tidak bisa ditularkan ke manusia."
  },
  {
    id: 15,
    question: "HIV secara selektif menginfeksi dan melumpuhkan limfosit T CD4+. Mengapa penurunan jumlah sel CD4+ ini berakibat fatal bagi kelangsungan hidup penderita AIDS?",
    options: [
      "A. Sel CD4+ adalah koordinator (jenderal) utama respons imun adaptif yang memicu sel B memproduksi antibodi dan mengaktivasi sel T sitotoksik CD8+ — kelumpuhannya membuat tubuh rentan terhadap berbagai infeksi oportunistik",
      "B. Sel CD4+ adalah satu-satunya sel tubuh yang dapat menyintesis hemoglobin darah",
      "C. Sel CD4+ berfungsi menyaring racun di organ hati",
      "D. Tanpa CD4+, sel darah putih lain langsung membelah tanpa kendali menjadi kanker darah",
      "E. Sel CD4+ memproduksi seluruh hormon metabolik di kelenjar tiroid"
    ],
    correct: 0, // A
    feedback: "Benar! (Pilihan A). Limfosit T-helper (CD4+) memegang peranan sentral sebagai pengarah imunitas adaptif. Hancurnya sel CD4+ (<200 sel/µL darah) melumpuhkan komunikasi sitokin ke sel B dan sel T sitotoksik, menyebabkan pasien AIDS meninggal bukan oleh virus HIV itu sendiri, melainkan oleh infeksi oportunistik sekunder (seperti tuberkulosis, pneumonia jamur, atau toksoplasmosis)."
  }
];

let quiz3CurrentIndex = 0;
let quiz3Answers = {};

function renderQuiz3Question() {
  const q = QUIZ3_QUESTIONS[quiz3CurrentIndex];
  document.getElementById("q3-num").innerText = quiz3CurrentIndex + 1;
  document.getElementById("q3-question").innerText = q.question;

  const optContainer = document.getElementById("q3-options");
  const hasAnswered = quiz3Answers[quiz3CurrentIndex] !== undefined;
  const selected = quiz3Answers[quiz3CurrentIndex];

  optContainer.innerHTML = q.options.map((opt, i) => {
    let cls = "option-btn";
    if (hasAnswered) {
      if (i === q.correct) cls += " selected-correct";
      else if (i === selected) cls += " selected-wrong";
    }
    return `
      <button class="${cls}" onclick="answerQuiz3(${i})" ${hasAnswered ? 'disabled' : ''}>
        ${opt}
      </button>
    `;
  }).join('');

  const fb = document.getElementById("q3-feedback");
  if (hasAnswered) {
    fb.className = `quiz-feedback show ${selected === q.correct ? 'feedback-correct' : 'feedback-wrong'}`;
    fb.innerHTML = `<strong>${selected === q.correct ? '✓ Jawaban Tepat!' : '✗ Jawaban Belum Tepat.'}</strong> ${q.feedback}`;
  } else {
    fb.className = "quiz-feedback";
    fb.innerHTML = "";
  }

  document.getElementById("btn-q3-prev").disabled = quiz3CurrentIndex === 0;
  document.getElementById("btn-q3-next").innerText = (quiz3CurrentIndex === QUIZ3_QUESTIONS.length - 1) ? "Lihat Hasil Asesmen" : "Selanjutnya →";
}

function answerQuiz3(idx) {
  if (quiz3Answers[quiz3CurrentIndex] !== undefined) return;
  quiz3Answers[quiz3CurrentIndex] = idx;
  renderQuiz3Question();
}

function navQuiz3(dir) {
  if (dir === 1 && quiz3CurrentIndex === QUIZ3_QUESTIONS.length - 1) {
    showQuiz3Results();
    return;
  }
  quiz3CurrentIndex += dir;
  renderQuiz3Question();
}

function showQuiz3Results() {
  document.getElementById("q3-card").style.display = "none";
  const resBox = document.getElementById("q3-result-box");
  resBox.style.display = "block";

  let score = 0;
  QUIZ3_QUESTIONS.forEach((q, i) => {
    if (quiz3Answers[i] === q.correct) score++;
  });

  document.getElementById("q3-result-score").innerText = `Skor Kamu: ${score} dari 5 Soal Benar`;
  const msg = document.getElementById("q3-result-msg");
  if (score >= 3) {
    unlockBadge(3);
    msg.innerHTML = `Hebat! Pemahaman ekologis dan kontekstualmu mengenai peranan virus di Indonesia sangat baik. Kamu resmi memperoleh <strong style="color:#fff;">Badge 🌐 "Ahli Ekologi Virus"</strong>. Sekarang bersiaplah melangkah ke Modul 4 untuk mengevaluasi solusi pencegahan tingkat epidemiolog!`;
  } else {
    msg.innerHTML = `Kamu memperoleh ${score}/5. Syarat membuka Badge 🌐 adalah minimal 3/5 benar. Silakan telaah kembali peta epidemiologi Indonesia dan ulangi asesmen!`;
  }
}

function resetQuiz3() {
  quiz3Answers = {};
  quiz3CurrentIndex = 0;
  document.getElementById("q3-card").style.display = "block";
  document.getElementById("q3-result-box").style.display = "none";
  renderQuiz3Question();
}

// ========================================================
// MODUL 4: LOGIC & DATA
// ========================================================
let selectedCERArticle = 1;

function switchCERArticle(artNum) {
  selectedCERArticle = artNum;
  [1, 2, 3].forEach(n => {
    const btn = document.getElementById("btn-cer-" + n);
    if (btn) btn.className = (n === artNum) ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm";
  });
  document.getElementById("cer-claim-input").value = "";
  document.getElementById("cer-evidence-input").value = "";
  document.getElementById("cer-reasoning-input").value = "";
  document.getElementById("cer-eval-feedback").style.display = "none";
}

function evaluateCER() {
  const c = document.getElementById("cer-claim-input").value.trim();
  const e = document.getElementById("cer-evidence-input").value.trim();
  const r = document.getElementById("cer-reasoning-input").value.trim();
  const fb = document.getElementById("cer-eval-feedback");
  fb.style.display = "block";

  if (!c || !e || !r) {
    fb.className = "quiz-feedback show feedback-wrong";
    fb.innerHTML = `<strong>Scaffold CER Belum Lengkap!</strong> Pastikan kamu telah mengisi ketiga komponen (Claim, Evidence data numerik, dan Reasoning penalaran biologis) sebelum mengevaluasi.`;
    return;
  }

  fb.className = "quiz-feedback show feedback-correct";
  if (selectedCERArticle === 1) {
    fb.innerHTML = `<strong>Analisis CER Artikel 1 (Wolbachia) Tervalidasi!</strong><br/>
      • <strong>Claim:</strong> Pelepasan nyamuk Aedes aegypti ber-Wolbachia efektif menekan transmisi DBD secara signifikan.<br/>
      • <strong>Evidence:</strong> Studi Utarini et al. (NEJM 2021) membuktikan penurunan kasus DBD sebesar 77% dan rawat inap rumah sakit sebesar 86% di Yogyakarta.<br/>
      • <strong>Reasoning:</strong> Bakteri Wolbachia berkompetisi memperebutkan molekul lipid inang di dalam sel nyamuk sehingga virus Dengue kekurangan bahan baku replikasi dan gagal mencapai kelenjar ludah vektor.`;
  } else if (selectedCERArticle === 2) {
    fb.innerHTML = `<strong>Analisis CER Artikel 2 (Vaksinasi & Mutasi) Tervalidasi!</strong><br/>
      • <strong>Claim:</strong> Vaksinasi efektif mereduksi keparahan infeksi namun perlu pembaruan berkala terhadap varian mutasi.<br/>
      • <strong>Evidence:</strong> Kemenkes (2022) mencatat proteksi >85% hospitalisasi, namun mutasi E484K/N501Y menurunkan afinitas netralisasi antibodi hingga berlipat.<br/>
      • <strong>Reasoning:</strong> Meskipun antibodi netralisasi menurun pada epitop Spike yang bermutasi, sel limfosit T memori tetap mengenali epitop konservasi lainnya sehingga perlindungan terhadap kematian tetap terjaga.`;
  } else {
    fb.innerHTML = `<strong>Analisis CER Artikel 3 (Fogging vs Larvasida) Tervalidasi!</strong><br/>
      • <strong>Claim:</strong> Larvasida + 3M Plus jauh lebih berkelanjutan daripada fogging massal untuk pencegahan jangka panjang.<br/>
      • <strong>Evidence:</strong> WHO (2012) mengklasifikasikan fogging hanya sebagai respons darurat wabah karena residu kimia cepat hilang dan larva tetap bertahan di air.<br/>
      • <strong>Reasoning:</strong> Fogging hanya mematikan nyamuk dewasa yang terbang di udara saat pengasapan, sementara jentik di penampungan air akan menetas menjadi nyamuk baru dalam beberapa hari (rebound kasus).`;
  }
}

// SIMULASI EPIDEMIOLOG LOGIC
let simBudget = 100;
const STRATEGY_COSTS = {
  fogging: 30,
  larva: 20,
  vaksin: 40,
  wolbachia: 50,
  edukasi: 15
};

function updateSimulation() {
  const fog = document.getElementById("sim-toggle-fogging").checked;
  const lar = document.getElementById("sim-toggle-larva").checked;
  const vak = document.getElementById("sim-toggle-vaksin").checked;
  const wol = document.getElementById("sim-toggle-wolbachia").checked;
  const edu = document.getElementById("sim-toggle-edukasi").checked;

  let totalCost = 0;
  if (fog) totalCost += STRATEGY_COSTS.fogging;
  if (lar) totalCost += STRATEGY_COSTS.larva;
  if (vak) totalCost += STRATEGY_COSTS.vaksin;
  if (wol) totalCost += STRATEGY_COSTS.wolbachia;
  if (edu) totalCost += STRATEGY_COSTS.edukasi;

  const rem = 100 - totalCost;
  const disp = document.getElementById("sim-budget-display");
  disp.innerText = rem;

  if (rem < 0) {
    disp.style.color = "#f43f5e";
    disp.innerText = `${rem} (Anggaran Melebihi Batas!)`;
  } else {
    disp.style.color = "#38bdf8";
  }

  renderSIRGraph(fog, lar, vak, wol, edu, rem);
}

function renderSIRGraph(fog, lar, vak, wol, edu, rem) {
  const container = document.getElementById("sim-graph-container");
  const outcome = document.getElementById("sim-outcome-box");

  // Generate realistic SIR curve data points (16 weeks)
  let infectedPoints = [];
  let maxPeak = 500;

  // Base epidemic without intervention
  let baseCurve = [500, 680, 850, 980, 1100, 950, 780, 600, 450, 320, 240, 180, 140, 110, 90, 80];

  if (rem < 0) {
    outcome.innerHTML = `<span style="color:#f43f5e; font-weight:700;">⚠️ Defisit Anggaran!</span> Kebijakan tidak dapat diimplementasikan karena melebihi total plafon anggaran APBD Kota Yogyakarta (100 poin). Batalkan salah satu strategi untuk menyeimbangkan neraca.`;
    container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f43f5e;">Alokasi melebihi batas anggaran!</div>`;
    return;
  }

  // Calculate intervention effects
  let curve = [...baseCurve];

  if (fog) {
    // Immediate drop weeks 1-2, then rebound weeks 4-6 if not combined with larvicide
    curve = curve.map((v, i) => {
      if (i <= 2) return Math.round(v * 0.4);
      if (i <= 6 && !lar && !wol) return Math.round(v * 1.15); // Rebound!
      return Math.round(v * 0.7);
    });
  }

  if (lar) {
    // Steady decline from week 2
    curve = curve.map((v, i) => i > 1 ? Math.round(v * (edu ? 0.45 : 0.65)) : v);
  }

  if (vak) {
    // Protects individuals steadily
    curve = curve.map(v => Math.round(v * 0.7));
  }

  if (wol) {
    // Delayed effect (weeks 1-4 high), then permanent 77% drop after week 6
    curve = curve.map((v, i) => {
      if (i < 4) return v;
      if (i < 8) return Math.round(v * 0.5);
      return Math.round(v * 0.23); // 77% reduction permanently!
    });
  }

  if (edu && !lar && !fog && !vak && !wol) {
    curve = curve.map((v, i) => i > 4 ? Math.round(v * 0.8) : v);
  }

  // Convert to SVG polyline coordinates
  const w = 700;
  const h = 180;
  const maxVal = 1200;
  const pts = curve.map((val, idx) => {
    const x = Math.round((idx / 15) * (w - 40) + 20);
    const y = Math.round(h - (val / maxVal) * (h - 20) - 10);
    return `${x},${y}`;
  }).join(' ');

  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:100%;">
      <!-- Grid lines -->
      <line x1="20" y1="20" x2="${w-20}" y2="20" stroke="#1e293b" stroke-width="1"/>
      <line x1="20" y1="80" x2="${w-20}" y2="80" stroke="#1e293b" stroke-width="1"/>
      <line x1="20" y1="140" x2="${w-20}" y2="140" stroke="#1e293b" stroke-width="1"/>
      <line x1="20" y1="${h-10}" x2="${w-20}" y2="${h-10}" stroke="#334155" stroke-width="1.5"/>

      <!-- Peak Reference Text -->
      <text x="25" y="32" fill="#64748b" font-size="9" font-family="monospace">1.000 Kasus</text>
      <text x="25" y="92" fill="#64748b" font-size="9" font-family="monospace">500 Kasus</text>
      <text x="25" y="${h-15}" fill="#64748b" font-size="9" font-family="monospace">Minggu 0 (Awal)</text>
      <text x="${w-110}" y="${h-15}" fill="#64748b" font-size="9" font-family="monospace">Minggu 16 (Akhir)</text>

      <!-- Infected Curve Line -->
      <polyline points="${pts}" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  // Textual analysis of the chosen policy
  if (!fog && !lar && !vak && !wol && !edu) {
    outcome.innerHTML = `<strong>Status Wabah: Tanpa Intervensi!</strong> Kasus melonjak tajam hingga mencapai puncak >1.100 kasus pada minggu ke-5, menyebabkan fasilitas IGD rumah sakit kolaps.`;
  } else if (fog && !lar && !wol) {
    outcome.innerHTML = `<strong>Hasil Intervensi Fogging Tunggal:</strong> Kasus turun drastis di 2 minggu pertama, namun terjadi <em>epidemic rebound</em> pada minggu ke-5 karena jentik di selokan dan bak air tetap menetas menjadi nyamuk dewasa baru! Sesuai peringatan WHO (2012).`;
  } else if (wol && (lar || edu)) {
    outcome.innerHTML = `<strong>Kombinasi Emas Epidemiologi!</strong> Pengendalian jentik/edukasi menahan laju penularan di bulan-bulan awal, sementara nyamuk Wolbachia berhasil berkembang biak mantap dan menurunkan kasus secara permanen hingga 77% setelah bulan ke-3. Hasil sangat berkelanjutan!`;
  } else if (wol) {
    outcome.innerHTML = `<strong>Wolbachia Deployment:</strong> Memerlukan waktu pembiakan di 4 minggu awal, namun setelah minggu ke-8 kurva penularan anjlok permanen hingga >75% tanpa risiko ketergantungan semprotan kimiawi.`;
  } else if (lar && edu) {
    outcome.innerHTML = `<strong>Larvasida + Edukasi 3M Plus:</strong> Solusi sangat hemat anggaran yang efektif menurunkan populasi vektor secara stabil dari stadium akuatik, asalkan kader Jumantik warga konsisten memeriksa penampungan air.`;
  } else {
    outcome.innerHTML = `<strong>Kebijakan Terpilih:</strong> Penurunan kasus tercapai dengan berbagai trade-off biaya dan waktu. Evaluasilah apakah strategi ini memberikan dampak terpanjang bagi warga Kota Yogyakarta.`;
  }
}

function saveC5Evaluation() {
  const val = document.getElementById("eval-c5-essay").value.trim();
  if (val) {
    document.getElementById("eval-c5-alert").style.display = "inline";
  }
}

// ASESMEN SUMATIF KOMPREHENSIF (10 SOAL BLOOM C4–C5)
const QUIZ_SUMATIF_QUESTIONS = [
  {
    id: 16,
    question: "Mutasi N501Y pada protein Spike SARS-CoV-2 terbukti meningkatkan afinitas ikatan terhadap reseptor ACE2 sel inang hingga berkali lipat. Dari perspektif evolusi molekuler virus, mengapa mutasi ini sangat menguntungkan bagi kelangsungan hidup virus meskipun tidak selalu menyebabkan penyakit yang lebih mematikan?",
    options: [
      "A. Mutasi N501Y membuat virion tahan terhadap deterjen dan suhu panas lingkungan",
      "B. Afinitas ikatan yang lebih tinggi terhadap ACE2 memungkinkan virion menginfeksi sel target secara efisien pada dosis paparan (viral load) yang lebih rendah, mempermudah transmisi antar-inang dan memperluas keberhasilan replikasi evolusioner di populasi",
      "C. Mutasi N501Y memperpanjang ukuran fisik spikula Spike agar menjangkau jaringan tubuh yang lebih dalam",
      "D. Virus yang membunuh inangnya lebih cepat selalu memiliki keunggulan evolusi tertinggi",
      "E. N501Y hanya berfungsi jika virus berada di dalam tubuh inang reservoir kelelawar"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Dalam biologi evolusi, 'keberhasilan adaptif' (fitness) virus diukur dari laju transmisi reproduktif (R0) dan penyebarannya ke inang baru. Mutasi N501Y meningkatkan afinitas RBD-ACE2, membuat transmisi terjadi lebih mudah bahkan dengan dosis aerosol rendah, menjamin kelestarian garis keturunan genetik virus di populasi."
  },
  {
    id: 17,
    question: "Program Wolbachia di Yogyakarta berhasil menurunkan kasus DBD sebesar 77% (Utarini et al., 2021). Fogging massal insektisida sering dituntut warga saat terjadi lonjakan demam berdarah. Evaluasi perbandingan efektivitas kedua pendekatan ini untuk kebijakan penanggulangan jangka panjang di Indonesia!",
    options: [
      "A. Fogging lebih unggul karena dampaknya langsung terasa saat itu juga dan disukai masyarakat",
      "B. Wolbachia lebih unggul semata-mata karena biaya pembuatannya lebih murah daripada bensin fogging",
      "C. Wolbachia jauh lebih unggul untuk pencegahan jangka panjang karena menyasar kapasitas biologis nyamuk mentransmisikan virus secara permanen lintas generasi nyamuk, sedangkan fogging hanya respons darurat yang membunuh nyamuk dewasa sesaat tanpa mematikan jentik/telur dan berisiko memicu resistensi insektisida",
      "D. Kedua metode memiliki efektivitas yang persis identik di semua kondisi epidemiologi",
      "E. Fogging lebih baik karena Wolbachia telah dilarang oleh organisasi kesehatan dunia"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Evaluasi ilmiah menunjukkan Wolbachia mewariskan sifat resistensi virus secara vertikal ke keturunan nyamuk berikutnya (efek proteksi permanen). Sebaliknya, fogging hanya mematikan sebagian nyamuk dewasa di udara, menyisakan ribuan jentik di air yang akan menetas beberapa hari kemudian (efek sesaat)."
  },
  {
    id: 18,
    question: "Seorang Kepala Dinas Kesehatan Kabupaten memiliki alokasi anggaran terbatas dan harus menetapkan satu pilihan kebijakan: (A) Melakukan 1 kali putaran fogging massal di seluruh kecamatan, atau (B) Mendistribusikan larvasida temephos (abate) ke seluruh dasawisma disertai penguatan gerakan PSN 3M Plus. Berdasarkan telaah bukti ilmiah, rekomendasi mana yang paling tepat dan apa alasannya?",
    options: [
      "A. Strategi A, karena asap pengasapan terlihat nyata oleh masyarakat sehingga menaikkan citra pemerintah daerah",
      "B. Strategi B, karena larvasida dan 3M Plus memutus daur hidup nyamuk sejak stadium pradewasa (akuatik) di tempat perindukan air secara langsung dan membangun perilaku pencegahan mandiri warga yang berkesinambungan",
      "C. Strategi A jika musim kemarau, Strategi B jika musim hujan lebat",
      "D. Kedua strategi sama sekali tidak efektif tanpa adanya vaksin impor",
      "E. Strategi B hanya efektif di kawasan perkotaan megapolitan, tidak relevan untuk pedesaan"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Pengendalian stadium akuatik (jentik) melalui larvasida dan PSN 3M Plus jauh lebih efektif memangkas densitas populasi nyamuk sebelum mereka mencapai stadium dewasa yang mampu menghisap darah dan menularkan virus Dengue."
  },
  {
    id: 19,
    question: "Vaksin COVID-19 dirancang berbasis Spike protein SARS-CoV-2. Kemunculan varian baru dengan mutasi E484K pada domain RBD dikaitkan dengan penurunan efektivitas netralisasi antibodi serum darah. Evaluasi implikasi temuan virologi ini terhadap strategi vaksinasi nasional!",
    options: [
      "A. Vaksinasi harus segera dihentikan karena vaksin menjadi sama sekali tidak berguna",
      "B. Masyarakat cukup mengonsumsi antibiotik dosis tinggi pengganti vaksin",
      "C. Meskipun netralisasi antibodi menurun parsial terhadap varian E484K, vaksinasi tetap krusial dipertahankan karena sel T memori mengenali epitop Spike yang terkonservasi untuk mencegah hospitalisasi berat dan kematian; solusinya adalah pembaruan formula booster vaksin secara berkala (seperti vaksin flu musiman)",
      "D. Seluruh warga harus diisolasi total tanpa batas waktu hingga virus berhenti bermutasi",
      "E. Varian mutasi membuktikan bahwa virus telah berubah menjadi bakteri"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Sistem imun adaptif memiliki dua pilar: imunitas humoral (antibodi) dan imunitas seluler (sel T CD4+/CD8+). Meskipun mutasi E484K mengurangi ikatan antibodi netralisasi pada satu epitop spesifik, sel limfosit T memori tetap mengenali puluhan epitop Spike lainnya, mempertahankan perlindungan terhadap gejala klinis parah dan kematian."
  },
  {
    id: 20,
    question: "Seorang siswa berpendapat: 'Cara tercepat dan paling manjur untuk menyembuhkan semua penderita infeksi virus adalah dengan memberikan antibiotik amoksisilin dosis tinggi kepada setiap pasien.' Evaluasi kekeliruan argumen siswa tersebut menggunakan prinsip biologi sel dan struktur virus!",
    options: [
      "A. Argumen tersebut benar jika antibiotik diminum bersama vitamin C",
      "B. Argumen tersebut benar hanya untuk virus yang memiliki amplop lipid ganda",
      "C. Argumen tersebut salah total. Antibiotik secara spesifik hanya menarget komponen sel prokariot bakteri (seperti biosintesis peptidoglikan dinding sel dan ribosom 70S) yang tidak dimiliki oleh virus. Virus membajak mesin sel inang; terapi untuk virus adalah antivirus spesifik atau vaksinasi pencegahan",
      "D. Antibiotik bekerja membunuh virus RNA, namun tidak aktif pada virus DNA",
      "E. Antibiotik efektif jika disuntikkan langsung ke dalam aliran darah"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Virus bersifat aseluler (tidak memiliki dinding sel peptidoglikan, membran sel mandiri, maupun ribosom sendiri). Antibiotik bekerja merusak struktur khusus bakteri; pemberian antibiotik pada infeksi virus (seperti flu, DBD, atau rabies) sama sekali tidak membunuh virus, justru memicu bahaya resistensi bakteri (AMR)."
  },
  {
    id: 21,
    question: "Seorang peneliti farmakologi ingin merancang molekul antivirus yang menghambat tahap perakitan ('assembly'). Di antara virus-virus berikut, virion mana yang proses perakitannya paling kompleks dan memerlukan jalur biokimia independen paling banyak sebelum disatukan?",
    options: [
      "A. Virus Dengue (DENV)",
      "B. Bakteriofag T4 — karena memiliki arsitektur kompleks (kepala ikosahedral, selubung ekor kontraktil, lempeng dasar heksagonal, dan 6 serabut ekor yang disintesis di jalur independen)",
      "C. Tobacco Mosaic Virus (TMV) yang hanya terdiri dari pengulangan satu jenis coat protein",
      "D. Virus Rabies (RABV)",
      "E. Virus Influenza A"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Fag T4 memiliki morfologi kompleks dengan lebih dari 40 protein struktural berbeda. Jalur perakitan kepala, tabung ekor kontraktil, baseplate, dan serabut ekor berlangsung secara mandiri melalui serangkaian intermediat sebelum digabungkan menjadi virion utuh."
  },
  {
    id: 22,
    question: "Mengapa virus Rabies (RABV) hampir selalu 100% berakibat fatal begitu gejala klinis neurologis muncul dibanding COVID-19 yang juga dapat memicu badai sitokin berat di organ paru? Kaitkan dengan barier sistem imun dan jalur perjalanan virus!",
    options: [
      "A. Rabies memiliki ukuran virion yang jauh lebih besar daripada SARS-CoV-2",
      "B. RABV bermigrasi menuju SSP secara eksklusif melalui transpor aksonal retrograde di dalam sitoplasma neuron — terlindung dari paparan antibodi darah dan terlindung di balik barier darah-otak (blood-brain barrier) yang menghalangi masuknya obat dan antibodi begitu virus menginvasi otak",
      "C. Rabies tidak memiliki vaksin pencegahan",
      "D. Virus COVID-19 tidak bereplikasi di dalam sel manusia",
      "E. Rabies menyerang sumsum tulang belakang dan menghentikan pembentukan darah"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Jalur retrograde axonal transport memungkinkan partikel RABV 'merayap' di dalam akson neuron motorik dari luka gigitan menuju medula spinalis dan otak tanpa pernah keluar ke aliran darah sirkulasi. Begitu mencapai sistem saraf pusat, barier darah-otak mencegah molekul obat dan antibodi besar menembus masuk, memicu ensefalitis fatal."
  },
  {
    id: 23,
    question: "Program Imunisasi HPV Nasional Indonesia saat ini difokuskan pada siswi perempuan kelas 5–6 SD. Seorang pemerhati kesehatan mengusulkan perluasan vaksinasi HPV juga kepada remaja laki-laki. Evaluasi pertimbangan ilmiah biologis dan kesehatan masyarakat yang mendasari usulan tersebut!",
    options: [
      "A. Tidak relevan karena laki-laki tidak memiliki rahim sehingga mustahil terinfeksi virus HPV",
      "B. Vaksin HPV berbahaya jika diberikan kepada individu berjenis kelamin laki-laki",
      "C. Usulan ini sangat beralasan secara virologi: HPV-16/18 juga menyebabkan kanker orofaring, kanker anus, dan kanker penis pada laki-laki, serta laki-laki bertindak sebagai agen transmisi seksual virus ke perempuan; vaksinasi pada laki-laki mempercepat terbentuknya herd immunity populasi",
      "D. Laki-laki hanya perlu divaksin jika mereka telah berusia di atas 50 tahun",
      "E. Vaksin HPV pada laki-laki harus menggunakan dosis sepuluh kali lipat"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Meskipun kanker serviks hanya terjadi pada wanita, infeksi onkogenik HPV-16 dan HPV-18 pada laki-laki terbukti memicu kanker rongga mulut/faring, anus, dan genital. Selain itu, vaksinasi pada remaja laki-laki memutus rantai transmisi seksual ke perempuan, mempercepat perlindungan kekebalan kelompok (herd immunity)."
  },
  {
    id: 24,
    question: "Dalam penanganan klinis infeksi HIV/AIDS, mengapa protokol pengobatan standar dunia mewajibkan penggunaan kombinasi tiga jenis obat antiretroviral (HAART) sekaligus (misal: 2 NRTI + 1 NNRTI/Integrase Inhibitor), bukan monoterapi satu jenis obat saja?",
    options: [
      "A. Karena satu jenis obat ARV tidak memiliki efek farmakologis apa pun",
      "B. Enzim Reverse Transcriptase HIV tidak memiliki aktivitas proofreading sehingga laju mutasinya sangat tinggi; monoterapi akan cepat memicu seleksi mutan resisten, sedangkan terapi kombinasi menarget beberapa tahapan siklus hidup virus sekaligus untuk menekan replikasi hingga tak terdeteksi",
      "C. Kombinasi obat dimaksudkan untuk mempercepat fusi virus ke sel CD4+",
      "D. Tiga obat diperlukan karena HIV memiliki tiga jenis materi genetik yang berbeda",
      "E. Terapi kombinasi bertujuan melisiskan seluruh sel CD4+ yang ada di tubuh pasien"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Reverse Transcriptase HIV sangat rentan salah salin (error-prone) tanpa mekanisme proofreading 3'→5' exonuclease, menghasilkan ribuan quasispecies mutan setiap hari. Terapi kombinasi (HAART) menghambat beberapa target enzimatik (RT + Integrase + Protease) secara simultan, sehingga probabilitas virus bermutasi tahan terhadap ketiga target sekaligus menjadi sangat kecil."
  },
  {
    id: 25,
    question: "Berdasarkan seluruh prinsip virologi yang telah kamu pelajari di Modul 1 sampai Modul 4, manakah sintesis pernyataan yang paling tepat menggambarkan korelasi antara STRUKTUR VIRUS, MEKANISME REPLIKASI, dan STRATEGI PENCEGAHAN yang efektif?",
    options: [
      "A. Struktur virus tidak memiliki kaitan apa pun dengan strategi pencegahan penyakit",
      "B. Semua virus non-amplop dapat dimusnahkan hanya dengan cairan sanitizer alkohol 70%",
      "C. Struktur protein permukaan virion menentukan reseptor target dan cara masuk sel inang, tipe materi genetik menentukan jalur replikasi intraselulernya, dan pemahaman komprehensif terhadap keduanya menjadi dasar rasional perancangan target vaksin (protein permukaan), obat antivirus (inhibitor enzim unik), serta intervensi vektor penularan (seperti biokontrol Wolbachia)",
      "D. Seluruh jenis virus selalu dapat dicegah menggunakan satu formula vaksin universal tunggal",
      "E. Strategi pencegahan selalu identik sama untuk semua virus asalkan memiliki ukuran nanometer yang setara"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Inilah inti pemikiran analitis Bloom C5: Struktur virus (ligand permukaan dan kapsid) mendikte tropisme sel inang; genom dan enzim mendikte replikasi (litik vs lisogenik). Kebijakan intervensi kesehatan masyarakat yang berhasil selalu dirancang berlandaskan karakteristik biologis spesifik patogen tersebut!"
  }
];

let quizSumCurrentIndex = 0;
let quizSumAnswers = {};

function renderQuizSumQuestion() {
  const q = QUIZ_SUMATIF_QUESTIONS[quizSumCurrentIndex];
  document.getElementById("qsum-num").innerText = quizSumCurrentIndex + 1;
  document.getElementById("qsum-question").innerText = q.question;

  const optContainer = document.getElementById("qsum-options");
  const hasAnswered = quizSumAnswers[quizSumCurrentIndex] !== undefined;
  const selected = quizSumAnswers[quizSumCurrentIndex];

  optContainer.innerHTML = q.options.map((opt, i) => {
    let cls = "option-btn";
    if (hasAnswered) {
      if (i === q.correct) cls += " selected-correct";
      else if (i === selected) cls += " selected-wrong";
    }
    return `
      <button class="${cls}" onclick="answerQuizSum(${i})" ${hasAnswered ? 'disabled' : ''}>
        ${opt}
      </button>
    `;
  }).join('');

  const fb = document.getElementById("qsum-feedback");
  if (hasAnswered) {
    fb.className = `quiz-feedback show ${selected === q.correct ? 'feedback-correct' : 'feedback-wrong'}`;
    fb.innerHTML = `<strong>${selected === q.correct ? '✓ Analisis Tepat!' : '✗ Analisis Belum Tepat.'}</strong> ${q.feedback}`;
  } else {
    fb.className = "quiz-feedback";
    fb.innerHTML = "";
  }

  document.getElementById("btn-qsum-prev").disabled = quizSumCurrentIndex === 0;
  document.getElementById("btn-qsum-next").innerText = (quizSumCurrentIndex === QUIZ_SUMATIF_QUESTIONS.length - 1) ? "Lihat Evaluasi Akhir" : "Selanjutnya →";
}

function answerQuizSum(idx) {
  if (quizSumAnswers[quizSumCurrentIndex] !== undefined) return;
  quizSumAnswers[quizSumCurrentIndex] = idx;
  renderQuizSumQuestion();
}

function navQuizSum(dir) {
  if (dir === 1 && quizSumCurrentIndex === QUIZ_SUMATIF_QUESTIONS.length - 1) {
    showQuizSumResults();
    return;
  }
  quizSumCurrentIndex += dir;
  renderQuizSumQuestion();
}

function showQuizSumResults() {
  document.getElementById("qsum-card").style.display = "none";
  const resBox = document.getElementById("qsum-result-box");
  resBox.style.display = "block";

  let score = 0;
  QUIZ_SUMATIF_QUESTIONS.forEach((q, i) => {
    if (quizSumAnswers[i] === q.correct) score++;
  });

  // Scale to 25 points or display directly out of 10
  const totalScore25 = Math.round((score / 10) * 25);
  document.getElementById("qsum-result-score").innerText = `Skor Sumatif: ${score} / 10 Soal Benar (Skala Nilai: ${totalScore25} / 25)`;

  const tierBox = document.getElementById("qsum-result-feedback-tier");
  if (totalScore25 >= 22) {
    unlockBadge(4);
    tierBox.innerHTML = `
      <div style="color: #fbbf24; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">
        🏅 Tingkat Pencapaian: "Epidemiolog Muda Indonesia" (Istimewa)
      </div>
      <p style="color: #ecfdf5;">
        "Luar biasa! Pemikiran kritismu pada level Bloom C4 dan C5 sangat matang. Kamu mampu mengaitkan data biologi molekuler virus dengan pengambilan keputusan kebijakan kesehatan masyarakat di Indonesia. Kamu siap menjadi epidemiolog masa depan Indonesia!"
      </p>
    `;
  } else if (totalScore25 >= 17) {
    tierBox.innerHTML = `
      <div style="color: #34d399; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.5rem;">
        👍 Tingkat Pencapaian: "Baik & Solid"
      </div>
      <p style="color: #cbd5e1;">
        "Baik! Pemahaman konsep dan analisismu sudah solid. Review kembali pembahasan pada butir soal yang belum tepat dan perdalam penalaran CER untuk mengasah evaluasimu."
      </p>
    `;
  } else if (totalScore25 >= 12) {
    tierBox.innerHTML = `
      <div style="color: #f59e0b; font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">
        ⚖️ Tingkat Pencapaian: "Cukup"
      </div>
      <p style="color: #cbd5e1;">
        "Cukup. Kamu telah memahami konsep dasar, namun perlu lebih teliti dalam membedakan bukti data numerik dan penalaran biologis di Modul 4 sebelum mencoba lagi."
      </p>
    `;
  } else {
    tierBox.innerHTML = `
      <div style="color: #f43f5e; font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">
        🔄 Tingkat Pencapaian: "Perlu Belajar Ulang"
      </div>
      <p style="color: #cbd5e1;">
        "Perlu belajar ulang. Mulai dari Modul 1 dan Modul 2 untuk memperkuat kembali pemahaman struktur dan replikasi virus — jangan menyerah! 💪"
      </p>
    `;
  }
}

function resetQuizSum() {
  quizSumAnswers = {};
  quizSumCurrentIndex = 0;
  document.getElementById("qsum-card").style.display = "block";
  document.getElementById("qsum-result-box").style.display = "none";
  renderQuizSumQuestion();
}

// ========================================================
// REFLEKSI AKHIR & PORTFOLIO
// ========================================================
function simpanRefleksiAkhir() {
  const h3 = document.getElementById("refleksi-3hal").value.trim();
  const h2 = document.getElementById("refleksi-2kagum").value.trim();
  const h1 = document.getElementById("refleksi-1tanya").value.trim();

  if (!h3 || !h2 || !h1) {
    alert("Mohon lengkapi ketiga pertanyaan refleksi akhir terlebih dahulu!");
    return;
  }

  document.getElementById("refleksi-final-success").style.display = "block";
  window.print();
}

// INIT EXTENSIONS
document.addEventListener("DOMContentLoaded", () => {
  renderLitikStep();
  renderLisogenikStep();
  initDragActivity();
  renderQuiz2Question();
  renderStoryPanel();
  initPerananSorter();
  renderQuiz3Question();
  updateSimulation();
  renderQuizSumQuestion();
});
