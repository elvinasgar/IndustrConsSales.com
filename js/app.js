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
  {href:"property.html", label:"Əmlak"},
  {href:"marketplace.html", label:"Marketplace"},
  {href:"equipment.html", label:"Texnika"},
  {href:"services.html", label:"Xidmətlər"},
  {href:"companies.html", label:"Şirkətlər"},
];

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
          <span>INDUSTRCONS<span class="brand-sub">MARKET</span></span>
        </a>
        <nav class="main-nav">${navHtml}</nav>
        <div class="header-search">
          ${ICON.search}
          <input type="text" id="global-search-input" placeholder="Nə axtarırsınız?" />
        </div>
        <div class="header-actions">
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
        <a href="companies.html">Şirkətlər</a>
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
            <div class="brand" style="margin-bottom:12px;"><span class="brand-mark">IC</span><span>INDUSTRCONS<span class="brand-sub">MARKET</span></span></div>
            <p style="color:#9CA1AA;font-size:0.85rem;max-width:280px;">Əmlak, məhsul, texnika və xidmətləri bir platformada birləşdirən Azərbaycanın yeni nəsil bazarı.</p>
          </div>
          <div><h4>Kateqoriyalar</h4>
            <a href="property.html">Əmlak</a><a href="marketplace.html">Marketplace</a><a href="equipment.html">Texnika</a><a href="services.html">Xidmətlər</a><a href="companies.html">Şirkətlər</a>
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
          <span>© 2026 IndustrCons Market. Bütün hüquqlar qorunur. Prototip versiya.</span>
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
    priceLine = `${icPrice(item.price)} ${item.priceUnit}`;
    metaLine = `${item.area} m²${item.rooms ? ` · ${item.rooms} otaq` : ""}`;
    badgeExtra = `<span class="tag ${item.deal==='Kirayə'||item.deal==='Günlük'?'tag-rent':'tag-new'}">${item.deal}</span>`;
  } else if(item.kind === "marketplace"){
    detailHref = `product-detail.html?id=${item.id}`;
    priceLine = `${icPrice(item.price)} ${item.priceUnit}`;
    metaLine = item.category;
    badgeExtra = `<span class="tag ${item.status==='Yeni'?'tag-new':'tag-used'}">${item.status}</span>`;
  } else if(item.kind === "equipment"){
    detailHref = `product-detail.html?id=${item.id}`;
    priceLine = item.forSale ? `${icPrice(item.salePrice)} AZN` : `${icPrice(item.rentPrice)} ${item.rentUnit}`;
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
});
