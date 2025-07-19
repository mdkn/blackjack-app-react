import { useState } from "react";
import { motion } from "framer-motion";
import { Spade, Heart, Diamond, Club, Play } from "lucide-react";
import { useGameStore } from "./stores";

function App() {
  const [count, setCount] = useState(0);
  const { player, phase } = useGameStore();

  return (
    <div className="min-h-screen bg-table-felt p-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-4xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Blackjack Game
        </motion.h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white text-black p-4 rounded-lg shadow-lg">
            <Spade className="mx-auto mb-2 h-8 w-8" />
            <p className="font-semibold">Spades</p>
          </div>
          <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
            <Heart className="mx-auto mb-2 h-8 w-8" />
            <p className="font-semibold">Hearts</p>
          </div>
          <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
            <Diamond className="mx-auto mb-2 h-8 w-8" />
            <p className="font-semibold">Diamonds</p>
          </div>
          <div className="bg-white text-black p-4 rounded-lg shadow-lg">
            <Club className="mx-auto mb-2 h-8 w-8" />
            <p className="font-semibold">Clubs</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Game Status</h2>
          <p className="text-gray-300 mb-2">Player Chips: {player.chips}</p>
          <p className="text-gray-300 mb-4">Game Phase: {phase}</p>

          <motion.button
            className="btn-primary flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCount(count => count + 1)}
          >
            <Play className="h-5 w-5" />
            Test Button (clicked {count} times)
          </motion.button>
        </div>

        <p className="text-gray-300 text-sm">
          Technology Stack: React 18 + TypeScript + Vite + Tauri + Tailwind CSS
          + Framer Motion + Zustand
        </p>
      </div>
    </div>
  );
}

export default App;
