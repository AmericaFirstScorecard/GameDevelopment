const storageKey = "civic-strategy-state";
const VOTE_WINDOW_MS = 24 * 60 * 60 * 1000;
const MOVE_COST = 100000;
const EMPLOYEES_PER_EXPANSION = 750;
const SPECIALIZATION_BONUS = 1.25;
const BASE_EXPANSION_COST = 150000;
const MIN_SEIZURE_GAIN = 0.1;
const MAX_SEIZURE_GAIN = 2;

const economicClasses = {
  poor: { capital: 10000, capitalIncome: 10000 },
  middle: { capital: 100000, capitalIncome: 12500 },
  rich: { capital: 1000000, capitalIncome: 15000 },
};
const economicClassLabels = {
  poor: "Poor",
  middle: "Middle-Class",
  rich: "Rich",
};

const baseStates = [
  { code: "AL", name: "Alabama", houseSeats: 7 },
  { code: "AK", name: "Alaska", houseSeats: 1 },
  { code: "AZ", name: "Arizona", houseSeats: 9 },
  { code: "AR", name: "Arkansas", houseSeats: 4 },
  { code: "CA", name: "California", houseSeats: 52 },
  { code: "CO", name: "Colorado", houseSeats: 8 },
  { code: "CT", name: "Connecticut", houseSeats: 5 },
  { code: "DE", name: "Delaware", houseSeats: 1 },
  { code: "FL", name: "Florida", houseSeats: 28 },
  { code: "GA", name: "Georgia", houseSeats: 14 },
  { code: "HI", name: "Hawaii", houseSeats: 2 },
  { code: "ID", name: "Idaho", houseSeats: 2 },
  { code: "IL", name: "Illinois", houseSeats: 17 },
  { code: "IN", name: "Indiana", houseSeats: 9 },
  { code: "IA", name: "Iowa", houseSeats: 4 },
  { code: "KS", name: "Kansas", houseSeats: 4 },
  { code: "KY", name: "Kentucky", houseSeats: 6 },
  { code: "LA", name: "Louisiana", houseSeats: 6 },
  { code: "ME", name: "Maine", houseSeats: 2 },
  { code: "MD", name: "Maryland", houseSeats: 8 },
  { code: "MA", name: "Massachusetts", houseSeats: 9 },
  { code: "MI", name: "Michigan", houseSeats: 13 },
  { code: "MN", name: "Minnesota", houseSeats: 8 },
  { code: "MS", name: "Mississippi", houseSeats: 4 },
  { code: "MO", name: "Missouri", houseSeats: 8 },
  { code: "MT", name: "Montana", houseSeats: 2 },
  { code: "NE", name: "Nebraska", houseSeats: 3 },
  { code: "NV", name: "Nevada", houseSeats: 4 },
  { code: "NH", name: "New Hampshire", houseSeats: 2 },
  { code: "NJ", name: "New Jersey", houseSeats: 12 },
  { code: "NM", name: "New Mexico", houseSeats: 3 },
  { code: "NY", name: "New York", houseSeats: 26 },
  { code: "NC", name: "North Carolina", houseSeats: 14 },
  { code: "ND", name: "North Dakota", houseSeats: 1 },
  { code: "OH", name: "Ohio", houseSeats: 15 },
  { code: "OK", name: "Oklahoma", houseSeats: 5 },
  { code: "OR", name: "Oregon", houseSeats: 6 },
  { code: "PA", name: "Pennsylvania", houseSeats: 17 },
  { code: "RI", name: "Rhode Island", houseSeats: 2 },
  { code: "SC", name: "South Carolina", houseSeats: 7 },
  { code: "SD", name: "South Dakota", houseSeats: 1 },
  { code: "TN", name: "Tennessee", houseSeats: 9 },
  { code: "TX", name: "Texas", houseSeats: 38 },
  { code: "UT", name: "Utah", houseSeats: 4 },
  { code: "VT", name: "Vermont", houseSeats: 1 },
  { code: "VA", name: "Virginia", houseSeats: 11 },
  { code: "WA", name: "Washington", houseSeats: 10 },
  { code: "WV", name: "West Virginia", houseSeats: 2 },
  { code: "WI", name: "Wisconsin", houseSeats: 8 },
  { code: "WY", name: "Wyoming", houseSeats: 1 },
];

const economicSectors = ["Technology", "Energy", "Healthcare", "Finance", "Manufacturing", "Logistics"];
const sectorBaseRates = {
  Technology: 120,
  Energy: 95,
  Healthcare: 115,
  Finance: 110,
  Manufacturing: 100,
  Logistics: 90,
};

const statePopulations = {
  CA: 39200000,
  TX: 29500000,
  FL: 21700000,
  NY: 19400000,
  PA: 12800000,
  IL: 12600000,
  OH: 11700000,
  GA: 10700000,
  NC: 10600000,
  MI: 10000000,
  NJ: 9300000,
  VA: 8600000,
  WA: 7700000,
  AZ: 7300000,
  MA: 6900000,
  TN: 6900000,
  IN: 6800000,
  MO: 6200000,
  MD: 6000000,
  WI: 5800000,
  CO: 5800000,
  MN: 5700000,
  SC: 5200000,
  AL: 5000000,
  LA: 4600000,
  KY: 4500000,
  OR: 4200000,
  OK: 4000000,
  CT: 3600000,
  UT: 3300000,
  IA: 3200000,
  NV: 3100000,
  AR: 3000000,
  MS: 3000000,
  KS: 2900000,
  NM: 2100000,
  NE: 1900000,
  WV: 1800000,
  ID: 1800000,
  HI: 1400000,
  ME: 1300000,
  NH: 1400000,
  MT: 1100000,
  RI: 1100000,
  DE: 1000000,
  SD: 900000,
  ND: 800000,
  AK: 730000,
  VT: 620000,
  WY: 580000,
};

const stateSpecialties = {
  CA: "Technology",
  TX: "Energy",
  FL: "Logistics",
  NY: "Finance",
  MA: "Healthcare",
  WA: "Technology",
  MI: "Manufacturing",
  PA: "Manufacturing",
  CO: "Logistics",
  GA: "Logistics",
};

function buildStateEconomy(code, idx) {
  const population = statePopulations[code] || 5500000;
  const specializedSector = stateSpecialties[code] || economicSectors[idx % economicSectors.length];
  const sectors = economicSectors.reduce((acc, sector) => {
    acc[sector] = { owners: { America: 100 } };
    return acc;
  }, {});
  return { population, specializedSector, sectors };
}

const stateData = baseStates.map((state, idx) => ({
  ...state,
  flag: `logos/${state.code.toLowerCase()}.png`,
  governor: "Vacant",
  senators: ["Vacant seat A", "Vacant seat B"],
  senateClass: (idx % 3) + 1,
  houseMembers: Array.from({ length: Math.min(state.houseSeats, 8) }, (_, i) => `House member ${i + 1}`),
  economy: buildStateEconomy(state.code, idx),
}));

const topics = {
  Health: ["Abortion", "Drug Pricing", "Medicare"],
  Economy: ["Taxes", "Trade", "Labor"],
  Security: ["Border", "Cyber", "Defense"],
  Education: ["Higher Ed", "K-12", "Loans"],
};
const partyOptions = ["Democrats", "Republicans"];

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

