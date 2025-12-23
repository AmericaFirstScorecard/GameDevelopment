const storageKey = "civic-strategy-state";
const VOTE_WINDOW_MS = 24 * 60 * 60 * 1000;
const MOVE_COST = 100000;
const EMPLOYEES_PER_EXPANSION = 750;
const SPECIALIZATION_BONUS = 1.25;
const BASE_EXPANSION_COST = 150000;
const MIN_SEIZURE_GAIN = 0.1;
const MAX_SEIZURE_GAIN = 2;
const ELECTION_DURATION_MS = 72 * 60 * 60 * 1000;

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

function buildDefaultPlayer(overrides = {}) {
  return {
    email: "",
    username: "",
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
    ...overrides,
  };
}

function buildEmptyAccount(overrides = {}) {
  const basePlayer = buildDefaultPlayer(overrides.player || overrides);
  return {
    id: `acct-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: basePlayer.email,
    username: basePlayer.username,
    player: basePlayer,
    races: [],
    companies: [],
    moneyTransfers: [],
    lastPayoutAt: Date.now(),
  };
}

function buildStateEconomy(code, idx) {
  const population = statePopulations[code] || 5500000;
  const specializedSector = stateSpecialties[code] || economicSectors[idx % economicSectors.length];
  const sectors = economicSectors.reduce((acc, sector) => {
    acc[sector] = { owners: { America: 100 } };
    return acc;
  }, {});
  return { population, specializedSector, sectors };
}

function buildSenateClasses(idx) {
  const first = (idx % 3) + 1;
  const second = ((idx + 1) % 3) + 1;
  return [first, second];
}

const baseStateData = baseStates.map((state, idx) => {
  const senateClasses = buildSenateClasses(idx);
  return {
    ...state,
    flag: `logos/${state.code.toLowerCase()}.png`,
    governor: { name: "Vacant", avatar: "" },
    senators: senateClasses.map((cls) => ({ class: cls, name: "Vacant", avatar: "" })),
    senateClasses,
    houseDelegation: [],
    economy: buildStateEconomy(state.code, idx),
  };
});

function cloneStateData() {
  return JSON.parse(JSON.stringify(baseStateData));
}

let stateData = cloneStateData();

function applyStateLeadership() {
  Object.entries(stateLeadership || {}).forEach(([code, leadership]) => {
    const state = stateData.find((s) => s.code === code);
    if (!state) return;
    if (leadership.governor) state.governor = leadership.governor;
    if (leadership.senators) state.senators = leadership.senators;
    if (leadership.houseDelegation) state.houseDelegation = leadership.houseDelegation;
  });
}

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
  {
    symbol: "AMX",
    name: "AmeriMax Holdings",
    price: 84.2,
    change: 1.2,
    dividendYield: 2.1,
    sector: "Technology",
    priceHistory: [40, 44, 48, 55, 62, 70, 74, 79, 83, 84.2],
  },
  {
    symbol: "SOL",
    name: "Solaris Energy",
    price: 42.5,
    change: -0.4,
    dividendYield: 1.4,
    sector: "Energy",
    priceHistory: [25, 26, 30, 32, 35, 38, 41, 44, 43, 42.5],
  },
  {
    symbol: "HLT",
    name: "HealTech",
    price: 65.1,
    change: 0.6,
    dividendYield: 1.8,
    sector: "Healthcare",
    priceHistory: [30, 35, 36, 42, 48, 52, 56, 60, 63, 65.1],
  },
  {
    symbol: "FNB",
    name: "First National Bank",
    price: 31.9,
    change: 0.2,
    dividendYield: 2.8,
    sector: "Finance",
    priceHistory: [18, 19, 21, 24, 27, 29, 30, 31, 31.5, 31.9],
  },
  {
    symbol: "TRN",
    name: "TransRoute Logistics",
    price: 22.4,
    change: -0.1,
    dividendYield: 1.1,
    sector: "Logistics",
    priceHistory: [12, 13, 14, 16, 17, 18, 19, 21, 22, 22.4],
  },
];

const PARTY_PAGE_SIZE = 6;

let loggedIn = false;
let accounts = [];
let activeAccountId = null;
let player = buildDefaultPlayer();
let races = [];
let companies = [];
let bills = [];
let moneyTransfers = [];
let primaryOpen = true;
let partyTreasuries = {};
let partyDirectory = partyOptions.reduce((acc, name) => {
  acc[name] = { chair: null, vice: null, treasurer: null };
  return acc;
}, {});
let politicians = [];
let playerDirectory = {};
let partyPage = 1;
let selectedParty = partyOptions[0];
let sessionLastPayoutAt = 0;
let stateRaceBoard = {};
let stateLeadership = {};
let viewingProfile = null;

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

function formatRaceClock(timestamp) {
  if (!timestamp) return "No timer set";
  const diff = timestamp - Date.now();
  if (diff <= 0) return "Completed";
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hrs}h ${mins}m left`;
}

function notifyAction(message) {
  alert(message);
}

function formatEconomicClass(value) {
  return economicClassLabels[value] || value;
}

function isValidPersonName(name) {
  return typeof name === "string" && /^[A-Za-z]+(?: [A-Za-z]+)+$/.test(name.trim());
}

function findPlayerByIdentifier(identifier) {
  if (!identifier) return null;
  const lower = identifier.toLowerCase();
  return getRealPlayers().find((p) => p.name?.toLowerCase() === lower || p.username?.toLowerCase() === lower) || null;
}

function getCompanyEconomyKey(company, ownerIdentifier) {
  const owner = ownerIdentifier || company.owner || company.ownerKey || company.ceo || "player";
  return `${company.name} (${owner})`;
}

function snapshotCompany(company, ownerIdentifier) {
  const normalized = {
    ...company,
    expansions: { ...(company.expansions || {}) },
  };
  normalized.economyKey = company.economyKey || getCompanyEconomyKey(company, ownerIdentifier);
  normalized.owner = company.owner || ownerIdentifier;
  return normalized;
}

function snapshotPlayerProfile(sourcePlayer = player, sourceCompanies = companies, sourceRaces = races) {
  if (!sourcePlayer?.name && !sourcePlayer?.username) return null;
  return {
    name: sourcePlayer.name,
    username: sourcePlayer.username,
    party: sourcePlayer.party,
    state: sourcePlayer.state,
    office: sourcePlayer.office,
    partyRole: sourcePlayer.partyRole,
    economicClass: sourcePlayer.economicClass,
    description: sourcePlayer.description,
    avatar: sourcePlayer.avatar,
    capital: sourcePlayer.capital,
    capitalIncome: sourcePlayer.capitalIncome,
    politicalCapital: sourcePlayer.politicalCapital,
    politicalIncome: sourcePlayer.politicalIncome,
    companies: (sourceCompanies || []).map((c) => snapshotCompany(c, sourcePlayer.username || sourcePlayer.name)),
    races: (sourceRaces || []).map((r) => ({ ...r })),
  };
}

function publishPlayerProfile() {
  const snapshot = snapshotPlayerProfile();
  if (!snapshot) return;
  const key = snapshot.username || snapshot.name;
  playerDirectory[key] = snapshot;
}

function getRealPlayers() {
  const directoryPlayers = Object.values(playerDirectory || {});
  const politicianPlayers = (politicians || [])
    .filter((p) => p.name && isValidPersonName(p.name))
    .map((p) => ({ name: p.name, username: p.username, party: p.party, state: p.state, office: p.office, partyRole: p.role }));
  const combined = [...directoryPlayers, ...politicianPlayers];
  const seen = new Set();
  return combined.filter((p) => {
    const key = (p.username || p.name || "").toLowerCase();
    if (!key || seen.has(key) || !isValidPersonName(p.name)) return false;
    seen.add(key);
    return true;
  });
}

function resolveRealPlayer(identifier) {
  const record = findPlayerByIdentifier(identifier);
  if (!record || !isValidPersonName(record.name)) return null;
  return record;
}

function renderPlayerSuggestions() {
  const list = document.getElementById("playerSuggestions");
  if (!list) return;
  list.innerHTML = "";
  getRealPlayers().forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.label = p.username ? `@${p.username}` : p.party || "Player";
    list.appendChild(opt);
  });
}

function renderAvatarPreview(previewId, src, fallback = "Upload an image") {
  const el = document.getElementById(previewId);
  if (!el) return;
  if (src) {
    el.innerHTML = `<img src="${src}" alt="avatar" />`;
  } else {
    el.textContent = fallback;
  }
}

function renderPersonLink(name, username, className = "") {
  if (!name) return "Vacant";
  const target = encodeURIComponent(username || name);
  const cls = className ? ` class="${className}"` : "";
  return `<a href="profile.html?user=${target}"${cls}>${name}</a>`;
}

function upsertPolitician(record) {
  if (!record?.name || !isValidPersonName(record.name)) return;
  const existing = politicians.find((p) => p.name === record.name);
  if (existing) {
    Object.assign(existing, record);
  } else {
    politicians.push({
      ...record,
      username: record.username || player.username,
      avatar: player.avatar,
      description: player.description,
      isPlayer: true,
    });
  }
  renderPlayerSuggestions();
}

function getActiveAccount() {
  return accounts.find((acct) => acct.id === activeAccountId) || null;
}

