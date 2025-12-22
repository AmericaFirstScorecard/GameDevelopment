const storageKey = "civic-strategy-state";

const economicClasses = {
  poor: { capital: 10000, capitalIncome: 10000 },
  middle: { capital: 100000, capitalIncome: 12500 },
  rich: { capital: 1000000, capitalIncome: 15000 },
};

const stateData = [
  { code: "AL", name: "Alabama", flag: "🇺🇸", governor: "E. Lyons", senators: ["C. Walker", "D. White"], houseSeats: 7, senateClass: 1 },
  { code: "AZ", name: "Arizona", flag: "🇺🇸", governor: "R. Chavez", senators: ["A. Miles", "P. Ora"], houseSeats: 9, senateClass: 3 },
  { code: "CA", name: "California", flag: "🇺🇸", governor: "S. Chen", senators: ["A. Ruiz", "T. Sinclair"], houseSeats: 52, senateClass: 1 },
  { code: "FL", name: "Florida", flag: "🇺🇸", governor: "L. Cortez", senators: ["J. Pruitt", "E. Harper"], houseSeats: 28, senateClass: 3 },
  { code: "GA", name: "Georgia", flag: "🇺🇸", governor: "K. Ali", senators: ["R. Boone", "M. Liao"], houseSeats: 14, senateClass: 2 },
  { code: "IL", name: "Illinois", flag: "🇺🇸", governor: "A. Ibrahim", senators: ["I. Ortega", "S. Patel"], houseSeats: 17, senateClass: 2 },
  { code: "NY", name: "New York", flag: "🇺🇸", governor: "G. Hudson", senators: ["B. Roman", "J. Park"], houseSeats: 26, senateClass: 1 },
  { code: "NC", name: "North Carolina", flag: "🇺🇸", governor: "K. Imani", senators: ["J. Morton", "Z. Abdul"], houseSeats: 14, senateClass: 2 },
  { code: "OH", name: "Ohio", flag: "🇺🇸", governor: "C. Patel", senators: ["P. Dawson", "K. Malik"], houseSeats: 15, senateClass: 3 },
  { code: "TX", name: "Texas", flag: "🇺🇸", governor: "A. Estrada", senators: ["B. Wyatt", "R. Cooper"], houseSeats: 38, senateClass: 1 },
  { code: "VA", name: "Virginia", flag: "🇺🇸", governor: "N. Albright", senators: ["S. Mendez", "A. Tully"], houseSeats: 11, senateClass: 2 },
  { code: "WA", name: "Washington", flag: "🇺🇸", governor: "D. Sandoval", senators: ["M. Paige", "R. Kim"], houseSeats: 10, senateClass: 3 },
];

const topics = {
  Health: ["Abortion", "Drug Pricing", "Medicare"],
  Economy: ["Taxes", "Trade", "Labor"],
  Security: ["Border", "Cyber", "Defense"],
  Education: ["Higher Ed", "K-12", "Loans"],
};

const cabinetRoles = [
  "State",
  "Defense",
  "Treasury",
  "Justice",
  "Labor",
  "Energy",
  "Transportation",
  "Education",
  "Health & Human Services",
  "Homeland Security",
];

let player = {
  email: "",
  name: "",
  state: "",
  party: "",
  heritage: "",
  religion: "",
  economicClass: "poor",
  capital: 0,
  politicalCapital: 0,
  capitalIncome: 0,
  politicalIncome: 10000,
  office: null,
  partyRole: "Member",
  description: "",
  avatar: "",
};

let races = [];
let companies = [];
let bills = [];
let moneyTransfers = [];
let primaryOpen = true;
let treasury = 0;

const cabinet = cabinetRoles.map((role) => ({ role, holder: "Vacant" }));

