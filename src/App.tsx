import { useKV } from '@github/spark/hooks'
import { SaveTheDateCard } from '@/components/SaveTheDateCard'
import { ImageUpload } from '@/components/ImageUpload'
import { EditorPanel } from '@/components/EditorPanel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

interface CardData {
  imageUrl: string | null
  name1: string
  name2: string
  date: string
  location: string
  message: string
  showSparkles: boolean
  showLeaves: boolean
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
      }
      return { ...base, ...updates }
    })
  }

  const handleDownload = async () => {
    if (!cardRef.current) {
      toast.error('Card not found')
      return
    }

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('[data-card-root]') as HTMLElement
          if (clonedCard) {
            clonedCard.style.transform = 'none'
            clonedCard.style.boxShadow = 'none'
            
            const allElements = clonedCard.querySelectorAll('*')
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement
              htmlEl.style.animation = 'none'
              htmlEl.style.transition = 'none'
            })
            
            const motionDivs = clonedCard.querySelectorAll('div[style*="opacity"]')
            motionDivs.forEach((el) => {
              const htmlEl = el as HTMLElement
              if (htmlEl.textContent?.includes('🍃')) {
                htmlEl.style.opacity = '0.4'
              } else {
                htmlEl.style.opacity = '1'
              }
            })
          }
        },
      })

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `save-the-date-${Date.now()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          toast.success('Card downloaded!')
        } else {
          toast.error('Failed to create image')
        }
      }, 'image/png', 0.95)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download card. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (!cardRef.current) {
      toast.error('Card not found')
      return
    }

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('[data-card-root]') as HTMLElement
          if (clonedCard) {
            clonedCard.style.transform = 'none'
            clonedCard.style.boxShadow = 'none'
            
            const allElements = clonedCard.querySelectorAll('*')
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement
              htmlEl.style.animation = 'none'
              htmlEl.style.transition = 'none'
            })
            
            const motionDivs = clonedCard.querySelectorAll('div[style*="opacity"]')
            motionDivs.forEach((el) => {
              const htmlEl = el as HTMLElement
              if (htmlEl.textContent?.includes('🍃')) {
                htmlEl.style.opacity = '0.4'
              } else {
                htmlEl.style.opacity = '1'
              }
            })
          }
        },
      })

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to create image')
          setIsGenerating(false)
          return
        }

        const file = new File([blob], `save-the-date-${Date.now()}.png`, { type: 'image/png' })
        
        if (navigator.share) {
          try {
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: 'Save The Date',
                text: `${data.name1 || 'First Name'} & ${data.name2 || 'Second Name'} - ${data.date || 'Our Special Day'}`,
                files: [file],
              })
              toast.success('Shared successfully!')
            } else {
              await navigator.share({
                title: 'Save The Date',
                text: `${data.name1 || 'First Name'} & ${data.name2 || 'Second Name'} - ${data.date || 'Our Special Day'}`,
              })
              toast.info('Shared text only - device does not support image sharing')
            }
          } catch (error: any) {
            if (error.name === 'AbortError') {
              toast.info('Share cancelled')
            } else {
              console.error('Share error:', error)
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `save-the-date-${Date.now()}.png`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
              toast.info('Downloaded instead')
            }
          }
        } else {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `save-the-date-${Date.now()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          toast.info('Downloaded - sharing not supported on this device')
        }
        setIsGenerating(false)
      }, 'image/png', 0.95)
    } catch (error) {
      console.error('Share error:', error)
      toast.error('Failed to generate card image. Please try again.')
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
                onName1Change={(value) => updateCardData({ name1: value })}
                onName2Change={(value) => updateCardData({ name2: value })}
                onDateChange={(value) => updateCardData({ date: value })}
                onLocationChange={(value) => updateCardData({ location: value })}
                onMessageChange={(value) => updateCardData({ message: value })}
                onSparklesToggle={(value) => updateCardData({ showSparkles: value })}
                onLeavesToggle={(value) => updateCardData({ showLeaves: value })}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App