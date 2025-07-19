import { useState } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  History,
  BarChart3,
  Home,
  Settings as SettingsIcon,
} from "lucide-react";
import { useGameStore, useSettingsStore } from "./stores";
import {
  Hand,
  Betting,
  GameControls,
  GameHistory,
  GameStats,
  Settings,
} from "./components";

type AppView = "game" | "history" | "stats";

function App() {
  const {
    player,
    dealer,
    phase,
    gameHistory,
    placeBet,
    hit,
    stand,
    resetRound,
    newGame,
  } = useGameStore();

  const { settings } = useSettingsStore();

  const [currentView, setCurrentView] = useState<AppView>("game");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const playerCanHit =
    phase === "player-turn" && !player.hand.isBust && player.hand.value < 21;

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
              <button
                onClick={() => setCurrentView("game")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "game"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <Home className="w-4 h-4" />
                Game
              </button>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                <History className="w-4 h-4" />
                History
                {gameHistory.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {gameHistory.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentView("stats")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "stats"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
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
        {currentView === "game" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dealer Section */}
            <motion.div
              className="lg:col-span-3 bg-gray-800 rounded-lg p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Hand
                hand={dealer.hand}
                label="Dealer"
                hideLastCard={phase === "player-turn" || phase === "dealing"}
                cardSize={settings.cardSize}
                className="mb-4"
              />
            </motion.div>

            {/* Player Section */}
            <motion.div
              className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Hand
                hand={player.hand}
                label="Your Hand"
                cardSize={settings.cardSize}
                className="mb-4"
              />
            </motion.div>

            {/* Controls Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Betting Component */}
              {phase === "betting" && (
                <Betting
                  playerChips={player.chips}
                  currentBet={player.currentBet}
                  onPlaceBet={placeBet}
                  presetBets={settings.betIncrements}
                  defaultBet={settings.defaultBet}
                  maxBet={settings.maxBet}
                />
              )}

              {/* Game Controls */}
              <GameControls
                phase={phase}
                onHit={hit}
                onStand={stand}
                onNewRound={resetRound}
                onNewGame={newGame}
                playerCanHit={playerCanHit}
              />
            </motion.div>
          </div>
        )}

        {/* Statistics View */}
        {currentView === "stats" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameStats history={gameHistory} />
          </motion.div>
        )}

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
        <GameHistory
          history={gameHistory}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />

        {/* Settings Modal */}
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

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
