import React from 'react';
import { ArrowLeft, Star, Trophy, Heart, Award, Target } from 'lucide-react';

interface RewardSystemProps {
  totalPoints: number;
  badges: string[];
  onBackHome: () => void;
}

export function RewardSystem({ totalPoints, badges, onBackHome }: RewardSystemProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-full">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-yellow-700">{totalPoints}</span>
        </div>
        <div className="flex gap-1">
          {badges.slice(0, 3).map((badge, index) => (
            <div key={index} className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              {badge === 'star' && <Star className="w-3 h-3 text-white" />}
              {badge === 'trophy' && <Trophy className="w-3 h-3 text-white" />}
              {badge === 'heart' && <Heart className="w-3 h-3 text-white" />}
            </div>
          ))}
          {badges.length > 3 && (
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
              +{badges.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}