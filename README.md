# PDF-Magic

**Kostenlose PDF-Werkzeuge direkt im Browser** | **Free PDF tools right in your browser**

PDF-Magic ist ein web-basiertes Tool zum Bearbeiten von PDF-Dateien. Alle Verarbeitung findet **direkt im Browser** statt — keine Dateien werden auf Server hochgeladen. Deine Daten bleiben privat.

> **[PDF-Magic öffnen](https://mrckurz.github.io/pdf-magic/)**

---

## Features

| Tool | Beschreibung | Description |
|------|-------------|-------------|
| **Zusammenführen** | Mehrere PDFs zu einem kombinieren | Merge multiple PDFs into one |
| **Aufteilen** | Ein PDF in mehrere Teile splitten | Split a PDF into multiple parts |
| **Extrahieren** | Bestimmte Seiten herausholen | Extract specific pages |
| **Entfernen** | Unerwünschte Seiten löschen | Remove unwanted pages |

### Weitere Features

- **Zweisprachig**: Deutsch & Englisch, automatische Erkennung der Browsersprache
- **Seitenvorschau**: Thumbnails aller PDF-Seiten für einfache Auswahl
- **Drag & Drop**: Dateien per Drag & Drop hochladen und sortieren
- **Lokaler Speicher**: Bearbeitete PDFs in der Browser-Datenbank (IndexedDB) speichern
- **Cloud-Speicher** *(optional)*: Dateien in Supabase Cloud speichern für geräteübergreifenden Zugriff
- **Datenschutz**: Alle Verarbeitung client-seitig — keine Server-Uploads

---

## Tech-Stack

| Technologie | Zweck |
|-------------|-------|
| [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) | UI Framework |
| [Vite](https://vite.dev) | Build Tool & Dev Server |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [pdf-lib](https://pdf-lib.js.org/) | PDF-Manipulation (merge, split, extract, trim) |
| [PDF.js](https://mozilla.github.io/pdf.js/) | PDF-Rendering für Vorschau & Thumbnails |
| [Dexie.js](https://dexie.org/) | IndexedDB Wrapper für lokale Speicherung |
| [Supabase](https://supabase.com) | Cloud Storage & Auth (optional) |
| [react-i18next](https://react.i18next.com/) | Internationalisierung (DE/EN) |
| [React Router](https://reactrouter.com/) | Client-seitiges Routing |
| [@dnd-kit](https://dndkit.com/) | Drag & Drop Sortierung |
| [Zustand](https://zustand.docs.pmnd.rs/) | State Management |
| [Vitest](https://vitest.dev/) | Unit Testing |

---

## Tests

Unit-Tests decken die Kern-PDF-Operationen (merge, split, extract, trim) und die lokale Speicherung (IndexedDB) ab.

```bash
# Tests einmalig ausführen
npm test

# Tests im Watch-Modus (während der Entwicklung)
npm run test:watch
```

Tests laufen automatisch in der CI-Pipeline vor dem Build — fehlschlagende Tests verhindern das Deployment.

---

## Lokale Entwicklung

### Voraussetzungen

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### Setup

```bash
# Repository klonen
git clone https://github.com/mrckurz/pdf-magic.git
cd pdf-magic

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App läuft dann unter `http://localhost:5173/pdf-magic/`.

### Build

```bash
npm run build
```

Das Build-Ergebnis liegt in `./dist/` und kann auf jedem statischen Webserver deployed werden.

---

## Cloud-Speicher einrichten (optional)

PDF-Magic funktioniert vollständig ohne Cloud-Backend. Wenn du den optionalen Cloud-Speicher aktivieren möchtest:

1. Erstelle ein kostenloses Projekt auf [supabase.com](https://supabase.com)
2. Erstelle einen Storage Bucket namens `pdfs`
3. Erstelle eine `.env.local` Datei:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Für das Deployment: Hinterlege die Werte als Repository Secrets in GitHub

---

## Deployment

Das Projekt wird automatisch via **GitHub Actions** auf **GitHub Pages** deployed, bei jedem Push auf den `main`-Branch.

### Erstmalige Einrichtung:

1. Gehe zu **Repository Settings** → **Pages**
2. Setze die Source auf **GitHub Actions**
3. Pushe auf `main` — der Workflow baut und deployed automatisch

---

## Architektur

```
Browser
├── React App (Vite + TypeScript)
│   ├── Pages: Home, Merge, Split, Extract, Trim, MyFiles
│   ├── PDF-Verarbeitung: pdf-lib (client-seitig)
│   ├── Vorschau: pdfjs-dist (Canvas-Rendering)
│   ├── Lokaler Speicher: IndexedDB via Dexie.js
│   └── Cloud-Speicher: Supabase Client (optional)
│
└── Deployment: GitHub Pages (statisch)
```

Alle PDF-Operationen laufen vollständig im Browser:
- **pdf-lib** liest und schreibt PDF-Dokumente als `ArrayBuffer`
- **PDF.js** rendert einzelne Seiten auf ein `<canvas>` für Thumbnails
- **IndexedDB** speichert bearbeitete PDFs lokal im Browser (kein Größenlimit wie bei localStorage)

---

## Lizenz

MIT
