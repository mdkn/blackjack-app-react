import { motion } from "framer-motion";
import {
  Coins,
  History,
  BarChart3,
  Home,
  Settings as SettingsIcon,
} from "lucide-react";
import { useGameStore } from "./stores";
import { useAppProps } from "./hooks";
import { GameHistory, Settings } from "./components";
import { GamePage, StatsPage } from "./pages";

function App() {
  const { player } = useGameStore();
  const {
    currentView,
    getNavButtonProps,
    getHistoryButtonProps,
    getSettingsButtonProps,
    getGameHistoryProps,
    getSettingsProps,
  } = useAppProps();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Navigation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-white">Blackjack</h1>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <button {...getNavButtonProps("game")}>
                <Home className="w-4 h-4" />
                Game
              </button>
              <button {...getHistoryButtonProps()}>
                <History className="w-4 h-4" />
                History
                {getGameHistoryProps().history.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {getGameHistoryProps().history.length}
                  </span>
                )}
              </button>
              <button {...getNavButtonProps("stats")}>
                <BarChart3 className="w-4 h-4" />
                Stats
              </button>
              <button {...getSettingsButtonProps()}>
                <SettingsIcon className="w-4 h-4" />
                Settings
              </button>
            </nav>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Coins className="w-6 h-6" />
              <span className="text-xl font-semibold">${player.chips}</span>
            </div>
          </div>
        </motion.div>

        {/* Content based on current view */}
        {currentView === "game" && <GamePage />}
        {currentView === "stats" && <StatsPage />}

        {/* Current Bet Display */}
        {player.currentBet > 0 && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-block bg-blue-900 text-blue-300 px-4 py-2 rounded-lg border border-blue-600">
              <span className="text-sm">Current Bet: </span>
              <span className="font-bold text-lg">${player.currentBet}</span>
            </div>
          </motion.div>
        )}

        {/* Game History Modal */}
        <GameHistory {...getGameHistoryProps()} />

        {/* Settings Modal */}
        <Settings {...getSettingsProps()} />

        {/* Footer */}
        <motion.footer
          className="mt-8 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p>
            Built with React 18 + TypeScript + Vite + Tauri + Tailwind CSS +
            Framer Motion + Zustand
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
