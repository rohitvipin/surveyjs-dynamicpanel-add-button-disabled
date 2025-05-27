"use client";

import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import { Model } from "survey-core";
import { useMemo } from "react";
import surveyJson from "./surveyJson";

/**
 * Enhances the dynamic panel add button in SurveyJS:
 * - Always shows the add button.
 * - Disables it visually/functionally at max panel count (not hidden).
 * - Updates state after add/remove actions.
 * @param survey SurveyJS Model instance
 */
function enhanceDynamicPanelAddButton(survey: Model) {
  survey.onAfterRenderQuestion.add((_sender, options) => {
    if (options.question.getType() !== "paneldynamic") return;
    const panelDynamic = options.question;

    // Always show the add button
    Object.defineProperty(panelDynamic, "canAddPanel", {
      get: () => true,
      configurable: true,
    });

    // Preserve original methods
    const originalAddPanel = panelDynamic.addPanel;
    const originalRemovePanel = panelDynamic.removePanel;

    // Prevent adding above max, update button after add
    panelDynamic.addPanel = function () {
      if (this.panelCount < this.maxPanelCount) {
        const result = originalAddPanel.call(this);
        setTimeout(updateButtonState, 0);
        return result;
      }
      return null;
    };

    // Update button after remove
    panelDynamic.removePanel = function (index: number) {
      const result = originalRemovePanel.call(this, index);
      setTimeout(updateButtonState, 0);
      return result;
    };

    /**
     * Sets add button accessibility and visual state.
     */
    function setAddButtonState(btn: HTMLElement, disabled: boolean) {
      btn.setAttribute("aria-disabled", String(disabled));
      btn.setAttribute("tabindex", disabled ? "-1" : "0");
      btn.setAttribute(
        "aria-label",
        disabled ? "Add Panel (disabled, max reached)" : "Add Panel"
      );
      btn.classList.toggle("disabled-state", disabled);
      btn.style.opacity = disabled ? "0.5" : "1";
      btn.style.cursor = disabled ? "not-allowed" : "pointer";
      btn.style.pointerEvents = disabled ? "none" : "auto";
      if (disabled) btn.removeAttribute("onclick");
    }

    /**
     * Updates add button state after add/remove/render.
     */
    const updateButtonState = () => {
      setTimeout(() => {
        const element = document.querySelector(
          `[data-name="${panelDynamic.name}"]`
        );
        if (!element) return;
        const addButton = element.querySelector(
          ".sv-paneldynamic__add-btn, .sd-paneldynamic__add-btn"
        );
        if (!addButton) return;
        const atMax = panelDynamic.panelCount >= panelDynamic.maxPanelCount;
        setAddButtonState(addButton as HTMLElement, atMax);
      }, 10);
    };

    updateButtonState();
  });
}

/**
 * Renders the SurveyJS survey with enhanced dynamic panel add button.
 */
function SurveyComponent() {
  const survey = useMemo(() => new Model(surveyJson), []);
  enhanceDynamicPanelAddButton(survey);
  return <Survey model={survey} />;
}

export default SurveyComponent;
