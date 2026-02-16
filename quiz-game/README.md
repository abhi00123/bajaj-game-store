# Life Insurance GST Quiz Game

A modern, responsive, and highly polished web-based quiz game built with React.js, featuring smooth animations and an engaging user experience.

![Quiz Game](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.x-pink)

## 🎮 Features

### Core Gameplay
- **5 Questions**: Interactive multiple-choice quiz about India's 0% GST policy on life insurance
- **Immediate Feedback**: Instant visual and textual feedback for each answer
- **Progress Tracking**: Visual progress bar showing quiz completion
- **Score System**: Comprehensive scoring with percentage calculation
- **Lead Capture Form**: Collect user information for follow-up (name, phone, email, preferred contact time)

### Enhanced Features
- **Smooth Animations**: Powered by Framer Motion for buttery-smooth transitions
- **Confetti Celebration**: Animated confetti effect for high scores (80%+)
- **Sound Effects**: Audio feedback for correct/incorrect answers (extensible)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Local Storage**: High score persistence across sessions
- **Modern UI/UX**: Purple gradient theme matching Bajaj Life Insurance branding

## 🎨 Design

The game features an exact recreation of the reference design with:
- **Purple Gradient Header**: #6B6FD8 → #9B6FD8
- **Primary Purple Buttons**: #6B70E5 with hover effects
- **Success/Error States**: Green (#48BB78) and Red (#E53E3E) feedback
- **Rounded Corners**: Modern card-based design with 12-24px radius
- **Micro-interactions**: Hover, tap, and transition animations throughout

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd "Quiz Game"

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
quiz-game/
├── public/
│   └── sounds/              # Audio assets (optional)
├── src/
│   ├── components/          # React components
│   │   ├── WelcomeScreen.jsx
│   │   ├── QuestionScreen.jsx
│   │   ├── FeedbackScreen.jsx
│   │   ├── ResultsScreen.jsx
│   │   ├── LeadCaptureForm.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ScoreCard.jsx
│   │   └── Confetti.jsx
│   ├── data/
│   │   └── questions.js     # Quiz questions data
│   ├── hooks/
│   │   ├── useSound.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   └── helpers.js       # Helper functions
│   ├── App.jsx              # Main app component
│   ├── App.css              # Component styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── package.json
└── vite.config.js
```

## 🎯 Game Flow

1. **Welcome Screen**: Introduction with quiz description and start button
2. **Question Screens**: 5 multiple-choice questions with progress indicator
3. **Feedback Screens**: Immediate feedback with explanations after each answer
4. **Results Screen**: Final score, percentage, and motivational message
5. **Lead Capture Form**: Optional form to collect user contact information

## 🛠 Technology Stack

- **React 18.3**: Core framework with functional components and hooks
- **Vite 6.0**: Lightning-fast build tool and dev server
- **Framer Motion 11.x**: Animation library for smooth transitions
- **React Icons**: Beautiful icon library
- **React Confetti**: Canvas-based confetti animation

## 🎨 Customization

### Adding New Questions

Edit `src/data/questions.js`:

```javascript
{
  id: 6,
  category: 'GST',
  difficulty: 'easy',
  question: 'Your question here?',
  options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  correctAnswer: 0, // Index of correct answer (0-3)
  explanation: 'Explanation text here...'
}
```

### Changing Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --purple-gradient-start: #6B6FD8;
  --purple-gradient-end: #9B6FD8;
  --primary-purple: #6B70E5;
  /* ... more variables */
}
```

### Adding Sound Effects

1. Place audio files in `public/sounds/` directory
2. Name them: `correct.mp3`, `incorrect.mp3`, `start.mp3`, `complete.mp3`, `success.mp3`
3. The `useSound` hook will automatically load them

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+ (full layout)
- **Tablet**: 768px - 1023px (adapted layout)
- **Mobile**: < 768px (stacked layout, touch-optimized)

## ✨ Advanced Features (Bonus)

- [x] Confetti animation on high scores
- [x] Local storage for high score persistence
- [x] Keyboard navigation support
- [x] Form validation with error states
- [ ] Sound effects (placeholder implementation ready)
- [ ] Timer system (structure in place)
- [ ] Difficulty levels (extensible via questions.js)
- [ ] Leaderboard (can be added with backend)
- [ ] Dark mode toggle (CSS variables ready)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Start quiz from welcome screen
- [ ] Answer all questions (mix correct/incorrect)
- [ ] Verify progress bar updates
- [ ] Check feedback appears correctly
- [ ] Confirm score calculation is accurate
- [ ] Test form validation
- [ ] Test on mobile device
- [ ] Test keyboard navigation

### Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Code Highlights

### Component Architecture

Each component is self-contained and follows React best practices:
- Functional components with hooks
- Props validation through usage
- Framer Motion for declarative animations
- Clean separation of concerns

### State Management

Centralized state in `App.jsx` using `useState`:
- Current screen tracking
- Quiz progress (question index, score)
- User answers array
- Form data

### Custom Hooks

- `useSound`: Manages sound effects with toggle
- `useLocalStorage`: Persists data to browser storage

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready to deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Developer

Built with ❤️ using React, Vite, and Framer Motion

---

**🎉 Enjoy the quiz! Learn about GST savings on life insurance!**
