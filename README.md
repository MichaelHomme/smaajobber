# Småjobber 🛠️🤝
*En moderne, AI-støttet plattform for formidling av småjobber.*


---

**Småjobber** er en interaktiv og brukervennlig webapplikasjon bygget med **React 19**, **Vite** og **Tailwind CSS v4**. Den er designet for å koble mennesker som trenger hjelp med praktiske oppgaver (som hagearbeid, flytting, utvask, eller leksehjelp) med dyktige, lokale hjelpere. Plattformen har også en integrert smart-assistent drevet av **Google Gemini API** for å forenkle prosessen med å finne oppdrag eller registrere nye.

## 🚀 Hovedfunksjoner

Småjobber tilbyr en sømløs og engasjerende brukeropplevelse med flerskjerms-navigasjon og elegante animasjoner drevet av **Motion**:

1. **🏡 Landingsside (Hjem)**
   - Oversiktlig introduksjon med dynamisk søk og snarveier til ulike kategorier.
   - Fremhevede hjelpere og nøkkeltall om plattformen.

2. **🔍 Se Oppdrag**
   - Fullstendig oversikt over aktive oppdrag som venter på en hjelper.
   - Filtrering basert på kategorier (hage, vasking, flytting, maling, dyrepass osv.) og fritekstsøk.

3. **➕ Legg ut Oppdrag**
   - Et enkelt, intuitivt skjema for å registrere nye oppdrag.
   - Mulighet for å sette tittel, beskrivelse, sted, kategori, budsjett og ønsket dato.

4. **✨ Finn Hjelper**
   - Bla gjennom profiler av lokale hjelpere i ditt nærområde.
   - Detaljerte profiler med rangering, omtaler, timepriser og beskrivelser.

5. **📊 Dashbord**
   - Personlig kontrollpanel som gir full oversikt over dine publiserte oppdrag.
   - Statussporing (f.eks. "Aktiv", "Vurdert av eier") samt statistikk på dine avtaler.

6. **🤖 AI-støttet Chat-Widget**
   - En innebygd AI-assistent drevet av **Google Gemini** (`@google/genai`).
   - Hjelper brukere med å finne relevante oppdrag, svare på spørsmål om tjenesten og gi tips til hvordan man skriver gode oppdragsbeskrivelser.

---

## 🛠️ Tech Stack

The platform is built using modern and performance-oriented technologies:
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 (with modern CSS-first configuration)
- **Animations**: Motion (Framer Motion) for smooth and natural page transitions and interactive animations
- **Icons**: Lucide React
- **AI Integration**: `@google/genai` (Google Gen AI SDK) for real-time AI chat

---

## 💻 Kom i gang lokalt

Følg disse trinnene for å kjøre prosjektet på din egen maskin:

### Forutsetninger
- **Node.js** (versjon 18 eller nyere)
- **npm** (eller pnpm/yarn)

### Installasjon og oppstart

1. **Installer avhengigheter:**
   ```bash
   npm install
   ```

2. **Start utviklingsserveren:**
   ```bash
   npm run dev
   ```
   Appen vil være tilgjengelig på [http://localhost:3000](http://localhost:3000).

3. **Bygg for produksjon (valgfritt):**
   ```bash
   npm run build
   ```

---

## 📂 Prosjektstruktur

```text
smaajobber/
├── src/
│   ├── components/       # Gjenbrukbare UI-komponenter (Header, Footer, AI Chat, osv.)
│   ├── data.ts           # Dummy-data for oppdrag og hjelpere
│   ├── types.ts          # TypeScript-grensesnitt og typer
│   ├── App.tsx           # Hovedkomponent med ruting og skjermtilstander
│   ├── main.tsx          # Applikasjonens inngangspunkt
│   └── index.css         # Globale stiler og Tailwind CSS-import
├── vite.config.ts        # Vite-konfigurasjon med Tailwind-plugin
├── package.json          # Prosjektavhengigheter og skript
└── README.md             # Prosjektdokumentasjon
```