'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Page = 'dashboard' | 'skills' | 'courses' | 'roadmaps' | 'analysis' | 'profile' | 'settings';
type AnalysisTimeframe = 'week' | 'month' | 'year';

interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  category: string;
  color: string;
}

interface Course {
  continueUrl: any;
  id: string;
  title: string;
  progress: number;
  xpReward: number;
  thumbnail: string;
  category: string;
  lessons: number;
  completedLessons: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface RoadmapStep {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
  description: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'achievement' | 'levelup' | 'course' | 'info';
  read: boolean;
}

// ============================================================================
// CUSTOM TOOLTIP COMPONENT FOR CHARTS
// ============================================================================

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #667eea',
          borderRadius: '8px',
          padding: '12px',
          color: '#fff',
        }}
      >
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: '4px 0', fontSize: '12px', color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SkillProgressDashboard() {
  // State Management
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [streak, setStreak] = useState(0);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [analysisTimeframe, setAnalysisTimeframe] = useState<AnalysisTimeframe>('week');

  // ============================================================================
  // LOAD STATIC DATA ON MOUNT
  // ============================================================================

  useEffect(() => {
    // Set static user stats
    setUserXP(2847);
    setUserLevel(12);
    setStreak(7);

    // Set static skills
    setSkills([
      { id: '1', name: 'React', level: 8, xp: 750, maxXp: 1000, category: 'Frontend', color: '#61dafb' },
      { id: '2', name: 'TypeScript', level: 7, xp: 600, maxXp: 1000, category: 'Languages', color: '#3178c6' },
      { id: '3', name: 'Node.js', level: 6, xp: 450, maxXp: 1000, category: 'Backend', color: '#339933' },
      { id: '4', name: 'Python', level: 9, xp: 850, maxXp: 1000, category: 'Languages', color: '#3776ab' },
      { id: '5', name: 'Docker', level: 5, xp: 300, maxXp: 1000, category: 'DevOps', color: '#2496ed' },
      { id: '6', name: 'AWS', level: 4, xp: 200, maxXp: 1000, category: 'Cloud', color: '#ff9900' },
    ]);

    // Set static courses
setCourses([
  {
    id: '1',
    title: 'React Mastery: Advanced Patterns',
    progress: 78,
    xpReward: 500,
    thumbnail: '🎯',
    category: 'Frontend',
    lessons: 45,
    completedLessons: 35,
    continueUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' 
  },
  {
    id: '2',
    title: 'TypeScript Deep Dive',
    progress: 45,
    xpReward: 450,
    thumbnail: '📘',
    category: 'Languages',
    lessons: 30,
    completedLessons: 14,
    continueUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs' 
  },
  {
    id: '3',
    title: 'System Design Fundamentals',
    progress: 92,
    xpReward: 800,
    thumbnail: '🏗️',
    category: 'Architecture',
    lessons: 25,
    completedLessons: 23,
    continueUrl: 'https://youtu.be/43-X22tdxiI?si=h3WmXVk4uYA2f-8a'
  },
  {
    id: '4',
    title: 'Docker & Kubernetes',
    progress: 30,
    xpReward: 600,
    thumbnail: '🐳',
    category: 'DevOps',
    lessons: 40,
    completedLessons: 12,
    continueUrl: 'https://www.youtube.com/watch?v=Gjnup-PuquQ' 
  },
]);
    // Set static achievements
    setAchievements([
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first course',
        icon: '🎓',
        unlockedAt: '2025-09-15',
        rarity: 'common',
      },
      {
        id: '2',
        title: 'Streak Master',
        description: '7-day learning streak',
        icon: '🔥',
        unlockedAt: '2025-10-01',
        rarity: 'rare',
      },
      {
        id: '3',
        title: 'Code Warrior',
        description: 'Reach level 10',
        icon: '⚔️',
        unlockedAt: '2025-10-05',
        rarity: 'epic',
      },
      {
        id: '4',
        title: 'Knowledge Seeker',
        description: 'Complete 5 courses',
        icon: '📚',
        unlockedAt: '2025-10-08',
        rarity: 'legendary',
      },
    ]);

    // Set static roadmap steps
    setRoadmapSteps([
      { id: '1', title: 'Master React Hooks', completed: true, xp: 100, description: 'Learn all React hooks' },
      { id: '2', title: 'Build 3 Projects', completed: true, xp: 150, description: 'Apply your skills' },
      { id: '3', title: 'Learn State Management', completed: true, xp: 120, description: 'Redux & Context API' },
      { id: '4', title: 'Advanced TypeScript', completed: false, xp: 180, description: 'Generics & Utility Types' },
      { id: '5', title: 'Testing & TDD', completed: false, xp: 200, description: 'Jest & React Testing Library' },
      { id: '6', title: 'Performance Optimization', completed: false, xp: 220, description: 'Optimize React apps' },
    ]);

    // Set static notifications
    setNotifications([
      { id: '1', message: 'New achievement unlocked!', type: 'achievement', read: false },
      { id: '2', message: 'Course "React Mastery" 80% complete', type: 'course', read: false },
    ]);

    console.log('✅ Static dashboard data loaded');
  }, []);

  // Calculate roadmap completion percentage
  const roadmapCompletion = roadmapSteps.length > 0
    ? Math.round((roadmapSteps.filter((s) => s.completed).length / roadmapSteps.length) * 100)
    : 0;

  // XP needed for next level
  const xpForNextLevel = userLevel * 300;
  const currentLevelXP = userXP % 300;

  // Confetti effect trigger
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // ============================================================================
  // ANALYSIS DATA PREPARATION
  // ============================================================================

  const skillsByCategory = skills.reduce((acc, skill) => {
    const existing = acc.find((item) => item.category === skill.category);
    if (existing) {
      existing.level += skill.level;
    } else {
      acc.push({ category: skill.category, level: skill.level });
    }
    return acc;
  }, [] as Array<{ category: string; level: number }>);

  const skillProficiencyData = skills.map((skill) => ({
    name: skill.name,
    level: skill.level,
  }));

  const achievementRarityData = [
    {
      name: 'Common',
      value: achievements.filter((a) => a.rarity === 'common').length,
      color: '#888888',
    },
    {
      name: 'Rare',
      value: achievements.filter((a) => a.rarity === 'rare').length,
      color: '#4facfe',
    },
    {
      name: 'Epic',
      value: achievements.filter((a) => a.rarity === 'epic').length,
      color: '#764ba2',
    },
    {
      name: 'Legendary',
      value: achievements.filter((a) => a.rarity === 'legendary').length,
      color: '#f093fb',
    },
  ].filter((item) => item.value > 0);

  const xpProgressionData = [
    { day: 'Mon', xp: 240 },
    { day: 'Tue', xp: 380 },
    { day: 'Wed', xp: 320 },
    { day: 'Thu', xp: 490 },
    { day: 'Fri', xp: 410 },
    { day: 'Sat', xp: 520 },
    { day: 'Sun', xp: 450 },
  ];

  // ============================================================================
  // HANDLE SKILL UPDATE (LOCAL STATE ONLY)
  // ============================================================================

  const updateSkill = (skillId: string, xpGain: number) => {
    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id === skillId) {
          const newXp = skill.xp + xpGain;
          const leveledUp = newXp >= skill.maxXp;
          return {
            ...skill,
            xp: leveledUp ? newXp - skill.maxXp : newXp,
            level: leveledUp ? skill.level + 1 : skill.level,
          };
        }
        return skill;
      })
    );

    setUserXP((prev) => prev + xpGain);
    console.log(`✅ Skill ${skillId} practiced: +${xpGain} XP`);
  };

  // ============================================================================
  // HANDLE ROADMAP STEP COMPLETION (LOCAL STATE ONLY)
  // ============================================================================

  const completeRoadmapStep = (stepId: string) => {
    const step = roadmapSteps.find((s) => s.id === stepId);
    if (step && !step.completed) {
      setRoadmapSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, completed: true } : s))
      );
      setUserXP((prev) => prev + step.xp);
      setShowConfetti(true);
      setShowLevelUp(true);
      setTimeout(() => {
        setShowConfetti(false);
        setShowLevelUp(false);
      }, 2500);
      console.log(`✅ Roadmap step completed: ${step.title} (+${step.xp} XP)`);
    }
  };

  // ============================================================================
  // STYLES (UNCHANGED)
  // ============================================================================

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    sidebar: {
      width: sidebarCollapsed ? '80px' : '260px',
      backgroundColor: '#111111',
      borderRight: '1px solid #1a1a1a',
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      zIndex: 100,
      boxShadow: '2px 0 10px rgba(0,0,0,0.5)',
    },
    sidebarHeader: {
      padding: '24px 20px',
      borderBottom: '1px solid #1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    navItem: {
      padding: '16px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease',
      borderLeft: '3px solid transparent',
    },
    navItemActive: {
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderLeftColor: '#667eea',
    },
    mainContent: {
      marginLeft: sidebarCollapsed ? '80px' : '260px',
      flex: 1,
      transition: 'margin-left 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
    },
    navbar: {
      backgroundColor: '#111111',
      borderBottom: '1px solid #1a1a1a',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
    searchBar: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '12px 20px',
      width: '400px',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    content: {
      padding: '32px',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
    },
    card: {
      backgroundColor: '#111111',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #1a1a1a',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    },
    progressBar: {
      height: '8px',
      backgroundColor: '#1a1a1a',
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      borderRadius: '4px',
      transition: 'width 0.5s ease',
    },
    button: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    badge: {
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px',
      marginTop: '24px',
    },
  };

  // ============================================================================
  // COMPONENTS (ALL UNCHANGED)
  // ============================================================================

  // Confetti Animation Component
  const ConfettiEffect = () => {
    if (!showConfetti) return null;
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '-10px',
              left: `${Math.random() * 100}%`,
              width: '10px',
              height: '10px',
              backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe'][Math.floor(Math.random() * 4)],
              animation: `fall ${2 + Math.random() * 2}s linear`,
              opacity: 0,
            }}
          />
        ))}
        <style>
          {`
            @keyframes fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
          `}
        </style>
      </div>
    );
  };

  // Level Up Popup Component
  const LevelUpPopup = () => {
    if (!showLevelUp) return null;
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          backgroundColor: '#111111',
          border: '2px solid #667eea',
          borderRadius: '24px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.5)',
          animation: 'levelUpBounce 0.6s ease-out',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2
          style={{
            fontSize: '32px',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Milestone Complete!
        </h2>
        <p style={{ fontSize: '18px', color: '#888' }}>You've earned XP and unlocked new achievements!</p>
        <style>
          {`
            @keyframes levelUpBounce {
              0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
              50% { transform: translate(-50%, -50%) scale(1.1); }
              100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  };

  // Sidebar Component
  const Sidebar = () => {
    const navItems: { id: Page; label: string; icon: string }[] = [
      { id: 'dashboard', label: 'Dashboard', icon: '' },
      { id: 'skills', label: 'Skill Tracker', icon: '' },
      { id: 'courses', label: 'Courses', icon: '' },
      { id: 'roadmaps', label: 'Roadmaps', icon: '' },
      { id: 'analysis', label: 'Analysis', icon: '' },
      { id: 'profile', label: 'Profile', icon: '' },
      { id: 'settings', label: 'Settings', icon: '' },
    ];

    return (
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/logo1.svg"
              alt="App Logo"
              style={{ width: '32px', height: '32px', borderRadius: '8px' }}
            />
            <div style={styles.logo}>{sidebarCollapsed ? 'SP' : 'Elevate'}</div>
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px',
            }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav style={{ flex: 1, paddingTop: '20px' }}>
          {navItems.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.navItem,
                ...(currentPage === item.id ? styles.navItemActive : {}),
              }}
              onClick={() => setCurrentPage(item.id)}
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!sidebarCollapsed && (
                <span style={{ fontSize: '14px', fontWeight: currentPage === item.id ? '600' : '400' }}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    );
  };

  // Navbar Component
  const Navbar = () => {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
      <div style={styles.navbar}>
        <input
          type="text"
          placeholder="Search courses, skills, roadmaps..."
          style={styles.searchBar}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#667eea';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#2a2a2a';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '24px',
                position: 'relative',
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#f093fb',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  backgroundColor: '#111111',
                  border: '1px solid #1a1a1a',
                  borderRadius: '12px',
                  width: '320px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  zIndex: 1000,
                }}
              >
                <div style={{ padding: '16px', borderBottom: '1px solid #1a1a1a', fontWeight: '600' }}>
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '16px', color: '#888', textAlign: 'center' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid #1a1a1a',
                        backgroundColor: notif.read ? 'transparent' : 'rgba(102, 126, 234, 0.05)',
                      }}
                    >
                      <p style={{ fontSize: '14px', margin: 0 }}>{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            S
          </div>
        </div>
      </div>
    );
  };

  // Dashboard View Component
  const DashboardView = () => {
    return (
      <div>
        {/* Header Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* XP Card */}
          <div style={{ ...styles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Total XP</p>
                <h2
                  style={{
                    fontSize: '36px',
                    margin: '8px 0',
                    background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {userXP.toLocaleString()}
                </h2>
              </div>
              <div style={{ fontSize: '48px' }}>⚡</div>
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${(currentLevelXP / 300) * 100}%` }} />
            </div>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              {300 - currentLevelXP} XP to Level {userLevel + 1}
            </p>
          </div>

          {/* Level Card */}
          <div style={{ ...styles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Current Level</p>
                <h2 style={{ fontSize: '36px', margin: '8px 0', color: '#4facfe' }}>{userLevel}</h2>
              </div>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '4px solid #4facfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  background: 'radial-gradient(circle, rgba(79,172,254,0.1) 0%, transparent 70%)',
                }}
              >
                🏆
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div style={{ ...styles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Learning Streak</p>
                <h2 style={{ fontSize: '36px', margin: '8px 0', color: '#ff6b6b' }}>{streak} Days</h2>
              </div>
              <div style={{ fontSize: '48px' }}>🔥</div>
            </div>
            <p style={{ fontSize: '12px', color: '#888' }}>Keep it up! Don't break the chain</p>
          </div>
        </div>

        {/* Roadmap Progress */}
        <div style={{ ...styles.card, marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🗺️</span> Roadmap Progress
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1, ...styles.progressBar, height: '12px' }}>
              <div style={{ ...styles.progressFill, width: `${roadmapCompletion}%` }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>{roadmapCompletion}%</span>
          </div>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '12px' }}>
            {roadmapSteps.filter((s) => s.completed).length} of {roadmapSteps.length} milestones completed
          </p>
        </div>

        {/* Recent Achievements */}
        <div style={{ ...styles.card, marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏅</span> Recent Achievements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {achievements.slice(0, 4).map((achievement) => {
              const rarityColors = {
                common: '#888888',
                rare: '#4facfe',
                epic: '#764ba2',
                legendary: '#f093fb',
              };
              return (
                <div
                  key={achievement.id}
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: `2px solid ${rarityColors[achievement.rarity]}`,
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>{achievement.icon}</div>
                  <h4 style={{ fontSize: '14px', margin: '0 0 4px 0' }}>{achievement.title}</h4>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{achievement.description}</p>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: `${rarityColors[achievement.rarity]}20`,
                      color: rarityColors[achievement.rarity],
                      marginTop: '8px',
                    }}
                  >
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Courses */}
        <div style={{ ...styles.card }}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📚</span> Active Courses
          </h3>
          <div style={styles.grid}>
            {courses.map((course) => (
              <div
                key={course.id}
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px',
                  padding: '20px',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{course.thumbnail}</div>
                <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>{course.title}</h4>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                  {course.completedLessons}/{course.lessons} lessons
                </p>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${course.progress}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#888' }}>{course.progress}%</span>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      color: '#667eea',
                    }}
                  >
                    +{course.xpReward} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Skill Tracker View Component
  const SkillTrackerView = () => {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', margin: 0 }}>Skill Tracker</h2>
          <button
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            + Add New Skill
          </button>
        </div>

        <div style={styles.grid}>
          {skills.map((skill) => (
            <div key={skill.id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>{skill.name}</h4>
                  <span style={{ ...styles.badge, backgroundColor: '#1a1a1a', color: '#888' }}>
                    {skill.category}
                  </span>
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: `4px solid ${skill.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: skill.color,
                  }}
                >
                  {skill.level}
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>Progress to Level {skill.level + 1}</span>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {skill.xp}/{skill.maxXp} XP
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: skill.color,
                      width: `${(skill.xp / skill.maxXp) * 100}%`,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => updateSkill(skill.id, 50)}
                style={{
                  ...styles.button,
                  width: '100%',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${skill.color}`,
                  color: skill.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${skill.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a1a1a';
                }}
              >
                Practice (+50 XP)
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Courses View Component
const CoursesView = () => {
  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>All Courses</h2>
      <div style={styles.grid}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              ...styles.card,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
            }}
          >
            <div style={{ fontSize: '64px', textAlign: 'center', marginBottom: '16px' }}>{course.thumbnail}</div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{course.title}</h3>
            <span
              style={{
                ...styles.badge,
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                marginBottom: '16px',
              }}
            >
              {course.category}
            </span>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '12px', marginBottom: '16px' }}>
              {course.completedLessons} of {course.lessons} lessons completed
            </p>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${course.progress}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#667eea' }}>{course.progress}%</span>
              <span style={{ ...styles.badge, backgroundColor: 'rgba(240, 147, 251, 0.2)', color: '#f093fb' }}>
                +{course.xpReward} XP
              </span>
            </div>
            <button
              style={{ ...styles.button, width: '100%', marginTop: '16px' }}
              onClick={(e) => {
                // prevent card-level handlers from interfering
                e.stopPropagation();
                // open the course-specific URL (ensure each course object has a continueUrl property)
                const url = course.continueUrl ;
                window.open(url, '_blank');
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

  // Roadmaps View Component
  const RoadmapsView = () => {
    return (
      <div>
        <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Learning Roadmap</h2>
        <div style={{ ...styles.card, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            {roadmapSteps.map((step, index) => (
              <div key={step.id} style={{ position: 'relative', marginBottom: '32px' }}>
                {/* Timeline Line */}
                {index < roadmapSteps.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '-27px',
                      top: '40px',
                      width: '2px',
                      height: '60px',
                      backgroundColor: step.completed ? '#667eea' : '#2a2a2a',
                    }}
                  />
                )}
                {/* Timeline Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-40px',
                    top: '12px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: step.completed ? '#667eea' : '#1a1a1a',
                    border: `3px solid ${step.completed ? '#667eea' : '#2a2a2a'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                  }}
                >
                  {step.completed && '✓'}
                </div>
                {/* Step Content */}
                <div
                  style={{
                    backgroundColor: step.completed ? 'rgba(102, 126, 234, 0.1)' : '#1a1a1a',
                    padding: '20px',
                    borderRadius: '12px',
                    border: `1px solid ${step.completed ? '#667eea' : '#2a2a2a'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '18px', margin: 0 }}>{step.title}</h4>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: 'rgba(240, 147, 251, 0.2)',
                        color: '#f093fb',
                      }}
                    >
                      +{step.xp} XP
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>{step.description}</p>
                  {!step.completed && (
                    <button
                      onClick={() => completeRoadmapStep(step.id)}
                      style={{
                        ...styles.button,
                        backgroundColor: '#667eea',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#764ba2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#667eea';
                      }}
                    >
                      Mark as Complete
                    </button>
                  )}
                  {step.completed && (
                    <span style={{ ...styles.badge, backgroundColor: 'rgba(102, 126, 234, 0.2)', color: '#667eea' }}>
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Analysis View Component (NEW)
  const AnalysisView = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.5s ease' }}>
        {/* Header with Timeframe Selection */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '28px', margin: 0 }}>Skill Analysis Dashboard</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            {(['week', 'month', 'year'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setAnalysisTimeframe(tf)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)',
                  cursor: 'pointer',
                  backgroundColor:
                    analysisTimeframe === tf
                      ? '#667eea'
                      : '#1a1a1a',
                  color:
                    analysisTimeframe === tf
                      ? '#ffffff'
                      : '#888',
                  boxShadow:
                    analysisTimeframe === tf
                      ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                      : 'none',
                  border: analysisTimeframe === tf ? 'none' : '1px solid #2a2a2a',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Skills by Category - Bar Chart */}
        <div
          style={{
            ...styles.card,
            border: '1px solid #1a1a1a',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#667eea';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1a1a1a';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
          }}
        >
          <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📊</span> Skills by Category
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={skillsByCategory} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="category" stroke="#9CA3AF" style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="level" fill="url(#barGradient)" name="Level" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
          {/* Skill Proficiency Radar */}
          <div
            style={{
              ...styles.card,
              border: '1px solid #1a1a1a',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1a1a1a';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
            }}
          >
            <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎯</span> Skill Proficiency Radar
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={skillProficiencyData}>
                <defs>
                  <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f093fb" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '11px' }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#9CA3AF" style={{ fontSize: '11px' }} />
                <Radar
                  name="Level"
                  dataKey="level"
                  stroke="url(#radarGradient)"
                  fill="url(#radarGradient)"
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Achievement Rarity Distribution */}
          <div
            style={{
              ...styles.card,
              border: '1px solid #1a1a1a',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1a1a1a';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
            }}
          >
            <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏆</span> Achievement Distribution
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={achievementRarityData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {achievementRarityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Progression - Area Chart */}
        <div
          style={{
            ...styles.card,
            border: '1px solid #1a1a1a',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#667eea';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1a1a1a';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
          }}
        >
          <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📈</span> Weekly XP Progression
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={xpProgressionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#667eea"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorXp)"
                name="XP Earned"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  };

  // Profile View Component
  const ProfileView = () => {
    return (
      <div>
        <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Profile</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ ...styles.card, textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                margin: '0 auto 24px',
              }}
            >
              SD
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Sahil Raj Dubey</h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>@sahilrajdubey</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
              <div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#667eea' }}>{userLevel}</p>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Level</p>
              </div>
              <div style={{ width: '1px', backgroundColor: '#2a2a2a' }} />
                            <div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#764ba2' }}>
                  {userXP.toLocaleString()}
                </p>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Total XP</p>
              </div>
              <div style={{ width: '1px', backgroundColor: '#2a2a2a' }} />
              <div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#f093fb' }}>
                  {achievements.length}
                </p>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Achievements</p>
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, marginBottom: '32px' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>All Achievements</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {achievements.map((achievement) => {
                const rarityColors = {
                  common: '#888888',
                  rare: '#4facfe',
                  epic: '#764ba2',
                  legendary: '#f093fb',
                };
                return (
                  <div
                    key={achievement.id}
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      border: `2px solid ${rarityColors[achievement.rarity]}`,
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>{achievement.icon}</div>
                    <h5 style={{ fontSize: '14px', margin: '0 0 4px 0' }}>{achievement.title}</h5>
                    <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>{achievement.description}</p>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: `${rarityColors[achievement.rarity]}20`,
                        color: rarityColors[achievement.rarity],
                      }}
                    >
                      {achievement.rarity.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings View Component
  const SettingsView = () => {
    return (
      <div>
        <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Settings</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Account Settings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#888', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value="sahilrajdubey@gmail.com"
                  style={{ ...styles.searchBar, width: '100%' }}
                  readOnly
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#888', marginBottom: '8px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value="sahilrajdubey"
                  style={{ ...styles.searchBar, width: '100%' }}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Notifications</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['Achievement unlocked', 'Level up', 'Course completed', 'Daily reminders'].map((item) => (
                <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>{item}</span>
                  <div
                    style={{
                      width: '48px',
                      height: '24px',
                      backgroundColor: '#667eea',
                      borderRadius: '12px',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Appearance</h4>
            <p style={{ fontSize: '14px', color: '#888' }}>Dark mode is currently enabled</p>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER CURRENT PAGE
  // ============================================================================

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView />;
      case 'skills':
        return <SkillTrackerView />;
      case 'courses':
        return <CoursesView />;
      case 'roadmaps':
        return <RoadmapsView />;
      case 'analysis':
        return <AnalysisView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Navbar />
        <div style={styles.content}>{renderPage()}</div>
      </div>
      <ConfettiEffect />
      <LevelUpPopup />
    </div>
  );
}