const publicCompanies = [
  { symbol: "AMX", name: "AmeriMax Holdings", price: 84.2, change: 1.2 },
  { symbol: "SOL", name: "Solaris Energy", price: 42.5, change: -0.4 },
  { symbol: "HLT", name: "HealTech", price: 65.1, change: 0.6 },
  { symbol: "FNB", name: "First National Bank", price: 31.9, change: 0.2 },
  { symbol: "TRN", name: "TransRoute Logistics", price: 22.4, change: -0.1 },
];

const PARTY_PAGE_SIZE = 6;

const samplePoliticians = [
  { name: "Jordan Blake", party: "Democrats", state: "CA", office: "Representative", role: "Member" },
  { name: "Taylor Quinn", party: "Republicans", state: "TX", office: "Senator", role: "Member" },
  { name: "Casey Morgan", party: "Independents", state: "FL", office: "Governor", role: "Member" },
  { name: "Alexis Hart", party: "Democrats", state: "NY", office: "Senator", role: "Member" },
  { name: "Dakota Reeves", party: "Republicans", state: "AZ", office: "Representative", role: "Member" },
];

let loggedIn = false;
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
  office: "Citizen",
  partyRole: "Member",
  description: "",
  avatar: "",
  expansions: {},
  stockHoldings: [],
};

let races = [];
let companies = [];
let bills = [];
let moneyTransfers = [];
let primaryOpen = true;
let treasury = 0;
let partyLeadership = { chair: null, vice: null, treasurer: null };
let politicians = [];
let partyPage = 1;

const cabinet = cabinetRoles.map((role) => ({ role, holder: "Vacant" }));

function currency(val, symbol = "$") {
  return `${symbol}${Number(val || 0).toLocaleString()}`;
}

