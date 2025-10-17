# CommitChain - Visual Design Guide

## Brand Identity

### Name
**CommitChain** - A blockchain-based commitment platform

### Tagline
"Commit to Your Dreams"

### Color Scheme

#### Primary Colors
- **Black**: `#111827` (Gray 900) - Main background
- **Red**: `#dc2626` (Red 600) - Primary accent, CTAs, important stats
- **White**: `#f3f4f6` (Gray 100) - Primary text

#### Secondary Colors
- **Dark Gray**: `#1f2937` (Gray 800) - Cards, elevated surfaces
- **Medium Gray**: `#374151` (Gray 700) - Borders, dividers
- **Light Red**: `#f87171` (Red 400) - Icons, highlights
- **Success Green**: `#22c55e` - Positive actions, completions
- **Warning Yellow**: `#f59e0b` - Warnings, pending states

## Component Styling

### Navigation Bar
```
Background: Gray 800 (#1f2937)
Border: Gray 700 (#374151)
Logo: White + Red accent
Active Links: Red 400 with Red 900/30 background
Hover States: Gray 700 background
```

### Cards
```
Background: Gray 800 (#1f2937)
Border: Gray 700 (#374151)
Shadow: Red 900/20 on hover
Padding: 1.5rem (24px)
Border Radius: 0.75rem (12px)
```

### Buttons
```
Primary:
  - Background: Red 600 (#dc2626)
  - Text: White
  - Hover: Red 700 (#b91c1c)
  
Secondary:
  - Background: Gray 700 (#374151)
  - Text: Gray 100
  - Hover: Gray 600
  
Outline:
  - Border: Gray 600
  - Background: Transparent
  - Text: Gray 100
  - Hover: Gray 800 background
```

### Task/Group Cards

#### Layout Priority
1. **Group Name** - Bold, white text (18px)
2. **Status Badge** - Success/Gray, positioned top-right
3. **Description** - Gray 400, smaller text (14px)
4. **PROMINENT STATS BOX** ⭐
   - Background: Gray 900/50 with Gray 700 border
   - Grid layout: 2 columns
   - Each stat shows:
     - Icon (Red 400)
     - Large value (24px, Red 400)
     - Small label (12px, Gray 500)
5. **Additional Info** - Smaller stats, Gray 400
6. **Progress Bar** - Red 600 on Gray 700 background
7. **Action Buttons** - Primary/Outline styles

#### Prominent Stats Display
```
┌─────────────────────────────────┐
│  🏆            👥               │
│  1.0 AVAX     12/20             │
│  Stake Req.   Participants      │
└─────────────────────────────────┘
```

### Typography

#### Headings
- **H1**: 3rem (48px), Bold, Gray 100
- **H2**: 2rem (32px), Bold, Gray 100
- **H3**: 1.5rem (24px), Semibold, Gray 100
- **H4**: 1.25rem (20px), Medium, Gray 100

#### Body Text
- **Primary**: 1rem (16px), Regular, Gray 100
- **Secondary**: 0.875rem (14px), Regular, Gray 400
- **Small**: 0.75rem (12px), Regular, Gray 500

#### Stats/Numbers
- **Large Stats**: 1.5rem (24px), Bold, Red 400
- **Medium Stats**: 1.25rem (20px), Semibold, Gray 100
- **Small Stats**: 1rem (16px), Medium, Gray 300

### Spacing

#### Containers
- Max Width: 1280px (7xl)
- Padding: 1rem (mobile), 1.5rem (tablet), 2rem (desktop)

#### Grid Gaps
- Small: 0.75rem (12px)
- Medium: 1.5rem (24px)
- Large: 2rem (32px)

#### Card Internal Spacing
- Padding: 1.5rem (24px)
- Section Gaps: 1rem (16px)
- Stat Grid Gap: 0.75rem (12px)

### Icons

#### Sizes
- Small: 1rem (16px)
- Medium: 1.25rem (20px)
- Large: 1.5rem (24px)
- XL: 2rem (32px)

#### Colors
- Primary Action: Red 400 (#f87171)
- Success: Success 400
- Warning: Warning 400
- Info: Gray 400

## Page Layouts

### Groups Page

```
┌────────────────────────────────────────────┐
│ HEADER                                      │
│ Commitment Groups                           │
│ [Create Group Button]                       │
├────────────────────────────────────────────┤
│ SEARCH & FILTERS                           │
│ [Search...] [All] [Active] [Completed]    │
├────────────────────────────────────────────┤
│ GROUPS GRID (3 columns)                    │
│                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ Card 1   │ │ Card 2   │ │ Card 3   │   │
│ │ Name     │ │ Name     │ │ Name     │   │
│ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │   │
│ │ │STATS │ │ │ │STATS │ │ │ │STATS │ │   │
│ │ │BOX   │ │ │ │BOX   │ │ │ │BOX   │ │   │
│ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │   │
│ │ Progress │ │ Progress │ │ Progress │   │
│ │ [Button] │ │ [Button] │ │ [Button] │   │
│ └──────────┘ └──────────┘ └──────────┘   │
└────────────────────────────────────────────┘
```

### Dashboard Page

```
┌────────────────────────────────────────────┐
│ HEADER                                      │
│ Dashboard                                   │
├────────────────────────────────────────────┤
│ STATS GRID (4 columns)                     │
│ [Active] [Completed] [Rewards] [Achieve.]  │
├────────────────────────────────────────────┤
│ YOUR GROUPS (2/3 width) │ SIDEBAR (1/3)   │
│                         │                   │
│ ┌──────────────────┐   │ ┌──────────────┐ │
│ │ Group Card       │   │ │ Deadlines    │ │
│ │ ┌───┬───┬───┐   │   │ │              │ │
│ │ │👥 │🏆 │📅 │   │   │ └──────────────┘ │
│ │ └───┴───┴───┘   │   │                   │
│ │ Progress: 75%    │   │ ┌──────────────┐ │
│ └──────────────────┘   │ │ Quick        │ │
│                         │ │ Actions      │ │
│ ┌──────────────────┐   │ │              │ │
│ │ Group Card 2     │   │ └──────────────┘ │
│ └──────────────────┘   │                   │
└────────────────────────┴───────────────────┘
```

## Interactive States

### Hover Effects
- Cards: Shadow increases, subtle red glow
- Buttons: Darken/lighten by one shade
- Links: Red 400 color, subtle underline

### Active States
- Links: Red 400 text, Red 900/30 background
- Buttons: Pressed effect (scale 0.98)
- Inputs: Red 500 border, Red 500 ring

### Focus States
- All interactive elements: Red 500 ring (2px)
- Keyboard navigation: Clear focus indicators

## Accessibility

### Contrast Ratios (WCAG AA)
- White on Black: 21:1 ✓
- Red 400 on Gray 900: 4.8:1 ✓
- Gray 400 on Gray 900: 4.5:1 ✓

### Features
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on all interactive elements

## Responsive Breakpoints

```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
```

### Grid Adjustments
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

## Animation Guidelines

### Transitions
- Duration: 200-300ms
- Easing: ease-in-out
- Properties: transform, opacity, colors

### Micro-interactions
- Button clicks: Scale 0.98
- Card hovers: Shadow + transform
- Loading states: Pulse animation
- Progress bars: Smooth width transitions

## Best Practices

1. **Always** use the prominent stats box for money and participant data
2. **Maintain** consistent spacing throughout
3. **Use** red sparingly for maximum impact
4. **Ensure** all text has sufficient contrast
5. **Test** on multiple devices and browsers
6. **Keep** animations subtle and performant
7. **Follow** the established component patterns
