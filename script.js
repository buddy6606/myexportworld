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

  // --- 1B. Multi-Language (i18n) Translation Engine (21 Languages) ---
  const translations = {
    en: {
      nav_home: "Home", nav_products: "Products", nav_certificates: "Certificates", nav_about: "About Us", nav_contact: "Contact Us", nav_blog: "Blog", nav_inquiry: "Inquiry Form", nav_cta: "Inquire Now",
      hero_badge: "Govt. Recognized Export Partner", hero_title: "Spices Exporter from India: Premium Bulk Spices & Agricultural Products", hero_desc: "MY EXPORT WORLD is a premier indian spices exporter and agricultural products exporter india. As a trusted bulk spices supplier india, we connect local farms with international trade hubs.", hero_btn_explore: "Explore Commodities", hero_btn_contact: "Talk to Founders",
      stat_quality: "Quality Assured", stat_dispatch: "Client Dispatch Desk", stat_traceable: "Traceable Sourcing", stat_categories: "Commodity Categories"
    },
    gu: {
      nav_home: "હોમ", nav_products: "ઉત્પાદનો", nav_certificates: "પ્રમાણપત્રો", nav_about: "અમારા વિશે", nav_contact: "સંપર્ક કરો", nav_blog: "બ્લોગ", nav_inquiry: "પૂછપરછ ફોર્મ", nav_cta: "હવે પૂછપરછ કરો",
      hero_badge: "સરકાર માન્ય નિકાસ ભાગીદાર", hero_title: "ભારતમાંથી મસાલા નિકાસકાર: પ્રીમિયમ બલ્ક મસાલા અને કૃષિ ઉત્પાદનો", hero_desc: "MY EXPORT WORLD એ ભારતીય મસાલા નિકાસકાર અને કૃષિ ઉત્પાદનો નિકાસકાર છે. અમે વિશ્વસનીય બલ્ક મસાલા સપ્લાયર તરીકે સ્થાનિક ખેતરોને આંતરરાષ્ટ્રીય વેપાર હબ સાથે જોડીએ છીએ.", hero_btn_explore: "ઉત્પાદનો જુઓ", hero_btn_contact: "સ્થાપકો સાથે વાત કરો",
      stat_quality: "ગુણવત્તા ની ખાતરી", stat_dispatch: "ક્લાયન્ટ ડિસ્પેચ ડેસ્ક", stat_traceable: "ટ્રેસેબલ સોર્સિંગ", stat_categories: "ઉત્પાદન શ્રેણીઓ"
    },
    hi: {
      nav_home: "होम", nav_products: "उत्पाद", nav_certificates: "प्रमाणपत्र", nav_about: "हमारे बारे में", nav_contact: "संपर्क करें", nav_blog: "ब्लॉग", nav_inquiry: "पूछताछ फॉर्म", nav_cta: "अभी पूछताछ करें",
      hero_badge: "सरकारी मान्यता प्राप्त निर्यात भागीदार", hero_title: "भारत से मसाला निर्यातक: प्रीमियम थोक मसाले और कृषि उत्पाद", hero_desc: "MY EXPORT WORLD एक प्रमुख भारतीय मसाला निर्यातक और कृषि उत्पाद निर्यातक है। एक विश्वसनीय थोक मसाला आपूर्तिकर्ता के रूप में, हम स्थानीय खेतों को अंतरराष्ट्रीय व्यापार केंद्रों से जोड़ते हैं।", hero_btn_explore: "उत्पाद देखें", hero_btn_contact: "संस्थापकों से बात करें",
      stat_quality: "गुणवत्ता सुनिश्चित", stat_dispatch: "ग्राहक डिस्पैच डेस्क", stat_traceable: "ट्रेसयोग्य सोर्सिंग", stat_categories: "उत्पाद श्रेणियां"
    },
    zh: {
      nav_home: "首页", nav_products: "产品中心", nav_certificates: "资质认证", nav_about: "关于我们", nav_contact: "联系我们", nav_blog: "行业资讯", nav_inquiry: "询价表格", nav_cta: "立即询价",
      hero_badge: "政府认证出口合作伙伴", hero_title: "印度香料出口商：优质散装香料和农产品", hero_desc: "MY EXPORT WORLD 是首屈一指的印度香料和农产品出口商。作为值得信赖的散装香料供应商，我们将当地农场与国际贸易枢纽连接起来。", hero_btn_explore: "探索商品", hero_btn_contact: "联系创始人",
      stat_quality: "质量保证", stat_dispatch: "客户服务台", stat_traceable: "可追溯来源", stat_categories: "商品类别"
    },
    es: {
      nav_home: "Inicio", nav_products: "Productos", nav_certificates: "Certificados", nav_about: "Nosotros", nav_contact: "Contacto", nav_blog: "Blog", nav_inquiry: "Formulario", nav_cta: "Consultar Ahora",
      hero_badge: "Socio de Exportación Reconocido", hero_title: "Exportador de Especias de la India: Especias a Granel y Productos Agrícolas", hero_desc: "MY EXPORT WORLD es un exportador líder de especias indias y productos agrícolas. Conectamos granjas locales con centros de comercio internacional.", hero_btn_explore: "Explorar Productos", hero_btn_contact: "Hablar con Fundadores",
      stat_quality: "Calidad Garantizada", stat_dispatch: "Despacho al Cliente", stat_traceable: "Origen Rastreable", stat_categories: "Categorías de Productos"
    },
    de: {
      nav_home: "Startseite", nav_products: "Produkte", nav_certificates: "Zertifikate", nav_about: "Über Uns", nav_contact: "Kontakt", nav_blog: "Blog", nav_inquiry: "Anfrageformular", nav_cta: "Jetzt Anfragen",
      hero_badge: "Staatlich Anerkannter Exportpartner", hero_title: "Gewürzexporteur aus Indien: Premium-Gewürze & Agrarprodukte", hero_desc: "MY EXPORT WORLD ist ein führender indischer Gewürz- und Agrarprodukte-Exporteur. Wir verbinden lokale Bauernhöfe mit internationalen Handelszentren.", hero_btn_explore: "Produkte Entdecken", hero_btn_contact: "Gründer Kontaktieren",
      stat_quality: "Garantierte Qualität", stat_dispatch: "Kundenservice-Desk", stat_traceable: "Rückverfolgbare Herkunft", stat_categories: "Produktkategorien"
    },
    ar: {
      nav_home: "الرئيسية", nav_products: "المنتجات", nav_certificates: "الشهادات", nav_about: "من نحن", nav_contact: "اتصل بنا", nav_blog: "المدونة", nav_inquiry: "نموذج الاستفسار", nav_cta: "استفسر الآن",
      hero_badge: "شريك تصدير معتمد حكومياً", hero_title: "مصدر التوابل من الهند: توابل بالجملة ومنتجات زراعية فاخرة", hero_desc: "MY EXPORT WORLD هي شركة رائدة في تصدير التوابل والمنتجات الزراعية الهندية. نربط المزارع المحلية بمراكز التجارة الدولية.", hero_btn_explore: "استكشف المنتجات", hero_btn_contact: "تحدث مع المؤسسين",
      stat_quality: "جودة مضمونة", stat_dispatch: "مكتب خدمة العملاء", stat_traceable: "مصدر قابل للتتبع", stat_categories: "فئات المنتجات"
    },
    fr: {
      nav_home: "Accueil", nav_products: "Produits", nav_certificates: "Certificats", nav_about: "À Propos", nav_contact: "Contact", nav_blog: "Blog", nav_inquiry: "Demande de Devis", nav_cta: "Demander un Devis",
      hero_badge: "Partenaire d'Exportation Agréé", hero_title: "Exportateur d'Épices d'Inde: Épices en Vrac & Produits Agricoles", hero_desc: "MY EXPORT WORLD est un exportateur majeur d'épices et de produits agricoles indiens. Nous relions les fermes locales aux marchés internationaux.", hero_btn_explore: "Explorer les Produits", hero_btn_contact: "Contacter les Fondateurs",
      stat_quality: "Qualité Garantie", stat_dispatch: "Service Expédition Client", stat_traceable: "Traçabilité Garantie", stat_categories: "Catégories de Produits"
    },
    ru: {
      nav_home: "Главная", nav_products: "Продукция", nav_certificates: "Сертификаты", nav_about: "О нас", nav_contact: "Контакты", nav_blog: "Блог", nav_inquiry: "Запрос цены", nav_cta: "Запросить цену",
      hero_badge: "Официальный экспортный партнер", hero_title: "Экспортер специй из Индии: Специи оптом и сельхозпродукция", hero_desc: "MY EXPORT WORLD — ведущий экспортер индийских специй и сельскохозяйственной продукции. Мы соединяем фермы с мировыми торговыми хабами.", hero_btn_explore: "Каталог товаров", hero_btn_contact: "Связаться с основателями",
      stat_quality: "Гарантия качества", stat_dispatch: "Служба отправки клиентов", stat_traceable: "Отслеживаемое происхождение", stat_categories: "Категории товаров"
    },
    pt: {
      nav_home: "Início", nav_products: "Produtos", nav_certificates: "Certificados", nav_about: "Sobre Nós", nav_contact: "Contato", nav_blog: "Blog", nav_inquiry: "Formulário", nav_cta: "Consultar Agora",
      hero_badge: "Parceiro de Exportação Reconhecido", hero_title: "Exportador de Especiarias da Índia: Especiarias a Granel e Produtos Agrícolas", hero_desc: "MY EXPORT WORLD é um importante exportador de especiarias indianas e produtos agrícolas, conectando fazendas locais a centros comerciais globais.", hero_btn_explore: "Explorar Produtos", hero_btn_contact: "Falar com Fundadores",
      stat_quality: "Qualidade Garantida", stat_dispatch: "Atendimento ao Cliente", stat_traceable: "Origem Rastreável", stat_categories: "Categorias de Produtos"
    },
    ja: {
      nav_home: "ホーム", nav_products: "製品一覧", nav_certificates: "認定資格", nav_about: "会社概要", nav_contact: "お問い合わせ", nav_blog: "ブログ", nav_inquiry: "見積もりフォーム", nav_cta: "今すぐ見積もり",
      hero_badge: "政府認定輸出パートナー", hero_title: "インドのスパイス輸出業者：高品質バルクスパイス＆農産物", hero_desc: "MY EXPORT WORLDは、インドの高品質スパイスおよび農产物の主要輸出業者です。地域の農場と世界の貿易ハブを直接結びつけます。", hero_btn_explore: "商品を見る", hero_btn_contact: "創業者に相談",
      stat_quality: "品質保証", stat_dispatch: "カスタマーデスク", stat_traceable: "トレーサビリティ保証", stat_categories: "商品カテゴリー"
    },
    ko: {
      nav_home: "홈", nav_products: "제품 목록", nav_certificates: "인증서", nav_about: "회사 소개", nav_contact: "문의하기", nav_blog: "블로그", nav_inquiry: "견적 요청", nav_cta: "지금 견적 요청",
      hero_badge: "정부 공인 수출 파트너", hero_title: "인도 향신료 수출업체: 프리미엄 대량 향신료 및 농산물", hero_desc: "MY EXPORT WORLD는 인도의 주요 향신료 및 농산물 수출업체입니다. 현지 농장과 글로벌 무역 허브를 직접 연결합니다.", hero_btn_explore: "상품 탐색", hero_btn_contact: "창립자 문의",
      stat_quality: "품질 보증", stat_dispatch: "고객 출하 데스크", stat_traceable: "추적 가능한 추적", stat_categories: "상품 카테고리"
    },
    id: {
      nav_home: "Beranda", nav_products: "Produk", nav_certificates: "Sertifikat", nav_about: "Tentang Kami", nav_contact: "Kontak", nav_blog: "Blog", nav_inquiry: "Formulir Pertanyaan", nav_cta: "Tanyakan Sekarang",
      hero_badge: "Mitra Ekspor Resmi Pemerintah", hero_title: "Eksportir Rempah India: Rempah Curah Premium & Produk Pertanian", hero_desc: "MY EXPORT WORLD adalah eksportir utama rempah-rempah dan produk pertanian India. Kami menghubungkan petani lokal dengan pusat perdagangan dunia.", hero_btn_explore: "Jelajahi Produk", hero_btn_contact: "Hubungi Pendiri",
      stat_quality: "Kualitas Terjamin", stat_dispatch: "Layanan Pelanggan", stat_traceable: "Sumber Terlacak", stat_categories: "Kategori Komoditas"
    },
    tr: {
      nav_home: "Ana Sayfa", nav_products: "Ürünler", nav_certificates: "Sertifikalar", nav_about: "Hakkımızda", nav_contact: "İletişim", nav_blog: "Blog", nav_inquiry: "Teklif Formu", nav_cta: "Şimdi Teklif Alın",
      hero_badge: "Devlet Onaylı İhracat Ortağı", hero_title: "Hindistan Baharat İhracatçısı: Toptan Baharat ve Tarım Ürünleri", hero_desc: "MY EXPORT WORLD, Hindistan'ın önde gelen baharat ve tarım ürünleri ihracatçısıdır. Yerel çiftlikleri uluslararası ticaret merkezleriyle buluşturuyoruz.", hero_btn_explore: "Ürünleri İnceleyin", hero_btn_contact: "Kurucularla Görüşün",
      stat_quality: "Kalite Garantili", stat_dispatch: "Müşteri Sevkiyat Masası", stat_traceable: "Izlenebilir Kaynak", stat_categories: "Ürün Kategorileri"
    },
    vi: {
      nav_home: "Trang chủ", nav_products: "Sản phẩm", nav_certificates: "Chứng nhận", nav_about: "Giới thiệu", nav_contact: "Liên hệ", nav_blog: "Blog", nav_inquiry: "Mẫu yêu cầu", nav_cta: "Yêu cầu báo giá",
      hero_badge: "Đối tác xuất khẩu được chứng nhận", hero_title: "Nhà xuất khẩu gia vị Ấn Độ: Gia vị sỉ & Nông sản cao cấp", hero_desc: "MY EXPORT WORLD là nhà xuất khẩu gia vị và nông sản hàng đầu Ấn Độ, kết nối các trang trại địa phương với trung tâm thương mại quốc tế.", hero_btn_explore: "Khám phá sản phẩm", hero_btn_contact: "Nói chuyện với nhà sáng lập",
      stat_quality: "Đảm bảo chất lượng", stat_dispatch: "Bàn giao hàng khách hàng", stat_traceable: "Nguồn gốc rõ ràng", stat_categories: "Danh mục sản phẩm"
    },
    th: {
      nav_home: "หน้าแรก", nav_products: "สินค้า", nav_certificates: "ใบรับรอง", nav_about: "เกี่ยวกับเรา", nav_contact: "ติดต่อเรา", nav_blog: "บล็อก", nav_inquiry: "แบบฟอร์มสอบถาม", nav_cta: "สอบถามตอนนี้",
      hero_badge: "พันธมิตรส่งออกที่ได้รับการรับรองจากรัฐบาล", hero_title: "ผู้ส่งออกเครื่องเทศจากอินเดีย: เครื่องเทศราคาส่งและสินค้าเกษตรพรีเมียม", hero_desc: "MY EXPORT WORLD เป็นผู้ส่งออกเครื่องเทศและสินค้าเกษตรชั้นนำของอินเดีย เชื่อมโยงฟาร์มท้องถิ่นเข้ากับศูนย์กลางการค้าระหว่างประเทศ", hero_btn_explore: "สำรวจสินค้า", hero_btn_contact: "พูดคุยกับผู้ก่อตั้ง",
      stat_quality: "รับประกันคุณภาพ", stat_dispatch: "ฝ่ายจัดส่งสินค้า", stat_traceable: "ตรวจสอบแหล่งที่มาได้", stat_categories: "หมวดหมู่สินค้า"
    },
    it: {
      nav_home: "Home", nav_products: "Prodotti", nav_certificates: "Certificati", nav_about: "Chi Siamo", nav_contact: "Contatti", nav_blog: "Blog", nav_inquiry: "Modulo Richiesta", nav_cta: "Richiedi Ora",
      hero_badge: "Partner di Esportazione Riconosciuto", hero_title: "Esportatore di Spezie dall'India: Spezie Sfuse & Prodotti Agricoli Premium", hero_desc: "MY EXPORT WORLD è un principale esportatore di spezie e prodotti agricoli indiani. Colleghiamo le fattorie locali ai mercati internazionali.", hero_btn_explore: "Esplora Prodotti", hero_btn_contact: "Parla con i Fondatori",
      stat_quality: "Qualità Garantita", stat_dispatch: "Servizio Spedizioni Clienti", stat_traceable: "Origine Tracciabile", stat_categories: "Categorie Prodotti"
    },
    nl: {
      nav_home: "Home", nav_products: "Producten", nav_certificates: "Certificaten", nav_about: "Over Ons", nav_contact: "Contact", nav_blog: "Blog", nav_inquiry: "Offerteformulier", nav_cta: "Nu Offerte Vragen",
      hero_badge: "Erkend Exportpartner", hero_title: "Specerijen Exporteur uit India: Premium Specerijen & Landbouwproducten", hero_desc: "MY EXPORT WORLD is een vooraanstaande Indiase exporteur van specerijen en landbouwproducten. Wij verbinden lokale boerderijen met internationale handelscentra.", hero_btn_explore: "Ontdek Producten", hero_btn_contact: "Spreek met Oprichters",
      stat_quality: "Gegarandeerde Kwaliteit", stat_dispatch: "Klantenservice Desk", stat_traceable: "Traceerbare Herkomst", stat_categories: "Productcategorieën"
    },
    pl: {
      nav_home: "Strona Główna", nav_products: "Produkty", nav_certificates: "Certyfikaty", nav_about: "O nas", nav_contact: "Kontakt", nav_blog: "Blog", nav_inquiry: "Formularz Zapytania", nav_cta: "Zapytaj Teraz",
      hero_badge: "Oficjalny Partner Eksportowy", hero_title: "Eksporter Przypraw z Indii: Przyprawy Hurtowe i Produkty Rolne", hero_desc: "MY EXPORT WORLD to вiodący eksporter indyjskich przypraw i produktów rolnych. Łączymy lokalne gospodarstwa z międzynarodowymi centrami handlowymi.", hero_btn_explore: "Zobacz Produkty", hero_btn_contact: "Porozmawiaj z Założycielami",
      stat_quality: "Gwarancja Jakości", stat_dispatch: "Dział Wysyłki Klienta", stat_traceable: "Identyfikowalne Pochodzenie", stat_categories: "Kategorie Towarów"
    },
    sv: {
      nav_home: "Hem", nav_products: "Produkter", nav_certificates: "Certifikat", nav_about: "Om Oss", nav_contact: "Kontakt", nav_blog: "Blogg", nav_inquiry: "Förfrågan", nav_cta: "Begär Offert Nu",
      hero_badge: "Godkänd Exportpartner", hero_title: "Kryddexportör från Indien: Premium Kryddor i Partihandel & Jordbruksprodukter", hero_desc: "MY EXPORT WORLD är en ledande indisk exportör av kryddor och jordbruksprodukter. Vi kopplar samman lokala jordbruk med internationella handelscentrum.", hero_btn_explore: "Utforska Produkter", hero_btn_contact: "Prata med Grundarna",
      stat_quality: "Garanterad Kvalitet", stat_dispatch: "Kundleveransavdelning", stat_traceable: "Spårbar Härkomst", stat_categories: "Produktkategorier"
    },
    bn: {
      nav_home: "হোম", nav_products: "পণ্যসমূহ", nav_certificates: "সনদপত্র", nav_about: "আমাদের সম্পর্কে", nav_contact: "যোগাযোগ", nav_blog: "ব্লগ", nav_inquiry: "অনুসন্ধান ফরম", nav_cta: "এখনই অনুসন্ধান করুন",
      hero_badge: "সরকারি স্বীকৃত রফতানি অংশীদার", hero_title: "ভারত থেকে মসলা রফতানিকারক: প্রিমিয়াম বাল্ক মসলা ও কৃষি পণ্য", hero_desc: "MY EXPORT WORLD হলো ভারতের অন্যতম প্রধান মসলা ও কৃষি পণ্য রফতানিকারক প্রতিষ্ঠান। আমরা স্থানীয় খামারগুলোকে আন্তর্জাতিক বাণিজ্য হাবের সাথে যুক্ত করি।", hero_btn_explore: "পণ্যসমূহ দেখুন", hero_btn_contact: "প্রতিষ্ঠাতাদের সাথে কথা বলুন",
      stat_quality: "গুণমান নিশ্চিত", stat_dispatch: "ক্লায়েন্ট ডিসপ্যাচ ডেস্কেল", stat_traceable: "ট্রেসযোগ্য সোর্সিং", stat_categories: "পণ্য বিভাগসমূহ"
    }
  };

  const setLanguage = (lang) => {
    const selectedLang = translations[lang] ? lang : 'en';
    const dict = translations[selectedLang];
    
    if (selectedLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.removeAttribute('dir');
      document.documentElement.setAttribute('lang', selectedLang);
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict && dict[key]) {
        if (key === 'hero_title') {
          const titleText = dict[key];
          const colonIdx = titleText.indexOf(':') !== -1 ? titleText.indexOf(':') : titleText.indexOf('：');
          if (colonIdx !== -1) {
            const part1 = titleText.substring(0, colonIdx + 1);
            const part2 = titleText.substring(colonIdx + 1);
            el.innerHTML = `${part1} <span>${part2.trim()}</span>`;
          } else {
            el.innerHTML = titleText;
          }
        } else if (key.endsWith('_text') || key.endsWith('_desc') || key.includes('html')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    localStorage.setItem('myexportworld_lang', selectedLang);
    const langSelect = document.getElementById('langSelect');
    if (langSelect && langSelect.value !== selectedLang) {
      langSelect.value = selectedLang;
    }
  };

  const initLanguage = () => {
    const savedLang = localStorage.getItem('myexportworld_lang') || 'en';
    setLanguage(savedLang);

    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
      });
    }
  };

  initLanguage();

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
    try {
      const stored = localStorage.getItem('myexportworld_inquiries');
      if (stored) {
        inquiries = JSON.parse(stored);
      } else {
        // Seed with sample data so it's not empty initially
        inquiries = [...sampleInquiries];
        localStorage.setItem('myexportworld_inquiries', JSON.stringify(inquiries));
      }
    } catch (e) {
      console.error("Failed to parse inquiries from localStorage", e);
      inquiries = [...sampleInquiries];
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
    },
    {
      id: "seed_spices_demand",
      timestamp: "2026-06-23 10:00:00",
      dateFormatted: "June 23, 2026",
      title: "Sourcing Indian Spices: A Comprehensive Guide to Quality Grades, Global Demand, and Compliance",
      category: "Customs & Compliance",
      coverImage: "images/blog_spices.png",
      readTime: "5 min read",
      teaserSummary: "Analyze international demand, quality grades, chemical benchmarks (curcumin, volatile oil), and import compliance checklist for Indian spices sourcing.",
      bodyContent: `<p>India has earned its historical title as the 'Spices Bowl of the World' due to its diverse agro-climatic zones producing unmatched flavor profiles and aromatic compounds. Today, international food corporations, retail chains, and spice processors look to partner with a trusted <strong>spices exporter from india</strong> to secure steady raw material streams. Sourcing high-quality agricultural commodities requires navigating complex international quality grades, phytosanitary requirements, and import safety laws.</p>
      
      <h3>Surging Global Demand for Indian Spices</h3>
      <p>As food trends lean toward natural ingredients, clean labels, and functional wellness, the international market relies heavily on a professional <strong>indian spices exporter</strong>. The global supply chain demands high purity and strict technical specifications for key commodities:</p>
      <ul>
        <li><strong>Turmeric (Curcuma longa):</strong> Renowned for high curcumin levels. Sourcing from a verified <strong>turmeric exporter from india</strong> or a <strong>turmeric supplier india</strong> ensures premium active ingredient concentrations for culinary and medicinal uses.</li>
        <li><strong>Cumin Seeds (Jeera):</strong> Highly valued in Gulf nations, Europe, and the Americas. B2B buyers look for a reliable <strong>cumin seeds exporter india</strong> or a dedicated <strong>cumin supplier india</strong> to obtain seeds with high volatile oil content.</li>
        <li><strong>Dry Red Chilli:</strong> From Guntur and other key regions, offering different heat intensities (SHU) and bright red color parameters, typically supplied by a specialized <strong>dry red chilli exporter</strong> or <strong>red chilli exporter india</strong>.</li>
        <li><strong>Psyllium Husk (Isabgol):</strong> A critical dietary fiber for baking, nutraceutical, and digestive wellness products, exported globally by a licensed <strong>psyllium husk exporter india</strong>.</li>
      </ul>
      
      <h3>Critical Quality Standards & Export Grading</h3>
      <p>To pass customs clearance in strict regulatory jurisdictions like the European Union (EFSA) or the United States (FDA), bulk shipments must adhere to precise physical and chemical grading benchmarks. Partnering with a <strong>wholesale spices exporter</strong> or a <strong>bulk spices supplier india</strong> requires verifying these key limits:</p>
      
      <table>
        <thead>
          <tr>
            <th>Commodity Category</th>
            <th>Key Quality Benchmark</th>
            <th>Export Standard / Grade Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Turmeric Rhizomes</strong></td>
            <td>Curcumin Value & Polish Grade</td>
            <td>Min 3.5% Curcumin, Double Polished Whole Fingers</td>
          </tr>
          <tr>
            <td><strong>Cumin Seeds (Whole)</strong></td>
            <td>Purity & Sortex Quality</td>
            <td>Min 99.5% Purity (Singapore/Europe/Gulf Cleaned)</td>
          </tr>
          <tr>
            <td><strong>Whole Red Chilli</strong></td>
            <td>Pungency & ASTA Color</td>
            <td>Stemless pods, SHU heat range matching buyer specifications</td>
          </tr>
          <tr>
            <td><strong>Psyllium Husk</strong></td>
            <td>Swell Volume & Purity</td>
            <td>98% - 99% purity levels with high water retention properties</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Regulatory Compliance and Export Logistics Checklist</h3>
      <p>Exporting spices from India involves mandatory compliance frameworks to ensure container consignments clear destination ports without costly demurrage. Buyers should confirm the following documentation with their exporters:</p>
      <ol>
        <li><strong>Spices Board of India Inspections:</strong> Validates batch quality grades, registers authorized exporters, and issues Certificate of Export.</li>
        <li><strong>Phytosanitary Certification:</strong> Mandatory biological clearance ensuring cargo has undergone proper fumigation (Methyl Bromide/Phosphine) to eliminate pests.</li>
        <li><strong>Laboratory Vetting:</strong> Third-party tests (such as SGS or Geo-Chem) certifying that moisture is below 9% (to prevent aflatoxin) and pesticide residues comply with MRLs.</li>
      </ol>
      
      <p>By establishing rigorous quality assurance, mechanical cleaning protocols, and complete export documentation, importing agricultural raw materials from India becomes a seamless and profitable process for global sourcing divisions.</p>`
    },
    {
      id: "seed_turmeric_demand",
      timestamp: "2026-06-23 09:30:00",
      dateFormatted: "June 23, 2026",
      title: "Indian Turmeric: Analyzing Global Demand, Curcumin Quality Standards, and Export Compliance",
      category: "Customs & Compliance",
      coverImage: "images/blog_turmeric.png",
      readTime: "5 min read",
      teaserSummary: "Analyze international demand, active curcumin grades (Nizamabad, Erode, Alleppey), laboratory checks, and import biosecurity parameters for Indian Turmeric sourcing.",
      bodyContent: `<p>Known as the 'Golden Spice', Indian Turmeric (scientifically named <em>Curcuma longa</em>) is highly sought after across global markets. Renowned for its rich yellow-orange pigment, distinct warm aroma, and high concentration of the active compound curcumin, Indian turmeric represents more than 75% of global turmeric exports. Whether for pharmaceutical applications, functional foods, or culinary spice blending, partnering with a trusted <strong>turmeric exporter from india</strong> or a verified <strong>turmeric supplier india</strong> is essential for sourcing high-grade bulk consignments.</p>
      
      <h3>The Surging Global Demand for Indian Turmeric</h3>
      <p>In recent years, the international demand for turmeric has shifted from simple culinary uses to high-value nutraceutical and cosmetic extraction. Markets in North America, Europe, and the Asia-Pacific region are placing bulk orders with an established <strong>spices exporter from india</strong> or a general <strong>indian spices exporter</strong> due to the unique characteristics of Indian turmeric origins:</p>
      <ul>
        <li><strong>Nizamabad & Sangli Fingers:</strong> Famous for their hard, clean structure, standard curcumin content, and suitability for grinding into fine culinary powder.</li>
        <li><strong>Erode & Salem Curcuma:</strong> Highly regarded for their intense golden color and strong aromatic oil concentrations.</li>
        <li><strong>High-Curcumin Alleppey Turmeric:</strong> The gold standard in international markets, exhibiting curcumin levels exceeding 4.5% to 6.0%, critical for extraction industries.</li>
      </ul>
      
      <h3>Key Quality Grades and Standards for Export Vetting</h3>
      <p>When sourcing from a <strong>wholesale spices exporter</strong> or a <strong>bulk spices supplier india</strong>, turmeric is classified based on active chemical values and physical characteristics. Understanding these trade parameters ensures your shipments comply with strict food safety frameworks:</p>
      
      <table>
        <thead>
          <tr>
            <th>Turmeric Specification Grade</th>
            <th>Curcumin Content</th>
            <th>Physical Characteristics</th>
            <th>Ideal Industry Application</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Double Polished Fingers (Grade-A)</strong></td>
            <td>3.5% to 5.0%</td>
            <td>Machine cleaned, polished twice, free from visual dirt, high density.</td>
            <td>Culinary packaging, grinding mills, and bulk retail spice mixes.</td>
          </tr>
          <tr>
            <td><strong>Single Polished Fingers</strong></td>
            <td>3.0% to 4.0%</td>
            <td>Polished once, slight rough skin, completely dry.</td>
            <td>Commercial blending and extraction of oleoresins.</td>
          </tr>
          <tr>
            <td><strong>Turmeric Bulbs / Rounds</strong></td>
            <td>3.0% to 4.5%</td>
            <td>Short, rounded shape, clean skin, extremely hard center.</td>
            <td>High-yield industrial grinding and colorant extraction.</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Essential Regulatory Compliance and Import Security</h3>
      <p>To avoid customs rejections at destination ports, importers must ensure that their cargo matches strict biosecurity standards. Leading Indian exporters follow a rigorous checklist:</p>
      <ol>
        <li><strong>Pesticide Residue Limits:</strong> Compliance with the Maximum Residue Limits (MRLs) set by importing food authorities (like the FDA or EFSA) is mandatory.</li>
        <li><strong>Moisture Control:</strong> Maintaining moisture below 9% to 10% prevents mold formation and guarantees that curcumin values remain stable during ocean transit.</li>
        <li><strong>Phytosanitary & Fumigation Clearance:</strong> Biosecurity certification proving that the consignment has been chemically treated (with Methyl Bromide or Phosphine) to eliminate quarantine pests.</li>
      </ol>
      
      <p>By establishing direct sourcing pipelines from farms to sorting facilities, modern exporters ensure that whole turmeric fingers and ground turmeric powder maintain their high potency, culinary value, and chemical integrity throughout the global shipping journey.</p>`
    },
    {
      id: "seed_cumin_demand",
      timestamp: "2026-06-23 09:00:00",
      dateFormatted: "June 23, 2026",
      title: "Sourcing Premium Cumin Seeds: Global Demand, Quality Grades, and Export Regulations",
      category: "Customs & Compliance",
      coverImage: "images/blog_cumin.png",
      readTime: "5 min read",
      teaserSummary: "Analyze international demand, quality grades (Singapore, Europe, Gulf), Sortex cleaning, pesticide limits, and import compliance for Indian Cumin (Jeera) sourcing.",
      bodyContent: `<p>Known as one of the most essential commodities in the international spice trade, Cumin (scientifically named <em>Cuminum cyminum</em>) or <strong>Jeera</strong> is prized globally for its warm, earthy aroma and culinary versatility. As food safety norms tighten across Europe, North America, and the Middle East, understanding the key quality grades, processing specifications, and trade regulations is crucial for anyone engaging with a <strong>cumin seeds exporter india</strong> or a general <strong>indian spices exporter</strong>.</p>
      
      <h3>The Surge in Global Demand for Cumin</h3>
      <p>India produces over 70% of the world's cumin, with Gujarat and Rajasthan serving as the primary cultivation hubs. Sourcing from a reliable <strong>cumin supplier india</strong> has become vital for international food processors, spice blenders, and pharmaceutical manufacturers. The demand is divided into two primary formats:</p>
      <ul>
        <li><strong>Whole Cumin Seeds (Jeera):</strong> Procured in bulk for roasting, oil extraction, and direct spice packaging.</li>
        <li><strong>Ground Cumin Powder:</strong> Widely used in spice mixes, curry powders, and seasoning blends, typically sourced from a certified <strong>cumin powder exporter india</strong>.</li>
      </ul>
      
      <h3>Critical Quality Grades and Sourcing Standards</h3>
      <p>When dealing with a <strong>wholesale spices exporter</strong> or a <strong>bulk spices supplier india</strong>, the cumin seeds are classified by purity levels and processing methods. Sourcing the right grade depends on the buyer's regional import regulations and end-use application:</p>
      
      <table>
        <thead>
          <tr>
            <th>Quality Grade</th>
            <th>Purity Level</th>
            <th>Key Characteristics</th>
            <th>Typical Market Application</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Singapore Quality</strong></td>
            <td>99% Purity</td>
            <td>Machine cleaned, minor extraneous matter allowed.</td>
            <td>Standard grade for general spice grinding and blending.</td>
          </tr>
          <tr>
            <td><strong>Europe Quality</strong></td>
            <td>99.5% Purity</td>
            <td>Machine cleaned and Sortex-purified. Lower moisture limit.</td>
            <td>Strict compliance with EU pesticide and residue regulations.</td>
          </tr>
          <tr>
            <td><strong>Gulf Quality</strong></td>
            <td>99.9% Purity</td>
            <td>Double Sortex cleaned, bold uniform seeds, zero dust.</td>
            <td>Premium retail packing and direct culinary application in Middle East.</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Essential Import/Export Regulations and Certifications</h3>
      <p>For smooth port clearance, a top-tier <strong>jeera exporter india</strong> must ensure compliance with international food safety frameworks. Sourcing advisors recommend verifying the following documents before container sealing:</p>
      <ol>
        <li><strong>Phytosanitary Certification:</strong> Issued by the Ministry of Agriculture in India, certifying that the cargo has been fumigated (using Methyl Bromide or Phosphine) and is free from pests.</li>
        <li><strong>Sortex Cleaning and Moisture Control:</strong> Cumin cargo must maintain moisture levels below 9% to prevent mold formation and aflatoxin development during long ocean transits.</li>
        <li><strong>Pesticide Residue Analysis:</strong> Vetted reports ensuring compliance with the maximum residue limits (MRLs) set by the destination country's food safety agency (such as FDA or EFSA).</li>
      </ol>
      
      <p>By prioritizing stringent quality control, Sortex purity, and transparent trade documentation, sourcing cumin seeds or cumin powder from India can be a highly successful commercial venture. Partnering with experienced operators who understand the technicalities of export logistics ensures that your bulk consignments arrive on time and fully compliant with local import standards.</p>`
    },
    {
      id: "seed_psyllium_demand",
      timestamp: "2026-06-23 08:30:00",
      dateFormatted: "June 23, 2026",
      title: "Psyllium Husk: Global Demand for Dietary Fiber, Purity Grades, and Export Quality Standards",
      category: "Customs & Compliance",
      coverImage: "images/blog_psyllium.png",
      readTime: "5 min read",
      teaserSummary: "Examine the rising global request for psyllium soluble fiber, technical purity levels (95%-99%), swell parameters, and FDA/EU food safety compliance checks.",
      bodyContent: `<p>Psyllium Husk (scientifically known as <em>Plantago ovata</em>) or <strong>Isabgol</strong> is a natural, soluble dietary fiber widely used in the global food, baking, and pharmaceutical industries. India is the undisputed world leader in psyllium production, accounting for over 85% of total global exports. As consumer preference shifts toward gut health, high-fiber diets, and organic gluten-free food options, sourcing from a verified <strong>psyllium husk exporter india</strong> or a reliable <strong>psyllium husk supplier india</strong> is highly strategic for B2B buyers.</p>
      
      <h3>Surging Global Demand for Psyllium Husk and Powder</h3>
      <p>Importers in North America, Europe, and the Asia-Pacific region place large bulk orders with a professional <strong>spices exporter from india</strong> or a general <strong>indian spices exporter</strong>. The application of psyllium spans multiple sectors:</p>
      <ul>
        <li><strong>Gluten-Free Baking:</strong> Psyllium husk binds moisture, serving as a critical texture enhancer in gluten-free breads, pastries, and health foods.</li>
        <li><strong>Nutraceuticals & Dietary Supplements:</strong> Highly valued as a natural laxative and colon cleanser due to its exceptional swelling properties.</li>
        <li><strong>Animal Feed:</strong> Used in specialized equine and pet foods to promote digestive health.</li>
      </ul>
      
      <h3>Key Quality Grades and Swelling Indexes</h3>
      <p>When procuring from a <strong>wholesale spices exporter</strong> or a <strong>bulk spices supplier india</strong>, psyllium is graded based on purity level (percentage of actual husk relative to seed debris and light stuff) and swelling volume:</p>
      
      <table>
        <thead>
          <tr>
            <th>Purity Grade</th>
            <th>Swelling Volume</th>
            <th>Physical Characteristics</th>
            <th>Typical Application</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>99% Purity (Super Premium)</strong></td>
            <td>Min 40 ml / gram</td>
            <td>Pure white-cream color, minimal heavy seeds or insect debris.</td>
            <td>Pharmaceutical tablets, capsule formulations, and premium health drinks.</td>
          </tr>
          <tr>
            <td><strong>98% Purity</strong></td>
            <td>Min 35 ml / gram</td>
            <td>Slightly off-white, very low extraneous matter.</td>
            <td>Baking industry, bulk food processing, and fiber fortification.</td>
          </tr>
          <tr>
            <td><strong>95% Purity (Industrial Grade)</strong></td>
            <td>Min 30 ml / gram</td>
            <td>Slightly darker shade, containing minor seed coat fragments.</td>
            <td>Animal feed formulations and general industrial binding applications.</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Regulatory Compliance and Export Quality Controls</h3>
      <p>To navigate customs clearance seamlessly, a top-tier <strong>isabgol exporter india</strong> must adhere to rigorous biosecurity parameters during processing and container stuffing:</p>
      <ol>
        <li><strong>Extraneous Matter & Heavy Metals:</strong> Strict testing is conducted to ensure zero contamination from soil, sand, or heavy metals during field harvest and milling.</li>
        <li><strong>Fumigation and Pest Control:</strong> Consignments must undergo methyl bromide or phosphine fumigation, backed by a Phytosanitary Certificate.</li>
        <li><strong>Moisture & Microbiology:</strong> Moisture must be kept below 10% with zero Salmonella or E. coli counts, verified by ISO 22000 and HACCP certified lab checks.</li>
      </ol>
      
      <p>By implementing advanced sorting, gravity separation, and pneumatic cleaning technologies, modern Indian processors deliver high-purity psyllium husk and powder that reliably comply with global import laws and strict sanitary regulations.</p>`
    },
    {
      id: "seed_chilli_demand",
      timestamp: "2026-06-23 08:00:00",
      dateFormatted: "June 23, 2026",
      title: "Dry Red Chilli Sourcing: Analyzing Global Market Demand, ASTA Color, and Export Compliance",
      category: "Customs & Compliance",
      coverImage: "images/blog_chilli.png",
      readTime: "5 min read",
      teaserSummary: "Analyze global red chilli varieties (Guntur Teja, Sannam, Byadagi), pungency parameters, ASTA color values, mycotoxin controls, and customs standards.",
      bodyContent: `<p>Dry Red Chilli (scientifically classified as <em>Capsicum annuum</em>) is one of the most widely traded spice commodities in the world. As the largest producer, consumer, and exporter of chillies globally, India—particularly the Guntur region in Andhra Pradesh—serves as the main sourcing hub. Sourcing chillies requires deep understanding of varieties, heat levels (measured in Scoville Heat Units, SHU), color values (measured by ASTA standards), and stringent food safety protocols enforced by a professional <strong>red chilli exporter india</strong> or a general <strong>spices exporter from india</strong>.</p>
      
      <h3>Surging Global Demand for Dry Red Chilli</h3>
      <p>From hot sauces and spice blends to food color extraction (paprika oleoresin) and pharmaceutical capsicums, the demand for Indian chillies is immense. B2B buyers regularly collaborate with a trusted <strong>dry red chilli exporter</strong> or a <strong>bulk spices supplier india</strong> to procure specific varieties:</p>
      <ul>
        <li><strong>Teja (S17) Chilli:</strong> Highly popular in East Asia and South America for its intense heat level (75,000 to 100,000 SHU) and pungent aroma.</li>
        <li><strong>Sannam (S4) Chilli:</strong> A medium-heat variety (18,000 to 22,000 SHU) widely used in general spice grinding and culinary mixes.</li>
        <li><strong>Byadagi Chilli:</strong> Famous for its deep red color value (150 to 200 ASTA) and low pungency, highly preferred for natural food coloring extraction.</li>
      </ul>
      
      <h3>Key Quality Grades and Standards for Sourcing</h3>
      <p>For smooth processing and global trade, a professional <strong>wholesale spices exporter</strong> classifies chillies based on moisture content, stem presence, and physical defects:</p>
      
      <table>
        <thead>
          <tr>
            <th>Quality Grade</th>
            <th>Pungency (SHU)</th>
            <th>Color Value (ASTA)</th>
            <th>Key Features</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Stemless Grade-A</strong></td>
            <td>Varies by variety</td>
            <td>Min 100 ASTA</td>
            <td>Completely stemless, sun-dried, zero mold, low broken percentage.</td>
          </tr>
          <tr>
            <td><strong>With Stem Grade-A</strong></td>
            <td>Varies by variety</td>
            <td>Min 95 ASTA</td>
            <td>Intact stems, uniform size, bright red skin, thoroughly cleaned.</td>
          </tr>
          <tr>
            <td><strong>Red Chilli Powder</strong></td>
            <td>Varies by blend</td>
            <td>Standardized</td>
            <td>Hygienically milled, Sortex-cleaned before grinding, 100% pure.</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Aflatoxin, Ochratoxin, and Customs compliance</h3>
      <p>Dry red chilli is a sensitive agro-commodity. For successful port clearance in strict markets like the USA and the European Union, a certified <strong>red chilli powder exporter india</strong> or general exporter must verify these parameters:</p>
      <ol>
        <li><strong>Mycotoxin Controls:</strong> Strict checks for Aflatoxin and Ochratoxin-A are mandatory, as moisture levels must be maintained below 11% to prevent fungal development.</li>
        <li><strong>Sudan Dye Testing:</strong> Consignments must be certified free from unauthorized chemical dyes (like Sudan I-IV) through accredited laboratory testing.</li>
        <li><strong>Phytosanitary Certification:</strong> Official bio-clearance and fumigation certificate stating the cargo is free from storage pests.</li>
      </ol>
      
      <p>By choosing direct farm-sourcing, mechanical washing, drying, and Sortex cleaning, Indian chilli exporters consistently meet the technical specifications and safety standards required by global spice mills and food manufacturers.</p>`
    }
  ];

  const loadBlogPosts = () => {
    if (db) {
      db.collection('blog_posts').onSnapshot(snapshot => {
        if (!snapshot.empty) {
          blogPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          localStorage.setItem('myexportworld_blog_posts', JSON.stringify(blogPosts));
        } else {
          sampleBlogPosts.forEach(sp => {
            db.collection('blog_posts').doc(sp.id).set(sp);
          });
        }
      }, err => {
        console.error("Firestore blog posts sync error:", err);
      });
    }
    try {
      const stored = localStorage.getItem('myexportworld_blog_posts');
      if (stored) {
        blogPosts = JSON.parse(stored);
      } else {
        blogPosts = [...sampleBlogPosts];
      }
    } catch (e) {
      console.error("Failed to parse blog posts from localStorage", e);
      blogPosts = [...sampleBlogPosts];
    }
  };

  loadBlogPosts();

  // --- 8. Dynamic Products Database & Loader ---
  let products = [];

  const sampleProducts = [
    {
      id: "prod_turmeric_finger",
      title: "Dried Turmeric Finger",
      hsCode: "09103020",
      category: "turmeric",
      badge: "Double Polished",
      image: "images/turmeric_finger.jpg",
      description: "Premium quality dried whole turmeric rhizomes, double polished to yield bright yellow-gold skin. Sourced from Nizamabad and Sangli as a premier dried turmeric finger exporter and global turmeric supplier india.",
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
      description: "Pure ground turmeric spice, processed under hygienic conditions to preserve active aroma and essential oils. Managed by a leading turmeric powder exporter india.",
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
      description: "Harvested fresh organic turmeric rhizomes, raw and unprocessed. Exported worldwide by a trusted fresh turmeric exporter india and premium turmeric exporter from india.",
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
      description: "Premium whole seed husks of Plantago ovata, serving as an exceptional soluble dietary fiber. Sourced by a verified psyllium husk exporter india and trusted psyllium husk supplier india.",
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
      description: "Fine ground psyllium husk powder, ideal for dietary supplements. Exported globally by a recognized psyllium husk powder exporter and leading isabgol exporter india.",
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
      description: "Premium grade machine-cleaned and Sortex-purified dry cumin seeds. Sourced directly by a leading cumin seeds exporter india and premier cumin supplier india.",
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
      description: "Pure ground cumin spice, milled under cold processing. Supplied worldwide by a certified cumin powder exporter india and premium jeera exporter india.",
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
      description: "Premium sun-dried stemless red chilli pods, featuring deep color and pungency rating. Exported globally by a leading dry red chilli exporter and red chilli exporter india.",
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
      description: "Finely ground premium red chilli powder, delivering consistent heat. Sourced and processed by a dedicated red chilli powder exporter india.",
      specs: [
        { name: "Pungency", value: "60,000 - 80,000 SHU" },
        { name: "Origin", value: "Guntur, India" },
        { name: "Packing", value: "20 / 25 kg PP Bags" },
        { name: "Purity", value: "100% Natural" },
        { name: "Moisture", value: "Max 9.5%" }
      ]
    }
  ];

  const loadProducts = () => {
    if (db) {
      db.collection('products').onSnapshot(snapshot => {
        if (!snapshot.empty) {
          products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          localStorage.setItem('myexportworld_products', JSON.stringify(products));
          renderPublicProducts();
          populateProductDropdown();
          populateProductCategorySelect();
        } else {
          sampleProducts.forEach(p => {
            db.collection('products').doc(p.id).set(p);
          });
        }
      }, err => {
        console.error("Firestore products sync error:", err);
      });
    }
    try {
      const stored = localStorage.getItem('myexportworld_products');
      if (stored) {
        products = JSON.parse(stored);
      } else {
        products = [...sampleProducts];
      }
    } catch (e) {
      console.error("Failed to parse products from localStorage", e);
      products = [...sampleProducts];
    }
  };

  loadProducts();


  // Populate Specific Product Dropdown in Inquiry Form with dynamic category filtering
  const populateProductDropdown = (categoryFilter = 'all') => {
    const productDropdown = document.getElementById('productSelected');
    if (!productDropdown) return;

    productDropdown.innerHTML = '<option value="" disabled selected>-- Select a Commodity --</option>';

    products.forEach(prod => {
      let match = false;
      if (categoryFilter === 'all') {
        match = true;
      } else if (categoryFilter.toLowerCase() === 'spices') {
        match = ['turmeric', 'cumin', 'chilli'].includes(prod.category.toLowerCase());
      } else {
        match = prod.category.toLowerCase() === categoryFilter.toLowerCase();
      }

      if (match) {
        const opt = document.createElement('option');
        opt.value = `${prod.title} (${prod.hsCode})`;
        opt.textContent = `${prod.title} (${prod.hsCode})`;
        productDropdown.appendChild(opt);
      }
    });

    const fallbackOpt = document.createElement('option');
    fallbackOpt.value = "Other Agricultural Inquiry";
    fallbackOpt.textContent = "Other / Bulk Spices Inquiry";
    productDropdown.appendChild(fallbackOpt);
  };

  populateProductDropdown();

  // Dynamically populate Product Category select inside Sourcing center
  const populateProductCategorySelect = () => {
    const productCategorySelect = document.getElementById('productCategory');
    if (!productCategorySelect) return;

    // Get unique categories from active products list
    const categories = new Set();
    categories.add("Spices");
    categories.add("Psyllium");

    products.forEach(p => {
      const cat = p.category;
      if (cat && !['turmeric', 'cumin', 'chilli', 'psyllium'].includes(cat.toLowerCase())) {
        const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
        categories.add(formattedCat);
      }
    });

    productCategorySelect.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      if (cat === "Spices") {
        opt.value = "Spices";
        opt.textContent = "Spices (Turmeric, Cumin, Chilli)";
      } else if (cat === "Psyllium") {
        opt.value = "Psyllium";
        opt.textContent = "Dietary Fiber (Psyllium)";
      } else {
        opt.value = cat;
        opt.textContent = cat;
      }
      productCategorySelect.appendChild(opt);
    });
  };

  populateProductCategorySelect();

  // Filter products when category changes
  const productCategorySelect = document.getElementById('productCategory');
  if (productCategorySelect) {
    productCategorySelect.addEventListener('change', (e) => {
      populateProductDropdown(e.target.value);
    });
  }

  // Render Public Catalog Items
  const renderPublicProducts = () => {
    const gridsWrapper = document.querySelector('#catalogLevel3 .grids-wrapper');
    if (!gridsWrapper || !gridTurmeric || !gridPsyllium || !gridCumin || !gridChilli) return;

    gridTurmeric.innerHTML = '';
    gridPsyllium.innerHTML = '';
    gridCumin.innerHTML = '';
    gridChilli.innerHTML = '';

    // Remove any previously generated custom category sections
    document.querySelectorAll('.commodity-section-custom').forEach(el => el.remove());

    products.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'product-card';

      let specRowsHTML = '';
      if (prod.specs && Array.isArray(prod.specs)) {
        prod.specs.forEach(spec => {
          if (spec.name && spec.value) {
            specRowsHTML += `
              <li class="spec-row">
                <span class="spec-name">${escapeHTML(spec.name)}</span>
                <span class="spec-value">${escapeHTML(spec.value)}</span>
              </li>
            `;
          }
        });
      }

      card.innerHTML = `
        <div class="product-img-wrapper">
          <img src="${escapeHTML(prod.image)}" alt="${escapeHTML(prod.title)}" class="product-img" onerror="this.src='images/logo.png';">
          ${prod.badge ? `<span class="product-badge">${escapeHTML(prod.badge)}</span>` : ''}
        </div>
        <div class="product-info">
          <span class="hs-code-tag">HS CODE: ${escapeHTML(prod.hsCode)}</span>
          <h3 class="product-title">${escapeHTML(prod.title)}</h3>
          <p class="product-desc">${escapeHTML(prod.description)}</p>
          <ul class="product-specs">
            ${specRowsHTML}
          </ul>
          <div class="product-actions">
            <button class="btn btn-primary quick-inquire-btn" data-product="${escapeHTML(prod.title)} (${escapeHTML(prod.hsCode)})" aria-label="Inquire now from ${escapeHTML(prod.title)} supplier and exporter">Inquire Now</button>
          </div>
        </div>
      `;

      if (prod.category === 'turmeric') {
        gridTurmeric.appendChild(card);
      } else if (prod.category === 'psyllium') {
        gridPsyllium.appendChild(card);
      } else if (prod.category === 'cumin') {
        gridCumin.appendChild(card);
      } else if (prod.category === 'chilli') {
        gridChilli.appendChild(card);
      } else {
        // Render Custom Commodity Group Grid
        const categoryId = `section_custom_${prod.category.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        let customSection = document.getElementById(categoryId);
        if (!customSection) {
          customSection = document.createElement('div');
          customSection.className = 'commodity-section commodity-section-custom';
          customSection.id = categoryId;

          const catTitle = prod.category.charAt(0).toUpperCase() + prod.category.slice(1);
          customSection.innerHTML = `
            <h3 class="commodity-section-title" style="font-size: 2rem; color: var(--primary-blue-dark); margin-bottom: 1.5rem; font-weight: 800; border-bottom: 2px solid rgba(214, 28, 44, 0.1); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.8rem;">
              <i class="fa-solid fa-cubes-stacked" style="color: var(--accent-yellow);"></i> ${escapeHTML(catTitle)}
            </h3>
            <div class="sub-products-grid" id="grid_${categoryId}"></div>
          `;
          gridsWrapper.appendChild(customSection);
        }
        const customGrid = document.getElementById(`grid_${categoryId}`);
        if (customGrid) {
          customGrid.appendChild(card);
        }
      }
    });

    const checkEmptyGrid = (grid) => {
      if (grid.children.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: span 3; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-light); width: 100%;">
            <i class="fa-solid fa-wheat-awn" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1.5rem;"></i>
            <h4 style="font-size: 1.4rem; color: var(--primary-blue-dark); margin-bottom: 0.5rem;">No commodities in this category</h4>
            <p style="color: var(--text-muted);">Please check back later or contact us directly.</p>
          </div>
        `;
      }
    };
    checkEmptyGrid(gridTurmeric);
    checkEmptyGrid(gridPsyllium);
    checkEmptyGrid(gridCumin);
    checkEmptyGrid(gridChilli);
  };

  // --- 8. Dynamic Products Nested Catalog Explorer ---
  const level1 = document.getElementById('catalogLevel1');
  const level2 = document.getElementById('catalogLevel2');
  const level3 = document.getElementById('catalogLevel3');
  const gridTurmeric = document.getElementById('gridTurmeric');
  const gridPsyllium = document.getElementById('gridPsyllium');
  const gridCumin = document.getElementById('gridCumin');
  const gridChilli = document.getElementById('gridChilli');

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

  const navigateToLevel3 = () => {
    if (!level1 || !level2 || !level3) return;
    // Show L3 directly, Hide L1 & L2
    level1.classList.add('hidden');
    level2.classList.add('hidden');
    level3.classList.remove('hidden');

    if (breadHome) breadHome.classList.remove('active');
    if (breadCategory) {
      breadCategory.textContent = "Spices";
      breadCategory.classList.remove('hidden');
      breadCategory.classList.add('active');
    }
    if (breadCommoditySep) breadCommoditySep.classList.add('hidden');
    if (breadCommodity) breadCommodity.classList.add('hidden');

    // Show all commodity sections
    const sectionTurmeric = document.getElementById('sectionTurmeric');
    const sectionPsyllium = document.getElementById('sectionPsyllium');
    const sectionCumin = document.getElementById('sectionCumin');
    const sectionChilli = document.getElementById('sectionChilli');

    if (sectionTurmeric) sectionTurmeric.classList.remove('hidden');
    if (sectionPsyllium) sectionPsyllium.classList.remove('hidden');
    if (sectionCumin) sectionCumin.classList.remove('hidden');
    if (sectionChilli) sectionChilli.classList.remove('hidden');
    document.querySelectorAll('.commodity-section-custom').forEach(sec => sec.classList.remove('hidden'));

    // Render active products dynamically
    renderPublicProducts();
  };

  // Event bindings
  // L1 Card/Action clicks
  const btnExploreAgri = document.getElementById('btnExploreAgri');
  const categoryCardAgri = document.getElementById('categoryCardAgri');
  if (btnExploreAgri) {
    btnExploreAgri.addEventListener('click', () => {
      window.location.hash = 'product-details';
    });
  }
  if (categoryCardAgri) {
    categoryCardAgri.addEventListener('click', (e) => {
      // Prevent double trigger if action button was clicked directly
      if (e.target.id !== 'btnExploreAgri' && !e.target.closest('#btnExploreAgri')) {
        window.location.hash = 'product-details';
      }
    });
  }

  // L3 Back clicks
  const btnBackToLevel2 = document.getElementById('btnBackToLevel2');
  if (btnBackToLevel2) {
    btnBackToLevel2.addEventListener('click', () => {
      window.location.hash = 'product';
    });
  }

  // Breadcrumb action binds
  if (breadHome) {
    breadHome.addEventListener('click', () => {
      window.location.hash = 'product';
    });
  }
  if (breadCategory) {
    breadCategory.addEventListener('click', () => {
      window.location.hash = 'product';
    });
  }

  // Set default view state on load
  navigateToLevel1();

  // --- 2. Custom SPA Routing ---
  const navLinks = document.querySelectorAll('.nav-link, .footer-link-item, [data-view]');
  const views = document.querySelectorAll('.view-section');
  const mobileNavMenu = document.getElementById('navMenu');
  const mobileNavToggle = document.getElementById('mobileNavToggle');

  // Dynamic SEO Tag Updates
  const updateSEOTags = (viewName, customData = null) => {
    let title = "MY EXPORT WORLD : Spices Exporter from India";
    let description = "MY EXPORT WORLD is a premier indian spices exporter and bulk spices supplier india. Sourcing and exporting agricultural products exporter india worldwide including organic turmeric, cumin seeds, Guntur red chilli, and psyllium husk.";
    let keywords = "spices exporter from india, indian spices exporter, agricultural products exporter india, bulk spices supplier india, food ingredients exporter india, international spice supplier, gujarat export company, wholesale spices exporter, turmeric exporter from india, turmeric supplier india, psyllium husk exporter india, psyllium husk supplier india, isabgol exporter india, cumin seeds exporter india, cumin supplier india, cumin powder exporter india, jeera exporter india, red chilli exporter india, red chilli powder exporter india, dry red chilli exporter, Yash Patel, Mansi Patel";
    let url = "https://www.myexportworld.com/";

    if (viewName === 'product') {
      title = "Premium Agricultural Commodities & Spices Catalog | MY EXPORT WORLD";
      description = "Explore our premium export-quality agricultural catalog. Premium dried turmeric fingers, organic turmeric powder, high-purity psyllium husk, aromatic cumin seeds, and stemless red chilli.";
      keywords = "organic turmeric, psyllium husk, isabgol, cumin seeds, Guntur red chilli, HS codes, spice grades, agricultural catalog, export quality";
      url = "https://www.myexportworld.com/#product";
    } else if (viewName === 'product-details') {
      title = "Export-Grade Spices & Psyllium Sourcing Specifications | MY EXPORT WORLD";
      description = "Detailed technical specifications, purity indices, and packaging standards for our turmeric, psyllium husk, cumin seeds, and dry red chilli exports.";
      keywords = "spices specs, curcumin content, swell index, Sortex purity, packing sizes, import standards";
      url = "https://www.myexportworld.com/#product-details";
    } else if (viewName === 'about') {
      title = "About Our Sourcing Excellence & Founding Partners | MY EXPORT WORLD";
      description = "Meet our co-founders Mr. Yash Patel (AI & ML technologist) and Ms. Mansi Patel (operations standardizer). Discover our mission, corporate vision, and strategic farm-to-port supply synergies.";
      keywords = "Yash Patel, Mansi Patel, agricultural leadership, direct sourcing India, tech-driven supply chain, corporate vision, quality standardization";
      url = "https://www.myexportworld.com/#about";
    } else if (viewName === 'certificates') {
      title = "Certifications & Government Trade Compliance | MY EXPORT WORLD";
      description = "Official credentials and merchant exporter compliance of MY EXPORT WORLD. Registered under APEDA, Spices Board of India, FSSAI, DGFT Import Export Code (IEC), ISO 22000, and HACCP.";
      keywords = "APEDA certificate, Spices Board India, FSSAI license, Import Export Code, ISO 22000, HACCP, trade compliance, customs clearance";
      url = "https://www.myexportworld.com/#certificates";
    } else if (viewName === 'blog') {
      title = "Daily Export Insights & Sourcing Intelligence Blog | MY EXPORT WORLD";
      description = "Stay updated with real-time operational knowledge, customs procedures, ocean freight shipping guidelines, letters of credit (L/C), and international trade laws.";
      keywords = "ocean freight, FCL LCL, Letter of Credit, trade finance, customs documentation, phytosanitary certificate, export guide";
      url = "https://www.myexportworld.com/#blog";
    } else if (viewName === 'blog-article') {
      if (customData) {
        title = `${customData.title} | MY EXPORT WORLD Blog`;
        description = customData.teaserSummary || description;
        url = `https://www.myexportworld.com/#blog-article`;
      } else {
        title = "Daily Export Insights & Sourcing Intelligence Blog | MY EXPORT WORLD";
        description = "Read our latest trade guides, letters of credit compliance, and shipping logistics logs.";
        url = "https://www.myexportworld.com/#blog-article";
      }
    } else if (viewName === 'contact') {
      title = "Contact Sourcing Desk & Partner Support | MY EXPORT WORLD";
      description = "Reach out to Mr. Yash Patel (Tech/Sourcing) or Ms. Mansi Patel (Operations/Logistics) for instant shipping logs, quotes, and contract support.";
      keywords = "contact spices exporter, trade desk Gandhinagar, email myexportworld, contact number, partnership inquiry";
      url = "https://www.myexportworld.com/#contact";
    } else if (viewName === 'inquiry') {
      title = "Request Quote & Live Sourcing Rate Card | MY EXPORT WORLD";
      description = "Submit your specific agricultural requirements or target pricing for spices, seeds, and psyllium husks to receive a secure corporate quote within 4 hours.";
      keywords = "request export quote, spice pricing, container quotes, bulk spices enquiry, custom declaration request";
      url = "https://www.myexportworld.com/#inquiry";
    }

    document.title = title;

    const setMetaTag = (selector, attributeName, value) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attributeName, value);
      } else {
        const head = document.head;
        if (selector.startsWith('meta[')) {
          const newMeta = document.createElement('meta');
          if (selector.includes('name=')) {
            const nameVal = selector.match(/name="([^"]+)"/)[1];
            newMeta.setAttribute('name', nameVal);
          } else if (selector.includes('property=')) {
            const propVal = selector.match(/property="([^"]+)"/)[1];
            newMeta.setAttribute('property', propVal);
          }
          newMeta.setAttribute(attributeName, value);
          head.appendChild(newMeta);
        }
      }
    };

    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[name="keywords"]', 'content', keywords);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', "https://www.myexportworld.com/");
    }

    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:url"]', 'content', url);

    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:url"]', 'content', url);
  };

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
      if (window.location.hash !== '#product-details') {
        navigateToLevel1();
      }
    }

    // Intercept navigation to blog view and ensure grid is shown (reader hidden)
    if (viewName === 'blog') {
      if (window.location.hash !== '#blog-article') {
        const blogGrid = document.getElementById('blogCardGrid');
        const blogSingleView = document.getElementById('blogSingleView');
        if (blogGrid) blogGrid.style.display = 'grid';
        if (blogSingleView) blogSingleView.style.display = 'none';
        renderBlogGrid('all');
      }
    }

    // Close mobile nav menu if open
    if (mobileNavMenu.classList.contains('open')) {
      mobileNavMenu.classList.remove('open');
      mobileNavToggle.classList.remove('active');
    }
  };

  // Hash-based routing handler
  const handleHashChange = () => {
    const hash = window.location.hash.substring(1) || 'home';
    const validViews = ['home', 'product', 'about', 'certificates', 'blog', 'contact', 'inquiry', 'product-details', 'blog-article'];
    if (validViews.includes(hash)) {
      if (hash === 'product-details') {
        switchView('product');
        navigateToLevel3();
        updateSEOTags('product-details');
      } else if (hash === 'blog-article') {
        switchView('blog');
        // Show the article reader if we have a cached post
        if (currentBlogPost && blogGrid && blogSingleView) {
          blogGrid.style.display = 'none';
          blogSingleView.style.display = 'block';
          updateSEOTags('blog-article', currentBlogPost);
        } else {
          updateSEOTags('blog-article');
        }
      } else {
        switchView(hash);
        updateSEOTags(hash);
      }
    } else {
      switchView('home');
      updateSEOTags('home');
    }
  };

  window.addEventListener('hashchange', handleHashChange);

  // Attach event listeners to all links with data-view attributes to update the URL hash
  const mainViews = ['home', 'product', 'about', 'certificates', 'blog', 'contact', 'inquiry'];
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      if (targetView) {
        const currentHash = window.location.hash.substring(1) || 'home';
        // If navigating from home to a main view, push (so back returns to home)
        // If navigating between main views, replace (so back still goes to home)
        if (currentHash === 'home' || currentHash === targetView) {
          window.location.hash = targetView;
        } else {
          history.replaceState(null, '', '#' + targetView);
          handleHashChange();
        }
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
  const productDropdown = document.getElementById('productSelected');

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-inquire-btn');
    if (btn) {
      const productName = btn.getAttribute('data-product');
      if (productDropdown && productName) {
        // Ensure option exists in dropdown, if not add it temporarily
        let optionExists = Array.from(productDropdown.options).some(opt => opt.value === productName);
        if (!optionExists) {
          const opt = document.createElement('option');
          opt.value = productName;
          opt.textContent = productName;
          productDropdown.appendChild(opt);
        }

        // Pre-fill dropdown
        productDropdown.value = productName;
        // Redirect to inquiry tab
        window.location.hash = 'inquiry';
        showToast(`Selected: ${productName}`, "success");
      }
    }
  });

  // --- 4. Inquiry Form Management ---
  const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwUb3FvQG3DCqDGuEsHMqtYJdcXVPbsUf1FRXMwZJerCdLwQ4K-h289hjcGsNsdfFnw7A/exec"; // Replace with your Google Apps Script URL
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

      if (db) {
        db.collection('inquiries').add(newInquiry).catch(err => console.error("Firestore inquiry error:", err));
      }

      // Send to Google Sheets and Telegram (if configured)
      if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        showToast("Submitting your inquiry...", "info");

        // Find submit button to show loading feedback
        const submitBtn = inquiryForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;
        }

        fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newInquiry)
        })
          .then(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
            }
            inquiryCardWrapper.style.display = 'none';
            inquirySuccessView.style.display = 'block';
            showToast("Inquiry submitted successfully!", "success");
          })
          .catch(err => {
            console.error("Submission Error:", err);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
            }
            showToast("Network error. Please try again.", "danger");
          });
      } else {
        // Fallback if URL is not configured (Demo mode)
        console.warn("GOOGLE_SHEETS_URL is not configured.");
        inquiryCardWrapper.style.display = 'none';
        inquirySuccessView.style.display = 'block';
        showToast("Inquiry logged successfully (Demo Mode)", "success");
      }

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

    // Fade and slide out after 2 seconds
    setTimeout(() => {
      toast.style.animation = "toastSlideOut 0.4s ease forwards";
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 2000);
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
  let currentBlogPost = null;
  const blogFilterButtons = document.querySelectorAll('.blog-filter-btn');



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

      card.addEventListener('click', () => {
        currentBlogPost = post;
        openArticleReader(post);
        window.location.hash = 'blog-article';
      });
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
          <h4>Procure Premium Spices & Husks</h4>
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
        window.location.hash = 'inquiry';
        showToast("Welcome to Sourcing Center", "success");
      });
    }

    // Scroll reader view smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back button event listener
  if (btnBlogBack) {
    btnBlogBack.addEventListener('click', () => {
      window.location.hash = 'blog';
    });
  }

  // Dynamically populate Category Filter Toolbar
  const renderBlogFilters = () => {
    const filterToolbar = document.querySelector('.blog-filter-toolbar');
    if (!filterToolbar) return;

    // Default categories
    const categories = new Set(["Logistics & Shipping", "Customs & Compliance", "Trade Finance & Laws"]);

    // Add custom ones from active blog posts
    blogPosts.forEach(post => {
      if (post.category && !categories.has(post.category)) {
        categories.add(post.category);
      }
    });

    filterToolbar.innerHTML = '<button class="blog-filter-btn active" data-blog-category="all">All Insights</button>';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'blog-filter-btn';
      btn.setAttribute('data-blog-category', cat);
      btn.textContent = cat;
      filterToolbar.appendChild(btn);
    });

    // Re-bind events to the new buttons
    const newFilterButtons = filterToolbar.querySelectorAll('.blog-filter-btn');
    newFilterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        newFilterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-blog-category');
        renderBlogGrid(cat);
      });
    });
  };

  // Set default view render of blog cards if view loads
  renderBlogFilters();
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

  // Prevent leaving the site directly without confirmation ONLY if form is dirty
  window.addEventListener('beforeunload', (e) => {
    const companyName = document.getElementById('companyName')?.value.trim() || '';
    const buyerName = document.getElementById('buyerName')?.value.trim() || '';
    const contactNo = document.getElementById('contactNo')?.value.trim() || '';
    const buyerEmail = document.getElementById('buyerEmail')?.value.trim() || '';
    const buyerAddress = document.getElementById('buyerAddress')?.value.trim() || '';
    const buyerQuestion = document.getElementById('buyerQuestion')?.value.trim() || '';

    // If any input is filled, warn the user
    if (companyName || buyerName || contactNo || buyerEmail || buyerAddress || buyerQuestion) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes in your inquiry form. Are you sure you want to leave?';
      return e.returnValue;
    }
  });



  // --- Logo Click Navigation ---
  const logoClick = document.getElementById('logoClick');
  if (logoClick) {
    logoClick.addEventListener('click', () => {
      window.location.hash = 'home';
    });
  }

  // Execute initial routing on load
  // Ensure #home is always the base entry in browser history
  // so pressing Back from any main view returns to Home
  if (!window.location.hash || window.location.hash === '#') {
    history.replaceState(null, '', '#home');
  }
  handleHashChange();

});
