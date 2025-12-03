import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Sparkle, Leaf } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface EditorPanelProps {
  name1: string
  name2: string
  date: string
  location: string
  message: string
  showSparkles: boolean
  showLeaves: boolean
  onName1Change: (value: string) => void
  onName2Change: (value: string) => void
  onDateChange: (value: string) => void
  onLocationChange: (value: string) => void
  onMessageChange: (value: string) => void
  onSparklesToggle: (value: boolean) => void
  onLeavesToggle: (value: boolean) => void
}

export function EditorPanel({
  name1,
  name2,
  date,
  location,
  message,
  showSparkles,
  showLeaves,
  onName1Change,
  onName2Change,
  onDateChange,
  onLocationChange,
  onMessageChange,
  onSparklesToggle,
  onLeavesToggle,
}: EditorPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold">Event Details</h3>
        
        <div className="space-y-3">
          <Label htmlFor="name1" className="font-body font-medium text-sm uppercase tracking-wider">
            First Name
          </Label>
          <Input
            id="name1"
            value={name1}
            onChange={(e) => onName1Change(e.target.value)}
            placeholder="Enter first name"
            className="font-body"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="name2" className="font-body font-medium text-sm uppercase tracking-wider">
            Second Name
          </Label>
          <Input
            id="name2"
            value={name2}
            onChange={(e) => onName2Change(e.target.value)}
            placeholder="Enter second name"
            className="font-body"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="date" className="font-body font-medium text-sm uppercase tracking-wider">
            Date
          </Label>
          <Input
            id="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            placeholder="e.g., June 15, 2025"
            className="font-body"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="location" className="font-body font-medium text-sm uppercase tracking-wider">
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="e.g., Napa Valley, California"
            className="font-body"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="message" className="font-body font-medium text-sm uppercase tracking-wider">
            Message (Optional)
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Add a personal message..."
            className="font-body resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="font-heading text-lg font-semibold">Animations</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkle size={20} className="text-accent" weight={showSparkles ? 'fill' : 'regular'} />
            <Label htmlFor="sparkles" className="font-body font-medium cursor-pointer">
              Sparkles
            </Label>
            {showSparkles && (
              <Badge variant="secondary" className="text-xs">Active</Badge>
            )}
          </div>
          <Switch
            id="sparkles"
            checked={showSparkles}
            onCheckedChange={onSparklesToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-primary" weight={showLeaves ? 'fill' : 'regular'} />
            <Label htmlFor="leaves" className="font-body font-medium cursor-pointer">
              Flowing Leaves
            </Label>
            {showLeaves && (
              <Badge variant="secondary" className="text-xs">Active</Badge>
            )}
          </div>
          <Switch
            id="leaves"
            checked={showLeaves}
            onCheckedChange={onLeavesToggle}
          />
        </div>
      </div>
    </div>
  )
}
