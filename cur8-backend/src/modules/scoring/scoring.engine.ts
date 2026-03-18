import { ScoreBreakdown } from './scoring.types';
import {
  ProjectStatus,
  VerificationStatus,
} from '@/common/interfaces/project.interface';
import { TRUST_SCORES, FINANCIAL_SCORES, SCORING_CONSTANTS } from './constants';

export class ScoringEngine {
  static calculateScores(
    durability: number,
    leakage: number,
    volume: number,
    status: ProjectStatus,
    verificationStatus: VerificationStatus,
  ): ScoreBreakdown {
    const permanence_score = this.calculatePermanence(durability);
    const supplier_trust_score =
      this.calculateSupplierTrust(verificationStatus);
    const financial_risk_score = this.calculateFinancialRisk(status, volume);
    const leakage_risk_score = this.calculateLeakageRisk(
      permanence_score,
      leakage,
    );

    // Overall Score: (Financial + Leakage + Trust) / 3
    const overall_score =
      (financial_risk_score + leakage_risk_score + supplier_trust_score) / 3;

    // Round scores to 2 decimal places for better display
    return {
      permanence_score: parseFloat(permanence_score.toFixed(2)),
      supplier_trust_score: parseFloat(supplier_trust_score.toFixed(2)),
      financial_risk_score: parseFloat(financial_risk_score.toFixed(2)),
      leakage_risk_score: parseFloat(leakage_risk_score.toFixed(2)),
      overall_score: parseFloat(overall_score.toFixed(2)),
    };
  }

  static calculatePermanence(durability: number): number {
    return Math.min(
      SCORING_CONSTANTS.MAX_PERMANENCE_SCORE,
      durability / SCORING_CONSTANTS.PERMANENCE_DURABILITY_DIVISOR,
    );
  }

  static calculateSupplierTrust(
    verificationStatus: VerificationStatus,
  ): number {
    return TRUST_SCORES[verificationStatus];
  }

  static calculateFinancialRisk(status: ProjectStatus, volume: number): number {
    let score = FINANCIAL_SCORES[status];
    if (volume < SCORING_CONSTANTS.LOW_VOLUME_THRESHOLD) {
      score *= SCORING_CONSTANTS.LOW_VOLUME_PENALTY_MULTIPLIER;
    }
    return score;
  }

  static calculateLeakageRisk(
    permanenceScore: number,
    leakage: number,
  ): number {
    return permanenceScore * (1 - leakage);
  }
}
