# Juho Kukkonen - Portfolio Website

Tämä repositorio sisältää Juho Kukkosen henkilökohtaisen portfoliosivuston lähdekoodin. Sivusto on suunniteltu esittelemään ammatillista osaamista, työkokemusta ja harrasteprojekteja modernilla ja teknisesti laadukkaalla tavalla.

Sivusto on rakennettu suorituskykyä ja tietoturvaa silmällä pitäen, hyödyntäen moderneja web-teknologioita ilman raskaita sovelluskehyksiä.

## 🚀 Ominaisuudet

* **Moderni Tech Stack:** Rakennettu Vite-työkalulla ja Vanilla JavaScriptillä (ES Modules) optimaalisen suorituskyvyn takaamiseksi.
* **Responsiivinen UI/UX:** Tyylitelty Tailwind CSS:llä, sisältäen kustomoidun teeman ja animaatiot.
* **AI-avustaja:** Integroitu chatbot (Prompt Injected Gemini API), joka vastaa kysymyksiin Juhon kokemuksesta ja projekteista.
    * *Huom: Chatbot vaatii toimiakseen erillisen backend-palvelun (+ mahdollisesti proxyn ennen backendiä).*
* **Kielituki:** Täysi tuki suomen ja englannin kielelle (i18n).
* **Tumma teema (Dark Mode):** Toteutettu modernilla View Transitions API:lla (Chromium-selaimet) tai perinteisellä CSS-luokan vaihdolla.
* **Tietoturva:** XSS-suojaukset (`DOMPurify`, Trusted Types) ja tiukat HTTP-otsikot (`serve.json`).
* **Easter Egg:** Konami-koodilla aktivoituva "Retro Windows 95" -tila.
* **Analytiikka:** Yksityisyyttä kunnioittava kävijäseuranta (Ei vaadi evästeilmoitusta).

## 🛠️ Teknologiat

* **Frontend:** HTML5, JavaScript (ES6+), CSS3
* **Tyylit:** [Tailwind CSS](https://tailwindcss.com/)
* **Build-työkalu:** [Vite](https://vitejs.dev/)
* **Kirjastot:**
    * `marked` (Markdown-renderöinti)
    * `dompurify` (XSS-suojaus)
    * `FontAwesome` (Ikonit)

## 📦 Asennus ja käyttö

Varmista, että koneellesi on asennettu [Node.js](https://nodejs.org/) (versio 18+ suositeltu).

1.  **Kloonaa repositorio:**
    ```bash
    git clone [https://github.com/kayttajatunnus/repo-nimi.git](https://github.com/kayttajatunnus/repo-nimi.git)
    cd repo-nimi
    ```

2.  **Asenna riippuvuudet:**
    ```bash
    npm install
    ```

3.  **Luo ympäristömuuttujat:**
    Luo projektin juureen `.env` -tiedosto ja määritä backendin osoite (jos käytössä):
    ```env
    VITE_API_BASE_URL=http://localhost:3000
    ```

4.  **Käynnistä kehityspalvelin:**
    ```bash
    npm run dev
    ```
    Sivusto aukeaa osoitteeseen `http://localhost:5173`.

## Rakentaminen tuotantoon (Build)

Projektin optimoitu tuotantoversio luodaan `dist/` -kansioon:

```bash
npm run build


## Julkaisu (Deployment)

Projekti on konfiguroitu toimimaan **Railway**-alustalla (`railway.toml`), mutta se voidaan julkaista missä tahansa staattisia sivuja tukevassa palvelussa (esim. Vercel, Netlify, GitHub Pages).

**Railway-konfiguraatio:**
* **Build command:** `npm install && npm run build`
* **Start command:** `npx serve dist -l $PORT`

## 📂 Projektin rakenne

```text
├── public/              # Staattiset tiedostot (kuvat, PDF:t, robots.txt)
├── src/
│   ├── modules/         # Sovelluslogiikka jaetuna moduuleihin
│   │   ├── analytics.js # Kävijäseuranta
│   │   ├── animations.js# Scroll-animaatiot
│   │   ├── chat.js      # AI-chatbot logiikka
│   │   ├── cv.js        # CV-osion interaktiivisuus
│   │   ├── easter-egg.js# Retro-tila
│   │   ├── language.js  # Kielivalinta
│   │   ├── navigation.js# Mobiilivalikko ja skrollaus
│   │   ├── translations.js # Käännöstiedostot (FI/EN)
│   │   └── ui-utils.js  # Teema ja UI-apuohjelmat
│   ├── main.js          # Sovelluksen entry point
│   └── styles.css       # Tailwind-direktiivit ja kustomoidut tyylit
├── index.html           # Pääsivu
├── package.json         # Riippuvuudet ja skriptit
├── tailwind.config.js   # Tailwind-asetukset
└── vite.config.js       # Vite-asetukset
