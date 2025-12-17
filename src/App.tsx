import { useKV } from '@github/spark/hooks'
import { SaveTheDateCard } from '@/components/SaveTheDateCard'
import { ImageUpload } from '@/components/ImageUpload'
import { EditorPanel } from '@/components/EditorPanel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share, FileVideo, FileImage } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { GIFEncoder, quantize, applyPalette } from 'gifenc'

interface CardData {
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
}

function App() {
  const [cardData, setCardData] = useKV<CardData>('save-the-date-card', {
    imageUrl: null,
    name1: '',
    name2: '',
    date: '',
    location: '',
    message: '',
    showSparkles: true,
    showLeaves: true,
    sparklesDensity: 25,
    leavesDensity: 20,
    textColor: '#FFFFFF',
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [exportFormat, setExportFormat] = useState<'video' | 'gif'>('video')

  const data = cardData || {
    imageUrl: null,
    name1: '',
    name2: '',
    date: '',
    location: '',
    message: '',
    showSparkles: true,
    showLeaves: true,
    sparklesDensity: 25,
    leavesDensity: 20,
    textColor: '#FFFFFF',
  }

  const updateCardData = (updates: Partial<CardData>) => {
    setCardData((current) => {
      const base: CardData = current || {
        imageUrl: null,
        name1: '',
        name2: '',
        date: '',
        location: '',
        message: '',
        showSparkles: true,
        showLeaves: true,
        sparklesDensity: 25,
        leavesDensity: 20,
        textColor: '#FFFFFF',
      }
      return { ...base, ...updates }
    })
  }

  const generateAnimatedCard = async (format: 'video' | 'gif'): Promise<Blob | null> => {
    if (!cardRef.current) {
      toast.error('Card not ready')
      return null
    }

    try {
      const cardElement = cardRef.current.querySelector('[data-card-root]') as HTMLElement
      if (!cardElement) {
        toast.error('Card element not found')
        return null
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { willReadFrequently: format === 'gif' })
      if (!ctx) {
        toast.error('Canvas not supported')
        return null
      }

      const width = 1200
      const height = 1600
      canvas.width = width
      canvas.height = height

      const fps = format === 'gif' ? 20 : 30
      const duration = 5
      const totalFrames = fps * duration
      let frameCount = 0

      const drawFrame = async () => {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, width, height)

        if (data.imageUrl) {
          const img = document.createElement('img')
          img.crossOrigin = 'anonymous'
          await new Promise<void>((resolve) => {
            img.onload = () => {
              const imgAspect = img.width / img.height
              const canvasAspect = width / height
              
              let drawWidth, drawHeight, offsetX, offsetY
              
              if (imgAspect > canvasAspect) {
                drawHeight = height
                drawWidth = img.width * (height / img.height)
                offsetX = (width - drawWidth) / 2
                offsetY = 0
              } else {
                drawWidth = width
                drawHeight = img.height * (width / img.width)
                offsetX = 0
                offsetY = (height - drawHeight) / 2
              }
              
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
              resolve()
            }
            img.onerror = () => resolve()
            img.src = data.imageUrl!
          })
        } else {
          const gradient = ctx.createLinearGradient(0, 0, width, height)
          gradient.addColorStop(0, 'rgba(139, 186, 153, 0.2)')
          gradient.addColorStop(0.5, 'rgba(199, 163, 123, 0.1)')
          gradient.addColorStop(1, 'rgba(234, 234, 234, 0.3)')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)
        }

        const overlayGradient = ctx.createLinearGradient(0, height * 0.5, 0, height)
        overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)')
        overlayGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)')
        overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
        ctx.fillStyle = overlayGradient
        ctx.fillRect(0, 0, width, height)

        const currentTime = frameCount / fps

        if (data.showSparkles) {
          drawSparkles(ctx, width, height, data.sparklesDensity, currentTime)
        }
        if (data.showLeaves) {
          drawLeaves(ctx, width, height, data.leavesDensity, currentTime)
        }

        drawText(ctx, width, height)
      }

      const drawSparkles = (ctx: CanvasRenderingContext2D, width: number, height: number, count: number, time: number) => {
        for (let i = 0; i < count; i++) {
          const seedX = (i * 7919) % width
          const seedY = (i * 9973) % height
          const cycle = 3 + (i % 3) * 0.5
          const delay = (i / count) * 3
          const progress = ((time + delay) % cycle) / cycle
          
          const x = seedX
          const y = seedY - 40 * progress
          const size = 8 + (i % 5) * 2
          const opacity = progress < 0.2 ? progress / 0.2 : 
                        progress > 0.8 ? (1 - progress) / 0.2 : 1
          
          if (opacity > 0.1) {
            ctx.save()
            ctx.translate(x, y)
            ctx.globalAlpha = opacity * 0.8
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
            gradient.addColorStop(0, 'rgba(199, 163, 123, 1)')
            gradient.addColorStop(0.5, 'rgba(199, 163, 123, 0.6)')
            gradient.addColorStop(1, 'rgba(199, 163, 123, 0)')
            
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(0, 0, size, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            ctx.beginPath()
            ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.restore()
          }
        }
      }

      const drawLeaves = (ctx: CanvasRenderingContext2D, width: number, height: number, count: number, time: number) => {
        for (let i = 0; i < count; i++) {
          const seedX = (i * 8191) % 110
          const cycle = 8 + (i % 5)
          const delay = (i / count) * 8
          const progress = ((time + delay) % cycle) / cycle
          
          const x = ((seedX - 10) / 100) * width + (((i * 31) % 100) - 50) * progress
          const y = progress * height * 1.2 - height * 0.2
          const size = 30 + (i % 6) * 5
          const rotation = (progress * 360 * ((i % 2) ? 1 : -1) * Math.PI) / 180
          const opacity = progress < 0.1 ? progress / 0.1 : 
                        progress > 0.9 ? (1 - progress) / 0.1 : 0.6
          
          if (opacity > 0.1 && y > -size && y < height + size) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(rotation)
            ctx.globalAlpha = opacity * 0.5
            
            ctx.font = `${size}px serif`
            ctx.fillText('🍃', -size/2, size/2)
            
            ctx.restore()
          }
        }
      }

      const drawText = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.textAlign = 'center'
        ctx.fillStyle = data.textColor || '#FFFFFF'
        
        ctx.font = '400 24px Inter, sans-serif'
        ctx.fillText('SAVE THE DATE', width / 2, height / 2 - 280)
        
        ctx.font = 'bold 120px "Playfair Display", serif'
        ctx.fillText(data.name1 || 'First Name', width / 2, height / 2 - 140)
        
        ctx.font = '400 60px "Playfair Display", serif'
        ctx.globalAlpha = 0.9
        ctx.fillText('&', width / 2, height / 2 - 40)
        ctx.globalAlpha = 1
        
        ctx.font = 'bold 120px "Playfair Display", serif'
        ctx.fillText(data.name2 || 'Second Name', width / 2, height / 2 + 80)
        
        if (data.date) {
          ctx.font = '600 56px "Crimson Pro", serif'
          ctx.fillText(data.date, width / 2, height / 2 + 200)
        }
        
        if (data.location) {
          ctx.font = '400 36px Inter, sans-serif'
          ctx.globalAlpha = 0.9
          wrapText(ctx, data.location, width / 2, height / 2 + 280, width - 200, 50)
          ctx.globalAlpha = 1
        }
        
        if (data.message) {
          ctx.font = 'italic 28px Inter, sans-serif'
          ctx.globalAlpha = 0.8
          wrapText(ctx, data.message, width / 2, height / 2 + 360, width - 200, 40)
          ctx.globalAlpha = 1
        }
      }

      const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ')
        let line = ''
        let currentY = y

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' '
          const metrics = ctx.measureText(testLine)
          const testWidth = metrics.width
          
          if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY)
            line = words[i] + ' '
            currentY += lineHeight
          } else {
            line = testLine
          }
        }
        ctx.fillText(line, x, currentY)
      }

      if (format === 'video') {
        const stream = canvas.captureStream(fps)
        
        const mimeTypes = [
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
        ]
        
        let selectedMimeType = ''
        for (const mimeType of mimeTypes) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            selectedMimeType = mimeType
            break
          }
        }
        
        if (!selectedMimeType) {
          toast.error('Video recording not supported on this device')
          return null
        }

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: selectedMimeType,
          videoBitsPerSecond: 5000000
        })

        const chunks: Blob[] = []
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data)
          }
        }

        return new Promise((resolve) => {
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: selectedMimeType })
            resolve(blob)
          }

          mediaRecorder.start()

          const captureLoop = async () => {
            if (frameCount < totalFrames) {
              await drawFrame()
              frameCount++
              setGenerationProgress(Math.round((frameCount / totalFrames) * 100))
              setTimeout(() => captureLoop(), 1000 / fps)
            } else {
              mediaRecorder.stop()
              setGenerationProgress(0)
            }
          }

          captureLoop()
        })
      } else {
        const gif = GIFEncoder()
        
        const captureLoop = async () => {
          for (frameCount = 0; frameCount < totalFrames; frameCount++) {
            await drawFrame()
            
            const imageData = ctx.getImageData(0, 0, width, height)
            const palette = quantize(imageData.data, 256)
            const index = applyPalette(imageData.data, palette)
            
            gif.writeFrame(index, width, height, {
              palette,
              delay: Math.round(1000 / fps),
            })
            
            setGenerationProgress(Math.round((frameCount / totalFrames) * 100))
          }
          
          gif.finish()
          setGenerationProgress(0)
          
          const buffer = gif.bytes()
          return new Blob([buffer], { type: 'image/gif' })
        }
        
        return captureLoop()
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(`Failed to generate ${format}`)
      return null
    }
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    try {
      const blob = await generateAnimatedCard(exportFormat)
      
      if (!blob) {
        toast.error('Failed to generate file')
        setIsGenerating(false)
        setGenerationProgress(0)
        return
      }

      const extension = exportFormat === 'video' ? 'mp4' : 'gif'
      const fileName = `save-the-date-${data.name1 || 'card'}-${data.name2 || 'card'}.${extension}`
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success(`${exportFormat === 'video' ? 'Video' : 'GIF'} downloaded!`)
      setIsGenerating(false)
      setGenerationProgress(0)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download card')
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const handleShare = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    try {
      const blob = await generateAnimatedCard(exportFormat)
      
      if (!blob) {
        toast.error('Failed to generate file')
        setIsGenerating(false)
        setGenerationProgress(0)
        return
      }

      const extension = exportFormat === 'video' ? 'mp4' : 'gif'
      const mimeType = exportFormat === 'video' ? 'video/mp4' : 'image/gif'
      const fileName = `save-the-date-${data.name1 || 'card'}-${data.name2 || 'card'}.${extension}`
      
      const file = new File([blob], fileName, { 
        type: mimeType 
      })
      
      const shareText = `${data.name1 || 'First Name'} & ${data.name2 || 'Second Name'}${data.date ? ' - ' + data.date : ''}`
      
      if (navigator.share) {
        try {
          const shareData: ShareData = {
            title: 'Save The Date',
            text: shareText,
            files: [file],
          }
          
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData)
            toast.success('Shared successfully!')
          } else {
            await navigator.share({
              title: 'Save The Date',
              text: shareText,
            })
            toast.info(`Shared text - downloading ${exportFormat} separately`)
            
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            toast.info('Share cancelled')
          } else {
            console.error('Share error:', error)
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            toast.success('Downloaded instead')
          }
        }
      } else {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.info('Downloaded - sharing not supported on this device')
      }
      
      setIsGenerating(false)
      setGenerationProgress(0)
    } catch (error) {
      console.error('Share error:', error)
      toast.error('Failed to share card')
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/10 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
            Digital Save The Date
          </h1>
          <p className="font-body text-muted-foreground">
            Create a beautiful announcement for your special day
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div ref={cardRef} className="order-2 lg:order-1">
            <SaveTheDateCard
              imageUrl={data.imageUrl}
              name1={data.name1}
              name2={data.name2}
              date={data.date}
              location={data.location}
              message={data.message}
              showSparkles={data.showSparkles}
              showLeaves={data.showLeaves}
              sparklesDensity={data.sparklesDensity}
              leavesDensity={data.leavesDensity}
              textColor={data.textColor}
            />
            
            <div className="mt-6 space-y-4">
              <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
                <p className="font-body text-sm text-accent-foreground">
                  <strong>✨ Animated Export:</strong> Your card will be exported as an animated {exportFormat === 'video' ? 'video (MP4)' : 'GIF'} with all sparkles and leaves in motion! Perfect for sharing via text message, email, or AirDrop.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Label htmlFor="export-format" className="font-body text-sm font-medium min-w-fit">
                  Export as:
                </Label>
                <Select value={exportFormat} onValueChange={(value: 'video' | 'gif') => setExportFormat(value)}>
                  <SelectTrigger id="export-format" className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <FileVideo size={16} />
                        <span>Video (MP4) - Best quality</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gif">
                      <div className="flex items-center gap-2">
                        <FileImage size={16} />
                        <span>Animated GIF - Universal compatibility</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex-1 font-body"
                  size="lg"
                >
                  <Download className="mr-2" />
                  {isGenerating ? `Generating... ${generationProgress}%` : 'Download'}
                </Button>
                <Button
                  onClick={handleShare}
                  disabled={isGenerating}
                  variant="outline"
                  className="flex-1 font-body"
                  size="lg"
                >
                  <Share className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          <Card className="order-1 lg:order-2 p-6 md:p-8">
            <ImageUpload
              currentImage={data.imageUrl}
              onImageUpload={(url) => updateCardData({ imageUrl: url })}
            />
            
            <div className="mt-8">
              <EditorPanel
                name1={data.name1}
                name2={data.name2}
                date={data.date}
                location={data.location}
                message={data.message}
                showSparkles={data.showSparkles}
                showLeaves={data.showLeaves}
                sparklesDensity={data.sparklesDensity}
                leavesDensity={data.leavesDensity}
                textColor={data.textColor}
                onName1Change={(value) => updateCardData({ name1: value })}
                onName2Change={(value) => updateCardData({ name2: value })}
                onDateChange={(value) => updateCardData({ date: value })}
                onLocationChange={(value) => updateCardData({ location: value })}
                onMessageChange={(value) => updateCardData({ message: value })}
                onSparklesToggle={(value) => updateCardData({ showSparkles: value })}
                onLeavesToggle={(value) => updateCardData({ showLeaves: value })}
                onSparklesDensityChange={(value) => updateCardData({ sparklesDensity: value })}
                onLeavesDensityChange={(value) => updateCardData({ leavesDensity: value })}
                onTextColorChange={(value) => updateCardData({ textColor: value })}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App