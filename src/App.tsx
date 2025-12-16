import { useKV } from '@github/spark/hooks'
import { SaveTheDateCard } from '@/components/SaveTheDateCard'
import { ImageUpload } from '@/components/ImageUpload'
import { EditorPanel } from '@/components/EditorPanel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useRef, useState } from 'react'

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
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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
  }

  const updateCardData = (updates: Partial<CardData>) => {
    setCardData((current) => {
      const base = current || {
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
      }
      return { ...base, ...updates }
    })
  }

  const generateCardImage = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(null)
        return
      }

      const width = 1200
      const height = 1600
      canvas.width = width
      canvas.height = height

      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      const finalizeCanvas = () => {
        drawText(ctx, width, height)
        drawDecorations(ctx, width, height)
        
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/png', 1.0)
      }

      if (data.imageUrl) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
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
          
          const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height)
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)')
          gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)')
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)
          
          finalizeCanvas()
        }
        
        img.onerror = () => {
          finalizeCanvas()
        }
        
        img.src = data.imageUrl
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, 'rgba(139, 186, 153, 0.2)')
        gradient.addColorStop(0.5, 'rgba(199, 163, 123, 0.1)')
        gradient.addColorStop(1, 'rgba(234, 234, 234, 0.3)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        
        finalizeCanvas()
      }
    })
  }

  const drawText = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.textAlign = 'center'
    ctx.fillStyle = '#FFFFFF'
    
    ctx.font = '400 24px Inter, sans-serif'
    ctx.letterSpacing = '0.3em'
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

  const drawDecorations = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (data.showSparkles) {
      drawSparkles(ctx, width, height, data.sparklesDensity)
    }
    if (data.showLeaves) {
      drawLeaves(ctx, width, height, data.leavesDensity)
    }
  }

  const drawSparkles = (ctx: CanvasRenderingContext2D, width: number, height: number, count: number) => {
    const sparkleColor = 'rgba(199, 163, 123, 0.8)'
    const sparkleCount = count
    
    for (let i = 0; i < sparkleCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = 3 + Math.random() * 5
      const rotation = Math.random() * Math.PI * 2
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      
      ctx.fillStyle = sparkleColor
      ctx.shadowColor = sparkleColor
      ctx.shadowBlur = 10
      
      ctx.beginPath()
      for (let j = 0; j < 4; j++) {
        const angle = (j * Math.PI) / 2
        const px = Math.cos(angle) * size
        const py = Math.sin(angle) * size
        
        if (j === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
        
        const midAngle = angle + Math.PI / 4
        const midPx = Math.cos(midAngle) * (size * 0.3)
        const midPy = Math.sin(midAngle) * (size * 0.3)
        ctx.lineTo(midPx, midPy)
      }
      ctx.closePath()
      ctx.fill()
      
      ctx.shadowBlur = 0
      ctx.restore()
    }
  }

  const drawLeaves = (ctx: CanvasRenderingContext2D, width: number, height: number, count: number) => {
    const leafCount = count
    
    for (let i = 0; i < leafCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = 20 + Math.random() * 25
      const rotation = Math.random() * Math.PI * 2
      const opacity = 0.3 + Math.random() * 0.3
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = opacity
      
      const gradient = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2)
      gradient.addColorStop(0, 'rgba(100, 150, 120, 0.6)')
      gradient.addColorStop(0.5, 'rgba(139, 186, 153, 0.7)')
      gradient.addColorStop(1, 'rgba(100, 150, 120, 0.5)')
      
      ctx.fillStyle = gradient
      ctx.strokeStyle = 'rgba(80, 130, 100, 0.6)'
      ctx.lineWidth = 1
      
      ctx.beginPath()
      ctx.ellipse(0, 0, size * 0.35, size * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(0, -size * 0.5)
      ctx.lineTo(0, size * 0.5)
      ctx.strokeStyle = 'rgba(80, 130, 100, 0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      ctx.restore()
    }
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const blob = await generateCardImage()
      
      if (!blob) {
        toast.error('Failed to generate image')
        setIsGenerating(false)
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `save-the-date-${data.name1 || 'card'}-${data.name2 || 'card'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Card downloaded!')
      setIsGenerating(false)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download card')
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    setIsGenerating(true)
    try {
      const blob = await generateCardImage()
      
      if (!blob) {
        toast.error('Failed to generate image')
        setIsGenerating(false)
        return
      }

      const file = new File([blob], `save-the-date-${data.name1 || 'card'}-${data.name2 || 'card'}.png`, { 
        type: 'image/png' 
      })
      
      const shareData = {
        title: 'Save The Date',
        text: `${data.name1 || 'First Name'} & ${data.name2 || 'Second Name'}${data.date ? ' - ' + data.date : ''}`,
        files: [file],
      }

      if (navigator.share) {
        try {
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData)
            toast.success('Shared successfully!')
          } else {
            await navigator.share({
              title: shareData.title,
              text: shareData.text,
            })
            toast.info('Shared text only - downloading image separately')
            
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = file.name
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
            link.download = file.name
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
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.info('Downloaded - sharing not supported on this device')
      }
      setIsGenerating(false)
    } catch (error) {
      console.error('Share error:', error)
      toast.error('Failed to share card')
      setIsGenerating(false)
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
            />
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1 font-body"
                size="lg"
              >
                <Download className="mr-2" />
                {isGenerating ? 'Generating...' : 'Download'}
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
                onName1Change={(value) => updateCardData({ name1: value })}
                onName2Change={(value) => updateCardData({ name2: value })}
                onDateChange={(value) => updateCardData({ date: value })}
                onLocationChange={(value) => updateCardData({ location: value })}
                onMessageChange={(value) => updateCardData({ message: value })}
                onSparklesToggle={(value) => updateCardData({ showSparkles: value })}
                onLeavesToggle={(value) => updateCardData({ showLeaves: value })}
                onSparklesDensityChange={(value) => updateCardData({ sparklesDensity: value })}
                onLeavesDensityChange={(value) => updateCardData({ leavesDensity: value })}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App