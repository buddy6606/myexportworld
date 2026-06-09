/* ==========================================================================
   MY EXPORT WORLD - Core JavaScript Logic (script.js)
   Features:
   - Custom Single Page Application (SPA) view-routing
   - Sticky Header scroll states
   - Inquiry Form processing and LocalStorage database
   - Pre-filled dynamic inquiries based on product actions
   - Administrative panel with Direct Excel Exporter (.csv)
   - Dynamic micro-interactions and Toast system
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Global State & Sample Data ---
  let inquiries = [];
  
  // Sample seed data to showcase the admin dashboard immediately
  const sampleInquiries = [
    {
      timestamp: "2026-05-28 10:15:30",
      companyName: "EuroFood Spices GmbH",
      buyerName: "Dr. Adrian Hoffmann",
      contactNo: "+49 89 2424 553",
      buyerEmail: "a.hoffmann@eurospices.de",
      buyerAddress: "Port of Hamburg, Germany",
      productSelected: "Turmeric Powder (09103030)",
      buyerQuestion: "Looking for an initial trial shipment of 5 Metric Tons (PP Bags). Need Curcumin value guaranteed above 3.8%. Please share phytosanitary specs."
    },
    {
      timestamp: "2026-05-28 12:40:12",
      companyName: "Apex Wellness Corp",
      buyerName: "Sarah Jenkins",
      contactNo: "+1 (212) 555-0198",
      buyerEmail: "sjenkins@apexwellness.com",
      buyerAddress: "New York Port, USA",
      productSelected: "Turmeric Finger Dried (09103020)",
      buyerQuestion: "Interested in contract farming supply. 15 Metric Tons yearly, split in 3 consignments. Requesting Double Polished grade fingers. Please quote CIF New York."
    }
  ];

  // Initialize from LocalStorage
  const loadInquiries = () => {
    const stored = localStorage.getItem('myexportworld_inquiries');
    if (stored) {
      inquiries = JSON.parse(stored);
    } else {
      // Seed with sample data so it's not empty initially
      inquiries = [...sampleInquiries];
      localStorage.setItem('myexportworld_inquiries', JSON.stringify(inquiries));
    }
  };
  
  loadInquiries();

  // --- Daily Blog Database & Sample Data ---
  let blogPosts = [];
  
  const sampleBlogPosts = [
    {
      id: "seed_freight",
      timestamp: "2026-05-29 09:00:00",
      dateFormatted: "May 29, 2026",
      title: "Navigating Ocean Freight: Essential Guide to FCL & LCL Logistics",
      category: "Logistics & Shipping",
      coverImage: "images/blog_freight.png",
      readTime: "6 min read",
      teaserSummary: "Understand container sizing, FOB vs CIF shipping terms, booking ocean cargo lines, and optimizing transit times for large volume shipments.",
      bodyContent: `<p>For international buyers sourcing bulk raw materials or agricultural products from India, selecting the correct ocean freight mode is the single most critical decision impacting your final landed costs and supply chain predictability. Understanding the operational differences between <strong>Full Container Load (FCL)</strong> and <strong>Less than Container Load (LCL)</strong> shipping ensures your goods arrive on time and under budget.</p>
      
      <h3>FCL vs. LCL: Tactical Decision Parameters</h3>
      <p>FCL refers to shipments where an entire ocean cargo container is reserved exclusively for a single importer's goods. In contrast, LCL pools multiple smaller consignments inside a shared container, billed by the volume (cubic meters) or weight.</p>
      
      <table>
        <thead>
          <tr>
            <th>Operational Factor</th>
            <th>Full Container Load (FCL)</th>
            <th>Less than Container Load (LCL)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Typical Volume</strong></td>
            <td>&gt; 15 Cubic Meters (CBM)</td>
            <td>1 to 15 Cubic Meters (CBM)</td>
          </tr>
          <tr>
            <td><strong>Transit Security</strong></td>
            <td>Maximum (Sealed at source port)</td>
            <td>Medium (Frequent handling at CFS)</td>
          </tr>
          <tr>
            <td><strong>Customs Risk</strong></td>
            <td>Low (Cleared as a single unit)</td>
            <td>Higher (Delays on one parcel delays entire container)</td>
          </tr>
          <tr>
            <td><strong>Pricing Model</strong></td>
            <td>Flat rate per container box</td>
            <td>Priced per CBM / Revenue Ton</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Choosing the Right Incoterm: FOB vs. CIF</h3>
      <p>Incoterms define the exact hand-off coordinates where ownership and risks shift from the Indian exporter (My Export World) to the global buyer:</p>
      <ul>
        <li><strong>FOB (Free On Board):</strong> The buyer arranges the sea carrier and assumes marine liability once the cargo crosses the ship's rail at the port of origin (e.g., Nhava Sheva or Mundra Port). FOB gives you total control over ocean routing and rates.</li>
        <li><strong>CIF (Cost, Insurance & Freight):</strong> The exporter books the cargo and pays the freight and transit insurance to the destination port. CIF is highly recommended for newer importers who prefer not to manage sea carriers directly.</li>
      </ul>
      
      <h3>Operational Shipping Checklist for Importers</h3>
      <p>Before booking any container, ensure you run through these three mandatory logistics steps:</p>
      <ol>
        <li>Verify container specifications (20ft standard holds ~28 CBM, 40ft standard holds ~58 CBM, 40ft High Cube holds ~68 CBM).</li>
        <li>Confirm custom port clearance arrangements at your home destination port at least 7 days prior to ship arrival.</li>
        <li>Coordinate container packing specifications with us (e.g., double-polished jumbo bags on heavy-duty wooden pallets, secured with anti-moisture silica gel packets).</li>
      </ol>
      
      <p>At <strong>My Export World</strong>, our specialized logistics desk handles complete export packing, booking with major ocean alliances (Maersk, MSC, CMA CGM), and customs filings inside India, ensuring your transition from NHAVA SHEVA port to your destination port is seamless.</p>`
    },
    {
      id: "seed_finance",
      timestamp: "2026-05-28 14:30:00",
      dateFormatted: "May 28, 2026",
      title: "Securing Trade Payments: A Sourcing Guide to Letters of Credit (L/C)",
      category: "Trade Finance & Laws",
      coverImage: "images/blog_finance.png",
      readTime: "5 min read",
      teaserSummary: "A comprehensive analysis of Bank compliance, avoiding contract discrepancies, international payment securities, and high-value trade finance.",
      bodyContent: `<p>In high-volume international trade, establishing mutual trust between global buyers and suppliers is crucial. The primary tool utilized by Fortune 500 importers to eliminate payment risk is the <strong>Letter of Credit (L/C)</strong>. When backed by the internationally recognized rules of the <em>ICC Uniform Customs and Practice for Documentary Credits (UCP 600)</em>, an L/C guarantees that your funds are only released when the exact shipment terms are met.</p>
      
      <h3>What is a Documentary Letter of Credit?</h3>
      <p>An L/C is a legally binding undertaking issued by the buyer's bank (the Issuing Bank) to pay the exporter (the Beneficiary) a specified amount, provided the exporter presents complying shipping and customs documents within a strict timeframe. This effectively shifts the credit risk from the corporate buyer to a financial institution.</p>
      
      <h3>Anatomy of a Secure L/C Transaction</h3>
      <p>To ensure a letter of credit is accepted by our banking partners in India, the document must be issued as an <strong>Irrevocable, Confirmed, and At-Sight Letter of Credit</strong>. Let's break down these critical terms:</p>
      <ul>
        <li><strong>Irrevocable:</strong> The terms cannot be modified or cancelled without the explicit consent of the buyer, the exporter, and all participating banks.</li>
        <li><strong>Confirmed:</strong> An Indian bank (or major global bank) adds its independent guarantee to pay the exporter, protecting against any default risk of the issuing bank.</li>
        <li><strong>At Sight:</strong> Payment is triggered immediately upon the presentation of complying documents, rather than at a future maturity date (deferred payment).</li>
      </ul>
      
      <h3>Preventing Document Discrepancies</h3>
      <p>Over 50% of L/C presentations are rejected on the first attempt due to clerical errors. Importers must ensure their purchase contracts perfectly align with the credit instructions. Key details to double-check include:</p>
      <ol>
        <li><strong>Product Descriptions:</strong> The commodity name must match the L/C wording word-for-word. Even minor spelling variations can cause a bank hold.</li>
        <li><strong>HS Codes & Quantities:</strong> Ensure the harmonized tariff codes (e.g. HS Code 09103020 for turmeric fingers) and packaging dimensions match our export invoices.</li>
        <li><strong>Shipping Deadlines:</strong> Ensure "Latest Shipment Date" and "Expiry Date" allow at least 21 days for bank document presentation after container loading.</li>
      </ol>
      
      <p>Our financial advisory desk at <strong>My Export World</strong> has successfully processed hundreds of trade finance instruments. We work closely with leading trade banks like State Bank of India, HDFC Bank, and Citibank to vet L/C drafts prior to formal issuance, securing a clean presentation and on-time shipment for your company.</p>`
    },
    {
      id: "seed_customs",
      timestamp: "2026-05-27 11:15:00",
      dateFormatted: "May 27, 2026",
      title: "Seamless Port Clearance: The Essential Customs Documentation Checklist",
      category: "Customs & Compliance",
      coverImage: "images/blog_customs.png",
      readTime: "4 min read",
      teaserSummary: "Review the absolute mandatory documentation including phytosanitary clearances, Certificates of Origin, and Bill of Lading requirements.",
      bodyContent: `<p>Entering international waters requires a rigorous paper trail. Whether you are importing into the European Union, the United States, or the GCC region, customs brokers require precise, legally vetted clearances to prevent demurrage charges and port delays. Review this absolute checklist to ensure compliance on your next import consignment.</p>
      
      <h3>The Mandatory Export Documents Checklist</h3>
      <p>To clear customs seamlessly, every shipment of agricultural commodities, spices, or fiber items must be accompanied by these six core documents:</p>
      
      <table>
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Primary Legal Purpose</th>
            <th>Key Features to Verify</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Bill of Lading (B/L)</strong></td>
            <td>Contract of carriage and document of title</td>
            <td>Must be marked "Clean Shipped on Board" with correct freight markings.</td>
          </tr>
          <tr>
            <td><strong>Commercial Invoice</strong></td>
            <td>Official valuation sheet for duty calculations</td>
            <td>Must clearly specify FOB/CIF terms, payment currency, and HS Codes.</td>
          </tr>
          <tr>
            <td><strong>Packing List (P/L)</strong></td>
            <td>Detailed itemized list of all shipping units</td>
            <td>Includes gross/net weight per bag, pallet details, and batch numbers.</td>
          </tr>
          <tr>
            <td><strong>Certificate of Origin</strong></td>
            <td>Verifies the country where goods were harvested</td>
            <td>Enables preferential tariff rates (e.g. issued by Indian Chambers of Commerce).</td>
          </tr>
          <tr>
            <td><strong>Phytosanitary Certificate</strong></td>
            <td>Biosecurity clearance against pests and diseases</td>
            <td>Issued by Ministry of Agriculture (India) post fumigation. Mandatory for agro-goods.</td>
          </tr>
          <tr>
            <td><strong>Fumigation Certificate</strong></td>
            <td>Proof of chemical/heat disinfection treatment</td>
            <td>Vetted for Methyl Bromide or Phosphine treatment parameters.</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Understanding Phytosanitary & Biosecurity Controls</h3>
      <p>Agricultural imports like Organic Turmeric, Psyllium Husk, and Honey are subject to intensive food safety scrutiny. In the USA, the FDA oversees these controls; in Europe, the European Food Safety Authority (EFSA) enforces strict pesticide residue limits (MRLs). A valid Phytosanitary Certificate guarantees that the product has been inspected and found free from quarantine pests, complying with the biosecurity laws of your importing country.</p>
      
      <h3>Best Practices for a Swift Customs Release</h3>
      <ol>
        <li><strong>Engage a Licensed Customs Broker early:</strong> Share draft documents with your local customs house agent at least 10 days before vessel arrivals.</li>
        <li><strong>Pre-file Import Declarations:</strong> Utilize electronic systems (like US ISF 10+2 filings or EU Import Control System ICS2) to pre-clear shipments prior to vessel docking.</li>
         <li><strong>Ensure Perfect Labeling:</strong> Bag labels must display country of origin, batch numbers, manufacture dates, and net weights matching the packing list exactly.</li>
      </ol>
      
      <p>At <strong>My Export World</strong>, we pride ourselves on a 100% clean port clearance record. We compile all required documentation, execute standard chemical fumigations, and dispatch original courier documents immediately upon vessel sailing, ensuring you never face expensive port storage or delays.</p>`
    }
  ];

  const loadBlogPosts = () => {
    const stored = localStorage.getItem('myexportworld_blog_posts');
    if (stored) {
      blogPosts = JSON.parse(stored);
    } else {
      blogPosts = [...sampleBlogPosts];
      localStorage.setItem('myexportworld_blog_posts', JSON.stringify(blogPosts));
    }
  };

  loadBlogPosts();

  // --- 8. Dynamic Products Nested Catalog Explorer ---
  const level1 = document.getElementById('catalogLevel1');
  const level2 = document.getElementById('catalogLevel2');
  const level3 = document.getElementById('catalogLevel3');
  const gridTurmeric = document.getElementById('gridTurmeric');
  const gridPsyllium = document.getElementById('gridPsyllium');
  const gridHoney = document.getElementById('gridHoney');

  // Breadcrumbs elements
  const breadHome = document.getElementById('breadHome');
  const breadCategory = document.getElementById('breadCategory');
  const breadCommoditySep = document.getElementById('breadCommoditySep');
  const breadCommodity = document.getElementById('breadCommodity');

  // Dynamic Navigation Transitions
  const navigateToLevel1 = () => {
    if (!level1 || !level2 || !level3) return;
    // Show L1, Hide L2 & L3
    level1.classList.remove('hidden');
    level2.classList.add('hidden');
    level3.classList.add('hidden');

    // Reset breadcrumbs
    if (breadCategory) {
      breadCategory.classList.remove('active');
      breadCategory.classList.add('hidden');
    }
    if (breadCommoditySep) breadCommoditySep.classList.add('hidden');
    if (breadCommodity) breadCommodity.classList.add('hidden');
    if (breadHome) breadHome.classList.add('active');
  };

  const navigateToLevel2 = () => {
    if (!level1 || !level2 || !level3) return;
    // Show L2, Hide L1 & L3
    level1.classList.add('hidden');
    level2.classList.remove('hidden');
    level3.classList.add('hidden');

    // Hide all L3 grids
    if (gridTurmeric) gridTurmeric.classList.add('hidden');
    if (gridPsyllium) gridPsyllium.classList.add('hidden');
    if (gridHoney) gridHoney.classList.add('hidden');

    // Update breadcrumbs
    if (breadHome) breadHome.classList.remove('active');
    if (breadCategory) {
      breadCategory.classList.remove('hidden');
      breadCategory.classList.add('active');
    }
    if (breadCommoditySep) breadCommoditySep.classList.add('hidden');
    if (breadCommodity) breadCommodity.classList.add('hidden');
  };

  const navigateToLevel3 = (commodityName) => {
    if (!level1 || !level2 || !level3) return;
    // Show L3, Hide L1 & L2
    level1.classList.add('hidden');
    level2.classList.add('hidden');
    level3.classList.remove('hidden');

    if (breadHome) breadHome.classList.remove('active');
    if (breadCategory) {
      breadCategory.classList.remove('active');
      breadCategory.classList.remove('hidden');
    }
    if (breadCommoditySep) breadCommoditySep.classList.remove('hidden');
    
    // Set active commodity grid & breadcrumb subtext
    if (commodityName === 'turmeric') {
      if (gridTurmeric) gridTurmeric.classList.remove('hidden');
      if (gridPsyllium) gridPsyllium.classList.add('hidden');
      if (gridHoney) gridHoney.classList.add('hidden');
      if (breadCommodity) breadCommodity.textContent = "Turmeric";
    } else if (commodityName === 'psyllium') {
      if (gridPsyllium) gridPsyllium.classList.remove('hidden');
      if (gridTurmeric) gridTurmeric.classList.add('hidden');
      if (gridHoney) gridHoney.classList.add('hidden');
      if (breadCommodity) breadCommodity.textContent = "Psyllium Husk";
    } else if (commodityName === 'honey') {
      if (gridHoney) gridHoney.classList.remove('hidden');
      if (gridTurmeric) gridTurmeric.classList.add('hidden');
      if (gridPsyllium) gridPsyllium.classList.add('hidden');
      if (breadCommodity) breadCommodity.textContent = "Organic Honey";
    }

    if (breadCommodity) {
      breadCommodity.classList.remove('hidden');
      breadCommodity.classList.add('active');
    }
  };

  // Event bindings
  // L1 Card/Action clicks
  const btnExploreAgri = document.getElementById('btnExploreAgri');
  const categoryCardAgri = document.getElementById('categoryCardAgri');
  if (btnExploreAgri) btnExploreAgri.addEventListener('click', navigateToLevel2);
  if (categoryCardAgri) {
    categoryCardAgri.addEventListener('click', (e) => {
      // Prevent double trigger if action button was clicked directly
      if (e.target.id !== 'btnExploreAgri' && !e.target.closest('#btnExploreAgri')) {
        navigateToLevel2();
      }
    });
  }

  // L2 Back/Selection clicks
  const btnBackToLevel1 = document.getElementById('btnBackToLevel1');
  if (btnBackToLevel1) btnBackToLevel1.addEventListener('click', navigateToLevel1);

  const btnSelectTurmeric = document.getElementById('btnSelectTurmeric');
  const spotlightCardTurmeric = document.getElementById('spotlightCardTurmeric');
  if (btnSelectTurmeric) btnSelectTurmeric.addEventListener('click', () => navigateToLevel3('turmeric'));
  if (spotlightCardTurmeric) {
    spotlightCardTurmeric.addEventListener('click', (e) => {
      if (e.target.id !== 'btnSelectTurmeric' && !e.target.closest('#btnSelectTurmeric')) {
        navigateToLevel3('turmeric');
      }
    });
  }

  const btnSelectPsyllium = document.getElementById('btnSelectPsyllium');
  const spotlightCardPsyllium = document.getElementById('spotlightCardPsyllium');
  if (btnSelectPsyllium) btnSelectPsyllium.addEventListener('click', () => navigateToLevel3('psyllium'));
  if (spotlightCardPsyllium) {
    spotlightCardPsyllium.addEventListener('click', (e) => {
      if (e.target.id !== 'btnSelectPsyllium' && !e.target.closest('#btnSelectPsyllium')) {
        navigateToLevel3('psyllium');
      }
    });
  }

  const btnSelectHoney = document.getElementById('btnSelectHoney');
  const spotlightCardHoney = document.getElementById('spotlightCardHoney');
  if (btnSelectHoney) btnSelectHoney.addEventListener('click', () => navigateToLevel3('honey'));
  if (spotlightCardHoney) {
    spotlightCardHoney.addEventListener('click', (e) => {
      if (e.target.id !== 'btnSelectHoney' && !e.target.closest('#btnSelectHoney')) {
        navigateToLevel3('honey');
      }
    });
  }

  // L3 Back clicks
  const btnBackToLevel2 = document.getElementById('btnBackToLevel2');
  if (btnBackToLevel2) btnBackToLevel2.addEventListener('click', navigateToLevel2);

  // Breadcrumb action binds
  if (breadHome) breadHome.addEventListener('click', navigateToLevel1);
  if (breadCategory) breadCategory.addEventListener('click', navigateToLevel2);

  // Set default view state on load
  navigateToLevel1();

  // --- 2. Custom SPA Routing ---
  const navLinks = document.querySelectorAll('.nav-link, .footer-link-item, [data-view]');
  const views = document.querySelectorAll('.view-section');
  const mobileNavMenu = document.getElementById('navMenu');
  const mobileNavToggle = document.getElementById('mobileNavToggle');

  const switchView = (viewName) => {
    // Scroll to top instantly before transitions
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Deactivate all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle active views with class definitions
    views.forEach(view => {
      const sectionId = view.getAttribute('id');
      if (sectionId === `view-${viewName}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Intercept navigation to product view and default back to Level 1
    if (viewName === 'product') {
      navigateToLevel1();
    }

    // Intercept navigation to blog view and ensure grid is shown (reader hidden)
    if (viewName === 'blog') {
      const blogGrid = document.getElementById('blogCardGrid');
      const blogSingleView = document.getElementById('blogSingleView');
      if (blogGrid) blogGrid.style.display = 'grid';
      if (blogSingleView) blogSingleView.style.display = 'none';
      renderBlogGrid('all');
    }
    
    // Close mobile nav menu if open
    if (mobileNavMenu.classList.contains('open')) {
      mobileNavMenu.classList.remove('open');
      mobileNavToggle.classList.remove('active');
    }
  };

  // Attach event listeners to all links with data-view attributes
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      if (targetView) {
        switchView(targetView);
      }
    });
  });

  // Mobile menu toggle click
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavMenu.classList.toggle('open');
      // Simple toggle styling helper for button spans
      const spans = mobileNavToggle.querySelectorAll('span');
      mobileNavToggle.classList.toggle('active');
      if (mobileNavToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Header Scroll Activation State
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 3. Dynamic Products Inquiries Integration ---
  const quickInquireButtons = document.querySelectorAll('.quick-inquire-btn');
  const productDropdown = document.getElementById('productSelected');

  quickInquireButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.getAttribute('data-product');
      if (productDropdown && productName) {
        // Pre-fill dropdown
        productDropdown.value = productName;
        // Redirect to inquiry tab
        switchView('inquiry');
        showToast(`Selected: ${productName}`, "success");
      }
    });
  });

  // --- 4. Inquiry Form Management ---
  const inquiryForm = document.getElementById('inquiryForm');
  const inquiryCardWrapper = document.getElementById('inquiryCardWrapper');
  const inquirySuccessView = document.getElementById('inquirySuccessView');
  const btnInquiryReset = document.getElementById('btnInquiryReset');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Read form fields
      const companyName = document.getElementById('companyName').value.trim();
      const buyerName = document.getElementById('buyerName').value.trim();
      const contactNo = document.getElementById('contactNo').value.trim();
      const buyerEmail = document.getElementById('buyerEmail').value.trim();
      const buyerAddress = document.getElementById('buyerAddress').value.trim();
      const productSelected = document.getElementById('productSelected').value;
      const buyerQuestion = document.getElementById('buyerQuestion').value.trim();

      // Simple Validation Check
      if (!companyName || !buyerName || !contactNo || !buyerEmail || !buyerAddress || !productSelected || !buyerQuestion) {
        showToast("Please fill in all mandatory fields.", "warning");
        return;
      }

      // Format Date-Time string
      const now = new Date();
      const timestamp = now.getFullYear() + '-' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(now.getDate()).padStart(2, '0') + ' ' + 
                        String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0') + ':' + 
                        String(now.getSeconds()).padStart(2, '0');

      // Construct New Submission object
      const newInquiry = {
        timestamp,
        companyName,
        buyerName,
        contactNo,
        buyerEmail,
        buyerAddress,
        productSelected,
        buyerQuestion
      };

      // Push into state and save to local storage
      inquiries.unshift(newInquiry); // Insert at first index
      localStorage.setItem('myexportworld_inquiries', JSON.stringify(inquiries));

      // Trigger Visual Success States
      inquiryCardWrapper.style.display = 'none';
      inquirySuccessView.style.display = 'block';
      showToast("Quote Inquiry Logged!", "success");
      
      // Update admin table if open
      renderAdminTable();
    });
  }

  // Reset Inquiry Form
  if (btnInquiryReset) {
    btnInquiryReset.addEventListener('click', () => {
      inquiryForm.reset();
      inquirySuccessView.style.display = 'none';
      inquiryCardWrapper.style.display = 'grid';
    });
  }

  // --- 5. Secret Administrative Modal Panel ---
  const adminTriggerBtn = document.getElementById('adminTriggerBtn');
  const logoClick = document.getElementById('logoClick');
  const adminOverlay = document.getElementById('adminOverlay');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const adminTableBody = document.getElementById('adminTableBody');
  const adminStatTotal = document.getElementById('adminStatTotal');
  const adminExportBtn = document.getElementById('adminExportBtn');
  const adminClearBtn = document.getElementById('adminClearBtn');

  const openAdminPanel = () => {
    // Optional passcode prompt to make it feel extremely premium and authentic
    const code = prompt("Enter Administrative Access Key (Hint: 1234):");
    if (code === "1234" || code === "") {
      renderAdminTable();
      if (typeof renderAdminBlogTable === 'function') {
        renderAdminBlogTable();
      }
      adminOverlay.classList.add('open');
      showToast("Admin Desk Unlocked", "success");
    } else if (code !== null) {
      showToast("Access Denied: Invalid Security Key", "warning");
    }
  };

  if (adminTriggerBtn) {
    adminTriggerBtn.addEventListener('click', openAdminPanel);
  }

  // Double Click Logo to enter admin desk as a secret shortcut
  if (logoClick) {
    logoClick.addEventListener('dblclick', () => {
      openAdminPanel();
    });
  }

  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', () => {
      adminOverlay.classList.remove('open');
    });
  }

  // Close admin when clicking on gray backdrop
  if (adminOverlay) {
    adminOverlay.addEventListener('click', (e) => {
      if (e.target === adminOverlay) {
        adminOverlay.classList.remove('open');
      }
    });
  }

  // Render inquiries data inside administrative table
  const renderAdminTable = () => {
    if (!adminTableBody) return;
    
    // Update count stat
    if (adminStatTotal) {
      adminStatTotal.textContent = inquiries.length;
    }

    adminTableBody.innerHTML = '';

    if (inquiries.length === 0) {
      adminTableBody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="admin-empty-state">
              <i class="fa-regular fa-folder-open"></i>
              <p>No active inquiries logged inside local database.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    inquiries.forEach(inq => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${inq.timestamp}</strong></td>
        <td>${escapeHTML(inq.companyName)}</td>
        <td>${escapeHTML(inq.buyerName)}</td>
        <td><a href="tel:${inq.contactNo}" style="color:var(--primary-blue-light);font-weight:600;"><i class="fa-solid fa-phone"></i> ${escapeHTML(inq.contactNo)}</a></td>
        <td><a href="mailto:${inq.buyerEmail}" style="color:var(--primary-blue-light);font-weight:600;"><i class="fa-regular fa-envelope"></i> ${escapeHTML(inq.buyerEmail)}</a></td>
        <td>${escapeHTML(inq.buyerAddress)}</td>
        <td><span class="hs-code-tag" style="margin-bottom:0; font-size:0.75rem;">${escapeHTML(inq.productSelected)}</span></td>
        <td style="max-width:250px; font-size:0.85rem; line-height:1.4; color:var(--text-muted);">${escapeHTML(inq.buyerQuestion)}</td>
      `;
      adminTableBody.appendChild(row);
    });
  };

  // Helper utility to safely escape raw strings against XSS inside client-side renders
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

  // Clear all admin data from LocalStorage
  if (adminClearBtn) {
    adminClearBtn.addEventListener('click', () => {
      const confirmClear = confirm("Are you sure you want to clear ALL inquiries from this device? This action cannot be undone.");
      if (confirmClear) {
        inquiries = [];
        localStorage.removeItem('myexportworld_inquiries');
        renderAdminTable();
        showToast("Inquiry Database Wiped", "warning");
      }
    });
  }

  // --- 6. Direct Excel Spreadsheet CSV Exporter ---
  if (adminExportBtn) {
    adminExportBtn.addEventListener('click', () => {
      if (inquiries.length === 0) {
        showToast("No data to export.", "warning");
        return;
      }

      // Construct CSV content columns
      const headers = ["Timestamp", "Company Name", "Contact Name", "Contact No", "Email Address", "Address/Port", "Product Category", "Requirements"];
      
      const csvRows = [];
      csvRows.push(headers.join(",")); // Headers row

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

        // Format cell content strictly to escape quotes and handle commas safely for proper MS Excel loading
        const escapedRowData = rowData.map(value => {
          if (value === null || value === undefined) return '""';
          let strValue = String(value);
          // Escape existing double quotes by doubling them
          strValue = strValue.replace(/"/g, '""');
          // Wrap inside double quotes if values contain commas, quotes, or newlines
          if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n') || strValue.includes('\r')) {
            return `"${strValue}"`;
          }
          return `"${strValue}"`;
        });

        csvRows.push(escapedRowData.join(","));
      });

      const csvString = csvRows.join("\r\n");
      
      // UTF-8 Byte Order Mark (BOM) to force Microsoft Excel to load encoding perfectly
      const BOM = "\uFEFF"; 
      const blob = new Blob([BOM + csvString], { type: "text/csv;charset=utf-8;" });
      
      // Create hidden downloader anchor element
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

  // Get short formatted current date for filename exports
  const getFormattedDate = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  // --- 7. Toast Alerts Notification System ---
  const showToast = (message, type = "info") => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon based on alert type
    let iconClass = "fa-info-circle";
    if (type === "success") iconClass = "fa-circle-check";
    if (type === "warning") iconClass = "fa-triangle-exclamation";

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}" style="font-size:1.2rem; color:${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--accent-red)' : 'var(--primary-blue)'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Fade and slide out after 4 seconds
    setTimeout(() => {
      toast.style.animation = "toastSlideOut 0.4s ease forwards";
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 4000);
  };

  // Add toast exit keyframes dynamically to style.css or let JS handle it, but wait: we can define it directly
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes toastSlideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(120%); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);

  // --- 9. Dynamic Daily Blog & Publisher Engine ---
  const blogGrid = document.getElementById('blogCardGrid');
  const blogSingleView = document.getElementById('blogSingleView');
  const blogArticleContent = document.getElementById('blogArticleContent');
  const btnBlogBack = document.getElementById('btnBlogBack');
  const adminBlogForm = document.getElementById('adminBlogForm');
  const blogFilterButtons = document.querySelectorAll('.blog-filter-btn');

  // Admin Tab Toggling
  const tabBtnInquiries = document.getElementById('tabBtnInquiries');
  const tabBtnBlog = document.getElementById('tabBtnBlog');
  const adminContentInquiries = document.getElementById('adminContentInquiries');
  const adminContentBlog = document.getElementById('adminContentBlog');

  if (tabBtnInquiries && tabBtnBlog && adminContentInquiries && adminContentBlog) {
    tabBtnInquiries.addEventListener('click', () => {
      tabBtnInquiries.classList.add('active');
      tabBtnBlog.classList.remove('active');
      adminContentInquiries.classList.add('active');
      adminContentBlog.classList.remove('active');
      adminContentInquiries.style.display = 'block';
      adminContentBlog.style.display = 'none';
    });

    tabBtnBlog.addEventListener('click', () => {
      tabBtnBlog.classList.add('active');
      tabBtnInquiries.classList.remove('active');
      adminContentBlog.classList.add('active');
      adminContentInquiries.classList.remove('active');
      adminContentBlog.style.display = 'block';
      adminContentInquiries.style.display = 'none';
      renderAdminBlogTable();
    });
  }

  // Render Table of Active Insights in the Editorial Panel with Remove controls
  const renderAdminBlogTable = () => {
    const adminBlogTableBody = document.getElementById('adminBlogTableBody');
    if (!adminBlogTableBody) return;
    
    adminBlogTableBody.innerHTML = '';
    
    if (blogPosts.length === 0) {
      adminBlogTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">
            No articles published. Grid is empty.
          </td>
        </tr>
      `;
      return;
    }
    
    blogPosts.forEach(post => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${escapeHTML(post.title)}</strong></td>
        <td><span class="hs-code-tag" style="margin-bottom:0; font-size:0.75rem;">${escapeHTML(post.category)}</span></td>
        <td>${escapeHTML(post.readTime)}</td>
        <td>${escapeHTML(post.dateFormatted || 'Recent')}</td>
        <td>
          <button class="btn btn-secondary btn-delete-blog" data-post-id="${post.id}" style="border-color: var(--accent-red); color: var(--accent-red); padding: 0.4rem 0.8rem; font-size: 0.75rem; border-radius: var(--radius-sm);">
            <i class="fa-regular fa-trash-can"></i> Remove
          </button>
        </td>
      `;
      adminBlogTableBody.appendChild(row);
    });

    // Bind remove button clicks
    const deleteButtons = adminBlogTableBody.querySelectorAll('.btn-delete-blog');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.getAttribute('data-post-id');
        const confirmDelete = confirm("Are you sure you want to delete this insight? This action will remove it live from your website.");
        if (confirmDelete) {
          // Remove from local array
          blogPosts = blogPosts.filter(p => p.id !== postId);
          
          // Sync with LocalStorage
          localStorage.setItem('myexportworld_blog_posts', JSON.stringify(blogPosts));
          
          // Refresh both the admin table AND the public blog grid!
          renderAdminBlogTable();
          renderBlogGrid('all');
          
          showToast("Article Removed Live!", "warning");
        }
      });
    });
  };

  // Render Grid
  const renderBlogGrid = (filterCategory = 'all') => {
    if (!blogGrid) return;
    blogGrid.innerHTML = '';

    const filtered = blogPosts.filter(post => {
      if (filterCategory === 'all') return true;
      return post.category.toLowerCase() === filterCategory.toLowerCase();
    });

    if (filtered.length === 0) {
      blogGrid.innerHTML = `
        <div style="grid-column: span 3; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
          <i class="fa-solid fa-feather-pointed" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1.5rem;"></i>
          <h4 style="font-size: 1.4rem; color: var(--primary-blue-dark); margin-bottom: 0.5rem;">No Articles Posted Yet</h4>
          <p style="color: var(--text-muted);">Check back soon or publish an insight from the Administrative Desk.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(post => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      
      // Determine correct badge classes
      let badgeClass = 'badge-logistics';
      if (post.category.includes('Customs')) badgeClass = 'badge-customs';
      if (post.category.includes('Finance') || post.category.includes('Laws')) badgeClass = 'badge-finance';

      card.innerHTML = `
        <div class="blog-card-img-wrapper">
          <img src="${escapeHTML(post.thumbnailImage || post.coverImage)}" alt="${escapeHTML(post.title)}" class="blog-card-img" onerror="this.src='images/blog_freight.png';">
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="blog-category-badge ${badgeClass}">${escapeHTML(post.category)}</span>
            <span><i class="fa-regular fa-clock"></i> ${escapeHTML(post.readTime)}</span>
          </div>
          <h3 class="blog-card-title">${escapeHTML(post.title)}</h3>
          <p class="blog-card-summary">${escapeHTML(post.teaserSummary)}</p>
          <div class="blog-card-footer">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">
              <i class="fa-regular fa-calendar-days" style="margin-right: 0.3rem;"></i> ${escapeHTML(post.dateFormatted || 'Recent')}
            </span>
            <span class="blog-read-more">Read Insight <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openArticleReader(post));
      blogGrid.appendChild(card);
    });
  };

  // Open Single View Reader
  const openArticleReader = (post) => {
    if (!blogGrid || !blogSingleView || !blogArticleContent) return;
    
    // Hide grid, show single reader view
    blogGrid.style.display = 'none';
    blogSingleView.style.display = 'block';

    let badgeClass = 'badge-logistics';
    if (post.category.includes('Customs')) badgeClass = 'badge-customs';
    if (post.category.includes('Finance') || post.category.includes('Laws')) badgeClass = 'badge-finance';

    blogArticleContent.innerHTML = `
      <div class="blog-article-header">
        <div class="blog-article-meta">
          <span class="blog-category-badge ${badgeClass}">${escapeHTML(post.category)}</span>
          <span style="color: var(--text-muted); font-size: 0.9rem;"><i class="fa-regular fa-calendar-days"></i> Published: ${escapeHTML(post.dateFormatted || 'Recent')}</span>
          <span style="color: var(--text-muted); font-size: 0.9rem;"><i class="fa-regular fa-clock"></i> Estimated Read: ${escapeHTML(post.readTime)}</span>
        </div>
        <h1 class="blog-article-title">${escapeHTML(post.title)}</h1>
      </div>

      <div class="blog-article-cover-wrapper">
        <img src="${escapeHTML(post.coverImage)}" alt="${escapeHTML(post.title)}" class="blog-article-cover" onerror="this.src='images/blog_freight.png';">
      </div>

      <div class="blog-article-content">
        ${post.bodyContent}
      </div>

      <!-- Quick Sourcing Handshake CTA Card -->
      <div class="blog-cta-card">
        <div class="blog-cta-info">
          <h4>Procure Premium Spices, Husks & Honey</h4>
          <p>Ready to source internationally with 100% logistics, compliance, and payment security? Connect directly with our sourcing advisors to get a custom commercial quote.</p>
        </div>
        <div class="blog-cta-action">
          <button class="btn btn-primary" id="btnBlogCtaInquire" style="background: var(--accent-yellow); border-color: var(--accent-yellow); color: var(--primary-blue-dark); font-weight: 700;">
            <i class="fa-solid fa-paper-plane"></i> Start Sourcing Proposal
          </button>
        </div>
      </div>
    `;

    // Bind inside-article CTA button click
    const btnBlogCtaInquire = document.getElementById('btnBlogCtaInquire');
    if (btnBlogCtaInquire) {
      btnBlogCtaInquire.addEventListener('click', () => {
        // Pre-fill general enquiry
        const productDropdown = document.getElementById('productSelected');
        if (productDropdown) {
          productDropdown.value = "General Sourcing / Logistics Request";
        }
        switchView('inquiry');
        showToast("Welcome to Sourcing Center", "success");
      });
    }

    // Scroll reader view smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back button event listener
  if (btnBlogBack) {
    btnBlogBack.addEventListener('click', () => {
      if (blogGrid && blogSingleView) {
        blogGrid.style.display = 'grid';
        blogSingleView.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Filter toolbar button active toggle
  blogFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      blogFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-blog-category');
      renderBlogGrid(cat);
    });
  });

  // Dynamic Cover & Thumbnail show/hide listeners for Custom URL Option
  const blogImageSelect = document.getElementById('blogImage');
  const blogImageCustom = document.getElementById('blogImageCustom');
  const blogThumbnailSelect = document.getElementById('blogThumbnail');
  const blogThumbnailCustom = document.getElementById('blogThumbnailCustom');

  if (blogImageSelect && blogImageCustom) {
    blogImageSelect.addEventListener('change', () => {
      if (blogImageSelect.value === 'custom') {
        blogImageCustom.style.display = 'block';
        blogImageCustom.setAttribute('required', 'true');
      } else {
        blogImageCustom.style.display = 'none';
        blogImageCustom.removeAttribute('required');
        blogImageCustom.value = '';
      }
    });
  }

  if (blogThumbnailSelect && blogThumbnailCustom) {
    blogThumbnailSelect.addEventListener('change', () => {
      if (blogThumbnailSelect.value === 'custom') {
        blogThumbnailCustom.style.display = 'block';
        blogThumbnailCustom.setAttribute('required', 'true');
      } else {
        blogThumbnailCustom.style.display = 'none';
        blogThumbnailCustom.removeAttribute('required');
        blogThumbnailCustom.value = '';
      }
    });
  }

  // Admin Publisher Form Submission Handlers
  if (adminBlogForm) {
    adminBlogForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('blogTitle').value.trim();
      const category = document.getElementById('blogCategory').value;
      const readTime = document.getElementById('blogReadTime').value.trim();
      
      // Cover Image resolution
      let coverImage = blogImageSelect ? blogImageSelect.value : '';
      if (coverImage === 'custom' && blogImageCustom) {
        coverImage = blogImageCustom.value.trim();
      }

      // Thumbnail Image resolution
      let thumbnailImage = blogThumbnailSelect ? blogThumbnailSelect.value : '';
      if (thumbnailImage === 'custom' && blogThumbnailCustom) {
        thumbnailImage = blogThumbnailCustom.value.trim();
      } else if (!thumbnailImage) {
        thumbnailImage = coverImage;
      }

      const teaserSummary = document.getElementById('blogSummary').value.trim();
      const rawBody = document.getElementById('blogBody').value.trim();

      if (!title || !category || !readTime || !coverImage || !thumbnailImage || !teaserSummary || !rawBody) {
        showToast("Please fill all mandatory article fields.", "warning");
        return;
      }

      // Dynamic Article Paragraph formatting helper
      const formatBodyToHTML = (text) => {
        if (text.includes('<p>') || text.includes('<h3>') || text.includes('<ul>')) {
          return text; // Preserve rich HTML if inputted
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

      // Add to beginning of database
      blogPosts.unshift(newPost);
      localStorage.setItem('myexportworld_blog_posts', JSON.stringify(blogPosts));

      // Reset Form fields and hide custom fields
      adminBlogForm.reset();
      if (blogImageCustom) {
        blogImageCustom.style.display = 'none';
        blogImageCustom.removeAttribute('required');
      }
      if (blogThumbnailCustom) {
        blogThumbnailCustom.style.display = 'none';
        blogThumbnailCustom.removeAttribute('required');
      }

      // Close Administrative Desk Overlay
      const adminOverlay = document.getElementById('adminOverlay');
      if (adminOverlay) {
        adminOverlay.classList.remove('open');
      }

      // Switch active view directly to Blog view and render
      switchView('blog');
      renderBlogGrid('all');
      renderAdminBlogTable();

      showToast("Daily Sourcing Insight Published Live!", "success");
    });
  }

  // Get nice formatted publication date: "May 29, 2026"
  const getFormattedArticleDate = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  };

  // Bind direct Write Daily Blog button trigger
  const btnBlogPublishDesk = document.getElementById('btnBlogPublishDesk');
  if (btnBlogPublishDesk) {
    btnBlogPublishDesk.addEventListener('click', () => {
      // Trigger admin panel passcode check
      const code = prompt("Enter Administrative Access Key (Hint: 1234):");
      if (code === "1234" || code === "") {
        renderAdminTable();
        renderAdminBlogTable();
        
        // Show Administrative Desk Modal
        const adminOverlay = document.getElementById('adminOverlay');
        if (adminOverlay) {
          adminOverlay.classList.add('open');
        }
        
        // Switch Administrative Desk workspace tab to "Publish Daily Blog" active state
        const tabBtnBlog = document.getElementById('tabBtnBlog');
        const tabBtnInquiries = document.getElementById('tabBtnInquiries');
        const adminContentBlog = document.getElementById('adminContentBlog');
        const adminContentInquiries = document.getElementById('adminContentInquiries');
        
        if (tabBtnBlog && tabBtnInquiries && adminContentBlog && adminContentInquiries) {
          tabBtnBlog.classList.add('active');
          tabBtnInquiries.classList.remove('active');
          adminContentBlog.classList.add('active');
          adminContentInquiries.classList.remove('active');
          adminContentBlog.style.display = 'block';
          adminContentInquiries.style.display = 'none';
        }
        
        showToast("Editorial Desk Unlocked!", "success");
      } else if (code !== null) {
        showToast("Access Denied: Invalid Security Key", "warning");
      }
    });
  }

  // Set default view render of blog cards if view loads
  renderBlogGrid('all');

  // --- 10. Animated Stats Counter Engine (Intersection Observer) ---
  const statsSection = document.getElementById('statsSection');
  const statCards = document.querySelectorAll('.stat-counter-card');
  const statCounters = document.querySelectorAll('.stat-count-value');
  let statsAnimated = false;

  /**
   * Smoothly animate a number from 0 to target using easeOutQuart curve
   */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(easedProgress * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /**
   * Trigger the full stats entrance animation sequence
   */
  function triggerStatsAnimation() {
    if (statsAnimated) return;
    statsAnimated = true;

    // Stagger card entrance animations
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animated-in');
      }, index * 150);
    });

    // Start counter animations with a slight delay after cards appear
    statCounters.forEach((counter, index) => {
      setTimeout(() => {
        animateCounter(counter);
      }, 400 + (index * 150));
    });
  }

  // Use Intersection Observer to trigger animation when section scrolls into view
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          triggerStatsAnimation();
          statsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3 // Trigger when 30% of the section is visible
    });

    statsObserver.observe(statsSection);
  }

  // Also re-trigger animation when navigating to home view (SPA routing)
  // Reset counters when leaving home, animate when returning
  const originalSwitchView = window.switchViewFn;

  // Patch into SPA navigation to handle counter reset/replay
  document.querySelectorAll('[data-view]').forEach(link => {
    link.addEventListener('click', () => {
      const targetView = link.getAttribute('data-view');
      if (targetView === 'home' && statsAnimated) {
        // Reset counters for replay
        statsAnimated = false;
        statCounters.forEach(c => { c.textContent = '0'; });
        statCards.forEach(c => { c.classList.remove('animated-in'); });
        // Re-trigger after a short delay to let the view render
        setTimeout(() => {
          triggerStatsAnimation();
        }, 300);
      }
    });
  });

});