function hydrateActiveAccount() {
  const account = getActiveAccount();
  if (account) {
    player = buildDefaultPlayer(account.player);
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
    races = account.races || [];
    companies = (account.companies || []).map((company) => ({
      ...company,
      expansions: company.expansions || {},
    }));
    companies.forEach((company) => {
      company.owner = company.owner || player.username || player.name;
      company.economyKey = company.economyKey || getCompanyEconomyKey(company, company.owner);
    });
    moneyTransfers = account.moneyTransfers || [];
    sessionLastPayoutAt = account.lastPayoutAt || Date.now();
    publishPlayerProfile();
  } else {
    player = buildDefaultPlayer();
    races = [];
    companies = [];
    moneyTransfers = [];
    sessionLastPayoutAt = Date.now();
  }
  rebuildEconomyFromDirectory();
}

function syncActiveAccount() {
  const safePlayer = buildDefaultPlayer(player);
  if (Array.isArray(safePlayer.expansions)) {
    const legacy = safePlayer.expansions;
    safePlayer.expansions = legacy.reduce((acc, code) => {
      acc[code] = (acc[code] || 0) + 1;
      return acc;
    }, {});
  }
  safePlayer.expansions = safePlayer.expansions || {};
  safePlayer.stockHoldings = safePlayer.stockHoldings || [];
  let account = getActiveAccount();
  if (!account && loggedIn) {
    account = buildEmptyAccount({ player: safePlayer });
    accounts.push(account);
    activeAccountId = account.id;
  }
  if (account) {
    account.player = safePlayer;
    account.email = safePlayer.email;
    account.username = safePlayer.username;
    account.races = races;
    account.companies = companies;
    account.moneyTransfers = moneyTransfers;
    account.lastPayoutAt = sessionLastPayoutAt || Date.now();
  }
  publishPlayerProfile();
  rebuildEconomyFromDirectory();
}

