import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiBook, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import { SectionHeader } from './About';

const roadmap = [
  {
    category: 'AI & Machine Learning',
    color: 'violet',
    items: [
      { name: 'AI Agents', status: 'learning', desc: 'Building autonomous AI workflows' },
      { name: 'LangGraph', status: 'learning', desc: 'Stateful multi-agent orchestration' },
      { name: 'RAG Systems', status: 'learning', desc: 'Retrieval-Augmented Generation' },
      { name: 'Vector Databases', status: 'planned', desc: 'Pinecone, Chroma, Weaviate' },
    ],
  },
  {
    category: 'System Design',
    color: 'blue',
    items: [
      { name: 'System Design', status: 'learning', desc: 'Scalable architecture patterns' },
      { name: 'Microservices', status: 'planned', desc: 'Service decomposition & communication' },
      { name: 'Caching Strategies', status: 'planned', desc: 'Redis, CDN, application-level cache' },
      { name: 'Message Queues', status: 'planned', desc: 'RabbitMQ, Kafka fundamentals' },
    ],
  },
  {
    category: 'DevOps & Cloud',
    color: 'blue',
    items: [
      { name: 'Docker', status: 'learning', desc: 'Containerization & Docker Compose' },
      { name: 'CI/CD Pipelines', status: 'planned', desc: 'GitHub Actions, automated deployments' },
      { name: 'Kubernetes', status: 'planned', desc: 'Container orchestration basics' },
      { name: 'AWS Fundamentals', status: 'planned', desc: 'EC2, S3, Lambda, RDS' },
    ],
  },
];

const colorMap = {
  blue: { badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400', dot: 'bg-blue-500', icon: 'text-blue-400' },
  violet: { badge: 'bg-violet-500/10 border-violet-500/20 text-violet-400', dot: 'bg-violet-500', icon: 'text-violet-400' },
};

const statusMap = {
  done: { icon: FiCheckCircle, color: 'text-green-400', label: 'Completed' },
  learning: { icon: FiClock, color: 'text-blue-400', label: 'In Progress' },
  planned: { icon: FiCircle, color: 'text-gray-500', label: 'Planned' },
};

export default function Learning() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="learning" className="py-24 bg-[var(--bg1)]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Growth Mindset"
          title="Learning Roadmap"
          subtitle="Technologies and concepts I'm actively studying to stay ahead of the curve."
        />

        <div ref={ref} className="grid lg:grid-cols-3 gap-6">
          {roadmap.map((track, ti) => {
            const c = colorMap[track.color];
            return (
              <motion.div
                key={track.category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: ti * 0.15 }}
                className="p-6 rounded-2xl bg-[var(--bgcard)] border border-white/5"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.badge} border`}>
                    <FiBook size={16} className={c.icon} />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{track.category}</h3>
                </div>

                <div className="space-y-3">
                  {track.items.map((item, ii) => {
                    const s = statusMap[item.status];
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2 + ti * 0.1 + ii * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/3 transition-all"
                      >
                        <s.icon size={16} className={`${s.color} flex-shrink-0 mt-0.5`} />
                        <div>
                          <div className="text-sm font-medium text-gray-200">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                        </div>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${
                          item.status === 'learning'
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            : item.status === 'done'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-white/5 border-white/5 text-gray-500'
                        }`}>
                          {s.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
