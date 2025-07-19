# Blackjack React

A modern, feature-rich Blackjack game built with React 18, TypeScript, and Tauri. Experience the classic card game with beautiful animations, sound effects, and cross-platform desktop support.

## ✨ Features

- **Classic Blackjack Gameplay** - Full implementation of standard Blackjack rules
- **Beautiful UI** - Modern design with Tailwind CSS and smooth Framer Motion animations
- **Sound Effects** - Immersive Web Audio API-powered sound system with procedural audio generation
- **Desktop Application** - Native desktop app powered by Tauri (Windows, macOS, Linux)
- **Game Statistics** - Track your wins, losses, and performance over time
- **Customizable Settings** - Adjust card size, bet amounts, sound, and animation preferences
- **Game History** - Review your previous games and betting patterns
- **Responsive Design** - Works seamlessly on desktop and web browsers
- **TypeScript** - Full type safety throughout the codebase
- **Component Library** - Built with Storybook for component development and documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Rust (for Tauri desktop builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/blackjack-react.git
cd blackjack-react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Web development
npm run dev              # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Desktop application (Tauri)
npm run tauri:dev       # Start Tauri development mode
npm run tauri:build     # Build desktop application

# Testing
npm test                # Run tests
npm run test:ui         # Run tests with UI
npm run coverage        # Generate test coverage

# Code quality
npm run lint            # Lint code
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier

# Component development
npm run storybook       # Start Storybook
npm run build-storybook # Build Storybook
```

## 🎮 How to Play

1. **Place Your Bet** - Choose your bet amount using the preset buttons or custom input
2. **Get Your Cards** - Receive two cards face-up; dealer gets one face-up, one face-down
3. **Make Your Move** - Hit to draw another card, or Stand to keep your current total
4. **Win Conditions**:
   - Get 21 or closer to 21 than the dealer without going over
   - Blackjack (21 with first two cards) pays 3:2
   - Regular wins pay 1:1

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Desktop**: Tauri
- **Testing**: Vitest + Testing Library
- **Component Development**: Storybook
- **Audio**: Web Audio API

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Card/           # Playing card component
│   ├── Hand/           # Card hand display
│   ├── Betting/        # Betting interface
│   └── GameControls/   # Game action buttons
├── hooks/              # Custom React hooks
│   ├── useGameProps.ts # Props Getter Pattern for game components
│   ├── useAppProps.ts  # Props Getter Pattern for app navigation
│   └── useSound.ts     # Audio management
├── lib/                # Core game logic
│   ├── game-logic/     # Blackjack rules and card logic
│   ├── sounds/         # Audio generation and management
│   └── statistics/     # Game statistics calculations
├── pages/              # Page components
├── stores/             # Zustand state management
└── types/              # TypeScript type definitions
```

### Key Patterns

- **Props Getter Pattern** - Centralized component prop management through custom hooks
- **Component-Driven Development** - Isolated components with Storybook documentation
- **Type-Safe State Management** - Zustand stores with full TypeScript integration
- **Procedural Audio** - Web Audio API for dynamic sound generation

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests** - Game logic, statistics, and utility functions
- **Component Tests** - React components with Testing Library
- **Hook Tests** - Custom hooks with props getter logic
- **Type Safety** - Full TypeScript coverage

Run tests with:

```bash
npm test                # Run all tests
npm run test:ui         # Interactive test UI
npm run coverage        # Generate coverage report
```

## 🎯 Performance Features

- **Optimized Rendering** - React 18 concurrent features
- **Efficient Animations** - Hardware-accelerated Framer Motion
- **Lazy Loading** - Code splitting for optimal bundle size
- **Memory Management** - Proper cleanup and optimization
- **Audio Optimization** - Efficient Web Audio API usage

## 📱 Platform Support

- **Web Browsers** - All modern browsers with ES2022 support
- **Desktop** - Windows, macOS, and Linux via Tauri
- **Development** - Hot reload and fast refresh in all environments

## 🔧 Configuration

Customize the game through the Settings panel:

- **Card Size** - Small, Medium, Large
- **Sound** - Volume control and enable/disable
- **Animations** - Speed control and reduced motion support
- **Betting** - Default bet amounts and increment values

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React ecosystem tools
- Inspired by classic casino Blackjack games
- Uses procedural audio generation for immersive sound effects
- Component architecture following industry best practices

---

**Enjoy playing Blackjack!** 🃏🎰
