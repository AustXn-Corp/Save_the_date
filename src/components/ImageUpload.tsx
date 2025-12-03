import { useRef } from 'react'
import { UploadSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImage: string | null
}

export function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUpload(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUpload(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-3">
      <Label className="font-body font-medium text-sm uppercase tracking-wider">
        Background Image
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {currentImage ? (
          <div className="space-y-3">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-32 object-cover rounded-md"
            />
            <Button variant="outline" size="sm" className="w-full">
              <UploadSimple className="mr-2" />
              Change Image
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <UploadSimple
              size={40}
              className="mx-auto text-muted-foreground group-hover:text-accent transition-colors"
            />
            <div>
              <p className="font-body text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
