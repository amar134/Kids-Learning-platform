import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useStudentData } from './hooks/useStudentData';
import { Dashboard } from './components/Dashboard';
import { MathZone } from './components/MathZone';
import { EnglishZone } from './components/EnglishZone';
import { EVSZone } from './components/EVSZone';
import { GamesZone } from './components/GamesZone';
import { ParentDashboard } from './components/ParentDashboard';
import { ProgressTracker } from './components/ProgressTracker';
import { RewardSystem } from './components/RewardSystem';
import { AuthModal } from './components/AuthModal';

export type Grade = 1 | 2 | 3 | 4 | 5;
export type Subject = 'math' | 'english' | 'evs' | 'games' | 'parent' | 'progress';

function App() {
  const { user, profile, loading: authLoading } = useAuth();
  const { stats, addPoints, addBadge } = useStudentData();
  
  const [currentView, setCurrentView] = useState<Subject>('dashboard' as any);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(profile?.grade_level || 1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (currentView === 'dashboard' || !currentView) {
    return (
      <>
        <Dashboard
          onSelectSubject={setCurrentView}
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
          studentName={profile?.full_name || ''}
          onSetStudentName={() => {}} // This will be handled by profile updates
          totalPoints={stats?.total_points || 0}
          badges={stats?.badges || []}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          isLoggedIn={!!user}
          userProfile={profile}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <RewardSystem
        totalPoints={stats?.total_points || 0}
        badges={stats?.badges || []}
        onBackHome={() => setCurrentView('dashboard' as any)}
      />
      
      {currentView === 'math' && (
        <MathZone 
          grade={selectedGrade} 
          onAddPoints={(points) => addPoints(points)}
          onAddBadge={addBadge}
          onBack={() => setCurrentView('dashboard' as any)}
        />
      )}
      
      {currentView === 'english' && (
        <EnglishZone 
          grade={selectedGrade} 
          onAddPoints={(points) => addPoints(points)}
          onAddBadge={addBadge}
          onBack={() => setCurrentView('dashboard' as any)}
        />
      )}
      
      {currentView === 'evs' && (
        <EVSZone 
          grade={selectedGrade} 
         onAddPoints={(points) => addPoints(points)}
          onAddBadge={addBadge}
          onBack={() => setCurrentView('dashboard' as any)}
        />
      )}
      
      {currentView === 'games' && (
        <GamesZone 
          grade={selectedGrade} 
        onAddPoints={(points) => addPoints(points)}
          onAddBadge={addBadge}
          onBack={() => setCurrentView('dashboard' as any)}
        />
      )}
      
      {currentView === 'parent' && (
        <ParentDashboard 
          onBack={() => setCurrentView('dashboard' as any)}
        />
      )}
      
      {currentView === 'progress' && (
        <ProgressTracker 
          studentName={studentName}
          totalPoints={totalPoints}
          badges={badges}
          onBack={() => setCurrentView('dashboard' as any)}
        />
      )}
    </div>
  );
}

export default App;