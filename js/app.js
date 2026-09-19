/* =========================================================
   APP SHELL — header, footer, nav, favorites, toast, helpers
   ========================================================= */

const ICON = {
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
  msg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  bell: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`,
  user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
  menu: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="14" x2="21" y2="14"/><line x1="3" y1="21" x2="21" y2="21"/></svg>`,
  home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`,
};

const NAV_LINKS = [
  {href:"index.html", label:"Home"},
  {href:"categories.html", label:"Kateqoriyalar"},
  {href:"property.html", label:"Əmlak"},
  {href:"marketplace.html", label:"Marketplace"},
  {href:"equipment.html", label:"Texnika"},
  {href:"hotels.html", label:"Otellər"},
  {href:"jobs.html", label:"Vakansiyalar"},
  {href:"services.html", label:"Xidmətlər"},
  {href:"companies.html", label:"Şirkətlər"},
];

/* =========================================================
   CURRENCY — AZN is the stored base unit everywhere in mock
   data; the switcher only affects display formatting.
   Rates are illustrative reference points, not live market
   rates — refreshed occasionally, not real-time.
   ========================================================= */
const IC_RATES = {
  AZN: 1,
  USD: 1/1.7,
  EUR: 1/1.85,
  TRY: (1/1.7) * 34.2,
  GEL: (1/1.7) * 2.68,
  RUB: (1/1.7) * 92,
  GBP: 1/2.15,
};
const IC_CURRENCY_SYMBOL = { AZN: "₼", USD: "$", EUR: "€", TRY: "₺", GEL: "₾", RUB: "₽", GBP: "£" };
const IC_CURRENCY_LABEL = { AZN: "AZN — Azərbaycan manatı", USD: "USD — ABŞ dolları", EUR: "EUR — Avro", TRY: "TRY — Türk lirəsi", GEL: "GEL — Gürcü larisi", RUB: "RUB — Rusiya rublu", GBP: "GBP — İngilis funtu" };

function icGetCurrency(){ return localStorage.getItem("ic_currency") || "AZN"; }
function icSetCurrency(cur){
  localStorage.setItem("ic_currency", cur);
  window.dispatchEvent(new CustomEvent("ic-currency-changed"));
}
function icMoney(amountAZN, suffix=""){
  const cur = icGetCurrency();
  const val = Math.round((amountAZN || 0) * IC_RATES[cur]);
  return `${icPrice(val)} ${IC_CURRENCY_SYMBOL[cur]}${suffix}`;
}
function icPriceUnitSuffix(unit){
  if(!unit) return "";
  if(unit.includes("/ay")) return "/ay";
  if(unit.includes("/gün")) return "/gün";
  return "";
}
window.addEventListener("ic-currency-changed", ()=>{
  const sel = document.getElementById("currency-select");
  if(sel) sel.value = icGetCurrency();
  if(typeof window.icRerender === "function") window.icRerender();
});

/* =========================================================
   LOCATION PICKER — city > rayon > qəsəbə/kənd cascade,
   plus nearest metro and a manual street field.
   ========================================================= */
function icLocationPickerHTML(prefix){
  const cities = Object.keys(IC_LOCATION_TREE);
  return `
    <div class="filter-row" style="flex-direction:column;gap:8px;">
      <select id="${prefix}-city">${cities.map(c=>`<option>${c}</option>`).join("")}</select>
      <select id="${prefix}-district"></select>
      <select id="${prefix}-settlement"></select>
      <input type="text" id="${prefix}-street" placeholder="Küçə adı (manual)">
      <select id="${prefix}-metro"><option value="">Yaxın metro (istəyə bağlı)</option>${IC_METRO_STATIONS.map(m=>`<option>${m}</option>`).join("")}</select>
    </div>`;
}
function icWireLocationPicker(prefix){
  const citySel = document.getElementById(`${prefix}-city`);
  const distSel = document.getElementById(`${prefix}-district`);
  const settleSel = document.getElementById(`${prefix}-settlement`);
  if(!citySel) return;
  function fillDistricts(){
    const districts = Object.keys(IC_LOCATION_TREE[citySel.value] || {});
    distSel.innerHTML = districts.map(d=>`<option>${d}</option>`).join("");
    fillSettlements();
  }
  function fillSettlements(){
    const settlements = (IC_LOCATION_TREE[citySel.value] || {})[distSel.value] || [];
    settleSel.innerHTML = `<option value="">Qəsəbə/kənd seçin</option>` + settlements.map(s=>`<option>${s}</option>`).join("");
  }
  citySel.addEventListener("change", fillDistricts);
  distSel.addEventListener("change", fillSettlements);
  fillDistricts();
}
function icLocationPickerValue(prefix){
  return {
    city: document.getElementById(`${prefix}-city`)?.value || "",
    district: document.getElementById(`${prefix}-district`)?.value || "",
    settlement: document.getElementById(`${prefix}-settlement`)?.value || "",
    street: document.getElementById(`${prefix}-street`)?.value || "",
    metro: document.getElementById(`${prefix}-metro`)?.value || "",
  };
}

function icCurrentPage(){ return location.pathname.split("/").pop() || "index.html"; }

function icRenderHeader(){
  const el = document.getElementById("site-header");
  if(!el) return;
  const page = icCurrentPage();
  const navHtml = NAV_LINKS.map(l => `<a href="${l.href}" class="${l.href===page?'active':''}">${l.label}</a>`).join("");
  el.innerHTML = `
    <header class="site-header">
      <div class="container">
        <a href="index.html" class="brand">
          <span class="brand-mark">IC</span>
          <span>INDUSTRCONS<span class="brand-sub">MARKET PLACE</span></span>
        </a>
        <nav class="main-nav">${navHtml}</nav>
        <div class="header-search">
          ${ICON.search}
          <input type="text" id="global-search-input" placeholder="Nə axtarırsınız?" />
        </div>
        <div class="header-actions">
          <select id="currency-select" class="lang-select" title="Valyuta məzənnəsi">
            ${Object.keys(IC_RATES).map(c=>`<option value="${c}">${c} ${IC_CURRENCY_SYMBOL[c]}</option>`).join("")}
          </select>
          <a href="favorites.html" class="icon-btn" title="Favorites">${ICON.heart}</a>
          <a href="messages.html" class="icon-btn" title="Messages">${ICON.msg}</a>
          <a href="#" class="icon-btn" id="notif-btn" title="Notifications">${ICON.bell}<span class="badge-dot"></span></a>
          <a href="dashboard.html" class="btn btn-ghost" style="color:#fff;">${ICON.user} <span class="hide-sm">Login</span></a>
          <a href="post-listing.html" class="btn btn-primary btn-sm">+ Elan yerləşdir</a>
          <button class="hamburger" id="hamburger-btn">${ICON.menu}</button>
        </div>
      </div>
    </header>
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="backdrop" id="drawer-backdrop"></div>
      <div class="panel">
        <button class="close-drawer" id="drawer-close">&times;</button>
        <div style="clear:both;height:8px;"></div>
        ${NAV_LINKS.map(l=>`<a href="${l.href}">${l.label}</a>`).join("")}
        <a href="pricing.html">Qiymətlər</a>
        <a href="security.html">Təhlükəsizlik Mərkəzi</a>
        <a href="rules.html">Qaydalar</a>
        <a href="dashboard.html">Kabinetim</a>
      </div>
    </div>
    <nav class="mobile-bottom-nav">
      <a href="index.html" class="${page==='index.html'?'active':''}">${ICON.home}Home</a>
      <a href="search.html" class="${page==='search.html'?'active':''}">${ICON.search}Axtar</a>
      <a href="post-listing.html" class="fab">+</a>
      <a href="favorites.html" class="${page==='favorites.html'?'active':''}">${ICON.heart}Sevimli</a>
      <a href="dashboard.html" class="${page==='dashboard.html'?'active':''}">${ICON.user}Profil</a>
    </nav>
  `;

  const curSel = document.getElementById("currency-select");
  curSel.value = icGetCurrency();
  curSel.addEventListener("change", ()=> icSetCurrency(curSel.value));

  const hb = document.getElementById("hamburger-btn");
  const drawer = document.getElementById("mobile-drawer");
  hb && hb.addEventListener("click", ()=> drawer.classList.add("open"));
  document.getElementById("drawer-close").addEventListener("click", ()=> drawer.classList.remove("open"));
  document.getElementById("drawer-backdrop").addEventListener("click", ()=> drawer.classList.remove("open"));

  const searchInput = document.getElementById("global-search-input");
  searchInput && searchInput.addEventListener("keydown", (e)=>{
    if(e.key === "Enter" && searchInput.value.trim()){
      location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
    }
  });

  document.getElementById("notif-btn").addEventListener("click",(e)=>{
    e.preventDefault();
    icToast("Bildirişlər: Elanınız təsdiqləndi, yeni mesajınız var.", "success");
  });
}

function icRenderFooter(){
  const el = document.getElementById("site-footer");
  if(!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand" style="margin-bottom:12px;"><span class="brand-mark">IC</span><span>INDUSTRCONS<span class="brand-sub">MARKET PLACE</span></span></div>
            <p style="color:#9CA1AA;font-size:0.85rem;max-width:280px;">Əmlak, məhsul, texnika və xidmətləri bir platformada birləşdirən Azərbaycanın yeni nəsil bazarı.</p>
          </div>
          <div><h4>Kateqoriyalar</h4>
            <a href="categories.html">Bütün kateqoriyalar</a><a href="property.html">Əmlak</a><a href="marketplace.html">Marketplace</a><a href="equipment.html">Texnika</a><a href="jobs.html">Vakansiyalar</a><a href="services.html">Xidmətlər</a><a href="companies.html">Şirkətlər</a>
          </div>
          <div><h4>Platform</h4>
            <a href="pricing.html">Qiymətlər</a><a href="post-listing.html">Elan yerləşdir</a><a href="dashboard.html">Kabinetim</a><a href="search.html">Axtarış</a>
          </div>
          <div><h4>Təhlükəsizlik</h4>
            <a href="security.html">Təhlükəsizlik Mərkəzi</a><a href="rules.html">Qaydalar</a><a href="security.html#report">Şikayət et</a>
          </div>
          <div><h4>Hüquqi</h4>
            <a href="rules.html">İstifadə Şərtləri</a><a href="rules.html">Məxfilik Siyasəti</a><a href="rules.html">Cookie Siyasəti</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 IndustrCons Market Place. Bütün hüquqlar qorunur. Prototip versiya.</span>
          <div class="flex items-center gap-2">
            <span class="muted" style="font-size:0.78rem;">Powered by</span>
            <img src="assets/industrcons-logo.jpg" alt="IndustrCONS" style="height:26px;border-radius:3px;">
          </div>
          <select class="lang-select"><option>AZ</option><option>EN</option><option>RU</option></select>
        </div>
      </div>
    </footer>
  `;
}

