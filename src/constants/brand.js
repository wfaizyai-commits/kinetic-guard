// FitGuard — Brand Constants
export const BRAND = {
  name: 'FitGuard',
  tagline: 'Train Smart. Stay Safe.',
  mission: 'Protect Your Performance'
};

export const COLORS = {
  primary: '#FF6B00',       // FitGuard Orange
  primaryBright: '#FF8C38', // Orange hover
  secondary: '#FF3D00',     // Hot orange-red
  accent: '#00FF88',        // Success green
  neutral: '#8A8A9A',
  background: '#0A0A0A',
  surface: '#141414',
  white: '#FFFFFF',
  text: '#FFFFFF',
  textLight: 'rgba(255,255,255,0.6)',
  success: '#00FF88',
  warning: '#FFB800',
  error: '#FF4D6D'
};

export const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif",
  arabic: "'Cairo', sans-serif"
};

export const TIERS = {
  NOVICE: 'novice',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

export const TIER_DESCRIPTIONS = {
  [TIERS.NOVICE]: {
    title: 'Novice Program',
    description: 'Building your foundation safely. Bodyweight mastery and form before any load.',
    color: COLORS.accent
  },
  [TIERS.INTERMEDIATE]: {
    title: 'Intermediate Program',
    description: 'Progressive loading with smart technique. Compound movements done right.',
    color: COLORS.primary
  },
  [TIERS.ADVANCED]: {
    title: 'Advanced Program',
    description: 'Peak performance with strict safety protocols. Technical failure training.',
    color: COLORS.secondary
  }
};

export const GOALS = [
  { id: 'strength', label: 'Build Strength', icon: '💪' },
  { id: 'weight_loss', label: 'Weight Management', icon: '🔥' },
  { id: 'cardiovascular', label: 'Cardio Health', icon: '❤️' },
  { id: 'flexibility', label: 'Flexibility', icon: '🧘' },
  { id: 'general', label: 'General Fitness', icon: '⚡' }
];

export const RISK_FLAGS = {
  JOINT_PAIN: 'Joint Pain Detected',
  POSTURE_ISSUES: 'Posture Issues Detected',
  SEDENTARY_LIFESTYLE: 'Sedentary Lifestyle',
  LIMITED_MOBILITY: 'Limited Mobility',
  PRIOR_SURGERY: 'Prior Surgery History'
};
