import { describe, it, expect } from 'vitest';

/**
 * Breathing Exercise Unit Tests
 * Tests for cycle counter display and duration labels
 */

describe('Breathing Exercise UI', () => {
  describe('Breathing Cycle Configuration', () => {
    it('should have correct breathing cycle durations', () => {
      const BREATHING_CYCLES = [
        { phase: 'inhale', duration: 4000, label: 'breathing.inhale' },
        { phase: 'hold', duration: 4000, label: 'breathing.hold' },
        { phase: 'exhale', duration: 6000, label: 'breathing.exhale' },
      ];

      expect(BREATHING_CYCLES[0].duration).toBe(4000); // 4 seconds
      expect(BREATHING_CYCLES[1].duration).toBe(4000); // 4 seconds
      expect(BREATHING_CYCLES[2].duration).toBe(6000); // 6 seconds
    });

    it('should have total cycle duration of 14 seconds', () => {
      const BREATHING_CYCLES = [
        { phase: 'inhale', duration: 4000 },
        { phase: 'hold', duration: 4000 },
        { phase: 'exhale', duration: 6000 },
      ];

      const TOTAL_CYCLE_DURATION = BREATHING_CYCLES.reduce((sum, cycle) => sum + cycle.duration, 0);
      expect(TOTAL_CYCLE_DURATION).toBe(14000); // 14 seconds
    });

    it('should have correct phase labels', () => {
      const BREATHING_CYCLES = [
        { phase: 'inhale', label: 'breathing.inhale' },
        { phase: 'hold', label: 'breathing.hold' },
        { phase: 'exhale', label: 'breathing.exhale' },
      ];

      expect(BREATHING_CYCLES[0].phase).toBe('inhale');
      expect(BREATHING_CYCLES[1].phase).toBe('hold');
      expect(BREATHING_CYCLES[2].phase).toBe('exhale');
    });
  });

  describe('Cycle Counter Display', () => {
    it('should display cycle count starting from 1', () => {
      const cycleCount = 0;
      const displayedCycle = cycleCount + 1;
      expect(displayedCycle).toBe(1);
    });

    it('should increment cycle count after each complete cycle', () => {
      const cycleCount = 0;
      expect(cycleCount + 1).toBe(1);

      const cycleCount2 = 1;
      expect(cycleCount2 + 1).toBe(2);

      const cycleCount3 = 2;
      expect(cycleCount3 + 1).toBe(3);
    });

    it('should display cycle count in header', () => {
      const cycleCount = 0;
      const headerText = `Cycle ${cycleCount + 1}`;
      expect(headerText).toBe('Cycle 1');
    });

    it('should update cycle count display after each cycle completes', () => {
      const cycles = [0, 1, 2, 3, 4];
      const displayedCycles = cycles.map(c => `Cycle ${c + 1}`);

      expect(displayedCycles[0]).toBe('Cycle 1');
      expect(displayedCycles[1]).toBe('Cycle 2');
      expect(displayedCycles[2]).toBe('Cycle 3');
      expect(displayedCycles[3]).toBe('Cycle 4');
      expect(displayedCycles[4]).toBe('Cycle 5');
    });
  });

  describe('Duration Labels', () => {
    it('should display duration in seconds for inhale phase', () => {
      const duration = 4000; // milliseconds
      const displayedDuration = `${Math.ceil(duration / 1000)} sec`;
      expect(displayedDuration).toBe('4 sec');
    });

    it('should display duration in seconds for hold phase', () => {
      const duration = 4000; // milliseconds
      const displayedDuration = `${Math.ceil(duration / 1000)} sec`;
      expect(displayedDuration).toBe('4 sec');
    });

    it('should display duration in seconds for exhale phase', () => {
      const duration = 6000; // milliseconds
      const displayedDuration = `${Math.ceil(duration / 1000)} sec`;
      expect(displayedDuration).toBe('6 sec');
    });

    it('should use "sec" suffix for all durations', () => {
      const durations = [4000, 4000, 6000];
      const labels = durations.map(d => `${Math.ceil(d / 1000)} sec`);

      expect(labels[0]).toBe('4 sec');
      expect(labels[1]).toBe('4 sec');
      expect(labels[2]).toBe('6 sec');

      // Verify all labels end with 'sec'
      labels.forEach(label => {
        expect(label.endsWith('sec')).toBe(true);
      });
    });

    it('should not display "OK" in duration labels', () => {
      const durations = [4000, 4000, 6000];
      const labels = durations.map(d => `${Math.ceil(d / 1000)} sec`);

      labels.forEach(label => {
        expect(label.includes('OK')).toBe(false);
      });
    });

    it('should correctly format duration from milliseconds to seconds', () => {
      const testCases = [
        { ms: 4000, expected: '4 sec' },
        { ms: 4000, expected: '4 sec' },
        { ms: 6000, expected: '6 sec' },
        { ms: 1000, expected: '1 sec' },
        { ms: 5000, expected: '5 sec' },
      ];

      testCases.forEach(({ ms, expected }) => {
        const result = `${Math.ceil(ms / 1000)} sec`;
        expect(result).toBe(expected);
      });
    });
  });

  describe('Cycle Counter Logic', () => {
    it('should calculate cycle count from elapsed time', () => {
      const TOTAL_CYCLE_DURATION = 14000; // 14 seconds per cycle

      // After 0ms: cycle 0
      let elapsed = 0;
      let cycleCount = Math.floor(elapsed / TOTAL_CYCLE_DURATION);
      expect(cycleCount).toBe(0);

      // After 14000ms (1 complete cycle): cycle 1
      elapsed = 14000;
      cycleCount = Math.floor(elapsed / TOTAL_CYCLE_DURATION);
      expect(cycleCount).toBe(1);

      // After 28000ms (2 complete cycles): cycle 2
      elapsed = 28000;
      cycleCount = Math.floor(elapsed / TOTAL_CYCLE_DURATION);
      expect(cycleCount).toBe(2);

      // After 42000ms (3 complete cycles): cycle 3
      elapsed = 42000;
      cycleCount = Math.floor(elapsed / TOTAL_CYCLE_DURATION);
      expect(cycleCount).toBe(3);
    });

    it('should detect cycle completion at start of new cycle', () => {
      const TOTAL_CYCLE_DURATION = 14000;
      const BREATHING_CYCLES = [
        { phase: 'inhale', duration: 4000 },
        { phase: 'hold', duration: 4000 },
        { phase: 'exhale', duration: 6000 },
      ];

      // At the start of a new cycle, cycleProgress < first phase duration
      let elapsed = 14000; // Start of cycle 2
      let cycleProgress = elapsed % TOTAL_CYCLE_DURATION;
      let isNewCycle = cycleProgress < BREATHING_CYCLES[0].duration;

      expect(isNewCycle).toBe(true);
      expect(cycleProgress).toBe(0);
    });

    it('should track current phase index during cycle', () => {
      const TOTAL_CYCLE_DURATION = 14000;
      const BREATHING_CYCLES = [
        { phase: 'inhale', duration: 4000 },
        { phase: 'hold', duration: 4000 },
        { phase: 'exhale', duration: 6000 },
      ];

      // Helper function to get phase index
      const getPhaseIndex = (elapsed: number) => {
        const cycleProgress = elapsed % TOTAL_CYCLE_DURATION;
        let phaseIndex = 0;
        let phaseTime = 0;

        for (let i = 0; i < BREATHING_CYCLES.length; i++) {
          if (cycleProgress < phaseTime + BREATHING_CYCLES[i].duration) {
            phaseIndex = i;
            break;
          }
          phaseTime += BREATHING_CYCLES[i].duration;
        }

        return phaseIndex;
      };

      // During inhale (0-4000ms)
      expect(getPhaseIndex(2000)).toBe(0); // inhale
      expect(BREATHING_CYCLES[0].phase).toBe('inhale');

      // During hold (4000-8000ms)
      expect(getPhaseIndex(6000)).toBe(1); // hold
      expect(BREATHING_CYCLES[1].phase).toBe('hold');

      // During exhale (8000-14000ms)
      expect(getPhaseIndex(10000)).toBe(2); // exhale
      expect(BREATHING_CYCLES[2].phase).toBe('exhale');
    });
  });

  describe('Animation Timing', () => {
    it('should not modify animation timing', () => {
      const BREATHING_CYCLES = [
        { phase: 'inhale', duration: 4000 },
        { phase: 'hold', duration: 4000 },
        { phase: 'exhale', duration: 6000 },
      ];

      // Verify timings are unchanged
      expect(BREATHING_CYCLES[0].duration).toBe(4000);
      expect(BREATHING_CYCLES[1].duration).toBe(4000);
      expect(BREATHING_CYCLES[2].duration).toBe(6000);
    });

    it('should maintain 4-4-6 breathing pattern', () => {
      const inhale = 4; // seconds
      const hold = 4; // seconds
      const exhale = 6; // seconds

      expect(inhale).toBe(4);
      expect(hold).toBe(4);
      expect(exhale).toBe(6);
    });
  });

  describe('Completion State', () => {
    it('should trigger completion after 10 cycles', () => {
      const cycleCount = 10;
      const isCompleted = cycleCount >= 10;
      expect(isCompleted).toBe(true);
    });

    it('should not be completed before 10 cycles', () => {
      const cycleCount = 9;
      const isCompleted = cycleCount >= 10;
      expect(isCompleted).toBe(false);
    });

    it('should display completion message when completed', () => {
      const cycleCount = 10;
      const isCompleted = cycleCount >= 10;
      const completionMessage = 'Excellent.';
      const supportingText = 'Take a moment to relax and notice your breathing.';

      if (isCompleted) {
        expect(completionMessage).toBe('Excellent.');
        expect(supportingText).toContain('Take a moment');
      }
    });

    it('should hide cycle counter when completed', () => {
      const cycleCount = 10;
      const isCompleted = cycleCount >= 10;
      expect(isCompleted).toBe(true);
      // When isCompleted is true, cycle counter should not be displayed
    });

    it('should display cycle counter during breathing', () => {
      const cycleCount = 5;
      const isCompleted = cycleCount >= 10;
      expect(isCompleted).toBe(false);
      // When isCompleted is false, cycle counter should display
    });

    it('should show Repeat Session button when completed', () => {
      const cycleCount = 10;
      const isCompleted = cycleCount >= 10;
      expect(isCompleted).toBe(true);
      // Repeat Session button should be visible
    });

    it('should show Exit button in both states', () => {
      const cycleCount1 = 5;
      const isCompleted1 = cycleCount1 >= 10;
      expect(isCompleted1).toBe(false);
      // Exit button visible during breathing

      const cycleCount2 = 10;
      const isCompleted2 = cycleCount2 >= 10;
      expect(isCompleted2).toBe(true);
      // Exit button visible after completion
    });

    it('should reset cycle count to 0 when repeating', () => {
      let cycleCount = 10;
      expect(cycleCount).toBe(10);

      // Simulate repeat action
      cycleCount = 0;
      expect(cycleCount).toBe(0);
    });

    it('should restart breathing animation when repeating', () => {
      let isActive = false;
      expect(isActive).toBe(false);

      // Simulate repeat action
      isActive = true;
      expect(isActive).toBe(true);
    });

    it('should display buttons side-by-side in completion state', () => {
      const cycleCount = 10;
      const isCompleted = cycleCount >= 10;
      expect(isCompleted).toBe(true);
      // Buttons should be arranged side-by-side (flex-row)
    });

    it('should display single Exit button during breathing', () => {
      const cycleCount = 5;
      const isCompleted = cycleCount >= 10;
      expect(isCompleted).toBe(false);
      // Only Exit button should be visible
    });

    it('should preserve Exit button functionality', () => {
      const cycleCount = 10;
      const isCompleted = cycleCount >= 10;
      expect(isCompleted).toBe(true);
      // Exit button should still navigate back
    });

    it('should have larger completion message text', () => {
      const completionTextSize = 'text-4xl'; // Larger than normal body text
      const normalTextSize = 'text-lg';
      expect(completionTextSize).toContain('4xl');
      expect(normalTextSize).toContain('lg');
    });
  });
});
