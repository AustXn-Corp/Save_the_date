import { useKV } from '@github/spark/hooks'
import { SaveTheDateCard } from '@/components/SaveTheDateCard'
import { ImageUpload } from '@/components/ImageUpload'
import { EditorPanel } from '@/components/EditorPanel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useRef } from 'react'

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
    if (!data.imageUrl) {
      toast.error('Please upload an image first')
      return
    }

    try {
      const link = document.createElement('a')
      link.href = data.imageUrl
      link.download = 'save-the-date.png'
      link.click()
      toast.success('Card downloaded!')
    } catch (error) {
      toast.error('Failed to download card')
    }
  }

  const handleShare = async () => {
    if (!data.imageUrl) {
      toast.error('Please upload an image first')
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Save The Date',
          text: `${data.name1} & ${data.name2} - ${data.date}`,
        })
        toast.success('Shared successfully!')
      } catch (error) {
        toast.info('Share cancelled')
      }
    } else {
      toast.info('Sharing not supported on this device')
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
                disabled={!data.imageUrl}
                className="flex-1 font-body"
                size="lg"
              >
                <Download className="mr-2" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                disabled={!data.imageUrl}
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