export type OmniTrackerCall = {
  Number: string;
  OpCo: string;
  AffectedPerson: string;
  CategoryPath: string;
  CatSpecMIC: string;
  Created: string;
  Title: string;
  State: string;
  Description: string;
  OPCO: string;
  Afdeling: string;
  year: number;
  month: number;
  day: number;
  hour: number;
};

const OPCOS = ['STP', 'UNQ', 'SSC', 'BPL', 'EMI', 'USP', 'SLV'] as const;
type OpCoType = typeof OPCOS[number];

const OPCO_WEIGHTS: Record<OpCoType, number> = { STP: 0.345, UNQ: 0.285, SSC: 0.183, BPL: 0.124, EMI: 0.048, USP: 0.013, SLV: 0.005 };

const CATEGORIES = ['Rapportering -> Standard reporting','Rapportering -> Rapportering Adhoc (Niet-standaard)','Rapportering -> Atlas','Rapportering -> Rapportering Kantoor (Greenbook - bug/incident)','Rapportering -> Rapportering Klant (Bluebook - bug/incident)','Rapportering -> Schedule reporting','Rapportering -> TAC sheets','Reporting -> Access Atlas (User Management)'] as const;
const CATEGORY_WEIGHTS = [0.28, 0.22, 0.15, 0.12, 0.10, 0.06, 0.05, 0.02];

const AFDELINGEN = ['Front Office','Mid Office','Finance','HR','Marketing','Sales/Tenderdesk','Legal','P&B','BPM/OPEX','IT','Projects/Implementatie','Credit & Collection','Safety & preventie','MIC','Audit','Accounting & Tax','L&D/Field Coach','Country/Corporate/Secretary'] as const;
const AFDELING_WEIGHTS = [0.18,0.12,0.11,0.08,0.07,0.07,0.04,0.05,0.04,0.06,0.05,0.04,0.02,0.03,0.02,0.03,0.03,0.03];

const STATES = ['Open','In behandeling','Gesloten','Wachten op feedback','Opgelost'];
const STATE_WEIGHTS = [0.15, 0.20, 0.45, 0.10, 0.10];

const TITLES: Record<string, string[]> = {
  'Rapportering -> Standard reporting': ['Weekrapport uitvoer verzoek','Maandelijkse KPI rapport aanvraag','Standaard uitzendrapport','Activiteitenrapport Q1','Prestatierapport per afdeling'],
  'Rapportering -> Rapportering Adhoc (Niet-standaard)': ['Ad hoc analyse aanvraag directie','Specifieke datapulling voor klant','Niet-standaard rapport bestelling','Urgente data-extractie nodig','Maatwerk rapportage verzoek'],
  'Rapportering -> Atlas': ['Atlas rapport aanmaken','Nieuwe Atlas dashboardview','Atlas data update vereist','Atlas gebruikerstoegang','Atlas module configuratie'],
  'Rapportering -> Rapportering Kantoor (Greenbook - bug/incident)': ['Greenbook rapport geeft fout','Kantoor dashboard laad niet','Groen rapport data klopt niet','Incident Greenbook systeem','Bug rapport kantoorscherm'],
  'Rapportering -> Rapportering Klant (Bluebook - bug/incident)': ['Bluebook klantrapport fout','Klant dashboard niet bereikbaar','Blauw rapport data onjuist','Incident klantenportal rapport','Bug in klantoverzicht'],
  'Rapportering -> Schedule reporting': ['Planningsrapport aanmaken','Roosterprestaties analyse','Schedule KPI overzicht','Werkplanning data export','Bezettingsgraad rapport'],
  'Rapportering -> TAC sheets': ['TAC sheet update aanvraag','Nieuwe TAC template nodig','TAC data correctie','TAC sheets maand review','TAC formulier aanpassen'],
  'Reporting -> Access Atlas (User Management)': ['Nieuwe Atlas gebruiker aanmaken','Atlas toegang intrekken','Gebruikersrechten aanpassen Atlas','Atlas login probleem oplossen','Atlas account reset'],
};

const PERSONS = ['Marie Dubois','Jan Peeters','Sophie Laurent','Thomas Maes','Anne Declercq','Luca Vermeersch','Emma Van den Berg','Nicolas Jacobs','Laura Wouters','David Claeys','Charlotte Goossens','Mathieu Stevens','Julie Bogaert','Pierre Leclercq','Nathalie Willems','Kevin De Smedt','Isabelle Mertens','Florian Desmet','Sarah Lefebvre','Antoine Martens'];

function weightedRandom<T>(items: readonly T[], weights: number[]): T {
  let random = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < items.length; i++) { random -= weights[i]; if (random <= 0) return items[i]; }
  return items[items.length - 1];
}
function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function padZero(n: number): string { return n < 10 ? `0${n}` : `${n}`; }

let callCounter = 100000;

