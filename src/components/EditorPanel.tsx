import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Sparkle, Leaf, Palette, TextAa } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface EditorPanelProps {
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
  onName1Change: (value: string) => void
  onName2Change: (value: string) => void
  onDateChange: (value: string) => void
  onLocationChange: (value: string) => void
  onMessageChange: (value: string) => void
  onSparklesToggle: (value: boolean) => void
  onLeavesToggle: (value: boolean) => void
  onSparklesDensityChange: (value: number) => void
  onLeavesDensityChange: (value: number) => void
  onTextColorChange: (value: string) => void
  onTextShadowToggle: (value: boolean) => void
}

export function EditorPanel({
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
  onName1Change,
  onName2Change,
  onDateChange,
  onLocationChange,
  onMessageChange,
  onSparklesToggle,
  onLeavesToggle,
  onSparklesDensityChange,
  onLeavesDensityChange,
  onTextColorChange,
  onTextShadowToggle,
}: EditorPanelProps) {
  const presetColors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Cream', value: '#FFF8E7' },
    { name: 'Ivory', value: '#FFFFF0' },
    { name: 'Rose Gold', value: '#ECC5C0' },
    { name: 'Navy', value: '#1A237E' },
    { name: 'Forest', value: '#1B5E20' },
    { name: 'Burgundy', value: '#6D1D2E' },
  ]

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
        <div className="flex items-center gap-2 mb-2">
          <Palette size={20} className="text-primary" weight="duotone" />
          <h3 className="font-heading text-lg font-semibold">Text Color</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="font-body text-sm text-muted-foreground">
              Preset Colors
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {presetColors.map((preset) => (
                <Button
                  key={preset.value}
                  variant={textColor === preset.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onTextColorChange(preset.value)}
                  className="h-12 flex flex-col items-center justify-center gap-1 p-2"
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
                    style={{ backgroundColor: preset.value }}
                  />
                  <span className="text-[10px] leading-none">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="custom-color" className="font-body text-sm text-muted-foreground">
              Custom Color
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="custom-color"
                  type="text"
                  value={textColor}
                  onChange={(e) => onTextColorChange(e.target.value)}
                  placeholder="#FFFFFF"
                  className="font-mono text-sm pr-12"
                />
                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded border-2 border-border shadow-sm"
                  style={{ backgroundColor: textColor }}
                />
              </div>
              <Input
                type="color"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="w-16 h-auto p-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <TextAa size={20} className="text-primary" weight={showTextShadow ? 'fill' : 'regular'} />
              <Label htmlFor="text-shadow" className="font-body font-medium cursor-pointer">
                Text Shadow
              </Label>
              {showTextShadow && (
                <Badge variant="secondary" className="text-xs">Active</Badge>
              )}
            </div>
            <Switch
              id="text-shadow"
              checked={showTextShadow}
              onCheckedChange={onTextShadowToggle}
            />
          </div>
          <p className="text-xs text-muted-foreground pl-7">
            Adds a subtle shadow behind text for better readability on bright backgrounds
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="font-heading text-lg font-semibold">Animations</h3>
        
        <div className="space-y-4">
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
          
          {showSparkles && (
            <div className="pl-7 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-body text-sm text-muted-foreground">
                  Density
                </Label>
                <span className="font-body text-xs text-muted-foreground">
                  {sparklesDensity}
                </span>
              </div>
              <Slider
                value={[sparklesDensity]}
                onValueChange={(values) => onSparklesDensityChange(values[0])}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
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
          
          {showLeaves && (
            <div className="pl-7 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-body text-sm text-muted-foreground">
                  Density
                </Label>
                <span className="font-body text-xs text-muted-foreground">
                  {leavesDensity}
                </span>
              </div>
              <Slider
                value={[leavesDensity]}
                onValueChange={(values) => onLeavesDensityChange(values[0])}
                min={5}
                max={40}
                step={5}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
