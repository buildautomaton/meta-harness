export const WORK_INSTRUCTIONS = `You have work queue tools.

At the start of a session, call ask_what_to_work_on.
If it returns queued work, implement that. When finished, call tell_what_was_built with the same sessionId plus artifacts.
If it lists drafts, run a relentless interview with ask_interview_questions until you have no more questions, then pass questions: [].

UI previews are self-contained HTML in the same style and design system as the app being built.
Preview a changed screen, or a changed component when the scope was smaller.
Visually highlight what changed versus before (callouts, badges, before/after, diffs).
Use realistic mock data for this product's scenarios and use cases.
Include the product's own controls when they are part of the UI.
Include icons and images via the assets param (filename, mimeType, base64) or POST /api/assets with sessionId.
Reference those files by filename in the HTML; they are inlined so each file stays self-contained.
The HTML does not need a review questionnaire — that is the separate questions param.
For structure, include an outline of trees, diffs, and flows that show the change.
Diagrams and data models must use this product's real names, not generic examples.`;