function timeUntil(hours) {
  const now = Date.now();
  const cycle = hours * 3600 * 1000;
  const remaining = cycle - (now % cycle);
  const hrs = Math.floor(remaining / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  return `${hrs}h ${mins}m`;
}

function formatCountdown(timestamp) {
  if (!timestamp) return "No active vote";
  const diff = timestamp - Date.now();
  if (diff <= 0) return "Voting closed";
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hrs}h ${mins}m remaining`;
}

function formatEconomicClass(value) {
  return economicClassLabels[value] || value;
}

function upsertPolitician(record) {
  if (!record?.name) return;
  const existing = politicians.find((p) => p.name === record.name);
  if (existing) {
    Object.assign(existing, record);
  } else {
    politicians.push({
      ...record,
      avatar: player.avatar,
      description: player.description,
    });
  }
}

function seedPoliticians() {
  samplePoliticians.forEach((p) => {
    if (!politicians.find((entry) => entry.name === p.name)) {
      politicians.push({ ...p });
    }
  });
}

function saveState() {
  const payload = {
    player,
    races,
    companies,
    bills,
    moneyTransfers,
    primaryOpen,
    treasury,
    partyLeadership,
    politicians,
    loggedIn,
  };
  try {
    localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch (err) {
    console.warn("Unable to persist state", err);
  }
}

function normalizeBill(bill) {
  const normalized = { ...bill };
  normalized.chamber = bill.chamber || "House";
  normalized.topic = bill.topic || "General";
  normalized.subtopic = bill.subtopic || "General";
  normalized.outcome = bill.outcome || "";
  normalized.currentChamber = bill.currentChamber || normalized.chamber;
  normalized.nextChamber = bill.nextChamber || (normalized.chamber === "House" ? "Senate" : "House");
  normalized.stage = bill.stage || `${normalized.currentChamber} Vote`;
  normalized.status = bill.status || `Pending ${normalized.stage}`;
  normalized.votes = bill.votes || { aye: 0, nay: 0 };
  normalized.playerVote = bill.playerVote || null;
  normalized.introducedAt = bill.introducedAt || Date.now();
  normalized.expiresAt = typeof bill.expiresAt === "number" ? bill.expiresAt : (normalized.stage.includes("Vote") ? Date.now() + VOTE_WINDOW_MS : null);
  normalized.history = bill.history || [];
  return normalized;
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    player = { ...player, ...(parsed.player || {}) };
    if (Array.isArray(player.expansions)) {
      const legacy = player.expansions;
      player.expansions = legacy.reduce((acc, code) => {
        acc[code] = (acc[code] || 0) + 1;
        return acc;
      }, {});
    } else {
      player.expansions = player.expansions || {};
    }
    if (player.state && !Object.keys(player.expansions).length) {
      player.expansions[player.state] = 1;
    }
    player.stockHoldings = player.stockHoldings || [];
    races = parsed.races || [];
    companies = parsed.companies || [];
    bills = (parsed.bills || []).map((bill) => normalizeBill(bill));
    moneyTransfers = parsed.moneyTransfers || [];
    primaryOpen = parsed.primaryOpen ?? true;
    treasury = parsed.treasury ?? 0;
    partyLeadership = parsed.partyLeadership || { chair: null, vice: null, treasurer: null };
    politicians = parsed.politicians || [];
    loggedIn = parsed.loggedIn ?? false;
  } catch (err) {
    console.warn("Unable to load saved state", err);
  }
}

function setIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
  return el;
}

function ensureLoggedIn(reason = "to continue") {
  if (loggedIn) return true;
  alert(`Log in ${reason}. Redirecting now.`);
  window.location.href = "login.html";
  return false;
}

function ensureProfile(reason = "to continue") {
  if (!ensureLoggedIn(reason)) return false;
  if (player.email) return true;
  alert(`Create a profile ${reason}. Redirecting now.`);
  window.location.href = "profile.html";
  return false;
}

function isHouseMember() {
  return player.office === "Representative";
}

function isSenator() {
  return player.office === "Senator";
}

function isPresident() {
  return player.office === "President";
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
  setIfExists("heroPol", currency(player.politicalCapital));
}

function populateStates() {
  const select = document.getElementById("state");
  const searchSelect = document.getElementById("searchState");
  if (select) select.innerHTML = "";
  if (searchSelect) searchSelect.innerHTML = '<option value=\"\">Any</option>';
  stateData.forEach((state) => {
    if (select) {
      const option = document.createElement("option");
      option.value = state.code;
      option.textContent = `${state.name} (${state.code})`;
      select.appendChild(option);
    }
    if (searchSelect) {
      const sOpt = document.createElement("option");
      sOpt.value = state.code;
      sOpt.textContent = `${state.name} (${state.code})`;
      searchSelect.appendChild(sOpt);
    }
  });
}

function renderProfile() {
  const nameEl = document.getElementById("profileName");
  if (!nameEl) return;
  nameEl.textContent = player.name || "No profile yet";
  if (player.name) {
    upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
  }
  const stateFlag = stateData.find((s) => s.code === player.state);
  const flagImg = stateFlag ? `<img src="${stateFlag.flag}" alt="${stateFlag.name} flag" class="inline-flag" />` : "";
  const profileStateEl = document.getElementById("profileState");
  if (profileStateEl) {
    profileStateEl.innerHTML = player.state ? `${flagImg} ${player.state} — ${player.party}` : "Home state will appear here.";
  }
  setIfExists("capitalStat", currency(player.capital));
  setIfExists("polCapitalStat", currency(player.politicalCapital));
  setIfExists("capIncomeStat", currency(player.capitalIncome));
  setIfExists("polIncomeStat", currency(player.politicalIncome));
  setIfExists("officeLabel", player.office || "Citizen");
  setIfExists("partyRole", player.partyRole || "Member");
  const badge = document.getElementById("officeBadge");
  if (badge) badge.textContent = player.office ? player.office : "Unseated — no office yet";
  const tags = [formatEconomicClass(player.economicClass), player.religion, player.heritage, player.party]
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
  renderPartyLeadership();
}

function handleSignup(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const selectedClass = data.get("class");
  const stats = economicClasses[selectedClass];
  const chosenState = data.get("state");
  player = {
    ...player,
    email: data.get("email"),
    name: data.get("name"),
    state: chosenState,
    party: data.get("party"),
    heritage: data.get("heritage"),
    religion: data.get("religion"),
    economicClass: selectedClass,
    capital: stats.capital,
    politicalCapital: 100000,
    capitalIncome: stats.capitalIncome,
    politicalIncome: 10000,
    office: "Citizen",
    partyRole: "Member",
    expansions: { [chosenState]: 1 },
  };
  loggedIn = true;
  upsertPolitician({
    name: player.name,
    party: player.party,
    state: player.state,
    office: player.office,
    role: player.partyRole,
  });
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

function handleLogin(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const email = data.get("loginEmail");
  if (!email) return;
  if (!player.email) {
    loggedIn = true;
    saveState();
    window.location.href = "profile.html";
    return;
  }
  if (player.email !== email) {
    alert("No account found with that email. Please sign up first.");
    return;
  }
  loggedIn = true;
  saveState();
  window.location.href = "index.html";
}

function renderMap() {
  const grid = document.getElementById("mapGrid");
  if (!grid) return;
  grid.innerHTML = "";
  stateData.forEach((state) => {
    const btn = document.createElement("div");
    btn.className = "state-btn";
    btn.innerHTML = `<span class="state-flag"><img src="${state.flag}" alt="${state.name} flag" /></span><strong>${state.code}</strong><div class="subtle">${state.name}</div>`;
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

function getStateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return null;
  return stateData.find((s) => s.code === code);
}

function getExpansionStates() {
  const expansions = player.expansions || {};
  if (player.state && !expansions[player.state]) {
    expansions[player.state] = 1;
  }
  return Object.keys(expansions);
}

function getExpansionCountForState(code) {
  const expansions = player.expansions || {};
  if (player.state === code && !expansions[code]) return 1;
  return expansions[code] || 0;
}

function getTotalExpansions() {
  const expansions = player.expansions || {};
  const base = player.state && !expansions[player.state] ? 1 : 0;
  return Object.values(expansions).reduce((sum, count) => sum + count, 0) + base;
}

function calculateEmployees() {
  return getTotalExpansions() * EMPLOYEES_PER_EXPANSION;
}

function calculateExpansionCost(code) {
  const current = getExpansionCountForState(code);
  return Math.round(BASE_EXPANSION_COST * Math.pow(1.35, current));
}

function rebalanceOwners(owners, skip = "America") {
  const totalNon = Object.entries(owners).reduce((sum, [key, val]) => (key === skip ? sum : sum + Number(val || 0)), 0);
  owners[skip] = Math.max(0, 100 - totalNon);
  if (totalNon > 100) {
    const scale = 100 / totalNon;
    Object.keys(owners).forEach((key) => {
      if (key === skip) return;
      owners[key] = Number((owners[key] * scale).toFixed(2));
    });
    owners[skip] = 0;
  }
  return owners;
}

function allocateMarketShare(stateCode, sector, owner, delta) {
  const state = stateData.find((s) => s.code === stateCode);
  if (!state) return;
  const economy = state.economy;
  const owners = economy.sectors[sector]?.owners || {};
  const current = owners[owner] || 0;
  const totalNonOwner = Object.entries(owners).reduce(
    (sum, [key, val]) => (key !== "America" && key !== owner ? sum + Number(val || 0) : sum),
    0
  );
  const available = Math.max(0, 100 - totalNonOwner);
  owners[owner] = Math.min(available, current + delta);
  economy.sectors[sector].owners = rebalanceOwners(owners);
}

function calculateSectorIncome(state, sector, owner) {
  const economy = state.economy;
  const sectorShare = economy.sectors[sector]?.owners?.[owner] || 0;
  const baseRate = sectorBaseRates[sector] || 80;
  const specializationBonus = economy.specializedSector === sector ? SPECIALIZATION_BONUS : 1;
  return Math.round((economy.population / 1000) * baseRate * (sectorShare / 100) * specializationBonus);
}

function calculateCompanyFinancials(company) {
  let income = 0;
  stateData.forEach((state) => {
    const owners = state.economy.sectors[company.industry]?.owners || {};
    if (owners[company.name]) {
      income += calculateSectorIncome(state, company.industry, company.name);
    }
  });
  const expenses = company.expenses || 0;
  return { income, profit: income - expenses };
}

function expandInState(stateCode) {
  if (!ensureProfile("before expanding")) return;
  const cost = calculateExpansionCost(stateCode);
  if (player.capital < cost) return alert(`Expanding here requires ${currency(cost)}.`);
  player.capital -= cost;
  const current = getExpansionCountForState(stateCode);
  player.expansions = { ...(player.expansions || {}), [stateCode]: current + 1 };
  renderProfile();
  renderCompanies();
  renderStatePage();
  saveState();
}

function seizeMarketShare(stateCode, sector, companyName) {
  if (!ensureProfile("before seizing market")) return;
  const state = stateData.find((s) => s.code === stateCode);
  if (!state) return;
  const owners = state.economy.sectors[sector].owners;
  const remaining = Math.max(0, 100 - Object.entries(owners).reduce((sum, [, val]) => sum + Number(val || 0), 0));
  const americaShare = owners.America ?? 0;
  const available = Math.max(remaining, americaShare);
  const maxGain = available > 90 ? MAX_SEIZURE_GAIN : Math.min(MAX_SEIZURE_GAIN, available);
  const gain = Math.max(MIN_SEIZURE_GAIN, Math.min(maxGain, Math.random() * MAX_SEIZURE_GAIN));
  allocateMarketShare(stateCode, sector, companyName, gain);
  renderStatePage();
  renderCompanies();
  saveState();
}

function seizeMarketFromUI(stateCode) {
  const sector = document.getElementById("sectorSelect")?.value;
  const company = document.getElementById("companySelect")?.value;
  if (!company || !sector) return alert("Pick a sector and company first.");
  seizeMarketShare(stateCode, sector, company);
}

function moveToState(code) {
  if (!ensureProfile("before moving")) return;
  if (player.state === code) return alert("You already live here.");
  if (player.capital < MOVE_COST) return alert(`Moving requires ${currency(MOVE_COST)}.`);
  player.capital -= MOVE_COST;
  player.state = code;
  player.expansions = { ...(player.expansions || {}), [code]: Math.max(1, getExpansionCountForState(code)) };
  upsertPolitician({ name: player.name, state: player.state, party: player.party, office: player.office, role: player.partyRole });
  renderProfile();
  renderCompanies();
  renderStatePage();
  saveState();
}

function renderStatePage() {
  if (document.body.dataset.page !== "state") return;
  const container = document.getElementById("statePage");
  const state = getStateFromQuery();
  if (!container) return;
  if (!state) {
    container.innerHTML = "<div class='notice'>State not found.</div>";
    return;
  }
  const livingHere = player.state === state.code;
  const moveDisabled = player.capital < MOVE_COST;
  const econ = state.economy;
  const expandCost = calculateExpansionCost(state.code);
  const racesHtml = getElectionTiming(state)
    .map((r) => `<div class=\"stat\"><span>${r.label} race</span><strong>Every ${r.every} — next in ${r.next}</strong></div>`)
    .join("");
  const sectorsHtml = economicSectors
    .map((sector) => {
      const owners = econ.sectors[sector].owners;
      const rows = Object.entries(owners)
        .sort((a, b) => b[1] - a[1])
        .map(([owner, share]) => {
          const numericShare = Number(share || 0);
          const income = calculateSectorIncome(state, sector, owner);
          return `<div class="stat"><span>${owner}</span><strong>${numericShare.toFixed(2)}% • ${currency(income)}/hr</strong></div>`;
        })
        .join("");
      return `
        <details class="sector">
          <summary>${sector}</summary>
          ${rows || "<div class='subtle'>No owners yet.</div>"}
        </details>
      `;
    })
    .join("");
  const companyOptions = companies.map((c) => `<option value="${c.name}">${c.name} (${c.industry})</option>`).join("");
  const officials = `
    <div class="card">
      <h4>Leadership</h4>
      <div class="stat"><span>Governor</span><strong>${state.governor}</strong></div>
      <div class="stat"><span>Senators</span><strong>${state.senators.join(" • ")}</strong></div>
      <div class="stat"><span>House delegation (${state.houseSeats})</span><strong>${state.houseMembers.join(", ")}</strong></div>
    </div>
  `;
  const actions = `
    <div class="card">
      <h4>Actions</h4>
      <div class="inline-actions" style="margin-bottom:0.5rem;">
        <button type="button" onclick="signUpRace('${state.code}', 'House')" ${!livingHere ? "disabled" : ""}>Join House race ($10,000)</button>
        <button type="button" onclick="signUpRace('${state.code}', 'Senate')" ${!livingHere ? "disabled" : ""}>Join Senate race ($10,000)</button>
        <button type="button" onclick="signUpRace('${state.code}', 'Governor')" ${!livingHere ? "disabled" : ""}>Join Governor race ($10,000)</button>
      </div>
      ${livingHere ? "<p class='subtle'>You can only run where you live.</p>" : `<p class='subtle'>Move here to qualify for races.</p>`}
      <button type="button" onclick="moveToState('${state.code}')" ${livingHere || moveDisabled ? "disabled" : ""}>Move here (${currency(MOVE_COST)})</button>
      ${moveDisabled && !livingHere ? `<p class='subtle'>You need ${currency(MOVE_COST - player.capital)} more capital to move.</p>` : ""}
    </div>
  `;
  container.innerHTML = `
    <div class="panel-header" style="margin-bottom:1rem;">
      <div>
        <h2>${state.name}</h2>
        <p class="subtle">Residence required for elections. Your home: ${player.state || "None"}.</p>
      </div>
      <div class="state-flag-inline"><img src="${state.flag}" alt="${state.name} flag" /></div>
    </div>
    <div class="two-col">
      ${officials}
      <div class="card">
        <h4>Election cadence</h4>
        ${racesHtml}
        <div class="divider"></div>
        <p class="subtle">Only residents can join races in this state.</p>
      </div>
    </div>
    <section style="margin-top:1rem;">
      ${actions}
      <div class="card">
        <h4>Economy & sectors</h4>
        <div class="stat"><span>Population</span><strong>${econ.population.toLocaleString()}</strong></div>
        <div class="stat"><span>Specialized sector</span><strong>${econ.specializedSector} (+25% income)</strong></div>
        <div class="inline-actions" style="margin-bottom:0.5rem;">
          <button type="button" onclick="expandInState('${state.code}')" ${player.capital < expandCost ? "disabled" : ""}>Expand presence (${currency(expandCost)})</button>
          <div class="subtle">Costs scale with each expansion in this state.</div>
        </div>
        <div class="sector-list">${sectorsHtml}</div>
        <div class="divider"></div>
        <div class="form-grid">
          <div>
            <label for="sectorSelect">Choose sector</label>
            <select id="sectorSelect">
              ${economicSectors.map((s) => `<option>${s}</option>`).join("")}
            </select>
          </div>
          <div>
            <label for="companySelect">Pick your company</label>
            <select id="companySelect">
              ${companyOptions || "<option disabled>No companies yet</option>"}
            </select>
          </div>
        </div>
        <button type="button" style="margin-top:0.5rem;" onclick="seizeMarketFromUI('${state.code}')">Seize market share</button>
        <p class="subtle">Seizing grants between 0.1% and 2% depending on existing owners.</p>
      </div>
    </section>
  `;
}

