/* ==========================================================================
   MY EXPORT WORLD - Administrative Console JS Logic (admin.js)
   Integrates with localStorage databases and manages the editorial/inquiry desks
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  const correctAccessKey = "MYEXPORTWORLD9601343577";

  const sampleProducts = [
    {
      id: "prod_turmeric_finger",
      title: "Dried Turmeric Finger",
      hsCode: "09103020",
      category: "turmeric",
      badge: "Double Polished",
      image: "images/turmeric_finger.jpg",
      description: "Premium quality dried whole turmeric rhizomes, double polished to yield bright yellow-gold skin, rich in curcumin content.",
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
      description: "Pure ground turmeric spice, processed under hygienic conditions to preserve active aroma, essential oils, and curcumin concentration.",
      specs: [
        { name: "Curcumin", value: "Min 3.8%" },
        { name: "Origin", value: "Erode / Nizamabad, India" },
        { name: "Mesh Size", value: "60 - 80 mesh" },
        { name: "Purity", value: "100% Pure, No Additives" },
        { name: "Moisture", value: "Max 9%" }
      ]
    },
    {
      id: "prod_turmeric_fresh",
      title: "Fresh Turmeric",
      hsCode: "09103010",
      category: "turmeric",
      badge: "Organic Harvest",
      image: "images/turmeric_fresh.jpg",
      description: "Harvested fresh organic turmeric rhizomes, raw and unprocessed. Retains full therapeutic attributes, juice content, and fresh spice flavor.",
      specs: [
        { name: "State", value: "Fresh Raw Rhizomes" },
        { name: "Origin", value: "Sangli / Erode, India" },
        { name: "Packing", value: "Crates / Jute Bags" },
        { name: "Organic Status", value: "100% Organic" },
        { name: "Curcumin", value: "3% - 4%" }
      ]
    },
    {
      id: "prod_psyllium_husk",
      title: "Psyllium Husk Whole",
      hsCode: "12119032",
      category: "psyllium",
      badge: "99% Ultra-Pure",
      image: "images/psyllium_husk.png",
      description: "Premium whole seed husks of Plantago ovata, serving as an exceptional soluble dietary fiber. Used widely in food processing and pharmaceuticals.",
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
      description: "Fine ground psyllium husk powder, ideal for easy blending into dietary supplements, bakery products, and pharmaceutical formulations.",
      specs: [
        { name: "Purity Grade", value: "98% (40-60 mesh)" },
        { name: "Origin", value: "Gujarat, India" },
        { name: "Packing", value: "25 kg Multi-layer Paper Bags" },
        { name: "Mesh Size", value: "40 - 100 mesh" },
        { name: "Swell Volume", value: "Min 35 ml / gram" }
      ]
    },
    {
      id: "prod_cumin_seeds",
      title: "Cumin Seeds",
      hsCode: "09093120",
      category: "cumin",
      badge: "Sortex Cleaned",
      image: "images/cumin_seeds.png",
      description: "Premium grade machine-cleaned and Sortex-purified dry cumin seeds. Rich in essential oils and thymol content.",
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
      description: "Pure ground cumin spice, milled under cold processing to preserve natural volatile oils, rich earthy flavor, and warming aroma.",
      specs: [
        { name: "Volatile Oil", value: "Min 1.5%" },
        { name: "Origin", value: "Gujarat, India" },
        { name: "Mesh Size", value: "50 - 60 mesh" },
        { name: "Purity", value: "100% Pure, No Additives" },
        { name: "Moisture", value: "Max 8%" }
      ]
    },
    {
      id: "prod_red_chilli",
      title: "Dry Red Chilli",
      hsCode: "09042211",
      category: "chilli",
      badge: "Stemless Grade-A",
      image: "images/chilli_whole.png",
      description: "Premium sun-dried whole red chilli pods, stemless, featuring vibrant deep red color and hot pungency rating. Selected carefully from Guntur origins.",
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
      description: "Finely ground premium red chilli powder, delivering consistent heat and rich red coloring. Hygienically processed without artificial colorings.",
      specs: [
        { name: "Pungency", value: "60,000 - 80,000 SHU" },
        { name: "Origin", value: "Guntur, India" },
        { name: "Packing", value: "20 / 25 kg PP Bags" },
        { name: "Purity", value: "100% Natural" },
        { name: "Moisture", value: "Max 9.5%" }
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
  const panelInquiries = document.getElementById('panelInquiries');
  const panelBlog = document.getElementById('panelBlog');
  const panelProducts = document.getElementById('panelProducts');

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
  const prodImageSelect = document.getElementById('prodImage');
  const prodImageCustom = document.getElementById('prodImageCustom');
  const prodImageFile = document.getElementById('prodImageFile');
  const adminProductTableBody = document.getElementById('adminProductTableBody');

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
        if (!snapshot.empty) {
          blogPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          localStorage.setItem('myexportworld_blog_posts', JSON.stringify(blogPosts));
          renderBlogsTable();
          updateStatistics();
        }
      });
      db.collection('products').onSnapshot(snapshot => {
        if (!snapshot.empty) {
          products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          localStorage.setItem('myexportworld_products', JSON.stringify(products));
          renderProductsTable();
          updateStatistics();
        }
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
      const storedBlogs = localStorage.getItem('myexportworld_blog_posts');
      if (storedBlogs) blogPosts = JSON.parse(storedBlogs);
      else blogPosts = [];
    } catch (e) { blogPosts = []; }

    // Load Products fallback
    try {
      const storedProducts = localStorage.getItem('myexportworld_products');
      if (storedProducts) products = JSON.parse(storedProducts);
      else products = [...sampleProducts];
    } catch (e) { products = [...sampleProducts]; }

    renderInquiriesTable();
    renderBlogsTable();
    renderProductsTable();
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
      localStorage.setItem('myexportworld_products', JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
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
  };

  // --- 3. Tab Routing & Nav ---
  const switchTab = (tabName) => {
    if (tabName === 'inquiries') {
      tabBtnInquiries.classList.add('active');
      tabBtnBlog.classList.remove('active');
      tabBtnProducts.classList.remove('active');
      panelInquiries.classList.add('active');
      panelBlog.classList.remove('active');
      panelProducts.classList.remove('active');
    } else if (tabName === 'blog') {
      tabBtnBlog.classList.add('active');
      tabBtnInquiries.classList.remove('active');
      tabBtnProducts.classList.remove('active');
      panelBlog.classList.add('active');
      panelInquiries.classList.remove('active');
      panelProducts.classList.remove('active');
    } else if (tabName === 'products') {
      tabBtnProducts.classList.add('active');
      tabBtnInquiries.classList.remove('active');
      tabBtnBlog.classList.remove('active');
      panelProducts.classList.add('active');
      panelInquiries.classList.remove('active');
      panelBlog.classList.remove('active');
    }
  };

  const handleTabRouting = () => {
    // Check parameters first, then fall back to hash
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const hash = window.location.hash;

    if (tabParam === 'blog' || hash === '#blog') {
      switchTab('blog');
    } else if (tabParam === 'products' || hash === '#products') {
      switchTab('products');
    } else {
      switchTab('inquiries');
    }
  };

  // Tab bindings
  if (tabBtnInquiries) {
    tabBtnInquiries.addEventListener('click', () => switchTab('inquiries'));
  }
  if (tabBtnBlog) {
    tabBtnBlog.addEventListener('click', () => switchTab('blog'));
  }
  if (tabBtnProducts) {
    tabBtnProducts.addEventListener('click', () => switchTab('products'));
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
        <td data-label="Action" style="text-align: center;">
          <button class="btn-table-action delete btn-delete-blog" data-index="${index}" title="Remove Article">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      `;
      adminBlogTableBody.appendChild(row);
    });

    // Delete Blog buttons binding
    const deleteBlogBtnList = adminBlogTableBody.querySelectorAll('.btn-delete-blog');
    deleteBlogBtnList.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
        const confirmDelete = confirm("Are you sure you want to delete this insight? This action will remove it live from your website.");
        if (confirmDelete) {
          const targetPost = blogPosts[targetIdx];
          if (db && targetPost && targetPost.id) {
            db.collection('blog_posts').doc(targetPost.id).delete();
          }
          blogPosts.splice(targetIdx, 1);
          saveBlogPosts();
          loadDatabase();
          showToast("Article Removed Live!", "warning");
        }
      });
    });
  };

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

  // --- 5B. Product Catalog Operations ---
  setupImageSelectorControls(prodImageSelect, prodImageCustom, prodImageFile);

  const prodCategorySelect = document.getElementById('prodCategory');
  const prodCategoryCustom = document.getElementById('prodCategoryCustom');
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

  setupCustomCategoryControls(prodCategorySelect, prodCategoryCustom);
  setupCustomCategoryControls(blogCategorySelect, blogCategoryCustom);

  // Render Product Catalog Table in Admin Dashboard
  const renderProductsTable = () => {
    if (!adminProductTableBody) return;
    adminProductTableBody.innerHTML = '';

    if (products.length === 0) {
      adminProductTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-wheat-awn" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: #ddd;"></i>
            No products published in the live catalog.
          </td>
        </tr>
      `;
      return;
    }

    products.forEach((prod, index) => {
      let categoryLabel = prod.category ? (prod.category.charAt(0).toUpperCase() + prod.category.slice(1)) : 'Turmeric';
      let categoryClass = '';
      if (prod.category === 'psyllium') {
        categoryLabel = 'Psyllium Husk';
        categoryClass = 'style="background-color:rgba(16, 185, 129, 0.05); color:var(--success); border-color:rgba(16, 185, 129, 0.1);"';
      } else if (prod.category === 'cumin') {
        categoryLabel = 'Cumin Seeds & Powder';
        categoryClass = 'style="background-color:rgba(255, 170, 0, 0.05); color:var(--accent-yellow); border-color:rgba(255, 170, 0, 0.1);"';
      } else if (prod.category === 'chilli') {
        categoryLabel = 'Red Chilli & Powder';
        categoryClass = 'style="background-color:rgba(214, 28, 44, 0.05); color:var(--accent-red); border-color:rgba(214, 28, 44, 0.1);"';
      } else if (prod.category === 'turmeric') {
        categoryLabel = 'Turmeric';
        categoryClass = 'style="background-color:rgba(255, 170, 0, 0.05); color:var(--accent-yellow); border-color:rgba(255, 170, 0, 0.1);"';
      } else {
        // Custom Category
        categoryClass = 'style="background-color:rgba(11, 60, 155, 0.05); color:var(--primary-blue); border-color:rgba(11, 60, 155, 0.1);"';
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="Image"><img src="${escapeHTML(prod.image)}" alt="${escapeHTML(prod.title)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-light);" onerror="this.src='images/logo.png';"></td>
        <td data-label="Title"><strong>${escapeHTML(prod.title)}</strong></td>
        <td data-label="Category"><span class="badge-product" ${categoryClass}>${escapeHTML(categoryLabel)}</span></td>
        <td data-label="HS Code"><code>${escapeHTML(prod.hsCode)}</code></td>
        <td data-label="Grade Badge"><span style="font-size: 0.85rem; font-weight:600; color:var(--primary-blue);">${escapeHTML(prod.badge || '-')}</span></td>
        <td data-label="Action" style="text-align: center;">
          <button class="btn-table-action delete btn-delete-product" data-index="${index}" title="Remove Product">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      `;
      adminProductTableBody.appendChild(row);
    });

    // Delete Product event handlers
    const deleteProductBtnList = adminProductTableBody.querySelectorAll('.btn-delete-product');
    deleteProductBtnList.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
        const confirmDelete = confirm(`Are you sure you want to delete "${products[targetIdx].title}"? This action will remove it live from your website catalog immediately.`);
        if (confirmDelete) {
          const targetProd = products[targetIdx];
          if (db && targetProd && targetProd.id) {
            db.collection('products').doc(targetProd.id).delete();
          }
          products.splice(targetIdx, 1);
          saveProducts();
          loadDatabase();
          showToast("Product deleted successfully", "warning");
        }
      });
    });
  };

  // Product form submission handler
  if (adminProductForm) {
    adminProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('prodTitle').value.trim();
      const hsCode = document.getElementById('prodHsCode').value.trim();
      let category = document.getElementById('prodCategory').value;
      if (category === 'custom' && prodCategoryCustom) {
        category = prodCategoryCustom.value.trim();
      }
      const badge = document.getElementById('prodBadge').value.trim();
      const description = document.getElementById('prodDescription').value.trim();

      let image = prodImageSelect ? prodImageSelect.value : '';

      try {
        // Resolve cover image choice
        if (image === 'custom' && prodImageCustom) {
          image = prodImageCustom.value.trim();
        } else if (image === 'upload' && prodImageFile && prodImageFile.files.length > 0) {
          showToast("Processing product image...", "info");
          image = await compressImage(prodImageFile.files[0]);
        }

        if (!title || !hsCode || !category || !image || !description) {
          showToast("Please fill all mandatory fields.", "warning");
          return;
        }

        // Collect up to 5 specifications
        const specs = [];
        for (let i = 1; i <= 5; i++) {
          const specName = document.getElementById(`prodSpecName${i}`).value.trim();
          const specVal = document.getElementById(`prodSpecVal${i}`).value.trim();
          if (specName && specVal) {
            specs.push({ name: specName, value: specVal });
          }
        }

        const newProduct = {
          id: "prod_" + Date.now(),
          title,
          hsCode,
          category,
          badge,
          image,
          description,
          specs
        };

        if (db) {
          db.collection('products').doc(newProduct.id).set(newProduct);
        }

        // Add to active products array
        products.push(newProduct);
        saveProducts();

        // Reset form inputs
        adminProductForm.reset();
        if (prodImageCustom) prodImageCustom.style.display = 'none';
        if (prodImageFile) prodImageFile.style.display = 'none';
        if (prodCategoryCustom) prodCategoryCustom.style.display = 'none';

        // Re-load and update views
        loadDatabase();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        showToast("Product catalog updated successfully!", "success");

      } catch (err) {
        console.error(err);
        showToast("Error processing upload file. Please try again.", "warning");
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