/* ---------------- Toast ---------------- */
function icToast(msg, type=""){
  let region = document.getElementById("toast-region");
  if(!region){
    region = document.createElement("div");
    region.id = "toast-region";
    document.body.appendChild(region);
  }
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  region.appendChild(t);
  setTimeout(()=>{ t.style.opacity="0"; t.style.transition="opacity .3s"; setTimeout(()=>t.remove(),300); }, 3800);
}

/* ---------------- Favorites (localStorage) ---------------- */
function icGetFavorites(){ return JSON.parse(localStorage.getItem("ic_favorites") || "[]"); }
function icIsFavorite(id){ return icGetFavorites().includes(id); }
function icToggleFavorite(id, btnEl){
  let favs = icGetFavorites();
  if(favs.includes(id)){
    favs = favs.filter(f=>f!==id);
    icToast("Sevimlilərdən çıxarıldı");
  } else {
    favs.push(id);
    icToast("Sevimlilərə əlavə edildi", "success");
  }
  localStorage.setItem("ic_favorites", JSON.stringify(favs));
  if(btnEl) btnEl.classList.toggle("active", favs.includes(id));
}

/* ---------------- Formatting ---------------- */
function icPrice(n){ return new Intl.NumberFormat("az-AZ").format(n); }
function icTimeAgo(ts){
  const days = Math.floor((Date.now()-ts)/86400000);
  if(days<=0) return "Bu gün";
  if(days===1) return "Dünən";
  return `${days} gün əvvəl`;
}