function showState(state) {
  if (!ensureLoggedIn("before viewing state details")) return;
  window.location.href = `state.html?code=${state.code}`;
}

function renderRace() {
  const container = document.getElementById("raceContainer");
  const notice = document.getElementById("noRaceNotice");
  if (!container) return;
  container.innerHTML = "";
  if (!races.length) {
    if (notice) notice.style.display = "block";
    return;
  }
  if (notice) notice.style.display = "none";
  races.forEach((race, idx) => {
    const canSwearIn = race.polling >= 50 && (race.stage === "General" || race.type === "President");
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${race.type} — ${race.state}</h4>
      <p class="subtle">Stage: ${race.stage}</p>
      <div class="stat"><span>Polling</span><strong>${race.polling}%</strong></div>
      <div class="stat"><span>Demographics</span><strong>${race.demographicPulse}</strong></div>
      <div class="inline-actions">
        <button type="button" onclick="buyPoll(${idx})">Buy poll (-$5,000)</button>
        <button type="button" onclick="attackAd(${idx})">Attack ad (-$7,500)</button>
        <button type="button" onclick="boostSelf(${idx})">Boost self (-$5,000)</button>
        <button type="button" onclick="withdrawRace(${idx})">Withdraw</button>
        ${canSwearIn ? `<button type="button" onclick="swearIntoOffice(${idx})">Swear into office</button>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

function signUpRace(state, type) {
  if (!ensureProfile("to file for races")) return;
  if (type !== "President" && player.state !== state) {
    alert("You can only run in the state you currently live in. Move first.");
    return;
  }
  if (player.politicalCapital < 10000) {
    alert("You need $10,000 political capital to enter.");
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

function swearIntoOffice(idx) {
  const race = races[idx];
  if (race.polling < 50) return alert("You need majority polling to claim victory.");
  const officeMap = { House: "Representative", Senate: "Senator", Governor: "Governor", President: "President" };
  player.office = officeMap[race.type] || "Citizen";
  player.state = race.state;
  player.expansions = { ...(player.expansions || {}), [race.state]: Math.max(1, getExpansionCountForState(race.state)) };
  player.partyRole = player.partyRole || "Member";
  upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
  renderProfile();
  renderCompanies();
  saveState();
}

function setupIncomeButtons() {
  const convert = document.getElementById("convertCapital");
  const boostCap = document.getElementById("boostCapital");
  const boostPol = document.getElementById("boostPol");
  if (convert)
    convert.addEventListener("click", () => {
      if (!ensureProfile("before converting capital")) return;
      const converted = player.capital * 0.1;
      player.capital -= converted;
      player.politicalCapital += converted;
      renderProfile();
      saveState();
    });
  if (boostCap)
    boostCap.addEventListener("click", () => {
      if (!ensureProfile("before investing")) return;
      if (player.capital < 5000) return alert("Need $5,000 to invest.");
      player.capital -= 5000;
      player.capitalIncome += 1200;
      renderProfile();
      saveState();
    });
  if (boostPol)
    boostPol.addEventListener("click", () => {
      if (!ensureProfile("before training operatives")) return;
      if (player.politicalCapital < 3000) return alert("Need $3,000 to train operatives.");
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
    const financials = calculateCompanyFinancials(c);
    c.income = financials.income;
    const profit = financials.profit;
    const employees = calculateEmployees();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${c.name} <span class="badge">${c.industry}</span></h4>
      <p class="subtle">CEO: ${c.ceo} • ${c.shares.toLocaleString()} shares @ $${c.sharePrice}</p>
      <div class="stat"><span>Balance</span><strong>${currency(c.balance)}</strong></div>
      <div class="stat"><span>Income / hr</span><strong>${currency(c.income)}</strong></div>
      <div class="stat"><span>Profit</span><strong>${currency(profit)}</strong></div>
      <div class="stat"><span>Employees</span><strong>${employees.toLocaleString()}</strong></div>
      <div class="stat"><span>State expansions</span><strong>${getTotalExpansions()}</strong></div>
      <div class="inline-actions">
        <button type="button" onclick="issueShares(${idx})">Create more shares</button>
        <button type="button" onclick="sellShares(${idx})">Sell personal shares</button>
        <button type="button" onclick="setDividend(${idx})">Set dividend</button>
        <button type="button" onclick="withdrawCompany(${idx})">Withdraw</button>
        <button type="button" onclick="injectCompany(${idx})">Inject</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderHoldings() {
  const holdingsEl = document.getElementById("holdingList");
  if (!holdingsEl) return;
  holdingsEl.innerHTML = "";
  if (!player.stockHoldings.length) {
    holdingsEl.innerHTML = "<div class='notice'>No holdings yet.</div>";
    return;
  }
  player.stockHoldings.forEach((h) => {
    const company = publicCompanies.find((c) => c.symbol === h.symbol);
    const price = company?.price || 0;
    const value = price * h.shares;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${h.symbol} — ${company?.name || "Private"}</h4>
      <p class="subtle">${h.shares.toLocaleString()} shares @ ${currency(price)}</p>
      <div class="stat"><span>Value</span><strong>${currency(value)}</strong></div>
      <div class="inline-actions">
        <button type="button" onclick="sellStock('${h.symbol}')">Sell</button>
      </div>
    `;
    holdingsEl.appendChild(card);
  });
}

function renderPublicMarket() {
  const market = document.getElementById("publicMarket");
  if (!market) return;
  market.innerHTML = "";
  publicCompanies.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card";
    const changeClass = c.change >= 0 ? "pill" : "pill pill-warning";
    card.innerHTML = `
      <div class="flex" style="justify-content: space-between; align-items:center;">
        <h4>${c.name}</h4>
        <span class="${changeClass}">${c.symbol} ${c.change >= 0 ? "+" : ""}${c.change}%</span>
      </div>
      <div class="stat"><span>Price</span><strong>${currency(c.price)}</strong></div>
      <div class="inline-actions">
        <button type="button" onclick="buyStock('${c.symbol}')">Buy</button>
        <button type="button" onclick="sellStock('${c.symbol}')">Sell</button>
      </div>
    `;
    market.appendChild(card);
  });
}

