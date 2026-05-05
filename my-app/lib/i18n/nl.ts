import type { Translations } from './fr';

const nl: Translations = {
  nav: { overview: 'Overzicht', omnitracker: 'OmniTracker', brands: 'Merken', reports: 'Rapporten' },
  topbar: { role: 'Data Strateeg', logout: 'Uitloggen', language: 'Taal' },
  login: { title: 'Inloggen', subtitle: 'BA-BI Analytics Portaal', email: 'E-mailadres', password: 'Wachtwoord', submit: 'Inloggen', slogan: 'Opportunities for Life', error: 'Onjuiste inloggegevens. Probeer opnieuw.', loading: 'Bezig met inloggen...' },
  dashboard: { title: 'Overzicht', totalCalls: 'Totaal calls 2026', callsThisMonth: 'Calls deze maand', pendingCalls: 'Openstaande calls', activeBrands: 'Actieve merken', evolutionTitle: 'Jaarlijkse evolutie calls', categoryTitle: 'Verdeling per categorie (2026)', brandsTitle: 'Activiteit per merk', viewDetails: 'Details bekijken' },
  omnitracker: { title: 'OmniTracker Calls', filters: 'Filters', opco: 'OPCO', year: 'Jaar', category: 'Categorie', afdeling: 'Afdeling', allOpcos: 'Alle OPCOs', allYears: 'Alle jaren', allCategories: 'Alle categorieën', allAfdelingen: 'Alle afdelingen', totalCalls: 'Totaal calls', mainCategory: 'Hoofdcategorie', mostActiveOpco: 'Meest actieve OPCO', peakHour: 'Piekuur', monthlyEvolution: 'Maandelijkse evolutie', byAfdeling: 'Calls per afdeling', categoryDistribution: 'Categorieverdeling', recentCalls: '20 laatste calls', number: 'Nummer', titleCol: 'Titel', date: 'Datum', state: 'Status', reset: 'Resetten', apply: 'Toepassen' },
  brands: { title: 'Merk dashboard', back: 'Terug', totalCalls: 'Totaal calls', openCalls: 'Open calls', closedCalls: 'Gesloten calls', avgPerMonth: 'Gemiddeld / maand', monthlyTrend: 'Maandelijkse trend', categoryBreakdown: 'Categorieverdeling', recentActivity: 'Recente activiteit' },
  reports: { title: 'Rapporten & Analyses', executiveSummary: 'Uitvoerend overzicht', teamActivity: 'Activiteit van het BA-BI team', exportPdf: 'Exporteren als PDF', exportAlert: 'PDF export is in ontwikkeling', totalVolume: 'Totaal callvolume', yearlyTrend: 'Jaarlijkse trend', topCategories: 'Top categorieën', teamWork: 'Wat doet het BA-BI team', categories: { standard: 'Periodieke standaardrapporten', adhoc: 'Ad hoc analyses op aanvraag', atlas: 'Beheer van het Atlas-instrument', greenbook: 'Incident support Greenbook (kantoor)', bluebook: 'Incident support Bluebook (klant)', schedule: 'Planningsrapporten', tac: 'Beheer van TAC sheets', userMgmt: 'Beheer van Atlas gebruikerstoegang' } },
  states: { Open: 'Open', 'In behandeling': 'In behandeling', Gesloten: 'Gesloten', 'Wachten op feedback': 'Wachten op feedback', Opgelost: 'Opgelost' },
  common: { loading: 'Laden...', noData: 'Geen gegevens beschikbaar', calls: 'calls', hour: 'u' },
};

export default nl;
