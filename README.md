# SurveyJS Dynamic Panel Add Button (Disabled State)

This project demonstrates how to use SurveyJS in a Next.js app and customize the dynamic panel's "Add Panel" button to always be visible, but disabled (not hidden) when the maximum panel count is reached.

## Functionality & Approach

- **Dynamic Panel**: Uses SurveyJS's `paneldynamic` question type to allow users to add or remove panels (sets of questions) dynamically.
- **Always Show Add Button**: The "Add Panel" button is always visible, even when the maximum number of panels is reached.
- **Disabled State**: When the max panel count is reached, the add button is visually and functionally disabled (grayed out, dashed border, not clickable, and shows a "(Max reached)" label).
- **Implementation**:
  - The SurveyJS model is customized to override the default `canAddPanel` property and the `addPanel`/`removePanel` methods.
  - The button's state and appearance are updated after every add/remove action and after each render.
  - Custom CSS ensures the disabled button is clearly distinct and professional.

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000) to see the app in action.

4. **Try it out:**
   - Add panels using the "Add Panel" button.
   - When the maximum is reached, the button will remain visible but will be disabled and styled accordingly.
   - Remove panels to re-enable the button.

## How it Works

- See `src/app/page.tsx` for the main logic and comments.
- See `src/app/globals.css` for the custom styles that make the UI modern and the disabled state clear.

---

This project is based on [Next.js](https://nextjs.org) and [SurveyJS](https://surveyjs.io/).