function buyStock(symbol) {
  if (!ensureProfile("before trading")) return;
  const company = publicCompanies.find((c) => c.symbol === symbol);
  const shares = Number(prompt(`Buy how many shares of ${symbol}?`, 10) || 0);
  if (!shares) return;
  const cost = shares * (company?.price || 0);
  if (player.capital < cost) return alert("Not enough capital.");
  player.capital -= cost;
  const existing = player.stockHoldings.find((h) => h.symbol === symbol);
  if (existing) {
    existing.shares += shares;
  } else {
    player.stockHoldings.push({ symbol, shares });
  }
  renderProfile();
  renderHoldings();
  renderPublicMarket();
  saveState();
}

function sellStock(symbol) {
  if (!ensureProfile("before trading")) return;
  const holding = player.stockHoldings.find((h) => h.symbol === symbol);
  if (!holding) return alert("No holdings to sell.");
  const company = publicCompanies.find((c) => c.symbol === symbol);
  const max = holding.shares;
  const shares = Number(prompt(`Sell how many shares of ${symbol}?`, max) || 0);
  if (!shares || shares > max) return;
  holding.shares -= shares;
  const proceeds = shares * (company?.price || 0);
  player.capital += proceeds;
  if (holding.shares <= 0) {
    player.stockHoldings = player.stockHoldings.filter((h) => h.symbol !== symbol);
  }
  renderProfile();
  renderHoldings();
  renderPublicMarket();
  saveState();
}

function setupCompanyTabs() {
  const tabs = document.querySelectorAll("[data-company-tab]");
  const panels = document.querySelectorAll("[data-company-panel]");
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.companyTab;
      document.querySelector(`[data-company-panel='${target}']`)?.classList.add("active");
    });
  });
}

function createCompany(e) {
  e.preventDefault();
  if (!ensureProfile("to launch a company")) return;
  if (companies.length >= 5) return alert("CEO cap reached (5).");
  if (player.capital < 1000000) return alert("Need $1,000,000 capital to form a company.");
  const shares = Number(document.getElementById("companyShares").value || 100000);
  const income = Math.max(15000, shares / 10 + Math.random() * 20000);
  const expenses = income * 0.35;
  const foundedState = player.state || "CA";
  const company = {
    name: document.getElementById("companyName").value,
    ceo: player.name || "CEO",
    industry: document.getElementById("companyIndustry").value,
    salary: Number(document.getElementById("companySalary").value || 0),
    shares,
    sharePrice: 10,
    dividend: 0,
    bio: document.getElementById("companyBio").value,
    income,
    expenses,
    balance: Math.round(income * 2),
    foundedState,
  };
  player.capital -= 1000000;
  companies.push(company);
  allocateMarketShare(foundedState, company.industry, company.name, 1);
  renderProfile();
  renderCompanies();
  saveState();
}

function issueShares(idx) {
  if (!ensureProfile("to adjust shares")) return;
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
  if (!ensureProfile("to sell shares")) return;
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
  if (!ensureProfile("to set dividends")) return;
  const rate = Number(prompt("Dividend per share", companies[idx].dividend || 0) || 0);
  companies[idx].dividend = rate;
  renderCompanies();
  saveState();
}

