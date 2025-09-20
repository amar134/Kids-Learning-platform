import React, { useState } from 'react';
import { Wand2, BookOpen, Download, Copy, RefreshCw } from 'lucide-react';

interface Question {
  number: number;
  question: string;
  learningObjective: string;
  expectedResponseType: string;
  difficultyJustification: string;
  options?: string[];
  correctAnswer?: string;
}

interface QuestionGeneratorProps {
  onQuestionsGenerated: (questions: Question[]) => void;
}

export function QuestionGenerator({ onQuestionsGenerated }: QuestionGeneratorProps) {
  const [formData, setFormData] = useState({
    subject: 'math',
    grade: 1,
    topic: '',
    complexity: 'easy',
    questionType: 'multiple-choice',
    numQuestions: 5
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const subjects = [
    { value: 'math', label: 'Mathematics' },
    { value: 'english', label: 'English Language Arts' },
    { value: 'science', label: 'Science/EVS' },
    { value: 'social-studies', label: 'Social Studies' },
    { value: 'general', label: 'General Knowledge' }
  ];

  const complexityLevels = [
    { value: 'beginner', label: 'Beginner (Remember)', blooms: 'Remember - Recall facts and basic concepts' },
    { value: 'easy', label: 'Easy (Understand)', blooms: 'Understand - Explain ideas and concepts' },
    { value: 'medium', label: 'Medium (Apply)', blooms: 'Apply - Use information in new situations' },
    { value: 'hard', label: 'Hard (Analyze)', blooms: 'Analyze - Draw connections and identify patterns' },
    { value: 'expert', label: 'Expert (Create)', blooms: 'Create - Generate new ideas and solutions' }
  ];

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'true-false', label: 'True/False' },
    { value: 'fill-blank', label: 'Fill in the Blank' },
    { value: 'word-problem', label: 'Word Problem' },
    { value: 'creative', label: 'Creative Response' }
  ];

  const generateQuestions = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic to generate questions about.');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with realistic delay
    setTimeout(() => {
      const questions = createQuestionsForTopic();
      setGeneratedQuestions(questions);
      onQuestionsGenerated(questions);
      setIsGenerating(false);
    }, 2000);
  };

  const createQuestionsForTopic = (): Question[] => {
    const questions: Question[] = [];
    const { subject, grade, topic, complexity, questionType, numQuestions } = formData;

    for (let i = 1; i <= numQuestions; i++) {
      let question: Question;

      if (subject === 'math') {
        question = generateMathQuestion(i, topic, grade, complexity, questionType);
      } else if (subject === 'english') {
        question = generateEnglishQuestion(i, topic, grade, complexity, questionType);
      } else if (subject === 'science') {
        question = generateScienceQuestion(i, topic, grade, complexity, questionType);
      } else {
        question = generateGeneralQuestion(i, topic, grade, complexity, questionType);
      }

      questions.push(question);
    }

    return questions;
  };

  const generateMathQuestion = (num: number, topic: string, grade: number, complexity: string, type: string): Question => {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('addition') || topicLower.includes('add')) {
      if (complexity === 'beginner') {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        return {
          number: num,
          question: type === 'multiple-choice' 
            ? `What is ${a} + ${b}?`
            : `Solve: ${a} + ${b} = ___`,
          learningObjective: 'Students will recall basic addition facts within 10',
          expectedResponseType: `The correct answer is ${a + b}`,
          difficultyJustification: 'This question requires simple recall of basic addition facts, aligning with the Remember level of Bloom\'s taxonomy.',
          options: type === 'multiple-choice' ? [
            (a + b - 1).toString(),
            (a + b).toString(),
            (a + b + 1).toString(),
            (a + b + 2).toString()
          ] : undefined,
          correctAnswer: (a + b).toString()
        };
      } else if (complexity === 'medium') {
        const items = ['apples', 'stickers', 'toys', 'books'][Math.floor(Math.random() * 4)];
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 10) + 5;
        return {
          number: num,
          question: `Sarah has ${a} ${items}. Her friend gives her ${b} more ${items}. How many ${items} does Sarah have now?`,
          learningObjective: 'Students will apply addition skills to solve real-world word problems',
          expectedResponseType: `Students should show their work: ${a} + ${b} = ${a + b} ${items}`,
          difficultyJustification: 'This question requires students to apply addition knowledge to a new situation (word problem), matching the Apply level.',
          correctAnswer: (a + b).toString()
        };
      }
    }

    if (topicLower.includes('subtraction') || topicLower.includes('subtract')) {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * a);
      return {
        number: num,
        question: `If you have ${a} marbles and give away ${b} marbles, how many marbles do you have left?`,
        learningObjective: 'Students will solve subtraction problems in context',
        expectedResponseType: `${a - b} marbles`,
        difficultyJustification: 'Students must understand subtraction concept and apply it to a practical scenario.',
        correctAnswer: (a - b).toString()
      };
    }

    // Default math question
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return {
      number: num,
      question: `What is ${a} + ${b}?`,
      learningObjective: 'Students will demonstrate basic arithmetic skills',
      expectedResponseType: `The sum ${a + b}`,
      difficultyJustification: 'Basic arithmetic recall appropriate for the specified grade level.',
      correctAnswer: (a + b).toString()
    };
  };

  const generateEnglishQuestion = (num: number, topic: string, grade: number, complexity: string, type: string): Question => {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('rhyme') || topicLower.includes('rhyming')) {
      if (complexity === 'beginner') {
        const words = [
          { word: 'cat', rhymes: ['bat', 'hat', 'mat', 'rat'] },
          { word: 'sun', rhymes: ['fun', 'run', 'bun', 'gun'] },
          { word: 'tree', rhymes: ['bee', 'see', 'free', 'key'] }
        ];
        const selected = words[Math.floor(Math.random() * words.length)];
        
        return {
          number: num,
          question: type === 'multiple-choice' 
            ? `Which word rhymes with "${selected.word}"?`
            : `Write a word that rhymes with "${selected.word}".`,
          learningObjective: 'Students will identify words that rhyme',
          expectedResponseType: `Any word that rhymes with ${selected.word} (e.g., ${selected.rhymes[0]})`,
          difficultyJustification: 'This requires basic recall of rhyming patterns, fitting the Remember level.',
          options: type === 'multiple-choice' ? [
            selected.rhymes[0],
            'elephant',
            'computer',
            'rainbow'
          ] : undefined,
          correctAnswer: selected.rhymes[0]
        };
      } else if (complexity === 'medium') {
        return {
          number: num,
          question: 'Create a short poem (2-4 lines) about your favorite animal using at least one pair of rhyming words.',
          learningObjective: 'Students will apply rhyming knowledge to create original poetry',
          expectedResponseType: 'A short poem with clear rhyming pattern and animal theme',
          difficultyJustification: 'Students must apply their understanding of rhyming to create something new, matching the Apply level.'
        };
      }
    }

    if (topicLower.includes('spelling') || topicLower.includes('vocabulary')) {
      const gradeWords = {
        1: ['cat', 'dog', 'sun', 'run', 'big'],
        2: ['happy', 'friend', 'school', 'water', 'house'],
        3: ['beautiful', 'elephant', 'rainbow', 'birthday', 'butterfly'],
        4: ['adventure', 'important', 'different', 'favorite', 'together'],
        5: ['magnificent', 'mysterious', 'celebration', 'imagination', 'responsibility']
      };
      
      const words = gradeWords[grade as keyof typeof gradeWords] || gradeWords[1];
      const word = words[Math.floor(Math.random() * words.length)];
      
      return {
        number: num,
        question: `Use the word "${word}" in a sentence that shows you understand its meaning.`,
        learningObjective: 'Students will demonstrate vocabulary comprehension through context',
        expectedResponseType: `A complete sentence using "${word}" correctly`,
        difficultyJustification: 'Students must understand the word meaning and apply it in context.',
        correctAnswer: `Example: The ${word} was very special to me.`
      };
    }

    // Default English question
    return {
      number: num,
      question: 'What is your favorite book and why do you like it?',
      learningObjective: 'Students will express personal opinions about literature',
      expectedResponseType: 'A response naming a book and giving reasons for preference',
      difficultyJustification: 'Students recall information and express understanding of their reading preferences.'
    };
  };

  const generateScienceQuestion = (num: number, topic: string, grade: number, complexity: string, type: string): Question => {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('animal') || topicLower.includes('living')) {
      if (complexity === 'beginner') {
        return {
          number: num,
          question: type === 'multiple-choice' 
            ? 'Which of these is a living thing?'
            : 'Name three living things you can find in your backyard.',
          learningObjective: 'Students will identify characteristics of living things',
          expectedResponseType: type === 'multiple-choice' ? 'Tree (or other living thing)' : 'Three examples of living organisms',
          difficultyJustification: 'Basic recall of living vs. non-living classification.',
          options: type === 'multiple-choice' ? ['Rock', 'Tree', 'Car', 'Book'] : undefined,
          correctAnswer: type === 'multiple-choice' ? 'Tree' : 'Examples: tree, bird, flower'
        };
      } else if (complexity === 'hard') {
        return {
          number: num,
          question: 'Compare how a fish and a bird are similar and different. Give at least 2 similarities and 2 differences.',
          learningObjective: 'Students will analyze and compare characteristics of different animal groups',
          expectedResponseType: 'Comparison showing understanding of animal classification',
          difficultyJustification: 'Students must analyze characteristics and identify patterns, fitting the Analyze level.'
        };
      }
    }

    if (topicLower.includes('plant') || topicLower.includes('growth')) {
      return {
        number: num,
        question: 'What do plants need to grow? List at least 3 things.',
        learningObjective: 'Students will identify basic needs of plants',
        expectedResponseType: 'List including water, sunlight, air, soil/nutrients',
        difficultyJustification: 'Recall of basic plant biology concepts appropriate for elementary level.'
      };
    }

    // Default science question
    return {
      number: num,
      question: 'Why is it important to recycle?',
      learningObjective: 'Students will understand environmental responsibility',
      expectedResponseType: 'Explanation of recycling benefits for the environment',
      difficultyJustification: 'Students demonstrate understanding of environmental concepts.'
    };
  };

  const generateGeneralQuestion = (num: number, topic: string, grade: number, complexity: string, type: string): Question => {
    return {
      number: num,
      question: `Tell me something interesting about ${topic}.`,
      learningObjective: `Students will demonstrate knowledge about ${topic}`,
      expectedResponseType: `Factual information or personal connection to ${topic}`,
      difficultyJustification: 'Students recall and share knowledge about the specified topic.'
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Questions copied to clipboard!');
  };

  const downloadQuestions = () => {
    const content = generatedQuestions.map(q => 
      `Question ${q.number}:\n${q.question}\n\nLearning Objective: ${q.learningObjective}\nExpected Response: ${q.expectedResponseType}\nDifficulty Justification: ${q.difficultyJustification}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.subject}_grade${formData.grade}_${formData.topic.replace(/\s+/g, '_')}_questions.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-800">Educational Question Generator</h2>
        </div>
        <p className="text-gray-600">Create pedagogically sound, age-appropriate questions using Bloom's Taxonomy</p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          >
            {subjects.map(subject => (
              <option key={subject.value} value={subject.value}>{subject.label}</option>
            ))}
          </select>
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: parseInt(e.target.value)})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({...formData, topic: e.target.value})}
            placeholder="e.g., Addition, Rhyming Words, Animals, Weather..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          />
        </div>

        {/* Complexity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Complexity Level</label>
          <select
            value={formData.complexity}
            onChange={(e) => setFormData({...formData, complexity: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          >
            {complexityLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {complexityLevels.find(l => l.value === formData.complexity)?.blooms}
          </p>
        </div>

        {/* Question Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Question Type</label>
          <select
            value={formData.questionType}
            onChange={(e) => setFormData({...formData, questionType: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          >
            {questionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Number of Questions */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Questions</label>
          <select
            value={formData.numQuestions}
            onChange={(e) => setFormData({...formData, numQuestions: parseInt(e.target.value)})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} Question{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateQuestions}
        disabled={isGenerating || !formData.topic.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 mb-8"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white inline mr-3"></div>
            Generating Questions...
          </>
        ) : (
          <>
            <Wand2 className="w-6 h-6 inline mr-2" />
            Generate Educational Questions
          </>
        )}
      </button>

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-green-800">
              ✨ {generatedQuestions.length} Questions Generated!
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(generatedQuestions.map(q => q.question).join('\n\n'))}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={downloadQuestions}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={generateQuestions}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          </div>
          
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {generatedQuestions.map((q, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Question {q.number}:</h4>
                  <p className="text-gray-700 text-lg">{q.question}</p>
                  {q.options && (
                    <div className="mt-3 space-y-1">
                      {q.options.map((option, i) => (
                        <div key={i} className={`text-gray-600 ${option === q.correctAnswer ? 'font-bold text-green-600' : ''}`}>
                          {String.fromCharCode(65 + i)}. {option} {option === q.correctAnswer ? '✓' : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-blue-700 mb-1">Learning Objective:</h5>
                    <p className="text-blue-600">{q.learningObjective}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-700 mb-1">Expected Response:</h5>
                    <p className="text-green-600">{q.expectedResponseType}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h5 className="font-semibold text-purple-700 mb-1">Difficulty Justification:</h5>
                    <p className="text-purple-600">{q.difficultyJustification}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}