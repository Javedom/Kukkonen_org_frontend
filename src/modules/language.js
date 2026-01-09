// src/modules/language.js
import { translations } from './translations.js';

export function initLanguage() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    // 1. Tarkista tallennettu kieli tai oletus (fi)
    const savedLang = localStorage.getItem('language') || 'fi';
    setLanguage(savedLang);

    // 2. Kuuntelijat napeille
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

export function setLanguage(lang) {
    // Tallenna valinta
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang; // Päivitä <html lang="fi"> SEO:ta varten

    // Päivitä aktiivinen tila nappeihin
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.getAttribute('data-lang') === lang) {
            btn.classList.add('font-bold', 'text-brown', 'dark:text-gold');
            btn.classList.remove('text-brown-light', 'dark:text-beige', 'opacity-70');
        } else {
            btn.classList.remove('font-bold', 'text-brown', 'dark:text-gold');
            btn.classList.add('text-brown-light', 'dark:text-beige', 'opacity-70');
        }
    });

    // Päivitä tekstit
    updateContent(lang);
    window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
}

function updateContent(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        // Haetaan arvo pisteillä erotetusta avaimesta (esim. "nav.home")
        const value = key.split('.').reduce((obj, i) => obj ? obj[i] : null, translations[lang]);

        if (value) {
            // Jos elementti on input tai textarea, vaihda placeholder
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                // Säilytä iconit jos ne ovat erillisinä elementteinä, 
                // mutta tässä tapauksessa korvaamme tekstisisällön.
                // Jos elementin sisällä on ikoni (esim <i class="..."></i> Teksti), 
                // pitää olla tarkkana. Turvallisinta on laittaa käännettävä teksti <span> sisään.
                el.innerHTML = value;
            }
        }
    });
}