function withdrawCompany(idx) {
  if (!ensureProfile("to withdraw")) return;
  const company = companies[idx];
  const amount = Number(prompt("Withdraw how much from the company?", 5000) || 0);
  if (!amount || amount > company.balance) return alert("Insufficient company funds.");
  company.balance -= amount;
  player.capital += amount;
  renderProfile();
  renderCompanies();
  saveState();
}

function injectCompany(idx) {
  if (!ensureProfile("to inject capital")) return;
  const company = companies[idx];
  const amount = Number(prompt("Inject how much personal capital?", 5000) || 0);
  if (!amount || amount > player.capital) return alert("Not enough personal capital.");
  player.capital -= amount;
  company.balance += amount;
  renderProfile();
  renderCompanies();
  saveState();
}

function setupFederal() {
  const table = document.getElementById("cabinetTable");
  if (!table) return;
  table.innerHTML =
    "<tr><th>Role</th><th>Holder</th></tr>" +
    cabinet
      .map((slot) => `<tr><td>${slot.role}</td><td>${slot.holder}</td></tr>`)
      .join("");
  const registerBtn = document.getElementById("registerPresident");
  if (registerBtn)
    registerBtn.addEventListener("click", () => {
      if (!ensureProfile("to register")) return;
      if (player.party === "Independents") {
        alert("Independents cannot run in primaries.");
        return;
      }
      signUpRace("USA", "President");
      setIfExists("presStatus", "Registered");
      saveState();
    });
  const spendBtn = document.getElementById("spendState");
  if (spendBtn)
    spendBtn.addEventListener("click", () => {
      if (!ensureProfile("before spending capital")) return;
      if (!races.find((r) => r.type === "President")) return alert("Register first.");
      if (player.capital < 25000) return alert("Spend requires $25,000.");
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

function getBillChamberForStage(bill) {
  if (bill.stage === "House Vote") return "House";
  if (bill.stage === "Senate Vote") return "Senate";
  return bill.currentChamber || bill.chamber;
}

function evaluateBill(bill) {
  if (!bill.stage.includes("Vote") || !bill.expiresAt) return;
  if (Date.now() < bill.expiresAt) return;
  const chamber = getBillChamberForStage(bill);
  const passed = bill.votes.aye > bill.votes.nay;
  bill.history.push(`${chamber} vote closed ${bill.votes.aye}-${bill.votes.nay}`);
  if (!passed) {
    bill.stage = "Failed";
    bill.status = `Failed in the ${chamber} (${bill.votes.aye}-${bill.votes.nay})`;
    bill.expiresAt = null;
    return;
  }

  if (bill.currentChamber === bill.chamber) {
    bill.currentChamber = bill.nextChamber;
    bill.stage = `${bill.nextChamber} Vote`;
    bill.status = `Sent to the ${bill.nextChamber} for a 24h vote`;
    bill.votes = { aye: 0, nay: 0 };
    bill.playerVote = null;
    bill.expiresAt = Date.now() + VOTE_WINDOW_MS;
  } else {
    bill.stage = "Awaiting President";
    bill.status = "Awaiting presidential signature or veto";
    bill.expiresAt = null;
  }
}

function castVote(idx, side) {
  const bill = bills[idx];
  if (!ensureProfile("to vote")) return;
  const chamber = getBillChamberForStage(bill);
  if (chamber === "House" && !isHouseMember()) return alert("Only House members can vote on House bills.");
  if (chamber === "Senate" && !isSenator()) return alert("Only Senators can vote on Senate bills.");
  if (!bill.stage.includes("Vote")) return alert("This bill is not in an active vote.");
  if (Date.now() > (bill.expiresAt || 0)) {
    evaluateBill(bill);
    renderBillContainers();
    saveState();
    return;
  }
  if (bill.playerVote) return alert("You already cast a vote on this bill.");
  bill.votes[side] += 1;
  bill.playerVote = side;
  renderBillContainers();
  saveState();
}

function submitBillFromForm({ chamber, topicSelect, subtopicSelect, outcomeSelect, bodySelector }) {
  if (!ensureProfile("to introduce legislation")) return;
  if (chamber === "House" && !isHouseMember()) return alert("Only House members can introduce House bills.");
  if (chamber === "Senate" && !isSenator()) return alert("Only Senators can introduce Senate bills.");
  const topic = topicSelect?.value;
  const subtopic = subtopicSelect?.value;
  const title = `${topic}: ${subtopic}`;
  const body = bodySelector ? document.querySelector(bodySelector)?.innerHTML : "";
  const bill = normalizeBill({
    title,
    chamber,
    topic,
    subtopic,
    outcome: outcomeSelect?.value,
    status: `Filed in the ${chamber}`,
    stage: `${chamber} Vote`,
    votes: { aye: 0, nay: 0 },
    expiresAt: Date.now() + VOTE_WINDOW_MS,
    body,
    history: [`${chamber} filed by ${player.name || "Member"}`],
  });
  bills.unshift(bill);
  renderBillContainers();
  saveState();
}

function signBill(idx) {
  const bill = bills[idx];
  if (!ensureProfile("to sign bills")) return;
  if (!isPresident()) return alert("Only the President can sign bills.");
  if (bill.stage !== "Awaiting President") return alert("This bill is not ready for signature.");
  bill.stage = "Enacted";
  bill.status = "Signed into law";
  bill.history.push("Signed by the President");
  saveState();
  renderBillContainers();
}

function vetoBill(idx) {
  const bill = bills[idx];
  if (!ensureProfile("to veto bills")) return;
  if (!isPresident()) return alert("Only the President can veto bills.");
  if (bill.stage !== "Awaiting President") return alert("This bill is not eligible for veto.");
  bill.stage = "Vetoed";
  bill.status = "Vetoed — returned to origin";
  bill.history.push("Vetoed by the President");
  saveState();
  renderBillContainers();
}

function populateBillTopics(topicSelect, subtopicSelect) {
  if (!topicSelect || !subtopicSelect) return;
  topicSelect.innerHTML = "";
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
  if (!select) return;
  select.innerHTML = "";
  (topics[topic] || []).forEach((sub) => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    select.appendChild(opt);
  });
}

function setupBillForm({ formId, topicId, subtopicId, outcomeId, bodySelector, chamber }) {
  const form = document.getElementById(formId);
  if (!form) return;
  const topicSelect = document.getElementById(topicId);
  const subtopicSelect = document.getElementById(subtopicId);
  const outcomeSelect = document.getElementById(outcomeId);
  populateBillTopics(topicSelect, subtopicSelect);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBillFromForm({ chamber, topicSelect, subtopicSelect, outcomeSelect, bodySelector });
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
    if (!ensureProfile("to adjust party dues")) return;
    if (partyLeadership.chair !== player.name) {
      alert("Only the chair can set the party tithe.");
      rate.value = rate.dataset.last || rate.value;
      return;
    }
    label.textContent = `${rate.value}%`;
    rate.dataset.last = rate.value;
    treasury += Number(rate.value) * 100;
    renderTreasury();
    saveState();
  });
  const chairBtn = document.getElementById("electChair");
  if (chairBtn)
    chairBtn.addEventListener("click", () => {
      if (!ensureProfile("to run the party")) return;
      const name = document.getElementById("chairInput").value || player.name;
      if (partyLeadership.chair && partyLeadership.chair !== player.name) return alert("Only the current chair can change leadership.");
      partyLeadership.chair = name;
      if (name === player.name) player.partyRole = "Chair";
      upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
      renderPartyLeadership();
      saveState();
    });
  const viceBtn = document.getElementById("appointVice");
  if (viceBtn)
    viceBtn.addEventListener("click", () => {
      if (!ensureProfile("to appoint")) return;
      if (partyLeadership.chair !== player.name) return alert("Only the chair can appoint the Vice-Chair.");
      const name = document.getElementById("chairInput").value || "Vice";
      partyLeadership.vice = name;
      if (name === player.name) player.partyRole = "Vice-Chair";
      upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
      renderPartyLeadership();
      saveState();
    });
  const treasurerBtn = document.getElementById("appointTreasurer");
  if (treasurerBtn)
    treasurerBtn.addEventListener("click", () => {
      if (!ensureProfile("to appoint")) return;
      if (partyLeadership.chair !== player.name) return alert("Only the chair can appoint the Treasurer.");
      const name = document.getElementById("chairInput").value || "Treasurer";
      partyLeadership.treasurer = name;
      if (name === player.name) player.partyRole = "Treasurer";
      upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
      renderPartyLeadership();
      saveState();
    });
  const withdrawForm = document.getElementById("withdrawForm");
  if (withdrawForm)
    withdrawForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!ensureProfile("to withdraw funds")) return;
      if (![partyLeadership.treasurer, partyLeadership.chair].includes(player.name)) return alert("Only the chair or treasurer can withdraw.");
      const amount = Number(document.getElementById("withdrawAmount").value || 0);
      if (amount > treasury) return alert("Insufficient party funds.");
      treasury -= amount;
      player.politicalCapital += amount;
      renderTreasury();
      renderProfile();
      saveState();
    });
}

