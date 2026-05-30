import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  SiReact, SiNodedotjs, SiExpress, SiMongodb, SiMysql,
  SiJavascript, SiHtml5, SiTailwindcss,
  SiGit, SiGithub, SiPostman, SiDocker,
} from 'react-icons/si';
import { FiLayers, FiDatabase, FiCpu, FiTerminal, FiCode } from 'react-icons/fi';
import { SectionHeader } from './About';

const skillGroups = [
  {
    label: 'Frontend',
    icon: FiLayers,
    color: 'blue',
    skills: [
      { name: 'React.js', icon: SiReact },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS3', icon: null },
    ],
  },
  {
    label: 'Backend',
    icon: FiCpu,
    color: 'violet',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express.js', icon: SiExpress },
    ],
  },
  {
    label: 'Database',
    icon: FiDatabase,
    color: 'blue',
    skills: [
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'MySQL', icon: SiMysql },
    ],
  },
  {
    label: 'Tools & DevOps',
    icon: FiTerminal,
    color: 'violet',
    skills: [
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'Postman', icon: SiPostman },
      { name: 'Docker', icon: SiDocker },
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
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', pill: 'bg-blue-500/10 border-blue-500/20 text-blue-300' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', pill: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
};

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

        <div ref={ref} className="grid md:grid-cols-2 gap-6 items-start mb-12">
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
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <group.icon size={18} className={c.text} />
                  </div>
                  <h3 className="font-semibold text-white">{group.label}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((s, si) => (
                    <motion.span
                      key={s.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.2 + gi * 0.1 + si * 0.05 }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${c.pill}`}
                    >
                      {s.icon && <s.icon size={13} />}
                      {s.name}
                    </motion.span>
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
            <FiCode size={16} className="text-blue-400" />
            Core Concepts
          </h3>
          <div className="flex flex-wrap gap-2">
            {concepts.map((concept) => (
              <span
                key={concept}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/5 text-gray-300 hover:border-blue-500/30 hover:text-blue-300 transition-all cursor-default"
              >
                {concept}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
