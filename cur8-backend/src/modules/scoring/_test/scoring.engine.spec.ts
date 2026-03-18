import { ScoringEngine } from '../scoring.engine';
import {
  ProjectStatus,
  VerificationStatus,
} from '@/common/interfaces/project.interface';

describe('ScoringEngine', () => {
  describe('calculatePermanence', () => {
    it('should calculate permanence score correctly based on durability', () => {
      expect(ScoringEngine.calculatePermanence(500)).toBe(5);
      expect(ScoringEngine.calculatePermanence(1000)).toBe(10);
    });

    it('should cap the permanence score at a maximum of 10.0', () => {
      expect(ScoringEngine.calculatePermanence(1200)).toBe(10);
      expect(ScoringEngine.calculatePermanence(5000)).toBe(10);
    });
  });

  describe('calculateSupplierTrust', () => {
    it('should return 10.0 for a verified supplier', () => {
      expect(
        ScoringEngine.calculateSupplierTrust(VerificationStatus.VERIFIED),
      ).toBe(10.0);
    });

    it('should return 5.0 for a pending supplier', () => {
      expect(
        ScoringEngine.calculateSupplierTrust(VerificationStatus.PENDING),
      ).toBe(5.0);
    });
  });

  describe('calculateFinancialRisk', () => {
    it('should return base score for normal status with high volume', () => {
      expect(
        ScoringEngine.calculateFinancialRisk(ProjectStatus.OPERATIONAL, 1500),
      ).toBe(10.0);
      expect(
        ScoringEngine.calculateFinancialRisk(ProjectStatus.IN_DESIGN, 1200),
      ).toBe(5.0);
      expect(
        ScoringEngine.calculateFinancialRisk(ProjectStatus.DISCONTINUED, 2000),
      ).toBe(1.0);
    });

    it('should halve the base score if volume is less than 1000', () => {
      expect(
        ScoringEngine.calculateFinancialRisk(ProjectStatus.OPERATIONAL, 500),
      ).toBe(5.0);
      expect(
        ScoringEngine.calculateFinancialRisk(ProjectStatus.IN_DESIGN, 999),
      ).toBe(2.5);
      expect(
        ScoringEngine.calculateFinancialRisk(ProjectStatus.DISCONTINUED, 100),
      ).toBe(0.5);
    });
  });

  describe('calculateLeakageRisk', () => {
    it('should properly discount the permanence score based on the leakage percentage', () => {
      expect(ScoringEngine.calculateLeakageRisk(10, 0.1)).toBe(9.0);
      expect(ScoringEngine.calculateLeakageRisk(5, 0.5)).toBe(2.5);
      expect(ScoringEngine.calculateLeakageRisk(8, 0.05)).toBe(7.6);
    });
  });

  describe('calculateScores (Full Orchestration)', () => {
    it('should return a properly calculated, 2-decimal rounded breakdown of all scores', () => {
      // durability = 800 (permanence = 8)
      // leakage = 0.024 (leakage risk = 8 * (1 - 0.024) = 7.808)
      // volume = 4500 (financial risk = 10, no penalty)
      // status = operational (starts at 10)
      // verification = verified (trust = 10)

      const result = ScoringEngine.calculateScores(
        800,
        0.024,
        4500,
        ProjectStatus.OPERATIONAL,
        VerificationStatus.VERIFIED,
      );

      expect(result.permanence_score).toBe(8);
      expect(result.supplier_trust_score).toBe(10);
      expect(result.financial_risk_score).toBe(10);
      expect(result.leakage_risk_score).toBe(7.81);

      // Overall = (10 + 7.808 + 10) / 3 = 27.808 / 3 = 9.2693... -> 9.27
      expect(result.overall_score).toBe(9.27);
    });
  });
});
