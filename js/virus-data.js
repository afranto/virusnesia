const VIRUSES_DATA = [
  {
    id: "dengue",
    name: "Dengue Virus (DENV)",
    tag: "Flavivirus",
    accentColor: "#e05252",
    family: "Flaviviridae",
    genome: "+ssRNA ~10,7 kb",
    size: "~50 nm",
    envelope: "Ya",
    capsid: "Semu-ikosahedral",
    subtitle: "Famili Flaviviridae · Genom: +ssRNA ~10,7 kb · Vektor Aedes aegypti",
    exteriorDesc: "Permukaan HALUS (smooth) — 90 dimer protein E berbaring TANGENSIAL (datar di permukaan, bukan menonjol keluar) membentuk pola herringbone warna merah tua-merah.",
    crossSectionDesc: "Irisan melintang: E protein dimer (tangensial, merah) → prM/M protein (merah muda) → Lipid Bilayer (oranye tipis) → Capsid/C protein (oranye) → ssRNA genome (kuning coiled di dalam).",
    proteins: [
      { name: "Envelope (E) Protein", desc: "90 dimer tangensial berpola herringbone; mengikat reseptor sel inang & mediasi fusi membran" },
      { name: "Membrane (prM/M) Protein", desc: "Melindungi protein E selama perakitan intraseluler sebelum pembelahan furin matang" },
      { name: "Capsid (C) Protein", desc: "Membentuk cangkang kapsid internal membungkus genom RNA genomik" },
      { name: "Non-Struktural (NS1 - NS5)", desc: "NS1 (patogenesis & kebocoran vaskular), NS3 (protease/helikase), NS5 (RNA polimerase bergantung RNA / RdRp)" }
    ],
    genomeMap: [
      { name: "C", width: 8, color: "#e05252", func: "Protein Kapsid struktural (membungkus genom)" },
      { name: "prM", width: 10, color: "#f87171", func: "Protein Prekursor Membran struktural" },
      { name: "E", width: 22, color: "#dc2626", func: "Protein Amplop struktural (penentu tropisme & herringbone pattern)" },
      { name: "NS1", width: 12, color: "#38bdf8", func: "Glikoprotein non-struktural disekresikan (biomarker DBD & kebocoran vaskular)" },
      { name: "NS2A/B", width: 10, color: "#0284c7", func: "Kofaktor protease viral & replikasi" },
      { name: "NS3", width: 18, color: "#2563eb", func: "Helikase viral & serin protease NS2B-NS3" },
      { name: "NS4A/B", width: 8, color: "#1d4ed8", func: "Modulator membran retikulum endoplasma inang" },
      { name: "NS5", width: 12, color: "#1e40af", func: "RdRp (RNA polimerase utama) & metiltransferase peng-capping" }
    ],
    genomeStats: { length: "10.723 nukleotida", proteins: "10 (3 Struktural, 7 Non-Struktural)", polarity: "+ssRNA (Monopartit, sense positif)", category: "Struktural (C, prM, E) vs Non-Struktural (NS1-NS5)" },
    pathogenesis: [
      "Nyamuk betina Aedes aegypti menginokulasi virion Dengue saat menghisap darah.",
      "Protein E berikatan dengan reseptor manosa/DC-SIGN pada sel dendritik dan monosit.",
      "Internalisasi endosomal yang diasamkan memicu fusi membran via konformasi protein E.",
      "Replikasi masif di retikulum endoplasma monosit; sekresi NS1 memicu aktivasi komplemen.",
      "Badai sitokin memicu peningkatan permeabilitas vaskular, kebocoran plasma, dan trombositopenia berat."
    ],
    indoContext: "Program Wolbachia di Yogyakarta (Utarini et al., 2021, diterbitkan di The New England Journal of Medicine) terbukti menurunkan kasus DBD sebesar 77% dan rawat inap rumah sakit 86%. Demam Berdarah Dengue endemik di seluruh 38 provinsi Indonesia dengan vektor utama Aedes aegypti dan Aedes albopictus.",
    replicationCycle: "Litik",
    host: "Sel endotel, monosit, makrofag, dan sel dendritik manusia; sel epitel usus nyamuk Aedes",
    replicationSteps: [
      "Penempelan: Dimer protein E berikatan dengan reseptor heparin sulfat/DC-SIGN di permukaan monosit.",
      "Endositosis: Masuk via vesikel berselubung klatrin ke dalam endosom.",
      "Fusi & Uncoating: pH rendah endosom mengubah struktur protein E menjadi trimerik aktif, melepaskan ssRNA ke sitoplasma.",
      "Translasi Poliprotein: ssRNA langsung ditranslasi ribosom sel inang menjadi poliprotein prekursor tunggal.",
      "Pemotongan & Replikasi: Protease NS3 memotong poliprotein; kompleks replikasi menyintesis RNA anakan di invaginasi retikulum endoplasma.",
      "Perakitan di RE & Golgi: Partikel virus imatur dibungkus membran RE, dimatangkan oleh pemotongan furin di aparatus Golgi.",
      "Pelepasan Eksositik: Virion matang infeksius dilepaskan ke ruang ekstraseluler untuk menginfeksi sel baru."
    ],
    lkmSummary: "Dengue menggunakan siklus litik melalui 7 tahap. Protein E pada permukaan halus virus menentukan kemampuannya berikatan dengan reseptor sel endotel manusia dan sel Aedes aegypti."
  },
  {
    id: "influenza",
    name: "Influenza A (H5N1)",
    tag: "Orthomyxovirus",
    accentColor: "#a78bfa",
    family: "Orthomyxoviridae",
    genome: "−ssRNA 8 segmen ~13,6 kb",
    size: "~100 nm",
    envelope: "Ya",
    capsid: "Pleomorfik",
    subtitle: "Famili Orthomyxoviridae · Genom: 8 segmen −ssRNA · Risiko Pandemi Zoonotik",
    exteriorDesc: "Permukaan virion dengan HA trimer (batang tegak lurus membran + kepala globular, ungu muda) dan NA tetramer (kepala mushroom-shaped, ungu gelap) dalam rasio proporsional ~4:1.",
    crossSectionDesc: "Irisan melintang: HA spikes (~14 nm) & NA spikes → Lipid Bilayer → M2 ion channel (biru) → Lapisan matriks M1 (ungu gelap) → 8 segmen RNP berpola 7+1 (7 mengelilingi 1 di tengah).",
    proteins: [
      { name: "Hemagglutinin (HA)", desc: "Trimer permukaan berikatan dengan asam sialat (reseptor alfa-2,3 avian & alfa-2,6 human)" },
      { name: "Neuraminidase (NA)", desc: "Tetramer mushroom memotong asam sialat untuk melepaskan virion baru saat budding" },
      { name: "M2 Ion Channel", desc: "Kanal proton menstabilkan pH endosomal untuk proses uncoating viral" },
      { name: "M1 Matrix Protein", desc: "Lapisan struktural di bawah amplop menjaga integritas virion" },
      { name: "Viral RNPs (8 Segmen)", desc: "RNA polimerase heterotrimerik (PB1, PB2, PA) membungkus segmen −ssRNA bersama NP" }
    ],
    genomeMap: [
      { name: "PB2(1)", width: 15, color: "#8b5cf6", func: "Segmen 1: Polimerase pembaca cap mRNA inang" },
      { name: "PB1(2)", width: 15, color: "#7c3aed", func: "Segmen 2: Unit katalitik RNA polimerase RdRp" },
      { name: "PA(3)", width: 14, color: "#6d28d9", func: "Segmen 3: Aktivitas endonuklease pemotong cap" },
      { name: "HA(4)", width: 12, color: "#a78bfa", func: "Segmen 4: Hemagglutinin glikoprotein permukaan" },
      { name: "NP(5)", width: 12, color: "#c084fc", func: "Segmen 5: Nukleoprotein pengikat genom" },
      { name: "NA(6)", width: 10, color: "#5b21b6", func: "Segmen 6: Neuraminidase pelepas ikatan sialat" },
      { name: "M(7)", width: 11, color: "#4c1d95", func: "Segmen 7: Kode protein matriks M1 dan kanal ion M2" },
      { name: "NS(8)", width: 11, color: "#3b0764", func: "Segmen 8: Protein NS1 (antagonis interferon) & NEP" }
    ],
    genomeStats: { length: "~13,6 kb total (8 segmen)", proteins: "11-12 protein", polarity: "−ssRNA (Segmented, sense negatif)", category: "8 segmen independen berpola 7+1" },
    pathogenesis: [
      "Inhalasi aerosol atau kontak ekskreta unggas yang terkontaminasi partikel virion.",
      "HA berikatan spesifik dengan asam sialat tipe alfa-2,3 di sel epitel alveolus paru.",
      "Masuk melalui endositosis; kanal M2 memasukkan H+ memicu uncoating RNP.",
      "RNP ditranspor aktif masuk ke inti sel inang (keunikan virus RNA) untuk transkripsi.",
      "Lisis sel epitel paru, edema interstisial berat, dan sindrom distres pernapasan akut (ARDS)."
    ],
    indoContext: "Kasus flu burung (H5N1) pertama kali menginfeksi manusia di Indonesia pada tahun 2005. Indonesia sempat mencatat jumlah kematian H5N1 tertinggi di dunia pada periode 2005-2008 dengan case fatality rate >80%. Struktur 8 segmen RNA terpisah memungkinkan fenomena antigenic shift (reassortment) saat dua strain berbeda menginfeksi inang yang sama.",
    replicationCycle: "Litik",
    host: "Sel epitel saluran pernapasan manusia dan epitel saluran cerna unggas air",
    replicationSteps: [
      "Penempelan: Spikula HA mengikat asam sialat pada glikoprotein membran sel.",
      "Endositosis: Virion ditelan ke dalam endosom sel target.",
      "Fusi & Uncoating: Kanal M2 mengalirkan ion proton, memicu pelepasan 8 vRNP ke sitosol.",
      "Impor Inti: 8 vRNP masuk ke dalam inti sel inang melalui nuclear pore complex.",
      "Transkripsi & Replikasi Genom: RdRp viral mencuri 5' cap mRNA sel inang (cap-snatching) untuk menyintesis mRNA dan cRNA.",
      "Ekspor & Perakitan: vRNP baru diekspor ke sitoplasma menuju membran plasma bertunas.",
      "Budding & Pelepasan: Enzim NA memotong asam sialat, melepaskan virion baru ke ruang ekstraseluler."
    ],
    lkmSummary: "Influenza A menggunakan siklus litik. Keunikannya: 8 segmen RNA yang terpisah memungkinkan REASSORTMENT — pertukaran segmen antar subtipe berbeda yang menjadi mekanisme utama munculnya strain pandemi baru."
  },
  {
    id: "sarscov2",
    name: "SARS-CoV-2 (COVID-19)",
    tag: "Coronavirus",
    accentColor: "#38bdf8",
    family: "Coronaviridae",
    genome: "+ssRNA ~30 kb",
    size: "60–140 nm",
    envelope: "Ya",
    capsid: "Heliks",
    subtitle: "Famili Coronaviridae · Genom: +ssRNA ~30 kb (terbesar) · Reseptor ACE2",
    exteriorDesc: "Permukaan khas mahkota (corona) dengan Spike protein S (trimer panjang ~20 nm, menonjol sangat jauh dari membran), Membrane (M), dan Envelope (E) kecil jarang.",
    crossSectionDesc: "Irisan melintang: Spike S trimerik (panjang, cyan) → M protein → E protein → Lipid Bilayer → Nukleokapsid N berikatan heliks melingkar dengan ssRNA 30 kb.",
    proteins: [
      { name: "Spike (S) Glycoprotein", desc: "Trimer panjang ~20 nm; domain RBD berikatan dengan enzim ACE2 paru manusia" },
      { name: "Nucleocapsid (N) Protein", desc: "Membungkus genom RNA sepanjang ~30 kb membentuk simetri heliks fleksibel" },
      { name: "Membrane (M) Protein", desc: "Protein struktural paling melimpah pengatur lekukan membran virion" },
      { name: "Envelope (E) Protein", desc: "Membentuk viroporin ionik yang memfasilitasi pelepasan tunas virus" }
    ],
    genomeMap: [
      { name: "ORF1ab", width: 67, color: "#0284c7", func: "67% genom: Poliprotein direplikasi menghasilkan 16 protein non-struktural (nsp1-16)" },
      { name: "S", width: 13, color: "#38bdf8", func: "Spike glikoprotein struktural (target vaksin mRNA/vektor)" },
      { name: "ORF3a", width: 3, color: "#0ea5e9", func: "Protein aksesori pro-inflamasi" },
      { name: "E", width: 2, color: "#06b6d4", func: "Envelope viroporin struktural" },
      { name: "M", width: 4, color: "#0891b2", func: "Membrane struktural pembentuk bentuk" },
      { name: "ORF6/7/8", width: 4, color: "#0e7490", func: "Inhibitor respon interferon sel inang" },
      { name: "N", width: 5, color: "#155e75", func: "Nukleokapsid pengikat genom RNA" },
      { name: "ORF10", width: 2, color: "#164e63", func: "Protein aksesori terminal 3'" }
    ],
    genomeStats: { length: "29.903 nukleotida (genom RNA terbesar)", proteins: "29 protein", polarity: "+ssRNA (Monopartit linear)", category: "ORF1ab non-struktural + Protein struktural (S, E, M, N)" },
    mutations: "N501Y (meningkatkan afinitas terhadap reseptor ACE2 hingga 10x), D614G (meningkatkan transmisi virion), E484K (penurunan signifikan netralisasi antibodi / immune evasion).",
    pathogenesis: [
      "Inhalasi droplet atau aerosol pernapasan pembawa virion SARS-CoV-2.",
      "Domain RBD pada Spike berikatan dengan reseptor ACE2 sel pneumosit tipe II alveolus.",
      "Protease sel inang TMPRSS2 memotong Spike di situs furin memicu fusi membran plasma.",
      "Replikasi genomik di organel khusus membran ganda (DMVs) sitoplasma.",
      "Kematian sel alveolar memicu pelepasan IL-6, TNF-alfa (badai sitokin), pneumonia bilateral, dan hipoksemia."
    ],
    indoContext: "Indonesia mencatat 352.839 kematian akibat COVID-19 hingga Februari 2022 pada gelombang varian Delta dan Omicron. Vaksinasi nasional berbasis Spike S (Sinovac, AstraZeneca, Pfizer-BioNTech, Moderna) difokuskan memicu antibodi penetralisir pada domain RBD Spike protein.",
    replicationCycle: "Litik",
    host: "Sel pneumosit tipe II paru, epitel bersilia hidung, dan enterosit usus berekspresi ACE2",
    replicationSteps: [
      "Penempelan: Spike RBD mengikat reseptor ACE2.",
      "Priming Protease: TMPRSS2 atau katepsin L memotong S1/S2 menginduksi fusi membran.",
      "Pelepasan RNA: RNA +ssRNA dilepas langsung ke sitoplasma untuk ditranslasi.",
      "Translasi Poliprotein: pp1a dan pp1ab diproduksi dan dipotong oleh protease utama Mpro.",
      "Replikasi RNA: Kompleks RdRp menyintesis genom RNA dan serangkaian mRNA subgenomik.",
      "Perakitan di ERGIC: Perakitan nukleokapsid dan budding ke lumen Retikulum Endoplasma-Golgi Intermediate Compartment.",
      "Eksositosis: Vesikel pembawa virion matang difusikan ke membran plasma untuk dilepaskan keluar sel."
    ],
    lkmSummary: "SARS-CoV-2 menggunakan siklus litik. Spike protein S yang sangat panjang memungkinkan pengikatan ke reseptor ACE2 di sel paru — mutasi pada S (N501Y, D614G, E484K) langsung memengaruhi penularan dan efektivitas vaksin."
  },
  {
    id: "hiv",
    name: "HIV (Human Immunodeficiency Virus)",
    tag: "Retrovirus",
    accentColor: "#f59e0b",
    family: "Retroviridae",
    genome: "+ssRNA DIPLOID (2 salinan) ~9,7 kb",
    size: "~120 nm",
    envelope: "Ya",
    capsid: "KONIK (Kerucut terpancung)",
    subtitle: "Famili Retroviridae · Genom: 2 salinan +ssRNA · Kapsid Konik Unik",
    exteriorDesc: "Permukaan dengan kompleks gp120+gp41 spike trimer (~20 spike per virion) menonjol dari amplop lipid ganda.",
    crossSectionDesc: "Irisan melintang: gp120/gp41 spike → Lipid Bilayer → Lapisan matriks MA (p17) → KAPSID KONIK (p24, bentuk kerucut) → Di dalam kapsid: 2 salinan ssRNA identik + enzim RT, Integrase, dan Protease.",
    proteins: [
      { name: "gp120 / gp41 (Env)", desc: "Trimer permukaan berikatan dengan reseptor CD4 dan koreseptor CCR5/CXCR4" },
      { name: "Matrix (MA / p17)", desc: "Lapisan pelindung heksagonal di bawah lipid bilayer amplop" },
      { name: "Capsid (CA / p24)", desc: "Membentuk silinder konik kerucut unik pelindung genom dan enzim replikasi" },
      { name: "Reverse Transcriptase (RT)", desc: "Mentranskripsi balik ssRNA viral menjadi dsDNA proviral komplementer" },
      { name: "Integrase (IN)", desc: "Menyisipkan dsDNA proviral ke dalam kromosom genom sel inang permanen" }
    ],
    genomeMap: [
      { name: "5'LTR", width: 8, color: "#d97706", func: "Promoter transkripsi proviral" },
      { name: "gag", width: 22, color: "#f59e0b", func: "Prekursor protein struktural: MA (p17), CA (p24), NC (p7), p6" },
      { name: "pol", width: 28, color: "#b45309", func: "Enzim vital: Protease (PR), Reverse Transcriptase (RT), Integrase (IN)" },
      { name: "env", width: 22, color: "#fbbf24", func: "Glikoprotein amplop permukaan: gp120 dan gp41" },
      { name: "tat/rev", width: 10, color: "#fde68a", func: "Regulator transkripsi dan ekspor mRNA" },
      { name: "3'LTR", width: 10, color: "#d97706", func: "Sinyal poliadenilasi provirus" }
    ],
    genomeStats: { length: "9.749 nukleotida x 2 salinan identik (Diploid)", proteins: "15 protein fungsional", polarity: "+ssRNA Diploid", category: "Kapsid konik membungkus genom & mesin enzim" },
    pathogenesis: [
      "Transmisi via cairan tubuh (darah, hubungan seksual, perinatal).",
      "gp120 mengenali molekul CD4 dan koreseptor chemokine CCR5 pada limfosit T CD4+.",
      "Fusi membran diperantarai gp41; kapsid konik masuk ke dalam sitoplasma.",
      "Transkripsi balik ssRNA menjadi dsDNA, lalu integrasi ke genom kromosom menjadi PROVIRUS laten.",
      "Penurunan bertahap jumlah absolut sel T CD4+ (<200 sel/µL) memicu Acquired Immunodeficiency Syndrome (AIDS)."
    ],
    indoContext: "Kementerian Kesehatan RI mencatat estimasi ~540.000 ODHA (Orang dengan HIV/AIDS) di Indonesia pada 2023 dengan ~38.000 infeksi baru setiap tahun. Layanan pengobatan terapi antiretroviral (ARV) telah terdesentralisasi di 514 kabupaten/kota di seluruh Indonesia.",
    replicationCycle: "Lisogenik (Provirus) → Litik Teraktivasi",
    host: "Limfosit T-helper CD4+, monosit, makrofag, dan sel dendritik manusia",
    replicationSteps: [
      "Pengikatan & Fusi: gp120 berikatan dengan CD4 dan CCR5; batang gp41 memicu fusi membran.",
      "Reverse Transcription: Enzim RT mengubah ssRNA menjadi rantai ganda dsDNA.",
      "Integrasi Nukleus: Enzim integrase menyisipkan dsDNA ke dalam kromosom sel inang (membentuk PROVIRUS).",
      "Latensi Lisogenik: Provirus dapat 'tidur' bertahun-tahun, ikut membelah saat sel inang membelah.",
      "Aktivasi Transkripsi: Stimulasi faktor transkripsi seluler memicu ekspresi RNA genomik dan mRNA viral.",
      "Perakitan Tunas: Poliprotein Gag dan Gag-Pol berkumpul di membran plasma bersama salinan RNA.",
      "Pematangan Protease: Enzim protease memotong poliprotein Gag membentuk kapsid konik p24 yang matang."
    ],
    lkmSummary: "HIV menggunakan siklus LISOGENIK melalui reverse transcription: RNA diubah menjadi DNA oleh reverse transcriptase, lalu diintegrasikan ke kromosom sel CD4+ sebagai provirus. Kapsid konik yang unik melindungi mesin replikasi virus di dalam sel inang."
  },
  {
    id: "t4",
    name: "Bakteriofag T4",
    tag: "Myovirus",
    accentColor: "#22c55e",
    family: "Myoviridae",
    genome: "dsDNA linear ~169 kb",
    size: "Kepala 100×70 nm + ekor 100 nm",
    envelope: "Tidak (Non-amplop)",
    capsid: "KOMPLEKS (Kepala Ikosahedral + Ekor)",
    subtitle: "Famili Myoviridae · Genom: dsDNA linear ~169 kb · Model Siklus Litik Klasik",
    exteriorDesc: "Morfologi kompleks: kepala ikosahedral memanjang (elongated) + leher pendek + selubung ekor kontraktil heliks bergaris + lempeng dasar heksagonal + 6 serabut ekor panjang (tail fibers) + 6 pin pendek.",
    crossSectionDesc: "Irisan melintang kepala: dsDNA linear terkondensasi padat terbungkus kapsomer gp23. Tampilan tabung penetrasi internal di dalam selubung kontraktil ekor siap menginjeksi materi genetik.",
    proteins: [
      { name: "Major Capsid Protein (gp23)", desc: "Membentuk kapsid heksamerik kepala ikosahedral penampung DNA padat" },
      { name: "Contractile Sheath (gp18)", desc: "Heliks protein yang berkontraksi memendek mendorong tabung jarum penetrasi" },
      { name: "Baseplate & Tail Pins", desc: "Lempeng jangkar heksagonal mendeteksi molekul dinding sel bakteri" },
      { name: "Long Tail Fibers (gp34-37)", desc: "Serabut fleksibel pengenal reseptor LPS dan OmpC membran luar E. coli" },
      { name: "T4 Lysozyme (gp5)", desc: "Enzim hidrolitik pemecah dinding peptidoglikan bakteri saat injeksi dan lisis" }
    ],
    genomeMap: [
      { name: "Early Genes", width: 28, color: "#16a34a", func: "Modifikasi RNA polimerase inang & degradasi DNA inang" },
      { name: "Middle Genes", width: 24, color: "#15803d", func: "Enzim replikasi DNA T4 dan metabolisme dNTP khusus (hidroksimetilsitosin)" },
      { name: "Late Structural", width: 36, color: "#22c55e", func: "Protein kepala, protein selubung ekor, baseplate, serabut ekor" },
      { name: "Terminal Redundancy", width: 12, color: "#86efac", func: "Ujung redundan sirkular permutasi genom concatemeric" }
    ],
    genomeStats: { length: "168.903 pasang basa (dsDNA)", proteins: "~300 gen (135 esensial)", polarity: "dsDNA Linear Redundan", category: "Genom virus virulent paling intens dipelajari" },
    pathogenesis: [
      "Bakteriofag T4 hanya menginfeksi sel prokariot bakteri (Escherichia coli) dan TIDAK berbahaya bagi sel manusia.",
      "Penempelan reversibel serabut ekor panjang ke lipopolisakarida (LPS) dinding sel E. coli.",
      "Baseplate merapat; pin pendek menancap kuat pada permukaan membran luar bakteri.",
      "Kontraksi heliks selubung ekor memaksa tabung pusat menembus lapisan peptidoglikan.",
      "Injeksi dsDNA dari kepala virus melintasi membran dalam bakteri seperti jarum suntik mikroskopik."
    ],
    indoContext: "Terapi bakteriofag (phage therapy) kini diteliti secara intensif oleh peneliti BRIN (Badan Riset dan Inovasi Nasional) Indonesia sebagai alternatif masa depan pengganti antibiotik dalam mengatasi krisis AMR (Anti-Microbial Resistance). T4 memiliki target inang yang sangat spesifik pada bakteri E. coli tanpa merusak mikrobiota saluran cerna yang menguntungkan.",
    replicationCycle: "Litik Murni (Obligat Virulen)",
    host: "Bakteri Gram-negatif Escherichia coli",
    replicationSteps: [
      "Adsorbsi: Long tail fibers mengenali molekul reseptor LPS dan protein OmpC dinding E. coli.",
      "Injeksi: Selubung ekor berkontraksi; enzim lisozim memecah dinding sel; dsDNA diinjeksikan masuk.",
      "Ekspresi Gen Awal: Enzim T4 mendegradasi kromosom bakteri dan menghentikan transkripsi inang.",
      "Replikasi DNA: Sintesis ratusan salinan dsDNA T4 melalui intermediat konkatenase bercabang.",
      "Sintesis Late Genes: Protein struktural kepala, ekor, lempeng dasar, dan serabut ekor diproduksi terpisah.",
      "Perakitan (Assembly): Kepala diisi DNA padat; leher, ekor, dan serabut ekor disambungkan secara mandiri.",
      "Lisis Seluler: Endolisin dan holin melisiskan membran dan dinding sel bakteri, melepaskan 100-200 virion baru dalam 25 menit!"
    ],
    lkmSummary: "Fag T4 menggunakan siklus litik yang sangat cepat (25 menit) dan eksklusif pada bakteri E. coli. Mekanisme injeksi DNA melalui kontraksi sheath adalah ciri khas morfologi kompleks — berbeda total dari cara virus hewan memasuki sel inangnya."
  },
  {
    id: "rabies",
    name: "Rabies Virus (RABV)",
    tag: "Rhabdovirus",
    accentColor: "#ff6b35",
    family: "Rhabdoviridae",
    genome: "−ssRNA ~11,9 kb urutan N-P-M-G-L",
    size: "~180×75 nm",
    envelope: "Ya",
    capsid: "HELIKS (Bentuk Peluru / Bullet-shaped)",
    subtitle: "Famili Rhabdoviridae · Genom: −ssRNA ~11,9 kb · Bentuk Peluru Asimetris",
    exteriorDesc: "Morfologi BULLET-SHAPED asimetris unik: ujung atas hemispherical membulat, ujung bawah datar. ~400 trimer Glikoprotein G menonjol dari seluruh permukaan (batang dengan knob bulat di ujungnya).",
    crossSectionDesc: "Irisan melintang longitudinal: G protein trimer (oranye) → Amplop Lipid Bilayer → Protein matriks M (lapisan tunggal tipis) → RNP heliks bergelombang (rib-like / pola tulang rusuk tersusun rapat melingkari genom −ssRNA).",
    proteins: [
      { name: "Glycoprotein (G)", desc: "~400 trimer permukaan; mengikat reseptor asetilkolin nikotinik (nAChR) & NCAM di sinaps saraf" },
      { name: "Matrix (M) Protein", desc: "Lapisan tunggal internal pengatur bentuk peluru & pengarah perakitan partikel tunas" },
      { name: "Nucleoprotein (N)", desc: "Membungkus rapat setiap 9 nukleotida −ssRNA membentuk rib-like RNP tahan ribonuklease" },
      { name: "Phosphoprotein (P)", desc: "Kofaktor polimerase penghubung N-RNA dengan subunit katalitik L" },
      { name: "Large RNA Polymerase (L)", desc: "Enzim multifungsi katalitik transkripsi, replikasi, capping, dan poliadenilasi" }
    ],
    genomeMap: [
      { name: "3' Leader", width: 5, color: "#c2410c", func: "Sinyal inisiasi transkripsi" },
      { name: "N", width: 22, color: "#ea580c", func: "Nukleoprotein: enkapsidasi genom membentuk RNP tulang rusuk" },
      { name: "P", width: 14, color: "#f97316", func: "Fosfoprotein: kofaktor polimerase viral" },
      { name: "M", width: 12, color: "#fb923c", func: "Protein Matriks: lapisan tunggal penentu bentuk bullet" },
      { name: "G", width: 21, color: "#ff6b35", func: "Glikoprotein: satu-satunya protein permukaan penentu neurotropisme" },
      { name: "L", width: 26, color: "#fdba74", func: "Polimerase RNA Besar (~50% genom fungsional)" }
    ],
    genomeStats: { length: "11.932 nukleotida", proteins: "5 protein esensial (urutan tetap 3'-N-P-M-G-L-5')", polarity: "−ssRNA Non-segmen", category: "Genom linier tak tersegmen polaritas negatif" },
    pathogenesis: [
      "Inokulasi virus melalui air liur gigitan hewan penular rabies (anjing, kucing, kera).",
      "Replikasi lokal awal pada sel miosit jaringan otot rangka di sekitar lokasi luka gigitan.",
      "Glikoprotein G berikatan dengan reseptor asetilkolin nikotinik (nAChR) pada neuromuscular junction.",
      "Axonal Transport RETROGRADE: Virion diangkut sepanjang akson saraf motorik menuju medula spinalis dan otak (SSP) tanpa terpapar antibodi darah.",
      "Replikasi masif di neuron hipokampus dan serebelum, diseminasi sentrifugal ke kelenjar saliva, ensefalitis fatal."
    ],
    indoContext: "Kejadian Luar Biasa (KLB) Rabies dilaporkan di Provinsi Nusa Tenggara Timur (Flores dan Lembata) pada 2023 dengan 12.576 kasus gigitan HPR. Lebih dari 10 provinsi di Indonesia berstatus endemik rabies (termasuk Bali, NTT, Sulsel, Sulteng, Sumut). 95% transmisi rabies pada manusia disebabkan gigitan anjing. Tingkat kematian (fatality rate) mencapai mendekati 100% begitu gejala klinis neurologis muncul!",
    replicationCycle: "Litik",
    host: "Neuron sistem saraf pusat dan perifer mamalia berdarah panas",
    replicationSteps: [
      "Adsorbsi: Glikoprotein G berikatan dengan nAChR, NCAM, atau p75NTR pada ujung akson motorik.",
      "Endositosis: Masuk ke vesikel endosomal dan mengalami retrograde axonal transport via motor dinein.",
      "Fusi & Uncoating: Di badan sel neuron (perikarion), pH rendah memicu fusi membran melepaskan RNP.",
      "Transkripsi Gen Sekuensial: Kompleks L-P menyintesis 5 mRNA monocistronic dengan gradien konsentrasi (N > P > M > G > L).",
      "Replikasi Genom: Sintesis cetakan antigenomik full-length +ssRNA lalu disalin menjadi anakan −ssRNA.",
      "Perakitan Bentuk Peluru: RNP heliks berasosiasi dengan protein matriks M di bawah membran plasma neuron.",
      "Budding: Virion berbentuk peluru bertunas keluar menembus membran plasma sel saraf."
    ],
    lkmSummary: "Rabies menggunakan siklus litik di neuron. Ciri paling unik: axonal transport retrograde — virus merambat dalam akson saraf tanpa terekspos sistem imun, yang menjelaskan mengapa hampir 100% fatal setelah gejala muncul."
  },
  {
    id: "hpv",
    name: "HPV (Human Papillomavirus)",
    tag: "Papillomavirus",
    accentColor: "#34d399",
    family: "Papillomaviridae",
    genome: "dsDNA SIRKULAR ~8 kb",
    size: "~52 nm",
    envelope: "Tidak (Non-amplop)",
    capsid: "IKOSAHEDRAL T=7d Presisi",
    subtitle: "Famili Papillomaviridae · Genom: dsDNA Sirkular ~8 kb · Simetri T=7d Presisi",
    exteriorDesc: "72 pentamer kapsomer L1 tersusun pada kisi (lattice) T=7d ikosahedral presisi: 12 pentamer pentavalen di vertex dan 60 pentamer heksavalen di facet dalam pola geometris keteraturan tinggi.",
    crossSectionDesc: "Irisan melintang: Kapsid L1 (~8 nm tebal) → Protein minor L2 berada di bawah celah lumen pentamer → Genom dsDNA sirkular supercoiled berikatan dengan histon sel inang (membentuk minikromosom).",
    proteins: [
      { name: "Major Capsid (L1)", desc: "Membentuk 72 pentamer cangkang ikosahedral luar; target utama partikel VLP vaksin HPV" },
      { name: "Minor Capsid (L2)", desc: "Terletak di lumen dalam; memediasi pelepasan genom DNA dari endosom menuju inti" },
      { name: "Oncoprotein E6", desc: "Merekrut ligase ubiquitin E6AP untuk mendegradasi protein supresor tumor p53" },
      { name: "Oncoprotein E7", desc: "Mengikat dan menginaktivasi retinoblastoma protein (pRb) memicu proliferasi sel tak terkendali" },
      { name: "Helicase E1 & Regulator E2", desc: "Inisiasi replikasi DNA episomal virus dan regulasi transkripsi ORF" }
    ],
    genomeMap: [
      { name: "LCR/URR", width: 10, color: "#64748b", func: "Long Control Region: promoter dan origin replikasi" },
      { name: "E6", width: 10, color: "#ef4444", func: "ONKOPROTEIN: degradasi p53 sel inang penghambat apoptosis" },
      { name: "E7", width: 10, color: "#dc2626", func: "ONKOPROTEIN: inaktivasi Rb pendorong siklus sel fase S" },
      { name: "E1/E2", width: 22, color: "#10b981", func: "Helikase replikasi DNA dan faktor transkripsi" },
      { name: "E4/E5", width: 14, color: "#059669", func: "Disrupsi sitokeratin dan aktivasi pensinyalan EGFR" },
      { name: "L2", width: 14, color: "#34d399", func: "Kapsid minor internal struktural" },
      { name: "L1", width: 20, color: "#6ee7b7", func: "Kapsid mayor ikosahedral penentu bentuk geometris" }
    ],
    genomeStats: { length: "7.904 pasang basa (dsDNA sirkular episomal)", proteins: "8 gen ORF", polarity: "dsDNA Sirkular Tertutup", category: "Early Region (E1-E7) vs Late Region (L1, L2)" },
    pathogenesis: [
      "Mikroabrasi epitel mukosa genital atau kulit memungkinkan virion mencapai sel basal.",
      "Kapsid L1 berikatan dengan heparan sulfat proteoglikan (HSPG) pada membran basal epitel skuamosa.",
      "Penetrasi endosomal lambat; genom dsDNA ditranspor masuk ke inti sel basal dalam bentuk episom.",
      "Onkoprotein E6 dan E7 mengganggu kontrol siklus sel (E6 mendegradasi p53, E7 menghambat pRb).",
      "Proliferasi neoplastik memicu displasia serviks berlanjut menjadi Karsinoma Sel Skuamosa invasif."
    ],
    indoContext: "Kementerian Kesehatan RI meluncurkan Program Imunisasi HPV Nasional sejak 2023 menyasar siswi kelas 5 dan 6 SD di seluruh Indonesia. Kanker serviks menempati urutan ke-2 kanker tersering pada wanita Indonesia dengan ~36.000 kasus baru per tahun. Genotipe HPV risiko tinggi (HPV-16 dan HPV-18) berkontribusi terhadap lebih dari 70% kasus kanker leher rahim di Indonesia.",
    replicationCycle: "Kombinasi Laten (Episomal) & Litik (Bergantung Diferensiasi Epitel)",
    host: "Sel epitel skuamosa basal dan berstrata pada serviks, anus, dan rongga mulut manusia",
    replicationSteps: [
      "Attachment: L1 berikatan dengan HSPG dan integrase alfa-6 pada sel punca lapisan basal.",
      "Endositosis: Masuk via mikropinositosis; L2 mengarahkan kompleks DNA ke aparatus Golgi.",
      "Impor Nukleus: DNA viral memasuki nukleus saat membran inti larut selama mitosis.",
      "Fase Pemeliharaan: Replikasi DNA episom salinan rendah sejalan dengan pembelahan sel basal.",
      "Diferensiasi Epitel: Saat sel inang terdorong ke lapisan spinosum dan granulosum, promoter late aktif.",
      "Amplifikasi Genom & Perakitan: Ekspresi masif L1 dan L2 merakit virion baru di lapisan epitel tanduk atas.",
      "Pelepasan Skuamasi: Virion dilepaskan secara pasif bersamaan dengan pengelupasan sel kulit/mukosa mati."
    ],
    lkmSummary: "HPV menggunakan kombinasi siklus laten dan litik yang bergantung diferensiasi sel epitel. Tidak memiliki amplop lipid membuat HPV lebih tahan terhadap deterjen dibanding virus beramplop. Onkoprotein E6/E7 adalah alasan HPV menyebabkan kanker."
  },
  {
    id: "tmv",
    name: "Tobacco Mosaic Virus (TMV)",
    tag: "Tobamovirus",
    accentColor: "#0ea5e9",
    family: "Virgaviridae",
    genome: "+ssRNA 6.395 nukleotida",
    size: "300×18 nm (Kanal sentral 4 nm)",
    envelope: "Tidak (Non-amplop)",
    capsid: "HELIKS RIGID (Batang Silindris / Rod)",
    subtitle: "Famili Virgaviridae · Genom: +ssRNA 6.395 nt · Struktur Batang Heliks Sempurna",
    exteriorDesc: "Silinder batang (ROD) vertikal kaku sepanjang 300 nm dan diameter 18 nm. Lekukan heliks mantel protein (coat protein) berulang setiap 2,3 nm per putaran (~2.130 subunit CP identik) dengan kanal sentral gelap 4 nm.",
    crossSectionDesc: "DUA TAMPILAN: (1) End-on (dari atas): Lingkaran luar subunit CP mengelilingi kanal sentral 4 nm kosong, dengan lingkaran putus-putus ssRNA tertanam di alur internal protein. (2) Longitudinal (dari samping): Potongan rod bergaris heliks dengan untai RNA zigzag.",
    proteins: [
      { name: "Coat Protein (CP)", desc: "2.130 subunit protein identik (17,5 kDa) melindungi genom RNA dari degradasi enzim" },
      { name: "Movement Protein (MP / 30K)", desc: "Melebarkan pori plasmodesmata dinding sel tumbuhan untuk transport interseluler" },
      { name: "Replicase (126K Protein)", desc: "Subunit helikase & metiltransferase pengatur replikasi" },
      { name: "Replicase Readthrough (183K)", desc: "Protein fusi polimerase RNA dependen-RNA (RdRp) viral" }
    ],
    genomeMap: [
      { name: "126K", width: 35, color: "#854d0e", func: "Metiltransferase dan helikase replikasi" },
      { name: "183K (Pol)", width: 30, color: "#0369a1", func: "Readthrough RdRp: sintesis untai RNA genomik" },
      { name: "MP (30K)", width: 18, color: "#0284c7", func: "Movement Protein: fasilitasi lewat pori PLASMODESMATA" },
      { name: "CP", width: 17, color: "#38bdf8", func: "Coat Protein: perakitan selubung heliks batang silindris" }
    ],
    genomeStats: { length: "6.395 nukleotida", proteins: "4 protein fungsional", polarity: "+ssRNA Monopartit", category: "Model virus heliks pertama yang divisualisasikan kristalografi" },
    pathogenesis: [
      "Transmisi mekanis melalui gesekan daun yang terluka atau alat pertanian terkontaminasi.",
      "TMV TIDAK menginfeksi sel manusia karena ketiadaan reseptor permukaan sel mamalia.",
      "Masuk melalui luka fisik menembus dinding sel selulosa tanaman tembakau atau tomat.",
      "Sintesis Movement Protein (MP) memungkinkan kompleks vRNP merayap menembus lubang plasmodesmata antar sel.",
      "Invasi sistemik ke jaringan vaskular floem memicu klorosis belang-belang (mosaik) dan daun mengeriting kerdil."
    ],
    indoContext: "Indonesia merupakan salah satu produsen tembakau terbesar dunia (Jawa Tengah, Jawa Timur, NTB). TMV menimbulkan kerugian ekonomi serius pada komoditas perkebunan tembakau serta tanaman hortikultura seperti tomat dan cabai di Jawa dan Sulawesi. Karena tidak memiliki amplop lipid, partikel TMV sangat tahan di lingkungan, tahan panas hingga suhu 90°C, dan dapat bertahan berbulan-bulan di tanah kering.",
    replicationCycle: "Litik Tumbuhan",
    host: "Sel mesofil daun dan floem tanaman famili Solanaceae (tembakau, tomat, cabai, terung)",
    replicationSteps: [
      "Inokulasi Mekanis: Masuk menembus dinding sel yang luka akibat serangga atau gesekan mekanis.",
      "Uncoating Kotranslasional: Ribosom sel inang mulai mentranslasi 5' ujung RNA, mendorong pelepasan subunit CP secara mekanis.",
      "Translasi Replikase: Sintesis protein 126K dan 183K RdRp oleh ribosom sitoplasma tanaman.",
      "Replikasi RNA: Replikase menghasilkan untai minus komplementer dan untai plus genomik baru serta subgenomik mRNA.",
      "Perakitan Diri (Self-assembly): Subunit CP membentuk piringan ganda (disks), membungkus RNA dari origin-of-assembly (OAS) secara heliks.",
      "Penyebaran Interseluler: Movement Protein membuka pori plasmodesmata memungkinkan genom bergerak ke sel tetangga.",
      "Penyebaran Vaskular: Virion masuk ke sistem berkas pengangkut floem menyebar ke pucuk tanaman."
    ],
    lkmSummary: "TMV menggunakan siklus litik dan menyebar antar sel tanaman melalui plasmodesmata via Movement Protein — mekanisme yang tidak ada pada virus hewan. Meski +ssRNA-nya bisa ditranslasi ribosom manusia, TMV tidak menginfeksi manusia karena coat protein-nya tidak bisa berikatan dengan reseptor sel mamalia."
  },
  {
    id: "adeno",
    name: "Adenovirus (HAdV)",
    tag: "Mastadenovirus",
    accentColor: "#f472b6",
    family: "Adenoviridae",
    genome: "dsDNA LINEAR ~36 kb",
    size: "~90 nm (Fiber ~37 nm)",
    envelope: "Tidak (Non-amplop)",
    capsid: "IKOSAHEDRAL DENGAN FIBER",
    subtitle: "Famili Adenoviridae · Genom: dsDNA linear ~36 kb · Fiber & Knob Tropisme",
    exteriorDesc: "Ikosahedral kaku non-amplop dengan 20 facet hexagonal terisi hexon trimers (pink gelap, ~240 hexon) + 12 vertex dengan penton base (pink muda) + 12 FIBER PROTEIN PANJANG menonjol dari tiap vertex (~37 nm) berujung knob globular.",
    crossSectionDesc: "Irisan melintang: Fiber panjang + knob domain → Hexon shell luar → Penton base di sudut → Protein teras (core VII dan V) mengikat DNA → Genom dsDNA linear padat dengan Terminal Protein (TP/ITR) di kedua ujungnya.",
    proteins: [
      { name: "Hexon Trimer", desc: "Komponen struktural utama (240 unit hekson) pembentuk 20 facet cangkang ikosahedral" },
      { name: "Penton Base", desc: "Membentuk 12 dasar vertex; mengandung motif RGD yang berikatan dengan integrin seluler" },
      { name: "Fiber Protein & Knob", desc: "Batang fleksibel panjang (~37 nm) berujung domain knob bulat yang menentukan reseptor target tropisme (CAR)" },
      { name: "Core Proteins (VII, V, TP)", desc: "Protein basa mirip histon memadatkan DNA di dalam inti virion" }
    ],
    genomeMap: [
      { name: "ITR-TP", width: 6, color: "#be185d", func: "Inverted Terminal Repeat terikat protein terminal primer" },
      { name: "E1A/E1B", width: 14, color: "#db2777", func: "Early: modulasi siklus sel dan inhibisi apoptosis" },
      { name: "E2(DBP/Pol)", width: 18, color: "#f472b6", func: "Early: enzim DNA polimerase dan pengikat DNA untai tunggal" },
      { name: "E3/E4", width: 12, color: "#fbcfe8", func: "Early: modulasi sistem imun dan transpor mRNA" },
      { name: "L1-L3(Hexon)", width: 28, color: "#9d174d", func: "Late: sintesis hekson, protease pematangan" },
      { name: "L4-L5(Fiber)", width: 16, color: "#831843", func: "Late: sintesis penton base dan fiber penentu tropisme" },
      { name: "ITR", width: 6, color: "#be185d", func: "Ujung pengulang terminal inversi" }
    ],
    genomeStats: { length: "35.937 pasang basa (dsDNA)", proteins: "~30-40 protein", polarity: "dsDNA Linear dengan ITR", category: "Vektor terapi gen paling banyak digunakan" },
    pathogenesis: [
      "Inhalasi droplet saluran napas atau fekal-oral melalui air kolam renang terkontaminasi.",
      "Knob domain pada ujung fiber protein berikatan kuat dengan reseptor CAR (Coxsackie-Adenovirus Receptor).",
      "Penton base berinteraksi dengan integrin alfa-v memicu endositosis berperantara klatrin.",
      "Lisis membran endosom melepaskan kapsid tanpa fiber yang bermigrasi sepanjang mikrotubulus menuju pori inti.",
      "Lisis sel epitel pernapasan menimbulkan faringitis, konjungtivitis ('pink eye'), dan ISPA demam akut."
    ],
    indoContext: "Human Adenovirus merupakan salah satu penyebab infeksi saluran pernapasan akut (ISPA) dan gastroenteritis tersering pada balita yang datang ke fasilitas Puskesmas di Indonesia. Pada tahun 2022, investigasi Kementerian Kesehatan RI terhadap kasus hepatitis akut misterius pada anak turut mengevaluasi kaitan infeksi Adenovirus serotipe 41F. Keragaman >90 serotipe dengan variasi knob fiber menghasilkan tropisme organ yang sangat berbeda.",
    replicationCycle: "Litik",
    host: "Sel epitel saluran napas, konjungtiva mata, dan mukosa saluran cerna manusia",
    replicationSteps: [
      "Penempelan Reseptor: Knob fiber berikatan dengan CAR, diikuti ikatan penton base ke integrin alfa-v.",
      "Internalisasi: Virion masuk via endositosis; penurunan pH endosom melepaskan fiber protein.",
      "Pelepasan Endosom: Protein VI merusak membran endosom, kapsid parsial menuju mikrotubulus.",
      "Docking Inti: Kapsid merapat ke nuclear pore complex dan menyuntikkan DNA linear ke dalam nukleoplasma.",
      "Transkripsi Dua Gelombang: Gen E1-E4 diekspresikan lebih dulu memprogram ulang sel, disusul gen late L1-L5.",
      "Perakitan Intranuklear: Komponen hekson dan fiber dirakit di dalam nukleus membentuk cangkang kristalin.",
      "Lisis Host: Pelepasan protein adenovirus death protein (ADP) menyebabkan lisis sel inang dan pelepasan ribuan virion."
    ],
    lkmSummary: "Adenovirus menggunakan siklus litik. Fiber protein yang panjang dengan knob domain adalah penentu tropisme — knob berbeda antar serotipe berikatan dengan reseptor berbeda, menjelaskan mengapa serotipe berbeda menyerang saluran napas, usus, atau mata."
  },
  {
    id: "zika",
    name: "Zika Virus (ZIKV)",
    tag: "Flavivirus Neurotropik",
    accentColor: "#fb7185",
    family: "Flaviviridae",
    genome: "+ssRNA ~10,7 kb",
    size: "~50 nm",
    envelope: "Ya",
    capsid: "Semu-ikosahedral",
    subtitle: "Famili Flaviviridae · Genom: +ssRNA ~10,7 kb · Neurotropisme Janin & Reseptor AXL",
    exteriorDesc: "Mirip Dengue (permukaan halus dengan 90 dimer protein E tangensial berpola herringbone), NAMUN Domain III protein E lebih terbuka dan terekspos ke luar dibanding Dengue, memungkinkannya mengikat reseptor tirosin kinase AXL di sel saraf janin.",
    crossSectionDesc: "Irisan melintang: Dimer E (merah muda) dengan domain III menonjol halus → Protein prM/M → Lipid Bilayer membran → Kapsid C protein → Gulungan +ssRNA coiled kuning di tengah virion.",
    proteins: [
      { name: "Envelope (E) Protein", desc: "90 dimer tangensial; Domain III memiliki konformasi terbuka yang afinitasnya tinggi pada sel progenitor saraf" },
      { name: "Pre-Membrane (prM)", desc: "Melindungi protein E selama transit sekresi di kompartemen intraseluler" },
      { name: "Capsid (C) Protein", desc: "Cangkang internal membungkus genom RNA genomik" },
      { name: "Non-Struktural (NS1-NS5)", desc: "NS1 (antagonis imunitas bawaan & gangguan plasenta), NS5 (metiltransferase & RdRp polimerase)" }
    ],
    genomeMap: [
      { name: "C", width: 8, color: "#f43f5e", func: "Protein kapsid struktural" },
      { name: "prM", width: 10, color: "#fb7185", func: "Prekursor membran struktural" },
      { name: "E", width: 22, color: "#e11d48", func: "Protein amplop penentu neurotropisme janin" },
      { name: "NS1", width: 12, color: "#fda4af", func: "Non-struktural: disfungsi vaskular trofoblas plasenta" },
      { name: "NS2A/B", width: 10, color: "#be123c", func: "Kofaktor protease viral dan perakitan virion" },
      { name: "NS3", width: 18, color: "#9f1239", func: "Helikase dan serin protease katalitik" },
      { name: "NS4A/B", width: 8, color: "#881337", func: "Induksi organel replikasi membran retikulum" },
      { name: "NS5", width: 12, color: "#4c0519", func: "RNA polimerase utama dan supresi pensinyalan interferon" }
    ],
    genomeStats: { length: "10.794 nukleotida", proteins: "10 protein (1 poliprotein precursor)", polarity: "+ssRNA Monopartit", category: "Flavivirus zoonotik teratogenik" },
    pathogenesis: [
      "Gigitan nyamuk Aedes aegypti atau penularan vertikal transplasental ibu hamil ke janin (juga transmisi seksual).",
      "Protein E (domain III) berikatan dengan reseptor AXL dan DC-SIGN pada sel trofoblas plasenta.",
      "Virus menembus barier plasenta dan menginfeksi Neural Progenitor Cells (NPC) otak janin yang berkembang.",
      "Replikasi masif di sel punca saraf memicu apoptosis NPC dan penghentian siklus diferensiasi neurogenesis.",
      "Kerusakan korteks serebral janin berakibat kalsifikasi intrakranial dan mikrosefali kongenital permanen."
    ],
    indoContext: "Zika terbukti telah bersirkulasi di Indonesia sejak tahun 1977 (dikonfirmasi lewat uji serologi di Jawa Tengah). Vektor nyamuknya (Aedes aegypti dan Aedes albopictus) identik dengan vektor DBD yang tersebar luas di seluruh kepulauan Indonesia. Ancaman klinis paling kritis adalah infeksi pada trimester pertama ibu hamil yang dapat menimbulkan Congenital Zika Syndrome (mikrosefali janin) dan sindrom Guillain-Barré pada orang dewasa.",
    replicationCycle: "Litik",
    host: "Keratinosit, sel dendritik, sel endotel kapiler plasenta, dan sel progenitor saraf janin (NPC)",
    replicationSteps: [
      "Penempelan: Domain III protein E berikatan dengan reseptor AXL di sel progenitor saraf.",
      "Endositosis: Masuk melalui jalur endositosis diperantarai klatrin.",
      "Fusi Membran: Asidifikasi endosom memicu penataan ulang protein E menjadi homotrimer, melepaskan RNA.",
      "Translasi Poliprotein: Ditranslasi menjadi poliprotein di permukaan membran retikulum endoplasma.",
      "Replikasi Genom: Sintesis RNA komplementer untai minus dan anakan untai plus oleh kompleks polimerase NS5.",
      "Perakitan Imatur: Partikel virus berkuncup ke dalam lumen RE dengan tonjolan prM-E.",
      "Pematangan & Pelepasan: Pemotongan prM oleh enzim furin di Golgi menghasilkan virion matang permukaan halus yang disekresi."
    ],
    lkmSummary: "Zika menggunakan siklus litik dan secara struktural sangat mirip Dengue (sesama Flavivirus). Perbedaan kritis: domain III protein E Zika berikatan dengan reseptor AXL di sel saraf janin, menyebabkan neurotropisme yang tidak dimiliki Dengue — itulah mengapa Zika sangat berbahaya bagi ibu hamil."
  }
];

