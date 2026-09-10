/* =========================================================
   MOCK DATA — IndustrCons Market
   In production this file disappears; the same shapes would
   arrive from GET /api/listings, GET /api/companies, etc.
   ========================================================= */

const IC_LOCATIONS = ["Yasamal","Nərimanov","Nəsimi","Xətai","Səbail","Binəqədi","Suraxanı","Sabunçu","Sumqayıt","Gəncə","Xırdalan","Nizami"];

function icPick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function icRand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function icImg(seed,w=640,h=480){ return `https://picsum.photos/seed/${seed}/${w}/${h}`; }

function icBuildSellers(){
  const businesses = ["ABC Tikinti MMC","Baku Equipment Group","Nasimi Əmlak","Kaspi Construction","Xəzər Servis","Zirvə Şirkəti","Modern Tikinti","Prime Equipment","Bakcell Texnika","Orion İnşaat"];
  const persons = ["Elvin M.","Ayan Q.","Rəşad H.","Nərmin S.","Tural B.","Kamran Y.","Günel A.","Vüsal T."];
  return { businesses, persons };
}

function icSeller(i){
  const { businesses, persons } = icBuildSellers();
  const isBusiness = i % 3 !== 0;
  return {
    id: `S${1000+i}`,
    name: isBusiness ? icPick(businesses) : icPick(persons),
    type: isBusiness ? "business" : "individual",
    verified: Math.random() > 0.25,
    phoneVerified: Math.random() > 0.15,
    emailVerified: Math.random() > 0.2,
    rating: (3.6 + Math.random()*1.4).toFixed(1),
    reviews: icRand(4,140)
  };
}

/* ---------------- PROPERTY (20) ---------------- */
const propertyTypes = ["Mənzil","Həyət evi","Villa","Torpaq","Ofis","Mağaza","Anbar","Sənaye əmlakı"];
const propertyDeals = ["Satılır","Kirayə","Günlük"];
const IC_PROPERTY = Array.from({length:20}).map((_,i)=>{
  const type = icPick(propertyTypes);
  const deal = icPick(propertyDeals);
  const rooms = type==="Torpaq" || type==="Anbar" || type==="Sənaye əmlakı" ? null : icRand(1,5);
  const area = type==="Torpaq" ? icRand(4,20)*100 : icRand(45,320);
  const price = deal==="Satılır" ? icRand(65,650)*1000 : icRand(400,4500);
  return {
    id: `P${100+i}`,
    kind: "property",
    title: `${rooms ? rooms+" otaqlı " : ""}${type.toLowerCase()}${deal==="Satılır" && Math.random()>0.5 ? " (yeni tikili)" : ""}`,
    category: type,
    deal,
    price,
    priceUnit: deal==="Satılır" ? "AZN" : deal==="Kirayə" ? "AZN/ay" : "AZN/gün",
    location: icPick(IC_LOCATIONS),
    city: "Bakı",
    area,
    rooms,
    floor: rooms ? `${icRand(1,16)}/${icRand(5,20)}` : null,
    year: icRand(1975,2025),
    condition: icPick(["Təmirli","Orta təmir","Təmirsiz","Yeni tikili"]),
    docs: icPick(["Çıxarış","Müqavilə","Qeydiyyatsız"]),
    mortgage: Math.random()>0.5,
    parking: Math.random()>0.4,
    premium: Math.random()>0.75,
    images: [icImg("prop"+i+"a"), icImg("prop"+i+"b"), icImg("prop"+i+"c"), icImg("prop"+i+"d")],
    seller: icSeller(i),
    views: icRand(80,15000),
    favorites: icRand(2,600),
    createdAt: Date.now() - icRand(0,60)*86400000,
    description: "Obyekt yaxşı vəziyyətdədir, infrastruktura yaxın ərazidə yerləşir. Metroya, məktəbə və ictimai nəqliyyata piyada məsafədədir. Sənədlər qaydasındadır."
  };
});

