"use client";

import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import { Model } from "survey-core";
import { useMemo } from "react";
import surveyJson from "./surveyJson";

/**
 * Customizes the dynamic panel add button in SurveyJS to always show it,
 * but disables it visually and functionally when the max panel count is reached.
 * Also ensures the button state updates after adding or removing panels.
 *
 * @param survey The SurveyJS Model instance
 */
function customizePanelDynamicButtons(survey: Model) {
  survey.onAfterRenderQuestion.add(function (_sender, options) {
    // Only target dynamic panel questions
    if (options.question.getType() === "paneldynamic") {
      const panelDynamic = options.question;

      // Always show the add button by overriding canAddPanel
      Object.defineProperty(panelDynamic, 'canAddPanel', {
        get: function () {
          return true;
        },
        configurable: true
      });

      // Save the original addPanel and removePanel methods
      const originalAddPanel = panelDynamic.addPanel;
      const originalRemovePanel = panelDynamic.removePanel;

      // Override addPanel to prevent adding more than maxPanelCount
      // and update the button state after adding
      panelDynamic.addPanel = function () {
        if (this.panelCount < this.maxPanelCount) {
          const result = originalAddPanel.call(this);
          setTimeout(updateButtonState, 0);
          return result;
        }
        return null;
      };

      // Override removePanel to update the button state after removing
      panelDynamic.removePanel = function (index: number) {
        const result = originalRemovePanel.call(this, index);
        setTimeout(updateButtonState, 0);
        return result;
      };

      /**
       * Updates the add button's appearance and accessibility state
       * depending on whether the max panel count is reached.
       */
      const updateButtonState = () => {
        setTimeout(() => {
          // Find the add button (supports both v2 and v3+ SurveyJS classnames)
          const element = document.querySelector(`[data-name="${panelDynamic.name}"]`);
          if (element) {
            const addButton = element.querySelector('.sv-paneldynamic__add-btn, .sd-paneldynamic__add-btn');
            if (addButton) {
              const btn = addButton as HTMLElement;
              const atMax = panelDynamic.panelCount >= panelDynamic.maxPanelCount;

              // Set all ARIA/accessibility and style attributes in one place
              btn.setAttribute('aria-disabled', atMax ? 'true' : 'false');
              btn.setAttribute('tabindex', atMax ? '-1' : '0');
              btn.setAttribute('aria-label', atMax ? 'Add Panel (disabled, max reached)' : 'Add Panel');
              btn.classList.toggle('disabled-state', atMax);
              btn.style.opacity = atMax ? '0.5' : '1';
              btn.style.cursor = atMax ? 'not-allowed' : 'pointer';
              btn.style.pointerEvents = atMax ? 'none' : 'auto';
              if (atMax) {
                btn.removeAttribute('onclick');
              }
            }
          }
        }, 10);
      };

      // Initial state update
      updateButtonState();
    }
  });
}

function SurveyComponent() {
  // Memoize the survey model so it is not recreated on every render
  const survey = useMemo(() => new Model(surveyJson), []);
  // Apply the custom dynamic panel button logic
  customizePanelDynamicButtons(survey);
  return <Survey model={survey} />;
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <SurveyComponent />
        <div className="text-center text-[14px] text-gray-500">
          This example demonstrates a dynamic panel with a custom add button that respects the max panel count.
        </div>
      </main>
      
    </div>
  );
}
