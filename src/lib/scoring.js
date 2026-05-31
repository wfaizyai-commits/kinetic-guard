/**
 * scoring.js — Single source of truth for Safety Audit tiering.
 *
 * Previously this logic was duplicated and divergent across:
 *   - App.jsx            → computeTierAndScore()   (the live path)
 *   - services/assessment.js → calculateTier()     (legacy, different shape)
 * Both are now consolidated here. App.jsx imports from this module.
 *
 * Input `answers` shape (produced by AssessmentScreen):
 *   {
 *     activeHistory: number,          // 1-5
 *     injuryFlags:   string[],        // 'jointPain' | 'priorSurgery'
 *     mobilityFlags: string[],        // 'canTouchToes' | 'canFullSquat' | 'hasPostureIssues'
 *     dailyLoad:     'sedentary' | 'moderate' | 'demanding',
 *   }
 *
 * Output: { tier, safetyScore, riskFlags }
 *   tier      : 'novice' | 'intermediate' | 'advanced'
 *   riskFlags : snake_case strings consumed by injuryMods.js / WorkoutDashboard
 */

export const TIER_THRESHOLDS = { advanced: 75, intermediate: 50 };

export const computeTierAndScore = (answers = {}) => {
  let score = 60;
  const flags = [];

  // Active history (1-5 scale)
  if (answers.activeHistory >= 4) score += 15;
  else if (answers.activeHistory >= 3) score += 8;
  else score -= 5;

  // Injury flags
  if (answers.injuryFlags?.includes('jointPain')) { score -= 12; flags.push('joint_pain'); }
  if (answers.injuryFlags?.includes('priorSurgery')) { score -= 10; flags.push('prior_surgery'); }

  // Mobility
  if (answers.mobilityFlags?.includes('canTouchToes')) score += 5;
  if (answers.mobilityFlags?.includes('canFullSquat')) score += 5;
  if (answers.mobilityFlags?.includes('hasPostureIssues')) { score -= 8; flags.push('posture_issues'); }
  if (!answers.mobilityFlags?.includes('canTouchToes') && !answers.mobilityFlags?.includes('canFullSquat')) {
    flags.push('limited_mobility');
  }

  // Daily load
  if (answers.dailyLoad === 'demanding') score += 8;
  else if (answers.dailyLoad === 'sedentary') { score -= 5; flags.push('sedentary_lifestyle'); }

  score = Math.max(10, Math.min(100, score));

  let tier;
  if (score >= TIER_THRESHOLDS.advanced) tier = 'advanced';
  else if (score >= TIER_THRESHOLDS.intermediate) tier = 'intermediate';
  else tier = 'novice';

  return { tier, safetyScore: score, riskFlags: [...new Set(flags)] };
};

export default { computeTierAndScore, TIER_THRESHOLDS };
