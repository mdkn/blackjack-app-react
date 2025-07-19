import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useGameStore } from "./stores";
import { Hand, Betting, GameControls } from "./components";

function App() {
  const { player, dealer, phase, placeBet, hit, stand, resetRound, newGame } =
    useGameStore();

  const playerCanHit =
    phase === "player-turn" && !player.hand.isBust && player.hand.value < 21;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-2">Blackjack</h1>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <Coins className="w-6 h-6" />
            <span className="text-xl font-semibold">${player.chips}</span>
          </div>
        </motion.div>

        {/* Game Table */}
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
              cardSize="large"
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
              cardSize="large"
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
