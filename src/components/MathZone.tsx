import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Clock, Shapes, Star, CheckCircle } from 'lucide-react';
import { Grade } from '../App';

interface MathZoneProps {
  grade: Grade;
  onAddPoints: (points: number) => void;
  onAddBadge: (badge: string) => void;
  onBack: () => void;
}

export function MathZone({ grade, onAddPoints, onAddBadge, onBack }: MathZoneProps) {
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [shapeQuestions, setShapeQuestions] = useState<Array<{question: string, options: string[], answer: string}>>([]);
  const [puzzlePieces, setPuzzlePieces] = useState<Array<{id: number, position: {x: number, y: number}, correctPosition: {x: number, y: number}, placed: boolean}>>([]);
  const [quizTimer, setQuizTimer] = useState(30);
  const [quizActive, setQuizActive] = useState(false);

  // Generate math problems based on grade
  const generateProblems = (type: string) => {
    const problems = [];
    const questionCount = 5; // Default 5 questions as requested
    
    for (let i = 0; i < questionCount; i++) {
      if (type === 'addition') {
        const a = Math.floor(Math.random() * (grade * 10)) + 1;
        const b = Math.floor(Math.random() * (grade * 10)) + 1;
        problems.push({ question: `${a} + ${b}`, answer: a + b });
      } else if (type === 'subtraction') {
        const a = Math.floor(Math.random() * (grade * 10)) + grade * 5;
        const b = Math.floor(Math.random() * a);
        problems.push({ question: `${a} - ${b}`, answer: a - b });
      } else if (type === 'multiplication' && grade >= 2) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        problems.push({ question: `${a} × ${b}`, answer: a * b });
      } else if (type === 'shapes') {
        // Generate shape questions
        const shapes = [
          { name: 'Circle', sides: 0, description: 'A round shape with no corners' },
          { name: 'Triangle', sides: 3, description: 'A shape with 3 sides and 3 corners' },
          { name: 'Square', sides: 4, description: 'A shape with 4 equal sides' },
          { name: 'Rectangle', sides: 4, description: 'A shape with 4 sides, opposite sides are equal' },
          { name: 'Pentagon', sides: 5, description: 'A shape with 5 sides' },
          { name: 'Hexagon', sides: 6, description: 'A shape with 6 sides' }
        ];
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const wrongAnswers = shapes.filter(s => s.name !== shape.name).slice(0, 3);
        const options = [shape.name, ...wrongAnswers.map(s => s.name)].sort(() => Math.random() - 0.5);
        
        problems.push({
          question: `Which shape has ${shape.sides === 0 ? 'no corners' : shape.sides + ' sides'}?`,
          answer: shape.name,
          options: options,
          description: shape.description
        });
      } else if (type === 'puzzle') {
        // Generate picture puzzle
        const puzzleImages = [
          { id: 1, name: 'Circle', pieces: 4 },
          { id: 2, name: 'Square', pieces: 4 },
          { id: 3, name: 'Triangle', pieces: 3 }
        ];
        
        const selectedPuzzle = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
        const pieces = [];
        
        for (let i = 0; i < selectedPuzzle.pieces; i++) {
          pieces.push({
            id: i,
            position: { x: Math.random() * 200, y: Math.random() * 200 },
            correctPosition: { x: (i % 2) * 100, y: Math.floor(i / 2) * 100 },
            placed: false
          });
        }
        
        setPuzzlePieces(pieces);
        problems.push({
          question: `Complete the ${selectedPuzzle.name} puzzle!`,
          answer: selectedPuzzle.name,
          type: 'puzzle'
        });
      } else if (type === 'quiz') {
        // Generate quick quiz questions
        const quizQuestions = [
          { question: '5 + 3 = ?', answer: 8, options: [6, 7, 8, 9] },
          { question: '10 - 4 = ?', answer: 6, options: [5, 6, 7, 8] },
          { question: '2 × 3 = ?', answer: 6, options: [4, 5, 6, 7] },
          { question: '8 ÷ 2 = ?', answer: 4, options: [2, 3, 4, 5] }
        ];
        
        return quizQuestions.slice(0, 5).map(q => ({
          question: q.question,
          answer: q.answer,
          options: q.options,
          type: 'quiz'
        }));
      }
    }
    return problems;
  };

  const [problems, setProblems] = useState<Array<{question: string, answer: number}>>([]);

  useEffect(() => {
    if (currentExercise) {
      setProblems(generateProblems(currentExercise));
      setCurrentProblem(0);
      setScore(0);
      if (currentExercise === 'quiz') {
        setQuizTimer(30);
        setQuizActive(true);
      }
    }
  }, [currentExercise, grade]);

  // Quiz timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizActive && quizTimer > 0) {
      interval = setInterval(() => {
        setQuizTimer(prev => prev - 1);
      }, 1000);
    } else if (quizTimer === 0) {
      setQuizActive(false);
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [quizActive, quizTimer]);

  const handlePuzzlePieceMove = (pieceId: number, newPosition: {x: number, y: number}) => {
    setPuzzlePieces(prev => prev.map(piece => 
      piece.id === pieceId 
        ? { ...piece, position: newPosition }
        : piece
    ));
  };

  const checkPuzzleCompletion = () => {
    const tolerance = 20;
    const allPlaced = puzzlePieces.every(piece => {
      const distance = Math.sqrt(
        Math.pow(piece.position.x - piece.correctPosition.x, 2) +
        Math.pow(piece.position.y - piece.correctPosition.y, 2)
      );
      return distance < tolerance;
    });
    
    if (allPlaced) {
      setScore(score + 1);
      onAddPoints(25);
      onAddBadge('puzzle-master');
    }
  };

  const handleSubmit = () => {
    if (!problems[currentProblem]) return;
    
    let correct = false;
    
    if (problems[currentProblem].type === 'quiz') {
      correct = parseInt(userAnswer) === problems[currentProblem].answer;
    } else if (problems[currentProblem].type === 'puzzle') {
      checkPuzzleCompletion();
      correct = true; // Puzzle completion is checked separately
    } else {
      correct = parseInt(userAnswer) === problems[currentProblem].answer;
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      onAddPoints(10);
    }

    setTimeout(() => {
      setShowResult(false);
      setUserAnswer('');
      setQuizActive(false);
      if (currentProblem < problems.length - 1) {
        setCurrentProblem(currentProblem + 1);
        if (currentExercise === 'quiz') {
          setQuizTimer(30);
          setQuizActive(true);
        }
      } else {
        // Exercise complete
        if (score >= 3) {
          onAddBadge('math-star');
        }
        setCurrentExercise(null);
      }
    }, 1500);
  };

  const mathAreas = [
    {
      id: 'addition',
      title: 'Addition Fun',
      icon: '➕',
      color: 'from-blue-400 to-blue-600',
      description: 'Add numbers together!'
    },
    {
      id: 'subtraction',
      title: 'Subtraction',
      icon: '➖',
      color: 'from-green-400 to-green-600',
      description: 'Take numbers away!'
    },
    {
      id: 'multiplication',
      title: 'Times Tables',
      icon: '✖️',
      color: 'from-purple-400 to-purple-600',
      description: 'Multiply numbers!',
      disabled: grade < 2
    },
    {
      id: 'shapes',
      title: 'Shape Explorer',
      icon: '🔵',
      color: 'from-pink-400 to-pink-600',
      description: 'Learn about shapes!',
      disabled: false
    },
    {
      id: 'puzzle',
      title: 'Picture Puzzle',
      icon: '🧩',
      color: 'from-green-400 to-green-600',
      description: 'Complete the picture!',
      disabled: false
    },
    {
      id: 'quiz',
      title: 'Quick Quiz',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500',
      description: 'Answer fast questions!',
      disabled: false
    }
  ];

  // Picture Puzzle Component
  if (currentExercise === 'puzzle') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
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
                <h2 className="text-2xl font-bold text-gray-800">Picture Puzzle</h2>
                <p className="text-gray-600">Drag pieces to complete the shape!</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">Score: {score}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {problems[currentProblem]?.question}
              </h3>
            </div>
            
            <div className="relative w-80 h-80 mx-auto border-4 border-dashed border-gray-300 rounded-2xl mb-6">
              {puzzlePieces.map((piece) => (
                <div
                  key={piece.id}
                  className="absolute w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg cursor-move shadow-lg flex items-center justify-center text-white font-bold"
                  style={{
                    left: piece.position.x,
                    top: piece.position.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                  draggable
                  onDragEnd={(e) => {
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (rect) {
                      const newX = e.clientX - rect.left;
                      const newY = e.clientY - rect.top;
                      handlePuzzlePieceMove(piece.id, { x: newX, y: newY });
                      checkPuzzleCompletion();
                    }
                  }}
                >
                  {piece.id + 1}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-gray-600">Drag the numbered pieces to their correct positions!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quick Quiz Component
  if (currentExercise === 'quiz') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
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
                <h2 className="text-2xl font-bold text-gray-800">Quick Quiz</h2>
                <p className="text-gray-600">Question {currentProblem + 1} of {problems.length}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full font-bold ${
                  quizTimer > 10 ? 'bg-green-100 text-green-800' : 
                  quizTimer > 5 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  ⏰ {quizTimer}s
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold">Score: {score}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-800 mb-6">
                {problems[currentProblem]?.question}
              </h3>
              
              {problems[currentProblem]?.options ? (
                <div className="grid grid-cols-2 gap-4">
                  {problems[currentProblem].options.map((option: number) => (
                    <button
                      key={option}
                      onClick={() => setUserAnswer(option.toString())}
                      className={`p-4 text-2xl font-bold rounded-2xl border-4 transition-all ${
                        userAnswer === option.toString()
                          ? 'border-blue-400 bg-blue-50 text-blue-800'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                      disabled={showResult || !quizActive}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-4xl font-bold text-center w-32 p-4 border-4 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none"
                  placeholder="?"
                  disabled={showResult || !quizActive}
                />
              )}
            </div>
          </div>

          {!showResult && userAnswer && quizActive && (
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-2xl font-bold py-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Submit Answer
            </button>
          )}

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
                {isCorrect ? 'Correct!' : 'Try Again!'}
              </h3>
              <p className={`text-lg ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect 
                  ? 'Great job! +10 points!' 
                  : `The answer is ${problems[currentProblem]?.answer}`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentExercise && problems.length > 0) {
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
                <h2 className="text-2xl font-bold text-gray-800">Math Practice</h2>
                <p className="text-gray-600">Problem {currentProblem + 1} of {problems.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">Score: {score}</span>
              </div>
            </div>
          </div>

          {/* Problem Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 text-center">
            <div className="text-6xl font-bold text-gray-800 mb-6">
              {problems[currentProblem]?.question}
            </div>
            {problems[currentProblem]?.options ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {problems[currentProblem].options.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => setSelectedShape(option)}
                    className={`p-4 text-xl font-bold rounded-2xl border-4 transition-all ${
                      selectedShape === option
                        ? 'border-pink-400 bg-pink-50 text-pink-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <>
            <div className="text-4xl font-bold text-gray-400 mb-6">=</div>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-4xl font-bold text-center w-32 p-4 border-4 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none"
              placeholder="?"
              disabled={showResult}
            />
              </>
            )}
          </div>

          {/* Submit Button */}
          {!showResult && (userAnswer || selectedShape) && (
            <button
              onClick={() => {
                if (problems[currentProblem]?.options && selectedShape) {
                  setUserAnswer(selectedShape);
                }
                handleSubmit();
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold py-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
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
                {isCorrect ? 'Awesome!' : 'Try Again!'}
              </h3>
              <p className={`text-lg ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect 
                  ? 'You got it right! +10 points!' 
                  : `The answer is ${problems[currentProblem]?.answer}`
                }
              </p>
              {problems[currentProblem]?.description && (
                <div className="bg-blue-50 rounded-2xl p-4 mt-4">
                  <h4 className="font-bold text-blue-800 mb-2">Fun Fact!</h4>
                  <p className="text-blue-700">{problems[currentProblem].description}</p>
                </div>
              )}
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
                <Calculator className="w-8 h-8 text-blue-500" />
                Math Zone - Grade {grade}
              </h1>
              <p className="text-gray-600">Choose what you want to practice!</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* Math Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mathAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => !area.disabled && setCurrentExercise(area.id)}
              disabled={area.disabled}
              className={`bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                area.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto`}>
                {area.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{area.title}</h3>
              <p className="text-gray-600 text-sm">{area.description}</p>
              {area.disabled && (
                <p className="text-orange-500 text-xs mt-2">Available from Grade 2</p>
              )}
            </button>
          ))}
        </div>

        {/* Fun Math Facts */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 Fun Math Fact!</h2>
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4">
            <p className="text-lg text-gray-700">
              Did you know? Zero is the only number that can't be written in Roman numerals! 
              The Romans didn't have a symbol for zero! 🤯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}