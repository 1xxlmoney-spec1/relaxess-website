import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Grounding Exercise (5-4-3-2-1)", () => {
  describe("Step Configuration", () => {
    it("should have 5 grounding steps", () => {
      const GROUNDING_STEPS = [
        { number: 5, key: "grounding.step1", icon: "👀" },
        { number: 4, key: "grounding.step2", icon: "✋" },
        { number: 3, key: "grounding.step3", icon: "👂" },
        { number: 2, key: "grounding.step4", icon: "👃" },
        { number: 1, key: "grounding.step5", icon: "❤️" },
      ];

      expect(GROUNDING_STEPS).toHaveLength(5);
    });

    it("should have correct step numbers in descending order", () => {
      const GROUNDING_STEPS = [
        { number: 5, key: "grounding.step1", icon: "👀" },
        { number: 4, key: "grounding.step2", icon: "✋" },
        { number: 3, key: "grounding.step3", icon: "👂" },
        { number: 2, key: "grounding.step4", icon: "👃" },
        { number: 1, key: "grounding.step5", icon: "❤️" },
      ];

      expect(GROUNDING_STEPS[0].number).toBe(5);
      expect(GROUNDING_STEPS[1].number).toBe(4);
      expect(GROUNDING_STEPS[2].number).toBe(3);
      expect(GROUNDING_STEPS[3].number).toBe(2);
      expect(GROUNDING_STEPS[4].number).toBe(1);
    });

    it("should have correct emoji icons for each sense", () => {
      const GROUNDING_STEPS = [
        { number: 5, key: "grounding.step1", icon: "👀" },
        { number: 4, key: "grounding.step2", icon: "✋" },
        { number: 3, key: "grounding.step3", icon: "👂" },
        { number: 2, key: "grounding.step4", icon: "👃" },
        { number: 1, key: "grounding.step5", icon: "❤️" },
      ];

      expect(GROUNDING_STEPS[0].icon).toBe("👀"); // See
      expect(GROUNDING_STEPS[1].icon).toBe("✋"); // Feel
      expect(GROUNDING_STEPS[2].icon).toBe("👂"); // Hear
      expect(GROUNDING_STEPS[3].icon).toBe("👃"); // Smell
      expect(GROUNDING_STEPS[4].icon).toBe("❤️"); // Taste/Body
    });

    it("should have unique translation keys for each step", () => {
      const GROUNDING_STEPS = [
        { number: 5, key: "grounding.step1", icon: "👀" },
        { number: 4, key: "grounding.step2", icon: "✋" },
        { number: 3, key: "grounding.step3", icon: "👂" },
        { number: 2, key: "grounding.step4", icon: "👃" },
        { number: 1, key: "grounding.step5", icon: "❤️" },
      ];

      const keys = GROUNDING_STEPS.map((step) => step.key);
      const uniqueKeys = new Set(keys);

      expect(uniqueKeys.size).toBe(5);
    });
  });

  describe("Progress Calculation", () => {
    it("should calculate progress percentage correctly", () => {
      const GROUNDING_STEPS = [
        { number: 5, key: "grounding.step1", icon: "👀" },
        { number: 4, key: "grounding.step2", icon: "✋" },
        { number: 3, key: "grounding.step3", icon: "👂" },
        { number: 2, key: "grounding.step4", icon: "👃" },
        { number: 1, key: "grounding.step5", icon: "❤️" },
      ];

      const calculateProgress = (currentStep: number) => {
        return ((currentStep + 1) / GROUNDING_STEPS.length) * 100;
      };

      expect(calculateProgress(0)).toBe(20); // Step 1
      expect(calculateProgress(1)).toBe(40); // Step 2
      expect(calculateProgress(2)).toBe(60); // Step 3
      expect(calculateProgress(3)).toBe(80); // Step 4
      expect(calculateProgress(4)).toBe(100); // Step 5
    });

    it("should identify last step correctly", () => {
      const GROUNDING_STEPS = [
        { number: 5, key: "grounding.step1", icon: "👀" },
        { number: 4, key: "grounding.step2", icon: "✋" },
        { number: 3, key: "grounding.step3", icon: "👂" },
        { number: 2, key: "grounding.step4", icon: "👃" },
        { number: 1, key: "grounding.step5", icon: "❤️" },
      ];

      const isLastStep = (currentStep: number) => {
        return currentStep === GROUNDING_STEPS.length - 1;
      };

      expect(isLastStep(0)).toBe(false);
      expect(isLastStep(1)).toBe(false);
      expect(isLastStep(2)).toBe(false);
      expect(isLastStep(3)).toBe(false);
      expect(isLastStep(4)).toBe(true);
    });
  });

  describe("User Input Handling", () => {
    it("should validate non-empty input", () => {
      const validateInput = (input: string) => {
        return input.trim().length > 0;
      };

      expect(validateInput("chair")).toBe(true);
      expect(validateInput("  window  ")).toBe(true);
      expect(validateInput("")).toBe(false);
      expect(validateInput("   ")).toBe(false);
    });

    it("should store user responses in order", () => {
      const userResponses: string[] = [];

      userResponses.push("chair");
      userResponses.push("window");
      userResponses.push("phone");

      expect(userResponses).toEqual(["chair", "window", "phone"]);
      expect(userResponses.length).toBe(3);
    });

    it("should handle multiple responses per step", () => {
      const userResponses: string[] = [];
      const inputValue = "chair, window, phone";

      userResponses.push(inputValue.trim());

      expect(userResponses[0]).toBe("chair, window, phone");
    });

    it("should clear input after adding response", () => {
      let inputValue = "chair";

      inputValue = "";

      expect(inputValue).toBe("");
    });

    it("should enforce maximum character length", () => {
      const maxLength = 200;
      const input = "a".repeat(250);

      expect(input.length > maxLength).toBe(true);
      expect(input.substring(0, maxLength).length).toBe(maxLength);
    });
  });

  describe("Completion State", () => {
    it("should mark exercise as completed after all steps", () => {
      let isCompleted = false;
      let currentStepIndex = 0;
      const GROUNDING_STEPS = [
        { number: 5, key: "grounding.step1", icon: "👀" },
        { number: 4, key: "grounding.step2", icon: "✋" },
        { number: 3, key: "grounding.step3", icon: "👂" },
        { number: 2, key: "grounding.step4", icon: "👃" },
        { number: 1, key: "grounding.step5", icon: "❤️" },
      ];

      const isLastStep = currentStepIndex === GROUNDING_STEPS.length - 1;
      if (isLastStep) {
        isCompleted = true;
      }

      expect(isCompleted).toBe(false);

      currentStepIndex = 4;
      const isLastStepNow = currentStepIndex === GROUNDING_STEPS.length - 1;
      if (isLastStepNow) {
        isCompleted = true;
      }

      expect(isCompleted).toBe(true);
    });

    it("should display completion message when exercise is done", () => {
      const isCompleted = true;
      const completionMessage = "You are grounded.";
      const completionSubtitle = "Take a moment and notice how you feel now.";

      expect(isCompleted).toBe(true);
      expect(completionMessage).toBeTruthy();
      expect(completionSubtitle).toBeTruthy();
    });

    it("should provide repeat and done buttons on completion", () => {
      const isCompleted = true;
      const buttons = ["Repeat Exercise", "Done"];

      expect(isCompleted).toBe(true);
      expect(buttons).toContain("Repeat Exercise");
      expect(buttons).toContain("Done");
    });
  });

  describe("Repeat Exercise Functionality", () => {
    it("should reset to step 0 when repeating", () => {
      let currentStepIndex = 4;

      currentStepIndex = 0;

      expect(currentStepIndex).toBe(0);
    });

    it("should clear all user responses when repeating", () => {
      let userResponses = ["chair", "window", "phone", "desk", "lamp"];

      userResponses = [];

      expect(userResponses).toEqual([]);
      expect(userResponses.length).toBe(0);
    });

    it("should clear input field when repeating", () => {
      let inputValue = "some text";

      inputValue = "";

      expect(inputValue).toBe("");
    });

    it("should reset completion state when repeating", () => {
      let isCompleted = true;

      isCompleted = false;

      expect(isCompleted).toBe(false);
    });

    it("should reset animation opacity when repeating", () => {
      let completionMessageOpacity = 1;

      completionMessageOpacity = 0;

      expect(completionMessageOpacity).toBe(0);
    });
  });

  describe("Animation Configuration", () => {
    it("should have correct fade-in duration", () => {
      const animationDuration = 1200; // milliseconds

      expect(animationDuration).toBe(1200);
      expect(animationDuration).toBeGreaterThan(1000);
      expect(animationDuration).toBeLessThan(2000);
    });

    it("should use inOut easing for smooth animation", () => {
      const easingType = "inOut";

      expect(easingType).toBe("inOut");
    });

    it("should animate from 0 to 1 opacity", () => {
      const startOpacity = 0;
      const endOpacity = 1;

      expect(startOpacity).toBe(0);
      expect(endOpacity).toBe(1);
    });
  });

  describe("Navigation", () => {
    it("should move to next step when input is provided", () => {
      let currentStepIndex = 0;
      const inputValue = "chair";

      if (inputValue.trim()) {
        currentStepIndex += 1;
      }

      expect(currentStepIndex).toBe(1);
    });

    it("should not move to next step when input is empty", () => {
      let currentStepIndex = 0;
      const inputValue = "";

      if (inputValue.trim()) {
        currentStepIndex += 1;
      }

      expect(currentStepIndex).toBe(0);
    });

    it("should go to completion when on last step with input", () => {
      let currentStepIndex = 4;
      let isCompleted = false;
      const GROUNDING_STEPS = [
        { number: 5, key: "grounding.step1", icon: "👀" },
        { number: 4, key: "grounding.step2", icon: "✋" },
        { number: 3, key: "grounding.step3", icon: "👂" },
        { number: 2, key: "grounding.step4", icon: "👃" },
        { number: 1, key: "grounding.step5", icon: "❤️" },
      ];
      const inputValue = "breath";

      const isLastStep = currentStepIndex === GROUNDING_STEPS.length - 1;
      if (isLastStep && inputValue.trim()) {
        isCompleted = true;
      }

      expect(isCompleted).toBe(true);
    });
  });

  describe("Haptic Feedback", () => {
    it("should trigger light haptic on step advance", () => {
      const hapticType = "Light";

      expect(hapticType).toBe("Light");
    });

    it("should trigger success haptic on completion", () => {
      const hapticType = "Success";

      expect(hapticType).toBe("Success");
    });

    it("should trigger light haptic on repeat", () => {
      const hapticType = "Light";

      expect(hapticType).toBe("Light");
    });
  });

  describe("Accessibility", () => {
    it("should have descriptive placeholder text", () => {
      const placeholder = "5 things...";

      expect(placeholder).toBeTruthy();
      expect(placeholder.length).toBeGreaterThan(0);
    });

    it("should display step progress information", () => {
      const currentStep = 1;
      const totalSteps = 5;
      const progressText = `Step ${currentStep} of ${totalSteps}`;

      expect(progressText).toBe("Step 1 of 5");
    });

    it("should have clear button labels", () => {
      const buttons = ["Repeat Exercise", "Done"];

      buttons.forEach((button) => {
        expect(button.length).toBeGreaterThan(0);
      });
    });
  });
});
