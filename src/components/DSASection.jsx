import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { SiLeetcode, SiCodechef, SiCodeforces, SiGeeksforgeeks } from 'react-icons/si';
import { FiAward, FiTarget, FiZap, FiTrendingUp } from 'react-icons/fi';
import { SectionHeader } from './About';

const platforms = [
  {
    name: 'LeetCode',
    icon: SiLeetcode,
    problems: '200+',
    handle: '@piyushpandey',
    color: 'from-orange-500 to-yellow-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    link: 'https://leetcode.com/',
  },
  {
    name: 'CodeChef',
    icon: SiCodechef,
    problems: '80+',
    handle: '@piyushp',
    color: 'from-amber-600 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    link: 'https://www.codechef.com/',
  },
  {
    name: 'Codeforces',
    icon: SiCodeforces,
    problems: '70+',
    handle: '@piyushp',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    link: 'https://codeforces.com/',
  },
  {
    name: 'GeeksforGeeks',
    icon: SiGeeksforgeeks,
    problems: '50+',
    handle: '@piyushpandey',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    link: 'https://www.geeksforgeeks.org/',
  },
];

const achievements = [
  { icon: FiTarget, label: '400+ Problems Solved', sub: 'Across 4 platforms' },
  { icon: FiAward, label: 'Consistent Coder', sub: 'Daily problem solving habit' },
  { icon: FiZap, label: 'Fast Problem Solver', sub: 'Optimized time & space complexity' },
  { icon: FiTrendingUp, label: 'Continuous Growth', sub: 'Rating improving every month' },
];

function AnimatedCounter({ target, inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace('+', ''));
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span>{count}+</span>;
}

export default function DSASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="dsa" className="py-24 bg-[#0e0e1a]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Competitive Programming"
          title="DSA & Achievements"
          subtitle="Strong problem-solving foundation built through consistent practice across competitive programming platforms."
        />

        {/* Big counter */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex flex-col items-center p-10 rounded-3xl bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20">
            <div className="text-8xl font-black gradient-text mb-2">
              {inView && <AnimatedCounter target="400" inView={inView} />}
            </div>
            <div className="text-xl text-gray-300 font-medium">Problems Solved</div>
            <div className="text-sm text-gray-500 mt-1">LeetCode • CodeChef • Codeforces • GFG</div>
          </div>
        </motion.div>

        {/* Platform cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {platforms.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`p-5 rounded-2xl ${p.bg} border ${p.border} hover:scale-105 transition-all group cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-4">
                <p.icon size={24} className={p.text} />
                <span className="font-semibold text-white">{p.name}</span>
              </div>
              <div className={`text-3xl font-black bg-gradient-to-r ${p.color} bg-clip-text text-transparent mb-1`}>
                {inView && <AnimatedCounter target={p.problems.replace('+', '')} inView={inView} />}
              </div>
              <div className="text-sm text-gray-500">Problems solved</div>
              <div className={`text-xs font-mono mt-2 ${p.text}`}>{p.handle}</div>
            </motion.a>
          ))}
        </div>

        {/* Achievement cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-5 rounded-2xl bg-[#13131f] border border-white/5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <a.icon size={18} className="text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{a.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{a.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
