import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#080810]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div
          className="relative w-20 h-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-violet-500" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-blue-400 border-l-violet-400" style={{ animationDelay: '0.1s' }} />
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <motion.span
            className="font-mono text-sm text-blue-400 tracking-widest"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            INITIALIZING
          </motion.span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-500"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
