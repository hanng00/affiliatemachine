# Swedish Affiliate Site Design System

> Design patterns and best practices learned from analyzing top Swedish consumer test sites (Råd & Rön, Testfakta, Test.se, Prisjakt, Elsparkcykel-test.se).

## Color Psychology for Swedish Market

### Trust Colors
Swedish consumers associate certain colors with credibility:

| Color | Hex | Usage | Psychology |
|-------|-----|-------|------------|
| **Burgundy/Maroon** | `#8B2942` | Primary brand, headers | Premium, editorial authority |
| **Deep Red** | `#E53935` | Badges, alerts | Lab-tested, verified |
| **Teal** | `#3D9970` | Secondary accent | Fresh, modern, trustworthy |
| **Blue** | `#2196F3` | Links, info | Reliable, professional |

### Action Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Green** | `#4CAF50` | CTAs, "Köp" buttons, positive indicators |
| **Orange** | `#FF9800` | Badges, urgency, "Bäst i test" |
| **Yellow** | `#FFD54F` | Highlights, star ratings |

### Background Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **White** | `#FFFFFF` | Primary background |
| **Cream** | `#F5F5F0` | Warm, editorial feel (Råd & Rön style) |
| **Light Gray** | `#F5F5F5` | Section separators, cards |

## Typography

### Headline Strategy
- **Editorial/Premium sites**: Serif fonts (Georgia, Playfair Display)
- **Modern/Tech sites**: Bold sans-serif (Inter, DM Sans, Outfit)
- **Size**: 32-48px for H1, 24-32px for H2

### Body Text
- Clean sans-serif: 16-18px
- Line height: 1.6-1.7
- Color: Dark gray `#333` (not pure black)

### Rating Numbers
- Extra bold weight (700-800)
- Large size (24-36px)
- Tabular numbers for alignment

## Badge Patterns

### "Bäst i Test" Badge
```css
.badge-best {
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  letter-spacing: 0.5px;
}
```

### "Väglaglig" (Road Legal) Badge
```css
.badge-legal {
  background: #E8F5E9;
  color: #2E7D32;
  border: 1px solid #A5D6A7;
}
```

### "Kräver Försäkring" (Requires Insurance) Warning
```css
.badge-warning {
  background: #FFF3E0;
  color: #E65100;
  border: 1px solid #FFCC80;
}
```

### Lab Test Badge
```css
.badge-lab {
  background: #E53935;
  color: white;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 1px;
}
```

## Rating Display

### Numerical Score (X/10)
Most trusted format in Sweden. Display prominently.

```jsx
<div className="flex items-baseline gap-1">
  <span className="text-3xl font-bold text-gray-900">9.2</span>
  <span className="text-lg text-gray-500">/10</span>
</div>
```

### Star Ratings
Use filled stars with half-star precision. Yellow `#FFD54F` for filled.

### Color-Coded Scores
| Score | Color | Label |
|-------|-------|-------|
| 9-10 | Green `#4CAF50` | Utmärkt |
| 7-8.9 | Teal `#00897B` | Mycket bra |
| 5-6.9 | Yellow `#FFC107` | Bra |
| < 5 | Red `#E53935` | Undvik |

## CTA Button Styles

### Primary CTA ("Köp", "Se pris")
```css
.cta-primary {
  background: #4CAF50;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: background 0.2s;
}
.cta-primary:hover {
  background: #43A047;
}
```

### Secondary CTA ("Läs mer", "Jämför")
```css
.cta-secondary {
  background: transparent;
  color: #4CAF50;
  border: 2px solid #4CAF50;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 8px;
}
```

### Button Text Patterns
- "Se bästa pris →"
- "Köp hos [Retailer] →"
- "Läs fullständigt test"
- "Jämför alla modeller"

## Trust Signals

### Must-Have Elements
1. **Freshness date**: "Uppdaterad maj 2026"
2. **Research depth**: "Baserat på 50+ timmars research"
3. **Test count**: "6 modeller testade"
4. **Reader count**: "2,847 läsare denna månad"

### Placement
- Trust badges in hero section (above fold)
- Last updated date near title
- Methodology link in footer

