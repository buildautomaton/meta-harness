export const ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DESCRIPTION = [
  'Ask the product director what to build next. Call this at the start of a session, before planning or building.',
  'It returns a sessionId state handle in structuredContent (and as text). Always minting this handle — even when there is no queued work.',
  'Keep that sessionId for the whole build session. Pass the same one on every tell_product_director_what_was_built; do not invent a new id or ask again just to get another.',
  'It also lists draft work that still needs an interview (interviewSessionId in structuredContent when distinct).',
  'If there is no queued work and no drafts to interview, this call waits synchronously until work is queued (e.g. a draft is accepted).',
  'Implement queued work first. When finished, call tell_product_director_what_was_built with the same sessionId and project.',
  'For a draft, call ask_product_director_interview_questions with exactly one question at a time until the plan is sharp.',
  'Paused queued items are held and will not be returned.',
].join('\n');

export const ASK_PRODUCT_DIRECTOR_INTERVIEW_DESCRIPTION = [
  'Interview a draft one question at a time. Ask EXACTLY ONE multiple-choice question per call.',
  'Never dump multiple questions at once. Pause and wait for the answer before the next question.',
  'Present 2–6 concrete options with brief labels. Say whether the question is single-select or multi-select.',
  'Highlight the recommended choice with recommended: true (UI shows Recommended). Always include a write-in / "Something else" option.',
  'After each answer, choose the next step: ask another question (clarify/customize), pass questions: [] to queue now (/build), or stop so the user can accept from the dashboard.',
  'The dashboard shows the question under the draft card. This call waits until it is answered or the draft is accepted.',
  'Each answer is stored as a decision bullet on the work item.',
].join('\n');

export const TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT_DESCRIPTION = [
  'Tell the product director what you just built. Call this after the work is done, at the end of the session.',
  'Always pass the sessionId state handle from ask_product_director_what_to_build_next (structuredContent.sessionId), plus title, description, and project.',
  'Reuse that same sessionId on every tell in this agent session. Do not create a new sessionId or call ask again only to obtain another one.',
  'description: at most 2–3 plain-language sentences on what was built. No long changelogs.',
  'Pass every applicable artifact kind. For code changes always include summary and changesOverview.',
  'Also include ui, api, dataModel, and algorithm whenever those surfaces changed — do not stop after summary/changesOverview.',
  'summary/changesOverview never replace a UI mockup, API route list, data-model diagram, or algorithm. Omit a kind only when that surface did not change.',
  'At least one artifact kind is required. Artifact param descriptions come from those plugins.',
  'Review questions: at most 3 total across overview, modules, and UI (few exceptions). Only the most important decisions.',
  'Every review question must include one status_quo answer (keep what was built). That shows a No changes badge and queues no work.',
  'Also mark exactly one recommended choice with recommended: true (may be status_quo or a change). Suggest the best path.',
  'Be aggressive: if an answer accepts the built decision, tag it status_quo. Omit status_quo only in rare cases where every option needs new work.',
  'Only change answers get prompt and context.',
].join('\n');
