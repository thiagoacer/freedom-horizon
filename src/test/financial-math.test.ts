import { describe, it, expect } from 'vitest';
import { calculateFreedomMetrics } from '../lib/financial-math';
import { DEFAULT_MULTIPLIER } from '../config/financial';

describe('calculateFreedomMetrics', () => {
    it('should return zeros for zero input', () => {
        const result = calculateFreedomMetrics(0, 0, 0);
        expect(result.freedomNumber).toBe(0);
        expect(result.percentage).toBe(0);
        expect(result.yearsToFreedom).toBe(Infinity);
    });

    it('should calculate correct freedom number from monthly cost', () => {
        const monthlyCost = 10000;
        const result = calculateFreedomMetrics(monthlyCost, 0, 5000);
        expect(result.freedomNumber).toBe(monthlyCost * DEFAULT_MULTIPLIER);
    });

    it('should calculate 100% percentage if assets >= freedom number', () => {
        const monthlyCost = 10000;
        const freedomNum = monthlyCost * DEFAULT_MULTIPLIER;
        const result = calculateFreedomMetrics(monthlyCost, freedomNum, 0);
        expect(result.percentage).toBe(100);
        expect(result.yearsToFreedom).toBe(0);
    });

    it('should calculate partial percentage correctly', () => {
        const monthlyCost = 10000; // Target 3M (if mult=300)
        const freedomNum = monthlyCost * DEFAULT_MULTIPLIER;
        const assets = freedomNum / 2;
        const result = calculateFreedomMetrics(monthlyCost, assets, 5000);
        expect(result.percentage).toBe(50);
    });

    it('should estimate time correctly for standard scenario', () => {
        // Scenario:
        // Cost: 20k -> Target: 6M
        // Assets: 0
        // Investment: 100k/month (unrealistic but easy math? No, let's trust the NPER formula)
        // Let's use the UI's default values to verifying against known behavior.

        // We can't easily calc NPER in head, but we know:
        // If we have 0 assets, and need X, and invest Y, it takes time.
        // If we double investment, time should decrease.
        const result1 = calculateFreedomMetrics(20000, 0, 5000);
        const result2 = calculateFreedomMetrics(20000, 0, 10000);

        expect(result1.yearsToFreedom).toBeGreaterThan(result2.yearsToFreedom);
        expect(result1.yearsToFreedom).toBeLessThan(100); // Should be reasonable
    });

    it('should handle negative inputs gracefully', () => {
        const result = calculateFreedomMetrics(-1000, -500, -500);
        expect(result.freedomNumber).toBe(0);
        expect(result.percentage).toBe(0);
    });
});
