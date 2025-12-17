import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export type FrameStyle = 'none' | 'elegant' | 'floral' | 'geometric' | 'vintage' | 'minimal' | 'ornate'
export type RsvpDisplayMode = 'none' | 'link' | 'qr' | 'both'
export type TextAlignment = 'left' | 'center' | 'right'

interface SaveTheDateCardProps {
  imageUrl: string | null
  name1: string
  name2: string
  date: string
  location: string
  message: string
  showSparkles: boolean
  showLeaves: boolean
  sparklesDensity: number
  leavesDensity: number
  textColor: string
  showTextShadow: boolean
  frameStyle: FrameStyle
  frameColor: string
  frameThickness: number
  rsvpUrl: string
  rsvpDisplayMode: RsvpDisplayMode
  rsvpLabel: string
  textVerticalPosition: number
  textAlignment: TextAlignment
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
  sparklesDensity,
  leavesDensity,
  textColor,
  showTextShadow,
  frameStyle,
  frameColor,
  frameThickness,
  rsvpUrl,
  rsvpDisplayMode,
  rsvpLabel,
  textVerticalPosition,
  textAlignment,
}: SaveTheDateCardProps) {
  const textShadowStyle = showTextShadow 
    ? { textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 4px 16px rgba(0, 0, 0, 0.5)' }
    : {}

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (rsvpUrl && (rsvpDisplayMode === 'qr' || rsvpDisplayMode === 'both')) {
      generateQRCode(rsvpUrl).then(setQrDataUrl)
    } else {
      setQrDataUrl(null)
    }
  }, [rsvpUrl, rsvpDisplayMode])

  const showQr = rsvpDisplayMode === 'qr' || rsvpDisplayMode === 'both'
  const showLink = rsvpDisplayMode === 'link' || rsvpDisplayMode === 'both'

  const alignmentClass = textAlignment === 'left' ? 'items-start text-left' : textAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
  const rsvpAlignmentClass = textAlignment === 'left' ? 'items-start' : textAlignment === 'right' ? 'items-end' : 'items-center'

  return (
    <div data-card-root className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-black">
      {imageUrl ? (
        <div className="absolute inset-0 w-full h-full" style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/30" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {showSparkles && <Sparkles count={sparklesDensity} />}
      {showLeaves && <Leaves count={leavesDensity} />}

      <FrameDecoration style={frameStyle} color={frameColor} thickness={frameThickness} />

      <div 
        className={cn("relative h-full flex flex-col p-8", alignmentClass)}
        style={{ 
          color: textColor, 
          ...textShadowStyle,
          justifyContent: 'flex-start',
          paddingTop: `${textVerticalPosition}%`
        }}
      >
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

          {rsvpUrl && rsvpDisplayMode !== 'none' && (
            <div className={cn("mt-6 flex flex-col gap-3", rsvpAlignmentClass)}>
              {showQr && qrDataUrl && (
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <img src={qrDataUrl} alt="RSVP QR Code" className="w-20 h-20 md:w-24 md:h-24" />
                </div>
              )}
              {showLink && (
                <p className="font-body text-sm opacity-90">
                  {rsvpLabel || 'RSVP'}: <span className="underline">{formatDisplayUrl(rsvpUrl)}</span>
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function formatDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url)
    let display = parsed.hostname + parsed.pathname
    if (display.endsWith('/')) display = display.slice(0, -1)
    if (display.length > 30) display = display.slice(0, 27) + '...'
    return display
  } catch {
    if (url.length > 30) return url.slice(0, 27) + '...'
    return url
  }
}

async function generateQRCode(text: string): Promise<string> {
  const size = 200
  const modules = generateQRMatrix(text)
  const moduleCount = modules.length
  const moduleSize = Math.floor(size / moduleCount)
  const offset = Math.floor((size - moduleSize * moduleCount) / 2)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, size, size)
  
  ctx.fillStyle = '#000000'
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row][col]) {
        ctx.fillRect(
          offset + col * moduleSize,
          offset + row * moduleSize,
          moduleSize,
          moduleSize
        )
      }
    }
  }
  
  return canvas.toDataURL('image/png')
}

