import React, { useState } from 'react';
import { ArrowLeft, Upload, Mic, Download, Share, Camera, FileText, Wand2, Printer, Eye, Users, BookOpen } from 'lucide-react';
import { QuestionGenerator } from './QuestionGenerator';

interface ParentDashboardProps {
  onBack: () => void;
}

export function ParentDashboard({ onBack }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'generator' | 'resources'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'generator'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Wand2 className="w-5 h-5" />
                <span>Question Generator</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Resources</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Student Progress</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Track your child's learning journey across all subjects.</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Custom Exercises</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Create personalized learning materials for your child.</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Share className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Share & Export</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Export progress reports and share achievements.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <Upload className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium">Upload Content</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <Download className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium">Download Reports</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <Camera className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium">Take Photo</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <Printer className="w-6 h-6 text-orange-600" />
                    <span className="text-sm font-medium">Print Materials</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'generator' && (
            <QuestionGenerator />
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Curriculum Guides</h3>
                  <p className="text-gray-600 text-sm mb-4">Grade-specific learning objectives and milestones.</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Guides →
                  </button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Activity Templates</h3>
                  <p className="text-gray-600 text-sm mb-4">Ready-to-use worksheets and activities.</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Browse Templates →
                  </button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Assessment Tools</h3>
                  <p className="text-gray-600 text-sm mb-4">Tools to evaluate your child's progress.</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Access Tools →
                  </button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Parent Tips</h3>
                  <p className="text-gray-600 text-sm mb-4">Expert advice on supporting your child's learning.</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Read Tips →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}