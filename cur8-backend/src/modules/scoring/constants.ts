import {
  ProjectStatus,
  VerificationStatus,
} from '@/common/interfaces/project.interface';

export const TRUST_SCORES: Record<VerificationStatus, number> = {
  [VerificationStatus.VERIFIED]: 10.0,
  [VerificationStatus.PENDING]: 5.0,
};

export const FINANCIAL_SCORES: Record<ProjectStatus, number> = {
  [ProjectStatus.OPERATIONAL]: 10.0,
  [ProjectStatus.IN_DESIGN]: 5.0,
  [ProjectStatus.DISCONTINUED]: 1.0,
};

export const SCORING_CONSTANTS = {
  MAX_PERMANENCE_SCORE: 10.0,
  PERMANENCE_DURABILITY_DIVISOR: 100,
  LOW_VOLUME_THRESHOLD: 1000,
  LOW_VOLUME_PENALTY_MULTIPLIER: 0.5,
};
