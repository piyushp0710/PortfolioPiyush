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
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#080810] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      {!loading && (
        <>
          <ScrollProgress />
          <Navbar theme={theme} toggleTheme={toggleTheme} />

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