// ASESMEN FORMATIF 1 QUESTIONS (Bloom C4)
const QUIZ1_QUESTIONS = [
  {
    id: 1,
    question: "Virus Rabies hampir selalu fatal setelah gejala klinis neurologis muncul meskipun vaksin tersedia. Karakteristik struktural dan mekanisme patogenesis mana yang paling bertanggung jawab?",
    options: [
      "A. Glikoprotein G yang menjadi target utama antibodi sirkulasi",
      "B. Ukuran virus yang sangat kecil (75 nm) sehingga lolos dari proses fagositosis makrofag",
      "C. Axonal transport retrograde di dalam akson saraf — virus terlindung sepenuhnya dari paparan sistem imun sirkulasi dan barier darah-otak",
      "D. Siklus litik yang sangat cepat (selesai dalam 24 jam pertama gigitan)",
      "E. Amplop lipid ganda yang menyamarkan virus dari deteksi leukosit"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Virus Rabies memanfaatkan transpor aksonal retrograde di dalam sitoplasma akson saraf motorik dari luka gigitan menuju SSP. Karena berada di dalam neuron dan terlindung barier darah-otak (blood-brain barrier), virus sama sekali tidak terpapar oleh antibodi netralisasi sistem imun sirkulasi darah."
  },
  {
    id: 2,
    question: "HPV dan Adenovirus sama-sama tergolong virus non-amplop dengan simetri kapsid ikosahedral. Perbedaan struktural spesifik mana yang paling tepat menjelaskan perbedaan organ target (tropisme) sel inang mereka?",
    options: [
      "A. Perbedaan diameter virion (Adenovirus 90 nm lebih besar daripada HPV 52 nm)",
      "B. Adenovirus memiliki fiber protein panjang dengan knob domain penentu reseptor spesifik (CAR/integrin); sedangkan HPV mengandalkan kapsid L1 yang berikatan dengan HSPG epitel basal",
      "C. Perbedaan materi genetik di mana Adenovirus dsDNA sedangkan HPV ssRNA",
      "D. Adenovirus memiliki lebih banyak subunit kapsomer sehingga menginfeksi semua jenis sel mamalia tanpa batas",
      "E. HPV hanya menginfeksi sel basal karena tidak memiliki mekanisme pelolosan diri dari endosom (endosomal escape)"
    ],
    correct: 1, // B
    feedback: "Benar! (Pilihan B). Adenovirus memiliki struktur khusus berupa 12 fiber protein panjang (~37 nm) berujung knob domain globular di tiap vertex yang berikatan spesifik dengan Coxsackie-Adenovirus Receptor (CAR), sedangkan HPV menggunakan kapsomer L1 pentamerik untuk berikatan dengan heparan sulfat proteoglikan (HSPG) pada sel epitel basal."
  },
  {
    id: 3,
    question: "TMV memiliki kapsid heliks rigid dengan kanal sentral 4 nm dan tergolong non-amplop. Jika suspensi murni partikel TMV dimasukkan ke kultur sel epitel paru manusia, prediksi hasil yang paling tepat berdasarkan karakteristik strukturalnya adalah...",
    options: [
      "A. Menginfeksi sel paru manusia karena ukuran panjangnya (300 nm) memicu endositosis masif",
      "B. Menginfeksi sel paru hanya jika sel manusia dikondisikan memiliki organel kloroplas",
      "C. Menginfeksi dan melisiskan sel karena materi genetik +ssRNA-nya secara teoritis dapat dibaca langsung oleh ribosom manusia",
      "D. Tidak menginfeksi karena coat protein TMV tidak memiliki domain pengikat reseptor permukaan spesifik pada sel mamalia",
      "E. Tidak menginfeksi semata-mata karena sel manusia tidak memiliki pori plasmodesmata"
    ],
    correct: 3, // D
    feedback: "Benar! (Pilihan D). Tahap awal infeksi virus adalah attachment (adsorbsi) spesifik. Meskipun +ssRNA TMV dapat ditranslasi ribosom mamalia dalam tabung reaksi bebas sel (cell-free assay), partikel utuh TMV tidak bisa menginfeksi sel manusia utuh karena subunit Coat Protein-nya tidak memiliki motif struktural pengenal reseptor membran sel mamalia."
  },
  {
    id: 4,
    question: "Dengue memiliki 4 serotipe (DENV-1 s/d DENV-4). Mengapa infeksi sekunder oleh serotipe yang berbeda sering kali menimbulkan manifestasi klinis yang jauh lebih parah daripada infeksi pertama? Kaitkan dengan karakteristik protein E!",
    options: [
      "A. Serotipe yang berbeda memiliki ukuran virion yang jauh lebih besar sehingga menyumbat kapiler darah",
      "B. Infeksi kedua menghasilkan partikel virus yang bermutasi menjadi tahan terhadap suhu demam tubuh",
      "C. Antibodi sub-netralisasi dari infeksi pertama berikatan silang dengan protein E serotipe kedua namun tidak menonaktifkannya, justru memfasilitasi masuknya virus ke reseptor Fc makrofag (ADE — Antibody-Dependent Enhancement)",
      "D. Serotipe kedua memiliki enzim polimerase NS5 yang bekerja sepuluh kali lebih cepat",
      "E. Infeksi sekunder menyebabkan sel limfosit T memori menyerang sel darah merah tubuh sendiri"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Fenomena Antibody-Dependent Enhancement (ADE) terjadi ketika antibodi IgG terhadap protein E dari infeksi primer mengenali protein E serotipe sekunder secara parsial (heterologous non-neutralizing). Kompleks imun virus-antibodi ini justru ditangkap oleh reseptor Fc-gamma pada monosit/makrofag, meningkatkan laju replikasi virus dan memicu badai sitokin."
  },
  {
    id: 5,
    question: "HIV memiliki kapsid berbentuk kerucut terpancung (konik) yang unik, berbeda dari ikosahedral atau heliks pada umumnya. Mengapa keunikan morfologi kapsid konik p24 ini sangat krusial bagi siklus replikasi HIV?",
    options: [
      "A. Kapsid konik memperluas ruang internal agar mampu menampung lebih dari 10 salinan genom RNA",
      "B. Kapsid konik merobek membran sel inang secara fisik seperti baji tajam",
      "C. Kapsid konik melindungi kompleks reverse transcription (RNA→dsDNA) dari sensor imun bawaan sitoplasma inang selama proses transkripsi balik menuju pori inti",
      "D. Kapsid konik adalah fitur pasif retrovirus yang tidak memiliki signifikansi kelangsungan hidup",
      "E. Kapsid konik mempercepat proses fusi lipid bilayer dengan membran plasma limfosit"
    ],
    correct: 2, // C
    feedback: "Benar! (Pilihan C). Kapsid konik protein p24 HIV bertindak sebagai kompartemen reaksi terlindung (reaction vessel) yang membungkus 2 salinan RNA genomik dan enzim reverse transcriptase. Struktur ini melindungi asam nukleat viral yang sedang ditranskripsi balik dari sensor imun bawaan sitosol (seperti cGAS-STING) hingga merapat ke pori membran inti."
  }
];