function saveState() {
  const payload = { player, races, companies, bills, moneyTransfers, primaryOpen, treasury };
  try {
    localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch (err) {
    console.warn("Unable to persist state", err);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    player = { ...player, ...(parsed.player || {}) };
    races = parsed.races || [];
    companies = parsed.companies || [];
    bills = parsed.bills || [];
    moneyTransfers = parsed.moneyTransfers || [];
    primaryOpen = parsed.primaryOpen ?? true;
    treasury = parsed.treasury ?? 0;
  } catch (err) {
    console.warn("Unable to load saved state", err);
  }
}

function setIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
  return el;
}

function currency(val, symbol = "₡") {
  return `${symbol}${Number(val).toLocaleString()}`;
}

function timeUntil(hours) {
  const now = Date.now();
  const cycle = hours * 3600 * 1000;
  const remaining = cycle - (now % cycle);
  const hrs = Math.floor(remaining / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  return `${hrs}h ${mins}m`;
}

function hydrateLanding() {
  if (player.email) {
    setIfExists("heroWelcome", `Welcome back, ${player.name || "candidate"}`);
    setIfExists("heroPersona", `${player.heritage || "Heritage TBD"} • ${player.religion || "Beliefs TBD"}`);
  } else {
    setIfExists("heroWelcome", "Shape a national campaign");
    setIfExists("heroPersona", "Design your avatar and alliances");
  }
  setIfExists("heroCapital", currency(player.capital));
  setIfExists("heroPol", currency(player.politicalCapital, "₱"));
}

function populateStates() {
  const select = document.getElementById("state");
  if (!select) return;
  select.innerHTML = "";
  stateData.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.code;
    option.textContent = `${state.name} (${state.code})`;
    select.appendChild(option);
  });
}

function renderProfile() {
  const nameEl = document.getElementById("profileName");
  if (!nameEl) return;
  nameEl.textContent = player.name || "No profile yet";
  setIfExists("profileState", player.state ? `${player.state} — ${player.party}` : "Home state will appear here.");
  setIfExists("capitalStat", currency(player.capital));
  setIfExists("polCapitalStat", currency(player.politicalCapital, "₱"));
  setIfExists("capIncomeStat", currency(player.capitalIncome));
  setIfExists("polIncomeStat", currency(player.politicalIncome, "₱"));
  setIfExists("officeLabel", player.office || "Citizen");
  setIfExists("partyRole", player.partyRole);
  const badge = document.getElementById("officeBadge");
  if (badge) badge.textContent = player.office ? player.office : "Unseated — no office yet";
  const tags = [player.economicClass, player.religion, player.heritage, player.party]
    .filter(Boolean)
    .map((t) => `<span class="badge">${t}</span>`)
    .join(" ");
  const tagList = document.getElementById("traitTags");
  if (tagList) tagList.innerHTML = tags;
  if (player.avatar) {
    const avatar = document.getElementById("avatarPreview");
    if (avatar) avatar.innerHTML = `<img src="${player.avatar}" alt="avatar" />`;
  }
  hydrateLanding();
}

function handleSignup(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const selectedClass = data.get("class");
  const stats = economicClasses[selectedClass];
  player = {
    ...player,
    email: data.get("email"),
    name: data.get("name"),
    state: data.get("state"),
    party: data.get("party"),
    heritage: data.get("heritage"),
    religion: data.get("religion"),
    economicClass: selectedClass,
    capital: stats.capital,
    politicalCapital: 0,
    capitalIncome: stats.capitalIncome,
    politicalIncome: 10000,
  };
  const file = data.get("image");
  if (file && file.size) {
    const reader = new FileReader();
    reader.onload = () => {
      player.avatar = reader.result;
      renderProfile();
      saveState();
    };
    reader.readAsDataURL(file);
  } else {
    renderProfile();
    saveState();
  }
}

function renderMap() {
  const grid = document.getElementById("mapGrid");
  if (!grid) return;
  grid.innerHTML = "";
  stateData.forEach((state) => {
    const btn = document.createElement("div");
    btn.className = "state-btn";
    btn.innerHTML = `<span class="state-flag">${state.flag}</span><strong>${state.code}</strong><div class="subtle">${state.name}</div>`;
    btn.addEventListener("click", () => showState(state));
    grid.appendChild(btn);
  });
}

