
import { motion } from 'framer-motion';

const FloatingBubbles = () => {
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 20,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/10"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
          }}
          animate={{
            y: [-100, window.innerHeight + 100],
            x: [0, Math.sin(bubble.id) * 100],
            rotate: [0, 360],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingBubbles;
