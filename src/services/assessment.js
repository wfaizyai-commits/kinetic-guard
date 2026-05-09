// Assessment Logic Service - Calculates tier and risk flags
import { TIERS, RISK_FLAGS } from '../constants/brand';

export const calculateTier = (responses) => {
  const {
    activeHistory,      // 1-10 scale
    injuryInventory,   // boolean - has joint pain/surgeries
    structuralMobility, // boolean - can touch toes and squat
    dailyLoad,         // 'sedentary' | 'moderate' | 'demanding'
    primaryDriver,     // goal id
    timeCommitment     // number of 30-min windows per week
  } = responses;

  // Scoring system
  let score = 0;
  const riskFlags = [];

  // Active History (0-30 points based on 1-10 scale)
  // Score 1-3 = low (0-10pts), 4-6 = medium (11-20pts), 7-10 = high (21-30pts)
  if (activeHistory <= 3) score += 5;
  else if (activeHistory <= 6) score += 15;
  else score += 25;

  // Injury Inventory (significant risk factor)
  if (injuryInventory.hasJointPain) {
    score -= 10;
    riskFlags.push(RISK_FLAGS.JOINT_PAIN);
  }
  if (injuryInventory.hasPriorSurgery) {
    score -= 5;
    riskFlags.push(RISK_FLAGS.PRIOR_SURGERY);
  }

  // Structural Mobility
  if (!structuralMobility.canTouchToes) {
    score -= 10;
    riskFlags.push(RISK_FLAGS.LIMITED_MOBILITY);
  }
  if (!structuralMobility.canFullSquat) {
    score -= 5;
    riskFlags.push(RISK_FLAGS.LIMITED_MOBILITY);
  }
  if (structuralMobility.hasPostureIssues) {
    riskFlags.push(RISK_FLAGS.POSTURE_ISSUES);
  }

  // Daily Load
  if (dailyLoad === 'sedentary') {
    score += 5;
    riskFlags.push(RISK_FLAGS.SEDENTARY_LIFESTYLE);
  } else if (dailyLoad === 'demanding') {
    score += 15;
  } else {
    score += 10;
  }

  // Time Commitment (fewer sessions = lower starting point for advanced)
  // This affects the ceiling but not the base tier
  const sessionsFactor = Math.min(timeCommitment * 2, 20);

  // Determine tier based on final score
  // Novice: 0-30, Intermediate: 31-55, Advanced: 56+
  let tier;
  if (score <= 30) {
    tier = TIERS.NOVICE;
  } else if (score <= 55) {
    tier = TIERS.INTERMEDIATE;
  } else {
    tier = TIERS.ADVANCED;
  }

  return {
    tier,
    score,
    riskFlags: [...new Set(riskFlags)], // Remove duplicates
    recommendations: generateRecommendations(tier, riskFlags, primaryDriver)
  };
};

const generateRecommendations = (tier, riskFlags, primaryDriver) => {
  const recommendations = [];

  // Tier-specific recommendations
  if (tier === TIERS.NOVICE) {
    recommendations.push('Start with bodyweight-only exercises');
    recommendations.push('Focus on movement quality over repetition count');
    recommendations.push('Consider a 10-15 rep range for all exercises');
  } else if (tier === TIERS.INTERMEDIATE) {
    recommendations.push('Compound movements with progressive loading');
    recommendations.push('10-minute dynamic warm-up before each session');
    recommendations.push('Technical failure rules: stop when form slips');
  } else {
    recommendations.push('Advanced programming with RPE-based training');
    recommendations.push('Implement the 2-point RPE buffer for safety');
    recommendations.push('Regular form-check assessments recommended');
  }

  // Risk flag recommendations
  if (riskFlags.includes(RISK_FLAGS.JOINT_PAIN)) {
    recommendations.push('Work around joint limitations with low-impact alternatives');
  }
  if (riskFlags.includes(RISK_FLAGS.LIMITED_MOBILITY)) {
    recommendations.push('Include mobility work before strength training');
  }
  if (riskFlags.includes(RISK_FLAGS.SEDENTARY_LIFESTYLE)) {
    recommendations.push('Counteract sitting damage with hip flexor and rotator cuff work');
  }
  if (riskFlags.includes(RISK_FLAGS.POSTURE_ISSUES)) {
    recommendations.push('Postural correction exercises to be done daily');
  }

  // Goal-specific recommendations
  switch (primaryDriver) {
    case 'bone_density':
      recommendations.push('Weight-bearing exercises to build bone mass');
      break;
    case 'muscle_hypertrophy':
      recommendations.push('Progressive overload with proper recovery');
      break;
    case 'cardiovascular':
      recommendations.push('RPE-controlled cardio within safe zones');
      break;
    case 'flexibility':
      recommendations.push('Dynamic stretching and joint lubrication work');
      break;
  }

  return recommendations;
};

export default { calculateTier };