/* ---------------- Card templates ---------------- */
function icListingCard(item){
  const isFav = icIsFavorite(item.id);
  let priceLine = "";
  let detailHref = "";
  let metaLine = "";
  let badgeExtra = "";

  if(item.kind === "property"){
    detailHref = `property-detail.html?id=${item.id}`;
    priceLine = icMoney(item.price, ` ${icPriceUnitSuffix(item.priceUnit)}`.trimEnd());
    metaLine = `${item.area} m²${item.rooms ? ` · ${item.rooms} otaq` : ""}`;
    badgeExtra = `<span class="tag ${item.deal==='Kirayə'||item.deal==='Günlük'?'tag-rent':'tag-new'}">${item.deal}</span>`;
  } else if(item.kind === "marketplace"){
    detailHref = `product-detail.html?id=${item.id}`;
    priceLine = icMoney(item.price);
    metaLine = item.category;
    badgeExtra = `<span class="tag ${item.status==='Yeni'?'tag-new':'tag-used'}">${item.status}</span>`;
  } else if(item.kind === "equipment"){
    detailHref = `product-detail.html?id=${item.id}`;
    priceLine = item.forSale ? icMoney(item.salePrice) : icMoney(item.rentPrice, " /gün");
    metaLine = `${item.year} · ${item.fuel}${item.drive ? " · "+item.drive : ""}`;
    badgeExtra = item.forRent ? `<span class="tag tag-rent">İcarə</span>` : `<span class="tag tag-new">Satılır</span>`;
  }

  return `
  <div class="card" data-id="${item.id}">
    <a href="${detailHref}" class="card-media">
      <img src="${item.images[0]}" alt="${item.title}" loading="lazy" />
      <div class="card-tags">
        ${item.premium ? '<span class="tag tag-premium">⭐ Premium</span>' : ''}
        ${badgeExtra}
      </div>
    </a>
    <button class="fav-btn ${isFav?'active':''}" data-fav-id="${item.id}" aria-label="Favorite">${ICON.heart}</button>
    <div class="card-body">
      <a href="${detailHref}"><div class="card-price">${priceLine}</div></a>
      <a href="${detailHref}"><div class="card-title">${item.title}</div></a>
      <div class="card-meta"><span>${metaLine}</span></div>
      <div class="card-loc">📍 ${item.location}</div>
      <div class="card-foot">
        <span class="seller-name">${item.seller.name}</span>
        ${item.seller.verified ? `<span class="verified-badge">${ICON.check} Verified</span>` : ''}
      </div>
    </div>
  </div>`;
}

