// KineticGuard Safety Audit App - Brand Constants
export const BRAND = {
  name: 'KineticGuard',
  tagline: 'The Adaptive Safety Program',
  mission: 'Fitness that Protects'
};

export const COLORS = {
  primary: '#1A2B3C',      // Kinetic Navy
  secondary: '#FF8C00',    // Safety Orange
  accent: '#20B2AA',       // Shield Teal
  neutral: '#708090',      // Slate Grey
  background: '#F8F9FA',   // Off-White
  white: '#FFFFFF',
  text: '#1A2B3C',
  textLight: '#708090',
  success: '#20B2AA',
  warning: '#FF8C00',
  error: '#E74C3C'
};

export const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif"
};

export const TIERS = {
  NOVICE: 'Novice',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

export const TIER_DESCRIPTIONS = {
  [TIERS.NOVICE]: {
    title: 'Novice Program',
    description: 'You are starting your fitness journey with safety as your foundation. We will focus on bodyweight mastery and proper form before introducing any load.',
    color: COLORS.success
  },
  [TIERS.INTERMEDIATE]: {
    title: 'Intermediate Program',
    description: 'You have a foundation of activity and can handle compound movements with proper technique. We will build on your strength with progressive loading.',
    color: COLORS.secondary
  },
  [TIERS.ADVANCED]: {
    title: 'Advanced Program',
    description: 'You have an established fitness routine and are ready for technical failure training. We will push your limits while maintaining strict safety protocols.',
    color: COLORS.primary
  }
};

export const GOALS = [
  { id: 'bone_density', label: 'Bone Density', icon: 'bone' },
  { id: 'muscle_hypertrophy', label: 'Muscle Hypertrophy', icon: 'dumbbell' },
  { id: 'cardiovascular', label: 'Cardiovascular Health', icon: 'heart' },
  { id: 'flexibility', label: 'Flexibility', icon: 'stretch' }
];

export const RISK_FLAGS = {
  JOINT_PAIN: 'Joint Pain Detected',
  POSTURE_ISSUES: 'Posture Issues Detected',
  SEDENTARY_LIFESTYLE: 'Sedentary Lifestyle',
  LIMITED_MOBILITY: 'Limited Mobility',
  PRIOR_SURGERY: 'Prior Surgery History'
};
