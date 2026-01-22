import { useState, useEffect } from 'react';

/**
 * Hook for Simple Client-Side A/B Testing
 * 
 * @param testId - Unique identifier for the test (e.g., 'BUTTON_COPY')
 * @returns 'A' or 'B'
 */
export const useABTest = (testId: string) => {
    const [variant, setVariant] = useState<'A' | 'B'>('A');

    useEffect(() => {
        // Check if user already has a variant assigned for this test
        const storageKey = `ab_${testId}`;
        const stored = sessionStorage.getItem(storageKey);

        if (stored === 'A' || stored === 'B') {
            setVariant(stored as 'A' | 'B');
        } else {
            // Randomly assign A or B (50/50 split)
            const newVariant = Math.random() > 0.5 ? 'B' : 'A';
            sessionStorage.setItem(storageKey, newVariant);
            setVariant(newVariant);

            // Log for debugging (in production, this sends to Analytics)
            console.log(`[CRO] Assigned ${testId} -> Variant ${newVariant}`);
        }
    }, [testId]);

    return variant;
};