function getElectionTiming(state) {
  return [
    { label: "House", every: "48h", next: timeUntil(48) },
    { label: "Senate (Class " + state.senateClass + ")", every: "120h", next: timeUntil(120 * state.senateClass) },
    { label: "Governor", every: "120h", next: timeUntil(120) },
  ];
}

function showState(state) {
  const details = document.getElementById("stateDetails");
  details.style.display = "block";
  const racesHtml = getElectionTiming(state)
    .map(
      (r) => `
        <div class="stat"><span>${r.label} race</span><strong>Every ${r.every} — next in ${r.next}</strong></div>
      `
    )
    .join("");
  details.innerHTML = `
    <div class="flex" style="align-items: flex-start;">
      <div style="flex: 1;">
        <h3>${state.name} <span class="badge">${state.code}</span></h3>
        <p class="subtle">Governor: ${state.governor} • Senator 1: ${state.senators[0]} • Senator 2: ${state.senators[1]}</p>
        <p class="subtle">House allocation: ${state.houseSeats} seats</p>
        <div class="inline-actions">
          <button type="button" onclick="signUpRace('${state.code}', 'House')">Sign up for election (₱10,000)</button>
          <button type="button" onclick="signUpRace('${state.code}', 'Senate')">Join Senate race (₱10,000)</button>
          <button type="button" onclick="signUpRace('${state.code}', 'Governor')">Join Governor race (₱10,000)</button>
        </div>
      </div>
      <div class="card" style="min-width: 220px;">
        <h4>Active races</h4>
        ${racesHtml}
        <div class="divider"></div>
        <p class="subtle">Race cadence: House 2 days, Senate 5 days (rotating classes), Governor 5 days.</p>
      </div>
    </div>
  `;
}

