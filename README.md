# 🦖 Dino Runner

<div align="center">

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**A high-performance, procedural HTML5 Canvas recreation of Chrome's iconic offline T-Rex runner.**

[Key Features](#-features) • [Game Controls](#-game-controls) • [Getting Started](#-getting-started) • [Technical Architecture](#-technical-architecture) • [Customization](#-physics--tuning)

</div>

---

## 📖 Overview

**Dino Runner** brings the nostalgic offline Chrome dinosaur experience to the modern web. Built with **React 19**, **TypeScript**, and **HTML5 Canvas**, it recreates the original arcade gameplay with smooth 60 FPS physics, procedural obstacle generation, dynamic day/night cycles, retro 8-bit Web Audio synthesis, and an interactive real-time physics tuning dashboard.

---

## ✨ Features

- **🎮 Authentic Pixel-Art Vector Rendering:** Pure HTML5 Canvas 2D procedural rendering with sub-pixel movement, running leg animations, and ducking sprites.
- **⚡ 60 FPS Physics Engine:** Authentic jump gravity, variable jump heights, and linear acceleration curve as distance increases.
- **🌵 Procedural Obstacle Generation:** Small and large cacti in dynamic clusters (1–3), plus pterodactyls (birds) spawning across 3 altitude levels once reaching 300+ points.
- **🌙 Dynamic Day & Night Mode:** Automatic color inversion cycle every ~700 points with smooth transitions, plus manual dark mode toggle.
- **🔊 Zero-Asset 8-Bit Web Audio:** Sound effects generated entirely on-the-fly using the native Web Audio API (jump blips, milestone chirps, and crash tones) — no MP3/WAV assets needed.
- **📱 Fully Responsive & Touch Friendly:** Crisp rendering on Retina/HiDPI screens with dedicated on-screen touch controls for smartphones and tablets.
- **🎛️ Live Physics Tuning Dashboard:** Built-in modal to tweak starting speed, gravity, jump force, bird score thresholds, and speed acceleration in real-time.
- **🏆 High Score Persistence:** Local storage integration to save your best runs.

---

## 🕹️ Game Controls

| Action | Keyboard | Touch / Mouse |
| :--- | :--- | :--- |
| **Jump / Start** | <kbd>Space</kbd> or <kbd>&uarr;</kbd> (Up Arrow) | Tap Canvas or Tap `JUMP` Button |
| **Duck** | <kbd>&darr;</kbd> (Down Arrow - hold) | Tap & hold `DUCK` Button |
| **Restart Game** | <kbd>Space</kbd> or <kbd>Enter</kbd> | Tap Canvas / Click Restart |
| **Tuning Menu** | Click ⚙️ Settings icon in header | Tap ⚙️ Settings icon |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version `18.0.0` or higher)
- [npm](https://www.npmjs.com/) (version `9.0.0` or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abidali72/-Dino-Runner.git
   cd -Dino-Runner
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to `http://localhost:3000` to play!

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server on port 3000 |
| `npm run build` | Compiles TypeScript and creates an optimized production bundle in `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs `tsc --noEmit` to verify type safety |
| `npm run clean` | Removes build artifacts (`dist/`) |

---

## 🏗️ Technical Architecture

```
dino-runner/
├── public/                 # Static public assets
├── src/
│   ├── components/
│   │   ├── DinoCanvas.tsx    # Core HTML5 Canvas game loop, physics & collision detection
│   │   ├── GameHeader.tsx    # Score display, high score, night mode & sound toggles
│   │   ├── GameDetails.tsx   # Information cards for controls, scoring & mechanics
│   │   ├── TouchControls.tsx # Mobile on-screen jump/duck action buttons
│   │   └── TuningModal.tsx   # Real-time game physics & parameters config modal
│   ├── audio.ts              # Synthesized 8-bit sound effects using Web Audio API
│   ├── types.ts              # TypeScript interfaces and game state models
│   ├── App.tsx               # Main layout, night mode state & game controller
│   ├── main.tsx              # React DOM entrypoint
│   └── index.css             # Tailwind CSS styles and custom fonts
├── package.json              # Dependencies and build scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

### Key Technical Highlights

- **Precise AABB Collision Detection:** Collision boxes feature 4px inward padding to match the visual sprites and deliver forgiving, satisfying hitbox interactions.
- **Synthesized Audio:** Implemented via `AudioContext` with custom oscillators (`square` / `triangle`) and exponential frequency ramps to produce classic 8-bit sounds without latency.
- **Pixel-Ratio Scaling:** Automatically scales the Canvas backing store based on `window.devicePixelRatio` to prevent blurriness on Retina and 4K monitors.

---

## 🎛️ Physics & Tuning

Through the in-game settings modal, players and developers can test custom physics presets:

| Parameter | Default | Description |
| :--- | :--- | :--- |
| **Starting Speed** | `6.0` | Initial horizontal scroll speed |
| **Speed Ramp** | `0.0015` | Acceleration added per frame |
| **Jump Force** | `-11.5` | Upward velocity applied on jump |
| **Gravity** | `0.62` | Downward acceleration applied each frame |
| **Bird Threshold** | `300` | Minimum score before pterodactyls begin spawning |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/abidali72">abidali72</a>
</div>
