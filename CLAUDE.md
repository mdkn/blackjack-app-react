# Blackjack Game - React + TypeScript + Tauri

## Project Overview

Implementing a blackjack game with rich user interface using React + TypeScript + Tauri, providing equivalent functionality to blackjack-cli. Deploy as a lightweight, high-performance desktop application.

## Technology Stack

### Frontend

- **React 18** - Frontend framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Zustand** - Lightweight state management library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Desktop Application

- **Tauri 1.5+** - Lightweight desktop application framework
- **@tauri-apps/api** - Tauri JavaScript API
- **@tauri-apps/cli** - Build tool

### Development & Testing

- **Storybook 7** - Component development and design review tool
- **Vitest** - Fast test runner
- **React Testing Library** - React component testing
- **ESLint** + **Prettier** - Code quality management
- **Husky** - Git hooks

### Package Management & CI/CD

- **pnpm** - Fast package manager
- **GitHub Actions** - CI/CD and automated releases

## Technology Selection Rationale

### Zustand

- Lighter and simpler than Redux
- Excellent TypeScript support
- Low learning curve
- Ideal for medium-scale game applications

### Tauri

- Lighter than Electron (10-20MB vs 100MB+)
- Lower memory usage
- Excellent security
- Technical affinity with blackjack-cli (Rust)

### Storybook

- Component-driven development
- Design review independent of game logic
- Visualization of various states

## Implementation Phases

### Phase 1: Project Initialization

1. Tauri + Vite + TypeScript setup
2. Storybook configuration
3. Basic type definitions (Card, Suit, Rank, etc.)
4. Deck and hand management logic

### Phase 2: Core UI Development

1. Card component creation (Storybook-driven)
2. Game state management with Zustand
3. Basic game flow implementation
4. Betting system

### Phase 3: Advanced UI & UX

1. Animation implementation with Framer Motion
2. Responsive design
3. Game statistics and history features
4. Settings screen

### Phase 4: Desktop Application

1. Tauri build configuration
2. Auto-update functionality
3. GitHub Actions CI/CD setup
4. Release pipeline construction

## Reference Implementation

Implementing the following features based on blackjack-cli:

### Game Features

- Standard blackjack rules
- Player starts with 1000 chips
- Dealer hits on soft 17
- Blackjack 3:2 payout
- Automatic ace value adjustment
- Deck reshuffling

### UI Features

- Interactive card display
- Animated card dealing
- Betting interface
- Game statistics display

## Development Commands

```bash
# Start development server
npm run tauri dev

# Start Storybook
npm run storybook

# Run tests
npm run test

# Build
npm run tauri build

# Format
npm run format

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/           # UI components
│   ├── Card/            # Card display component
│   ├── Hand/            # Hand display component
│   ├── Betting/         # Betting UI component
│   └── GameControls/    # Game control buttons
├── stores/              # Zustand state management
│   ├── gameStore.ts     # Game state
│   └── settingsStore.ts # Settings state
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── hooks/               # Custom hooks
├── stories/             # Storybook stories
└── __tests__/           # Test files
```

## Docker Decision

### Why Docker is NOT Used

**Deployment Method Mismatch:**

- Tauri builds native binaries (.exe, .dmg, .deb) for desktop distribution
- Docker is designed for web application containerization
- Desktop apps don't benefit from containerization

**Development Complexity:**

- Tauri's development server (`npm run tauri dev`) provides sufficient hot reloading
- Docker would add unnecessary configuration overhead
- Potential performance degradation in development workflow

**Cross-Platform Building:**

- Tauri + GitHub Actions automatically generates binaries for all target platforms
- Docker only provides Linux environment, unsuitable for desktop app distribution
- Native compilation is more efficient for desktop applications

**Individual Development Considerations:**

- **Benefits**: Environment consistency, dependency isolation
- **Drawbacks**: Setup cost, performance overhead, learning curve
- **Conclusion**: For individual desktop app projects, drawbacks outweigh benefits

### Recommended Approach

1. **Local Development**: Node.js + Rust environment only
2. **CI/CD**: GitHub Actions for automated build and release
3. **Distribution**: Binary distribution via GitHub Releases

## Environment Requirements

- Node.js 18+
- Rust 1.70+
- System-dependent development tools (for each OS)
