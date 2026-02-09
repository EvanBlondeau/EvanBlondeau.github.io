/**
 * Point d'entrée principal (Main Entry Point)
 * ------------------------------------------------------------------
 * Ce fichier orchestre l'initialisation de tous les modules JavaScript du site.
 * Il importe les fonctions d'initialisation de chaque module et les exécute.
 */
import { initUI } from './modules/ui.js';
import { initSkills } from './modules/skills.js';
import { initPortfolio } from './modules/portfolio.js';
import { initCounters } from './modules/counters.js';

(function() {
  "use strict";

  // Initialisation de tous les modules
  initUI();        // Interface Utilisateur (Nav, Scroll, Typed...)
  initSkills();    // Section Compétences (Barres de progression)
  initPortfolio(); // Section Portfolio (Filtres, Carrousel)
  initCounters();  // Animation des compteurs (Stats)

})();
