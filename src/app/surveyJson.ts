// SurveyJS survey definition for the dynamic panel example
const surveyJson = {
  elements: [
    {
      type: "paneldynamic",
      name: "dynamicPanel",
      title: "Dynamic Panel Example",
      templateElements: [
        { type: "text", name: "question1", title: "Question 1" }
      ],
      minPanelCount: 1,
      maxPanelCount: 3,
      panelAddText: "Add Panel"
    }
  ]
};

export default surveyJson;
