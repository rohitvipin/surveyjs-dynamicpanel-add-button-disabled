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
       * Sets the add button's accessibility and visual state.
       * @param btn The add button HTMLElement
       * @param disabled Whether the button should be disabled
       */
      function setAddButtonState(btn: HTMLElement, disabled: boolean) {
        btn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
        btn.setAttribute('tabindex', disabled ? '-1' : '0');
        btn.setAttribute('aria-label', disabled ? 'Add Panel (disabled, max reached)' : 'Add Panel');
        btn.classList.toggle('disabled-state', disabled);
        btn.style.opacity = disabled ? '0.5' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
        btn.style.pointerEvents = disabled ? 'none' : 'auto';
        if (disabled) {
          btn.removeAttribute('onclick');
        }
      }

      /**
       * Updates the add button's appearance and accessibility state
       * depending on whether the max panel count is reached.
       * This is called after every add/remove and after render.
       */
      const updateButtonState = () => {
        setTimeout(() => {
          // Find the dynamic panel container by data-name attribute
          const element = document.querySelector(`[data-name="${panelDynamic.name}"]`);
          if (!element) return;
          // Support both SurveyJS v2 and v3+ classnames for the add button
          const addButton = element.querySelector('.sv-paneldynamic__add-btn, .sd-paneldynamic__add-btn');
          if (!addButton) return;
          const btn = addButton as HTMLElement;
          const atMax = panelDynamic.panelCount >= panelDynamic.maxPanelCount;
          setAddButtonState(btn, atMax);
        }, 10);
      };

      // Initial state update after render
      updateButtonState();
    }
  });
}

/**
 * SurveyComponent renders the SurveyJS survey and applies the dynamic panel customization.
 * The survey model is memoized to avoid unnecessary re-creation on each render.
 */
function SurveyComponent() {
  // Memoize the survey model so it is not recreated on every render
  const survey = useMemo(() => new Model(surveyJson), []);
  // Apply the custom dynamic panel button logic
  customizePanelDynamicButtons(survey);
  return <Survey model={survey} />;
}

export default SurveyComponent;
