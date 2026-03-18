# Impeccable

> "Great design prompts require design vocabulary."

Based on [impeccable.style](https://impeccable.style/) — a curated set of
anti-patterns and principles that distinguish intentional design from
generic AI output.

## Anti-Patterns (NEVER do these)

### Typography
- No overused fonts: Inter, Roboto, Arial, Open Sans, system defaults
- No monospace typography as lazy shorthand for "technical" vibes
- No large icons with rounded corners above every heading

### Color & Contrast
- No gray text on colored backgrounds — use a shade of the background
- No pure black (#000) or pure white (#fff) — always tint toward brand
- No AI color palette: cyan-on-dark, purple-to-blue gradients, neon accents
- No gradient text for "impact" — it's decorative, not meaningful
- No default dark mode with glowing accents as a substitute for design

### Layout & Space
- No wrapping everything in cards — not everything needs a container
- No nesting cards inside cards — flatten the hierarchy
- No identical card grids (same-sized icon + heading + text, repeated)
- No hero metric layout template (big number, small label, gradient accent)
- No centering everything — left-aligned with asymmetry feels more designed
- No uniform spacing everywhere — without rhythm, layouts feel monotonous

### Visual Details
- No glassmorphism everywhere (blur, glass cards, glow borders)
- No rounded elements with thick colored border on one side
- No sparklines as decoration — tiny charts that convey nothing
- No rounded rectangles with generic drop shadows
- No modals unless truly no better alternative

### Motion
- No animating layout properties (width, height, padding, margin)
- No bounce or elastic easing — real objects decelerate smoothly

### Interaction & UX Writing
- No repeating the same information (redundant headers, restated intros)
- No making every button primary — use ghost, text links, secondary styles
- No hiding critical functionality on mobile — adapt, don't amputate
- No repeating information users can already see

## Principles (DO these)

### Typography
- Use a modular type scale with fluid sizing (clamp)
- Vary font weights and sizes to create clear visual hierarchy
- Choose distinctive, less common typefaces

### Color
- Use modern CSS color functions (oklch, color-mix, light-dark)
- Tint neutrals toward brand hue for subconscious cohesion

### Layout
- Create visual rhythm through varied spacing — tight groups, generous gaps
- Use fluid spacing with clamp() that breathes on larger screens
- Use asymmetry and break the grid intentionally for emphasis

### Visual Details
- Use intentional, purposeful decorative elements that reinforce brand

### Motion
- Use motion to convey state changes — entrances, exits, feedback
- Use exponential easing (ease-out-quart/quint/expo) for natural decel
- For height animations, use grid-template-rows transitions

### Interaction
- Progressive disclosure — start simple, reveal through interaction
- Design empty states that teach the interface
- Make every interactive surface feel intentional and responsive

### Responsive
- Use container queries (@container) for component-level responsiveness
- Adapt the interface for different contexts — don't just shrink it

### UX Writing
- Make every word earn its place

## Design Review Focus

When reviewing design in this style, prioritize:
1. Does it avoid ALL anti-patterns listed above?
2. Is the typography distinctive (not Inter/Roboto/system defaults)?
3. Are colors tinted and intentional (no pure black/white, no AI palette)?
4. Does layout use varied spacing and asymmetry (not uniform card grids)?
5. Are decorative elements purposeful (no glassmorphism/glow for show)?
6. Does motion use transform/opacity with exponential easing?
7. Does the design feel like a human designer made it, not an AI?