function renderPartyLeadership() {
  const chair = partyLeadership.chair || "Vacant";
  const vice = partyLeadership.vice || "Vacant";
  const treasurer = partyLeadership.treasurer || "Vacant";
  setIfExists("chairLabel", chair);
  setIfExists("viceLabel", vice);
  setIfExists("treasurerLabel", treasurer);
  const chairAvatar = document.getElementById("chairAvatar");
  const viceAvatar = document.getElementById("viceAvatar");
  const treasurerAvatar = document.getElementById("treasurerAvatar");
  if (chairAvatar) chairAvatar.textContent = chair.slice(0, 1);
  if (viceAvatar) viceAvatar.textContent = vice.slice(0, 1);
  if (treasurerAvatar) treasurerAvatar.textContent = treasurer.slice(0, 1);
  renderTreasury();
}

function joinParty(name) {
  if (!ensureProfile("to join a party")) return;
  if (player.party === name) return alert(`You are already a member of the ${name}.`);
  if ([partyLeadership.chair, partyLeadership.vice, partyLeadership.treasurer].includes(player.name)) {
    partyLeadership = { chair: null, vice: null, treasurer: null };
  }
  player.party = name;
  player.partyRole = "Member";
  upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
  renderProfile();
  renderPartyLeadership();
  renderPartiesPage();
  saveState();
}

function leaveParty() {
  if (!ensureProfile("to leave a party")) return;
  if (player.party === "Independents") return alert("You are already independent.");
  if ([partyLeadership.chair, partyLeadership.vice, partyLeadership.treasurer].includes(player.name)) {
    partyLeadership = { chair: null, vice: null, treasurer: null };
  }
  player.party = "Independents";
  player.partyRole = "Member";
  upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
  renderProfile();
  renderPartyLeadership();
  renderPartiesPage();
  saveState();
}

function renderPartiesPage() {
  if (document.body.dataset.page !== "parties") return;
  const list = document.getElementById("partyList");
  const status = document.getElementById("partyStatus");
  if (status) status.textContent = player.party ? `You are currently a ${player.party} member.` : "No party chosen.";
  if (list) {
    list.innerHTML = "";
    partyOptions.forEach((party) => {
      const card = document.createElement("div");
      card.className = "card";
      const isMember = player.party === party;
      card.innerHTML = `
        <h4>${party}</h4>
        <p class="subtle">Switch parties at any time. Leaving sends you to Independents.</p>
        <div class="inline-actions">
          <button type="button" onclick="joinParty('${party}')" ${isMember ? "disabled" : ""}>Join ${party}</button>
        </div>
      `;
      list.appendChild(card);
    });
    const leaveCard = document.createElement("div");
    leaveCard.className = "card";
    leaveCard.innerHTML = `
      <h4>Leave your party</h4>
      <p class="subtle">Leaving makes you an Independent instantly.</p>
      <button type="button" onclick="leaveParty()" ${player.party === "Independents" ? "disabled" : ""}>Become Independent</button>
    `;
    list.appendChild(leaveCard);
  }
  const search = document.getElementById("partySearch");
  const prev = document.getElementById("prevPage");
  const next = document.getElementById("nextPage");
  if (search && !search.dataset.bound) {
    search.addEventListener("input", () => {
      partyPage = 1;
      renderPartyMembers();
    });
    search.dataset.bound = "true";
  }
  if (prev && !prev.dataset.bound) {
    prev.addEventListener("click", () => {
      partyPage = Math.max(1, partyPage - 1);
      renderPartyMembers();
    });
    prev.dataset.bound = "true";
  }
  if (next && !next.dataset.bound) {
    next.addEventListener("click", () => {
      partyPage += 1;
      renderPartyMembers();
    });
    next.dataset.bound = "true";
  }
  renderPartyMembers();
}

function renderTreasury() {
  setIfExists("treasuryBalance", currency(treasury));
  const isExecutive = [partyLeadership.chair, partyLeadership.vice, partyLeadership.treasurer].includes(player.name);
  document.querySelectorAll(".executive-only").forEach((panel) => {
    panel.style.display = isExecutive ? "block" : "none";
  });
}

