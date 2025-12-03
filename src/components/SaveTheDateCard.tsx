import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SaveTheDateCardProps {
  imageUrl: string | null
  name1: string
  name2: string
  date: string
  location: string
  message: string
  showSparkles: boolean
  showLeaves: boolean
}

export function SaveTheDateCard({
  imageUrl,
  name1,
  name2,
  date,
  location,
  message,
  showSparkles,
  showLeaves,
}: SaveTheDateCardProps) {
  return (
    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Save the date background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/30" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {showSparkles && <Sparkles />}
      {showLeaves && <Leaves />}

      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div>
            <p className="font-body text-sm uppercase tracking-[0.3em] mb-4 opacity-90">
              Save The Date
            </p>
            <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight tracking-tight mb-2">
              {name1 || 'First Name'}
            </h1>
            <p className="font-display text-3xl opacity-90">&</p>
            <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight tracking-tight mt-2">
              {name2 || 'Second Name'}
            </h1>
          </div>

          {date && (
            <div className="font-heading text-2xl md:text-3xl font-semibold">
              {date}
            </div>
          )}

          {location && (
            <p className="font-body text-lg opacity-90 max-w-md">
              {location}
            </p>
          )}

          {message && (
            <p className="font-body text-base opacity-80 italic max-w-md mt-4">
              {message}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function Sparkles() {
  const sparkles = Array.from({ length: 20 })

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -60],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 bg-accent blur-sm" />
        </motion.div>
      ))}
    </div>
  )
}

function Leaves() {
  const leaves = Array.from({ length: 15 })

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {leaves.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/40"
          style={{
            left: `${Math.random() * 110 - 10}%`,
            top: `${Math.random() * -20}%`,
            fontSize: `${12 + Math.random() * 12}px`,
          }}
          animate={{
            y: ['0vh', '120vh'],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear',
          }}
        >
          🍃
        </motion.div>
      ))}
    </div>
  )
}
