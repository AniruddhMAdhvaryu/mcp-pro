import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoReelModal } from './components/DemoReelModal';
import { ApiKeysModal, loadStoredApiKeys } from './components/ApiKeysModal';
import { HomePage } from './pages/HomePage';
import { ChatStudioPage } from './pages/ChatStudioPage';
import { WorkbenchPage } from './pages/WorkbenchPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { McpHubPage } from './pages/McpHubPage';
import { BenchmarksPage } from './pages/BenchmarksPage';
import type { PageId, WorkbenchTab } from './data/mcpproData';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [workbenchTab, setWorkbenchTab] = useState<WorkbenchTab>('flight-deck');
  const [demoOpen, setDemoOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const [keyCount, setKeyCount] = useState<number>(() => Object.keys(loadStoredApiKeys()).length);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (page: PageId, tab?: WorkbenchTab) => {
    if (tab) setWorkbenchTab(tab);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  useGSAP(
    () => {
      gsap.from('.view-transition-root', {
        autoAlpha: 0,
        y: 10,
        duration: 0.28,
        ease: 'power2.out',
      });
    },
    { scope: mainRef, dependencies: [activePage] }
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenKeys={() => setKeysOpen(true)}
        configuredKeyCount={keyCount}
      />

      <main ref={mainRef} style={{ flex: 1 }}>
        <div key={activePage} className="view-transition-root">
          {activePage === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenDemo={() => setDemoOpen(true)}
              onOpenKeys={() => setKeysOpen(true)}
            />
          )}
          {activePage === 'studio' && (
            <ChatStudioPage
              onOpenKeys={() => setKeysOpen(true)}
              onNavigate={handleNavigate}
              configuredKeyCount={keyCount}
            />
          )}
          {activePage === 'workbench' && (
            <WorkbenchPage key={workbenchTab} initialTab={workbenchTab} />
          )}
          {activePage === 'architecture' && <ArchitecturePage />}
          {activePage === 'mcp' && <McpHubPage />}
          {activePage === 'benchmarks' && <BenchmarksPage />}
        </div>
      </main>

      {activePage !== 'studio' && (
        <Footer onNavigate={handleNavigate} onOpenKeys={() => setKeysOpen(true)} />
      )}

      <DemoReelModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        onLaunchWorkbench={(p) => handleNavigate(p)}
      />

      <ApiKeysModal
        isOpen={keysOpen}
        onClose={() => setKeysOpen(false)}
        onKeysChanged={(c) => setKeyCount(c)}
      />
    </div>
  );
}