function icRenderCards(containerId, items){
  const el = document.getElementById(containerId);
  if(!el) return;
  if(!items.length){
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><span class="cat-icon">🔍</span><h3>Nəticə tapılmadı</h3><p>Filtrlərinizi dəyişməyi cəhd edin.</p></div>`;
    return;
  }
  el.innerHTML = items.map(icListingCard).join("");
  el.querySelectorAll("[data-fav-id]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{ e.preventDefault(); icToggleFavorite(btn.dataset.favId, btn); });
  });
}

function icQueryParam(name){
  return new URLSearchParams(location.search).get(name);
}

document.addEventListener("DOMContentLoaded", ()=>{
  icRenderHeader();
  icRenderFooter();
  icInitScrollReveal();
});

/* =========================================================
   SLOW-MOTION REVEAL — subtle fade/rise-in as sections enter
   view. Add class="reveal" to any element to opt in.
   ========================================================= */
function icInitScrollReveal(){
  const els = document.querySelectorAll(".reveal, .card, .cat-card");
  if(!("IntersectionObserver" in window) || !els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add("in-view"); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  els.forEach((el,i)=>{
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i%8 * 45, 300)}ms`;
    io.observe(el);
  });
}

/* =========================================================
   AI-ASSIST (template-based simulation) — mirrors the fraud
   scanner: this is a frontend simulation only. In production
   swap the body for a call to POST /api/ai/generate-text with
   the same inputs.
   ========================================================= */
function icGenerateJobDescription({ title, category, exp, type }){
  title = title || "Vakansiya";
  category = category || "Ümumi";
  exp = exp || "Təcrübə tələb olunmur";
  type = type || "Tam ştat";
  return `${title} vəzifəsi üzrə komandamıza güclü namizəd axtarırıq.

Vəzifə öhdəlikləri:
— Gündəlik iş proseslərinin ${category.toLowerCase()} sahəsi üzrə keyfiyyətli icrası
— Komanda ilə əlaqəli işləmək və hesabatlılıq
— Təhlükəsizlik və keyfiyyət standartlarına riayət

Namizədə tələblər:
— Təcrübə: ${exp}
— Məsuliyyətli, komanda ilə işləmə bacarığı
— ${type} iş rejiminə uyğunluq

Təklif etdiklərimiz:
— Rəqabətqabiliyyətli əməkhaqqı
— Sabit iş şəraiti və inkişaf imkanı

Müraciət üçün CV-nizi göndərin.`;
}
function icGenerateListingDescription({ title, category, condition }){
  title = title || "Məhsul";
  category = category || "";
  condition = condition || "yaxşı";
  return `${title} satılır. Məhsul ${condition} vəziyyətdədir${category ? `, ${category.toLowerCase()} kateqoriyasına aiddir` : ""}. Ətraflı məlumat və baxış üçün satıcı ilə əlaqə saxlayın. Qiymət danışıq yolu ilə razılaşdırıla bilər.`;
}

/* =========================================================
   AI PRICE ANALYSIS (differentiator) — compares one listing's
   price against the average of similar-category listings.
   Frontend simulation using the mock dataset; production would
   call GET /api/ai/price-estimate?category=&area=&city=
   ========================================================= */
