const CATEGORIES = [
  {name:"Encanador",icon:"🚿",desc:"Vazamentos e reparos"},
  {name:"Eletricista",icon:"💡",desc:"Instalações e manutenção"},
  {name:"Limpeza",icon:"🧹",desc:"Casa limpa e organizada"},
  {name:"Pintura",icon:"🖌️",desc:"Renove seus ambientes"},
  {name:"Montagem de móveis",icon:"🪑",desc:"Montagem e ajustes"},
  {name:"Jardinagem",icon:"🌿",desc:"Cuide do seu jardim"},
  {name:"Pequenos reparos",icon:"🛠️",desc:"Consertos do dia a dia"},
  {name:"Assistência técnica",icon:"🔧",desc:"Ajuda com equipamentos"}
];

// Estes perfis são exemplos visuais, não prestadores reais.
const DEMO_PROS = [
  {id:"demo-1",name:"Profissional demonstrativo A",category:"Encanador",city:"Sua cidade",initials:"PA",rating:"Exemplo",description:"Perfil ilustrativo para mostrar como os serviços poderão aparecer."},
  {id:"demo-2",name:"Profissional demonstrativo B",category:"Eletricista",city:"Sua cidade",initials:"PB",rating:"Exemplo",description:"Perfil ilustrativo para testar a navegação e a apresentação."},
  {id:"demo-3",name:"Profissional demonstrativo C",category:"Pequenos reparos",city:"Sua cidade",initials:"PC",rating:"Exemplo",description:"Perfil ilustrativo; nenhum serviço real está sendo oferecido."}
];
const STORE_KEY = "resolveja-mvp-v1";
let toastTimer;
let deferredInstallPrompt = null;

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const safeText = (value="") => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const readStore = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {requests:[], interests:[]}; }
  catch { return {requests:[], interests:[]}; }
};
const saveStore = data => localStorage.setItem(STORE_KEY, JSON.stringify(data));

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
}
function go(view) {
  $$(".view").forEach(el => el.classList.add("hidden"));
  const target = $("#" + view);
  if (target) target.classList.remove("hidden");
  $$(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view.replace("View","").toLowerCase()));
  if (view === "requestsView") renderRequests();
  window.scrollTo({top:0,behavior:"smooth"});
}
function populateSelect(id, placeholder) {
  const select = $("#" + id);
  select.innerHTML = (placeholder ? `<option value="">${safeText(placeholder)}</option>` : "") +
    CATEGORIES.map(c => `<option value="${safeText(c.name)}">${safeText(c.name)}</option>`).join("");
}
function renderCategories() {
  $("#categoryGrid").innerHTML = CATEGORIES.map(c => `
    <button class="category-card" data-category="${safeText(c.name)}">
      <span class="category-icon">${c.icon}</span><strong>${safeText(c.name)}</strong><small>${safeText(c.desc)}</small>
    </button>`).join("");
  $$("#categoryGrid [data-category]").forEach(btn => btn.addEventListener("click", () => openRequest(btn.dataset.category)));
}
function renderProfessionals() {
  $("#professionalGrid").innerHTML = DEMO_PROS.map(p => `
    <article class="pro-card">
      <div class="pro-card-top"><div class="avatar">${safeText(p.initials)}</div><div><h3>${safeText(p.name)}</h3><div class="subline">${safeText(p.category)} · ${safeText(p.city)}</div></div></div>
      <div class="rating">★ ${safeText(p.rating)} · perfil ilustrativo</div>
      <p>${safeText(p.description)}</p>
      <button class="btn btn-outline" data-pro="${safeText(p.id)}">Ver perfil de exemplo</button>
    </article>`).join("");
  $$("#professionalGrid [data-pro]").forEach(btn => btn.addEventListener("click", () => showProfessional(btn.dataset.pro)));
}
function openRequest(category="") {
  $("#requestCategory").value = category || "";
  go("requestView");
}
function showProfessional(id) {
  const p = DEMO_PROS.find(item => item.id === id);
  if (!p) return;
  $("#detailContent").innerHTML = `<div class="detail-card"><button class="back-btn" data-view="home">← Voltar ao início</button><div class="detail-panel"><div class="pro-card-top"><div class="avatar">${safeText(p.initials)}</div><div><span class="demo-tag">PERFIL DEMONSTRATIVO</span><h1>${safeText(p.name)}</h1><div class="subline">${safeText(p.category)} · ${safeText(p.city)}</div></div></div><p>${safeText(p.description)}</p><p><strong>Atenção:</strong> este não é um profissional real. O protótipo ainda não possui cadastro público ou verificação de prestadores.</p><button class="btn btn-primary full-width" id="detailRequest">Solicitar um orçamento</button></div></div>`;
  $("#detailRequest").addEventListener("click", () => openRequest(p.category));
  go("detailView");
}
function renderRequests() {
  const data = readStore();
  const list = $("#requestList");
  if (!data.requests.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><h3>Você ainda não tem pedidos</h3><p>Quando você salvar uma solicitação neste dispositivo, ela aparecerá aqui.</p><button class="btn btn-primary" id="emptyRequestBtn">Criar solicitação</button></div>`;
    $("#emptyRequestBtn").addEventListener("click", () => openRequest());
    return;
  }
  list.innerHTML = data.requests.slice().reverse().map(req => `
    <article class="request-card"><div class="request-card-head"><div><h3>${safeText(req.category)}</h3><div class="request-meta">${safeText(req.city)} · ${safeText(req.date)}</div></div><span class="status-pill">Salvo neste dispositivo</span></div><p>${safeText(req.description)}</p><div class="request-meta">Prazo: ${safeText(req.when)}${req.budget ? " · Orçamento: "+safeText(req.budget) : ""}</div></article>`).join("");
}
$("#requestForm").addEventListener("submit", event => {
  event.preventDefault();
  const request = {
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
    category: $("#requestCategory").value,
    city: $("#requestCity").value.trim(),
    description: $("#requestDescription").value.trim(),
    when: $("#requestWhen").value,
    budget: $("#requestBudget").value,
    date: new Date().toLocaleDateString("pt-BR")
  };
  if (request.description.length < 10) return toast("Descreva o problema com pelo menos 10 caracteres.");
  const data = readStore();
  data.requests.push(request);
  saveStore(data);
  event.target.reset();
  toast("Solicitação salva neste dispositivo.");
  go("requestsView");
});
$("#professionalForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = readStore();
  data.interests.push({
    name: $("#proName").value.trim(),
    category: $("#proCategory").value,
    city: $("#proCity").value.trim(),
    contact: $("#proContact").value.trim(),
    date: new Date().toLocaleDateString("pt-BR")
  });
  saveStore(data);
  event.target.reset();
  $("#proInterestNotice").textContent = "Interesse salvo neste dispositivo. Nesta versão, ninguém receberá esse cadastro pela internet.";
  $("#proInterestNotice").classList.remove("hidden");
  toast("Interesse registrado localmente.");
});
function setupNavigation() {
  $$("[data-view]").forEach(btn => btn.addEventListener("click", event => {
    event.preventDefault();
    go(btn.dataset.view + "View");
  }));
  $("#heroRequestBtn").addEventListener("click", () => openRequest());
  $("#aboutLink").addEventListener("click", e => {e.preventDefault();$("#aboutDialog").showModal();});
  $("#privacyLink").addEventListener("click", e => {e.preventDefault();$("#privacyDialog").showModal();});
  $$("[data-close-dialog]").forEach(btn => btn.addEventListener("click", () => btn.closest("dialog").close()));
}
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $("#installBtn").hidden = false;
});
$("#installBtn").addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    toast("No iPhone, use Compartilhar e depois 'Adicionar à Tela de Início'. Em outros dispositivos, procure 'Instalar app' no menu do navegador.");
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("#installBtn").hidden = true;
});
window.addEventListener("appinstalled", () => toast("ResolveJá instalado!"));
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
populateSelect("requestCategory","Selecione uma categoria");
populateSelect("proCategory","Selecione sua especialidade");
renderCategories();
renderProfessionals();
setupNavigation();
