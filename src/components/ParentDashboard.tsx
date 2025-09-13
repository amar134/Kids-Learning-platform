import React, { useState } from 'react';
import { ArrowLeft, Upload, Mic, Download, Share, Camera, FileText, Wand2, Printer, Eye, Users } from 'lucide-react';
import { useExercises } from '../hooks/useExercises';
import { useSchoolDetails } from '../hooks/useSchoolDetails';
import { LLMTemplateGenerator } from './LLMTemplateGenerator';

interface ParentDashboardProps {
  onBack: () => void;
}

export function ParentDashboard({ onBack }: ParentDashboardProps) {
  const { exercises, createExercise } = useExercises();
  const { schoolDetails, saveSchoolDetails } = useSchoolDetails();
  
  const [selectedTab, setSelectedTab] = useState('upload');
  const [uploadedContent, setUploadedContent] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [exerciseType, setExerciseType] = useState('multiple-choice');
  const [grade, setGrade] = useState(1);
  const [generatedExercise, setGeneratedExercise] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false); // Default to false to prevent hints
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [schoolForm, setSchoolForm] = useState({
    school_name: schoolDetails?.school_name || '',
    address: schoolDetails?.address || '',
    city: schoolDetails?.city || '',
    state: schoolDetails?.state || '',
    syllabus: schoolDetails?.syllabus || 'CBSE'
  });
  const [syllabusContent, setSyllabusContent] = useState('');
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

  // Simulate OCR processing with realistic text extraction
  const simulateOCR = (file: File) => {
    setIsProcessingImage(true);
    
    // Simulate processing time
    setTimeout(() => {
      const sampleTexts = [
        "The cat sat on the mat. The dog ran in the park. Birds fly high in the sky. Fish swim in the water.",
        "2 + 3 = 5. 4 + 6 = 10. 7 + 2 = 9. 5 + 5 = 10. 8 + 1 = 9.",
        "Animals live in different places. Lions live in Africa. Penguins live in Antarctica. Bears live in forests. Fish live in oceans.",
        "Red and blue make purple. Yellow and blue make green. Red and yellow make orange. White and black make gray.",
        "Plants need water and sunlight to grow. Trees give us oxygen. Flowers attract bees and butterflies. Fruits grow on trees.",
        "Monday Tuesday Wednesday Thursday Friday Saturday Sunday. January February March April May June July August September October November December."
      ];
      
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setExtractedText(randomText);
      setIsProcessingImage(false);
    }, 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      simulateOCR(file);
    }
  };

  const handleTextUpload = (text: string) => {
    setUploadedContent(text);
    setExtractedText(text);
  };

  const handleSchoolDetailsChange = (field: string, value: string) => {
    setSchoolForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSchoolDetails = async () => {
    try {
      await saveSchoolDetails(schoolForm);
      alert('School details saved successfully!');
    } catch (error) {
      console.error('Error saving school details:', error);
      alert('Failed to save school details. Please try again.');
    }
  };

  const generateWithPerplexity = async () => {
    if (!syllabusContent) return;
    
    setIsGeneratingWithAI(true);
    
    // Simulate Perplexity API call
    setTimeout(() => {
      const aiGeneratedContent = `Based on the syllabus content, here are some educational topics:
      
      Mathematics: Number systems, basic arithmetic operations, geometry fundamentals, measurement concepts.
      
      English: Vocabulary building, sentence formation, reading comprehension, creative writing basics.
      
      Science: Living and non-living things, plants and animals, weather patterns, basic physics concepts.
      
      Social Studies: Community helpers, festivals and traditions, geography basics, historical events.`;
      
      setExtractedText(aiGeneratedContent);
      setIsGeneratingWithAI(false);
      setSelectedTab('create');
    }, 3000);
  };

  const generateExercise = () => {
    if (!extractedText) return;

    const words = extractedText.split(/[.!?]/).join(' ').split(' ').filter(word => word.length > 2);
    const sentences = extractedText.split(/[.!?]/).filter(s => s.trim().length > 0);
    
    let exercise = null;

    // Subject-specific exercise generation
    if (selectedSubject !== 'all') {
      if (selectedSubject === 'math') {
        const mathQuestions = [];
        
        // Extract numbers from text for math problems
        const numbers = extractedText.match(/\d+/g)?.map(Number) || [1, 2, 3, 4, 5];
        
        for (let i = 0; i < Math.min(questionCount, 5); i++) {
          const a = numbers[i % numbers.length] || (i + 1);
          const b = numbers[(i + 1) % numbers.length] || (i + 2);
          
          mathQuestions.push({
            question: `What is ${a} + ${b}?`,
            options: [a + b - 1, a + b, a + b + 1, a + b + 2],
            answer: a + b
          });
        }
        
        exercise = {
          type: 'Math Exercise',
          questions: mathQuestions,
          subject: 'Mathematics'
        };
      } else if (selectedSubject === 'english') {
        const englishQuestions = [];
        const wordsArray = words.slice(0, questionCount);
        
        wordsArray.forEach(word => {
          englishQuestions.push({
            question: `What is the meaning of "${word}"?`,
            options: ['Option A', 'Option B', word + ' meaning', 'Option D'],
            answer: word + ' meaning'
          });
        });
        
        exercise = {
          type: 'English Exercise',
          questions: englishQuestions,
          subject: 'English'
        };
      } else if (selectedSubject === 'evs') {
        const evsQuestions = [
          {
            question: 'Which of these is a living thing?',
            options: ['Rock', 'Tree', 'Car', 'Book'],
            answer: 'Tree'
          }
        ];
        
        exercise = {
          type: 'EVS Exercise',
          questions: evsQuestions,
          subject: 'Environmental Studies'
        };
      }
    } else {
    if (exerciseType === 'multiple-choice') {
      const questions = [];
      const maxQuestions = Math.min(questionCount, 10); // Limit to prevent too many questions
      
      if (extractedText.includes('cat')) {
        questions.push({
          question: "What sat on the mat?",
          options: ["Dog", "Cat", "Bird", "Fish"],
          answer: "Cat"
        });
      }
      
      if (extractedText.includes('sky')) {
        questions.push({
          question: "Where do birds fly?",
          options: ["Underground", "In water", "In the sky", "In caves"],
          answer: "In the sky"
        });
      }
      
      if (extractedText.includes('2 + 3')) {
        questions.push({
          question: "What is 2 + 3?",
          options: ["4", "5", "6", "7"],
          answer: "5"
        });
      }
      
      // Generate additional questions to reach desired count
      while (questions.length < maxQuestions && words.length > 0) {
        const firstWord = words[0];
        if (firstWord) {
          questions.push({
            question: `Which word appears in the text?`,
            options: [firstWord, "elephant", "computer", "rainbow"],
            answer: firstWord
          });
          words.shift(); // Remove used word
        }
      }
      
      exercise = {
        type: 'Multiple Choice',
        questions: questions.slice(0, maxQuestions),
        showAnswers: showAnswers
      };
    } 
    
    else if (exerciseType === 'fill-blanks') {
      const questions = [];
      
      sentences.forEach(sentence => {
        const sentenceWords = sentence.trim().split(' ');
        if (sentenceWords.length > 3) {
          const randomIndex = Math.floor(Math.random() * sentenceWords.length);
          const wordToRemove = sentenceWords[randomIndex];
          const questionSentence = sentenceWords.map((word, index) => 
            index === randomIndex ? '____' : word
          ).join(' ');
          
          questions.push({
            question: questionSentence,
            answer: wordToRemove.replace(/[.,!?]/g, '')
          });
        }
      });
      
      exercise = {
        type: 'Fill in the Blanks',
        questions: questions.slice(0, 4)
      };
    } 
    
    else if (exerciseType === 'word-scramble') {
      const selectedWords = words.slice(0, 6).map(word => {
        const cleanWord = word.replace(/[.,!?]/g, '');
        return {
          scrambled: cleanWord.split('').sort(() => Math.random() - 0.5).join(''),
          original: cleanWord
        };
      });
      
      exercise = {
        type: 'Word Scramble',
        words: selectedWords
      };
    }
    
    else if (exerciseType === 'match-pairs') {
      const pairs = [];
      
      if (extractedText.includes('cat') && extractedText.includes('mat')) {
        pairs.push({ left: 'cat', right: 'sits on mat' });
      }
      if (extractedText.includes('birds') && extractedText.includes('sky')) {
        pairs.push({ left: 'birds', right: 'fly in sky' });
      }
      if (extractedText.includes('fish') && extractedText.includes('water')) {
        pairs.push({ left: 'fish', right: 'swim in water' });
      }
      
      // Add more generic pairs
      const uniqueWords = [...new Set(words.slice(0, 4))];
      uniqueWords.forEach((word, index) => {
        if (index < 3 && pairs.length < 4) {
          pairs.push({ 
            left: word, 
            right: `related to ${word}` 
          });
        }
      });
      
      exercise = {
        type: 'Match the Pairs',
        pairs: pairs.slice(0, 4)
      };
    }
    }

    setGeneratedExercise(exercise);
  };

  const handlePrint = () => {
    if (!generatedExercise) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Learning Exercise - Grade ${grade}</title>
          <style>
            body { 
              font-family: 'Comic Sans MS', Arial, sans-serif; 
              margin: 40px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #3B82F6; 
              padding-bottom: 20px; 
              margin-bottom: 30px;
            }
            h1 { 
              color: #3B82F6; 
              font-size: 28px;
              margin: 0;
            }
            .grade-info {
              color: #666;
              font-size: 16px;
              margin-top: 5px;
            }
            .question { 
              margin: 25px 0; 
              padding: 20px; 
              border-left: 5px solid #3B82F6; 
              background: #f8fafc;
              border-radius: 8px;
            }
            .question h3 {
              color: #1e40af;
              margin-top: 0;
              font-size: 18px;
            }
            .options { 
              list-style: none; 
              padding: 0; 
              margin: 15px 0;
            }
            .options li { 
              margin: 10px 0; 
              padding: 10px 15px; 
              background: #e2e8f0; 
              border-radius: 8px;
              font-size: 16px;
            }
            .answer-box {
              border: 2px solid #cbd5e1;
              padding: 10px;
              margin: 10px 0;
              border-radius: 8px;
              min-height: 30px;
              background: white;
            }
            .scramble-word {
              font-size: 24px;
              font-weight: bold;
              color: #7c3aed;
              text-align: center;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 8px;
              margin: 10px 0;
            }
            .pair-item {
              display: inline-block;
              margin: 8px;
              padding: 10px 15px;
              background: #ddd6fe;
              border-radius: 8px;
              font-weight: bold;
            }
            .instructions {
              background: #fef3c7;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #f59e0b;
            }
            @media print {
              body { margin: 20px; }
              .question { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${generatedExercise.type}</h1>
            <div class="grade-info">Grade ${grade} • Learning Exercise</div>
          </div>
          
          <div class="instructions">
            <strong>Instructions:</strong> 
            ${generatedExercise.type === 'Multiple Choice' ? 'Circle the correct answer for each question.' :
              generatedExercise.type === 'Fill in the Blanks' ? 'Fill in the missing words in each sentence.' :
              generatedExercise.type === 'Word Scramble' ? 'Unscramble each word and write the correct spelling.' :
              'Draw lines to match the pairs correctly.'}
          </div>
          
          ${generatedExercise.questions ? 
            generatedExercise.questions.map((q: any, i: number) => `
              <div class="question">
                <h3>Question ${i + 1}: ${q.question}</h3>
                ${q.options ? `
                  <ul class="options">
                    ${q.options.map((opt: string) => `<li>⬜ ${opt}</li>`).join('')}
                  </ul>
                ` : `
                  <div class="answer-box"></div>
                `}
              </div>
            `).join('') : ''
          }
          
          ${generatedExercise.words ? 
            generatedExercise.words.map((w: any, i: number) => `
              <div class="question">
                <h3>Word ${i + 1}:</h3>
                <div class="scramble-word">${w.scrambled}</div>
                <div class="answer-box"></div>
              </div>
            `).join('') : ''
          }
          
          ${generatedExercise.pairs ? `
            <div class="question">
              <h3>Match the following pairs:</h3>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="flex: 1; margin-right: 20px;">
                  <h4>Column A:</h4>
                  ${generatedExercise.pairs.map((pair: any, i: number) => `
                    <div class="pair-item">${i + 1}. ${pair.left}</div>
                  `).join('')}
                </div>
                <div style="flex: 1;">
                  <h4>Column B:</h4>
                  ${generatedExercise.pairs.map((pair: any, i: number) => `
                    <div class="pair-item">${String.fromCharCode(65 + i)}. ${pair.right}</div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}
          
          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 14px;">
            Generated by Kids Learning App • Grade ${grade} Exercise
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleSaveExercise = () => {
    if (!generatedExercise) return;
    
    try {
      createExercise({
        title: `${generatedExercise.type} - Grade ${grade}`,
        subject: selectedSubject as any,
        grade_level: grade,
        exercise_type: generatedExercise.type,
        content: generatedExercise,
        is_public: false
      });
      alert('Exercise saved successfully!');
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Failed to save exercise. Please try again.');
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        const voiceTexts = [
          "Apple banana orange grape mango",
          "Cat dog bird fish rabbit",
          "Red blue green yellow purple",
          "Happy sad angry excited surprised"
        ];
        const randomVoiceText = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
        setExtractedText(randomVoiceText);
        setIsRecording(false);
      }, 3000);
    }
  };

  const tabs = [
    { id: 'upload', title: 'Upload Content', icon: Upload },
    { id: 'create', title: 'Generate Exercise', icon: Wand2 },
    { id: 'templates', title: 'AI Templates', icon: FileText },
    { id: 'record', title: 'Voice Input', icon: Mic },
    { id: 'manage', title: 'My Exercises', icon: Eye },
    { id: 'school', title: 'School Details', icon: Users }
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
              <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
              <p className="text-gray-600">Create personalized exercises for your child</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-3xl shadow-lg mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'text-purple-600 border-b-4 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {selectedTab === 'upload' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Learning Content</h2>
              
              {/* Grade Selection */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-3">Select Grade Level</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((gradeLevel) => (
                    <button
                      key={gradeLevel}
                      onClick={() => setGrade(gradeLevel)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${
                        grade === gradeLevel
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      Grade {gradeLevel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selection */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-3">Select Subject (Optional)</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                >
                  <option value="all">All Subjects</option>
                  <option value="math">Mathematics</option>
                  <option value="english">English</option>
                  <option value="evs">Environmental Studies</option>
                  <option value="games">Learning Games</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Choose a specific subject for targeted exercise generation
                </p>
              </div>

              {/* Exercise Customization Options */}
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Customize Exercise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Questions (Default: 5)
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions (Recommended)</option>
                      <option value={7}>7 Questions</option>
                      <option value={10}>10 Questions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Answer Display
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showAnswers}
                          onChange={(e) => setShowAnswers(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Show answers in preview</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Answers are hidden by default to prevent hints
                    </p>
                  </div>
                </div>
              </div>

              {/* Syllabus Integration */}
              <div className="mb-6 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-4">🤖 AI-Powered Syllabus Integration</h3>
                <textarea
                  value={syllabusContent}
                  onChange={(e) => setSyllabusContent(e.target.value)}
                  placeholder="Paste your syllabus content here or describe the topics you want to cover..."
                  className="w-full h-24 p-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none mb-4"
                />
                <button
                  onClick={generateWithPerplexity}
                  disabled={!syllabusContent || isGeneratingWithAI}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGeneratingWithAI ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                      Generating with AI...
                    </>
                  ) : (
                    '✨ Generate Content with AI'
                  )}
                </button>
                <p className="text-sm text-blue-600 mt-2">Uses Perplexity AI to create educational content from your syllabus</p>
              </div>
              
              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="border-4 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Upload Image/Worksheet</h3>
                  <p className="text-gray-600 mb-4">Upload a photo of a worksheet or textbook page</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-purple-700 transition-colors inline-block"
                  >
                    Choose Image
                  </label>
                </div>

                {/* Text Input */}
                <div className="border-4 border-dashed border-gray-300 rounded-2xl p-6">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Type or Paste Text</h3>
                  <textarea
                    value={uploadedContent}
                    onChange={(e) => handleTextUpload(e.target.value)}
                    placeholder="Enter words, sentences, or content you want to create exercises from..."
                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Processing Image */}
              {isProcessingImage && (
                <div className="mt-6 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    <h3 className="text-lg font-bold text-blue-800">Processing Image...</h3>
                  </div>
                  <p className="text-blue-600 text-center mt-2">Extracting text from your image using OCR technology</p>
                </div>
              )}

              {/* Extracted Text Preview */}
              {extractedText && !isProcessingImage && (
                <div className="mt-6 p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                  <h3 className="text-lg font-bold text-green-800 mb-2">✅ Content Extracted Successfully!</h3>
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <p className="text-gray-700">{extractedText}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTab('create')}
                    className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                  >
                    Create Exercise →
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'create' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Custom Exercise</h2>
              
              {!extractedText ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No Content Available</h3>
                  <p className="text-gray-500 mb-6">Please upload content first to generate exercises</p>
                  <button
                    onClick={() => setSelectedTab('upload')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                  >
                    Upload Content
                  </button>
                </div>
              ) : (
                <div>
                  {/* Content Preview */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                    <h3 className="font-bold text-gray-800 mb-2">Content to use:</h3>
                    <p className="text-gray-600">{extractedText}</p>
                  </div>

                  {/* Exercise Type Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Exercise Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { id: 'multiple-choice', title: 'Multiple Choice', desc: 'Questions with 4 options', icon: '✅' },
                        { id: 'fill-blanks', title: 'Fill in Blanks', desc: 'Complete the sentences', icon: '✏️' },
                        { id: 'word-scramble', title: 'Word Scramble', desc: 'Unscramble the words', icon: '🔤' },
                        { id: 'match-pairs', title: 'Match Pairs', desc: 'Connect related items', icon: '🔗' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setExerciseType(type.id)}
                          className={`p-4 rounded-2xl border-4 transition-all ${
                            exerciseType === type.id
                              ? 'border-purple-400 bg-purple-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">{type.icon}</div>
                          <h4 className="font-bold text-gray-800">{type.title}</h4>
                          <p className="text-sm text-gray-600">{type.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={generateExercise}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Wand2 className="w-6 h-6 inline mr-2" />
                    Generate Exercise
                  </button>

                  {/* Generated Exercise Preview */}
                  {generatedExercise && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-blue-800">
                          ✨ {generatedExercise.type} Generated!
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </button>
                          <button 
                            onClick={handleSaveExercise}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Save
                          </button>
                          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                            <Share className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl max-h-96 overflow-y-auto">
                        {generatedExercise.questions && generatedExercise.questions.map((q: any, i: number) => (
                          <div key={i} className="mb-4 p-3 border-l-4 border-blue-400">
                            <h4 className="font-bold text-gray-800 mb-2">Q{i + 1}: {q.question}</h4>
                            {q.options && (
                              <div className="space-y-1">
                                {q.options.map((opt: string, j: number) => (
                                  <div key={j} className={`text-gray-600 ${
                                    showAnswers && opt === q.answer ? 'font-bold text-green-600' : ''
                                  }`}>
                                    • {opt} {showAnswers && (opt === q.answer || opt == q.answer) ? '✓' : ''}
                                  </div>
                                ))}
                              </div>
                            )}
                            {(!q.options || showAnswers) && (
                              <div className="text-gray-500 italic">Answer: {q.answer}</div>
                            )}
                          </div>
                        ))}
                        
                        {generatedExercise.words && generatedExercise.words.map((w: any, i: number) => (
                          <div key={i} className="mb-3 p-3 border-l-4 border-blue-400">
                            <span className="font-bold">Word {i + 1}:</span> 
                            <span className="text-purple-600 font-bold ml-2">{w.scrambled}</span> 
                            <span className="text-gray-500 ml-2">→ {w.original}</span>
                          </div>
                        ))}

                        {generatedExercise.pairs && generatedExercise.pairs.map((pair: any, i: number) => (
                          <div key={i} className="mb-3 p-3 border-l-4 border-blue-400">
                            <span className="font-bold">{pair.left}</span> 
                            <span className="text-gray-500 mx-2">↔</span>
                            <span className="font-bold">{pair.right}</span>
                          </div>
                        ))}
                      </div>
                      {generatedExercise.subject && (
                        <div className="mt-4 text-sm text-blue-600 font-semibold">Subject: {generatedExercise.subject}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'record' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Voice Input</h2>
              <div className="text-center py-12">
                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all ${
                  isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200'
                }`}>
                  <Mic className={`w-12 h-12 ${isRecording ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {isRecording ? 'Recording... Speak clearly!' : 'Record Words or Sentences'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isRecording 
                    ? 'Listening to your voice and converting to text...' 
                    : 'Speak clearly and the app will convert your speech to text for creating exercises'
                  }
                </p>
                <button
                  onClick={handleVoiceRecording}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                
                {extractedText && !isRecording && (
                  <div className="mt-6 p-4 bg-green-50 rounded-2xl border-2 border-green-200 max-w-md mx-auto">
                    <h4 className="font-bold text-green-800 mb-2">Voice Recognized:</h4>
                    <p className="text-green-700">{extractedText}</p>
                    <button
                      onClick={() => setSelectedTab('create')}
                      className="mt-3 bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
                    >
                      Create Exercise
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'school' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">School Details & Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">School Name</label>
                  <input
                    type="text"
                    value={schoolForm.school_name}
                    onChange={(e) => handleSchoolDetailsChange('school_name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                    placeholder="Enter school name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={schoolForm.city}
                    onChange={(e) => handleSchoolDetailsChange('city', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={schoolForm.state}
                    onChange={(e) => handleSchoolDetailsChange('state', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Syllabus</label>
                  <select
                    value={schoolForm.syllabus}
                    onChange={(e) => handleSchoolDetailsChange('syllabus', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">International Baccalaureate</option>
                    <option value="Cambridge">Cambridge</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">School Address</label>
                <textarea
                  value={schoolForm.address}
                  onChange={(e) => handleSchoolDetailsChange('address', e.target.value)}
                  className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
                  placeholder="Enter complete school address"
                />
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-2">✅ Profile Benefits</h3>
                <ul className="text-green-700 space-y-1">
                  <li>• Syllabus-specific exercise generation</li>
                  <li>• Localized content and examples</li>
                  <li>• School-appropriate difficulty levels</li>
                  <li>• Custom templates for your curriculum</li>
                </ul>
              </div>
              
              <button 
                onClick={handleSaveSchoolDetails}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Save School Details
              </button>
            </div>
          )}

          {selectedTab === 'templates' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Template Generator</h2>
              <LLMTemplateGenerator onTemplateGenerated={(template) => {
                setGeneratedExercise(template);
                setSelectedTab('create');
              }} />
            </div>
          )}

          {selectedTab === 'manage' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Exercises</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <h3 className="font-bold text-gray-800 mb-2">{exercise.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{exercise.exercise_type}</p>
                    <p className="text-xs text-gray-500 mb-1">Subject: {exercise.subject}</p>
                    <p className="text-xs text-gray-500 mb-4">Grade: {exercise.grade_level}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </button>
                      <button 
                        onClick={handlePrint}
                        className="flex-1 bg-green-500 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
                      >
                        <Printer className="w-4 h-4 inline mr-1" />
                        Print
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}