function icEstimateFairPrice(item, pool){
  const price = item.price ?? item.salePrice ?? 0;
  const peers = pool.filter(p => p.id !== item.id && p.category === item.category);
  if(!peers.length || !price) return null;
  const avg = peers.reduce((s,p)=> s + (p.price ?? p.salePrice ?? 0), 0) / peers.length;
  const diffPct = Math.round(((price - avg) / avg) * 100);
  let verdict = "orta bazar səviyyəsindədir";
  if(diffPct <= -12) verdict = "bazar ortalamasından nəzərəçarpacaq dərəcədə ucuzdur";
  else if(diffPct < -3) verdict = "bazar ortalamasından bir qədər ucuzdur";
  else if(diffPct > 12) verdict = "bazar ortalamasından nəzərəçarpacaq dərəcədə bahadır";
  else if(diffPct > 3) verdict = "bazar ortalamasından bir qədər bahadır";
  return { avg, diffPct, verdict, sampleSize: peers.length };
}

/* =========================================================
   CO-PILOT — floating assistant panel with canned, keyword-
   matched suggestions. Frontend simulation; production would
   wire the send button to POST /api/ai/copilot.
   ========================================================= */
function icRenderCopilot(context="listing"){
  if(document.getElementById("copilot-launcher")) return;
  const launcher = document.createElement("button");
  launcher.id = "copilot-launcher";
  launcher.className = "copilot-launcher";
  launcher.innerHTML = "🤖";
  launcher.title = "IndustrCons Co-Pilot";
  document.body.appendChild(launcher);

  const panel = document.createElement("div");
  panel.id = "copilot-panel";
  panel.className = "copilot-panel";
  panel.innerHTML = `
    <div class="copilot-head">
      <span>🤖 IndustrCons Co-Pilot</span>
      <button id="copilot-close">&times;</button>
    </div>
    <div class="copilot-body" id="copilot-body">
      <div class="copilot-msg bot">Salam! Elanınızı və ya vakansiyanızı daha güclü etmək üçün buradayam. Nə ilə köməklik edim?</div>
    </div>
    <div class="copilot-quick">
      <button data-q="qiymet">Qiyməti necə tənzimləyim?</button>
      <button data-q="tesvir">Təsviri yaxşılaşdır</button>
      <button data-q="foto">Şəkil məsləhəti</button>
    </div>
    <div class="copilot-input">
      <input type="text" id="copilot-text" placeholder="Sualınızı yazın...">
      <button id="copilot-send">➤</button>
    </div>
  `;
  document.body.appendChild(panel);

  const answers = {
    qiymet: "Oxşar elanlara baxın: qiymətinizi bölgədəki orta bazar dəyərinin ±10%-i aralığında saxlamaq daha çox baxış gətirir.",
    tesvir: "Təsvirdə ölçü, il, vəziyyət və çatdırılma şərtlərini konkret yazın — qısa və konkret elanlar daha çox etibar qazanır.",
    foto: "Gün işığında, fonu təmiz saxlayaraq minimum 4 şəkil əlavə edin — birinci şəkil ən aydın olmalıdır.",
  };
  function botReply(text){
    const body = document.getElementById("copilot-body");
    const div = document.createElement("div");
    div.className = "copilot-msg bot";
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  function userMsg(text){
    const body = document.getElementById("copilot-body");
    const div = document.createElement("div");
    div.className = "copilot-msg user";
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  launcher.addEventListener("click", ()=> panel.classList.toggle("open"));
  document.getElementById("copilot-close").addEventListener("click", ()=> panel.classList.remove("open"));
  panel.querySelectorAll(".copilot-quick button").forEach(b=>{
    b.addEventListener("click", ()=>{ userMsg(b.textContent); setTimeout(()=>botReply(answers[b.dataset.q]), 400); });
  });
  function send(){
    const input = document.getElementById("copilot-text");
    const val = input.value.trim();
    if(!val) return;
    userMsg(val);
    input.value = "";
    const lower = val.toLowerCase();
    let reply = "Bu barədə moderasiya komandamızla əlaqə saxlaya bilərsiniz. Ümumi tövsiyə: elanınızı konkret, düzgün kateqoriyalı və şəffaf qiymətli saxlayın.";
    if(lower.includes("qiymət")||lower.includes("qiymet")) reply = answers.qiymet;
    else if(lower.includes("şəkil")||lower.includes("foto")) reply = answers.foto;
    else if(lower.includes("təsvir")) reply = answers.tesvir;
    setTimeout(()=>botReply(reply), 400);
  }
  document.getElementById("copilot-send").addEventListener("click", send);
  document.getElementById("copilot-text").addEventListener("keydown",(e)=>{ if(e.key==="Enter") send(); });
}
