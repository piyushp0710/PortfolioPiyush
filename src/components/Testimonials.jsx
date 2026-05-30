import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';
import { SectionHeader } from './About';

const placeholders = [
  {
    name: 'Your Manager',
    role: 'Engineering Manager',
    company: 'Company Name',
    text: 'This space is reserved for a testimonial from your manager or team lead. Reach out to colleagues for recommendations to strengthen your credibility.',
    initials: 'YM',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Senior Colleague',
    role: 'Senior Software Engineer',
    company: 'Company Name',
    text: 'A peer recommendation highlighting your collaboration skills, technical ability, and contributions to the team goes here.',
    initials: 'SC',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Mentor / Interviewer',
    role: 'Tech Lead',
    company: 'Company Name',
    text: 'A recommendation from a mentor or someone who has worked closely with you on a technical project would be very impactful here.',
    initials: 'ML',
    color: 'from-orange-500 to-amber-500',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className="py-24 bg-[#0e0e1a]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Social Proof"
          title="What Others Say"
          subtitle="Recommendations from colleagues, managers, and mentors."
        />

        <div ref={ref} className="grid md:grid-cols-3 gap-6">
          {placeholders.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl bg-[#13131f] border border-white/5 border-dashed flex flex-col gap-4"
            >
              <FiMessageSquare size={20} className="text-gray-600" />
              <p className="text-gray-500 text-sm leading-relaxed italic flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">{t.name}</div>
                  <div className="text-xs text-gray-600">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-600 mt-8"
        >
          💡 Replace these placeholders with real recommendations from LinkedIn or colleagues.
        </motion.p>
      </div>
    </section>
  );
}