function renderRace() {
  const container = document.getElementById("raceContainer");
  if (!container) return;
  const notice = document.getElementById("noRaceNotice");
  container.innerHTML = "";
  if (!races.length) {
    if (notice) notice.style.display = "block";
    return;
  }
  if (notice) notice.style.display = "none";
  races.forEach((race, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${race.type} — ${race.state}</h4>
      <p class="subtle">Stage: ${race.stage}</p>
      <div class="stat"><span>Polling</span><strong>${race.polling}%</strong></div>
      <div class="stat"><span>Demographics</span><strong>${race.demographicPulse}</strong></div>
      <div class="inline-actions">
        <button type="button" onclick="buyPoll(${idx})">Buy poll (-₱5,000)</button>
        <button type="button" onclick="attackAd(${idx})">Attack ad (-₱7,500)</button>
        <button type="button" onclick="boostSelf(${idx})">Boost self (-₱5,000)</button>
        <button type="button" onclick="withdrawRace(${idx})">Withdraw</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function signUpRace(state, type) {
  if (player.politicalCapital < 10000) {
    alert("You need ₱10,000 political capital to enter.");
    return;
  }
  if (races.length && type !== "President") {
    alert("Only one race at a time. Withdraw to switch.");
    return;
  }
  player.politicalCapital -= 10000;
  races.push({
    state,
    type,
    stage: type === "President" ? (primaryOpen ? "Primary" : "General") : "Primary",
    polling: 12,
    demographicPulse: "Balanced",
  });
  renderProfile();
  renderRace();
  saveState();
}

function buyPoll(idx) {
  if (player.politicalCapital < 5000) return alert("Not enough political capital.");
  player.politicalCapital -= 5000;
  races[idx].demographicPulse = "Income + heritage leaning toward you";
  races[idx].polling = Math.min(80, races[idx].polling + 3);
  renderProfile();
  renderRace();
  saveState();
}

function attackAd(idx) {
  if (player.politicalCapital < 7500) return alert("Not enough political capital.");
  player.politicalCapital -= 7500;
  races[idx].polling = Math.min(90, races[idx].polling + 4);
  renderProfile();
  renderRace();
  saveState();
}

function boostSelf(idx) {
  if (player.politicalCapital < 5000) return alert("Not enough political capital.");
  player.politicalCapital -= 5000;
  races[idx].polling = Math.min(95, races[idx].polling + 2);
  renderProfile();
  renderRace();
  saveState();
}

function withdrawRace(idx) {
  races.splice(idx, 1);
  renderRace();
  saveState();
}

function setupIncomeButtons() {
  const convert = document.getElementById("convertCapital");
  const boostCap = document.getElementById("boostCapital");
  const boostPol = document.getElementById("boostPol");
  if (convert)
    convert.addEventListener("click", () => {
      const converted = player.capital * 0.1;
      player.capital -= converted;
      player.politicalCapital += converted;
      renderProfile();
      saveState();
    });
  if (boostCap)
    boostCap.addEventListener("click", () => {
      if (player.capital < 5000) return alert("Need ₡5,000 to invest.");
      player.capital -= 5000;
      player.capitalIncome += 1200;
      renderProfile();
      saveState();
    });
  if (boostPol)
    boostPol.addEventListener("click", () => {
      if (player.politicalCapital < 3000) return alert("Need ₱3,000 to train operatives.");
      player.politicalCapital -= 3000;
      player.politicalIncome += 1200;
      renderProfile();
      saveState();
    });
}

function renderCompanies() {
  const list = document.getElementById("companyList");
  if (!list) return;
  list.innerHTML = "";
  companies.forEach((c, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${c.name} <span class="badge">${c.industry}</span></h4>
      <p class="subtle">CEO: ${c.ceo} • ${c.shares.toLocaleString()} shares @ $${c.sharePrice}</p>
      <div class="stat"><span>Income / hr</span><strong>${currency(c.income)}</strong></div>
      <div class="stat"><span>Profit</span><strong>${currency(c.income - c.expenses)}</strong></div>
      <div class="stat"><span>Employees</span><strong>${c.employees.toLocaleString()}</strong></div>
      <div class="inline-actions">
        <button type="button" onclick="issueShares(${idx})">Create more shares</button>
        <button type="button" onclick="sellShares(${idx})">Sell personal shares</button>
        <button type="button" onclick="setDividend(${idx})">Set dividend</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function createCompany(e) {
  e.preventDefault();
  if (companies.length >= 5) return alert("CEO cap reached (5).");
  if (player.capital < 1000000) return alert("Need ₡1,000,000 capital to form a company.");
  const shares = Number(document.getElementById("companyShares").value || 100000);
  const income = Math.max(15000, shares / 10 + Math.random() * 20000);
  const expenses = income * 0.35;
  const company = {
    name: document.getElementById("companyName").value,
    ceo: document.getElementById("companyCEO").value || player.name,
    industry: document.getElementById("companyIndustry").value,
    salary: Number(document.getElementById("companySalary").value || 0),
    shares,
    sharePrice: 10,
    dividend: 0,
    employees: Number(document.getElementById("companyEmployees").value || 0),
    bio: document.getElementById("companyBio").value,
    income,
    expenses,
  };
  player.capital -= 1000000;
  companies.push(company);
  renderProfile();
  renderCompanies();
  saveState();
}

function issueShares(idx) {
  const more = Number(prompt("New shares to mint (current price must exceed $1)", 10000) || 0);
  if (!more) return;
  const company = companies[idx];
  if (company.sharePrice <= 1) return alert("Cannot mint when price is $1 or less.");
  company.shares += more;
  company.sharePrice = Math.max(1, Math.round(company.sharePrice * 0.97));
  renderCompanies();
  saveState();
}

function sellShares(idx) {
  const company = companies[idx];
  const qty = Number(prompt("Sell how many shares?", Math.round(company.shares * 0.1)) || 0);
  if (!qty || qty > company.shares) return;
  company.shares -= qty;
  const proceeds = qty * company.sharePrice;
  player.capital += proceeds;
  company.sharePrice = Math.round(company.sharePrice * 1.05);
  renderProfile();
  renderCompanies();
  saveState();
}

function setDividend(idx) {
  const rate = Number(prompt("Dividend per share", companies[idx].dividend || 0) || 0);
  companies[idx].dividend = rate;
  renderCompanies();
  saveState();
}

function setupFederal() {
  const table = document.getElementById("cabinetTable");
  if (!table) return;
  table.innerHTML = "<tr><th>Role</th><th>Holder</th></tr>" +
    cabinet
      .map((slot) => `<tr><td>${slot.role}</td><td>${slot.holder}</td></tr>`)
      .join("");
  document.getElementById("registerPresident").addEventListener("click", () => {
    if (player.party === "Independents") {
      alert("Independents cannot run in primaries.");
      return;
    }
    signUpRace("USA", "President");
    document.getElementById("presStatus").textContent = "Registered";
    saveState();
  });
  document.getElementById("spendState").addEventListener("click", () => {
    if (!races.find((r) => r.type === "President")) return alert("Register first.");
    if (player.capital < 25000) return alert("Spend requires ₡25,000.");
    player.capital -= 25000;
    alert("You improved odds in a battleground.");
    renderProfile();
    saveState();
  });
  setIfExists("primaryStage", primaryOpen ? "Primaries are open (Independents cannot run)" : "General election underway");
}

function advanceGeneral() {
  primaryOpen = false;
  setIfExists("primaryStage", "General election underway");
  races.forEach((r) => {
    if (r.type === "President") r.stage = "General";
  });
  renderRace();
  saveState();
}

function renderBills() {
  const list = document.getElementById("billList");
  if (!list) return;
  list.innerHTML = "";
  bills.forEach((bill, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${bill.title}</h4>
      <p class="subtle">${bill.chamber} • ${bill.topic} / ${bill.subtopic} • Outcome: ${bill.outcome}</p>
      <div class="stat"><span>Status</span><strong>${bill.status}</strong></div>
      <div class="inline-actions">
        <button type="button" onclick="advanceBill(${idx})">Advance</button>
        <button type="button" onclick="vetoBill(${idx})">Veto</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function submitBill() {
  const topic = document.getElementById("billTopic").value;
  const subtopic = document.getElementById("billSubtopic").value;
  const chamber = document.getElementById("billChamber").value;
  const title = `${topic}: ${subtopic}`;
  bills.push({
    title,
    chamber,
    topic,
    subtopic,
    outcome: document.getElementById("billOutcome").value,
    status: `Filed in the ${chamber}`,
  });
  renderBills();
  saveState();
}

function advanceBill(idx) {
  const bill = bills[idx];
  if (bill.status.includes("Filed")) bill.status = "Passed chamber — sent to other";
  else if (bill.status.includes("other")) bill.status = "Passed both — awaiting President";
  else if (bill.status.includes("President")) bill.status = "Signed into law";
  renderBills();
  saveState();
}

function vetoBill(idx) {
  const bill = bills[idx];
  bill.status = "Vetoed — return to origin for override";
  renderBills();
  saveState();
}

function populateBillTopics() {
  const topicSelect = document.getElementById("billTopic");
  const subtopicSelect = document.getElementById("billSubtopic");
  if (!topicSelect || !subtopicSelect) return;
  Object.keys(topics).forEach((topic) => {
    const opt = document.createElement("option");
    opt.value = topic;
    opt.textContent = topic;
    topicSelect.appendChild(opt);
  });
  topicSelect.addEventListener("change", () => {
    renderSubtopics(topicSelect.value, subtopicSelect);
  });
  renderSubtopics(topicSelect.value, subtopicSelect);
}

function renderSubtopics(topic, select) {
  select.innerHTML = "";
  topics[topic].forEach((sub) => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    select.appendChild(opt);
  });
}

function setupEditor(toolbarSelector, areaSelector) {
  const toolbar = document.querySelector(toolbarSelector);
  const area = document.querySelector(areaSelector);
  if (!toolbar || !area) return;
  toolbar.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.execCommand(btn.dataset.command, false, null);
      area.focus();
    });
  });
}

function setupParty() {
  const rate = document.getElementById("partyRate");
  const label = document.getElementById("partyRateLabel");
  if (!rate || !label) return;
  rate.addEventListener("input", () => {
    label.textContent = `${rate.value}%`;
    treasury += Number(rate.value) * 100;
    renderTreasury();
    saveState();
  });
  document.getElementById("electChair").addEventListener("click", () => {
    const name = document.getElementById("chairInput").value || "Chair";
    document.getElementById("chairLabel").textContent = name;
  });
  document.getElementById("appointVice").addEventListener("click", () => {
    const name = document.getElementById("chairInput").value || "Vice";
    document.getElementById("viceLabel").textContent = name;
  });
  document.getElementById("appointTreasurer").addEventListener("click", () => {
    const name = document.getElementById("chairInput").value || "Treasurer";
    document.getElementById("treasurerLabel").textContent = name;
  });
  document.getElementById("withdrawForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = Number(document.getElementById("withdrawAmount").value || 0);
    if (amount > treasury) return alert("Insufficient party funds.");
    treasury -= amount;
    player.politicalCapital += amount;
    renderTreasury();
    renderProfile();
    saveState();
  });
}

function renderTreasury() {
  setIfExists("treasuryBalance", currency(treasury, "₱"));
}

function setupMoneyTransfers() {
  const form = document.getElementById("sendMoneyForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const recipient = document.getElementById("recipient").value;
    const amount = Number(document.getElementById("amount").value || 0);
    if (amount > player.capital) return alert("Not enough capital.");
    player.capital -= amount;
    moneyTransfers.unshift({ recipient, amount, date: new Date() });
    renderProfile();
    renderMoneyLog();
    saveState();
  });
}

function renderMoneyLog() {
  const log = document.getElementById("moneyLog");
  if (!log) return;
  log.innerHTML = moneyTransfers
    .slice(0, 5)
    .map((t) => {
      const timestamp = new Date(t.date);
      return `<div>${currency(t.amount)} sent to <strong>${t.recipient}</strong> — ${timestamp.toLocaleTimeString()}</div>`;
    })
    .join("");
}

function setupRTEs() {
  setupEditor(".rich-editor .editor-toolbar", "#bioEditor");
  setupEditor("#congress .editor-toolbar", "#billBody");
}

function seedPlayers() {
  const grid = document.getElementById("mapGrid");
  if (!grid) return;
  const sample = [
    { name: "Brooke Tan", state: "CA", party: "Democrat" },
    { name: "Jamal Ortiz", state: "TX", party: "Republican" },
    { name: "Lina Cho", state: "WA", party: "Independent" },
  ];
  const log = document.getElementById("moneyLog");
  if (log) log.innerHTML += `<div class="subtle">Click a name anywhere to open their profile.</div>`;
  sample.forEach((p) => {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = p.name;
    tag.style.cursor = "pointer";
    tag.title = "View profile";
    tag.addEventListener("click", () => alert(`${p.name} — ${p.party} (${p.state}) profile preview.`));
    grid.appendChild(tag);
  });
}

function init() {
  loadState();
  populateStates();
  renderProfile();
  renderMap();
  renderRace();
  renderCompanies();
  setupIncomeButtons();
  setupFederal();
  populateBillTopics();
  renderBills();
  setupParty();
  renderTreasury();
  setupMoneyTransfers();
  renderMoneyLog();
  setupRTEs();
  seedPlayers();
  hydrateLanding();

  const signup = document.getElementById("signupForm");
  if (signup) signup.addEventListener("submit", handleSignup);
  const company = document.getElementById("companyForm");
  if (company) company.addEventListener("submit", createCompany);
  const billBtn = document.getElementById("submitBill");
  if (billBtn) billBtn.addEventListener("click", submitBill);

  setInterval(() => {
    races.forEach((race) => {
      if (race.stage === "Primary") {
        race.stage = race.type === "President" && !primaryOpen ? "General" : "Primary";
      }
    });
    renderRace();
    saveState();
  }, 10000);

  if (primaryOpen) setTimeout(advanceGeneral, 20000);
}

window.addEventListener("DOMContentLoaded", init);
