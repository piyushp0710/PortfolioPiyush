import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import DSASection from './components/DSASection';
import Learning from './components/Learning';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      {!loading && (
        <>
          <ScrollProgress />
          <Navbar />

          <main>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <DSASection />
            <Learning />
            <Contact />
          </main>

          <Footer />
          <BackToTop />
        </>
      )}
    </div>
  );
}