function generateQRMatrix(text: string): boolean[][] {
  const size = 21
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))
  
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const isBlack = (i === 0 || i === 6 || j === 0 || j === 6) || (i >= 2 && i <= 4 && j >= 2 && j <= 4)
      matrix[i][j] = isBlack
      matrix[i][size - 7 + j] = isBlack
      matrix[size - 7 + i][j] = isBlack
    }
  }
  
  for (let i = 0; i < size; i++) {
    matrix[6][i] = i % 2 === 0
    matrix[i][6] = i % 2 === 0
  }
  
  let dataIndex = 0
  const data = text.split('').map(c => c.charCodeAt(0))
  
  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const currentCol = col - c
        if (matrix[row][currentCol] === false) {
          if (dataIndex < data.length * 8) {
            const byteIndex = Math.floor(dataIndex / 8)
            const bitIndex = 7 - (dataIndex % 8)
            if (byteIndex < data.length) {
              matrix[row][currentCol] = ((data[byteIndex] >> bitIndex) & 1) === 1
            }
            dataIndex++
          }
        }
      }
    }
  }
  
  return matrix
}

export { generateQRCode }

function Sparkles({ count }: { count: number }) {
  const sparkles = Array.from({ length: count })

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

function Leaves({ count }: { count: number }) {
  const leaves = Array.from({ length: count })

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

function FrameDecoration({ style, color, thickness }: { style: FrameStyle; color: string; thickness: number }) {
  if (style === 'none') return null

  const baseStyles = "absolute pointer-events-none"
  const scale = thickness / 100

  if (style === 'elegant') {
    return (
      <div className={cn(baseStyles, "inset-4")} style={{ color }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" strokeWidth={0.3 * scale} />
          <rect x="1.5" y="1.5" width="97" height="97" fill="none" stroke="currentColor" strokeWidth={0.15 * scale} />
        </svg>
        <div className="absolute top-0 left-0" style={{ width: `${8 * scale}%`, height: `${8 * scale}%` }}>
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1 * scale}>
            <path d="M2 16 Q2 2 16 2" />
            <circle cx="16" cy="2" r={1.5 * scale} fill="currentColor" />
            <circle cx="2" cy="16" r={1.5 * scale} fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 rotate-90" style={{ width: `${8 * scale}%`, height: `${8 * scale}%` }}>
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1 * scale}>
            <path d="M2 16 Q2 2 16 2" />
            <circle cx="16" cy="2" r={1.5 * scale} fill="currentColor" />
            <circle cx="2" cy="16" r={1.5 * scale} fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 rotate-180" style={{ width: `${8 * scale}%`, height: `${8 * scale}%` }}>
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1 * scale}>
            <path d="M2 16 Q2 2 16 2" />
            <circle cx="16" cy="2" r={1.5 * scale} fill="currentColor" />
            <circle cx="2" cy="16" r={1.5 * scale} fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 -rotate-90" style={{ width: `${8 * scale}%`, height: `${8 * scale}%` }}>
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1 * scale}>
            <path d="M2 16 Q2 2 16 2" />
            <circle cx="16" cy="2" r={1.5 * scale} fill="currentColor" />
            <circle cx="2" cy="16" r={1.5 * scale} fill="currentColor" />
          </svg>
        </div>
      </div>
    )
  }

  if (style === 'floral') {
    const cornerSize = 20 * scale
    return (
      <div className={cn(baseStyles, "inset-2")} style={{ color }}>
        <div className="absolute top-0 left-0 opacity-80" style={{ width: `${cornerSize}%`, height: `${cornerSize}%` }}>
          <svg viewBox="0 0 80 80" fill="currentColor">
            <path d="M10 40 Q10 10 40 10 Q20 20 20 40 Q20 20 10 40" />
            <path d="M40 10 Q50 15 55 25 Q45 20 40 10" />
            <circle cx="15" cy="15" r={3 * scale} />
            <circle cx="25" cy="10" r={2 * scale} />
            <circle cx="10" cy="25" r={2 * scale} />
            <path d="M5 35 Q8 30 15 32 Q10 35 5 35" opacity="0.6" />
            <path d="M35 5 Q30 8 32 15 Q35 10 35 5" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 opacity-80 -scale-x-100" style={{ width: `${cornerSize}%`, height: `${cornerSize}%` }}>
          <svg viewBox="0 0 80 80" fill="currentColor">
            <path d="M10 40 Q10 10 40 10 Q20 20 20 40 Q20 20 10 40" />
            <path d="M40 10 Q50 15 55 25 Q45 20 40 10" />
            <circle cx="15" cy="15" r={3 * scale} />
            <circle cx="25" cy="10" r={2 * scale} />
            <circle cx="10" cy="25" r={2 * scale} />
            <path d="M5 35 Q8 30 15 32 Q10 35 5 35" opacity="0.6" />
            <path d="M35 5 Q30 8 32 15 Q35 10 35 5" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 opacity-80 -scale-y-100" style={{ width: `${cornerSize}%`, height: `${cornerSize}%` }}>
          <svg viewBox="0 0 80 80" fill="currentColor">
            <path d="M10 40 Q10 10 40 10 Q20 20 20 40 Q20 20 10 40" />
            <path d="M40 10 Q50 15 55 25 Q45 20 40 10" />
            <circle cx="15" cy="15" r={3 * scale} />
            <circle cx="25" cy="10" r={2 * scale} />
            <circle cx="10" cy="25" r={2 * scale} />
            <path d="M5 35 Q8 30 15 32 Q10 35 5 35" opacity="0.6" />
            <path d="M35 5 Q30 8 32 15 Q35 10 35 5" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 opacity-80 scale-x-[-1] scale-y-[-1]" style={{ width: `${cornerSize}%`, height: `${cornerSize}%` }}>
          <svg viewBox="0 0 80 80" fill="currentColor">
            <path d="M10 40 Q10 10 40 10 Q20 20 20 40 Q20 20 10 40" />
            <path d="M40 10 Q50 15 55 25 Q45 20 40 10" />
            <circle cx="15" cy="15" r={3 * scale} />
            <circle cx="25" cy="10" r={2 * scale} />
            <circle cx="10" cy="25" r={2 * scale} />
            <path d="M5 35 Q8 30 15 32 Q10 35 5 35" opacity="0.6" />
            <path d="M35 5 Q30 8 32 15 Q35 10 35 5" opacity="0.6" />
          </svg>
        </div>
      </div>
    )
  }

  if (style === 'geometric') {
    return (
      <div className={cn(baseStyles, "inset-3")} style={{ color }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="0,5 5,0 95,0 100,5 100,95 95,100 5,100 0,95" fill="none" stroke="currentColor" strokeWidth={0.4 * scale} />
          <line x1="0" y1="5" x2="5" y2="0" stroke="currentColor" strokeWidth={0.4 * scale} />
          <line x1="95" y1="0" x2="100" y2="5" stroke="currentColor" strokeWidth={0.4 * scale} />
          <line x1="100" y1="95" x2="95" y2="100" stroke="currentColor" strokeWidth={0.4 * scale} />
          <line x1="5" y1="100" x2="0" y2="95" stroke="currentColor" strokeWidth={0.4 * scale} />
        </svg>
        <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: `${16 * scale}%`, height: `${4 * scale}%` }}>
          <svg viewBox="0 0 64 16" fill="currentColor">
            <polygon points="32,0 40,8 32,16 24,8" opacity="0.6" />
            <polygon points="16,8 20,4 24,8 20,12" opacity="0.4" />
            <polygon points="48,8 44,4 40,8 44,12" opacity="0.4" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180" style={{ width: `${16 * scale}%`, height: `${4 * scale}%` }}>
          <svg viewBox="0 0 64 16" fill="currentColor">
            <polygon points="32,0 40,8 32,16 24,8" opacity="0.6" />
            <polygon points="16,8 20,4 24,8 20,12" opacity="0.4" />
            <polygon points="48,8 44,4 40,8 44,12" opacity="0.4" />
          </svg>
        </div>
      </div>
    )
  }

  if (style === 'vintage') {
    return (
      <div className={cn(baseStyles, "inset-3")} style={{ color }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 133" preserveAspectRatio="none">
          <rect x="0.5" y="0.5" width="99" height="132" fill="none" stroke="currentColor" strokeWidth={0.3 * scale} />
          <rect x="2" y="2" width="96" height="129" fill="none" stroke="currentColor" strokeWidth={0.15 * scale} strokeDasharray="1,1" />
        </svg>
        <div className="absolute top-1 left-1" style={{ width: `${12 * scale}%`, height: `${9 * scale}%` }}>
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5 * scale}>
            <path d="M4 24 C4 12 12 4 24 4" />
            <path d="M8 24 C8 14 14 8 24 8" />
            <circle cx="24" cy="4" r={2 * scale} fill="currentColor" />
            <circle cx="4" cy="24" r={2 * scale} fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-1 right-1 -scale-x-100" style={{ width: `${12 * scale}%`, height: `${9 * scale}%` }}>
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5 * scale}>
            <path d="M4 24 C4 12 12 4 24 4" />
            <path d="M8 24 C8 14 14 8 24 8" />
            <circle cx="24" cy="4" r={2 * scale} fill="currentColor" />
            <circle cx="4" cy="24" r={2 * scale} fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-1 left-1 -scale-y-100" style={{ width: `${12 * scale}%`, height: `${9 * scale}%` }}>
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5 * scale}>
            <path d="M4 24 C4 12 12 4 24 4" />
            <path d="M8 24 C8 14 14 8 24 8" />
            <circle cx="24" cy="4" r={2 * scale} fill="currentColor" />
            <circle cx="4" cy="24" r={2 * scale} fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-1 right-1 scale-x-[-1] scale-y-[-1]" style={{ width: `${12 * scale}%`, height: `${9 * scale}%` }}>
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5 * scale}>
            <path d="M4 24 C4 12 12 4 24 4" />
            <path d="M8 24 C8 14 14 8 24 8" />
            <circle cx="24" cy="4" r={2 * scale} fill="currentColor" />
            <circle cx="4" cy="24" r={2 * scale} fill="currentColor" />
          </svg>
        </div>
      </div>
    )
  }

  if (style === 'minimal') {
    const borderWidth = 2 * scale
    return (
      <div className={cn(baseStyles, "inset-6")} style={{ color }}>
        <div className="absolute top-0 left-0" style={{ width: `${8 * scale}%`, height: `${8 * scale}%`, borderTopWidth: `${borderWidth}px`, borderLeftWidth: `${borderWidth}px`, borderColor: color, borderStyle: 'solid' }} />
        <div className="absolute top-0 right-0" style={{ width: `${8 * scale}%`, height: `${8 * scale}%`, borderTopWidth: `${borderWidth}px`, borderRightWidth: `${borderWidth}px`, borderColor: color, borderStyle: 'solid' }} />
        <div className="absolute bottom-0 left-0" style={{ width: `${8 * scale}%`, height: `${8 * scale}%`, borderBottomWidth: `${borderWidth}px`, borderLeftWidth: `${borderWidth}px`, borderColor: color, borderStyle: 'solid' }} />
        <div className="absolute bottom-0 right-0" style={{ width: `${8 * scale}%`, height: `${8 * scale}%`, borderBottomWidth: `${borderWidth}px`, borderRightWidth: `${borderWidth}px`, borderColor: color, borderStyle: 'solid' }} />
      </div>
    )
  }

  if (style === 'ornate') {
    const cornerSize = 16 * scale
    return (
      <div className={cn(baseStyles, "inset-2")} style={{ color }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 133" preserveAspectRatio="none">
          <rect x="1" y="1" width="98" height="131" fill="none" stroke="currentColor" strokeWidth={0.2 * scale} />
          <rect x="2.5" y="2.5" width="95" height="128" fill="none" stroke="currentColor" strokeWidth={0.15 * scale} />
        </svg>
        <div className="absolute top-0 left-0" style={{ width: `${cornerSize}%`, height: `${cornerSize}%` }}>
          <svg viewBox="0 0 64 64" fill="currentColor" opacity="0.9">
            <path d="M8 32 Q8 8 32 8 L28 12 Q12 12 12 28 L8 32" />
            <circle cx="32" cy="8" r={3 * scale} />
            <circle cx="8" cy="32" r={3 * scale} />
            <path d="M20 8 Q16 16 8 20 L10 18 Q14 14 18 10 L20 8" opacity="0.5" />
            <ellipse cx="16" cy="16" rx="2" ry="4" transform="rotate(-45 16 16)" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 -scale-x-100" style={{ width: `${cornerSize}%`, height: `${cornerSize}%` }}>
          <svg viewBox="0 0 64 64" fill="currentColor" opacity="0.9">
            <path d="M8 32 Q8 8 32 8 L28 12 Q12 12 12 28 L8 32" />
            <circle cx="32" cy="8" r={3 * scale} />
            <circle cx="8" cy="32" r={3 * scale} />
            <path d="M20 8 Q16 16 8 20 L10 18 Q14 14 18 10 L20 8" opacity="0.5" />
            <ellipse cx="16" cy="16" rx="2" ry="4" transform="rotate(-45 16 16)" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 -scale-y-100" style={{ width: `${cornerSize}%`, height: `${cornerSize}%` }}>
          <svg viewBox="0 0 64 64" fill="currentColor" opacity="0.9">
            <path d="M8 32 Q8 8 32 8 L28 12 Q12 12 12 28 L8 32" />
            <circle cx="32" cy="8" r={3 * scale} />
            <circle cx="8" cy="32" r={3 * scale} />
            <path d="M20 8 Q16 16 8 20 L10 18 Q14 14 18 10 L20 8" opacity="0.5" />
            <ellipse cx="16" cy="16" rx="2" ry="4" transform="rotate(-45 16 16)" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 scale-x-[-1] scale-y-[-1]" style={{ width: `${cornerSize}%`, height: `${cornerSize}%` }}>
          <svg viewBox="0 0 64 64" fill="currentColor" opacity="0.9">
            <path d="M8 32 Q8 8 32 8 L28 12 Q12 12 12 28 L8 32" />
            <circle cx="32" cy="8" r={3 * scale} />
            <circle cx="8" cy="32" r={3 * scale} />
            <path d="M20 8 Q16 16 8 20 L10 18 Q14 14 18 10 L20 8" opacity="0.5" />
            <ellipse cx="16" cy="16" rx="2" ry="4" transform="rotate(-45 16 16)" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2" style={{ width: `${4 * scale}%`, height: `${12 * scale}%` }}>
          <svg viewBox="0 0 16 48" fill="currentColor" opacity="0.5">
            <ellipse cx="4" cy="24" rx={2 * scale} ry={8 * scale} />
            <circle cx="4" cy="12" r={2 * scale} />
            <circle cx="4" cy="36" r={2 * scale} />
          </svg>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 -scale-x-100" style={{ width: `${4 * scale}%`, height: `${12 * scale}%` }}>
          <svg viewBox="0 0 16 48" fill="currentColor" opacity="0.5">
            <ellipse cx="4" cy="24" rx={2 * scale} ry={8 * scale} />
            <circle cx="4" cy="12" r={2 * scale} />
            <circle cx="4" cy="36" r={2 * scale} />
          </svg>
        </div>
      </div>
    )
  }

  return null
}
