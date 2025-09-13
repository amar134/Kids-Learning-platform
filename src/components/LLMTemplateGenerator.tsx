import React, { useState } from 'react';
import { Wand2, Download, Eye, Sparkles, BookOpen, Calculator, Leaf, Gamepad2 } from 'lucide-react';

interface LLMTemplateGeneratorProps {
  onTemplateGenerated: (template: any) => void;
}

export function LLMTemplateGenerator({ onTemplateGenerated }: LLMTemplateGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const [grade, setGrade] = useState(1);

  const templateTypes = [
    {
      id: 'math-worksheet',
      title: 'Math Worksheet',
      icon: Calculator,
      description: 'Generate math problems with step-by-step solutions',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'reading-comprehension',
      title: 'Reading Comprehension',
      icon: BookOpen,
      description: 'Create stories with questions and vocabulary',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'science-experiment',
      title: 'Science Activity',
      icon: Leaf,
      description: 'Design hands-on science experiments',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'interactive-game',
      title: 'Learning Game',
      icon: Gamepad2,
      description: 'Create educational games and puzzles',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const generateTemplate = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate LLM API call
    setTimeout(() => {
      let template = null;
      
      if (selectedTemplate === 'math-worksheet') {
        template = {
          type: 'Math Worksheet',
          title: `Grade ${grade} Math Practice`,
          instructions: 'Solve the following problems. Show your work!',
          problems: [
            {
              question: '15 + 23 = ?',
              solution: '15 + 23 = 38',
              hint: 'Add the ones place first: 5 + 3 = 8, then tens place: 1 + 2 = 3'
            },
            {
              question: '47 - 19 = ?',
              solution: '47 - 19 = 28',
              hint: 'Borrow from tens place: 17 - 9 = 8, then 3 - 1 = 2'
            },
            {
              question: '6 × 4 = ?',
              solution: '6 × 4 = 24',
              hint: 'Think of it as 6 groups of 4: 4 + 4 + 4 + 4 + 4 + 4 = 24'
            }
          ],
          answerKey: true,
          difficulty: grade <= 2 ? 'Easy' : grade <= 4 ? 'Medium' : 'Hard'
        };
      } else if (selectedTemplate === 'reading-comprehension') {
        template = {
          type: 'Reading Comprehension',
          title: `Grade ${grade} Reading Adventure`,
          story: `The Little Garden

Once upon a time, there was a little girl named Maya who loved plants. She decided to start her own garden in the backyard. Maya planted seeds for tomatoes, carrots, and sunflowers.

Every day, Maya watered her plants and talked to them. "Grow big and strong!" she would say. After many weeks, tiny green shoots appeared. Maya was so excited!

The tomatoes grew red and juicy. The carrots grew orange and crunchy. The sunflowers grew tall and bright yellow. Maya shared her vegetables with her family and neighbors.

"Gardening teaches us patience and care," said Maya's grandmother. Maya smiled and planned an even bigger garden for next year.`,
          questions: [
            {
              question: 'What did Maya plant in her garden?',
              answer: 'Tomatoes, carrots, and sunflowers',
              type: 'comprehension'
            },
            {
              question: 'What did Maya do every day?',
              answer: 'Watered her plants and talked to them',
              type: 'detail'
            },
            {
              question: 'What lesson did Maya learn about gardening?',
              answer: 'Gardening teaches patience and care',
              type: 'inference'
            }
          ],
          vocabulary: [
            { word: 'shoots', meaning: 'new plant growth' },
            { word: 'patience', meaning: 'waiting calmly' },
            { word: 'neighbors', meaning: 'people who live nearby' }
          ]
        };
      } else if (selectedTemplate === 'science-experiment') {
        template = {
          type: 'Science Experiment',
          title: 'Rainbow in a Glass',
          objective: 'Learn about density and liquid layers',
          materials: [
            'Honey',
            'Dish soap',
            'Water with food coloring',
            'Vegetable oil',
            'Tall clear glass'
          ],
          steps: [
            'Pour honey into the bottom of the glass',
            'Slowly pour dish soap over a spoon to create the next layer',
            'Add colored water very slowly',
            'Finally, add vegetable oil on top',
            'Observe the different layers!'
          ],
          explanation: 'Different liquids have different densities. Heavier liquids sink below lighter ones, creating beautiful layers!',
          questions: [
            'Which liquid is the heaviest?',
            'Why don\'t the liquids mix?',
            'What would happen if we stirred the glass?'
          ],
          safetyNotes: 'Adult supervision required. Do not drink the mixture.'
        };
      } else if (selectedTemplate === 'interactive-game') {
        template = {
          type: 'Learning Game',
          title: 'Animal Habitat Match',
          gameType: 'Matching Game',
          instructions: 'Match each animal with its correct habitat!',
          pairs: [
            { animal: 'Fish', habitat: 'Ocean', fact: 'Fish breathe through gills underwater' },
            { animal: 'Bird', habitat: 'Tree', fact: 'Birds build nests in trees for safety' },
            { animal: 'Bear', habitat: 'Forest', fact: 'Bears hibernate in caves during winter' },
            { animal: 'Camel', habitat: 'Desert', fact: 'Camels store water in their humps' }
          ],
          scoring: 'Get 10 points for each correct match!',
          extension: 'Draw your favorite animal in its habitat and write one fact about it.'
        };
      }
      
      // Add custom prompt modifications
      if (customPrompt) {
        template.customization = customPrompt;
        template.title += ' (Customized)';
      }
      
      setGeneratedTemplate(template);
      setIsGenerating(false);
      onTemplateGenerated(template);
    }, 3000);
  };

  const downloadTemplate = () => {
    if (!generatedTemplate) return;
    
    const templateContent = JSON.stringify(generatedTemplate, null, 2);
    const blob = new Blob([templateContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedTemplate.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold text-gray-800">AI Template Generator</h2>
        </div>
        <p className="text-gray-600">Create custom learning templates with AI assistance</p>
      </div>

      {/* Grade Selection */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-3">Grade Level</label>
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

      {/* Template Types */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-3">Choose Template Type</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templateTypes.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-2xl border-4 transition-all text-left ${
                  selectedTemplate === template.id
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-3">Custom Instructions (Optional)</label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full h-24 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
          placeholder="Add specific requirements, topics, or modifications you want..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Example: "Focus on multiplication tables", "Include space theme", "Add more challenging problems"
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateTemplate}
        disabled={!selectedTemplate || isGenerating}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 mb-6"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white inline mr-3"></div>
            Generating Template...
          </>
        ) : (
          <>
            <Wand2 className="w-6 h-6 inline mr-2" />
            Generate AI Template
          </>
        )}
      </button>

      {/* Generated Template Preview */}
      {generatedTemplate && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-green-800">
              ✨ {generatedTemplate.title} Generated!
            </h3>
            <div className="flex gap-2">
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 max-h-64 overflow-y-auto">
            <h4 className="font-bold text-gray-800 mb-2">{generatedTemplate.type}</h4>
            <p className="text-gray-600 mb-3">{generatedTemplate.instructions || generatedTemplate.objective}</p>
            
            {generatedTemplate.problems && (
              <div className="mb-3">
                <h5 className="font-semibold text-gray-700 mb-1">Sample Problems:</h5>
                {generatedTemplate.problems.slice(0, 2).map((problem: any, i: number) => (
                  <div key={i} className="text-sm text-gray-600 mb-1">
                    • {problem.question}
                  </div>
                ))}
              </div>
            )}
            
            {generatedTemplate.story && (
              <div className="mb-3">
                <h5 className="font-semibold text-gray-700 mb-1">Story Preview:</h5>
                <p className="text-sm text-gray-600">{generatedTemplate.story.substring(0, 150)}...</p>
              </div>
            )}
            
            {generatedTemplate.materials && (
              <div className="mb-3">
                <h5 className="font-semibold text-gray-700 mb-1">Materials Needed:</h5>
                <p className="text-sm text-gray-600">{generatedTemplate.materials.slice(0, 3).join(', ')}...</p>
              </div>
            )}
            
            <div className="text-xs text-blue-600 mt-3">
              Difficulty: {generatedTemplate.difficulty || 'Grade Appropriate'} | 
              Type: {generatedTemplate.type}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}