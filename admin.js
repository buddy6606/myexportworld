/* ==========================================================================
   MY EXPORT WORLD - Administrative Console JS Logic (admin.js)
   Integrates with localStorage databases and manages the editorial/inquiry desks
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Clean URL Address Bar Extension Handler ---
  (function handleCleanUrls() {
    if (window.location && window.location.protocol !== 'file:') {
      let path = window.location.pathname || '';
      if (path && path.endsWith('.html')) {
        let clean = path.replace(/\.html$/, '');
        if (clean.endsWith('/index')) {
          clean = clean.replace(/\/index$/, '/');
        }
        window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
      }
    }
  })();

  // --- Firebase Cloud Database Setup ---
  const firebaseConfig = {
    apiKey: "AIzaSyDghJ_xAllf53HxEVdGVgAPlM2-hWJVI14",
    authDomain: "website-ab545.firebaseapp.com",
    projectId: "website-ab545",
    storageBucket: "website-ab545.firebasestorage.app",
    messagingSenderId: "682556744579",
    appId: "1:682556744579:web:e46019c337a4f2940b4cb6",
    measurementId: "G-QYTRY98GDT"
  };

  let db = null;
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
  }

  // --- State Variables ---
  let inquiries = [];
  let blogPosts = [];
  let products = [];
  let certificates = [];
  const correctAccessKey = "MYEXPORTWORLD9601343577";

  const defaultCertificates = [
    {
      id: "cert_apeda",
      title: "APEDA Certificate",
      authority: "Govt. of India recognized",
      theme: "blue",
      label: "Merchant Exporter",
      status: "Active & Verified",
      image: "images/certificate_sample.jpg",
      desc: "Registered with the Agricultural and Processed Food Products Export Development Authority. This certifies our eligibility to export premium quality fresh vegetables, fruits, and processed food products globally with complete regulatory endorsement."
    },
    {
      id: "cert_spices_board",
      title: "Spices Board Registration",
      authority: "Ministry of Commerce, India",
      theme: "red",
      label: "CRE (Certificate of Registration)",
      status: "Active & Verified",
      image: "images/certificate_sample.jpg",
      desc: "Officially registered with the Spices Board of India as an approved exporter of Indian spices. This confirms our organic spices—specifically our premium turmeric, chilli, cumin, and psyllium varieties—undergo strict grade standardization and phytosanitary inspections."
    },
    {
      id: "cert_fssai",
      title: "FSSAI License",
      authority: "Food Safety Standards Authority",
      theme: "gold",
      label: "Food Grade Exporter",
      status: "Active & Verified",
      image: "images/certificate_sample.jpg",
      desc: "Licensed by the Food Safety and Standards Authority of India for operating in food business and export sectors. This registration validates that our processing units, warehouse conditions, and sorting/packaging workflows adhere to global hygiene guidelines."
    },
    {
      id: "cert_iec",
      title: "Import Export Code (IEC)",
      authority: "DGFT, Ministry of Commerce",
      theme: "blue",
      label: "Govt. of India Authorized",
      status: "Active & Verified",
      image: "images/certificate_sample.jpg",
      desc: "Issued by the Directorate General of Foreign Trade (DGFT), Ministry of Commerce and Industry. Our IEC code is our corporate global identity, enabling seamless customs dispatch, trade financing, and official international container shipping operations."
    },
    {
      id: "cert_iso",
      title: "ISO 22000 & HACCP",
      authority: "International Standardization",
      theme: "red",
      label: "Food Safety Management",
      status: "Active & Verified",
      image: "images/certificate_sample.jpg",
      desc: "Certifies that our agricultural supply chain complies with the internationally accepted Hazard Analysis Critical Control Point (HACCP) system and ISO 22000 standards. Ensures a comprehensive biological, chemical, and physical food safety protocol."
    },
    {
      id: "cert_msme",
      title: "MSME Udyam Registration",
      authority: "Ministry of MSME, India",
      theme: "gold",
      label: "Micro / Service Exporter",
      status: "Active & Verified",
      image: "images/certificate_sample.jpg",
      desc: "Registered under Udyam Scheme, Ministry of Micro, Small & Medium Enterprises, Government of India. This registration strengthens our trade credibility, grants official enterprise status, and guarantees active participation in trade summits."
    }
  ];

  const sampleProducts = [
    // --- 1. Turmeric ---
    {
      id: "prod_turmeric_finger",
      title: "Dried Turmeric Finger",
      hsCode: "09103020",
      category: "turmeric",
      badge: "Double Polished",
      image: "images/turmeric_finger.jpg",
      description: "Premium quality dried whole turmeric rhizomes, double polished to yield bright yellow-gold skin. Min 3.5% Curcumin.",
      specs: [
        { name: "Curcumin", value: "Min 3.5%" },
        { name: "Origin", value: "Nizamabad / Sangli, India" },
        { name: "Packing", value: "25 / 50 kg PP Bags" },
        { name: "Purity", value: "Min 99%" },
        { name: "Moisture", value: "Max 10%" }
      ]
    },
    {
      id: "prod_turmeric_powder",
      title: "Turmeric Powder",
      hsCode: "09103030",
      category: "turmeric",
      badge: "Ultra-Fine Ground",
      image: "images/turmeric_powder.jpg",
      description: "Pure ground turmeric spice, processed under hygienic conditions to preserve active aroma and essential oils.",
      specs: [
        { name: "Curcumin", value: "Min 3.8%" },
        { name: "Origin", value: "Erode / Nizamabad, India" },
        { name: "Mesh Size", value: "60 - 80 mesh" },
        { name: "Purity", value: "100% Pure, No Additives" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },

    // --- 2. Psyllium ---
    {
      id: "prod_psyllium_husk",
      title: "Psyllium Husk Whole",
      hsCode: "12119032",
      category: "psyllium",
      badge: "99% Ultra-Pure",
      image: "images/psyllium_husk.png",
      description: "Premium whole seed husks of Plantago ovata, serving as an exceptional soluble dietary fiber.",
      specs: [
        { name: "Purity Grade", value: "99% (Swell Index 45ml/g)" },
        { name: "Origin", value: "Gujarat / Rajasthan, India" },
        { name: "Packing", value: "15 / 25 kg Paper Bags" },
        { name: "Swell Volume", value: "Min 40 ml / gram" },
        { name: "Light Stuff", value: "Max 1%" }
      ]
    },
    {
      id: "prod_psyllium_powder",
      title: "Psyllium Husk Powder",
      hsCode: "12119033",
      category: "psyllium",
      badge: "Milled Fiber",
      image: "images/psyllium_powder.png",
      description: "Fine ground psyllium husk powder, ideal for easy blending into dietary supplements and bakery products.",
      specs: [
        { name: "Purity Grade", value: "98% (40-60 mesh)" },
        { name: "Origin", value: "Gujarat, India" },
        { name: "Packing", value: "25 kg Multi-layer Paper Bags" },
        { name: "Mesh Size", value: "40 - 100 mesh" },
        { name: "Swell Volume", value: "Min 35 ml / gram" }
      ]
    },

    // --- 3. Cumin ---
    {
      id: "prod_cumin_seeds",
      title: "Cumin Seeds",
      hsCode: "09093120",
      category: "cumin",
      badge: "Sortex Cleaned",
      image: "images/cumin_seeds.png",
      description: "Premium grade machine-cleaned and Sortex-purified dry cumin seeds.",
      specs: [
        { name: "Purity", value: "Min 99%" },
        { name: "Origin", value: "Gujarat / Rajasthan, India" },
        { name: "Packing", value: "25 / 50 kg Jute Bags" },
        { name: "Extraneous Matter", value: "Max 1%" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },
    {
      id: "prod_cumin_powder",
      title: "Cumin Powder",
      hsCode: "09093200",
      category: "cumin",
      badge: "Aromatic Ground",
      image: "images/cumin_powder.png",
      description: "Pure ground cumin spice, milled under cold processing to preserve natural volatile oils.",
      specs: [
        { name: "Volatile Oil", value: "Min 1.5%" },
        { name: "Origin", value: "Gujarat, India" },
        { name: "Mesh Size", value: "50 - 60 mesh" },
        { name: "Purity", value: "100% Pure, No Additives" },
        { name: "Moisture", value: "Max 8%" }
      ]
    },

    // --- 4. Red Chilli ---
    {
      id: "prod_red_chilli",
      title: "Dry Red Chilli",
      hsCode: "09042211",
      category: "chilli",
      badge: "Stemless Grade-A",
      image: "images/chilli_whole.png",
      description: "Premium sun-dried stemless red chilli pods featuring deep color and pungency rating.",
      specs: [
        { name: "Variety", value: "Guntur S17 / Teja" },
        { name: "Origin", value: "Andhra Pradesh, India" },
        { name: "Pungency", value: "75,000 - 100,000 SHU" },
        { name: "Color Value", value: "Min 100 ASTA" },
        { name: "Moisture", value: "Max 11%" }
      ]
    },
    {
      id: "prod_chilli_powder",
      title: "Red Chilli Powder",
      hsCode: "09042212",
      category: "chilli",
      badge: "Vibrant Pungent",
      image: "images/chilli_powder.png",
      description: "Finely ground premium red chilli powder, delivering consistent heat and rich red coloring.",
      specs: [
        { name: "Pungency", value: "60,000 - 80,000 SHU" },
        { name: "Origin", value: "Guntur, India" },
        { name: "Packing", value: "20 / 25 kg PP Bags" },
        { name: "Purity", value: "100% Natural" },
        { name: "Moisture", value: "Max 9.5%" }
      ]
    },

    // --- 5. Cardamom ---
    {
      id: "prod_cardamom_whole",
      title: "Cardamom (Whole Green Pods)",
      hsCode: "09083110",
      category: "cardamom",
      badge: "Bold Green Pods",
      image: "images/cardamom_whole.jpg",
      description: "Handpicked premium green cardamom pods with intense aroma and high essential oil content.",
      specs: [
        { name: "Grade", value: "7mm - 8mm Bold" },
        { name: "Volatile Oil", value: "Min 6.0%" },
        { name: "Origin", value: "Idukki, Kerala, India" },
        { name: "Packing", value: "10 / 25 kg Bags" },
        { name: "Moisture", value: "Max 10%" }
      ]
    },
    {
      id: "prod_cardamom_powder",
      title: "Cardamom Powder",
      hsCode: "09083200",
      category: "cardamom",
      badge: "Aromatic Ground",
      image: "images/cardamom_powder.jpg",
      description: "Freshly ground pure cardamom spice, milled from whole green pods to retain volatile aroma.",
      specs: [
        { name: "Mesh Size", value: "50 - 60 mesh" },
        { name: "Origin", value: "Kerala, India" },
        { name: "Packing", value: "10 / 25 kg Foil Bags" },
        { name: "Purity", value: "100% Pure, No Additives" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },

    // --- 6. Black Pepper ---
    {
      id: "prod_black_pepper_whole",
      title: "Black Pepper (Whole Seeds)",
      hsCode: "09041110",
      category: "black_pepper",
      badge: "Tellicherry / MG1",
      image: "images/black_pepper.jpg",
      description: "Sun-dried whole black peppercorns harvested from Kerala's Malabar coast. High piperine pungency.",
      specs: [
        { name: "Density", value: "550 - 600 g/l" },
        { name: "Piperine", value: "Min 4.5%" },
        { name: "Origin", value: "Malabar / Kerala, India" },
        { name: "Packing", value: "25 / 50 kg PP Bags" },
        { name: "Moisture", value: "Max 11%" }
      ]
    },
    {
      id: "prod_black_pepper_powder",
      title: "Black Pepper Powder",
      hsCode: "09041200",
      category: "black_pepper",
      badge: "Pure Ground Pepper",
      image: "images/black_pepper_powder.jpg",
      description: "Finely ground pure black pepper powder delivering sharp pungency and rich woody aroma.",
      specs: [
        { name: "Piperine", value: "Min 4.0%" },
        { name: "Mesh Size", value: "40 - 60 mesh" },
        { name: "Origin", value: "Kerala, India" },
        { name: "Packing", value: "20 / 25 kg Bags" },
        { name: "Moisture", value: "Max 10%" }
      ]
    },

    // --- 7. Ajwain ---
    {
      id: "prod_ajwain_seeds",
      title: "Ajwain (Carom Seeds Whole)",
      hsCode: "09109914",
      category: "ajwain",
      badge: "Sortex Cleaned",
      image: "images/ajwain_seeds.jpg",
      description: "Machine-cleaned aromatic Carom seeds rich in essential thymol oils and medicinal warmth.",
      specs: [
        { name: "Thymol Content", value: "Min 3.5%" },
        { name: "Purity", value: "Min 99%" },
        { name: "Origin", value: "Gujarat / Rajasthan, India" },
        { name: "Packing", value: "25 kg Jute Bags" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },
    {
      id: "prod_ajwain_powder",
      title: "Ajwain (Carom Seeds) Powder",
      hsCode: "09109990",
      category: "ajwain",
      badge: "Herbal Ground",
      image: "images/ajwain_powder.jpg",
      description: "Hygienically milled pure Carom seed powder, retaining active essential oil and pungent aroma.",
      specs: [
        { name: "Thymol Value", value: "High Potency" },
        { name: "Origin", value: "Gujarat, India" },
        { name: "Packing", value: "20 / 25 kg Bags" },
        { name: "Purity", value: "100% Natural" },
        { name: "Moisture", value: "Max 8.5%" }
      ]
    },

    // --- 8. Curry Leaves ---
    {
      id: "prod_curry_leaves_crushed",
      title: "Crushed Curry Leaves",
      hsCode: "09109929",
      category: "curry_leaves",
      badge: "Shade Dried",
      image: "images/curry_leaves_crushed.jpg",
      description: "Shade-dried crushed green curry leaves, preserving natural green color and pungent herbal aroma.",
      specs: [
        { name: "Process", value: "Low-Temp Shade Dried" },
        { name: "Color", value: "Deep Natural Green" },
        { name: "Origin", value: "Tamil Nadu / Andhra, India" },
        { name: "Packing", value: "15 / 25 kg Bags" },
        { name: "Moisture", value: "Max 8%" }
      ]
    },
    {
      id: "prod_curry_leaves_powder",
      title: "Crushed Curry Leaves Powder",
      hsCode: "09109990",
      category: "curry_leaves",
      badge: "Micro-Fine Powder",
      image: "images/curry_leaves_powder.jpg",
      description: "Fine ground curry leaf powder, rich in natural antioxidants and essential culinary aroma.",
      specs: [
        { name: "Mesh Size", value: "60 - 80 mesh" },
        { name: "Color", value: "Natural Green" },
        { name: "Origin", value: "South India" },
        { name: "Packing", value: "15 / 25 kg Foil Bags" },
        { name: "Moisture", value: "Max 7.5%" }
      ]
    },

    // --- 9. Clove ---
    {
      id: "prod_clove_whole",
      title: "Clove (Whole Cloves)",
      hsCode: "09071000",
      category: "clove",
      badge: "Handpicked Headed",
      image: "images/clove_whole.jpg",
      description: "Sun-dried whole cloves with intact heads, rich in natural eugenol oil and warming aroma.",
      specs: [
        { name: "Eugenol Content", value: "Min 15% - 18%" },
        { name: "Head Intactness", value: "Min 95%" },
        { name: "Origin", value: "Kerala / Tamil Nadu, India" },
        { name: "Packing", value: "10 / 25 kg Bags" },
        { name: "Moisture", value: "Max 10%" }
      ]
    },
    {
      id: "prod_clove_powder",
      title: "Clove Powder",
      hsCode: "09072000",
      category: "clove",
      badge: "High Oil Ground",
      image: "images/clove_powder.jpg",
      description: "Finely milled pure clove powder delivering concentrated eugenol aroma and warm spicy pungency.",
      specs: [
        { name: "Eugenol Value", value: "Min 14%" },
        { name: "Mesh Size", value: "40 - 60 mesh" },
        { name: "Origin", value: "India" },
        { name: "Packing", value: "20 kg Foil-Lined Bags" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },

    // --- 10. Mustard ---
    {
      id: "prod_mustard_seeds",
      title: "Mustard Seeds (Yellow & Black)",
      hsCode: "12075090",
      category: "mustard",
      badge: "Bold Sortex Cleaned",
      image: "images/mustard_seeds.jpg",
      description: "Machine-cleaned and Sortex-purified bold yellow and small black mustard seeds. High oil yield.",
      specs: [
        { name: "Variety", value: "Bold Yellow & Small Black" },
        { name: "Oil Content", value: "Min 38% - 42%" },
        { name: "Origin", value: "Rajasthan / Gujarat, India" },
        { name: "Packing", value: "25 / 50 kg PP Bags" },
        { name: "Purity", value: "Min 99.5%" }
      ]
    },

    // --- 11. Fennel ---
    {
      id: "prod_fennel_seeds",
      title: "Fennel Seeds (Saunf Whole)",
      hsCode: "09096130",
      category: "fennel",
      badge: "Sortex Cleaned",
      image: "images/fennel_seeds.png",
      description: "Machine-cleaned and Sortex-purified aromatic green Fennel seeds (Saunf). Sourced from Gujarat and Rajasthan.",
      specs: [
        { name: "Purity", value: "Min 99%" },
        { name: "Origin", value: "Gujarat / Rajasthan, India" },
        { name: "Packing", value: "25 / 50 kg PP Bags" },
        { name: "Volatile Oil", value: "Min 1.2%" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },
    {
      id: "prod_fennel_powder",
      title: "Fennel Seeds Powder (Saunf Powder)",
      hsCode: "09096230",
      category: "fennel",
      badge: "Aromatic Ground",
      image: "images/fennel_powder.png",
      description: "Finely ground pure fennel seed spice, cool milled to preserve sweet aromatic flavor and essential anise oils.",
      specs: [
        { name: "Mesh Size", value: "50 - 60 mesh" },
        { name: "Origin", value: "Gujarat, India" },
        { name: "Packing", value: "20 / 25 kg PP Bags" },
        { name: "Purity", value: "100% Pure, No Additives" },
        { name: "Moisture", value: "Max 8.5%" }
      ]
    },

    // --- 12. Coriander ---
    {
      id: "prod_coriander_seeds",
      title: "Coriander Seeds (Dhana Whole)",
      hsCode: "09092110",
      category: "coriander",
      badge: "Green Eagle Quality",
      image: "images/coriander_seeds.png",
      description: "Whole sun-dried golden and green coriander seeds, thoroughly machine cleaned and graded for export.",
      specs: [
        { name: "Variety", value: "Eagle / Scoop / Super Green" },
        { name: "Origin", value: "Rajasthan / MP, India" },
        { name: "Packing", value: "25 / 40 kg Jute/PP Bags" },
        { name: "Purity", value: "Min 98.5% - 99%" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },
    {
      id: "prod_coriander_powder",
      title: "Coriander Seed Powder (Dhana Powder)",
      hsCode: "09092200",
      category: "coriander",
      badge: "Cold Milled",
      image: "images/coriander_powder.png",
      description: "Hygienically cold-milled pure coriander seed powder, preserving fresh herbal aroma and citrus notes.",
      specs: [
        { name: "Mesh Size", value: "50 - 60 mesh" },
        { name: "Origin", value: "Rajasthan, India" },
        { name: "Packing", value: "25 kg PP Bags with Liner" },
        { name: "Purity", value: "100% Pure, No Additives" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },

    // --- 13. Cinnamon ---
    {
      id: "prod_cinnamon_whole",
      title: "Cinnamon Quills / Sticks (Dalchini)",
      hsCode: "09061110",
      category: "cinnamon",
      badge: "Ceylonese / Cassia Grade",
      image: "images/cinnamon_sticks.png",
      description: "Premium whole rolled cinnamon bark quills with rich sweet woody aroma and high cinnamaldehyde oil content.",
      specs: [
        { name: "Grade", value: "ALBA / C5 Special / Bold Cassia" },
        { name: "Origin", value: "Kerala / South India" },
        { name: "Packing", value: "10 / 25 kg Cartons/Bags" },
        { name: "Volatile Oil", value: "Min 2.0%" },
        { name: "Moisture", value: "Max 12%" }
      ]
    },
    {
      id: "prod_cinnamon_powder",
      title: "Cinnamon Powder (Dalchini Powder)",
      hsCode: "09062000",
      category: "cinnamon",
      badge: "Sweet Spicy Ground",
      image: "images/cinnamon_powder.png",
      description: "Pure finely ground cinnamon powder milled from selected bark quills, delivering intense sweet spice aroma.",
      specs: [
        { name: "Mesh Size", value: "60 - 80 mesh" },
        { name: "Origin", value: "India" },
        { name: "Packing", value: "15 / 25 kg Foil-Lined Bags" },
        { name: "Purity", value: "100% Pure Natural" },
        { name: "Moisture", value: "Max 10%" }
      ]
    },

    // --- 14. Fresh Vegetables ---
    {
      id: "prod_fresh_red_onion",
      title: "Fresh Red Onion (Nashik Export Quality)",
      hsCode: "07031019",
      category: "vegetables",
      badge: "A-Grade Export",
      image: "images/onion.png",
      description: "Premium export-grade fresh Indian red onions from Nashik & Mahuva regions, packed in ventilated mesh bags for extended shelf life. Phytosanitary & fumigation certified for global markets.",
      specs: [
        { name: "Origin", value: "Nashik / Mahuva, India" },
        { name: "Size Grade", value: "45-65 mm / 55-75 mm / 75+ mm" },
        { name: "Moisture", value: "Max 6-8%" },
        { name: "Packing", value: "5 / 10 / 25 / 50 kg Mesh Bags" },
        { name: "Season", value: "Year-round (Peak: Dec - May)" }
      ]
    }
  ];

  // --- DOM Elements ---
  const authContainer = document.getElementById('authContainer');
  const dashboardContainer = document.getElementById('dashboardContainer');
  const authCard = document.getElementById('authCard');
  const authForm = document.getElementById('authForm');
  const accessKeyInput = document.getElementById('accessKeyInput');
  const btnLogout = document.getElementById('btnLogout');

  // Tabs
  const tabBtnInquiries = document.getElementById('tabBtnInquiries');
  const tabBtnBlog = document.getElementById('tabBtnBlog');
  const tabBtnProducts = document.getElementById('tabBtnProducts');
  const tabBtnCertificates = document.getElementById('tabBtnCertificates');
  const panelInquiries = document.getElementById('panelInquiries');
  const panelBlog = document.getElementById('panelBlog');
  const panelProducts = document.getElementById('panelProducts');
  const panelCertificates = document.getElementById('panelCertificates');

  // Inquiries Elements
  const adminStatInquiriesTotal = document.getElementById('adminStatInquiriesTotal');
  const adminStatInquiriesToday = document.getElementById('adminStatInquiriesToday');
  const inquirySearchInput = document.getElementById('inquirySearchInput');
  const adminTableBody = document.getElementById('adminTableBody');
  const adminExportBtn = document.getElementById('adminExportBtn');
  const adminClearBtn = document.getElementById('adminClearBtn');

  // Blog Elements
  const adminStatBlogsTotal = document.getElementById('adminStatBlogsTotal');
  const adminBlogForm = document.getElementById('adminBlogForm');
  const blogImageSelect = document.getElementById('blogImage');
  const blogImageCustom = document.getElementById('blogImageCustom');
  const blogThumbnailSelect = document.getElementById('blogThumbnail');
  const blogThumbnailCustom = document.getElementById('blogThumbnailCustom');
  const adminBlogTableBody = document.getElementById('adminBlogTableBody');

  // Product Elements
  const adminProductForm = document.getElementById('adminProductForm');
  const prodCommoditySelect = document.getElementById('prodCommodity');
  const prodCommodityCustom = document.getElementById('prodCommodityCustom');
  const prodCategorySelect = document.getElementById('prodCategory');
  const prodCategoryCustom = document.getElementById('prodCategoryCustom');
  const prodImageSelect = document.getElementById('prodImage');
  const prodImageCustom = document.getElementById('prodImageCustom');
  const prodImageFile = document.getElementById('prodImageFile');
  const adminProductTableBody = document.getElementById('adminProductTableBody');

  // Certificate Elements
  const adminCertForm = document.getElementById('adminCertForm');
  const adminCertTableBody = document.getElementById('adminCertTableBody');
  const adminStatCertsTotal = document.getElementById('adminStatCertsTotal');
  const adminStatCertsActive = document.getElementById('adminStatCertsActive');
  const adminStatCertsGovt = document.getElementById('adminStatCertsGovt');
  const adminStatCertsSafety = document.getElementById('adminStatCertsSafety');

  // --- 1. Authorization Controls ---
  const checkSessionAuth = () => {
    const isAuth = sessionStorage.getItem('myexportworld_admin_authorized');
    if (isAuth === 'true') {
      showDashboard();
    } else {
      showLockScreen();
    }
  };

  const showDashboard = () => {
    authContainer.style.display = 'none';
    dashboardContainer.style.display = 'flex';
    
    // Initial Data Sync
    loadDatabase();
    
    // Check url hash/params for tab selection
    handleTabRouting();
  };

  const showLockScreen = () => {
    authContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
    accessKeyInput.value = '';
    accessKeyInput.focus();
  };

  // Auth form submission
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredKey = accessKeyInput.value.trim();

      if (enteredKey === correctAccessKey) {
        sessionStorage.setItem('myexportworld_admin_authorized', 'true');
        showToast("Administrative Desk Unlocked", "success");
        showDashboard();
      } else {
        // Play error shake animation
        authCard.classList.add('shake');
        showToast("Invalid Access Key. Please try again.", "warning");
        setTimeout(() => {
          authCard.classList.remove('shake');
        }, 500);
        accessKeyInput.value = '';
        accessKeyInput.focus();
      }
    });
  }

  // Logout Click
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      const confirmLogout = confirm("Are you sure you want to log out of the Administrative Console?");
      if (confirmLogout) {
        sessionStorage.removeItem('myexportworld_admin_authorized');
        showToast("Logged out successfully", "info");
        showLockScreen();
      }
    });
  }

  // --- 2. Database Loader & Sync ---
  let isFirestoreInitialized = false;

  const loadDatabase = () => {
    if (db && !isFirestoreInitialized) {
      isFirestoreInitialized = true;
      db.collection('inquiries').onSnapshot(snapshot => {
        inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        localStorage.setItem('myexportworld_inquiries', JSON.stringify(inquiries));
        renderInquiriesTable();
        updateStatistics();
      });
      db.collection('blog_posts').onSnapshot(snapshot => {
        const deleted = JSON.parse(localStorage.getItem('myexportworld_deleted_blogs') || '[]');
        if (!snapshot.empty) {
          blogPosts = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => !deleted.includes(p.id));
          localStorage.setItem('myexportworld_blog_posts', JSON.stringify(blogPosts));
          renderBlogsTable();
          updateStatistics();
        }
      });
      db.collection('products').onSnapshot(snapshot => {
        const deleted = JSON.parse(localStorage.getItem('myexportworld_deleted_products') || '[]');
        let remoteProducts = [];
        if (!snapshot.empty) {
          remoteProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        const productMap = new Map();
        sampleProducts.filter(p => !deleted.includes(p.id)).forEach(p => productMap.set(p.id, p));
        remoteProducts.filter(p => !deleted.includes(p.id)).forEach(p => productMap.set(p.id, p));

        products = Array.from(productMap.values());
        localStorage.setItem('myexportworld_products_v17', JSON.stringify(products));
        renderProductsTable();
        updateStatistics();
      });
    }

    // Load Inquiries fallback
    try {
      const storedInquiries = localStorage.getItem('myexportworld_inquiries');
      if (storedInquiries) inquiries = JSON.parse(storedInquiries);
      else inquiries = [];
    } catch (e) { inquiries = []; }

    // Load Blogs fallback
    try {
      const deletedBlogs = JSON.parse(localStorage.getItem('myexportworld_deleted_blogs') || '[]');
      const storedBlogs = localStorage.getItem('myexportworld_blog_posts');
      if (storedBlogs) blogPosts = JSON.parse(storedBlogs).filter(p => !deletedBlogs.includes(p.id));
      else blogPosts = [];
    } catch (e) { blogPosts = []; }

    // Load Products fallback
    try {
      const deletedProds = JSON.parse(localStorage.getItem('myexportworld_deleted_products') || '[]');
      const storedProducts = localStorage.getItem('myexportworld_products_v17');
      if (storedProducts) products = JSON.parse(storedProducts).filter(p => !deletedProds.includes(p.id));
      else products = sampleProducts.filter(p => !deletedProds.includes(p.id));
    } catch (e) { products = []; }

    // Load Certificates fallback
    try {
      const deletedCerts = JSON.parse(localStorage.getItem('myexportworld_deleted_certs') || '[]');
      const storedCerts = localStorage.getItem('myexportworld_certificates');
      if (storedCerts) certificates = JSON.parse(storedCerts).filter(c => !deletedCerts.includes(c.id));
      else {
        certificates = defaultCertificates.filter(c => !deletedCerts.includes(c.id));
        localStorage.setItem('myexportworld_certificates', JSON.stringify(certificates));
      }
    } catch (e) { certificates = []; }

    renderInquiriesTable();
    renderBlogsTable();
    renderProductsTable();
    renderCertificatesTable();
    updateStatistics();
  };

  const saveInquiries = () => {
    try {
      localStorage.setItem('myexportworld_inquiries', JSON.stringify(inquiries));
    } catch (e) { console.error("Failed to save inquiries to localStorage", e); }
    updateStatistics();
  };

  const saveBlogPosts = () => {
    try {
      localStorage.setItem('myexportworld_blog_posts', JSON.stringify(blogPosts));
    } catch (e) { console.error("Failed to save blog posts to localStorage", e); }
    updateStatistics();
  };

  const saveProducts = () => {
    try {
      localStorage.setItem('myexportworld_products_v17', JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
    updateStatistics();
  };

  const saveCertificates = () => {
    try {
      localStorage.setItem('myexportworld_certificates', JSON.stringify(certificates));
    } catch (e) {
      console.error("Failed to save certificates to localStorage", e);
    }
    updateStatistics();
  };

  // Statistics calculation
  const updateStatistics = () => {
    if (adminStatInquiriesTotal) {
      adminStatInquiriesTotal.textContent = inquiries.length;
    }
    
    if (adminStatInquiriesToday) {
      const todayPrefix = getFormattedDate(); // "YYYY-MM-DD"
      const todayCount = inquiries.filter(inq => inq && inq.timestamp && typeof inq.timestamp === 'string' && inq.timestamp.startsWith(todayPrefix)).length;
      adminStatInquiriesToday.textContent = todayCount;
    }

    if (adminStatBlogsTotal) {
      adminStatBlogsTotal.textContent = blogPosts.length;
    }

    if (document.getElementById('adminStatProductsTotal')) {
      document.getElementById('adminStatProductsTotal').textContent = products.length;
    }
    if (document.getElementById('adminStatProductsTurmeric')) {
      document.getElementById('adminStatProductsTurmeric').textContent = products.filter(p => p.category === 'turmeric').length;
    }
    if (document.getElementById('adminStatProductsPsyllium')) {
      document.getElementById('adminStatProductsPsyllium').textContent = products.filter(p => p.category === 'psyllium').length;
    }
    if (document.getElementById('adminStatProductsCumin')) {
      document.getElementById('adminStatProductsCumin').textContent = products.filter(p => p.category === 'cumin').length;
    }
    if (document.getElementById('adminStatProductsChilli')) {
      document.getElementById('adminStatProductsChilli').textContent = products.filter(p => p.category === 'chilli').length;
    }
    if (document.getElementById('adminStatProductsFennel')) {
      document.getElementById('adminStatProductsFennel').textContent = products.filter(p => p.category === 'fennel').length;
    }
    if (document.getElementById('adminStatProductsCoriander')) {
      document.getElementById('adminStatProductsCoriander').textContent = products.filter(p => p.category === 'coriander').length;
    }
    if (document.getElementById('adminStatProductsCinnamon')) {
      document.getElementById('adminStatProductsCinnamon').textContent = products.filter(p => p.category === 'cinnamon').length;
    }

    // Certificate Statistics
    if (adminStatCertsTotal) {
      adminStatCertsTotal.textContent = certificates.length;
    }
    if (adminStatCertsActive) {
      adminStatCertsActive.textContent = certificates.filter(c => (c.status || '').includes('Active')).length;
    }
    if (adminStatCertsGovt) {
      adminStatCertsGovt.textContent = certificates.filter(c => c.theme === 'blue' || (c.authority || '').toLowerCase().includes('govt') || (c.authority || '').toLowerCase().includes('ministry')).length;
    }
    if (adminStatCertsSafety) {
      adminStatCertsSafety.textContent = certificates.filter(c => c.theme === 'gold' || (c.title || '').toLowerCase().includes('iso') || (c.title || '').toLowerCase().includes('fssai') || (c.title || '').toLowerCase().includes('haccp')).length;
    }
  };

  // --- 3. Tab Routing & Nav ---
  const switchTab = (tabName) => {
    // Reset all tabs
    [tabBtnProducts, tabBtnBlog, tabBtnCertificates, tabBtnInquiries].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    [panelProducts, panelBlog, panelCertificates, panelInquiries].forEach(panel => {
      if (panel) panel.classList.remove('active');
    });

    if (tabName === 'products') {
      if (tabBtnProducts) tabBtnProducts.classList.add('active');
      if (panelProducts) panelProducts.classList.add('active');
    } else if (tabName === 'blog') {
      if (tabBtnBlog) tabBtnBlog.classList.add('active');
      if (panelBlog) panelBlog.classList.add('active');
    } else if (tabName === 'certificates') {
      if (tabBtnCertificates) tabBtnCertificates.classList.add('active');
      if (panelCertificates) panelCertificates.classList.add('active');
    } else if (tabName === 'inquiries') {
      if (tabBtnInquiries) tabBtnInquiries.classList.add('active');
      if (panelInquiries) panelInquiries.classList.add('active');
    }
  };

  const handleTabRouting = () => {
    // Check parameters first, then fall back to hash
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const hash = window.location.hash;

    if (tabParam === 'blog' || hash === '#blog') {
      switchTab('blog');
    } else if (tabParam === 'certificates' || hash === '#certificates') {
      switchTab('certificates');
    } else if (tabParam === 'inquiries' || hash === '#inquiries') {
      switchTab('inquiries');
    } else {
      switchTab('products');
    }
  };

  // Tab bindings
  if (tabBtnProducts) {
    tabBtnProducts.addEventListener('click', () => switchTab('products'));
  }
  if (tabBtnBlog) {
    tabBtnBlog.addEventListener('click', () => switchTab('blog'));
  }
  if (tabBtnCertificates) {
    tabBtnCertificates.addEventListener('click', () => switchTab('certificates'));
  }
  if (tabBtnInquiries) {
    tabBtnInquiries.addEventListener('click', () => switchTab('inquiries'));
  }

  // --- 4. Inquiries Operations ---
  const renderInquiriesTable = (filteredData = null) => {
    if (!adminTableBody) return;
    
    const dataToRender = filteredData !== null ? filteredData : inquiries;
    adminTableBody.innerHTML = '';

    if (dataToRender.length === 0) {
      adminTableBody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="dash-empty-state">
              <i class="fa-regular fa-folder-open"></i>
              <p>No active inquiries logged inside local database matching search.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    dataToRender.forEach((inq, index) => {
      // Find absolute index in main array
      const absoluteIndex = inquiries.findIndex(item => item && inq && item.timestamp === inq.timestamp && item.buyerEmail === inq.buyerEmail);
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="Date / Time"><strong>${inq.timestamp}</strong></td>
        <td data-label="Company">${escapeHTML(inq.companyName)}</td>
        <td data-label="Contact Name">${escapeHTML(inq.buyerName)}</td>
        <td data-label="Contact No"><a href="tel:${inq.contactNo}" style="color:var(--primary-blue-light);font-weight:600;"><i class="fa-solid fa-phone"></i> ${escapeHTML(inq.contactNo)}</a></td>
        <td data-label="Email"><a href="mailto:${inq.buyerEmail}" style="color:var(--primary-blue-light);font-weight:600;"><i class="fa-regular fa-envelope"></i> ${escapeHTML(inq.buyerEmail)}</a></td>
        <td data-label="Location">${escapeHTML(inq.buyerAddress)}</td>
        <td data-label="Product"><span class="badge-product">${escapeHTML(inq.productSelected)}</span></td>
        <td data-label="Requirements" style="max-width:250px; font-size:0.85rem; line-height:1.4; color:var(--text-muted);">${escapeHTML(inq.buyerQuestion)}</td>
        <td data-label="Action" style="text-align: center;">
          <button class="btn-table-action delete btn-delete-inquiry" data-index="${absoluteIndex}" title="Delete Inquiry">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      `;
      adminTableBody.appendChild(row);
    });

    // Attach delete button listeners
    const deleteBtnList = adminTableBody.querySelectorAll('.btn-delete-inquiry');
    deleteBtnList.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
        const confirmDelete = confirm("Are you sure you want to delete this inquiry ticket? This cannot be undone.");
        if (confirmDelete) {
          inquiries.splice(targetIdx, 1);
          saveInquiries();
          loadDatabase(); // Re-sync and re-render
          
          // Re-apply current search query if exists
          if (inquirySearchInput && inquirySearchInput.value.trim()) {
            filterInquiries();
          }
          
          showToast("Inquiry ticket deleted", "warning");
        }
      });
    });
  };

  // Live Inquiry Searching & Filtering
  const filterInquiries = () => {
    const query = inquirySearchInput.value.trim().toLowerCase();
    if (!query) {
      renderInquiriesTable();
      return;
    }

    const filtered = inquiries.filter(inq => {
      return (
        (inq.companyName && inq.companyName.toLowerCase().includes(query)) ||
        (inq.buyerName && inq.buyerName.toLowerCase().includes(query)) ||
        (inq.buyerEmail && inq.buyerEmail.toLowerCase().includes(query)) ||
        (inq.productSelected && inq.productSelected.toLowerCase().includes(query)) ||
        (inq.buyerQuestion && inq.buyerQuestion.toLowerCase().includes(query)) ||
        (inq.buyerAddress && inq.buyerAddress.toLowerCase().includes(query))
      );
    });

    renderInquiriesTable(filtered);
  };

  if (inquirySearchInput) {
    inquirySearchInput.addEventListener('input', filterInquiries);
  }

  // Clear Database
  if (adminClearBtn) {
    adminClearBtn.addEventListener('click', () => {
      const confirmClear = confirm("Are you sure you want to clear ALL inquiries from this device? This action cannot be undone.");
      if (confirmClear) {
        inquiries = [];
        saveInquiries();
        loadDatabase();
        if (inquirySearchInput) inquirySearchInput.value = '';
        showToast("Inquiry Database Wiped", "warning");
      }
    });
  }

  // Direct Excel Exporter (.csv)
  if (adminExportBtn) {
    adminExportBtn.addEventListener('click', () => {
      if (inquiries.length === 0) {
        showToast("No data to export.", "warning");
        return;
      }

      const headers = ["Timestamp", "Company Name", "Contact Name", "Contact No", "Email Address", "Address/Port", "Product Category", "Requirements"];
      const csvRows = [];
      csvRows.push(headers.join(","));

      inquiries.forEach(inq => {
        const rowData = [
          inq.timestamp,
          inq.companyName,
          inq.buyerName,
          inq.contactNo,
          inq.buyerEmail,
          inq.buyerAddress,
          inq.productSelected,
          inq.buyerQuestion
        ];

        const escapedRowData = rowData.map(value => {
          if (value === null || value === undefined) return '""';
          let strValue = String(value);
          strValue = strValue.replace(/"/g, '""');
          if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n') || strValue.includes('\r')) {
            return `"${strValue}"`;
          }
          return `"${strValue}"`;
        });

        csvRows.push(escapedRowData.join(","));
      });

      const csvString = csvRows.join("\r\n");
      const BOM = "\uFEFF"; 
      const blob = new Blob([BOM + csvString], { type: "text/csv;charset=utf-8;" });
      
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `MY_EXPORT_WORLD_Inquiries_Database_${getFormattedDate()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("Excel spreadsheet downloaded successfully!", "success");
      }
    });
  }

  // --- 5. Blog Operations ---
  const blogImageFile = document.getElementById('blogImageFile');
  const blogThumbnailFile = document.getElementById('blogThumbnailFile');

  // Show / Hide Custom URL or File Upload boxes dynamically
  const setupImageSelectorControls = (selectEl, customInputEl, fileInputEl) => {
    if (selectEl && customInputEl && fileInputEl) {
      selectEl.addEventListener('change', () => {
        if (selectEl.value === 'custom') {
          customInputEl.style.display = 'block';
          customInputEl.setAttribute('required', 'true');
          fileInputEl.style.display = 'none';
          fileInputEl.removeAttribute('required');
          fileInputEl.value = '';
        } else if (selectEl.value === 'upload') {
          fileInputEl.style.display = 'block';
          fileInputEl.setAttribute('required', 'true');
          customInputEl.style.display = 'none';
          customInputEl.removeAttribute('required');
          customInputEl.value = '';
        } else {
          customInputEl.style.display = 'none';
          customInputEl.removeAttribute('required');
          customInputEl.value = '';
          fileInputEl.style.display = 'none';
          fileInputEl.removeAttribute('required');
          fileInputEl.value = '';
        }
      });
    }
  };

  setupImageSelectorControls(blogImageSelect, blogImageCustom, blogImageFile);
  setupImageSelectorControls(blogThumbnailSelect, blogThumbnailCustom, blogThumbnailFile);

  // Render Admin Active Blogs List Table
  const renderBlogsTable = () => {
    if (!adminBlogTableBody) return;
    adminBlogTableBody.innerHTML = '';

    if (blogPosts.length === 0) {
      adminBlogTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-feather-pointed" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: #ddd;"></i>
            No articles published. Live blog section is empty.
          </td>
        </tr>
      `;
      return;
    }

    blogPosts.forEach((post, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="Title"><strong>${escapeHTML(post.title)}</strong></td>
        <td data-label="Category"><span class="badge-product" style="background-color:rgba(212, 26, 43, 0.05); color:var(--accent-red); border-color:rgba(212, 26, 43, 0.1);">${escapeHTML(post.category)}</span></td>
        <td data-label="Read Time">${escapeHTML(post.readTime)}</td>
        <td data-label="Published">${escapeHTML(post.dateFormatted || 'Recent')}</td>
        <td data-label="Actions" style="text-align: center; white-space: nowrap;">
          <button class="btn-table-action edit btn-edit-blog" data-index="${index}" title="Edit Article">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn-table-action delete btn-delete-blog" data-index="${index}" title="Remove Article">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      `;
      adminBlogTableBody.appendChild(row);
    });

    // Edit Blog buttons binding
    adminBlogTableBody.querySelectorAll('.btn-edit-blog').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
        openEditBlogModal(targetIdx);
      });
    });

    // Delete Blog buttons binding
    const deleteBlogBtnList = adminBlogTableBody.querySelectorAll('.btn-delete-blog');
    deleteBlogBtnList.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
        const targetPost = blogPosts[targetIdx];
        if (!targetPost) return;
        const confirmDelete = confirm(`Are you sure you want to delete "${targetPost.title}"? This action will remove it permanently.`);
        if (confirmDelete) {
          if (targetPost.id) {
            const deleted = JSON.parse(localStorage.getItem('myexportworld_deleted_blogs') || '[]');
            if (!deleted.includes(targetPost.id)) {
              deleted.push(targetPost.id);
              localStorage.setItem('myexportworld_deleted_blogs', JSON.stringify(deleted));
            }
            if (db) {
              db.collection('blog_posts').doc(targetPost.id).delete().catch(() => {});
            }
          }
          blogPosts.splice(targetIdx, 1);
          saveBlogPosts();
          renderBlogsTable();
          showToast("Article permanently removed!", "warning");
        }
      });
    });
  };

  // Blog Edit Modal controls
  const modalEditBlog = document.getElementById('modalEditBlog');
  const formEditBlog = document.getElementById('formEditBlog');
  const closeModalEditBlog = document.getElementById('closeModalEditBlog');
  const cancelModalEditBlog = document.getElementById('cancelModalEditBlog');

  const openEditBlogModal = (index) => {
    const post = blogPosts[index];
    if (!post) return;
    document.getElementById('editBlogIndex').value = index;
    document.getElementById('editBlogTitle').value = post.title || '';
    document.getElementById('editBlogCategory').value = post.category || '';
    document.getElementById('editBlogReadTime').value = post.readTime || '4 min read';
    const imgVal = post.coverImage || post.image || '';
    document.getElementById('editBlogImage').value = imgVal;
    const editBlogImageFile = document.getElementById('editBlogImageFile');
    if (editBlogImageFile) editBlogImageFile.value = '';
    const blogPrev = document.getElementById('editBlogImagePreview');
    const blogPrevImg = document.getElementById('editBlogImagePreviewImg');
    if (blogPrev && blogPrevImg) {
      if (imgVal) {
        blogPrevImg.src = imgVal;
        blogPrev.style.display = 'block';
      } else {
        blogPrev.style.display = 'none';
      }
    }
    document.getElementById('editBlogExcerpt').value = post.excerpt || '';
    document.getElementById('editBlogContent').value = post.content || '';
    if (modalEditBlog) modalEditBlog.classList.add('active');
  };

  const closeBlogModal = () => {
    if (modalEditBlog) modalEditBlog.classList.remove('active');
  };
  if (closeModalEditBlog) closeModalEditBlog.addEventListener('click', closeBlogModal);
  if (cancelModalEditBlog) cancelModalEditBlog.addEventListener('click', closeBlogModal);

  if (formEditBlog) {
    formEditBlog.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('editBlogIndex').value, 10);
      if (blogPosts[idx]) {
        blogPosts[idx].title = document.getElementById('editBlogTitle').value.trim();
        blogPosts[idx].category = document.getElementById('editBlogCategory').value.trim();
        blogPosts[idx].readTime = document.getElementById('editBlogReadTime').value.trim();
        const imgVal = document.getElementById('editBlogImage').value.trim();
        blogPosts[idx].coverImage = imgVal;
        blogPosts[idx].thumbnail = imgVal;
        blogPosts[idx].excerpt = document.getElementById('editBlogExcerpt').value.trim();
        blogPosts[idx].content = document.getElementById('editBlogContent').value.trim();

        if (db && blogPosts[idx].id) {
          db.collection('blog_posts').doc(blogPosts[idx].id).set(blogPosts[idx], { merge: true });
        }
        saveBlogPosts();
        renderBlogsTable();
        closeBlogModal();
        showToast("Article updated successfully!", "success");
      }
    });
  }

  // Compress image client-side to keep localStorage size minimal
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG format to significantly reduce byte size
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Helper for Upload from Device in Edit Modals
  const setupEditImageUpload = (fileInputId, textInputId, previewContainerId, previewImgId) => {
    const fileInput = document.getElementById(fileInputId);
    const textInput = document.getElementById(textInputId);
    const previewContainer = document.getElementById(previewContainerId);
    const previewImg = document.getElementById(previewImgId);

    if (fileInput) {
      fileInput.addEventListener('change', async () => {
        if (fileInput.files && fileInput.files.length > 0) {
          showToast("Processing image from device...", "info");
          try {
            const base64 = await compressImage(fileInput.files[0]);
            if (textInput) textInput.value = base64;
            if (previewContainer && previewImg) {
              previewImg.src = base64;
              previewContainer.style.display = 'block';
            }
            showToast("Device image ready!", "success");
          } catch (err) {
            console.error(err);
            showToast("Failed to process device image.", "warning");
          }
        }
      });
    }

    if (textInput && previewContainer && previewImg) {
      textInput.addEventListener('input', () => {
        const val = textInput.value.trim();
        if (val) {
          previewImg.src = val;
          previewContainer.style.display = 'block';
        } else {
          previewContainer.style.display = 'none';
        }
      });
    }
  };

  // Initialize Edit Modal image upload handlers
  setupEditImageUpload('editProdImageFile', 'editProdImage', 'editProdImagePreview', 'editProdImagePreviewImg');
  setupEditImageUpload('editBlogImageFile', 'editBlogImage', 'editBlogImagePreview', 'editBlogImagePreviewImg');
  setupEditImageUpload('editCertImageFile', 'editCertImage', 'editCertImagePreview', 'editCertImagePreviewImg');

  // Blog submission handler
  if (adminBlogForm) {
    adminBlogForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('blogTitle').value.trim();
      let category = document.getElementById('blogCategory').value;
      if (category === 'custom' && blogCategoryCustom) {
        category = blogCategoryCustom.value.trim();
      }
      const readTime = document.getElementById('blogReadTime').value.trim();
      
      let coverImage = blogImageSelect ? blogImageSelect.value : '';
      let thumbnailImage = blogThumbnailSelect ? blogThumbnailSelect.value : '';

      try {
        // Resolve Cover Image
        if (coverImage === 'custom' && blogImageCustom) {
          coverImage = blogImageCustom.value.trim();
        } else if (coverImage === 'upload' && blogImageFile && blogImageFile.files.length > 0) {
          showToast("Processing cover image...", "info");
          coverImage = await compressImage(blogImageFile.files[0]);
        }

        // Resolve Thumbnail Image
        if (thumbnailImage === 'custom' && blogThumbnailCustom) {
          thumbnailImage = blogThumbnailCustom.value.trim();
        } else if (thumbnailImage === 'upload' && blogThumbnailFile && blogThumbnailFile.files.length > 0) {
          showToast("Processing thumbnail image...", "info");
          thumbnailImage = await compressImage(blogThumbnailFile.files[0]);
        } else if (!thumbnailImage) {
          thumbnailImage = coverImage;
        }

        const teaserSummary = document.getElementById('blogSummary').value.trim();
        const rawBody = document.getElementById('blogBody').value.trim();

        if (!title || !category || !readTime || !coverImage || !thumbnailImage || !teaserSummary || !rawBody) {
          showToast("Please fill all mandatory article fields.", "warning");
          return;
        }

        // Format Body Content to HTML
        const formatBodyToHTML = (text) => {
          if (text.includes('<p>') || text.includes('<h3>') || text.includes('<ul>')) {
            return text; 
          }
          return text
            .split(/\n\s*\n/)
            .map(para => `<p>${escapeHTML(para.trim()).replace(/\n/g, '<br>')}</p>`)
            .join('');
        };

        const dateFormatted = getFormattedArticleDate();
        
        const newPost = {
          id: "post_" + Date.now(),
          timestamp: new Date().toISOString(),
          dateFormatted,
          title,
          category,
          coverImage,
          thumbnailImage,
          readTime,
          teaserSummary,
          bodyContent: formatBodyToHTML(rawBody)
        };

        if (db) {
          db.collection('blog_posts').doc(newPost.id).set(newPost);
        }

        // Add to beginning of database
        blogPosts.unshift(newPost);
        saveBlogPosts();
        
        // Reset fields
        adminBlogForm.reset();
        if (blogImageCustom) blogImageCustom.style.display = 'none';
        if (blogThumbnailCustom) blogThumbnailCustom.style.display = 'none';
        if (blogCategoryCustom) blogCategoryCustom.style.display = 'none';
        if (blogImageFile) blogImageFile.style.display = 'none';
        if (blogThumbnailFile) blogThumbnailFile.style.display = 'none';
        
        // Re-load and switch focus to active blog management list
        loadDatabase();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        showToast("Daily Sourcing Insight Published Live!", "success");

      } catch (err) {
        console.error(err);
        showToast("Error processing images. Please try another file.", "warning");
      }
    });
  }

  // --- 5A-2. Official Data Auto-Blog Engine Admin Integration ---
  const autoBlogToggleCheck = document.getElementById('autoBlogToggleCheck');
  const btnTriggerAutoBlog = document.getElementById('btnTriggerAutoBlog');
  const btnTriggerLiveGovBlog = document.getElementById('btnTriggerLiveGovBlog');

  if (autoBlogToggleCheck && typeof AutoBlogEngine !== 'undefined') {
    autoBlogToggleCheck.checked = AutoBlogEngine.isAutoPublishEnabled();
    autoBlogToggleCheck.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      AutoBlogEngine.setAutoPublishEnabled(enabled);
      showToast(enabled ? "Daily Auto-Publishing Enabled" : "Daily Auto-Publishing Paused", enabled ? "success" : "info");
    });
  }

  const triggerGovAIBlog = async (triggerBtn) => {
    const origContent = triggerBtn ? triggerBtn.innerHTML : '';
    if (triggerBtn) {
      triggerBtn.disabled = true;
      triggerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Contacting Govt Mandis & AI...';
    }
    showToast("Generating official trade report with Gemini AI & Govt datasets...", "info");

    try {
      let newPost = null;
      if (typeof AutoBlogEngine !== 'undefined' && typeof AutoBlogEngine.generateOfficialPostWithAI === 'function') {
        newPost = await AutoBlogEngine.generateOfficialPostWithAI(new Date());
      } else if (typeof AutoBlogEngine !== 'undefined') {
        newPost = AutoBlogEngine.generateOfficialPost(new Date());
      }

      if (newPost) {
        if (db) {
          try {
            await db.collection('blog_posts').doc(newPost.id).set(newPost);
          } catch (err) {
            console.error("Firestore Auto Blog error:", err);
          }
        }

        // Check if already in list, if not add
        const existsIndex = blogPosts.findIndex(p => p && (p.id === newPost.id || p.isoDate === newPost.isoDate));
        if (existsIndex >= 0) {
          blogPosts[existsIndex] = newPost;
        } else {
          blogPosts.unshift(newPost);
        }

        saveBlogPosts();
        loadDatabase();
        showToast(`Published: "${newPost.title}"!`, "success");
      } else {
        showToast("Could not generate trade report. Please try again.", "warning");
      }
    } catch (err) {
      console.error("Auto blog generation error:", err);
      showToast("Generation error. Check network connection.", "warning");
    } finally {
      if (triggerBtn) {
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = origContent;
      }
    }
  };

  if (btnTriggerAutoBlog) {
    btnTriggerAutoBlog.addEventListener('click', () => triggerGovAIBlog(btnTriggerAutoBlog));
  }

  if (btnTriggerLiveGovBlog) {
    btnTriggerLiveGovBlog.addEventListener('click', () => triggerGovAIBlog(btnTriggerLiveGovBlog));
  }

  // --- 5B. Product Catalog Operations & Cascading Hierarchy ---
  setupImageSelectorControls(prodImageSelect, prodImageCustom, prodImageFile);

  const blogCategorySelect = document.getElementById('blogCategory');
  const blogCategoryCustom = document.getElementById('blogCategoryCustom');

  const setupCustomCategoryControls = (selectEl, customInputEl) => {
    if (selectEl && customInputEl) {
      selectEl.addEventListener('change', () => {
        if (selectEl.value === 'custom') {
          customInputEl.style.display = 'block';
          customInputEl.setAttribute('required', 'true');
        } else {
          customInputEl.style.display = 'none';
          customInputEl.removeAttribute('required');
          customInputEl.value = '';
        }
      });
    }
  };

  setupCustomCategoryControls(blogCategorySelect, blogCategoryCustom);

  // Commodity -> Category Hierarchy Definition
  const COMMODITY_CONFIG = {
    spices: {
      name: "Spices, Seasonings & Herbs",
      categories: [
        { id: "turmeric", name: "Turmeric (Haldi)" },
        { id: "chilli", name: "Red Chilli & Powder" },
        { id: "cumin", name: "Cumin Seeds & Powder (Jeera)" },
        { id: "psyllium", name: "Psyllium Husk (Isabgol)" },
        { id: "cardamom", name: "Cardamom & Powder (Elaichi)" },
        { id: "black_pepper", name: "Black Pepper & Powder (Mari)" },
        { id: "ajwain", name: "Ajwain (Carom Seeds)" },
        { id: "curry_leaves", name: "Curry Leaves & Powder" },
        { id: "clove", name: "Cloves & Powder (Laung)" },
        { id: "mustard", name: "Mustard Seeds (Rai)" },
        { id: "fennel", name: "Fennel Seeds & Powder (Saunf)" },
        { id: "coriander", name: "Coriander Seeds & Powder (Dhana)" },
        { id: "cinnamon", name: "Cinnamon & Powder (Dalchini)" }
      ]
    },
    vegetables: {
      name: "Fresh Vegetables",
      categories: [
        { id: "onion", name: "Fresh Red Onions" },
        { id: "white_onion", name: "Fresh White Onions" },
        { id: "garlic", name: "Fresh Garlic" },
        { id: "ginger", name: "Fresh Ginger" },
        { id: "potato", name: "Potatoes" }
      ]
    }
  };

  const getCommodityName = (commodityKey) => {
    if (!commodityKey) return "Spices, Seasonings & Herbs";
    if (COMMODITY_CONFIG[commodityKey]) return COMMODITY_CONFIG[commodityKey].name;
    return commodityKey.charAt(0).toUpperCase() + commodityKey.slice(1);
  };

  const getCategoryName = (categoryKey, commodityKey) => {
    if (!categoryKey) return "General";
    for (const commKey in COMMODITY_CONFIG) {
      const found = COMMODITY_CONFIG[commKey].categories.find(c => c.id === categoryKey);
      if (found) return found.name;
    }
    if (categoryKey === 'vegetables') return 'Fresh Vegetables';
    return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
  };

  const populateCategoryOptions = (commodityKey, selectEl, selectedValue = '') => {
    if (!selectEl) return;
    selectEl.innerHTML = '<option value="" disabled selected>-- Select Category / Group --</option>';

    if (commodityKey && COMMODITY_CONFIG[commodityKey]) {
      COMMODITY_CONFIG[commodityKey].categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        if (cat.id === selectedValue) opt.selected = true;
        selectEl.appendChild(opt);
      });

      // Also append any custom categories created under this commodity from products array
      const existingCats = new Set(COMMODITY_CONFIG[commodityKey].categories.map(c => c.id));
      products.forEach(p => {
        const pComm = p.commodity || (p.category === 'vegetables' || p.category === 'onion' ? 'vegetables' : 'spices');
        if (pComm === commodityKey && p.category && !existingCats.has(p.category)) {
          existingCats.add(p.category);
          const opt = document.createElement('option');
          opt.value = p.category;
          opt.textContent = p.categoryName || (p.category.charAt(0).toUpperCase() + p.category.slice(1));
          if (p.category === selectedValue) opt.selected = true;
          selectEl.appendChild(opt);
        }
      });
    }

    // Add option to create a new category in this commodity
    const customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = '+ Add New Category...';
    if (selectedValue === 'custom' || (selectedValue && !selectEl.value)) {
      customOpt.selected = true;
    }
    selectEl.appendChild(customOpt);
  };

  // Setup cascading for Add Product form
  if (prodCommoditySelect && prodCategorySelect) {
    prodCommoditySelect.addEventListener('change', () => {
      const val = prodCommoditySelect.value;
      if (val === 'custom') {
        if (prodCommodityCustom) {
          prodCommodityCustom.style.display = 'block';
          prodCommodityCustom.setAttribute('required', 'true');
        }
        populateCategoryOptions(null, prodCategorySelect);
        prodCategorySelect.value = 'custom';
        if (prodCategoryCustom) {
          prodCategoryCustom.style.display = 'block';
          prodCategoryCustom.setAttribute('required', 'true');
        }
      } else {
        if (prodCommodityCustom) {
          prodCommodityCustom.style.display = 'none';
          prodCommodityCustom.removeAttribute('required');
          prodCommodityCustom.value = '';
        }
        populateCategoryOptions(val, prodCategorySelect);
        if (prodCategoryCustom) {
          prodCategoryCustom.style.display = 'none';
          prodCategoryCustom.removeAttribute('required');
          prodCategoryCustom.value = '';
        }
      }
    });

    prodCategorySelect.addEventListener('change', () => {
      if (prodCategorySelect.value === 'custom') {
        if (prodCategoryCustom) {
          prodCategoryCustom.style.display = 'block';
          prodCategoryCustom.setAttribute('required', 'true');
          prodCategoryCustom.focus();
        }
      } else {
        if (prodCategoryCustom) {
          prodCategoryCustom.style.display = 'none';
          prodCategoryCustom.removeAttribute('required');
          prodCategoryCustom.value = '';
        }
        // Auto-suggest icon based on selected category
        const suggested = getSuggestedIcon(prodCategorySelect.value);
        if (prodIcon && prodIcon.value !== 'custom') {
          prodIcon.value = suggested;
          if (prodIconPreviewI) prodIconPreviewI.className = suggested;
        }
      }
    });
  }

  // Helper: Suggested icon based on category
  const getSuggestedIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('chilli') || cat.includes('pepper_hot')) return 'fa-solid fa-pepper-hot';
    if (cat.includes('onion') || cat.includes('vegetable')) return 'fa-solid fa-carrot';
    if (cat.includes('cumin') || cat.includes('fennel') || cat.includes('coriander') || cat.includes('mustard') || cat.includes('ajwain')) return 'fa-solid fa-seedling';
    if (cat.includes('psyllium')) return 'fa-solid fa-spa';
    if (cat.includes('grain') || cat.includes('wheat')) return 'fa-solid fa-wheat-awn';
    return 'fa-solid fa-leaf';
  };

  // Setup Logo Icon Controls (img 2)
  const prodIcon = document.getElementById('prodIcon');
  const prodIconCustom = document.getElementById('prodIconCustom');
  const prodIconPreviewI = document.getElementById('prodIconPreviewI');
  if (prodIcon) {
    prodIcon.addEventListener('change', () => {
      if (prodIcon.value === 'custom') {
        if (prodIconCustom) {
          prodIconCustom.style.display = 'block';
          prodIconCustom.focus();
        }
      } else {
        if (prodIconCustom) prodIconCustom.style.display = 'none';
        if (prodIconPreviewI) prodIconPreviewI.className = prodIcon.value;
      }
    });
  }
  if (prodIconCustom) {
    prodIconCustom.addEventListener('input', () => {
      const val = prodIconCustom.value.trim();
      if (val && prodIconPreviewI) prodIconPreviewI.className = val;
    });
  }

  const editProdIcon = document.getElementById('editProdIcon');
  const editProdIconCustom = document.getElementById('editProdIconCustom');
  const editProdIconPreviewI = document.getElementById('editProdIconPreviewI');
  if (editProdIcon) {
    editProdIcon.addEventListener('change', () => {
      if (editProdIcon.value === 'custom') {
        if (editProdIconCustom) {
          editProdIconCustom.style.display = 'block';
          editProdIconCustom.focus();
        }
      } else {
        if (editProdIconCustom) editProdIconCustom.style.display = 'none';
        if (editProdIconPreviewI) editProdIconPreviewI.className = editProdIcon.value;
      }
    });
  }
  if (editProdIconCustom) {
    editProdIconCustom.addEventListener('input', () => {
      const val = editProdIconCustom.value.trim();
      if (val && editProdIconPreviewI) editProdIconPreviewI.className = val;
    });
  }

  // Setup Auto-Badge Generator from First Word of Product Name (img 1)
  const setupAutoBadge = (titleEl, badgeEl) => {
    if (!titleEl || !badgeEl) return;
    titleEl.addEventListener('input', () => {
      const val = titleEl.value.trim();
      if (!val) return;
      const words = val.split(/\s+/);
      if (words.length > 0 && words[0]) {
        const firstWord = words[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (firstWord) {
          const autoBadge = `${firstWord} EXPORTER FROM INDIA`;
          if (!badgeEl.value || badgeEl.value.endsWith('EXPORTER FROM INDIA')) {
            badgeEl.value = autoBadge;
          }
        }
      }
    });
  };

  setupAutoBadge(document.getElementById('prodTitle'), document.getElementById('prodBadge'));
  setupAutoBadge(document.getElementById('editProdTitle'), document.getElementById('editProdBadge'));

  // Setup cascading for Edit Product modal
  const editProdCommodity = document.getElementById('editProdCommodity');
  const editProdCommodityCustom = document.getElementById('editProdCommodityCustom');
  const editProdCategory = document.getElementById('editProdCategory');
  const editProdCategoryCustom = document.getElementById('editProdCategoryCustom');

  if (editProdCommodity && editProdCategory) {
    editProdCommodity.addEventListener('change', () => {
      const val = editProdCommodity.value;
      if (val === 'custom') {
        if (editProdCommodityCustom) {
          editProdCommodityCustom.style.display = 'block';
          editProdCommodityCustom.setAttribute('required', 'true');
        }
        populateCategoryOptions(null, editProdCategory);
        editProdCategory.value = 'custom';
        if (editProdCategoryCustom) {
          editProdCategoryCustom.style.display = 'block';
          editProdCategoryCustom.setAttribute('required', 'true');
        }
      } else {
        if (editProdCommodityCustom) {
          editProdCommodityCustom.style.display = 'none';
          editProdCommodityCustom.removeAttribute('required');
          editProdCommodityCustom.value = '';
        }
        populateCategoryOptions(val, editProdCategory);
        if (editProdCategoryCustom) {
          editProdCategoryCustom.style.display = 'none';
          editProdCategoryCustom.removeAttribute('required');
          editProdCategoryCustom.value = '';
        }
      }
    });

    editProdCategory.addEventListener('change', () => {
      if (editProdCategory.value === 'custom') {
        if (editProdCategoryCustom) {
          editProdCategoryCustom.style.display = 'block';
          editProdCategoryCustom.setAttribute('required', 'true');
          editProdCategoryCustom.focus();
        }
      } else {
        if (editProdCategoryCustom) {
          editProdCategoryCustom.style.display = 'none';
          editProdCategoryCustom.removeAttribute('required');
          editProdCategoryCustom.value = '';
        }
      }
    });
  }

  // Render Product Catalog Table in Admin Dashboard
  const renderProductsTable = () => {
    if (!adminProductTableBody) return;
    adminProductTableBody.innerHTML = '';

    if (products.length === 0) {
      adminProductTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-wheat-awn" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: #ddd;"></i>
            No products published in the live catalog.
          </td>
        </tr>
      `;
      return;
    }

    products.forEach((prod, index) => {
      const commKey = prod.commodity || (prod.category === 'vegetables' || prod.category === 'onion' ? 'vegetables' : 'spices');
      const commName = prod.commodityName || getCommodityName(commKey);
      const catName = prod.categoryName || getCategoryName(prod.category, commKey);

      let commBadgeStyle = 'background-color:rgba(11, 60, 155, 0.06); color:var(--primary-blue); border:1px solid rgba(11, 60, 155, 0.15);';
      if (commKey === 'vegetables') {
        commBadgeStyle = 'background-color:rgba(22, 163, 74, 0.08); color:#16a34a; border:1px solid rgba(22, 163, 74, 0.2);';
      }

      let catBadgeStyle = 'background-color:rgba(214, 28, 44, 0.05); color:var(--accent-red); border:1px solid rgba(214, 28, 44, 0.15);';
      if (prod.category === 'turmeric' || prod.category === 'cumin' || prod.category === 'coriander') {
        catBadgeStyle = 'background-color:rgba(245, 158, 11, 0.08); color:#b45309; border:1px solid rgba(245, 158, 11, 0.2);';
      } else if (prod.category === 'psyllium' || prod.category === 'fennel' || prod.category === 'onion') {
        catBadgeStyle = 'background-color:rgba(16, 185, 129, 0.08); color:#059669; border:1px solid rgba(16, 185, 129, 0.2);';
      }

      const row = document.createElement('tr');
      const prodIconClass = prod.icon || getSuggestedIcon(prod.category);
      row.innerHTML = `
        <td data-label="Image"><img src="${escapeHTML(prod.image)}" alt="${escapeHTML(prod.title)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-light);" onerror="this.src='images/logo.png';"></td>
        <td data-label="Product Variety / Name">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="width: 28px; height: 28px; border-radius: 6px; background: rgba(22, 163, 74, 0.1); color: #16a34a; display: inline-flex; align-items: center; justify-content: center; font-size: 0.85rem; border: 1px solid rgba(22, 163, 74, 0.2); flex-shrink: 0;" title="Category Logo / Icon">
              <i class="${escapeHTML(prodIconClass)}"></i>
            </span>
            <strong>${escapeHTML(prod.title)}</strong>
          </div>
        </td>
        <td data-label="Commodity Division"><span class="badge-product" style="${commBadgeStyle}">${escapeHTML(commName)}</span></td>
        <td data-label="Category / Group"><span class="badge-product" style="${catBadgeStyle}">${escapeHTML(catName)}</span></td>
        <td data-label="HS Code"><code>${escapeHTML(prod.hsCode)}</code></td>
        <td data-label="Grade Badge"><span style="font-size: 0.75rem; font-weight:700; color:#b45309; background:#fffbeb; border:1px solid #fde68a; padding:3px 8px; border-radius:9999px; text-transform:uppercase;">${escapeHTML(prod.badge || '-')}</span></td>
        <td data-label="Actions" style="text-align: center; white-space: nowrap;">
          <button class="btn-table-action edit btn-edit-product" data-index="${index}" title="Edit Product">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn-table-action delete btn-delete-product" data-index="${index}" title="Remove Product">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      `;
      adminProductTableBody.appendChild(row);
    });

    // Edit Product event handlers
    adminProductTableBody.querySelectorAll('.btn-edit-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
        openEditProductModal(targetIdx);
      });
    });

    // Delete Product event handlers
    const deleteProductBtnList = adminProductTableBody.querySelectorAll('.btn-delete-product');
    deleteProductBtnList.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
        const targetProd = products[targetIdx];
        if (!targetProd) return;
        const confirmDelete = confirm(`Are you sure you want to delete "${targetProd.title}"? This action will remove it permanently.`);
        if (confirmDelete) {
          if (targetProd.id) {
            const deleted = JSON.parse(localStorage.getItem('myexportworld_deleted_products') || '[]');
            if (!deleted.includes(targetProd.id)) {
              deleted.push(targetProd.id);
              localStorage.setItem('myexportworld_deleted_products', JSON.stringify(deleted));
            }
            if (db) {
              db.collection('products').doc(targetProd.id).delete().catch(() => {});
            }
          }
          products.splice(targetIdx, 1);
          saveProducts();
          renderProductsTable();
          showToast("Product deleted permanently", "warning");
        }
      });
    });
  };

  // Product Edit Modal controls
  const modalEditProduct = document.getElementById('modalEditProduct');
  const formEditProduct = document.getElementById('formEditProduct');
  const closeModalEditProduct = document.getElementById('closeModalEditProduct');
  const cancelModalEditProduct = document.getElementById('cancelModalEditProduct');

  const openEditProductModal = (index) => {
    const prod = products[index];
    if (!prod) return;
    document.getElementById('editProdIndex').value = index;
    document.getElementById('editProdTitle').value = prod.title || '';
    document.getElementById('editProdHsCode').value = prod.hsCode || '';
    document.getElementById('editProdBadge').value = prod.badge || '';
    document.getElementById('editProdImage').value = prod.image || '';
    const editProdImageFile = document.getElementById('editProdImageFile');
    if (editProdImageFile) editProdImageFile.value = '';
    const prodPrev = document.getElementById('editProdImagePreview');
    const prodPrevImg = document.getElementById('editProdImagePreviewImg');
    if (prodPrev && prodPrevImg) {
      if (prod.image) {
        prodPrevImg.src = prod.image;
        prodPrev.style.display = 'block';
      } else {
        prodPrev.style.display = 'none';
      }
    }
    document.getElementById('editProdDesc').value = prod.description || '';

    // Icon setup
    if (editProdIcon) {
      const currentIcon = prod.icon || getSuggestedIcon(prod.category);
      const hasOption = Array.from(editProdIcon.options).some(opt => opt.value === currentIcon);
      if (hasOption) {
        editProdIcon.value = currentIcon;
        if (editProdIconCustom) editProdIconCustom.style.display = 'none';
      } else {
        editProdIcon.value = 'custom';
        if (editProdIconCustom) {
          editProdIconCustom.style.display = 'block';
          editProdIconCustom.value = currentIcon;
        }
      }
      if (editProdIconPreviewI) editProdIconPreviewI.className = currentIcon;
    }

    // Commodity & Category setup
    const commKey = prod.commodity || (prod.category === 'vegetables' || prod.category === 'onion' ? 'vegetables' : 'spices');
    if (editProdCommodity) {
      if (COMMODITY_CONFIG[commKey]) {
        editProdCommodity.value = commKey;
        if (editProdCommodityCustom) {
          editProdCommodityCustom.style.display = 'none';
          editProdCommodityCustom.value = '';
        }
      } else {
        editProdCommodity.value = 'custom';
        if (editProdCommodityCustom) {
          editProdCommodityCustom.style.display = 'block';
          editProdCommodityCustom.value = prod.commodityName || commKey;
        }
      }
      populateCategoryOptions(commKey, editProdCategory, prod.category);
    }

    if (modalEditProduct) modalEditProduct.classList.add('active');
  };

  const closeProductModal = () => {
    if (modalEditProduct) modalEditProduct.classList.remove('active');
  };
  if (closeModalEditProduct) closeModalEditProduct.addEventListener('click', closeProductModal);
  if (cancelModalEditProduct) cancelModalEditProduct.addEventListener('click', closeProductModal);

  if (formEditProduct) {
    formEditProduct.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('editProdIndex').value, 10);
      if (products[idx]) {
        let commodity = editProdCommodity ? editProdCommodity.value : 'spices';
        let commodityName = getCommodityName(commodity);
        if (commodity === 'custom' && editProdCommodityCustom) {
          commodityName = editProdCommodityCustom.value.trim();
          commodity = commodityName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        }

        let category = editProdCategory ? editProdCategory.value : '';
        let categoryName = getCategoryName(category, commodity);
        if (category === 'custom' && editProdCategoryCustom) {
          categoryName = editProdCategoryCustom.value.trim();
          category = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        }

        products[idx].commodity = commodity;
        products[idx].commodityName = commodityName;
        products[idx].category = category;
        products[idx].categoryName = categoryName;
        products[idx].title = document.getElementById('editProdTitle').value.trim();
        products[idx].hsCode = document.getElementById('editProdHsCode').value.trim();
        products[idx].badge = document.getElementById('editProdBadge').value.trim();

        let icon = 'fa-solid fa-leaf';
        if (editProdIcon) {
          if (editProdIcon.value === 'custom' && editProdIconCustom && editProdIconCustom.value.trim()) {
            icon = editProdIconCustom.value.trim();
          } else if (editProdIcon.value !== 'custom') {
            icon = editProdIcon.value;
          }
        }
        products[idx].icon = icon;

        products[idx].image = document.getElementById('editProdImage').value.trim();
        products[idx].description = document.getElementById('editProdDesc').value.trim();

        if (db && products[idx].id) {
          db.collection('products').doc(products[idx].id).set(products[idx], { merge: true }).catch(() => {});
        }
        saveProducts();
        renderProductsTable();
        closeProductModal();
        showToast("Product updated successfully!", "success");
      }
    });
  }

  // Product form submission handler
  if (adminProductForm) {
    adminProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let commodity = prodCommoditySelect ? prodCommoditySelect.value : 'spices';
      let commodityName = getCommodityName(commodity);
      if (commodity === 'custom' && prodCommodityCustom) {
        commodityName = prodCommodityCustom.value.trim();
        commodity = commodityName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      }

      let category = prodCategorySelect ? prodCategorySelect.value : '';
      let categoryName = getCategoryName(category, commodity);
      if (category === 'custom' && prodCategoryCustom) {
        categoryName = prodCategoryCustom.value.trim();
        category = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      }

      const title = document.getElementById('prodTitle').value.trim();
      const hsCode = document.getElementById('prodHsCode').value.trim();
      const badge = document.getElementById('prodBadge').value.trim();
      const description = document.getElementById('prodDescription').value.trim();

      let image = prodImageSelect ? prodImageSelect.value : '';

      try {
        if (image === 'custom' && prodImageCustom) {
          image = prodImageCustom.value.trim();
        } else if (image === 'upload' && prodImageFile && prodImageFile.files.length > 0) {
          showToast("Processing product image...", "info");
          image = await compressImage(prodImageFile.files[0]);
        }

        if (!commodity || !category || !title || !hsCode || !image || !description) {
          showToast("Please fill all mandatory fields (Commodity, Category, Product Name, HS Code, Image, Description).", "warning");
          return;
        }

        // Collect up to 5 specifications
        const specs = [];
        for (let i = 1; i <= 5; i++) {
          const specNameEl = document.getElementById(`prodSpecName${i}`);
          const specValEl = document.getElementById(`prodSpecVal${i}`);
          if (specNameEl && specValEl) {
            const specName = specNameEl.value.trim();
            const specVal = specValEl.value.trim();
            if (specName && specVal) {
              specs.push({ name: specName, value: specVal });
            }
          }
        }

        let icon = 'fa-solid fa-leaf';
        if (prodIcon) {
          if (prodIcon.value === 'custom' && prodIconCustom && prodIconCustom.value.trim()) {
            icon = prodIconCustom.value.trim();
          } else if (prodIcon.value !== 'custom') {
            icon = prodIcon.value;
          }
        }

        const newProduct = {
          id: "prod_" + Date.now(),
          commodity,
          commodityName,
          category,
          categoryName,
          title,
          hsCode,
          badge,
          icon,
          image,
          description,
          specs
        };

        if (db) {
          db.collection('products').doc(newProduct.id).set(newProduct).catch(() => {});
        }

        // Add to active products array
        products.push(newProduct);
        saveProducts();

        // Reset form inputs
        adminProductForm.reset();
        if (prodCommodityCustom) prodCommodityCustom.style.display = 'none';
        if (prodCategoryCustom) prodCategoryCustom.style.display = 'none';
        if (prodImageCustom) prodImageCustom.style.display = 'none';
        if (prodImageFile) prodImageFile.style.display = 'none';
        if (prodIcon) prodIcon.value = 'fa-solid fa-leaf';
        if (prodIconCustom) {
          prodIconCustom.style.display = 'none';
          prodIconCustom.value = '';
        }
        if (prodIconPreviewI) prodIconPreviewI.className = 'fa-solid fa-leaf';
        if (prodCategorySelect) {
          prodCategorySelect.innerHTML = '<option value="" disabled selected>-- First Select Commodity Above --</option>';
        }

        renderProductsTable();
        showToast(`Added: ${newProduct.title} under ${newProduct.categoryName} (${newProduct.commodityName})!`, "success");

      } catch (err) {
        console.error(err);
        showToast("Error adding product. Please try again.", "warning");
      }
    });
  }

  // --- 5C. Certificate Operations ---
  const certImageSelect = document.getElementById('certImage');
  const certImageCustom = document.getElementById('certImageCustom');
  const certImageFile = document.getElementById('certImageFile');

  if (certImageSelect) {
    certImageSelect.addEventListener('change', () => {
      const val = certImageSelect.value;
      if (val === 'custom') {
        if (certImageCustom) {
          certImageCustom.style.display = 'block';
          certImageCustom.focus();
        }
        if (certImageFile) certImageFile.style.display = 'none';
      } else if (val === 'upload') {
        if (certImageFile) certImageFile.style.display = 'block';
        if (certImageCustom) certImageCustom.style.display = 'none';
      } else {
        if (certImageCustom) certImageCustom.style.display = 'none';
        if (certImageFile) certImageFile.style.display = 'none';
      }
    });
  }

  const renderCertificatesTable = () => {
    if (!adminCertTableBody) return;
    adminCertTableBody.innerHTML = '';

    if (certificates.length === 0) {
      adminCertTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-certificate" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: #ddd;"></i>
            No certificates in the registry.
          </td>
        </tr>
      `;
      return;
    }

    certificates.forEach((cert, index) => {
      let themeBadge = '<span class="badge-cert-blue badge-product">Blue Stripe</span>';
      if (cert.theme === 'red') themeBadge = '<span class="badge-cert-red badge-product">Red Stripe</span>';
      if (cert.theme === 'gold') themeBadge = '<span class="badge-cert-gold badge-product">Gold Stripe</span>';

      const certImg = cert.image || 'images/certificate_sample.jpg';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="Image"><img src="${escapeHTML(certImg)}" alt="${escapeHTML(cert.title)}" style="width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-light);" onerror="this.src='images/logo.png';"></td>
        <td data-label="Certificate Name"><strong>${escapeHTML(cert.title)}</strong></td>
        <td data-label="Issuing Authority">${escapeHTML(cert.authority)}</td>
        <td data-label="License Type"><span style="font-size:0.85rem; font-weight:600; color:var(--primary-blue);">${escapeHTML(cert.label || 'Certified')}</span></td>
        <td data-label="Registry Status"><span style="color:#16a34a; font-weight:600; font-size:0.85rem;"><i class="fa-solid fa-circle-check"></i> ${escapeHTML(cert.status || 'Active & Verified')}</span></td>
        <td data-label="Theme">${themeBadge}</td>
        <td data-label="Actions" style="text-align: center; white-space: nowrap;">
          <button class="btn-table-action edit btn-edit-cert" data-index="${index}" title="Edit Certificate">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn-table-action delete btn-delete-cert" data-index="${index}" title="Remove Certificate">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      `;
      adminCertTableBody.appendChild(row);
    });

    // Bind Edit Certificate
    adminCertTableBody.querySelectorAll('.btn-edit-cert').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        openEditCertModal(idx);
      });
    });

    // Bind Delete Certificate
    adminCertTableBody.querySelectorAll('.btn-delete-cert').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const cert = certificates[idx];
        if (!cert) return;
        if (confirm(`Are you sure you want to remove "${cert.title}" from the certificates registry permanently?`)) {
          if (cert.id) {
            const deleted = JSON.parse(localStorage.getItem('myexportworld_deleted_certs') || '[]');
            if (!deleted.includes(cert.id)) {
              deleted.push(cert.id);
              localStorage.setItem('myexportworld_deleted_certs', JSON.stringify(deleted));
            }
          }
          certificates.splice(idx, 1);
          saveCertificates();
          renderCertificatesTable();
          showToast("Certificate removed permanently", "warning");
        }
      });
    });
  };

  // Certificate Add Form handler
  if (adminCertForm) {
    adminCertForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('certTitle').value.trim();
      const authority = document.getElementById('certAuthority').value.trim();
      const label = document.getElementById('certLabel').value.trim();
      const status = document.getElementById('certStatus') ? document.getElementById('certStatus').value : 'Active & Verified';
      const theme = document.getElementById('certTheme').value;
      const desc = document.getElementById('certDesc').value.trim();

      let image = certImageSelect ? certImageSelect.value : 'images/certificate_sample.jpg';
      try {
        if (image === 'custom' && certImageCustom) {
          image = certImageCustom.value.trim();
        } else if (image === 'upload' && certImageFile && certImageFile.files.length > 0) {
          showToast("Processing certificate image...", "info");
          image = await compressImage(certImageFile.files[0]);
        }

        if (!title || !authority || !label || !theme || !desc) {
          showToast("Please fill all mandatory certificate fields.", "warning");
          return;
        }

        const newCert = {
          id: "cert_" + Date.now(),
          title,
          authority,
          label,
          status,
          theme,
          image: image || 'images/certificate_sample.jpg',
          desc
        };

        certificates.push(newCert);
        saveCertificates();
        renderCertificatesTable();
        adminCertForm.reset();
        if (certImageCustom) certImageCustom.style.display = 'none';
        if (certImageFile) certImageFile.style.display = 'none';
        showToast("Certificate registered and live!", "success");
      } catch (err) {
        console.error(err);
        showToast("Error saving certificate image.", "warning");
      }
    });
  }

  // Certificate Edit Modal controls
  const modalEditCert = document.getElementById('modalEditCert');
  const formEditCert = document.getElementById('formEditCert');
  const closeModalEditCert = document.getElementById('closeModalEditCert');
  const cancelModalEditCert = document.getElementById('cancelModalEditCert');

  const openEditCertModal = (index) => {
    const cert = certificates[index];
    if (!cert) return;
    document.getElementById('editCertIndex').value = index;
    document.getElementById('editCertTitle').value = cert.title || '';
    document.getElementById('editCertAuthority').value = cert.authority || '';
    document.getElementById('editCertLabel').value = cert.label || '';
    if (document.getElementById('editCertStatus')) {
      document.getElementById('editCertStatus').value = cert.status || 'Active & Verified';
    }
    document.getElementById('editCertTheme').value = cert.theme || 'blue';
    const certImgVal = cert.image || 'images/certificate_sample.jpg';
    document.getElementById('editCertImage').value = certImgVal;
    const editCertImageFile = document.getElementById('editCertImageFile');
    if (editCertImageFile) editCertImageFile.value = '';
    const certPrev = document.getElementById('editCertImagePreview');
    const certPrevImg = document.getElementById('editCertImagePreviewImg');
    if (certPrev && certPrevImg) {
      if (certImgVal) {
        certPrevImg.src = certImgVal;
        certPrev.style.display = 'block';
      } else {
        certPrev.style.display = 'none';
      }
    }
    document.getElementById('editCertDesc').value = cert.desc || '';
    if (modalEditCert) modalEditCert.classList.add('active');
  };

  const closeCertModal = () => {
    if (modalEditCert) modalEditCert.classList.remove('active');
  };
  if (closeModalEditCert) closeModalEditCert.addEventListener('click', closeCertModal);
  if (cancelModalEditCert) cancelModalEditCert.addEventListener('click', closeCertModal);

  if (formEditCert) {
    formEditCert.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('editCertIndex').value, 10);
      if (certificates[idx]) {
        certificates[idx].title = document.getElementById('editCertTitle').value.trim();
        certificates[idx].authority = document.getElementById('editCertAuthority').value.trim();
        certificates[idx].label = document.getElementById('editCertLabel').value.trim();
        if (document.getElementById('editCertStatus')) {
          certificates[idx].status = document.getElementById('editCertStatus').value;
        }
        certificates[idx].theme = document.getElementById('editCertTheme').value;
        certificates[idx].image = document.getElementById('editCertImage').value.trim();
        certificates[idx].desc = document.getElementById('editCertDesc').value.trim();

        saveCertificates();
        renderCertificatesTable();
        closeCertModal();
        showToast("Certificate updated successfully!", "success");
      }
    });
  }

  // --- 6. Helper Utilities ---
  const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  };

  const getFormattedDate = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  const getFormattedArticleDate = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  };

  // Toast System
  const showToast = (message, type = "info") => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = "fa-info-circle";
    if (type === "success") iconClass = "fa-circle-check";
    if (type === "warning") iconClass = "fa-triangle-exclamation";

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}" style="font-size:1.2rem; color:${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--accent-red)' : 'var(--primary-blue)'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "toastSlideOut 0.4s ease forwards";
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 2000);
  };

  // Run Session Validation Check on Page Load
  checkSessionAuth();
});
