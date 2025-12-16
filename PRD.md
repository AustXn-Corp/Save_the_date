# Planning Guide

A digital save the date card creator that allows users to design and customize elegant announcement cards with their photo, event details, and animated decorative elements.

**Experience Qualities**:
1. **Elegant** - The interface should feel refined and celebratory, befitting special life events like weddings and celebrations
2. **Expressive** - Users should feel empowered to create something uniquely theirs through customization and animation options
3. **Delightful** - Subtle animations and polished interactions should bring joy and a sense of magic to the creation process

**Complexity Level**: Light Application (multiple features with basic state)
  - This is a focused creative tool with image upload, text customization, and animation toggles, requiring persistent state for the card configuration

## Essential Features

### Image Upload & Display
- **Functionality**: Upload a photo that serves as the full-bleed background of the save the date card
- **Purpose**: Personal photos make the card meaningful and memorable
- **Trigger**: Click upload button or drag-and-drop area
- **Progression**: Click upload area → File picker opens → Select image → Image processes and fills card background → Edit other details
- **Success criteria**: Image fills entire card area edge-to-edge, maintains aspect ratio with cover behavior, displays clearly behind text

### Event Details Form
- **Functionality**: Input fields for names, date, location, and optional message
- **Purpose**: Capture all essential event information that guests need
- **Trigger**: User clicks into text input fields in the editor panel
- **Progression**: Focus field → Type information → See live preview update on card → Move to next field
- **Success criteria**: All text appears readable on the card with proper hierarchy, updates appear instantly in preview

### Animation Controls
- **Functionality**: Toggle switches to enable/disable sparkles and flowing leaves animations, with density sliders to control the quantity of each effect
- **Purpose**: Add whimsical, celebratory movement to bring the card to life while giving users fine-grained control over animation intensity
- **Trigger**: User clicks toggle switches for sparkles or leaves, adjusts density sliders when animations are enabled
- **Progression**: Click toggle → Animation starts/stops immediately → Visual feedback shows active state → Adjust density slider → See particle count update in real-time
- **Success criteria**: Animations run smoothly at 60fps, sparkles twinkle and drift, leaves flow naturally across the card, density controls respond instantly and affect both live preview and exported image

### Download/Share
- **Functionality**: Export the finished card as an animated video (MP4/WebM) or animated GIF with all animations included
- **Purpose**: Allow users to distribute their animated save the date to guests via text, email, or social media
- **Trigger**: Select export format, then click download/share button
- **Progression**: Select format (video/gif) → Click button → Processing with progress indicator → Video renders with live animations for 5 seconds → Download starts or share dialog appears → Confirmation message
- **Success criteria**: Exported video maintains quality, includes all customizations, captures sparkles and leaves animations in motion, and works across messaging apps and email clients

## Edge Case Handling
- **No Image Uploaded**: Show elegant placeholder with upload prompt, disable download until image is added
- **Very Long Text**: Automatically scale down font size or truncate with ellipsis to maintain card layout
- **Low Contrast**: Provide text shadow/overlay options to ensure readability against any background image
- **Mobile Upload**: Support both camera capture and gallery selection on mobile devices
- **Slow Animation Performance**: Reduce particle count or disable animations on lower-powered devices

## Design Direction

The design should evoke romance, celebration, and timeless elegance. It should feel like a keepsake - something special that guests will want to save. The interface should be sophisticated yet approachable, with a balance between creative freedom and guided ease-of-use. Think botanical wedding invitations meets modern digital design.

## Color Selection

A sophisticated botanical palette with warm, romantic tones that complement wedding photography and celebration imagery.

- **Primary Color**: Deep sage green (oklch(0.55 0.08 150)) - Represents growth, harmony, and natural elegance
- **Secondary Colors**: Soft cream (oklch(0.96 0.015 85)) for backgrounds and gentle contrast; warm terracotta (oklch(0.68 0.12 40)) for accents
- **Accent Color**: Champagne gold (oklch(0.78 0.08 75)) - Celebratory highlight for CTAs, sparkle effects, and special emphasis
- **Foreground/Background Pairings**: 
  - Primary green (oklch(0.55 0.08 150)): White text (oklch(0.99 0 0)) - Ratio 6.2:1 ✓
  - Cream background (oklch(0.96 0.015 85)): Dark text (oklch(0.25 0.02 150)) - Ratio 12.8:1 ✓
  - Terracotta (oklch(0.68 0.12 40)): White text (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Accent gold (oklch(0.78 0.08 75)): Dark text (oklch(0.25 0.02 150)) - Ratio 9.5:1 ✓

## Font Selection

Typefaces should balance romantic script elements with clean, readable text for information hierarchy.

- **Typographic Hierarchy**: 
  - Display (Names): Playfair Display Bold/42px/tight letter spacing (-0.02em) - Elegant serif for the couple's names
  - H1 (Save The Date): Playfair Display Regular/32px/normal spacing - Main announcement
  - H2 (Date): Crimson Pro SemiBold/24px/normal spacing - Event date prominence
  - Body (Details): Inter Regular/16px/relaxed leading (1.6) - Location and additional info
  - Small (Labels): Inter Medium/14px/wide letter spacing (0.05em) - Form labels and UI text

## Animations

Animations should feel magical and celebratory without overwhelming the card content - like catching confetti in the air or watching petals fall. They add a layer of enchantment that static cards cannot achieve.

- **Sparkles**: Small twinkling particles that drift slowly upward with random opacity pulses and gentle rotation, creating a dreamy, magical atmosphere
- **Flowing Leaves**: Organic leaf shapes that cascade diagonally across the card with natural tumbling motion, speed variation, and gentle fade in/out
- **UI Transitions**: Smooth 300ms ease-out transitions for toggles, subtle hover lifts on buttons (2px), and gentle scale on active press (0.98)
- **Card Preview**: Subtle breathing animation on the main card (scale 1.0 to 1.02) over 8 seconds when idle

## Component Selection

- **Components**: 
  - Card component for the main save the date preview and editor panel
  - Input fields for text entry (names, date, location, message)
  - Switch components for animation toggles
  - Slider components for animation density controls (5-50 for sparkles, 5-40 for leaves)
  - Button components for upload, download, and share actions (primary style for CTAs)
  - Label components paired with all form inputs
  - Dialog for image upload with drag-drop zone
  - Badge for showing active animation states
  
- **Customizations**: 
  - Custom overlay component with gradient for text readability on photo backgrounds
  - Custom particle systems using framer-motion for sparkles and leaves animations
  - Custom image upload zone with preview thumbnail
  
- **States**: 
  - Inputs: Focus state with gold ring, filled state with subtle background
  - Switches: Active shows gold accent, disabled is muted
  - Sliders: Smooth thumb animation, track fills to current value position, shows current value inline
  - Buttons: Hover lifts with shadow, active presses down, disabled is 50% opacity
  - Upload zone: Hover shows border pulse, dragging-over shows gold highlight
  
- **Icon Selection**: 
  - Phosphor Icons: UploadSimple (upload), Sparkle (sparkles toggle), Leaf (leaves toggle), Download (export), Share (sharing)
  
- **Spacing**: 
  - Card padding: p-8 (32px) for comfortable breathing room
  - Form gaps: gap-6 (24px) between sections, gap-3 (12px) between related inputs
  - Button spacing: px-6 py-3 for primary actions
  
- **Mobile**: 
  - Stack editor panel below card preview on mobile
  - Full-width card preview with 16:9 aspect ratio maintained
  - Simplified two-column toggle layout for animation controls
  - Touch-optimized 44px minimum touch targets for all interactive elements
  - Bottom sheet pattern for upload dialog on mobile
