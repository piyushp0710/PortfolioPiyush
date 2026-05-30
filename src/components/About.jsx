import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiCode, FiCpu, FiTarget, FiTrendingUp } from 'react-icons/fi';

const stats = [
  { value: '1+', label: 'Year Experience', icon: FiTrendingUp },
  { value: '400+', label: 'DSA Problems', icon: FiTarget },
  { value: '10+', label: 'Projects Built', icon: FiCode },
  { value: '4', label: 'Coding Platforms', icon: FiCpu },
];

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <span className="inline-block text-xs font-mono tracking-[0.3em] text-blue-400 uppercase mb-4">
        {eyebrow}
      </span>
      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-gray-400 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export { SectionHeader };

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 bg-[#0e0e1a]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="About Me"
          title="Building the Web, One Stack at a Time"
          subtitle="A software engineer who cares deeply about code quality, user experience, and continuous learning."
        />

        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <p className="text-gray-300 leading-relaxed text-lg">
              I'm an <span className="text-white font-semibold">Associate Software Engineer</span> with hands-on
              experience building production-ready MERN stack applications. I focus on writing clean,
              maintainable code that scales.
            </p>
            <p className="text-gray-400 leading-relaxed">
              My journey into software engineering is backed by a strong foundation in
              Data Structures & Algorithms — having solved <span className="text-blue-400 font-semibold">400+ problems</span> across
              LeetCode, CodeChef, Codeforces, and GeeksforGeeks.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Currently, I'm expanding my expertise into <span className="text-violet-400 font-semibold">AI-powered systems</span> —
              exploring LangGraph, RAG architectures, Vector Databases, and AI Agents to build the next
              generation of intelligent applications.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              {['Problem Solver', 'Team Player', 'Fast Learner', 'AI Enthusiast'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-blue-500/10 border border-blue-500/20 text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-6 rounded-2xl bg-[#13131f] border border-white/5 hover:border-blue-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                  <Icon size={20} className="text-blue-400" />
                </div>
                <div className="text-3xl font-black gradient-text mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
