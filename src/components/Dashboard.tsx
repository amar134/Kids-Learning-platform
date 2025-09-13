import React from 'react';
import { Calculator, BookOpen, Leaf, Gamepad2, Users, BarChart3, Star, Trophy, Heart } from 'lucide-react';
import { Grade, Subject } from '../App';
import { useStudentData } from '../hooks/useStudentData';
import { useAuth } from '../hooks/useAuth';
import { Mascot } from './Mascot';
import { SEOSection } from './SEOSection';

interface DashboardProps {
  onSelectSubject: (subject: Subject) => void;
  selectedGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
  studentName: string;
  onSetStudentName: (name: string) => void;
  totalPoints: number;
  badges: string[];
  onOpenAuth?: () => void;
  isLoggedIn?: boolean;
  userProfile?: any;
}

export function Dashboard({ 
  onSelectSubject, 
  selectedGrade, 
  onSelectGrade, 
  studentName, 
  onSetStudentName,
  totalPoints,
  badges,
  onOpenAuth,
  isLoggedIn = false,
  userProfile
}: DashboardProps) {
  const { signOut } = useAuth();
  const { challenges } = useStudentData();
  
  const subjects = [
    {
      id: 'math' as Subject,
      title: 'Math Zone',
      icon: Calculator,
      color: 'from-blue-400 to-blue-600',
      description: 'Numbers, shapes & fun problems!'
    },
    {
      id: 'english' as Subject,
      title: 'English Corner',
      icon: BookOpen,
      color: 'from-green-400 to-green-600',
      description: 'Words, stories & language fun!'
    },
    {
      id: 'evs' as Subject,
      title: 'EVS Explorer',
      icon: Leaf,
      color: 'from-amber-400 to-orange-500',
      description: 'Nature, animals & our world!'
    },
    {
      id: 'games' as Subject,
      title: 'Learning Games',
      icon: Gamepad2,
      color: 'from-pink-400 to-pink-600',
      description: 'Puzzles, memory & brain games!'
    },
    {
      id: 'parent' as Subject,
      title: 'Parent Corner',
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      description: 'Create custom exercises!'
    },
    {
      id: 'progress' as Subject,
      title: 'My Progress',
      icon: BarChart3,
      color: 'from-teal-400 to-teal-600',
      description: 'See how awesome you are!'
    }
  ];

  // Use real challenges from database or fallback to sample data
  const dailyChallenges = challenges.length > 0 ? challenges.map(challenge => ({
    subject: challenge.subject.charAt(0).toUpperCase() + challenge.subject.slice(1),
    challenge: challenge.challenge_text,
    completed: challenge.is_completed
  })) : [
    { subject: 'Math', challenge: 'Solve 5 addition problems', completed: false },
    { subject: 'English', challenge: 'Find 3 rhyming words', completed: false },
    { subject: 'EVS', challenge: 'Name 5 animals', completed: false },
    { subject: 'Games', challenge: 'Complete memory game', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Mascot />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {studentName ? `Hi ${studentName}!` : 'Welcome to Learning Fun!'}
              </h1>
              <p className="text-lg text-gray-600">Ready to learn something awesome today?</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isLoggedIn && onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                Sign In / Trial
              </button>
            )}
            {isLoggedIn && userProfile && (
              <div className="flex items-center gap-2">
                <div className="bg-green-100 px-4 py-2 rounded-2xl">
                  <span className="text-green-800 font-semibold">👋 {userProfile.full_name}</span>
                </div>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
            <div className="text-center">
              <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-700">{totalPoints} Points</span>
              </div>
            </div>
            <div className="flex gap-2">
              {badges.map((badge, index) => (
                <div key={index} className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  {badge === 'star' && <Star className="w-5 h-5 text-white" />}
                  {badge === 'trophy' && <Trophy className="w-5 h-5 text-white" />}
                  {badge === 'heart' && <Heart className="w-5 h-5 text-white" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Student Setup */}
      {!studentName && (
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">What's your name?</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Type your name here..."
              className="w-full max-w-md px-4 py-3 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none"
              onChange={(e) => {
                // Only update name when user stops typing for 500ms
                clearTimeout(window.nameTimeout);
                window.nameTimeout = setTimeout(() => {
                  if (e.target.value.length >= 2) {
                    onSetStudentName(e.target.value);
                  }
                }, 500);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.length >= 2) {
                  onSetStudentName(e.currentTarget.value);
                }
              }}
            />
            <p className="text-sm text-gray-500">Press Enter or wait a moment after typing your full name</p>
          </div>
        </div>
      )}

      {/* Grade Selection */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Grade</h2>
        <div className="flex gap-3 flex-wrap">
          {[1, 2, 3, 4, 5].map((grade) => (
            <button
              key={grade}
              onClick={() => onSelectGrade(grade as Grade)}
              className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-200 ${
                selectedGrade === grade
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Grade {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dailyChallenges.map((challenge, index) => (
            <div key={index} className={`p-4 rounded-2xl border-2 ${
              challenge.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-gray-700">{challenge.subject}</span>
                {challenge.completed && (
                  <Star className="w-5 h-5 text-green-500 fill-current" />
                )}
              </div>
              <p className="text-sm text-gray-600">{challenge.challenge}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <button
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className="group relative bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{subject.title}</h3>
                <p className="text-gray-600">{subject.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* SEO Content Section */}
      <SEOSection />
    </div>
  );
}