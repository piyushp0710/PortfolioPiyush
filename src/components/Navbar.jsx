import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const links = ['About', 'Skills', 'Experience', 'Projects', 'DSA', 'Contact'];

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#080810]/80 backdrop-blur-xl border-b border-white/5 shadow-xl'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-mono text-lg font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
          >
            PP<span className="text-blue-400">.</span>
          </motion.a>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <li key={link}>
                <button
                  onClick={() => scrollTo(link)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <a
              href="/resume.pdf"
              download
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-opacity"
            >
              Resume
            </a>

            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#080810]/95 backdrop-blur-xl border-b border-white/5 md:hidden"
          >
            <ul className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo(link)}
                    className="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    {link}
                  </button>
                </li>
              ))}
              <li>
                <a href="/resume.pdf" download className="block px-4 py-3 text-blue-400 font-medium">
                  Download Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
