# EthnoSphere

An interactive 3D globe for exploring traditional musical instruments from around the world. Discover the rich diversity of global music cultures through an immersive web experience.

<br>

## ✨ Features

- **Interactive 3D Globe** — Navigate a beautifully rendered Earth with realistic atmosphere, day/night cycle, and warm terminator glow
- **85+ Traditional Instruments** — Explore instruments from every continent, each with detailed descriptions and geographic origins
- **Live Audio Samples** — Listen to authentic instrument sounds powered by the Freesound API
- **Modern UI** — Clean, minimal cyberpunk-inspired interface with smooth animations and glass morphism design
- **Responsive Controls** — Drag to rotate, scroll to zoom, click markers to explore

<br>

## 🎵 Instrument Coverage

| Region | Instruments |
|--------|-------------|
| **Europe** | Flamenco Guitar, Balalaika, Hardingfele, Bouzouki, Nyckelharpa, Gaita, Cimbalom, Hurdy-Gurdy, Kantele, Bodhrán |
| **Asia** | Koto, Shamisen, Sitar, Tabla, Erhu, Pipa, Gamelan, Guzheng, Dizi, Bansuri |
| **Africa** | Djembe, Kalimba, Kora, Balafon, Ngoni, Shekere, Masenqo, Nyatiti, Mbira |
| **Americas** | Charango, Quena, Cajón, Bandoneón, Steelpan, Maracas, Marimba, Berimbau |
| **Oceania** | Didgeridoo, Ukulele, Pate, Nose Flute |
| **Middle East** | Oud, Ney, Tar, Kamancheh, Bağlama, Santur |

<br>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/trekar99/Etnosphere.git
cd Etnosphere

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

<br>

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **React Three Fiber** | React renderer for Three.js |
| **Three.js** | 3D graphics and WebGL |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **Zustand** | State management |
| **Vite** | Build tool |
| **Freesound API** | Audio samples |

<br>

## 📁 Project Structure

```
src/
├── components/
│   ├── 3d/           # Globe, Scene, Markers, Atmosphere
│   ├── cesium/       # Alternative Cesium implementation
│   └── ui/           # Header, DetailsPanel, StatsBar
├── data/
│   └── ethnoData.ts  # Instrument database (85+ entries)
├── services/
│   └── freesound.ts  # Freesound API integration
└── store/
    └── useAppStore.ts # Zustand state management
```

<br>

## 🎨 Design

EthnoSphere features a cyberpunk-inspired aesthetic:
- Neon cyan (#00d4ff) accent color
- Dark immersive backgrounds
- Glass morphism UI panels
- Animated beacon markers
- Subtle atmospheric effects

<br>

## 📝 License

MIT License — feel free to use and modify.

<br>

## 🙏 Credits

- Audio samples: [Freesound](https://freesound.org)
- Icons: [Lucide](https://lucide.dev)
- 3D textures: [Three.js examples](https://github.com/mrdoob/three.js)

<br>

## Future Work

- Check Museu de la Música Instrument Catàleg
- Improve Freesound queries
- Include more instruments 

<br>

---

Made with 🎶 for music lovers worldwide
