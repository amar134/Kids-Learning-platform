import React from 'react';
import { ArrowLeft, Star, Trophy, TrendingUp, Calendar, Target, Award } from 'lucide-react';

interface ProgressTrackerProps {
  studentName: string;
  totalPoints: number;
  badges: string[];
  onBack: () => void;
}

export function ProgressTracker({ studentName, totalPoints, badges, onBack }: ProgressTrackerProps) {
  const subjects = [
    { name: 'Math', progress: 75, color: 'bg-blue-500', recent: 85 },
    { name: 'English', progress: 60, color: 'bg-green-500', recent: 90 },
    { name: 'EVS', progress: 80, color: 'bg-orange-500', recent: 70 },
    { name: 'Games', progress: 90, color: 'bg-pink-500', recent: 95 }
  ];

  const recentActivities = [
    { date: 'Today', activity: 'Completed Math Addition', points: 50, icon: '🧮' },
    { date: 'Today', activity: 'Word Scramble Champion', points: 30, icon: '🔤' },
    { date: 'Yesterday', activity: 'Memory Game Master', points: 40, icon: '🧠' },
    { date: 'Yesterday', activity: 'Animal Quiz Expert', points: 35, icon: '🐾' }
  ];

  const achievements = [
    { title: 'Math Star', description: 'Solved 50 math problems', icon: '⭐', earned: true },
    { title: 'Word Wizard', description: 'Learned 100 new words', icon: '📚', earned: true },
    { title: 'Nature Explorer', description: 'Completed all EVS quizzes', icon: '🌿', earned: false },
    { title: 'Game Master', description: 'Won 25 learning games', icon: '🏆', earned: true },
    { title: 'Super Student', description: 'Studied for 30 days', icon: '🎯', earned: false },
    { title: 'Knowledge King', description: 'Earned 1000 points', icon: '👑', earned: false }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back Home
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                {studentName ? `${studentName}'s Progress` : 'My Progress'}
              </h1>
              <p className="text-gray-600">See how awesome you're doing! 🌟</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{totalPoints}</h3>
                <p className="text-yellow-100">Total Points</p>
              </div>
              <Star className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{badges.length}</h3>
                <p className="text-purple-100">Badges Earned</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-green-100">Days Streak</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">87%</h3>
                <p className="text-blue-100">Average Score</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Progress */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject Progress</h2>
            <div className="space-y-6">
              {subjects.map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Recent: {subject.recent}%</span>
                      <span className="font-bold text-gray-800">{subject.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${subject.color} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{activity.activity}</h4>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-yellow-700">+{activity.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements & Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl border-4 transition-all ${
                  achievement.earned
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`text-4xl mb-3 ${!achievement.earned ? 'grayscale opacity-50' : ''}`}>
                    {achievement.icon}
                  </div>
                  <h3 className={`font-bold mb-2 ${
                    achievement.earned ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-xs font-bold text-green-700">
                      <Award className="w-3 h-3" />
                      Earned!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-blue-800 mb-2">Weekly Goal</h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">4/7</p>
              <p className="text-sm text-blue-600">Days completed this week</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-2xl border-2 border-purple-200">
              <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-bold text-purple-800 mb-2">Points Goal</h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">150/200</p>
              <p className="text-sm text-purple-600">Points this week</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-2xl border-2 border-green-200">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-green-800 mb-2">Next Badge</h3>
              <p className="text-lg font-bold text-green-600 mb-1">Math Master</p>
              <p className="text-sm text-green-600">25 more math problems to go!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}