function generateCall(year: number): OmniTrackerCall {
  callCounter++;
  const opco = weightedRandom(OPCOS, Object.values(OPCO_WEIGHTS));
  const category = weightedRandom(CATEGORIES, CATEGORY_WEIGHTS);
  const afdeling = weightedRandom(AFDELINGEN, AFDELING_WEIGHTS);
  const state = weightedRandom(STATES, STATE_WEIGHTS);
  const person = PERSONS[randomInt(0, PERSONS.length - 1)];
  const month = randomInt(1, year === 2026 ? 4 : 12);
  const day = randomInt(1, 28);
  const hour = randomInt(7, 18);
  const minute = randomInt(0, 59);
  const titles = TITLES[category] || ['Verzoek aangemaakt'];
  const title = titles[randomInt(0, titles.length - 1)];
  const dateStr = `${year}-${padZero(month)}-${padZero(day)}T${padZero(hour)}:${padZero(minute)}:00`;
  return { Number: `SR-${callCounter}`, OpCo: opco, AffectedPerson: person, CategoryPath: category, CatSpecMIC: '', Created: dateStr, Title: title, State: state, Description: `Aanvraag ingediend door ${person} vanuit ${afdeling} afdeling.`, OPCO: opco, Afdeling: afdeling, year, month, day, hour };
}

const yearDistribution = [{ year: 2022, count: 44 },{ year: 2023, count: 38 },{ year: 2024, count: 36 },{ year: 2025, count: 42 },{ year: 2026, count: 40 }];
const calls: OmniTrackerCall[] = [];
callCounter = 100000;
for (const { year, count } of yearDistribution) { for (let i = 0; i < count; i++) calls.push(generateCall(year)); }
calls.sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime());

export const mockCalls: OmniTrackerCall[] = calls;

export function getCallsByOpco(filterYear?: number): { opco: string; count: number }[] {
  const filtered = filterYear ? calls.filter((c) => c.year === filterYear) : calls;
  const counts: Record<string, number> = {};
  for (const c of filtered) counts[c.OPCO] = (counts[c.OPCO] || 0) + 1;
  return Object.entries(counts).map(([opco, count]) => ({ opco, count })).sort((a, b) => b.count - a.count);
}

export function getCallsByMonth(filterYear?: number): { month: number; count: number; label: string }[] {
  const filtered = filterYear ? calls.filter((c) => c.year === filterYear) : calls;
  const counts: Record<number, number> = {};
  for (const c of filtered) counts[c.month] = (counts[c.month] || 0) + 1;
  const monthNames = ['','Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
  return Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({ month: m, count: counts[m] || 0, label: monthNames[m] }));
}

export function getCallsByCategory(filterYear?: number): { category: string; shortName: string; count: number }[] {
  const filtered = filterYear ? calls.filter((c) => c.year === filterYear) : calls;
  const counts: Record<string, number> = {};
  for (const c of filtered) counts[c.CategoryPath] = (counts[c.CategoryPath] || 0) + 1;
  const shortNames: Record<string, string> = {'Rapportering -> Standard reporting':'Standard','Rapportering -> Rapportering Adhoc (Niet-standaard)':'Ad Hoc','Rapportering -> Atlas':'Atlas','Rapportering -> Rapportering Kantoor (Greenbook - bug/incident)':'Greenbook','Rapportering -> Rapportering Klant (Bluebook - bug/incident)':'Bluebook','Rapportering -> Schedule reporting':'Schedule','Rapportering -> TAC sheets':'TAC','Reporting -> Access Atlas (User Management)':'User Mgmt'};
  return Object.entries(counts).map(([category, count]) => ({ category, shortName: shortNames[category] || category, count })).sort((a, b) => b.count - a.count);
}

export function getCallsByAfdeling(filterYear?: number): { afdeling: string; count: number }[] {
  const filtered = filterYear ? calls.filter((c) => c.year === filterYear) : calls;
  const counts: Record<string, number> = {};
  for (const c of filtered) counts[c.Afdeling] = (counts[c.Afdeling] || 0) + 1;
  return Object.entries(counts).map(([afdeling, count]) => ({ afdeling, count })).sort((a, b) => b.count - a.count);
}

export function getCallsByYear(): { year: number; count: number }[] {
  const counts: Record<number, number> = {};
  for (const c of calls) counts[c.year] = (counts[c.year] || 0) + 1;
  return Object.entries(counts).map(([year, count]) => ({ year: Number(year), count })).sort((a, b) => a.year - b.year);
}

export function getRecentCalls(n: number): OmniTrackerCall[] { return calls.slice(0, n); }

export function getCallsByYearAndOpco(): { year: number; STP: number; UNQ: number; SSC: number; BPL: number; EMI: number; USP: number; SLV: number }[] {
  return [2022,2023,2024,2025,2026].map((year) => {
    const yearCalls = calls.filter((c) => c.year === year);
    const result: Record<string, number> = { STP:0, UNQ:0, SSC:0, BPL:0, EMI:0, USP:0, SLV:0 };
    for (const c of yearCalls) result[c.OPCO] = (result[c.OPCO] || 0) + 1;
    return { year, ...result } as { year: number; STP: number; UNQ: number; SSC: number; BPL: number; EMI: number; USP: number; SLV: number };
  });
}

export const OPCO_COLORS: Record<string, string> = { STP:'#0369A1', UNQ:'#7C3AED', SSC:'#0891B2', BPL:'#F59E0B', EMI:'#10B981', USP:'#EF4444', SLV:'#6B7280' };
export const OPCO_NAMES: Record<string, string> = { STP:'Start People', UNQ:'Unique', SSC:'Solvus/SSC', BPL:'Bright Plus', EMI:'EMI', USP:'USG Professionals', SLV:'Solvus' };
