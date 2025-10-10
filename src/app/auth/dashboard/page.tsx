'use client';

import React, { useState, useEffect } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Page = 'dashboard' | 'skills' | 'courses' | 'roadmaps' | 'analysis' | 'profile' | 'settings';

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
// API HELPER FUNCTIONS
// ============================================================================

const API_BASE = 'http://localhost:8000';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();
  return data;
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // LOAD DATA FROM BACKEND ON MOUNT
  // ============================================================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel API calls
      const [statsRes, skillsRes, coursesRes, roadmapsRes, notificationsRes] = await Promise.all([
        apiCall('/api/stats/overview'),
        apiCall('/api/skills'),
        apiCall('/api/courses/user'),
        apiCall('/api/roadmaps'),
        apiCall('/api/notifications'),
      ]);

      // Update state with backend data
      if (statsRes.success) {
        setUserXP(statsRes.data.totalXP || 0);
        setUserLevel(statsRes.data.level || 1);
        setStreak(statsRes.data.current_streak || 0);
        setAchievements(statsRes.data.achievements || []);
      }

      if (skillsRes.success) {
        setSkills(skillsRes.data.skills || []);
      }

      if (coursesRes.success) {
        setCourses(coursesRes.data.courses || []);
      }

      if (roadmapsRes.success && roadmapsRes.data.roadmaps?.length > 0) {
        setRoadmapSteps(roadmapsRes.data.roadmaps[0].steps || []);
      }

      if (notificationsRes.success) {
        setNotifications(notificationsRes.data.notifications || []);
      }

      console.log('✅ Dashboard data loaded from backend');
    } catch (err: any) {
      console.error('❌ Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // INITIALIZE SAMPLE DATA (First Time Setup)
  // ============================================================================

  const initializeSampleData = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/init-sample-data');

      if (response.success) {
        await loadDashboardData();
        alert('✅ Sample data initialized! Dashboard refreshed.');
      } else {
        alert('❌ Failed to initialize: ' + response.message);
      }
    } catch (err: any) {
      console.error('❌ Failed to initialize sample data:', err);
      alert('Failed to initialize data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
  // HANDLE SKILL UPDATE WITH BACKEND
  // ============================================================================

  const updateSkill = async (skillId: string, xpGain: number) => {
    try {
      const response = await apiCall(`/api/skills/${skillId}/practice`, {
        method: 'POST',
        body: JSON.stringify({ xp: xpGain }),
      });

      if (response.success) {
        // Update local state with response
        setSkills((prev) =>
          prev.map((skill) => (skill.id === skillId ? response.data.skill : skill))
        );

        setUserXP(response.data.user.total_xp);
        setUserLevel(response.data.user.level);

        // Show level up animation if applicable
        if (response.data.leveled_up) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 2500);
        }

        // Reload notifications
        const notifRes = await apiCall('/api/notifications');
        if (notifRes.success) {
          setNotifications(notifRes.data.notifications);
        }

        console.log('✅ Skill updated successfully');
      } else {
        alert('Failed to update skill: ' + response.message);
      }
    } catch (err: any) {
      console.error('❌ Failed to update skill:', err);
      alert('Failed to update skill: ' + err.message);
    }
  };

  // ============================================================================
  // HANDLE ROADMAP STEP COMPLETION WITH BACKEND
  // ============================================================================

  const completeRoadmapStep = async (stepId: string) => {
    const step = roadmapSteps.find((s) => s.id === stepId);
    if (!step || step.completed) return;

    try {
      // Get roadmap ID (assuming first roadmap)
      const roadmapsRes = await apiCall('/api/roadmaps');
      const roadmapId = roadmapsRes.data.roadmaps?.[0]?.id;

      if (!roadmapId) {
        throw new Error('Roadmap not found');
      }

      const response = await apiCall(`/api/roadmaps/${roadmapId}/steps/${stepId}/complete`, {
        method: 'PUT',
      });

      if (response.success) {
        // Update local state
        setRoadmapSteps((prev) =>
          prev.map((s) => (s.id === stepId ? { ...s, completed: true } : s))
        );

        setUserXP(response.data.user.total_xp);
        setUserLevel(response.data.user.level);

        // Show success animation
        setShowConfetti(true);
        setShowLevelUp(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowLevelUp(false);
        }, 2500);

        // Reload notifications
        const notifRes = await apiCall('/api/notifications');
        if (notifRes.success) {
          setNotifications(notifRes.data.notifications);
        }

        console.log('✅ Roadmap step completed');
      } else {
        alert('Failed to complete step: ' + response.message);
      }
    } catch (err: any) {
      console.error('❌ Failed to complete roadmap step:', err);
      alert('Failed to complete step: ' + err.message);
    }
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#fff',
          fontSize: '24px',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
        <div>Loading Dashboard...</div>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#fff',
          fontSize: '18px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
        <div style={{ marginBottom: '20px' }}>Error: {error}</div>
        <div style={{ marginBottom: '20px', color: '#888' }}>
          Make sure backend is running at http://localhost:8000
        </div>
        <button
          onClick={loadDashboardData}
          style={{
            backgroundColor: '#667eea',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '10px',
          }}
        >
          🔄 Retry
        </button>
        <button
          onClick={initializeSampleData}
          style={{
            backgroundColor: '#764ba2',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          🚀 Initialize Sample Data
        </button>
      </div>
    );
  }

  // ============================================================================
  // EMPTY STATE
  // ============================================================================

  if (skills.length === 0 && courses.length === 0 && !loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#fff',
          fontSize: '18px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
        <div style={{ marginBottom: '10px', fontSize: '24px' }}>Welcome to SkillProgress!</div>
        <div style={{ marginBottom: '30px', color: '#888' }}>
          Click below to initialize sample data and get started
        </div>
        <button
          onClick={initializeSampleData}
          style={{
            backgroundColor: '#667eea',
            color: '#fff',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          🚀 Initialize Dashboard
        </button>
      </div>
    );
  }

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
  // COMPONENTS (ALL UNCHANGED - JUST USING STATE FROM BACKEND)
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
        <h2 style={{ fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
      { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'skills', label: 'Skill Tracker', icon: '🎯' },
      { id: 'courses', label: 'Courses', icon: '📚' },
      { id: 'roadmaps', label: 'Roadmaps', icon: '🗺️' },
      { id: 'analysis', label: 'Analysis', icon: '📊' },
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>{sidebarCollapsed ? 'SP' : 'SkillProgress'}</div>
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
            SD
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* XP Card */}
          <div style={{ ...styles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Total XP</p>
                <h2 style={{ fontSize: '36px', margin: '8px 0', background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  e.currentTarget.style.transform = 'translateY(-4px)';
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
                  <span style={{ ...styles.badge, backgroundColor: '#1a1a1a', color: '#888' }}>{skill.category}</span>
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

  // Courses View Component (Keep all your existing component code...)
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
              <span style={{ ...styles.badge, backgroundColor: 'rgba(102, 126, 234, 0.2)', color: '#667eea', marginBottom: '16px' }}>
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

  // Analysis View Component
  const AnalysisView = () => {
    const skillsByCategory = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + skill.level;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div>
        <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Skill Analysis</h2>

        {/* Skill Category Chart */}
        <div style={{ ...styles.card, marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Skills by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(skillsByCategory).map(([category, total]) => (
              <div key={category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{category}</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#667eea' }}>Level {total}</span>
                </div>
                <div style={{ ...styles.progressBar, height: '16px' }}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${(total / (skills.length * 10)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Skills Chart */}
        <div style={{ ...styles.card, marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Skill Proficiency Levels</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {skills
              .sort((a, b) => b.level - a.level)
              .map((skill) => (
                <div key={skill.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{skill.name}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: skill.color }}>
                      Level {skill.level}
                    </span>
                  </div>
                  <div style={{ ...styles.progressBar, height: '12px' }}>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: skill.color,
                        width: `${(skill.level / 10) * 100}%`,
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Global Leaderboard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { rank: 1, name: 'Alex Chen', xp: 5420, avatar: '🥇' },
              { rank: 2, name: 'Maria Garcia', xp: 4890, avatar: '🥈' },
              { rank: 3, name: 'Sahil Dubey (You)', xp: userXP, avatar: '🥉' },
              { rank: 4, name: 'John Smith', xp: 2650, avatar: '👤' },
              { rank: 5, name: 'Emily Wong', xp: 2430, avatar: '👤' },
            ].map((user) => (
              <div
                key={user.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: user.name.includes('You') ? 'rgba(102, 126, 234, 0.1)' : '#1a1a1a',
                  borderRadius: '12px',
                  border: user.name.includes('You') ? '1px solid #667eea' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '24px', width: '32px' }}>{user.avatar}</span>
                  <div>
                    <p style={{ fontSize: '16px', margin: 0, fontWeight: user.name.includes('You') ? 'bold' : 'normal' }}>
                      {user.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Rank #{user.rank}</p>
                  </div>
                </div>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: 'rgba(240, 147, 251, 0.2)',
                    color: '#f093fb',
                    fontSize: '14px',
                  }}
                >
                  {user.xp.toLocaleString()} XP
                </span>
              </div>
            ))}
          </div>
        </div>
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
                  value="sahil@example.com"
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

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

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