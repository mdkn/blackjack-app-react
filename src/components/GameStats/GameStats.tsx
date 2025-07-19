import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Shield,
  Award,
  Flame,
} from "lucide-react";
import { GameResult } from "../../types";
import {
  calculateStatistics,
  formatCurrency,
  formatPercentage,
  getStreakText,
  GameStatistics,
} from "../../lib/statistics";

interface GameStatsProps {
  history: GameResult[];
  className?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "green" | "red" | "blue" | "yellow" | "purple" | "gray";
  trend?: "up" | "down" | "neutral";
}

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color = "gray",
  trend,
}: StatCardProps) => {
  const colorClasses = {
    green: "bg-green-900 border-green-600 text-green-400",
    red: "bg-red-900 border-red-600 text-red-400",
    blue: "bg-blue-900 border-blue-600 text-blue-400",
    yellow: "bg-yellow-900 border-yellow-600 text-yellow-400",
    purple: "bg-purple-900 border-purple-600 text-purple-400",
    gray: "bg-gray-700 border-gray-600 text-gray-300",
  };

  const getTrendIcon = () => {
    if (trend === "up")
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === "down")
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    return null;
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border ${colorClasses[color]}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-300">{title}</span>
        </div>
        {getTrendIcon()}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </motion.div>
  );
};

export const GameStats = ({ history, className = "" }: GameStatsProps) => {
  const stats = calculateStatistics(history);

  const getWinRateColor = (winRate: number): "green" | "red" | "yellow" => {
    if (winRate >= 60) return "green";
    if (winRate >= 40) return "yellow";
    return "red";
  };

  const getStreakColor = (
    streak: GameStatistics["currentStreak"]
  ): "green" | "red" | "gray" => {
    if (streak.type === "win") return "green";
    if (streak.type === "loss") return "red";
    return "gray";
  };

  if (history.length === 0) {
    return (
      <div
        className={`${className} bg-gray-800 rounded-lg p-8 border border-gray-700`}
      >
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No Statistics Yet
          </h3>
          <p className="text-gray-400">
            Play some games to see your statistics here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-400" />
        <h3 className="text-2xl font-bold text-white">Game Statistics</h3>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="w-5 h-5" />}
          title="Games Played"
          value={stats.totalGames}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Win Rate"
          value={formatPercentage(stats.winRate)}
          color={getWinRateColor(stats.winRate)}
          trend={stats.winRate >= 50 ? "up" : "down"}
        />
        <StatCard
          icon={<div className="text-green-400">$</div>}
          title="Net Winnings"
          value={formatCurrency(stats.totalWinnings)}
          color={stats.totalWinnings >= 0 ? "green" : "red"}
          trend={stats.totalWinnings >= 0 ? "up" : "down"}
        />
        <StatCard
          icon={<Flame className="w-5 h-5" />}
          title="Current Streak"
          value={stats.currentStreak.count || "None"}
          subtitle={getStreakText(stats.currentStreak)}
          color={getStreakColor(stats.currentStreak)}
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Award className="w-5 h-5" />}
          title="Games Won"
          value={`${stats.gamesWon}/${stats.totalGames}`}
          subtitle={`${stats.gamesLost} losses, ${stats.gamesPushed} pushes`}
          color="green"
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          title="Blackjacks Hit"
          value={stats.blackjacksHit}
          subtitle={`${formatPercentage((stats.blackjacksHit / stats.totalGames) * 100)} of games`}
          color="yellow"
        />
        <StatCard
          icon={<Shield className="w-5 h-5" />}
          title="Player Busts"
          value={stats.timesPlayerBusted}
          subtitle={`${formatPercentage((stats.timesPlayerBusted / stats.totalGames) * 100)} of games`}
          color="red"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Biggest Win"
          value={formatCurrency(stats.biggestWin)}
          color="green"
        />
        <StatCard
          icon={<TrendingDown className="w-5 h-5" />}
          title="Biggest Loss"
          value={formatCurrency(stats.biggestLoss)}
          color="red"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          title="Average per Game"
          value={formatCurrency(Math.round(stats.averageWinnings))}
          color={stats.averageWinnings >= 0 ? "green" : "red"}
        />
      </div>

      {/* Streak Records */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Streak Records
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Longest Win Streak"
            value={stats.longestWinStreak}
            subtitle={`${stats.longestWinStreak} ${stats.longestWinStreak === 1 ? "game" : "games"} in a row`}
            color="green"
          />
          <StatCard
            icon={<TrendingDown className="w-5 h-5" />}
            title="Longest Loss Streak"
            value={stats.longestLossStreak}
            subtitle={`${stats.longestLossStreak} ${stats.longestLossStreak === 1 ? "game" : "games"} in a row`}
            color="red"
          />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h4 className="text-lg font-bold text-white mb-4">Game Insights</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Dealer busted:</span>
            <span className="text-white">
              {stats.timesDealerBusted} times (
              {formatPercentage(
                (stats.timesDealerBusted / stats.totalGames) * 100
              )}
              )
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Games ending in push:</span>
            <span className="text-white">
              {stats.gamesPushed} times (
              {formatPercentage((stats.gamesPushed / stats.totalGames) * 100)})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Blackjack frequency:</span>
            <span className="text-white">
              1 in{" "}
              {stats.blackjacksHit > 0
                ? Math.round(stats.totalGames / stats.blackjacksHit)
                : "∞"}{" "}
              games
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
