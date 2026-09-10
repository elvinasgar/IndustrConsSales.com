/* =========================================================
   LISTINGS — CRUD stubs over mock data + localStorage.
   Replace bodies with:
     GET    /api/listings?type=&category=&location=...
     POST   /api/listings
     PATCH  /api/listings/:id
     DELETE /api/listings/:id
   ========================================================= */

function getListings(kind){
  if(kind === "property") return IC_PROPERTY;
  if(kind === "marketplace") return IC_MARKETPLACE;
  if(kind === "equipment") return IC_EQUIPMENT;
  if(kind === "service") return IC_SERVICES;
  return icAllListings();
}
function getPropertyListings(filters={}){ return icApplyFilters(IC_PROPERTY, filters); }
function getMarketplaceListings(filters={}){ return icApplyFilters(IC_MARKETPLACE, filters); }
function getEquipmentListings(filters={}){ return icApplyFilters(IC_EQUIPMENT, filters); }

function icApplyFilters(list, f){
  let out = [...list];
  if(f.category) out = out.filter(i => i.category === f.category);
  if(f.location) out = out.filter(i => i.location === f.location);
  if(f.minPrice) out = out.filter(i => (i.price ?? i.salePrice ?? 0) >= f.minPrice);
  if(f.maxPrice) out = out.filter(i => (i.price ?? i.salePrice ?? 0) <= f.maxPrice);
  if(f.q){
    const q = f.q.toLowerCase();
    out = out.filter(i => i.title.toLowerCase().includes(q) || (i.category||"").toLowerCase().includes(q));
  }
  if(f.sort === "cheap") out.sort((a,b)=>(a.price ?? a.salePrice ?? 0)-(b.price ?? b.salePrice ?? 0));
  if(f.sort === "expensive") out.sort((a,b)=>(b.price ?? b.salePrice ?? 0)-(a.price ?? a.salePrice ?? 0));
  if(f.sort === "newest") out.sort((a,b)=> b.createdAt - a.createdAt);
  if(f.sort === "viewed") out.sort((a,b)=> b.views - a.views);
  return out;
}

function findListingById(id){
  return icAllListings().find(i => i.id === id) || IC_SERVICES.find(i=>i.id===id);
}

function createListing(data){
  // TODO backend: POST /api/listings
  const drafts = JSON.parse(localStorage.getItem("ic_draft_listings") || "[]");
  const ref = `IC-${10000 + drafts.length + icRand(1,900)}`;
  drafts.push({ ...data, id: ref, status: "PENDING", createdAt: Date.now() });
  localStorage.setItem("ic_draft_listings", JSON.stringify(drafts));
  return { ok: true, reference: ref };
}

function updateListing(id, patch){
  // TODO backend: PATCH /api/listings/:id
  console.log("updateListing", id, patch);
  return { ok: true };
}

function deleteListing(id){
  // TODO backend: DELETE /api/listings/:id
  console.log("deleteListing", id);
  return { ok: true };
}

function getMyDraftListings(){
  return JSON.parse(localStorage.getItem("ic_draft_listings") || "[]");
}
