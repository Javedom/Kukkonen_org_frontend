
// Määritellään Trusted Types -politiikka XSS-hyökkäysten ehkäisemiseksi
if (window.trustedTypes && window.trustedTypes.createPolicy) {
     window.trustedTypes.createPolicy('default', {
          createHTML: (string) => string, // Luotamme siihen, että sovelluslogiikka (kuten DOMPurify) on hoitanut puhdistuksen
          createScript: (string) => string,
          createScriptURL: (string) => string,
     });
}

// Tuodaan tyylit
import './styles.css';

// Tuodaan moduulit
import { initNavigation } from './modules/navigation.js';
import { initScrollAnimations } from './modules/animations.js';
import { initScrollProgress, initTheme } from './modules/ui-utils.js';
import { initCVAccordion } from './modules/cv.js';
import { initChat } from './modules/chat.js';
import { logVisitToConsole } from './modules/analytics.js';
import { initEasterEgg } from './modules/easter-egg.js';
import { initLanguage } from './modules/language.js'; // Lisää tämä

document.addEventListener('DOMContentLoaded', () => {
     initNavigation();
     initScrollAnimations();
     initScrollProgress();
     initTheme();
     initLanguage(); // Lisää tämä
     initCVAccordion();
     initChat();
     initEasterEgg();

     // Viivästytetty lokitus LCP:n optimoimiseksi
     if (document.readyState === 'complete') {
          setTimeout(logVisitToConsole, 2000);
     } else {
          window.addEventListener('load', () => setTimeout(logVisitToConsole, 2000));
     }
});