/* ---------------- MARKETPLACE (20) ---------------- */
const mpCategories = [
  {group:"Elektronika", items:["iPhone 14 Pro","Samsung Galaxy S23","MacBook Air M2","Dell noutbuk","Sony televizor","Canon fotoaparat","Simsiz qulaqlıq"]},
  {group:"Ev əşyaları", items:["Divan dəsti","Yataq otağı mebeli","Soyuducu","Paltaryuyan maşın","Mətbəx dəsti","İşıqlandırma"]},
  {group:"Tikinti materialları", items:["Kərpic (palet)","Sement (50kg kisə)","Metal profil","Qum-çınqıl","İzolyasiya materialı"]},
  {group:"Alətlər", items:["Perforator Bosch","Diskli mişar","Boyaq pistoleti","Qaynaq aparatı","Kompressor"]},
  {group:"Nəqliyyat", items:["Mercedes Sprinter","Hyundai Porter","Yük qoşqusu","Ehtiyat hissələri"]}
];
const IC_MARKETPLACE = Array.from({length:20}).map((_,i)=>{
  const cat = icPick(mpCategories);
  const item = icPick(cat.items);
  const status = icPick(["Yeni","İşlənmiş","İşlənmiş"]);
  const rentable = Math.random()>0.7;
  return {
    id: `M${200+i}`,
    kind: "marketplace",
    title: item,
    category: cat.group,
    status,
    price: icRand(35,18000),
    priceUnit: "AZN",
    rentPrice: rentable ? icRand(15,220) : null,
    location: icPick(IC_LOCATIONS),
    city: "Bakı",
    images: [icImg("mp"+i+"a"), icImg("mp"+i+"b"), icImg("mp"+i+"c")],
    seller: icSeller(i+40),
    condition: status,
    premium: Math.random()>0.8,
    views: icRand(30,9000),
    favorites: icRand(0,300),
    createdAt: Date.now() - icRand(0,45)*86400000,
    specs: { "Vəziyyət": status, "Çatdırılma": Math.random()>0.5 ? "Var" : "Yoxdur" },
    description: `${item} satılır. Məhsul haqqında ətraflı məlumat üçün satıcı ilə əlaqə saxlayın. Baxış imkanı mövcuddur.`
  };
});

/* ---------------- EQUIPMENT (15) ---------------- */
const equipmentModels = [
  {name:"JCB 3CX", cat:"Ekskavatorlar"},
  {name:"Caterpillar 320D", cat:"Ekskavatorlar"},
  {name:"Liebherr LTM 1050 kran", cat:"Kranlar"},
  {name:"Komatsu FD30 forklift", cat:"Forkliftlər"},
  {name:"Genie GS-1932 scissor lift", cat:"Scissor lifts"},
  {name:"JLG boom lift 450AJ", cat:"Boom lifts"},
  {name:"Atlas Copco kompressor", cat:"Kompressorlar"},
  {name:"Cummins generator 100kVA", cat:"Generatorlar"},
  {name:"Beton mikseri Altrad", cat:"Beton mikserləri"},
  {name:"Putzmeister beton nasosu", cat:"Beton nasosları"},
  {name:"Leica total station", cat:"Total stationlar"},
  {name:"Bosch lazer nivelir", cat:"Lazer nivelirlər"},
  {name:"Lincoln qaynaq aparatı", cat:"Qaynaq avadanlığı"},
  {name:"Layher tikinti iskeleti", cat:"Skaffolding"},
  {name:"Makita perforator seti", cat:"Əl alətləri"}
];
const IC_EQUIPMENT = equipmentModels.map((m,i)=>{
  const forRent = Math.random()>0.4;
  return {
    id: `E${300+i}`,
    kind: "equipment",
    title: m.name,
    category: m.cat,
    forSale: Math.random()>0.3,
    forRent,
    salePrice: icRand(8,180)*1000,
    rentPrice: forRent ? icRand(120,900) : null,
    rentUnit: "AZN/gün",
    location: icPick(IC_LOCATIONS),
    city: icPick(["Bakı","Sumqayıt"]),
    year: icRand(2012,2025),
    fuel: icPick(["Dizel","Elektrik","Benzin"]),
    drive: icPick(["4x4","2x4",null]),
    hours: icRand(200,9000),
    images: [icImg("eq"+i+"a"), icImg("eq"+i+"b"), icImg("eq"+i+"c")],
    seller: icSeller(i+70),
    premium: Math.random()>0.7,
    views: icRand(50,6000),
    favorites: icRand(0,180),
    createdAt: Date.now() - icRand(0,50)*86400000,
    description: `${m.name} əla texniki vəziyyətdə. Servis tarixçəsi mövcuddur. Bakı və ətraf ərazilərə çatdırılma mümkündür.`
  };
});

