import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowDown } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const ROLES = [
  'MERN Stack Developer',
  'Full Stack Engineer',
  'Problem Solver',
  'AI Enthusiast',
];

function useTypingEffect(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    const current = words[wordIdx];

    if (!deleting && charIdx <= current.length) {
      timeout.current = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx > current.length) {
      timeout.current = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout.current = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout.current);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

export default function Hero() {
  const typed = useTypingEffect(ROLES);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080810]"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-mono mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for opportunities
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-[1.05]"
            >
              Hi, I'm{' '}
              <span className="gradient-text">Piyush</span>
              <br />
              <span className="text-white">Pandey</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl lg:text-3xl font-semibold text-gray-300 mb-6 h-10"
            >
              <span className="gradient-text">{typed}</span>
              <span className="animate-pulse text-blue-400">|</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10"
            >
              Associate Software Engineer with <span className="text-white font-medium">1+ year</span> of professional experience
              building full-stack web applications. <span className="text-white font-medium">300+ DSA problems</span> solved.
              Currently exploring AI Agents & RAG systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                View Projects
              </button>
              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
              >
                <FiDownload size={16} />
                Download Resume
              </a>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 font-semibold hover:bg-blue-500/10 transition-all"
              >
                Contact Me
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              {[
                { icon: FiGithub, href: 'https://github.com/piyushp0710', label: 'GitHub' },
                { icon: FiLinkedin, href: 'https://linkedin.com/in/piyushpandey', label: 'LinkedIn' },
                { icon: SiLeetcode, href: 'https://leetcode.com/piyushpandey', label: 'LeetCode' },
                { icon: FiMail, href: 'mailto:piyush.pandey@cosmofeed.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Avatar / decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_20s_linear_infinite]">
                <div className="absolute -top-1 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-blue-500" />
                <div className="absolute -bottom-1 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-violet-500" />
              </div>
              {/* Inner ring */}
              <div className="absolute inset-4 rounded-full border border-violet-500/20 animate-[spin_15s_linear_infinite_reverse]">
                <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-violet-400" />
              </div>

              {/* Avatar circle */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/10 flex items-center justify-center">
                <span className="text-6xl lg:text-7xl font-black gradient-text select-none">PP</span>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg bg-[#13131f] border border-white/10 text-xs font-mono text-blue-400 shadow-lg"
              >
                300+ DSA ✓
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-lg bg-[#13131f] border border-white/10 text-xs font-mono text-violet-400 shadow-lg"
              >
                MERN Stack ⚡
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FiArrowDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
