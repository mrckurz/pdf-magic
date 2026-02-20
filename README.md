# PDF-Magic

**Free PDF tools right in your browser**

PDF-Magic is a web-based tool for editing PDF files. All processing happens **entirely in the browser** — no files are uploaded to any server. Your data stays private.

> **[Open PDF-Magic](https://mrckurz.github.io/pdf-magic/)**

---

## Features

| Tool | Description |
|------|-------------|
| **Merge** | Combine multiple PDFs into one |
| **Split** | Split a PDF into multiple parts |
| **Extract** | Extract specific pages |
| **Trim** | Remove unwanted pages |

### Additional Features

- **Bilingual**: German & English with automatic browser language detection
- **Page Preview**: Thumbnails of all PDF pages for easy selection
- **Drag & Drop**: Upload and reorder files via drag & drop
- **Local Storage**: Save processed PDFs in the browser database (IndexedDB)
- **Cloud Storage** *(optional)*: Store files in Supabase Cloud for cross-device access
- **Privacy**: All processing is client-side — no server uploads

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) | UI Framework |
| [Vite](https://vite.dev) | Build Tool & Dev Server |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [pdf-lib](https://pdf-lib.js.org/) | PDF manipulation (merge, split, extract, trim) |
| [PDF.js](https://mozilla.github.io/pdf.js/) | PDF rendering for previews & thumbnails |
| [Dexie.js](https://dexie.org/) | IndexedDB wrapper for local storage |
| [Supabase](https://supabase.com) | Cloud Storage & Auth (optional) |
| [react-i18next](https://react.i18next.com/) | Internationalization (DE/EN) |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [@dnd-kit](https://dndkit.com/) | Drag & drop sorting |
| [Zustand](https://zustand.docs.pmnd.rs/) | State Management |
| [Vitest](https://vitest.dev/) | Unit Testing |

---

## Tests

Unit tests cover the core PDF operations (merge, split, extract, trim) and local storage (IndexedDB).

```bash
# Run tests once
npm test

# Run tests in watch mode (during development)
npm run test:watch
```

Tests run automatically in the CI pipeline before the build — failing tests prevent deployment.

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### Setup

```bash
# Clone the repository
git clone https://github.com/mrckurz/pdf-magic.git
cd pdf-magic

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/pdf-magic/`.

### Build

```bash
npm run build
```

The build output is in `./dist/` and can be deployed to any static web server.

---

## Cloud Storage Setup (optional)

PDF-Magic works fully without a cloud backend. To enable optional cloud storage:

1. Create a free project on [supabase.com](https://supabase.com)
2. Create a storage bucket named `pdfs`
3. Create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. For deployment: Add the values as repository secrets in GitHub

---

## Deployment

The project is automatically deployed via **GitHub Actions** to **GitHub Pages** on every push to the `main` branch.

### First-time setup:

1. Go to **Repository Settings** → **Pages**
2. Set the source to **GitHub Actions**
3. Push to `main` — the workflow builds and deploys automatically

---

## Architecture

```
Browser
├── React App (Vite + TypeScript)
│   ├── Pages: Home, Merge, Split, Extract, Trim, MyFiles
│   ├── PDF Processing: pdf-lib (client-side)
│   ├── Preview: pdfjs-dist (canvas rendering)
│   ├── Local Storage: IndexedDB via Dexie.js
│   └── Cloud Storage: Supabase Client (optional)
│
└── Deployment: GitHub Pages (static)
```

All PDF operations run entirely in the browser:
- **pdf-lib** reads and writes PDF documents as `ArrayBuffer`
- **PDF.js** renders individual pages onto a `<canvas>` for thumbnails
- **IndexedDB** stores processed PDFs locally in the browser (no size limit like localStorage)

---

## License

MIT
