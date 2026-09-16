export const WORK_INSTRUCTIONS = `You have work queue tools.

At the start of a session, call ask_what_to_work_on. It returns the next draft and a sessionId.
Do that work. When finished, call tell_what_was_built with the same sessionId plus artifacts.

UI previews are self-contained HTML in the same style and design system as the app being built.
Preview a changed screen, or a changed component when the scope was smaller.
Use realistic mock data for this product's scenarios and use cases.
Include the product's own controls when they are part of the UI.
The HTML does not need a review questionnaire — that is the separate questions param.
Diagrams and data models must use this product's real names, not generic examples.`;
