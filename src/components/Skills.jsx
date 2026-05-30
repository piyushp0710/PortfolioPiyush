import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  SiReact, SiNodedotjs, SiExpress, SiMongodb, SiMysql,
  SiJavascript, SiHtml5, SiTailwindcss,
  SiGit, SiGithub, SiPostman, SiDocker,
} from 'react-icons/si';
import { FiLayers, FiDatabase, FiCpu, FiTerminal } from 'react-icons/fi';
import { SectionHeader } from './About';

const skillGroups = [
  {
    label: 'Frontend',
    icon: FiLayers,
    color: 'blue',
    skills: [
      { name: 'React.js', icon: SiReact, level: 90 },
      { name: 'JavaScript', icon: SiJavascript, level: 88 },
      { name: 'Tailwind CSS', icon: SiTailwindcss, level: 85 },
      { name: 'HTML5', icon: SiHtml5, level: 90 },
      { name: 'CSS3', icon: null, level: 85 },
    ],
  },
  {
    label: 'Backend',
    icon: FiCpu,
    color: 'violet',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, level: 85 },
      { name: 'Express.js', icon: SiExpress, level: 82 },
    ],
  },
  {
    label: 'Database',
    icon: FiDatabase,
    color: 'blue',
    skills: [
      { name: 'MongoDB', icon: SiMongodb, level: 80 },
      { name: 'MySQL', icon: SiMysql, level: 72 },
    ],
  },
  {
    label: 'Tools & DevOps',
    icon: FiTerminal,
    color: 'violet',
    skills: [
      { name: 'Git', icon: SiGit, level: 85 },
      { name: 'GitHub', icon: SiGithub, level: 85 },
      { name: 'Postman', icon: SiPostman, level: 80 },
      { name: 'Docker', icon: SiDocker, level: 45 },
    ],
  },
];

const concepts = [
  'Data Structures & Algorithms', 'Object-Oriented Programming',
  'REST API Design', 'JWT Authentication', 'Database Design',
  'System Design Fundamentals', 'Computer Networks',
  'Operating Systems', 'DBMS', 'Git Workflows',
  'Agile / Scrum', 'Code Review',
];

const colorMap = {
  blue: { bar: 'from-blue-500 to-blue-400', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  violet: { bar: 'from-violet-500 to-violet-400', bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
};

function SkillBar({ name, level, Icon, color, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const c = colorMap[color];

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={15} className={c.text} />}
        <span className="text-sm text-gray-300 font-medium">{name}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-24 bg-[#080810]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Technical Skills"
          title="My Tech Stack"
          subtitle="Technologies I use to build fast, scalable, and maintainable applications."
        />

        <div ref={ref} className="grid md:grid-cols-2 gap-6 mb-12">
          {skillGroups.map((group, gi) => {
            const c = colorMap[group.color];
            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: gi * 0.1 }}
                className="p-6 rounded-2xl bg-[#13131f] border border-white/5"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <group.icon size={18} className={c.text} />
                  </div>
                  <h3 className="font-semibold text-white">{group.label}</h3>
                </div>
                <div className="space-y-4">
                  {group.skills.map((s, si) => (
                    <SkillBar
                      key={s.name}
                      name={s.name}
                      level={s.level}
                      Icon={s.icon}
                      color={group.color}
                      delay={0.2 + si * 0.1}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-[#13131f] border border-white/5"
        >
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Core Concepts
          </h3>
          <div className="flex flex-wrap gap-2">
            {concepts.map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/5 text-gray-300 hover:border-blue-500/30 hover:text-blue-300 transition-all cursor-default"
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
