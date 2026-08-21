import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { AppProvider } from "./store/AppStore";
import { PageShell, ScrollToTop } from "./components/Chrome";
import { CompareModal, CompareTray, QuoteModal } from "./components/overlays";
import { prefersReducedMotion } from "./lib/utils";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import MachineDetail from "./pages/MachineDetail";
import Company from "./pages/Company";
import Contents from "./pages/Contents";
import { ContactPage, FinancingPage, TradeInPage } from "./pages/Forms";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Smooth scroll (Lenis) — desligado em prefers-reduced-motion
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", () => ScrollTrigger.update());
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
        <PageShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/maquinas" element={<Catalog mode="all" />} />
            <Route path="/maquinas/:slug" element={<MachineDetail />} />
            <Route path="/novos" element={<Catalog mode="novos" />} />
            <Route path="/usados" element={<Catalog mode="usados" />} />
            <Route path="/implementos" element={<Catalog mode="implementos" />} />
            <Route path="/minhas-maquinas" element={<Catalog mode="favoritas" />} />
            <Route path="/financiamento" element={<FinancingPage />} />
            <Route path="/troca" element={<TradeInPage />} />
            <Route path="/empresa" element={<Company />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/conteudos" element={<Contents />} />
            <Route path="*" element={<Catalog mode="all" />} />
          </Routes>
        </PageShell>
        <QuoteModal />
        <CompareTray />
        <CompareModal />
      </HashRouter>
    </AppProvider>
  );
}