function saveState() {
  syncActiveAccount();
  const payload = {
    accounts,
    activeAccountId,
    bills,
    moneyTransfers,
    primaryOpen,
    partyTreasuries,
    partyDirectory,
    politicians,
    playerDirectory,
    loggedIn,
    stateRaceBoard,
    stateLeadership,
    lastPayoutAt: sessionLastPayoutAt,
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

function backfillDirectoryFromAccounts() {
  accounts.forEach((acct) => {
    const snapshot = snapshotPlayerProfile(acct.player, acct.companies, acct.races);
    if (!snapshot) return;
    const key = snapshot.username || snapshot.name;
    if (!playerDirectory[key]) {
      playerDirectory[key] = snapshot;
    }
  });
}

function rebuildEconomyFromDirectory() {
  stateData = cloneStateData();
  applyStateLeadership();
  const profiles = getRealPlayers();
  profiles.forEach((profile) => {
    (profile.companies || []).forEach((company) => {
      const normalized = snapshotCompany(company, profile.username || profile.name);
      Object.entries(normalized.expansions || {}).forEach(([code, count]) => {
        for (let i = 0; i < count; i++) {
          allocateMarketShare(code, normalized.industry, normalized.economyKey, 2 + i * 0.75);
        }
      });
    });
  });
  companies.forEach((company) => {
    company.economyKey = company.economyKey || getCompanyEconomyKey(company, player.username || player.name);
    const financials = calculateCompanyFinancials(company);
    company.income = financials.income;
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    accounts = parsed.accounts || [];
    bills = (parsed.bills || []).map((bill) => normalizeBill(bill));
    moneyTransfers = parsed.moneyTransfers || [];
    primaryOpen = parsed.primaryOpen ?? true;
    partyTreasuries = parsed.partyTreasuries || {};
    partyDirectory = parsed.partyDirectory || partyDirectory;
    playerDirectory = parsed.playerDirectory || {};
    stateRaceBoard = parsed.stateRaceBoard || {};
    stateLeadership = parsed.stateLeadership || {};
    loggedIn = parsed.loggedIn ?? false;
    activeAccountId = parsed.activeAccountId || null;
    if (!accounts.length && parsed.player) {
      const legacyAccount = buildEmptyAccount({ player: parsed.player });
      legacyAccount.races = parsed.races || [];
      legacyAccount.companies = (parsed.companies || []).map((company) => ({
        ...company,
        expansions: company.expansions || {},
      }));
      legacyAccount.moneyTransfers = parsed.moneyTransfers || [];
      legacyAccount.lastPayoutAt = parsed.lastPayoutAt || Date.now();
      accounts.push(legacyAccount);
      activeAccountId = legacyAccount.id;
    }
    if (accounts.length && !activeAccountId) activeAccountId = accounts[0].id;
    backfillDirectoryFromAccounts();
    hydrateActiveAccount();
    politicians = (parsed.politicians || []).filter((p) => p.username || (player.name && p.name === player.name));
    sessionLastPayoutAt = sessionLastPayoutAt || parsed.lastPayoutAt || Date.now();
    rebuildEconomyFromDirectory();
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
  if (loggedIn && getActiveAccount()) return true;
  loggedIn = false;
  activeAccountId = null;
  alert(`Log in ${reason}. Redirecting now.`);
  window.location.href = "login.html";
  return false;
}

function ensureProfile(reason = "to continue") {
  if (!ensureLoggedIn(reason)) return false;
  if (player.email && player.username) return true;
  alert(`Create an account ${reason}. Redirecting now.`);
  window.location.href = "login.html";
  return false;
}

function getPartyRecord(name = player.party) {
  if (!partyDirectory[name]) {
    partyDirectory[name] = { chair: null, vice: null, treasurer: null };
  }
  return partyDirectory[name];
}

function getPartyTreasury(name = player.party) {
  if (!partyTreasuries[name]) partyTreasuries[name] = 0;
  return partyTreasuries[name];
}

function setPartyTreasury(name, amount) {
  partyTreasuries[name] = Math.max(0, amount);
}

function logout() {
  loggedIn = false;
  activeAccountId = null;
  player = buildDefaultPlayer();
  races = [];
  companies = [];
  moneyTransfers = [];
  saveState();
  window.location.href = "login.html";
}

function hydrateViewingProfileFromQuery() {
  if (document.body.dataset.page !== "profile") {
    viewingProfile = null;
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const target = params.get("user");
  if (!target) {
    viewingProfile = null;
    return;
  }
  const profile = findPlayerByIdentifier(target);
  if (!profile) {
    viewingProfile = null;
    return;
  }
  const key = profile.username || profile.name;
  const directoryProfile = key ? playerDirectory[key] : null;
  const viewingSelf = key && key === (player.username || player.name);
  viewingProfile = viewingSelf ? null : directoryProfile || profile;
}

function isViewingAnotherProfile() {
  return Boolean(viewingProfile && (viewingProfile.username || viewingProfile.name) !== (player.username || player.name));
}

function processPayouts() {
  rebuildEconomyFromDirectory();
  const now = Date.now();
  if (!sessionLastPayoutAt) sessionLastPayoutAt = now;
  const hourly = 3600000;
  const cycles = Math.floor((now - sessionLastPayoutAt) / hourly);
  if (cycles <= 0) return;
  for (let i = 0; i < cycles; i++) {
    player.capital += player.capitalIncome;
    player.politicalCapital += player.politicalIncome;
    companies.forEach((company) => {
      const financials = calculateCompanyFinancials(company);
      company.income = financials.income;
      company.balance += financials.profit;
    });
  }
  sessionLastPayoutAt += cycles * hourly;
  syncActiveAccount();
  renderProfile();
  renderCompanies();
  saveState();
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
  const profileData = isViewingAnotherProfile() ? viewingProfile : player;
  const readOnly = isViewingAnotherProfile();
  nameEl.textContent = profileData?.name || "No profile yet";
  if (!readOnly && profileData?.name) {
    upsertPolitician({ name: profileData.name, party: profileData.party, state: profileData.state, office: profileData.office, role: profileData.partyRole });
  }
  const stateFlag = profileData?.state ? stateData.find((s) => s.code === profileData.state) : null;
  const flagImg = stateFlag ? `<img src="${stateFlag.flag}" alt="${stateFlag.name} flag" class="inline-flag" />` : "";
  const profileStateEl = document.getElementById("profileState");
  if (profileStateEl) {
    profileStateEl.innerHTML = profileData?.state ? `${flagImg} ${profileData.state} — ${profileData.party}` : "Home state will appear here.";
  }
  setIfExists("profileUsername", profileData?.username ? `@${profileData.username}` : "");
  setIfExists("profileEmail", profileData?.email || "Not set");
  setIfExists("capitalStat", currency(profileData?.capital || 0));
  setIfExists("polCapitalStat", currency(profileData?.politicalCapital || 0));
  setIfExists("capIncomeStat", currency(profileData?.capitalIncome || 0));
  setIfExists("polIncomeStat", currency(profileData?.politicalIncome || 0));
  setIfExists("officeLabel", profileData?.office || "Citizen");
  setIfExists("partyRole", profileData?.partyRole || "Member");
  const badge = document.getElementById("officeBadge");
  if (badge) badge.textContent = profileData?.office ? profileData.office : "Unseated — no office yet";
  const tags = [formatEconomicClass(profileData?.economicClass), profileData?.religion, profileData?.heritage, profileData?.party]
    .filter(Boolean)
    .map((t) => `<span class="badge">${t}</span>`)
    .join(" ");
  const tagList = document.getElementById("traitTags");
  if (tagList) tagList.innerHTML = tags;
  renderAvatarPreview("avatarPreview", profileData?.avatar, "Upload an image");
  renderAvatarPreview("settingsAvatarPreview", profileData?.avatar, "No photo yet");
  const bioEditor = document.getElementById("bioEditor");
  if (bioEditor) {
    bioEditor.contentEditable = readOnly ? "false" : "true";
    bioEditor.innerHTML = profileData?.description || "Tell voters who you are.";
  }
  const notice = document.getElementById("profileViewNotice");
  const noticeName = document.getElementById("viewingProfileName");
  if (notice && noticeName) {
    if (readOnly) {
      noticeName.textContent = profileData?.name || profileData?.username || "player";
      notice.style.display = "block";
    } else {
      notice.style.display = "none";
    }
  }
  ["convertCapital", "boostCapital", "boostPol"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.style.display = readOnly ? "none" : "";
      btn.disabled = readOnly;
    }
  });
  const moneyForm = document.getElementById("sendMoneyForm");
  if (moneyForm) moneyForm.style.display = readOnly ? "none" : "";
  if (!readOnly) {
    hydrateLanding();
    renderPartyLeadership();
  }
}

function handleSignup(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const username = (data.get("username") || "").trim();
  const characterName = (data.get("name") || "").trim();
  if (!username) return alert("A unique username is required.");
  if (!isValidPersonName(characterName)) {
    alert("Enter a real first and last name for your character.");
    return;
  }
  const email = (data.get("email") || "").trim();
  if (accounts.some((acct) => acct.username?.toLowerCase() === username.toLowerCase() || acct.email === email)) {
    alert("That username is already taken.");
    return;
  }
  const selectedClass = data.get("class");
  const stats = economicClasses[selectedClass];
  const chosenState = data.get("state");
  const newPlayer = buildDefaultPlayer({
    email,
    username,
    name: characterName,
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
  });
  player = newPlayer;
  races = [];
  companies = [];
  moneyTransfers = [];
  const newAccount = buildEmptyAccount({ player: newPlayer });
  newAccount.races = races;
  newAccount.companies = companies;
  newAccount.moneyTransfers = moneyTransfers;
  accounts.push(newAccount);
  activeAccountId = newAccount.id;
  loggedIn = true;
  sessionLastPayoutAt = Date.now();
  upsertPolitician({
    name: player.name,
    username: player.username,
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
  sessionLastPayoutAt = Date.now();
  window.location.href = "index.html";
}

function handleLogin(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const email = (data.get("loginEmail") || "").trim();
  const username = (data.get("loginUsername") || "").trim();
  const account = accounts.find(
    (acct) => (email && acct.email === email) || (username && acct.username?.toLowerCase() === username.toLowerCase())
  );
  if (!account) return alert("No account found. Please sign up first.");
  activeAccountId = account.id;
  loggedIn = true;
  hydrateActiveAccount();
  sessionLastPayoutAt = account.lastPayoutAt || Date.now();
  renderProfile();
  renderRace();
  renderCompanies();
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
  const senateTimers = (state.senateClasses || [state.senateClass]).map((cls) => ({
    label: `Senate (Class ${cls})`,
    every: "120h",
    next: timeUntil(120 * cls),
  }));
  return [{ label: "House", every: "48h", next: timeUntil(48) }, ...senateTimers, { label: "Governor", every: "120h", next: timeUntil(120) }];
}

function defaultRaceCandidates(stateCode, type) {
  return [];
}

function ensureStateRaceEntries(stateCode) {
  if (!stateRaceBoard[stateCode]) {
    stateRaceBoard[stateCode] = ["Governor", "Senate", "House"].map((type) => ({
      type,
      stage: "Open",
      registrationLocked: false,
      endsAt: Date.now() + ELECTION_DURATION_MS,
      finalists: [],
      candidates: defaultRaceCandidates(stateCode, type),
    }));
  }
  return stateRaceBoard[stateCode];
}

function isRegistrationClosed(stateCode, type) {
  const entry = ensureStateRaceEntries(stateCode).find((race) => race.type === type);
  if (!entry) return false;
  return entry.registrationLocked && entry.stage !== "Open";
}

function getLiveCandidatesForRace(stateCode, type) {
  return getRealPlayers()
    .flatMap((profile) =>
      (profile.races || [])
        .filter((race) => race.state === stateCode && race.type === type)
        .map((race) => ({
          name: profile.name,
          username: profile.username,
          party: profile.party || race.party || "Independent",
          polling: race.polling || 0,
          stage: race.stage || "Primary",
        }))
    )
    .sort((a, b) => (b.polling || 0) - (a.polling || 0));
}

function syncRaceBoardWithDirectory(stateCode) {
  const entries = ensureStateRaceEntries(stateCode);
  const directoryRaces = getRealPlayers().flatMap((profile) =>
    (profile.races || [])
      .filter((race) => race.state === stateCode)
      .map((race) => ({
        ...race,
        name: profile.name,
        username: profile.username,
        party: profile.party || race.party || "Independent",
        stage: race.stage || "Primary",
      }))
  );
  directoryRaces.forEach((candidate) => {
    const entry = entries.find((r) => r.type === candidate.type);
    if (!entry) return;
    const existing = entry.candidates.find((c) => c.name === candidate.name);
    if (existing) {
      Object.assign(existing, candidate);
    } else {
      entry.candidates.push(candidate);
    }
    if (entry.stage === "Open") entry.stage = "Primary";
  });
  return entries;
}

function addPlayerToStateRaceBoard(stateCode, race) {
  const entries = ensureStateRaceEntries(stateCode);
  const raceEntry = entries.find((r) => r.type === race.type);
  if (!raceEntry) return;
  // Prevent late registration once primaries conclude
  if (raceEntry.registrationLocked && raceEntry.stage !== "Open") return;
  const playerName = player.name || player.username || "You";
  const existing = raceEntry.candidates.find((c) => c.name === playerName);
  const payload = { name: playerName, username: player.username, party: player.party || "Independent", polling: race.polling, stage: race.stage || "Primary" };
  if (existing) {
    Object.assign(existing, payload);
  } else {
    raceEntry.candidates.push(payload);
  }
  raceEntry.stage = race.stage || "Primary";
  raceEntry.endsAt = race.endsAt || raceEntry.endsAt;
}

function removePlayerFromStateRaceBoard(stateCode, type) {
  const entries = ensureStateRaceEntries(stateCode);
  const raceEntry = entries.find((r) => r.type === type);
  if (!raceEntry) return;
  raceEntry.candidates = raceEntry.candidates.filter((c) => c.name !== (player.name || player.username));
}

function getCandidateProfile(name, username) {
  const identifier = username || name;
  if (!identifier) return null;
  return findPlayerByIdentifier(identifier) || playerDirectory[identifier] || null;
}

function updateStateLeadership(code, payload) {
  const current = stateLeadership[code] || {};
  stateLeadership[code] = {
    ...current,
    ...payload,
  };
  applyStateLeadership();
  saveState();
}

function promotePlayerIfSelf(name, office, stateCode) {
  if (!name || (name !== player.name && name !== player.username)) return;
  player.office = office;
  if (stateCode && stateCode !== "USA") {
    player.state = stateCode;
    player.expansions = { ...(player.expansions || {}), [stateCode]: Math.max(1, getExpansionCountForState(stateCode)) };
  }
  player.partyRole = player.partyRole || "Member";
  upsertPolitician({ name: player.name, username: player.username, party: player.party, state: player.state, office: player.office, role: player.partyRole, avatar: player.avatar });
}

function pickPrimaryFinalists(candidates = []) {
  const grouped = candidates.reduce((acc, candidate) => {
    const party = candidate.party || "Independent";
    if (!acc[party]) acc[party] = [];
    acc[party].push(candidate);
    return acc;
  }, {});
  return Object.values(grouped)
    .map((list) => list.sort((a, b) => (b.polling || 0) - (a.polling || 0))[0])
    .filter(Boolean)
    .map((candidate) => ({ ...candidate, stage: "General" }));
}

function calculateHouseSeatAwards(state, candidates) {
  const totalSeats = state.houseSeats || 0;
  if (!totalSeats || !candidates.length) return [];
  const totalPolling = candidates.reduce((sum, c) => sum + Number(c.polling || 0), 0) || 100;
  const seatMath = candidates.map((candidate) => {
    const share = Number(candidate.polling || 0) / totalPolling;
    const exact = share * totalSeats;
    const floor = Math.floor(exact);
    return { candidate, seats: floor, remainder: exact - floor };
  });
  let assigned = seatMath.reduce((sum, row) => sum + row.seats, 0);
  let remaining = Math.max(0, totalSeats - assigned);
  while (remaining > 0) {
    seatMath.sort((a, b) => {
      if (b.remainder === a.remainder) return (b.candidate.polling || 0) - (a.candidate.polling || 0);
      return b.remainder - a.remainder;
    });
    seatMath[0].seats += 1;
    seatMath[0].remainder = 0;
    remaining -= 1;
  }
  return seatMath.filter((row) => row.seats > 0).map((row) => ({ ...row.candidate, seats: row.seats }));
}

function resolveRaceOutcome(stateCode, raceEntry) {
  const state = stateData.find((s) => s.code === stateCode);
  if (!state) return;
  if (!raceEntry.candidates.length) return;
  const sorted = [...raceEntry.candidates].sort((a, b) => (b.polling || 0) - (a.polling || 0));
  if (raceEntry.type === "Governor") {
    const winner = sorted[0];
    const profile = getCandidateProfile(winner.name, winner.username);
    updateStateLeadership(stateCode, { governor: { name: winner.name, username: winner.username, avatar: profile?.avatar || "" } });
    promotePlayerIfSelf(winner.name, "Governor", stateCode);
  } else if (raceEntry.type === "Senate") {
    const seats = (state.senators || []).length || 2;
    const winners = sorted.slice(0, seats);
    const filled = winners.map((winner, idx) => {
      const profile = getCandidateProfile(winner.name, winner.username);
      return { class: state.senateClasses?.[idx] || idx + 1, name: winner.name, username: winner.username, avatar: profile?.avatar || "" };
    });
    updateStateLeadership(stateCode, { senators: filled });
    winners.forEach((winner) => promotePlayerIfSelf(winner.name, "Senator", stateCode));
  } else if (raceEntry.type === "House") {
    const awards = calculateHouseSeatAwards(state, raceEntry.candidates);
    updateStateLeadership(stateCode, { houseDelegation: awards });
    awards.forEach((winner) => promotePlayerIfSelf(winner.name, "Representative", stateCode));
    raceEntry.winners = awards;
  }
  raceEntry.stage = "Completed";
  raceEntry.registrationLocked = true;
}

function advanceRaceLifecycle() {
  Object.keys(stateRaceBoard).forEach((code) => syncRaceBoardWithDirectory(code));
  if (player.state) ensureStateRaceEntries(player.state);
  Object.entries(stateRaceBoard).forEach(([code, racesForState]) => {
    racesForState.forEach((race) => {
      if (race.registrationLocked === undefined) race.registrationLocked = false;
      if (!race.endsAt) race.endsAt = Date.now() + ELECTION_DURATION_MS;
      if (!race.candidates.length && race.stage !== "Open") {
        race.stage = "Open";
        race.registrationLocked = false;
      }
      if (race.stage === "Open" && race.candidates.length) {
        race.stage = "Primary";
        race.endsAt = race.endsAt || Date.now() + ELECTION_DURATION_MS;
      }
      if (race.stage === "Primary" && Date.now() >= race.endsAt) {
        race.candidates = pickPrimaryFinalists(race.candidates);
        race.finalists = race.candidates;
        race.registrationLocked = true;
        race.stage = "General";
        race.endsAt = Date.now() + ELECTION_DURATION_MS;
        races.forEach((playerRace) => {
          if (playerRace.state === code && playerRace.type === race.type) {
            playerRace.stage = race.candidates.some((c) => c.name === (player.name || player.username)) ? "General" : "Eliminated";
            playerRace.endsAt = race.endsAt;
          }
        });
      } else if (race.stage === "General" && Date.now() >= race.endsAt) {
        resolveRaceOutcome(code, race);
        races.forEach((playerRace) => {
          if (playerRace.state === code && playerRace.type === race.type) {
            playerRace.stage = "Completed";
          }
        });
      }
    });
  });
}

function getStateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return null;
  return stateData.find((s) => s.code === code);
}

function getExpansionStates() {
  const states = new Set();
  if (player.state) states.add(player.state);
  companies.forEach((company) => {
    Object.keys(company.expansions || {}).forEach((code) => states.add(code));
  });
  return Array.from(states);
}

function ensureCompanyExpansions(company) {
  if (!company.expansions) company.expansions = {};
  return company.expansions;
}

function getExpansionCountForState(code) {
  return Number(player.expansions?.[code] || 0);
}

function getCompanyExpansionCount(company, code) {
  const expansions = ensureCompanyExpansions(company);
  return expansions[code] || 0;
}

function getTotalExpansionsForCompany(company) {
  const expansions = ensureCompanyExpansions(company);
  return Object.values(expansions).reduce((sum, count) => sum + count, 0);
}

function getTotalExpansions() {
  return companies.reduce((sum, company) => sum + getTotalExpansionsForCompany(company), 0);
}

function calculateEmployees(company) {
  return getTotalExpansionsForCompany(company) * EMPLOYEES_PER_EXPANSION;
}

function calculateExpansionCost(code, company) {
  const current = company ? getCompanyExpansionCount(company, code) : 0;
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
  const ownerKey = company.economyKey || getCompanyEconomyKey(company, company.owner || player.username || player.name);
  stateData.forEach((state) => {
    const owners = state.economy.sectors[company.industry]?.owners || {};
    if (owners[ownerKey]) {
      income += calculateSectorIncome(state, company.industry, ownerKey);
    }
  });
  const expenses = company.expenses || 0;
  return { income, profit: income - expenses };
}

function expandInState(stateCode) {
  if (!ensureProfile("before expanding")) return;
  const companyName = document.getElementById("companySelect")?.value;
  const sector = document.getElementById("sectorSelect")?.value;
  const company = companies.find((c) => c.name === companyName);
  if (!company) return alert("Pick a company to fund this expansion.");
  if (!sector) return alert("Choose a sector to expand into.");
  company.economyKey = company.economyKey || getCompanyEconomyKey(company, company.owner || player.username || player.name);
  const cost = calculateExpansionCost(stateCode, company);
  if (company.balance < cost) return alert(`The company needs ${currency(cost)} available to expand here.`);
  if (!confirm(`Spend ${currency(cost)} from ${company.name} to expand in ${stateCode}?`)) return;
  company.balance -= cost;
  const current = getCompanyExpansionCount(company, stateCode);
  company.expansions[stateCode] = current + 1;
  allocateMarketShare(stateCode, sector, company.economyKey, 2 + current * 0.75);
  const updatedFinancials = calculateCompanyFinancials(company);
  company.income = updatedFinancials.income;
  notifyAction(`${company.name} expanded in ${stateCode}. Hourly income refreshed.`);
  renderProfile();
  renderCompanies();
  renderStatePage();
  saveState();
}

function updateExpansionCostDisplay(stateCode) {
  const costLabel = document.getElementById("expansionCost");
  const button = document.getElementById("expandButton");
  if (!costLabel || !button) return;
  const companyName = document.getElementById("companySelect")?.value;
  const company = companies.find((c) => c.name === companyName);
  if (!company) {
    costLabel.textContent = "Create or select a company to expand.";
    button.disabled = true;
    return;
  }
  const cost = calculateExpansionCost(stateCode, company);
  costLabel.textContent = `Costs ${currency(cost)} from ${company.name}'s balance (balance: ${currency(company.balance)}).`;
  button.disabled = company.balance < cost;
}

function seizeMarketShare(stateCode, sector, companyName) {
  if (!ensureProfile("before seizing market")) return;
  const state = stateData.find((s) => s.code === stateCode);
  if (!state) return;
  const company = companies.find((c) => c.name === companyName);
  const ownerKey = company?.economyKey || getCompanyEconomyKey({ name: companyName }, company?.owner || player.username || player.name);
  const owners = state.economy.sectors[sector].owners;
  const remaining = Math.max(0, 100 - Object.entries(owners).reduce((sum, [, val]) => sum + Number(val || 0), 0));
  const americaShare = owners.America ?? 0;
  const available = Math.max(remaining, americaShare);
  const maxGain = available > 90 ? MAX_SEIZURE_GAIN : Math.min(MAX_SEIZURE_GAIN, available);
  const gain = Math.max(MIN_SEIZURE_GAIN, Math.min(maxGain, Math.random() * MAX_SEIZURE_GAIN));
  allocateMarketShare(stateCode, sector, ownerKey, gain);
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
  const canShowMoveButton = !player.state;
  const econ = state.economy;
  const defaultCompany = companies[0];
  const expandCost = defaultCompany ? calculateExpansionCost(state.code, defaultCompany) : 0;
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
  const governorName = state.governor?.name || "Vacant";
  const governorLink = governorName === "Vacant" ? "Vacant" : renderPersonLink(governorName, state.governor?.username);
  const governorAvatar = state.governor?.avatar
    ? `<div class="avatar small"><img src="${state.governor.avatar}" alt="${governorName}" /></div>`
    : `<div class="avatar small">${governorName === "Vacant" ? "?" : governorName.slice(0, 1)}</div>`;
  const governorChip = `
    <div class="leader-chip">
      ${governorAvatar}
      <div>
        <p class="subtle">Governor</p>
        <strong>${governorLink}</strong>
      </div>
    </div>
  `;
  const senatorLabels =
    (state.senators || []).length > 0
      ? state.senators
          .map((senator, idx) => {
            const label = senator?.name && senator.name !== "Vacant" ? renderPersonLink(senator.name, senator.username) : "Vacant";
            const classLabel = senator?.class || state.senateClasses?.[idx] || idx + 1;
            return `${label} (Class ${classLabel})`;
          })
          .join(" • ")
      : "Vacant";
  const houseDelegation =
    state.houseDelegation && state.houseDelegation.length
      ? state.houseDelegation.map((member) => `${renderPersonLink(member.name, member.username)} — ${member.seats} seat${member.seats > 1 ? "s" : ""}`).join(", ")
      : "Vacant";
  const officials = `
    <div class="card">
      <h4>Leadership</h4>
      <div class="stat"><span>Governor</span><strong>${governorLink}</strong></div>
      <div class="stat"><span>Senators</span><strong>${senatorLabels}</strong></div>
      <div class="stat"><span>House delegation (${state.houseSeats})</span><strong>${houseDelegation}</strong></div>
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
      ${
        canShowMoveButton && !livingHere
          ? `<button type="button" onclick="moveToState('${state.code}')" ${moveDisabled ? "disabled" : ""}>Move here (${currency(
              MOVE_COST
            )})</button>${moveDisabled ? `<p class='subtle'>You need ${currency(MOVE_COST - player.capital)} more capital to move.</p>` : ""}`
          : ""
      }
    </div>
  `;
  const stateRaces = syncRaceBoardWithDirectory(state.code);
  const racePanels = stateRaces
    .map((race) => {
      const candidates =
        race.candidates?.length
          ? race.candidates
              .map((c) => {
                const handle = c.username ? ` (@${c.username})` : "";
                const name = renderPersonLink(c.name, c.username, "profile-link");
                return `<div class="stat"><span>${name}${handle} (${c.party})</span><strong>${c.polling || 0}%</strong></div>`;
              })
              .join("")
          : "<div class='subtle'>No candidates have filed yet.</div>";
      const winners =
        race.stage === "Completed" && race.winners?.length
          ? `<div class="stat"><span>Winners</span><strong>${
              race.type === "House"
                ? race.winners.map((w) => `${renderPersonLink(w.name, w.username, "profile-link")} (${w.seats} seats)`).join(", ")
                : race.winners.map((w) => renderPersonLink(w.name, w.username, "profile-link")).join(", ")
            }</strong></div>`
          : "";
      return `
        <div class="card">
          <h4>${race.type} — ${race.stage}</h4>
          <div class="stat"><span>Election clock</span><strong>${formatRaceClock(race.endsAt)}</strong></div>
          ${race.stage === "General" || race.registrationLocked ? "<div class='pill'>Registration locked</div>" : ""}
          ${candidates}
          ${winners}
        </div>
      `;
    })
    .join("");
  container.innerHTML = `
    <div class="panel-header" style="margin-bottom:1rem;">
      <div>
        <h2>${state.name}</h2>
        <p class="subtle">Residence required for elections. Your home: ${player.state || "None"}.</p>
      </div>
      <div class="state-flag-inline"><img src="${state.flag}" alt="${state.name} flag" /></div>
      ${governorChip}
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
        <div class="inline-actions" style="margin-top:0.5rem; align-items:flex-start;">
          <button type="button" id="expandButton" onclick="expandInState('${state.code}')">Expand sector presence</button>
          <div class="subtle" id="expansionCost">${defaultCompany ? `Costs ${currency(expandCost)} from ${defaultCompany.name}'s balance.` : "Create a company to expand."}</div>
        </div>
        <p class="subtle">Expansion costs now use company balance and boost that company's market share.</p>
      </div>
      <div class="card">
        <h4>Active races</h4>
        <p class="subtle">Primaries and general fields for this state.</p>
        <div class="cards">${racePanels}</div>
      </div>
    </section>
  `;
  updateExpansionCostDisplay(state.code);
  const companySelect = document.getElementById("companySelect");
  if (companySelect && !companySelect.dataset.bound) {
    companySelect.addEventListener("change", () => updateExpansionCostDisplay(state.code));
    companySelect.dataset.bound = "true";
  }
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
  const readOnly = isViewingAnotherProfile();
  const raceList = readOnly ? viewingProfile?.races || [] : races;
  if (!raceList.length) {
    if (notice) {
      notice.textContent = readOnly ? "This player is not in any races." : "Not in a race yet. Join from any state page.";
      notice.style.display = "block";
    }
    return;
  }
  if (notice) notice.style.display = "none";
  raceList.forEach((race, idx) => {
    const canSwearIn = race.polling >= 50 && (race.stage === "General" || race.type === "President");
    const raceClock = formatRaceClock(race.endsAt);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${race.type} — ${race.state}</h4>
      <p class="subtle">Stage: ${race.stage}</p>
      <div class="stat"><span>Polling</span><strong>${race.polling}%</strong></div>
      <div class="stat"><span>Demographics</span><strong>${race.demographicPulse}</strong></div>
      <div class="stat"><span>Election timer</span><strong>${raceClock}</strong></div>
      <div class="inline-actions">
        <button type="button" onclick="buyPoll(${idx})">Buy poll (-$5,000)</button>
        <button type="button" onclick="attackAd(${idx})">Attack ad (-$7,500)</button>
        <button type="button" onclick="boostSelf(${idx})">Boost self (-$5,000)</button>
        <button type="button" onclick="withdrawRace(${idx})">Withdraw</button>
        ${canSwearIn ? `<button type="button" onclick="swearIntoOffice(${idx})">Swear into office</button>` : ""}
      </div>
    `;
    if (readOnly) {
      const actions = card.querySelector(".inline-actions");
      if (actions) {
        actions.innerHTML = "<span class='subtle'>Viewing only — controls disabled.</span>";
      }
    }
    container.appendChild(card);
  });
}

function signUpRace(state, type) {
  if (!ensureProfile("to file for races")) return;
  if (type !== "President" && player.state !== state) {
    alert("You can only run in the state you currently live in. Move first.");
    return;
  }
  const entry = ensureStateRaceEntries(state).find((r) => r.type === type);
  if (entry && entry.registrationLocked && entry.stage !== "Open") {
    alert("Registration is locked. Primaries are closed and the general field is set.");
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
  const stage = entry && entry.stage === "General" ? "General" : type === "President" ? (primaryOpen ? "Primary" : "General") : "Primary";
  const newRace = {
    state,
    type,
    stage,
    polling: 12,
    demographicPulse: "Balanced",
    endsAt: Date.now() + ELECTION_DURATION_MS,
  };
  races.push(newRace);
  addPlayerToStateRaceBoard(state, newRace);
  publishPlayerProfile();
  rebuildEconomyFromDirectory();
  renderProfile();
  renderRace();
  renderStatePage();
  saveState();
}

function buyPoll(idx) {
  if (player.politicalCapital < 5000) return alert("Not enough political capital.");
  player.politicalCapital -= 5000;
  races[idx].demographicPulse = "Income + heritage leaning toward you";
  races[idx].polling = Math.min(80, races[idx].polling + 3);
  publishPlayerProfile();
  renderProfile();
  renderRace();
  renderStatePage();
  saveState();
}

function attackAd(idx) {
  if (player.politicalCapital < 7500) return alert("Not enough political capital.");
  player.politicalCapital -= 7500;
  races[idx].polling = Math.min(90, races[idx].polling + 4);
  publishPlayerProfile();
  renderProfile();
  renderRace();
  renderStatePage();
  saveState();
}

function boostSelf(idx) {
  if (player.politicalCapital < 5000) return alert("Not enough political capital.");
  player.politicalCapital -= 5000;
  races[idx].polling = Math.min(95, races[idx].polling + 2);
  publishPlayerProfile();
  renderProfile();
  renderRace();
  renderStatePage();
  saveState();
}

function withdrawRace(idx) {
  const race = races[idx];
  races.splice(idx, 1);
  if (race) removePlayerFromStateRaceBoard(race.state, race.type);
  publishPlayerProfile();
  renderRace();
  renderStatePage();
  saveState();
}

function swearIntoOffice(idx) {
  const race = races[idx];
  if (race.polling < 50) return alert("You need majority polling to claim victory.");
  const officeMap = { House: "Representative", Senate: "Senator", Governor: "Governor", President: "President" };
  const newOffice = officeMap[race.type] || "Citizen";
  player.office = newOffice;
  player.state = race.state;
  player.expansions = { ...(player.expansions || {}), [race.state]: Math.max(1, getExpansionCountForState(race.state)) };
  player.partyRole = player.partyRole || "Member";
  if (race.type === "Governor") {
    updateStateLeadership(race.state, { governor: { name: player.name, avatar: player.avatar } });
  } else if (race.type === "Senate") {
    const state = stateData.find((s) => s.code === race.state);
    const seats = state?.senators || [];
    const updated = seats.map((seat, idx) => (idx === 0 && seat.name === "Vacant" ? { ...seat, name: player.name, avatar: player.avatar } : seat));
    updateStateLeadership(race.state, { senators: updated });
  } else if (race.type === "House") {
    updateStateLeadership(race.state, { houseDelegation: [{ name: player.name, username: player.username, seats: 1 }] });
  }
  upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole, avatar: player.avatar });
  renderProfile();
  renderCompanies();
  renderStatePage();
  saveState();
}

function setupIncomeButtons() {
  const convert = document.getElementById("convertCapital");
  const boostCap = document.getElementById("boostCapital");
  const boostPol = document.getElementById("boostPol");
  if (convert)
    convert.addEventListener("click", () => {
      if (!ensureProfile("before converting capital")) return;
      const amount = Number(prompt("Convert capital to political capital at a 10% rate. How much capital do you want to convert?", 100000) || 0);
      if (!amount || amount <= 0) return;
      if (amount > player.capital) return alert("Not enough capital to convert that amount.");
      const yieldAmount = Math.floor(amount * 0.1);
      player.capital -= amount;
      player.politicalCapital += yieldAmount;
      alert(`Converted ${currency(amount)} into ${currency(yieldAmount)} political capital (10% rate).`);
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
    const employees = calculateEmployees(c);
    const expansions = getTotalExpansionsForCompany(c);
    const dividendYield = c.dividend && c.sharePrice ? ((c.dividend / c.sharePrice) * 100).toFixed(2) : 0;
    const ceoLabel = c.ceo ? renderPersonLink(c.ceo, c.ceoUsername, "profile-link") : "CEO";
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${c.name} <span class="badge">${c.industry}</span></h4>
      <p class="subtle">CEO: ${ceoLabel} • ${c.shares.toLocaleString()} shares @ $${c.sharePrice}</p>
      <div class="stat"><span>Balance</span><strong>${currency(c.balance)}</strong></div>
      <div class="stat"><span>Income / hr</span><strong>${currency(c.income)}</strong></div>
      <div class="stat"><span>Profit</span><strong>${currency(profit)}</strong></div>
      <div class="stat"><span>Employees</span><strong>${employees.toLocaleString()}</strong></div>
      <div class="stat"><span>Dividend yield</span><strong>${dividendYield ? `${dividendYield}%` : "No dividend"}</strong></div>
      <div class="stat"><span>State expansions</span><strong>${expansions}</strong></div>
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

function ensurePriceHistory(company) {
  if (!company.priceHistory || !company.priceHistory.length) {
    company.priceHistory = [company.price || 1];
  }
  if (company.priceHistory[company.priceHistory.length - 1] !== company.price) {
    company.priceHistory.push(company.price);
  }
}

function renderSparkline(series = [], width = 180, height = 60) {
  if (!series.length) return "";
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const gradientId = `sparkGradient-${Math.random().toString(36).slice(2, 8)}`;
  const points = series
    .map((value, idx) => {
      const x = (idx / Math.max(1, series.length - 1)) * (width - 10) + 5;
      const y = height - ((value - min) / range) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");
  return `<svg viewBox="0 0 ${width} ${height}" class="sparkline">
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#7cf3c9" />
        <stop offset="100%" stop-color="#58d3ff" />
      </linearGradient>
    </defs>
    <polyline fill="none" stroke="url(#${gradientId})" stroke-width="2" points="${points}" />
  </svg>`;
}

function getIndustrialAverageSeries() {
  const maxLength = Math.max(...publicCompanies.map((c) => (c.priceHistory ? c.priceHistory.length : 0)), 0);
  const series = [];
  for (let i = 0; i < maxLength; i++) {
    const points = publicCompanies.map((c) => (c.priceHistory?.[i] !== undefined ? c.priceHistory[i] : c.priceHistory?.[c.priceHistory.length - 1] || c.price));
    const avg = points.reduce((sum, val) => sum + (val || 0), 0) / (points.length || 1);
    series.push(Number(avg.toFixed(2)));
  }
  return series;
}

function renderIndustrialAverage() {
  const series = getIndustrialAverageSeries();
  const chart = document.getElementById("industrialChart");
  const badge = document.getElementById("industrialAvg");
  if (badge && series.length) {
    badge.textContent = `Industrial Avg: ${currency(series[series.length - 1])}`;
  }
  if (chart) {
    chart.innerHTML = series.length ? renderSparkline(series, 420, 120) : "<div class='subtle'>No data yet.</div>";
  }
}

function tickPublicMarkets() {
  publicCompanies.forEach((company) => {
    ensurePriceHistory(company);
    const last = company.priceHistory[company.priceHistory.length - 1] || company.price;
    const drift = (Math.random() * 1.2 - 0.6) / 100; // +/-0.6%
    const next = Math.max(1, Number((last * (1 + drift)).toFixed(2)));
    company.change = Number((((next - last) / last) * 100).toFixed(2));
    company.price = next;
    company.priceHistory.push(next);
    if (company.priceHistory.length > 60) company.priceHistory.shift();
  });
  renderPublicMarket();
  renderIndustrialAverage();
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
    const yieldRate = company?.dividendYield || 0;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${h.symbol} — ${company?.name || "Private"}</h4>
      <p class="subtle">${h.shares.toLocaleString()} shares @ ${currency(price)}</p>
      <div class="stat"><span>Value</span><strong>${currency(value)}</strong></div>
      <div class="stat"><span>Dividend yield</span><strong>${yieldRate ? `${yieldRate}%` : "—"}</strong></div>
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
      ensurePriceHistory(c);
      const card = document.createElement("div");
      card.className = "card";
    const changeClass = c.change >= 0 ? "pill" : "pill pill-warning";
    const startPrice = c.priceHistory?.[0] || c.price;
    card.innerHTML = `
      <div class="flex" style="justify-content: space-between; align-items:center;">
        <h4>${c.name}</h4>
        <span class="${changeClass}">${c.symbol} ${c.change >= 0 ? "+" : ""}${c.change}%</span>
      </div>
      <div class="stat"><span>Price</span><strong>${currency(c.price)}</strong></div>
      <div class="stat"><span>Dividend yield</span><strong>${c.dividendYield ? `${c.dividendYield}%` : "—"}</strong></div>
      <div class="stat"><span>Start → now</span><strong>${currency(startPrice)} → ${currency(c.price)}</strong></div>
      <div class="sparkline-wrap">${renderSparkline(c.priceHistory)}</div>
      <div class="inline-actions">
        <button type="button" onclick="buyStock('${c.symbol}')">Buy</button>
        <button type="button" onclick="sellStock('${c.symbol}')">Sell</button>
      </div>
    `;
    market.appendChild(card);
  });
  renderIndustrialAverage();
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
  const ownerId = player.username || player.name;
  const shares = Number(document.getElementById("companyShares").value || 100000);
  const income = Math.max(15000, shares / 10 + Math.random() * 20000);
  const expenses = income * 0.35;
  const foundedState = player.state || "CA";
  const company = {
    name: document.getElementById("companyName").value,
    ceo: player.name || "CEO",
    ceoUsername: player.username,
    owner: ownerId,
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
    expansions: { [foundedState]: 1 },
  };
  company.economyKey = getCompanyEconomyKey(company, ownerId);
  player.capital -= 1000000;
  companies.push(company);
  allocateMarketShare(foundedState, company.industry, company.economyKey, 1);
  renderProfile();
  renderCompanies();
  notifyAction(`${company.name} created in ${foundedState}.`);
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
  const yieldRate = companies[idx].sharePrice ? ((rate / companies[idx].sharePrice) * 100).toFixed(2) : 0;
  alert(`Dividend set to ${currency(rate)} per share (${yieldRate}% yield).`);
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
  notifyAction(`Withdrew ${currency(amount)} from ${company.name}.`);
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
  notifyAction(`Injected ${currency(amount)} into ${company.name}.`);
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
  const activeParty = document.body.dataset.page === "parties" ? selectedParty : player.party;
  const rate = document.getElementById("partyRate");
  const label = document.getElementById("partyRateLabel");
  const requireChair = () => {
    const leadership = getPartyRecord(activeParty);
    if (leadership.chair !== player.name) {
      alert("Only the current chair can make this change.");
      return null;
    }
    return leadership;
  };
  if (rate && label && !rate.dataset.bound) {
    rate.addEventListener("input", () => {
      if (!ensureProfile("to adjust party dues")) return;
      if (player.party !== activeParty) return alert("Join this party before updating dues.");
      const leadership = getPartyRecord(activeParty);
      if (leadership.chair !== player.name) {
        alert("Only the current chair can set the party tithe.");
        rate.value = rate.dataset.last || rate.value;
        return;
      }
      label.textContent = `${rate.value}%`;
      rate.dataset.last = rate.value;
      const treasury = getPartyTreasury(activeParty);
      setPartyTreasury(activeParty, treasury + Number(rate.value) * 100);
      renderTreasury();
      saveState();
    });
    rate.dataset.bound = "true";
  }
  const chairBtn = document.getElementById("electChair");
  if (chairBtn)
    chairBtn.addEventListener("click", () => {
      if (!ensureProfile("to run the party")) return;
      if (player.party !== activeParty) return alert("Join this party before making leadership changes.");
      const nameInput = document.getElementById("chairInput").value || player.name;
      const candidate = resolveRealPlayer(nameInput);
      if (!candidate) return alert("Only real player names are eligible.");
      const leadership = getPartyRecord(activeParty);
      if (leadership.chair && leadership.chair !== player.name) return alert("Only the current chair can change leadership.");
      leadership.chair = candidate.name;
      if (candidate.name === player.name) player.partyRole = "Chair";
      upsertPolitician({ name: candidate.name, username: candidate.username, party: activeParty, state: candidate.state || player.state, office: candidate.office || player.office, role: "Chair" });
      renderPartyLeadership();
      notifyAction(`${candidate.name} is now chair.`);
      saveState();
    });
  const viceBtn = document.getElementById("appointVice");
  if (viceBtn)
    viceBtn.addEventListener("click", () => {
      if (!ensureProfile("to appoint")) return;
      if (player.party !== activeParty) return alert("Join this party before making leadership changes.");
      const leadership = requireChair();
      if (!leadership) return;
      const nameInput = document.getElementById("chairInput").value || player.name;
      const candidate = resolveRealPlayer(nameInput);
      if (!candidate) return alert("Pick a real player for Vice-Chair.");
      leadership.vice = candidate.name;
      if (candidate.name === player.name) player.partyRole = "Vice-Chair";
      upsertPolitician({ name: candidate.name, username: candidate.username, party: activeParty, state: candidate.state || player.state, office: candidate.office || player.office, role: "Vice-Chair" });
      renderPartyLeadership();
      notifyAction(`${candidate.name} appointed as Vice-Chair.`);
      saveState();
    });
  const fireViceBtn = document.getElementById("fireVice");
  if (fireViceBtn)
    fireViceBtn.addEventListener("click", () => {
      if (!ensureProfile("to appoint")) return;
      if (player.party !== activeParty) return alert("Join this party before making leadership changes.");
      const leadership = requireChair();
      if (!leadership) return;
      if (!leadership.vice) return alert("No Vice-Chair to remove.");
      if (!confirm("Remove the current Vice-Chair?")) return;
      if (leadership.vice === player.name) player.partyRole = "Member";
      leadership.vice = null;
      renderPartyLeadership();
      notifyAction("Vice-Chair removed.");
      saveState();
    });
  const treasurerBtn = document.getElementById("appointTreasurer");
  if (treasurerBtn)
    treasurerBtn.addEventListener("click", () => {
      if (!ensureProfile("to appoint")) return;
      if (player.party !== activeParty) return alert("Join this party before making leadership changes.");
      const leadership = requireChair();
      if (!leadership) return;
      const nameInput = document.getElementById("chairInput").value || player.name;
      const candidate = resolveRealPlayer(nameInput);
      if (!candidate) return alert("Pick a real player for Treasurer.");
      leadership.treasurer = candidate.name;
      if (candidate.name === player.name) player.partyRole = "Treasurer";
      upsertPolitician({ name: candidate.name, username: candidate.username, party: activeParty, state: candidate.state || player.state, office: candidate.office || player.office, role: "Treasurer" });
      renderPartyLeadership();
      notifyAction(`${candidate.name} appointed as Treasurer.`);
      saveState();
    });
  const fireTreasurerBtn = document.getElementById("fireTreasurer");
  if (fireTreasurerBtn)
    fireTreasurerBtn.addEventListener("click", () => {
      if (!ensureProfile("to appoint")) return;
      if (player.party !== activeParty) return alert("Join this party before making leadership changes.");
      const leadership = requireChair();
      if (!leadership) return;
      if (!leadership.treasurer) return alert("No Treasurer to remove.");
      if (!confirm("Remove the current Treasurer?")) return;
      if (leadership.treasurer === player.name) player.partyRole = "Member";
      leadership.treasurer = null;
      renderPartyLeadership();
      notifyAction("Treasurer removed.");
      saveState();
    });
  const withdrawForm = document.getElementById("withdrawForm");
  if (withdrawForm)
    withdrawForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!ensureProfile("to withdraw funds")) return;
      if (player.party !== activeParty) return alert("Join this party before moving funds.");
      const leadership = getPartyRecord(activeParty);
      if (![leadership.treasurer, leadership.chair].includes(player.name)) return alert("Only the chair or treasurer can withdraw.");
      const amount = Number(document.getElementById("withdrawAmount").value || 0);
      const treasury = getPartyTreasury(activeParty);
      if (amount > treasury) return alert("Insufficient party funds.");
      setPartyTreasury(activeParty, treasury - amount);
      player.politicalCapital += amount;
      renderTreasury();
      renderProfile();
      notifyAction(`Withdrew ${currency(amount)} from party funds.`);
      saveState();
    });
}

function renderPartyLeadership() {
  const activeParty = document.body.dataset.page === "parties" ? selectedParty : player.party;
  const leadership = getPartyRecord(activeParty);
  const chair = leadership.chair || "Vacant";
  const vice = leadership.vice || "Vacant";
  const treasurer = leadership.treasurer || "Vacant";
  const chairLabel = document.getElementById("chairLabel");
  const viceLabel = document.getElementById("viceLabel");
  const treasurerLabel = document.getElementById("treasurerLabel");
  if (chairLabel) chairLabel.innerHTML = chair === "Vacant" ? "Vacant" : renderPersonLink(chair);
  if (viceLabel) viceLabel.innerHTML = vice === "Vacant" ? "Vacant" : renderPersonLink(vice);
  if (treasurerLabel) treasurerLabel.innerHTML = treasurer === "Vacant" ? "Vacant" : renderPersonLink(treasurer);
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
  const previousParty = player.party;
  const previousLeadership = getPartyRecord(previousParty);
  if ([previousLeadership.chair, previousLeadership.vice, previousLeadership.treasurer].includes(player.name)) {
    previousLeadership.chair = previousLeadership.chair === player.name ? null : previousLeadership.chair;
    previousLeadership.vice = previousLeadership.vice === player.name ? null : previousLeadership.vice;
    previousLeadership.treasurer = previousLeadership.treasurer === player.name ? null : previousLeadership.treasurer;
  }
  player.party = name;
  player.partyRole = "Member";
  upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
  selectedParty = name;
  renderProfile();
  renderPartyLeadership();
  renderPartiesPage();
  notifyAction(`Joined the ${name}.`);
  saveState();
}

function leaveParty() {
  if (!ensureProfile("to leave a party")) return;
  if (player.party === "Independents") return alert("You are already independent.");
  const leadership = getPartyRecord();
  if ([leadership.chair, leadership.vice, leadership.treasurer].includes(player.name)) {
    leadership.chair = leadership.chair === player.name ? null : leadership.chair;
    leadership.vice = leadership.vice === player.name ? null : leadership.vice;
    leadership.treasurer = leadership.treasurer === player.name ? null : leadership.treasurer;
  }
  player.party = "Independents";
  player.partyRole = "Member";
  upsertPolitician({ name: player.name, party: player.party, state: player.state, office: player.office, role: player.partyRole });
  selectedParty = "Independents";
  renderProfile();
  renderPartyLeadership();
  renderPartiesPage();
  notifyAction("You are now independent.");
  saveState();
}

function renderPartiesPage() {
  if (document.body.dataset.page !== "parties") return;
  const list = document.getElementById("partyList");
  const status = document.getElementById("partyStatus");
  if (status) status.textContent = player.party ? `You are currently a ${player.party} member.` : "No party chosen.";
  if (!selectedParty) selectedParty = player.party || partyOptions[0];
  if (list) {
    list.innerHTML = "";
    partyOptions.forEach((party) => {
      const card = document.createElement("div");
      card.className = `card party-card ${selectedParty === party ? "active" : ""}`;
      const isMember = player.party === party;
      const joinButton = isMember ? "" : `<button type="button" onclick="joinParty('${party}')">Join</button>`;
      card.innerHTML = `
        <h4>${party}</h4>
        <p class="subtle">${isMember ? "You belong to this party." : "Click to view details."}</p>
        <div class="inline-actions">
          <button type="button" onclick="selectParty('${party}')" class="ghost">View</button>
          ${joinButton}
        </div>
      `;
      card.addEventListener("click", () => selectParty(party));
      list.appendChild(card);
    });
  }
  const searchInput = document.getElementById("partySearch");
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.addEventListener("input", () => {
      partyPage = 1;
      renderPartyMembers();
    });
    searchInput.dataset.bound = "true";
  }
  const prev = document.getElementById("partyPrev");
  const next = document.getElementById("partyNext");
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
  renderPartyDetails();
  renderPartyMembers();
}