function renderPartyMembers() {
  const container = document.getElementById("partyMembers");
  if (!container) return;
  const query = document.getElementById("partySearch")?.value?.toLowerCase() || "";
  const roster = politicians.filter((p) => p.party === player.party);
  const filtered = roster.filter((p) => !query || p.name.toLowerCase().includes(query));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PARTY_PAGE_SIZE));
  partyPage = Math.min(Math.max(1, partyPage), totalPages);
  const start = (partyPage - 1) * PARTY_PAGE_SIZE;
  const slice = filtered.slice(start, start + PARTY_PAGE_SIZE);
  container.innerHTML = "";
  if (!slice.length) {
    container.innerHTML = "<div class='notice'>No members found.</div>";
    return;
  }
  slice.forEach((member) => {
    const state = stateData.find((s) => s.code === member.state);
    const flag = state ? `<img src='${state.flag}' alt='${member.state}' class='inline-flag' />` : "";
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${member.name}</h4>
      <p class="subtle">${flag} ${member.state || "Unknown"} • ${member.office || "Citizen"}</p>
      <div class="stat"><span>Role</span><strong>${member.role || "Member"}</strong></div>
    `;
    container.appendChild(card);
  });
}

function setupMoneyTransfers() {
  const form = document.getElementById("sendMoneyForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!ensureProfile("to send funds")) return;
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
  setupEditor("#houseBillForm .editor-toolbar", "#houseBillBody");
  setupEditor("#senateBillForm .editor-toolbar", "#senateBillBody");
}

function renderSearchResults() {
  if (document.body.dataset.page !== "search") return;
  const container = document.getElementById("searchResults");
  if (!container) return;
  const nameFilter = document.getElementById("searchName")?.value?.toLowerCase() || "";
  const partyFilter = document.getElementById("searchParty")?.value || "";
  const stateFilter = document.getElementById("searchState")?.value || "";
  const officeFilter = document.getElementById("searchOffice")?.value || "";
  const filtered = politicians.filter((p) => {
    const matchesName = !nameFilter || p.name.toLowerCase().includes(nameFilter);
    const matchesParty = !partyFilter || p.party === partyFilter;
    const matchesState = !stateFilter || p.state === stateFilter;
    const matchesOffice = !officeFilter || p.office === officeFilter;
    return matchesName && matchesParty && matchesState && matchesOffice;
  });
  container.innerHTML = "";
  if (!filtered.length) {
    container.innerHTML = "<div class='notice'>No politicians match those filters.</div>";
    return;
  }
  filtered.forEach((p) => {
    const state = stateData.find((s) => s.code === p.state);
    const flag = state ? `<img src='${state.flag}' alt='${p.state}' class='inline-flag' />` : "";
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${p.name}</h4>
      <p class="subtle">${flag} ${p.state || "Unknown"} • ${p.party}</p>
      <div class="stat"><span>Position</span><strong>${p.office || "Citizen"}</strong></div>
      <div class="stat"><span>Role</span><strong>${p.role || "Member"}</strong></div>
    `;
    container.appendChild(card);
  });
}

function setupSearchFilters() {
  if (document.body.dataset.page !== "search") return;
  const inputs = ["searchName", "searchParty", "searchState", "searchOffice"].map((id) => document.getElementById(id)).filter(Boolean);
  inputs.forEach((input) => input.addEventListener("input", renderSearchResults));
  renderSearchResults();
}

function renderBillContainers() {
  const containers = document.querySelectorAll("[data-bill-list]");
  if (!containers.length) return;
  bills.forEach((bill) => evaluateBill(bill));
  containers.forEach((container) => {
    const scope = container.dataset.scope || "all";
    let filtered = bills;
    if (scope === "house") filtered = bills.filter((b) => b.chamber === "House" || b.stage === "House Vote");
    if (scope === "senate") filtered = bills.filter((b) => b.chamber === "Senate" || b.stage === "Senate Vote");
    container.innerHTML = "";
    if (!filtered.length) {
      container.innerHTML = '<div class="notice">No bills filed yet.</div>';
      return;
    }
    filtered.forEach((bill, idx) => {
      const globalIdx = bills.indexOf(bill);
      const chamberForStage = getBillChamberForStage(bill);
      const voteOpen = bill.stage.includes("Vote") && (!bill.expiresAt || Date.now() < bill.expiresAt);
      const actions = [];
      if (bill.stage === "House Vote") {
        actions.push(`<button type="button" onclick="castVote(${globalIdx}, 'aye')" ${!isHouseMember() || !voteOpen ? "disabled" : ""}>Aye</button>`);
        actions.push(`<button type="button" onclick="castVote(${globalIdx}, 'nay')" ${!isHouseMember() || !voteOpen ? "disabled" : ""}>Nay</button>`);
      }
      if (bill.stage === "Senate Vote") {
        actions.push(`<button type="button" onclick="castVote(${globalIdx}, 'aye')" ${!isSenator() || !voteOpen ? "disabled" : ""}>Aye</button>`);
        actions.push(`<button type="button" onclick="castVote(${globalIdx}, 'nay')" ${!isSenator() || !voteOpen ? "disabled" : ""}>Nay</button>`);
      }
      if (bill.stage === "Awaiting President") {
        actions.push(`<button type="button" onclick="signBill(${globalIdx})" ${!isPresident() ? "disabled" : ""}>Sign</button>`);
        actions.push(`<button type="button" onclick="vetoBill(${globalIdx})" ${!isPresident() ? "disabled" : ""}>Veto</button>`);
      }
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h4>${bill.title}</h4>
        <p class="subtle">${bill.chamber} origin • ${bill.topic} / ${bill.subtopic} • Outcome: ${bill.outcome}</p>
        <div class="stat"><span>Status</span><strong>${bill.status}</strong></div>
        <div class="stat"><span>Stage</span><strong>${bill.stage}</strong></div>
        <div class="stat"><span>Vote (${chamberForStage})</span><strong>${bill.votes.aye} aye / ${bill.votes.nay} nay</strong></div>
        <div class="stat"><span>Clock</span><strong>${formatCountdown(bill.expiresAt)}</strong></div>
        <div class="inline-actions">${actions.join("") || "<span class='subtle'>No actions available</span>"}</div>
      `;
      container.appendChild(card);
    });
  });
}

function enforceProfileGate() {
  const page = document.body.dataset.page;
  if (page !== "login" && !loggedIn) {
    window.location.href = "login.html";
    return false;
  }
  if (page === "profile" || page === "login") return true;
  if (!player.email) {
    ensureProfile("before exploring other pages");
    return false;
  }
  return true;
}

function init() {
  loadState();
  seedPoliticians();
  const gatePassed = enforceProfileGate();
  if (gatePassed === false) return;
  populateStates();
  renderProfile();
  renderMap();
  renderPartiesPage();
  renderStatePage();
  renderRace();
  renderCompanies();
  renderHoldings();
  renderPublicMarket();
  setupCompanyTabs();
  setupIncomeButtons();
  setupFederal();
  renderBillContainers();
  setupParty();
  renderTreasury();
  setupMoneyTransfers();
  renderMoneyLog();
  setupRTEs();
  setupSearchFilters();
  hydrateLanding();
  setupBillForm({
    formId: "houseBillForm",
    topicId: "houseBillTopic",
    subtopicId: "houseBillSubtopic",
    outcomeId: "houseBillOutcome",
    bodySelector: "#houseBillBody",
    chamber: "House",
  });
  setupBillForm({
    formId: "senateBillForm",
    topicId: "senateBillTopic",
    subtopicId: "senateBillSubtopic",
    outcomeId: "senateBillOutcome",
    bodySelector: "#senateBillBody",
    chamber: "Senate",
  });

  const signup = document.getElementById("signupForm");
  if (signup) signup.addEventListener("submit", handleSignup);
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  const company = document.getElementById("companyForm");
  if (company) company.addEventListener("submit", createCompany);

  setInterval(() => {
    races.forEach((race) => {
      if (race.stage === "Primary") {
        race.stage = race.type === "President" && !primaryOpen ? "General" : "Primary";
      }
    });
    renderRace();
    renderBillContainers();
    saveState();
  }, 30000);

  if (primaryOpen) setTimeout(advanceGeneral, 20000);
}

window.addEventListener("DOMContentLoaded", init);
