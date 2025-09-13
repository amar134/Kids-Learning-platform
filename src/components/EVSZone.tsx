import React, { useState } from 'react';
import { ArrowLeft, Leaf, Star } from 'lucide-react';
import { Grade } from '../App';

interface EVSZoneProps {
  grade: Grade;
  onAddPoints: (points: number) => void;
  onAddBadge: (badge: string) => void;
  onBack: () => void;
}

export function EVSZone({ grade, onAddPoints, onAddBadge, onBack }: EVSZoneProps) {
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const animalQuestions = [
    {
      question: "Which animal is known as the 'King of the Jungle'?",
      options: ['Tiger', 'Lion', 'Elephant', 'Bear'],
      answer: 'Lion',
      fun_fact: 'Lions actually live in grasslands, not jungles! 🦁'
    },
    {
      question: "Which bird cannot fly?",
      options: ['Eagle', 'Penguin', 'Parrot', 'Owl'],
      answer: 'Penguin',
      fun_fact: 'Penguins are amazing swimmers instead! 🐧'
    },
    {
      question: "What do pandas love to eat?",
      options: ['Fish', 'Meat', 'Bamboo', 'Fruits'],
      answer: 'Bamboo',
      fun_fact: 'Pandas eat bamboo for up to 14 hours a day! 🐼'
    }
  ];

  const plantQuestions = [
    {
      question: "What do plants need to make their own food?",
      options: ['Water only', 'Sunlight only', 'Sunlight and Water', 'Nothing'],
      answer: 'Sunlight and Water',
      fun_fact: 'Plants also need air (carbon dioxide) to make food! 🌱'
    },
    {
      question: "Which part of the plant makes seeds?",
      options: ['Roots', 'Leaves', 'Flowers', 'Stem'],
      answer: 'Flowers',
      fun_fact: 'Beautiful flowers help plants reproduce! 🌸'
    }
  ];

  const seasonQuestions = [
    {
      question: "In which season do most flowers bloom?",
      options: ['Winter', 'Spring', 'Summer', 'Fall'],
      answer: 'Spring',
      fun_fact: 'Spring is when nature wakes up from winter sleep! 🌺'
    },
    {
      question: "When do we usually see snow?",
      options: ['Summer', 'Spring', 'Winter', 'Fall'],
      answer: 'Winter',
      fun_fact: 'Every snowflake is unique - no two are the same! ❄️'
    }
  ];

  const getCurrentQuestions = () => {
    switch (currentExercise) {
      case 'animals': return animalQuestions;
      case 'plants': return plantQuestions;
      case 'seasons': return seasonQuestions;
      default: return [];
    }
  };

  const questions = getCurrentQuestions();

  const handleSubmit = () => {
    const correct = selectedAnswer === questions[currentQuestion]?.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      onAddPoints(20);
    }

    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer('');
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        if (score >= 2) {
          onAddBadge('evs-explorer');
        }
        setCurrentExercise(null);
      }
    }, 2000);
  };

  const evsAreas = [
    {
      id: 'animals',
      title: 'Animal Kingdom',
      icon: '🐾',
      color: 'from-orange-400 to-red-500',
      description: 'Learn about amazing animals!'
    },
    {
      id: 'plants',
      title: 'Plant World',
      icon: '🌿',
      color: 'from-green-400 to-green-600',
      description: 'Discover the world of plants!'
    },
    {
      id: 'seasons',
      title: 'Seasons & Weather',
      icon: '🌤️',
      color: 'from-blue-400 to-purple-500',
      description: 'Explore weather and seasons!'
    },
    {
      id: 'environment',
      title: 'Our Environment',
      icon: '🌍',
      color: 'from-teal-400 to-blue-500',
      description: 'Care for our planet!',
      comingSoon: true
    }
  ];

  if (currentExercise && questions.length > 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentExercise(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">EVS Explorer</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">Score: {score}</span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {questions[currentQuestion]?.question}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion]?.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-4 text-lg font-bold rounded-2xl border-4 transition-all ${
                      selectedAnswer === option
                        ? 'border-orange-400 bg-orange-50 text-orange-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {!showResult && selectedAnswer && (
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-2xl font-bold py-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Check Answer
            </button>
          )}

          {/* Result */}
          {showResult && (
            <div className={`text-center p-8 rounded-3xl shadow-lg ${
              isCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <div className="text-6xl mb-4">
                {isCorrect ? '🎉' : '🤔'}
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Amazing!' : 'Good Try!'}
              </h3>
              <p className={`text-lg mb-4 ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect 
                  ? 'You got it right! +20 points!' 
                  : `The answer is: ${questions[currentQuestion]?.answer}`
                }
              </p>
              <div className="bg-yellow-100 rounded-2xl p-4">
                <h4 className="font-bold text-yellow-800 mb-2">🧠 Fun Fact!</h4>
                <p className="text-yellow-700">{questions[currentQuestion]?.fun_fact}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-500" />
                EVS Explorer - Grade {grade}
              </h1>
              <p className="text-gray-600">Discover the amazing world around us!</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* EVS Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {evsAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => !area.comingSoon && setCurrentExercise(area.id)}
              disabled={area.comingSoon}
              className={`bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                area.comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto`}>
                {area.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{area.title}</h3>
              <p className="text-gray-600 text-sm">{area.description}</p>
              {area.comingSoon && (
                <p className="text-orange-500 text-xs mt-2 font-bold">Coming Soon!</p>
              )}
            </button>
          ))}
        </div>

        {/* Nature Fact */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🌳 Amazing Nature Fact!</h2>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🐝</div>
              <div>
                <h3 className="text-xl font-bold text-green-800">Busy Bees!</h3>
                <p className="text-green-600">A single bee visits about 2,000 flowers in one day! They help plants by carrying pollen from flower to flower. Without bees, we wouldn't have many fruits and vegetables!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}