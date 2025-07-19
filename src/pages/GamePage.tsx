import { motion } from "framer-motion";
import { useGameStore, useSettingsStore } from "../stores";
import { useSound } from "../hooks";
import { Hand, Betting, GameControls } from "../components";

export const GamePage = () => {
  const { player, dealer, phase, hit, stand, resetRound, newGame, placeBet } =
    useGameStore();

  const { settings } = useSettingsStore();
  const { playSound } = useSound();

  const playerCanHit =
    phase === "player-turn" && !player.hand.isBust && player.hand.value < 21;

  // Wrapper functions that include sound effects
  const handlePlaceBet = (amount: number) => {
    playSound("chipPlace");
    placeBet(amount);
  };

  const handleHit = () => {
    playSound("cardDeal");
    hit();
  };

  const handleStand = () => {
    playSound("cardFlip");
    stand();
  };

  const handleNewRound = () => {
    playSound("chipPlace");
    resetRound();
  };

  return (
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
            onPlaceBet={handlePlaceBet}
            presetBets={settings.betIncrements}
            defaultBet={settings.defaultBet}
            maxBet={settings.maxBet}
          />
        )}

        {/* Game Controls */}
        <GameControls
          phase={phase}
          onHit={handleHit}
          onStand={handleStand}
          onNewRound={handleNewRound}
          onNewGame={newGame}
          playerCanHit={playerCanHit}
        />
      </motion.div>
    </div>
  );
};
