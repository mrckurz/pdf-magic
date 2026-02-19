import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { MergePage } from './pages/MergePage';
import { SplitPage } from './pages/SplitPage';
import { ExtractPage } from './pages/ExtractPage';
import { TrimPage } from './pages/TrimPage';
import { MyFilesPage } from './pages/MyFilesPage';
import { ImpressumPage } from './pages/ImpressumPage';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/merge" element={<MergePage />} />
              <Route path="/split" element={<SplitPage />} />
              <Route path="/extract" element={<ExtractPage />} />
              <Route path="/trim" element={<TrimPage />} />
              <Route path="/my-files" element={<MyFilesPage />} />
              <Route path="/impressum" element={<ImpressumPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
