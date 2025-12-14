# Mario Digital Signature

A static digital signature page featuring Matrix-style digital rain effects.

## Technical Specification

### Architecture
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, animations, responsive design
- **Vanilla JavaScript**: No dependencies, secure DOM manipulation
- **Static Hosting**: No backend required

### Security Implementation
- Content Security Policy (CSP) with restrictive directives
- XSS prevention through safe DOM methods
- No external dependencies or third-party scripts
- Security headers: X-Frame-Options, X-Content-Type-Options, Permissions-Policy

### Performance Features
- Memory leak prevention with automatic cleanup
- Rate limiting for DOM operations
- Visibility API integration for tab optimization
- Reduced motion support for accessibility
- Maximum 50 concurrent rain columns

### Color Scheme
```css
--bg-color: #0a0a0a           /* Charcoal background */
--rain-color: #9333ea         /* Digital violet */
--rain-opacity: 0.15           /* Subtle rain effect */
--logo-color: #a855f7         /* Bright purple */
--logo-glow: rgba(168, 85, 247, 0.8)  /* Glow effect */
```

### Typography
- **Primary**: JetBrains Mono (self-hosted WOFF2)
- **Fallback**: Fira Code, Source Code Pro, SF Mono, Monaco, Consolas, monospace
- **Weight**: 400 (regular), 700 (bold)
- **Character spacing**: 0.05em

### Animation Specifications
- **Matrix Rain**: Continuous falling characters, 15-25s duration
- **Orbital Drift**: 25s figure-8 pattern, cubic-bezier easing
- **Breathing Glow**: 4s pulse cycle, ±20% brightness variation
- **Subtle Scale**: ±2% scale variation synchronized with drift

### File Structure
```
mario-signature/
├── index.html          # Main HTML document
├── css/
│   └── style.css       # Styles and animations
├── js/
│   └── main.js         # Matrix rain engine
├── fonts/
│   ├── JetBrainsMono-Regular.woff2
│   └── JetBrainsMono-Bold.woff2
└── README.md           # This documentation
```

### Deployment
Copy files to any web server or static hosting platform. No build process required.

### Browser Support
- Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Graceful degradation for older browsers
- Mobile responsive with touch support

### Configuration
Modify constants in `js/main.js`:
```javascript
const CONFIG = {
    INITIAL_COLUMNS: 15,        // Starting rain columns
    COLUMN_CREATION_INTERVAL: 800,  // ms between new columns
    MAX_COLUMNS: 50,            // Maximum concurrent columns
    MIN_COLUMN_LENGTH: 10,      // Minimum characters per column
    MAX_COLUMN_LENGTH: 30,      // Maximum characters per column
    MIN_ANIMATION_DURATION: 15,  // Minimum fall duration (seconds)
    MAX_ANIMATION_DURATION: 25   // Maximum fall duration (seconds)
};
```