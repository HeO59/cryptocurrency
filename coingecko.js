const axios = require("axios");

// --- ⚙️ CONFIGURATION ---
const API_CONFIG = {
  URL: "https://api.coingecko.com/api/v3/simple/price",
  VS_CURRENCY: "eur",
  TIMEOUT_MS: 5000,
};

// Mappage (Nom CoinGecko : Symbole Affiché, Précision du prix)
const CRYPTO_ASSETS = {
  bitcoin: { symbol: "BTC", pricePrecision: 0 }, // BTC n'a pas besoin de décimales forcées
  ethereum: { symbol: "ETH", pricePrecision: 2 },
  litecoin: { symbol: "LTC", pricePrecision: 2 },
  ripple: { symbol: "XRP", pricePrecision: 4 }, // XRP est de faible valeur, nécessite plus de précision
};

const UPDATE_INTERVAL_MS = 30000; // 30 secondes

// --- Classe CryptoPrices Améliorée ---

class CryptoPrices {
  constructor(assets, config) {
    this.assets = assets;
    this.config = config;
    this.ids = Object.keys(this.assets).join(",");
  }

  // Fonction utilitaire pour un formatage monétaire clair (avec séparateurs de milliers)
  formatPrice(price, precision) {
    // Utilise Intl.NumberFormat pour un formatage localisé
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: this.config.VS_CURRENCY,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(price);
  }

  async fetchPrices() {
    try {
      const { data } = await axios.get(this.config.URL, {
        params: {
          ids: this.ids,
          vs_currencies: this.config.VS_CURRENCY,
          // La précision du prix est gérée par la fonction formatPrice()
          include_24hr_change: true,
        },
        timeout: this.config.TIMEOUT_MS,
      });

      // Remappage des données brutes en un format Symbol -> { price, change24h }
      return Object.entries(this.assets).reduce(
        (acc, [coinGeckoName, assetData]) => {
          const apiData = data[coinGeckoName];

          if (apiData) {
            acc[assetData.symbol] = {
              price: apiData.eur || 0,
              change24h: apiData.eur_24h_change || 0,
              precision: assetData.pricePrecision,
            };
          }
          return acc;
        },
        {}
      );
    } catch (error) {
      console.error(
        `\n❌ Erreur de l'API (${error.code || "HTTP"}): ${error.message}`
      );
      return null;
    }
  }

  display(prices) {
    if (!prices || Object.keys(prices).length === 0) return;

    const date = new Date().toLocaleTimeString("fr-FR");
    console.clear();
    console.log(`💎 Prix Crypto en EUR | Mis à jour à ${date}`);
    console.log("═".repeat(40));

    Object.entries(prices).forEach(
      ([symbol, { price, change24h, precision }]) => {
        const trend = change24h >= 0 ? "🟢 ▲" : "🔴 ▼";
        const color = change24h >= 0 ? "\x1b[32m" : "\x1b[31m";
        const reset = "\x1b[0m";

        const formattedPrice = this.formatPrice(price, precision);

        // Affichage aligné
        console.log(
          `${symbol.padEnd(4)} | ${formattedPrice.padEnd(
            15
          )} | ${color}${trend} ${Math.abs(change24h).toFixed(2)} %${reset}`
        );
      }
    );
  }
}

// --- Utilisation ---

const crypto = new CryptoPrices(CRYPTO_ASSETS, API_CONFIG);

async function runTicker() {
  const prices = await crypto.fetchPrices();
  crypto.display(prices);
}

// Prix instantané au démarrage
runTicker();

// Mise à jour périodique
setInterval(runTicker, UPDATE_INTERVAL_MS);
