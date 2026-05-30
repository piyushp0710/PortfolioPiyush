import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import { SectionHeader } from './About';

const experiences = [
  {
    role: 'Associate Software Engineer',
    company: 'Cosmofeed',
    type: 'Full-time',
    duration: 'Jul 2024 – Present',
    location: 'Remote, India',
    points: [
      'Develop and maintain full-stack web features using React.js, Node.js, Express.js, and MongoDB in an agile environment.',
      'Designed and implemented RESTful APIs serving 1000+ daily active users with optimized response times.',
      'Improved MongoDB query performance by 40% through indexing strategies and aggregation pipeline optimization.',
      'Collaborated with cross-functional teams to deliver features on time, participating in sprint planning and code reviews.',
      'Implemented JWT-based authentication and authorization systems to secure application endpoints.',
      'Identified and resolved critical production bugs, reducing error rates and improving application stability.',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs', 'Git'],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="py-24 bg-[#0e0e1a]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Work Experience"
          title="Professional Journey"
          subtitle="Where I've applied my skills to build real-world products."
        />

        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/30 to-transparent hidden md:block" />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="relative md:pl-24 mb-8"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-8 w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hidden md:flex items-center justify-center -translate-x-1/2">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              <div className="p-6 rounded-2xl bg-[#13131f] border border-white/5 hover:border-blue-500/20 transition-all group">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <FiBriefcase size={16} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    </div>
                    <div className="ml-12 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span className="font-semibold text-blue-400">{exp.company}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="inline-flex items-center gap-1">
                        <FiCalendar size={12} />
                        {exp.duration}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="inline-flex items-center gap-1">
                        <FiMapPin size={12} />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400">
                    {exp.type}
                  </span>
                </div>

                {/* Points */}
                <ul className="space-y-3 mb-6">
                  {exp.points.map((p, pi) => (
                    <li key={pi} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* Stack */}
                <div className="flex flex-wrap gap-2">
                  {exp.stack.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 text-gray-400 border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