function renderTreasury() {
  const activeParty = document.body.dataset.page === "parties" ? selectedParty : player.party;
  const leadership = getPartyRecord(activeParty);
  setIfExists("treasuryBalance", currency(getPartyTreasury(activeParty)));
  const isExecutive = [leadership.chair, leadership.vice, leadership.treasurer].includes(player.name);
  document.querySelectorAll(".executive-only").forEach((panel) => {
    panel.style.display = isExecutive ? "block" : "none";
  });
}

function renderPartyMembers() {
  const container = document.getElementById("partyMembers");
  if (!container) return;
  const query = document.getElementById("partySearch")?.value?.toLowerCase() || "";
  const activeParty = document.body.dataset.page === "parties" ? selectedParty : player.party;
  const roster = politicians.filter((p) => p.party === activeParty);
  const filtered = roster.filter((p) => !query || p.name.toLowerCase().includes(query));
  const roleRank = { chair: 1, "vice-chair": 2, treasurer: 3 };
  const officeRank = { president: 1, governor: 2, senator: 3, representative: 4, citizen: 5 };
  filtered.sort((a, b) => {
    const aRole = roleRank[(a.role || a.partyRole || "").toLowerCase()] || 99;
    const bRole = roleRank[(b.role || b.partyRole || "").toLowerCase()] || 99;
    if (aRole !== bRole) return aRole - bRole;
    const aOffice = officeRank[(a.office || "").toLowerCase()] || 99;
    const bOffice = officeRank[(b.office || "").toLowerCase()] || 99;
    if (aOffice !== bOffice) return aOffice - bOffice;
    return (a.name || "").localeCompare(b.name || "");
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PARTY_PAGE_SIZE));
  partyPage = Math.min(Math.max(1, partyPage), totalPages);
  const start = (partyPage - 1) * PARTY_PAGE_SIZE;
  const slice = filtered.slice(start, start + PARTY_PAGE_SIZE);
  container.innerHTML = "";
  setIfExists("partyPageLabel", `${partyPage}/${totalPages}`);
  const prev = document.getElementById("partyPrev");
  const next = document.getElementById("partyNext");
  if (prev) prev.disabled = partyPage <= 1;
  if (next) next.disabled = partyPage >= totalPages;
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
      <h4>${renderPersonLink(member.name, member.username, "profile-link")}</h4>
      <p class="subtle">${flag} ${member.state || "Unknown"} • ${member.office || "Citizen"}</p>
      <div class="stat"><span>Role</span><strong>${member.role || member.partyRole || "Member"}</strong></div>
    `;
    container.appendChild(card);
  });
}

function selectParty(party) {
  selectedParty = party;
  partyPage = 1;
  renderPartiesPage();
}

function renderPartyDetails() {
  const container = document.getElementById("partyDetails");
  if (!container) return;
  const leadership = getPartyRecord(selectedParty);
  const chair = leadership.chair || "Vacant";
  const vice = leadership.vice || "Vacant";
  const treasurer = leadership.treasurer || "Vacant";
  const treasury = getPartyTreasury(selectedParty);
  const isMember = player.party === selectedParty;
  const joinControl = isMember ? "<div class=\"pill\">Current party</div>" : `<button type="button" onclick="joinParty('${selectedParty}')">Join party</button>`;
  container.innerHTML = `
    <div class="panel-header" style="margin-bottom:0.5rem;">
      <div>
        <h3>${selectedParty}</h3>
        <p class="subtle">Leadership and treasury are unique to each party.</p>
      </div>
      <div class="inline-actions">
        ${joinControl}
      </div>
    </div>
    <div class="tab-row">
      <button type="button" data-role-tab="chair" class="active">Chair</button>
      <button type="button" data-role-tab="vice">Vice Chair</button>
      <button type="button" data-role-tab="treasurer">Treasurer</button>
    </div>
    <div class="card role-panel active" data-role-panel="chair">
      <div class="stat"><span>Chair</span><strong id="chairLabel">${chair}</strong></div>
      <label for="chairInput">Assign chair (real players only)</label>
      <input id="chairInput" list="playerSuggestions" placeholder="Search players by name" />
      <div class="inline-actions" style="margin-top: 0.4rem;">
        <button type="button" id="electChair">Elect Chair</button>
      </div>
    </div>
    <div class="card role-panel" data-role-panel="vice">
      <div class="stat"><span>Vice Chair</span><strong id="viceLabel">${vice}</strong></div>
      <p class="subtle">Vice Chair supports the chair and acts on behalf of the party.</p>
      <div class="inline-actions" style="margin-top: 0.4rem;">
        <button type="button" id="appointVice">Appoint Vice Chair</button>
        <button type="button" id="fireVice" class="ghost">Fire Vice Chair</button>
      </div>
    </div>
    <div class="card role-panel" data-role-panel="treasurer">
      <div class="stat"><span>Treasurer</span><strong id="treasurerLabel">${treasurer}</strong></div>
      <p class="subtle">Treasurer manages the tithe and payouts for ${selectedParty}.</p>
      <div class="inline-actions" style="margin-top: 0.4rem;">
        <button type="button" id="appointTreasurer">Appoint Treasurer</button>
        <button type="button" id="fireTreasurer" class="ghost">Fire Treasurer</button>
      </div>
    </div>
    <div class="card executive-only">
      <h4>Party treasury & tithe</h4>
      <div class="stat"><span>Political capital</span><strong id="treasuryBalance">${currency(treasury)}</strong></div>
      <div class="label-row" style="margin-top: 0.6rem;">
        <label for="partyRate">Party tithe (max 30%)</label>
        <input id="partyRate" type="range" min="0" max="30" value="10" />
        <span id="partyRateLabel">10%</span>
      </div>
      <form id="withdrawForm">
        <label for="withdrawAmount">Withdraw to personal account</label>
        <input id="withdrawAmount" type="number" min="0" step="100" />
        <div class="inline-actions" style="margin-top: 0.4rem;">
          <button type="submit" style="width: auto;">Withdraw</button>
          <div class="subtle">Only executives can pull funds into their own account.</div>
        </div>
      </form>
    </div>
  `;
  container.querySelectorAll("[data-role-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      container.querySelectorAll("[data-role-tab]").forEach((btn) => btn.classList.remove("active"));
      container.querySelectorAll(".role-panel").forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      container.querySelector(`[data-role-panel='${tab.dataset.roleTab}']`)?.classList.add("active");
    });
  });
  setupParty();
  renderTreasury();
}

function setupMoneyTransfers() {
  const form = document.getElementById("sendMoneyForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!ensureProfile("to send funds")) return;
    const recipientInput = document.getElementById("recipient").value;
    const recipient = resolveRealPlayer(recipientInput);
    if (!recipient) return alert("Only real, registered players can receive funds.");
    const amount = Number(document.getElementById("amount").value || 0);
    if (amount <= 0) return alert("Enter an amount to send.");
    if (amount > player.capital) return alert("Not enough capital.");
    player.capital -= amount;
    moneyTransfers.unshift({ recipient: recipient.name, amount, date: new Date(), username: recipient.username });
    renderProfile();
    renderMoneyLog();
    notifyAction(`Sent ${currency(amount)} to ${recipient.name}.`);
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
      const handle = t.username ? ` (@${t.username})` : "";
      const recipient = renderPersonLink(t.recipient, t.username, "profile-link");
      return `<div>${currency(t.amount)} sent to <strong>${recipient}${handle}</strong> — ${timestamp.toLocaleTimeString()}</div>`;
    })
    .join("");
}

function setupRTEs() {
  setupEditor(".rich-editor .editor-toolbar", "#bioEditor");
  setupEditor("#houseBillForm .editor-toolbar", "#houseBillBody");
  setupEditor("#senateBillForm .editor-toolbar", "#senateBillBody");
}

function setupBioSync() {
  const bio = document.getElementById("bioEditor");
  if (!bio || isViewingAnotherProfile()) return;
  let debounce;
  bio.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      player.description = bio.innerHTML;
      publishPlayerProfile();
      saveState();
    }, 350);
  });
}

function setupAvatarUpload() {
  const upload = document.getElementById("avatarUpload");
  const saveBtn = document.getElementById("saveAvatar");
  if (!upload || !saveBtn || saveBtn.dataset.bound) return;
  upload.addEventListener("change", () => {
    if (!upload.files?.length) return;
    const [file] = upload.files;
    const reader = new FileReader();
    reader.onload = () => renderAvatarPreview("settingsAvatarPreview", reader.result, "No photo yet");
    reader.readAsDataURL(file);
  });
  saveBtn.addEventListener("click", () => {
    if (!ensureProfile("before updating your portrait")) return;
    if (!upload.files?.length) return alert("Choose an image to upload.");
    const [file] = upload.files;
    const reader = new FileReader();
    reader.onload = () => {
      player.avatar = reader.result;
      publishPlayerProfile();
      renderProfile();
      saveState();
      notifyAction("Profile photo updated.");
    };
    reader.readAsDataURL(file);
  });
  saveBtn.dataset.bound = "true";
}

function openPublicProfile(identifier) {
  if (!identifier) return;
  const target = encodeURIComponent(identifier);
  window.location.href = `profile.html?user=${target}`;
}

function renderSearchResults() {
  if (document.body.dataset.page !== "search") return;
  const container = document.getElementById("searchResults");
  if (!container) return;
  const nameFilter = document.getElementById("searchName")?.value?.toLowerCase() || "";
  const partyFilter = document.getElementById("searchParty")?.value || "";
  const stateFilter = document.getElementById("searchState")?.value || "";
  const officeFilter = document.getElementById("searchOffice")?.value || "";
  const filtered = getRealPlayers().filter((p) => {
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
    const role = p.partyRole || p.role || "Member";
    const target = p.username || p.name;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${renderPersonLink(p.name, p.username, "profile-link")} ${p.username ? `<span class="subtle">@${p.username}</span>` : ""}</h4>
      <p class="subtle">${flag} ${p.state || "Unknown"} • ${p.party || "Independent"}</p>
      <div class="stat"><span>Position</span><strong>${p.office || "Citizen"}</strong></div>
      <div class="stat"><span>Role</span><strong>${role}</strong></div>
    `;
    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.textContent = "View profile";
    viewBtn.addEventListener("click", () => openPublicProfile(target));
    card.appendChild(viewBtn);
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
  if (page !== "login" && (!loggedIn || !getActiveAccount())) {
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
  hydrateViewingProfileFromQuery();
  const gatePassed = enforceProfileGate();
  if (gatePassed === false) return;
  populateStates();
  renderProfile();
  renderPlayerSuggestions();
  renderMap();
  renderPartiesPage();
  renderStatePage();
  renderRace();
  advanceRaceLifecycle();
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
  setupBioSync();
  setupAvatarUpload();
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

  processPayouts();
  tickPublicMarkets();
  setInterval(processPayouts, 60000);
  setInterval(tickPublicMarkets, 60000);

  setInterval(() => {
    advanceRaceLifecycle();
    renderRace();
    renderBillContainers();
    renderStatePage();
    saveState();
  }, 30000);

  if (primaryOpen) setTimeout(advanceGeneral, 20000);
}

window.addEventListener("DOMContentLoaded", init);
