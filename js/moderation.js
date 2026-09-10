/* =========================================================
   MODERATION — mock queue + action stubs.
   Replace with:
     GET  /api/moderation/queue
     POST /api/moderation/approve
     POST /api/moderation/reject
     POST /api/moderation/request-documents
     POST /api/moderation/suspend-user
   Workflow: user -> automated security check -> risk score ->
   moderator review -> approve / reject / request docs / suspend.
   False positives must stay reversible; every action is logged.
   ========================================================= */

const IC_MOD_QUEUE = [
  { id:"IC-10452", title:"JCB 3CX 2024", user:"Tural B.", risk:72,
    flags:["Yeni hesab (3 gün)","Xarici ödəniş tələbi aşkarlandı","Şəkil oxşarlığı xəbərdarlığı"],
    image: icImg("mod1"), createdAt: Date.now()-3600e3 },
  { id:"IC-10455", title:"3 otaqlı mənzil, Yasamal", user:"Nərmin S.", risk:35,
    flags:["Qiymət orta bazardan aşağıdır"],
    image: icImg("mod2"), createdAt: Date.now()-7200e3 },
  { id:"IC-10461", title:"iPhone 14 Pro, təzə", user:"Kamran Y.", risk:88,
    flags:["Mətndə 'avans ödəniş' ifadəsi","Telefon nömrəsi əvvəllər 2 dəfə bağlanıb","Xarici keçid aşkarlandı"],
    image: icImg("mod3"), createdAt: Date.now()-10800e3 },
  { id:"IC-10470", title:"Ofis sahəsi icarəyə, Xətai", user:"ABC Tikinti MMC", risk:12,
    flags:[],
    image: icImg("mod4"), createdAt: Date.now()-14400e3 },
];

const IC_AUDIT_LOG = [
  { time:"09:32", text:"Moderator approved IC-10452" },
  { time:"09:41", text:"Listing IC-10455 rejected" },
  { time:"09:45", text:"User #193 reported" },
  { time:"10:02", text:"Security flag triggered on IC-10461" },
  { time:"10:15", text:"Documents requested for IC-10470" },
];

function getModerationQueue(){
  // TODO backend: GET /api/moderation/queue
  return IC_MOD_QUEUE;
}

function approveListing(id){
  // TODO backend: POST /api/moderation/approve { id }
  IC_AUDIT_LOG.unshift({ time: icNowLabel(), text: `Moderator approved ${id}` });
  return { ok: true };
}
function rejectListing(id, reason){
  // TODO backend: POST /api/moderation/reject { id, reason }
  IC_AUDIT_LOG.unshift({ time: icNowLabel(), text: `Listing ${id} rejected (${reason})` });
  return { ok: true };
}
function requestDocuments(id){
  IC_AUDIT_LOG.unshift({ time: icNowLabel(), text: `Documents requested for ${id}` });
  return { ok: true };
}
function suspendUser(user){
  IC_AUDIT_LOG.unshift({ time: icNowLabel(), text: `User ${user} suspended` });
  return { ok: true };
}
function icNowLabel(){
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
