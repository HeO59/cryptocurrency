# 💎 Crypto Terminal Tools

Ce dépôt contient deux scripts Node.js permettant de suivre les prix des cryptomonnaies directement dans le terminal.

## coindesk.js

Affiche les prix et variations (24h / 7j) de plusieurs cryptomonnaies en EUR en utilisant l’API de **CoinDesk**, avec **mise à jour automatique toutes les 30 secondes**. Le script génère un tableau clair et coloré pour consulter rapidement l’évolution du marché.

## coingecko.js

Affiche en temps réel les prix et variations sur 24h de plusieurs cryptomonnaies via l’API **CoinGecko**, avec mise à jour automatique toutes les 30 secondes. L’affichage est optimisé, formaté selon la précision de chaque actif et utilise des indicateurs visuels (couleurs, flèches).

Ces deux outils permettent de surveiller simplement et rapidement les cours crypto depuis le terminal.

---

# 💎 Crypto Terminal Tools

This repository contains two Node.js scripts designed to display cryptocurrency prices directly in the terminal.

## coindesk.js

Fetches and displays real-time prices and 24h/7d percentage changes for multiple cryptocurrencies using the **CoinDesk** API, with **automatic updates every 30 seconds**. The script outputs a clean, colored table for quick market overview.

## coingecko.js

Retrieves and displays cryptocurrency prices and 24h changes using the **CoinGecko** API, with automatic updates every 30 seconds. The display is formatted per-asset (precision, symbols) and includes visual indicators such as arrows and colors.

Together, these tools provide a simple and efficient way to monitor crypto markets from the terminal.

---

### 🚀 Dependencies (Packages)

Installez les dépendances nécessaires pour l'exécution et le développement :

```bash
# Pour l'API (axios)
npm install axios

# Pour l'exécution en parallèle des deux scripts (concurrently et nodemon)
npm install concurrently nodemon --save-dev

```
---------
HEO