### Swedish Trust Phrases
- "Oberoende tester" (Independent tests)
- "Ingen sponsrad innehåll" (No sponsored content)
- "Laboratorietestade" (Lab tested)
- "Verifierade recensioner" (Verified reviews)

## Layout Patterns

### Homepage Structure (Conversion Optimized)
```
┌─────────────────────────────────────┐
│ HEADER (Logo + Nav)                 │
├─────────────────────────────────────┤
│ TRUST BADGES                        │
│ ✓ 50+ timmars research              │
│ ✓ Uppdaterad maj 2026               │
│ ✓ 6 modeller testade                │
├─────────────────────────────────────┤
│ HERO                                │
│ H1: Bästa [produkt] 2026            │
│ Subhead: Vi har testat...           │
├─────────────────────────────────────┤
│ #1 WINNER CARD (prominent)          │
│ [Product] - 9.5/10 - [Price]        │
│ [BIG GREEN CTA]                     │
├─────────────────────────────────────┤
│ QUICK PICKS (3 cards)               │
│ Budget | Bäst | Premium             │
├─────────────────────────────────────┤
│ COMPARISON TABLE (5-6 rows)         │
│ Rank | Name | Score | Price | CTA   │
├─────────────────────────────────────┤
│ USER REVIEWS (3-4 quotes)           │
│ "Quote..." — Name, City             │
├─────────────────────────────────────┤
│ FAQ (3-4 questions, collapsible)    │
├─────────────────────────────────────┤
│ FINAL CTA                           │
│ "Redo att välja? Se vår #1 →"       │
├─────────────────────────────────────┤
│ FOOTER                              │
│ Affiliate disclosure                │
└─────────────────────────────────────┘
```

### Card Design
```css
.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #E5E7EB;
  transition: box-shadow 0.2s, transform 0.2s;
}
.product-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}
```

### Winner Card (Special Treatment)
```css
.winner-card {
  border: 2px solid #4CAF50;
  background: linear-gradient(to bottom, #F0FDF4, white);
  position: relative;
}
.winner-badge {
  position: absolute;
  top: -12px;
  left: 20px;
  background: #4CAF50;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 12px;
}
```

## User Reviews Section

### Review Card Format
```jsx
<div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
  <p className="text-gray-700 italic">
    "Fantastisk räckvidd! Pendlar 15 km varje dag utan problem."
  </p>
  <p className="mt-2 text-sm text-gray-500">
    — Erik, Stockholm <span className="text-gray-400">(Prisjakt)</span>
  </p>
</div>
```

### Review Sources to Cite
- Prisjakt.se
- Amazon.se
- Elgiganten
- Trustpilot
- Google Reviews

## Comparison Table

### Column Structure
| Rank | Produkt | Betyg | Pris | Köp |
|------|---------|-------|------|-----|

### Styling
- Zebra striping for readability
- Sticky header on scroll
- Green highlight for #1 row
- Compact on mobile (hide less important columns)

## Mobile Considerations

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640-1024px
- Desktop: > 1024px

### Mobile Priorities
1. Winner card visible immediately
2. CTA buttons full-width
3. Comparison table horizontally scrollable
4. FAQ always collapsed

## Affiliate Disclosure

### Swedish Legal Requirement
Must clearly disclose affiliate relationships.

### Placement
- Footer (always)
- Near first affiliate link (recommended)

### Example Text
> "Denna sida innehåller affiliatelänkar. Vi kan få provision om du köper via våra länkar, utan extra kostnad för dig. Detta påverkar inte våra omdömen."

---

## Quick Reference: Design Tokens

```css
:root {
  /* Colors */
  --color-primary: #4CAF50;
  --color-primary-dark: #43A047;
  --color-secondary: #8B2942;
  --color-accent: #FF9800;
  --color-warning: #E65100;
  --color-success: #2E7D32;
  
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-cream: #F5F5F0;
  
  /* Text */
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  
  /* Borders */
  --border-light: #E5E7EB;
  --border-medium: #D1D5DB;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Typography */
  --font-display: 'Outfit', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
}
```

---

*Last updated: May 2026*
*Based on analysis of: Råd & Rön, Testfakta, Test.se, Prisjakt, Elsparkcykel-test.se*