/* ---------------- SERVICES (10) ---------------- */
const serviceList = [
  {name:"HVAC layihələndirmə və quraşdırma", cat:"HVAC"},
  {name:"Elektrik təsisatı işləri", cat:"Elektrik"},
  {name:"Santexnika xidmətləri", cat:"Santexnika"},
  {name:"İnteryer dizayn", cat:"İnteryer dizayn"},
  {name:"Geodeziya və topoqrafik ölçmə", cat:"Surveying"},
  {name:"Layihə idarəetməsi (PM)", cat:"Layihə idarəetməsi"},
  {name:"Memarlıq layihələndirmə", cat:"Memarlıq"},
  {name:"Tikinti mühəndisliyi konsaltinq", cat:"Mühəndislik"},
  {name:"Texnika icarəsi əməliyyatları", cat:"Avadanlıq icarəsi"},
  {name:"İşçi qüvvəsi təchizatı", cat:"Əmək qüvvəsi"}
];
const IC_SERVICES = serviceList.map((s,i)=>({
  id: `SV${400+i}`,
  kind: "service",
  title: s.name,
  category: s.cat,
  location: "Bakı",
  provider: icSeller(i+90),
  rating: (4.2+Math.random()*0.7).toFixed(1),
  priceFrom: icRand(150,3500),
  images: [icImg("sv"+i)],
  description: `${s.name} sahəsində peşəkar xidmət. Layihənizin miqyasına uyğun təklif hazırlanır.`
}));

/* ---------------- COMPANIES (10) ---------------- */
const companyNames = ["ABC Construction","Baku Equipment Group","Xəzər İnşaat","Zirvə Tikinti","Modern Development","Orion Engineering","Kaspi Group","Prime Realty","Nasimi Holding","Atlas Servis"];
const companySectors = ["Tikinti","Əmlak","Texnika icarəsi","Mühəndislik","İnşaat materialları"];
const IC_COMPANIES = companyNames.map((name,i)=>({
  id: `C${500+i}`,
  kind: "company",
  name,
  sector: icPick(companySectors),
  city: icPick(["Bakı","Sumqayıt","Gəncə"]),
  verified: Math.random()>0.2,
  projects: icRand(4,60),
  listings: icRand(3,40),
  services: icRand(0,15),
  rating: (4.0+Math.random()*0.9).toFixed(1),
  reviews: icRand(10,200),
  logo: icImg("logo"+i, 200,200),
  cover: icImg("cover"+i, 900, 300),
  about: `${name} Azərbaycan bazarında illərdir fəaliyyət göstərən etibarlı şirkətdir. Keyfiyyət və şəffaflıq əsas prinsiplərimizdir.`
}));

/* ---------------- Combined index for global search ---------------- */
function icAllListings(){
  return [...IC_PROPERTY, ...IC_MARKETPLACE, ...IC_EQUIPMENT];
}

/* ---------------- Mock current user ---------------- */
const IC_CURRENT_USER = {
  id: "U1",
  name: "Elvin",
  email: "elvin@example.com",
  phoneVerified: true,
  emailVerified: true,
  identitySubmitted: false,
  businessVerified: false,
  trustScore: 82,
  stats: { views: 12450, favorites: 482, leads: 86, activeListings: 17 }
};
