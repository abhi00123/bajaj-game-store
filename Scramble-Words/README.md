# Scramble Words Game 🐷💰

A gamified financial education experience where players unscramble words to learn about money concepts. Built with React, Vite, Tailwind CSS v4, and Framer Motion.

## 🎮 Features

- **Interactive Gameplay**: Drag-and-drop letter tiles to form words.
- **Physics-Based Animations**: Objects bounce, float, and react to user interaction.
- **Visual Feedback**:
  - ✨ Success: Confetti bursts, green highlights, and celebratory waves.
  - ❌ Error: Shake animations and red cues.
- **Progressive Difficulty**: 3-word challenge with hints.
- **Responsive Design**: Optimized for both mobile and desktop play.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation


1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Open your browser and navigate to `http://localhost:5173`.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

## 📂 Project Structure

```
src/
├── assets/          # Static assets (images, logos)
├── components/      # React components
│   ├── StartScreen.jsx
│   ├── GameScreen.jsx
│   ├── ResultScreen.jsx
│   └── ui/          # Reusable UI elements
├── data/            # Game data (words, hints)
├── lib/             # Utility functions
└── index.css        # Global styles & Tailwind directives
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
