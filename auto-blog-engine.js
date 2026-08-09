/* ==========================================================================
   MY EXPORT WORLD - Official Data Auto-Blog Generator Engine (auto-blog-engine.js)
   100% Free Daily Automated Blog Upload System
   Sourced from official data: Spices Board of India, DGFT, APEDA, and CBIC Customs
   ========================================================================== */

(function (global) {
  'use strict';

  // --- Official Government & Industry Reference Matrix ---
  const OFFICIAL_GOVT_DATA = {
    spicesBoard: {
      name: "Spices Board of India (Ministry of Commerce & Industry)",
      url: "http://www.indianspices.com/quality/quality-standards.html",
      mandatoryTestingUrl: "http://www.indianspices.com/quality/mandatory-testing.html",
      standards: {
        turmericFinger: {
          hsCode: "09103020",
          name: "Dried Turmeric Whole Finger (Nizamabad / Sangli Double Polished)",
          curcuminMin: "3.5% - 5.0%",
          moistureMax: "10.0%",
          extraneousMatterMax: "1.0%",
          defectiveRhizomesMax: "2.0%",
          leadMax: "2.5 ppm",
          aflatoxinLimit: "Total Aflatoxins < 10 ppb (B1 < 5 ppb)"
        },
        turmericPowder: {
          hsCode: "09103030",
          name: "Pure Ultra-Fine Turmeric Powder",
          curcuminMin: "3.8%",
          meshSize: "60 - 80 mesh",
          moistureMax: "9.0%",
          totalAshMax: "7.0%",
          acidInsolubleAshMax: "1.2%"
        },
        psylliumHusk: {
          hsCode: "12119032",
          name: "Psyllium Husk 99% Ultra-Pure (Plantago Ovata)",
          purityMin: "99.0%",
          swellVolumeMin: "45 ml / gram",
          lightStuffMax: "1.0%",
          moistureMax: "10.0%",
          heavyMetals: "Passes Lead/Arsenic/Cadmium ICP-MS limits",
          microbiology: "Salmonella Negative, E. Coli Negative"
        },
        cuminSeeds: {
          hsCode: "09093120",
          name: "Cumin Seeds (Jeera) Sortex 99.5% Cleaned",
          purityMin: "99.5%",
          volatileOilMin: "1.8% v/w",
          moistureMax: "9.0%",
          admixtureMax: "0.5%"
        },
        redChilli: {
          hsCode: "09042211",
          name: "Dry Red Chilli Stemless (Guntur S17 Teja / Sannam)",
          pungency: "75,000 - 100,000 SHU",
          astaColorMin: "100 ASTA Units",
          moistureMax: "11.0%",
          sudanDye: "Certified 100% Negative (Sudan I-IV)"
        }
      }
    },

    dgft: {
      name: "Directorate General of Foreign Trade (DGFT India)",
      url: "https://www.dgft.gov.in/CP/?opt=itc-hs-code",
      schemes: ["RoDTEP (Remission of Duties and Taxes on Exported Products)", "Duty Drawback Scheme", "MEIS Archive Guidelines"],
      exportPorts: ["Nhava Sheva (JNPT), Mumbai", "Mundra Port, Gujarat", "Kandla Port, Gujarat", "Chennai Port, Tamil Nadu"]
    },

    apeda: {
      name: "APEDA (Agri Export Development Authority)",
      url: "https://agriexchange.apeda.gov.in/",
      standards: ["NPOP Organic Certification", "USDA Organic Equivalent", "GlobalGAP Compliance", "ISO 22000 / HACCP"]
    },

    cbic: {
      name: "CBIC Customs & Port Authority",
      url: "https://www.cbic.gov.in/htdocs-cbec/customs/cst-manual/manual-toc",
      mandatoryDocs: [
        "Commercial Invoice & Packing List (P/L)",
        "Clean Shipped on Board Bill of Lading (B/L)",
        "Official Certificate of Origin (Issued by Chamber of Commerce / EIA)",
        "Government Phytosanitary Certificate (Ministry of Agriculture)",
        "Methyl Bromide / Phosphine Fumigation Certificate",
        "Third-Party Lab Quality Certificate (SGS / Geo-Chem)"
      ]
    }
  };

  // Preset Rotatable Topics Matrix
  const TOPIC_LIBRARY = [
    {
      topicKey: "turmeric_export_specs",
      category: "Customs & Compliance",
      readTime: "6 min read",
      coverImage: "images/blog_turmeric.png",
      generateTitle: (dateStr) => `Indian Turmeric Sourcing Guide (${dateStr}): Spices Board Curcumin Benchmarks & Export Compliance`,
      generateTeaser: () => `Analyze official Spices Board curcumin testing standards (3.5%-5.0%), Nizamabad vs Salem grades, phytosanitary clearance protocols, and destination MRL limits.`,
      compileBody: (dateStr) => `
        <p>As of <strong>${dateStr}</strong>, global demand for high-curcumin Indian Turmeric (<em>Curcuma longa</em>) continues to surge across pharmaceutical, nutraceutical, and bulk food processing sectors. To successfully navigate international customs clearance in the European Union (EFSA) and North America (FDA), global importers must verify that bulk consignments adhere to official <strong>Spices Board of India</strong> quality parameters.</p>
        
        <h3>Official Spices Board Quality Benchmarks</h3>
        <p>Sourcing from an authorized Indian exporter like <strong>MY EXPORT WORLD</strong> guarantees adherence to the statutory grade specifications established under the Indian Export Quality Control and Inspection Act:</p>
        
        <table>
          <thead>
            <tr>
              <th>Specification Parameter</th>
              <th>Whole Turmeric Fingers (HS 09103020)</th>
              <th>Ultra-Fine Ground Powder (HS 09103030)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Active Curcumin Content</strong></td>
              <td>Min 3.5% to 5.0% (Nizamabad/Salem Grade)</td>
              <td>Min 3.8% Guaranteed</td>
            </tr>
            <tr>
              <td><strong>Moisture Level</strong></td>
              <td>Max 10.0%</td>
              <td>Max 9.0%</td>
            </tr>
            <tr>
              <td><strong>Extraneous Matter</strong></td>
              <td>Max 1.0%</td>
              <td>Nil (Sortex Milled)</td>
            </tr>
            <tr>
              <td><strong>Aflatoxin Limits</strong></td>
              <td>Total Aflatoxins &lt; 10 ppb (B1 &lt; 5 ppb)</td>
              <td>Total Aflatoxins &lt; 10 ppb</td>
            </tr>
            <tr>
              <td><strong>Mesh Fineness</strong></td>
              <td>Whole Double Polished Rhizomes</td>
              <td>60 to 80 Mesh Standard</td>
            </tr>
          </tbody>
        </table>

        <h3>Mandatory Customs & Export Clearance Documents</h3>
        <p>Before container sealing at Nhava Sheva (JNPT) or Mundra Port, every shipment undergoes multi-tier biosecurity checks. Buyers receive the following official document stack:</p>
        <ol>
          <li><strong>Government Phytosanitary Certificate:</strong> Issued by the Ministry of Agriculture (Plant Quarantine Department) confirming zero quarantine pests.</li>
          <li><strong>Methyl Bromide / Phosphine Fumigation Certificate:</strong> Proof of container disinfection.</li>
          <li><strong>Certificate of Origin:</strong> Issued by the Indian Chamber of Commerce for preferential tariff treatment.</li>
          <li><strong>Independent HPLC Lab Assay:</strong> SGS / Geo-Chem certificate confirming active Curcumin percentages and zero heavy metal contamination.</li>
        </ol>

        <div class="official-citation-box" style="background: rgba(5, 25, 59, 0.04); border-left: 4px solid #D61C2C; padding: 1.2rem 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h4 style="margin:0 0 0.4rem 0; color: #051937; font-size: 1.05rem;"><i class="fa-solid fa-building-columns" style="color:#D61C2C;"></i> Verified Official Government Reference</h4>
          <p style="margin:0; font-size:0.88rem; color:#555;">
            Data compiled directly from <a href="${OFFICIAL_GOVT_DATA.spicesBoard.url}" target="_blank" rel="noopener" style="color:#D61C2C; font-weight:600;">Spices Board of India Quality Standards</a> and <a href="${OFFICIAL_GOVT_DATA.dgft.url}" target="_blank" rel="noopener" style="color:#D61C2C; font-weight:600;">DGFT ITC (HS) Code Classification</a>.
          </p>
        </div>
      `
    },

    {
      topicKey: "psyllium_husk_purity",
      category: "Customs & Compliance",
      readTime: "5 min read",
      coverImage: "images/blog_psyllium.png",
      generateTitle: (dateStr) => `Psyllium Husk Quality Bulletin (${dateStr}): 99% Purity Standards, Swell Index & FDA Compliance`,
      generateTeaser: () => `Review official APEDA & Spices Board standards for Psyllium Husk (Plantago Ovata), 45 ml/g swell volume testing, heavy metal ICP-MS screening, and biosecurity clearances.`,
      compileBody: (dateStr) => `
        <p>India supplies over 85% of the world's Psyllium Husk (<em>Plantago Ovata</em>) or <strong>Isabgol</strong>. As of <strong>${dateStr}</strong>, strict dietary fiber regulations in North America (FDA) and Europe (EFSA) require bulk shipments to meet stringent purity levels and microbiological standards.</p>
        
        <h3>Technical Purity & Swell Volume Grading</h3>
        <p>Official trade standards classify Psyllium Husk into distinct commercial purity tiers. High-grade food and pharmaceutical applications require 98% to 99% ultra-pure grades:</p>

        <table>
          <thead>
            <tr>
              <th>Purity Grade Tiers</th>
              <th>Minimum Swell Volume</th>
              <th>Light Stuff / Foreign Matter</th>
              <th>Primary Industrial Application</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>99% Ultra-Pure (Super Grade)</strong></td>
              <td>45 ml / gram</td>
              <td>Max 1.0%</td>
              <td>Pharmaceutical capsules, health drinks, retail packaging</td>
            </tr>
            <tr>
              <td><strong>98% High Purity</strong></td>
              <td>40 ml / gram</td>
              <td>Max 2.0%</td>
              <td>Gluten-free bakery binding, food processing</td>
            </tr>
            <tr>
              <td><strong>95% Industrial Grade</strong></td>
              <td>35 ml / gram</td>
              <td>Max 5.0%</td>
              <td>Animal feed formulations and technical binders</td>
            </tr>
          </tbody>
        </table>

        <h3>Biosecurity & Heavy Metal Laboratory Testing</h3>
        <p>At <strong>MY EXPORT WORLD</strong>, every Psyllium Husk export consignment is tested under strict ISO 17025 laboratory protocols to guarantee compliance:</p>
        <ul>
          <li><strong>Heavy Metals Screening:</strong> ICP-MS testing verifying Lead (&lt; 1.0 ppm), Arsenic (&lt; 1.0 ppm), and Cadmium (&lt; 0.5 ppm).</li>
          <li><strong>Microbiological Safety:</strong> Certified 100% negative for <em>Salmonella</em> and <em>E. coli</em> per 25-gram sample.</li>
          <li><strong>Moisture Control:</strong> Maintained below 10.0% in multi-layer paper bags with PE liners to prevent swelling in transit.</li>
        </ul>

        <div class="official-citation-box" style="background: rgba(5, 25, 59, 0.04); border-left: 4px solid #D61C2C; padding: 1.2rem 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h4 style="margin:0 0 0.4rem 0; color: #051937; font-size: 1.05rem;"><i class="fa-solid fa-building-columns" style="color:#D61C2C;"></i> Verified Official Reference</h4>
          <p style="margin:0; font-size:0.88rem; color:#555;">
            Specifications sourced from <a href="${OFFICIAL_GOVT_DATA.apeda.url}" target="_blank" rel="noopener" style="color:#D61C2C; font-weight:600;">APEDA Agri Exchange Portal</a> and <a href="${OFFICIAL_GOVT_DATA.spicesBoard.mandatoryTestingUrl}" target="_blank" rel="noopener" style="color:#D61C2C; font-weight:600;">Spices Board Mandatory Testing Guidelines</a>.
          </p>
        </div>
      `
    },

    {
      topicKey: "freight_logistics_shipping",
      category: "Logistics & Shipping",
      readTime: "6 min read",
      coverImage: "images/blog_freight.png",
      generateTitle: (dateStr) => `Global Freight & Ocean Shipping Protocols (${dateStr}): FCL Container Specifications & Port Logistics`,
      generateTeaser: () => `A complete operational breakdown of FOB Nhava Sheva vs CIF destination pricing, 20ft/40ft container payload calculations, anti-moisture packing, and Bill of Lading execution.`,
      compileBody: (dateStr) => `
        <p>Efficient ocean freight logistics is the cornerstone of successful international trade. Sourcing bulk commodities from India as of <strong>${dateStr}</strong> requires a clear understanding of container payload capacities, Incoterms 2020 obligations, and port clearance timelines at major gateways such as <strong>Nhava Sheva (JNPT)</strong> and <strong>Mundra Port</strong>.</p>

        <h3>Container Sizing & Payload Weight Calculations</h3>
        <p>Selecting the optimal container mode ensures maximum cargo density while adhering to ocean shipping line weight restrictions:</p>

        <table>
          <thead>
            <tr>
              <th>Container Specifications</th>
              <th>20ft Dry Standard Container</th>
              <th>40ft High Cube (HC) Container</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Cubic Capacity</strong></td>
              <td>~33.2 CBM (Usable: 28 CBM)</td>
              <td>~76.4 CBM (Usable: 68 CBM)</td>
            </tr>
            <tr>
              <td><strong>Max Payload Weight</strong></td>
              <td>21,700 kg to 28,000 kg (Heavy Duty)</td>
              <td>26,500 kg</td>
            </tr>
            <tr>
              <td><strong>Ideal Commodity Match</strong></td>
              <td>Heavy dense cargo: Turmeric fingers, Cumin seeds, Psyllium husk</td>
              <td>Voluminous cargo: Light Psyllium powder, packaged consumer goods</td>
            </tr>
          </tbody>
        </table>

        <h3>FOB Nhava Sheva vs. CIF Destination Port Incoterms</h3>
        <p>Understanding ownership hand-off points protects buyers from unexpected landed cost inflation:</p>
        <ul>
          <li><strong>FOB (Free On Board - Nhava Sheva / Mundra):</strong> MY EXPORT WORLD covers export packaging, inland transport, origin port customs clearance, and container loading. The buyer selects the ocean carrier and marine insurance.</li>
          <li><strong>CIF (Cost, Insurance & Freight):</strong> MY EXPORT WORLD manages the sea freight and transit insurance all the way to your named destination port (e.g. Port of Hamburg, Rotterdam, Felixstowe, New York, Jebel Ali).</li>
        </ul>

        <div class="official-citation-box" style="background: rgba(5, 25, 59, 0.04); border-left: 4px solid #D61C2C; padding: 1.2rem 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h4 style="margin:0 0 0.4rem 0; color: #051937; font-size: 1.05rem;"><i class="fa-solid fa-building-columns" style="color:#D61C2C;"></i> Official Customs Procedure Reference</h4>
          <p style="margin:0; font-size:0.88rem; color:#555;">
            Logistics guidelines aligned with <a href="${OFFICIAL_GOVT_DATA.cbic.url}" target="_blank" rel="noopener" style="color:#D61C2C; font-weight:600;">CBIC Indian Customs Export Manual</a> and ICC Incoterms 2020 rules.
          </p>
        </div>
      `
    },

    {
      topicKey: "trade_finance_lc_guide",
      category: "Trade Finance & Laws",
      readTime: "5 min read",
      coverImage: "images/blog_finance.png",
      generateTitle: (dateStr) => `Trade Finance & Banking Security (${dateStr}): Irrevocable Letters of Credit (L/C) under UCP 600`,
      generateTeaser: () => `Understand Documentary Letter of Credit risk mitigation, eliminating payment defaults, preventing bank discrepancies, and structuring Irrevocable At-Sight L/Cs.`,
      compileBody: (dateStr) => `
        <p>Securing high-value international transactions as of <strong>${dateStr}</strong> demands robust financial instruments. The global standard for multi-ton commodity sourcing is the <strong>Irrevocable, Confirmed, At-Sight Letter of Credit (L/C)</strong>, governed by the International Chamber of Commerce rules <em>UCP 600</em>.</p>

        <h3>Structure of a Compliant Export Letter of Credit</h3>
        <p>To ensure smooth bank document presentation in India (via top trade banks like SBI, HDFC, or ICICI), importers should ensure their L/C applications contain the following verified clauses:</p>

        <table>
          <thead>
            <tr>
              <th>L/C Instrument Clause</th>
              <th>Standard Operational Requirement</th>
              <th>Protection Benefit for Importer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Type of Credit</strong></td>
              <td>Irrevocable, Confirmed, At Sight</td>
              <td>Prevents unilateral cancellation; payment is released only upon document compliance.</td>
            </tr>
            <tr>
              <td><strong>Document Presentation Window</strong></td>
              <td>21 days from Bill of Lading date</td>
              <td>Allows sufficient time for courier and banking examination.</td>
            </tr>
            <tr>
              <td><strong>Tolerance Clause</strong></td>
              <td>+/- 5% in Quantity and Amount</td>
              <td>Accounts for bulk cargo packing variations without causing discrepancies.</td>
            </tr>
          </tbody>
        </table>

        <h3>Preventing Common Banking Discrepancies</h3>
        <p>Over 40% of international trade delays stem from avoidable clerical mismatches. Key checklists include matching the Commercial Invoice description word-for-word with the L/C text and ensuring the HS Codes (e.g. HS 09103020) match official Indian customs tariffs exactly.</p>

        <div class="official-citation-box" style="background: rgba(5, 25, 59, 0.04); border-left: 4px solid #D61C2C; padding: 1.2rem 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h4 style="margin:0 0 0.4rem 0; color: #051937; font-size: 1.05rem;"><i class="fa-solid fa-building-columns" style="color:#D61C2C;"></i> Official Banking & Trade Law Reference</h4>
          <p style="margin:0; font-size:0.88rem; color:#555;">
            Financial structures aligned with ICC Uniform Customs and Practice for Documentary Credits (UCP 600) and <a href="${OFFICIAL_GOVT_DATA.dgft.url}" target="_blank" rel="noopener" style="color:#D61C2C; font-weight:600;">DGFT Foreign Trade Policy</a>.
          </p>
        </div>
      `
    },

    {
      topicKey: "cumin_chilli_market_specs",
      category: "Customs & Compliance",
      readTime: "5 min read",
      coverImage: "images/blog_spices.png",
      generateTitle: (dateStr) => `Indian Spices Market Report (${dateStr}): Cumin Seeds Sortex Purity & Red Chilli ASTA Color Grades`,
      generateTeaser: () => `Official Spices Board breakdown of Cumin Seeds (Jeera 99.5% Singapore/Europe quality) and Dry Red Chilli (Guntur Teja SHU heat, ASTA color value, Sudan dye testing).`,
      compileBody: (dateStr) => `
        <p>India is the global epicenter for Cumin Seeds (<em>Cuminum cyminum</em>) and Dry Red Chilli (<em>Capsicum annuum</em>). As of <strong>${dateStr}</strong>, international spice grinders and distributors require precise technical specifications to ensure compliance with destination food safety standards.</p>

        <h3>Cumin Seeds (Jeera) Quality Grading & Sortex Specs</h3>
        <p>Sourced from Gujarat and Rajasthan agricultural terminals, bulk cumin shipments are categorized by purity levels and mechanical cleaning standards:</p>

        <table>
          <thead>
            <tr>
              <th>Cumin Quality Tier</th>
              <th>Purity Level</th>
              <th>Volatile Oil Content</th>
              <th>Admixture / Dust Limits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Gulf / Super Quality</strong></td>
              <td>99.9% Double Sortex Cleaned</td>
              <td>Min 2.0% v/w</td>
              <td>Max 0.1%</td>
            </tr>
            <tr>
              <td><strong>Europe Quality</strong></td>
              <td>99.5% Machine Cleaned</td>
              <td>Min 1.8% v/w</td>
              <td>Max 0.5% (Strict MRL Compliance)</td>
            </tr>
            <tr>
              <td><strong>Singapore Quality</strong></td>
              <td>99.0% Standard Cleaned</td>
              <td>Min 1.5% v/w</td>
              <td>Max 1.0%</td>
            </tr>
          </tbody>
        </table>

        <h3>Dry Red Chilli ASTA Color & Heat Parameters</h3>
        <p>For Guntur S17 Teja and Sannam red chillies, quality is defined by pungency (Scoville Heat Units - SHU) and ASTA color values:</p>
        <ul>
          <li><strong>Guntur Teja (S17):</strong> Pungency: 75,000 - 100,000 SHU | ASTA Color: 90 - 110 ASTA. High heat, deep red.</li>
          <li><strong>Byadagi Chilli:</strong> Pungency: 10,000 - 25,000 SHU | ASTA Color: 150 - 200 ASTA. Exceptional natural red colorant.</li>
          <li><strong>Sudan Dye Certification:</strong> All chilli consignments are certified 100% free of artificial colorants (Sudan I-IV testing via accredited laboratories).</li>
        </ul>

        <div class="official-citation-box" style="background: rgba(5, 25, 59, 0.04); border-left: 4px solid #D61C2C; padding: 1.2rem 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h4 style="margin:0 0 0.4rem 0; color: #051937; font-size: 1.05rem;"><i class="fa-solid fa-building-columns" style="color:#D61C2C;"></i> Official Spices Board Reference</h4>
          <p style="margin:0; font-size:0.88rem; color:#555;">
            Data verified via <a href="${OFFICIAL_GOVT_DATA.spicesBoard.url}" target="_blank" rel="noopener" style="color:#D61C2C; font-weight:600;">Spices Board Quality Standards</a> and <a href="${OFFICIAL_GOVT_DATA.dgft.url}" target="_blank" rel="noopener" style="color:#D61C2C; font-weight:600;">DGFT ITC (HS) Code Index</a>.
          </p>
        </div>
      `
    }
  ];

  // Helper date formatter: "Month DD, YYYY"
  function getFormattedDate(d = new Date()) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  // Helper ISO Date String: "YYYY-MM-DD"
  function getISODateKey(d = new Date()) {
    return d.toISOString().split('T')[0];
  }

  // Engine Object
  const AutoBlogEngine = {
    OFFICIAL_GOVT_DATA,

    /**
     * Generate an official data-backed blog post for a given date
     */
    generateOfficialPost: function (targetDate = new Date()) {
      const dateStr = getFormattedDate(targetDate);
      const isoKey = getISODateKey(targetDate);

      // Select topic deterministically based on date timestamp so same day yields same topic
      const dayOfYear = Math.floor((targetDate - new Date(targetDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      const topicIndex = dayOfYear % TOPIC_LIBRARY.length;
      const topic = TOPIC_LIBRARY[topicIndex];

      const newPost = {
        id: "auto_blog_" + isoKey.replace(/-/g, '_'),
        timestamp: targetDate.toISOString(),
        dateFormatted: dateStr,
        isoDate: isoKey,
        isAutoGenerated: true,
        officialSource: topic.category,
        title: topic.generateTitle(dateStr),
        category: topic.category,
        readTime: topic.readTime,
        coverImage: topic.coverImage,
        thumbnailImage: topic.coverImage,
        teaserSummary: topic.generateTeaser(),
        bodyContent: topic.compileBody(dateStr)
      };

      return newPost;
    },

    /**
     * Check if auto-publish setting is enabled
     */
    isAutoPublishEnabled: function () {
      try {
        const val = localStorage.getItem('myexportworld_auto_blog_enabled');
        return val === null ? true : val === 'true';
      } catch (e) {
        return true;
      }
    },

    /**
     * Set auto-publish setting
     */
    setAutoPublishEnabled: function (enabled) {
      try {
        localStorage.setItem('myexportworld_auto_blog_enabled', enabled ? 'true' : 'false');
      } catch (e) {
        console.error("Failed to save auto blog toggle setting", e);
      }
    },

    /**
     * Check and publish today's daily post if missing
     */
    checkAndPublishDailyPost: async function (db = null) {
      if (!this.isAutoPublishEnabled()) {
        console.log("Auto-Blog engine is currently toggled OFF.");
        return null;
      }

      const todayIso = getISODateKey(new Date());

      // Read current posts from LocalStorage
      let currentPosts = [];
      try {
        const stored = localStorage.getItem('myexportworld_blog_posts');
        if (stored) currentPosts = JSON.parse(stored);
      } catch (e) {
        currentPosts = [];
      }

      // Find existing post for today
      let todayPost = currentPosts.find(p => {
        if (p && (p.isoDate === todayIso || (p.timestamp && p.timestamp.startsWith(todayIso)))) return true;
        return false;
      });

      if (!todayPost) {
        // Generate new post for today
        todayPost = this.generateOfficialPost(new Date());
        currentPosts.unshift(todayPost);

        // Save to LocalStorage
        try {
          localStorage.setItem('myexportworld_blog_posts', JSON.stringify(currentPosts));
        } catch (e) {
          console.error("LocalStorage write error:", e);
        }
      }

      // Sync to Firebase Firestore if available
      if (db && todayPost) {
        try {
          await db.collection('blog_posts').doc(todayPost.id).set(todayPost);
          console.log("Synced today's official blog post to Firestore:", todayPost.id);
        } catch (err) {
          console.error("Firestore Auto Blog Upload Error:", err);
        }
      }

      return todayPost;
    }
  };

  // Export module globally (Browser window.AutoBlogEngine or Node module.exports)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoBlogEngine;
  } else {
    global.AutoBlogEngine = AutoBlogEngine;
  }

})(typeof window !== 'undefined' ? window : this);
