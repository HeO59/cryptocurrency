const axios = require("axios");

// Configuration et Constantes
const API_URL = "https://data-api.coindesk.com/spot/v1/latest/tick";
const MARKET = "coinbase";
// Liste des actifs à suivre. Facile à modifier !
const INSTRUMENTS = ["BTC-EUR", "ETH-EUR", "LTC-EUR", "SOL-EUR"];
const INSTRUMENTS_QUERY = INSTRUMENTS.join(",");
const COL_WIDTHS = [6, 15, 10, 10]; // Largeurs des colonnes ajustées pour le prix
const UPDATE_INTERVAL_MS = 30000; // Intervalle de mise à jour (30 secondes)

// --- Fonctions Utilitaires ---

function colorChange(val) {
  const arrow = val >= 0 ? "▲" : "▼";
  // Codes ANSI pour Vert (32) et Rouge (31)
  const color = val >= 0 ? "\x1b[32m" : "\x1b[31m";
  const reset = "\x1b[0m";
  return `${color}${arrow} ${Math.abs(val).toFixed(2)} %${reset}`;
}

function pad(str, len) {
  // Convertir en chaîne de caractères, puis compléter à droite
  return String(str).padEnd(len, " ");
}

function formatPrice(price, locale = "fr-FR", currency = "EUR") {
  // Formatage du prix avec séparateur de milliers et symbole €
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function formatAssetLine(instrumentKey, data) {
  const asset = instrumentKey.split("-")[0]; // Ex: "BTC"
  const instrumentData = data[instrumentKey];

  return (
    pad(asset, COL_WIDTHS[0]) +
    " | " +
    pad(formatPrice(instrumentData.PRICE), COL_WIDTHS[1]) +
    " | " +
    pad(
      colorChange(instrumentData.MOVING_24_HOUR_CHANGE_PERCENTAGE),
      COL_WIDTHS[2]
    ) +
    " | " +
    pad(
      colorChange(instrumentData.MOVING_7_DAY_CHANGE_PERCENTAGE),
      COL_WIDTHS[3]
    )
  );
}

// --- Fonction Principale ---

async function getPrices() {
  const url = `${API_URL}?market=${MARKET}&instruments=${INSTRUMENTS_QUERY}&apply_mapping=true`;

  try {
    const res = await axios.get(url);
    const data = res.data.Data;

    // Récupérer le timestamp d'un des actifs, car il devrait être le même.
    const firstInstrumentKey = INSTRUMENTS[0];
    if (!data[firstInstrumentKey]) {
      throw new Error(
        `Aucune donnée trouvée pour ${firstInstrumentKey}. Vérifiez la liste des instruments.`
      );
    }

    const date = new Date(
      data[firstInstrumentKey].PRICE_LAST_UPDATE_TS * 1000
    ).toLocaleString("fr-FR");

    // Génération de l'en-tête et du séparateur
    const header =
      pad("Actif", COL_WIDTHS[0]) +
      " | " +
      pad("Prix", COL_WIDTHS[1]) +
      " | " +
      pad("24h", COL_WIDTHS[2]) +
      " | " +
      pad("7j", COL_WIDTHS[3]);
    const sep = "-".repeat(COL_WIDTHS.reduce((a, b) => a + b) + 9); // Longueur totale des colonnes + 3 séparateurs ' | '

    // Génération dynamique des lignes
    const lines = INSTRUMENTS.map((key) => formatAssetLine(key, data));

    // Affichage
    // 🧹 EFFACE LA CONSOLE AVANT D'AFFICHER LE NOUVEAU TABLEAU
    console.clear();
    console.log(`\n📅 Dernière mise à jour : ${date}\n`);
    console.log(header);
    console.log(sep);
    lines.forEach((line) => console.log(line));
  } catch (error) {
    // Affichage des erreurs sans effacer le reste du ticker
    console.error(
      `\n❌ Erreur lors de la récupération des données : ${error.message}`
    );
    if (error.response) {
      console.error(`Statut HTTP: ${error.response.status}`);
    }
  }
}

// --- Ticker Loop ---

function runTicker() {
  getPrices();
}

// Premier appel immédiat
runTicker();

// Mise à jour toutes les 30 secondes
setInterval(runTicker, UPDATE_INTERVAL_MS);
