export const ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DESCRIPTION = [
  'Ask the product director what to build next. Call this at the start of a session, before planning or building.',
  'It returns a sessionId state handle in structuredContent (and as text). Always minting this handle — even when there is no queued work.',
  'Keep that sessionId for the whole build session. Pass the same one on every tell_product_director_what_was_built; do not invent a new id or ask again just to get another.',
  'It also lists draft work that still needs a relentless interview (interviewSessionId in structuredContent when distinct).',
  'Implement queued work first. When finished, call tell_product_director_what_was_built with the same sessionId and project.',
  'For a draft, call ask_product_director_interview_questions until there are no more questions.',
  'Paused queued items are held and will not be returned.',
].join('\n');

export const ASK_PRODUCT_DIRECTOR_INTERVIEW_DESCRIPTION = [
  'Run a relentless interview on a draft. Ask 2–4 multiple-choice questions about the plan.',
  'The dashboard shows them under the draft card. This call waits until they are answered.',
  'Each answer is stored as a decision bullet on the work item.',
  'Keep calling with follow-up questions until the plan is sharp. Then pass questions: [] to queue it.',
].join('\n');

export const TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT_DESCRIPTION = [
  'Tell the product director what you just built. Call this after the work is done, at the end of the session.',
  'Always pass the sessionId state handle from ask_product_director_what_to_build_next (structuredContent.sessionId), plus title, description, and project.',
  'Reuse that same sessionId on every tell in this agent session. Do not create a new sessionId or call ask again only to obtain another one.',
  'description: at most 2–3 plain-language sentences on what was built. No long changelogs.',
  'Pass every applicable artifact kind from the registered artifact plugins. Omit kinds that do not apply.',
  'At least one artifact kind is required. Artifact param descriptions come from those plugins.',
  'Review questions: about 10, fewer if you can. Only important decisions that were made or still need review.',
  'Almost every review question must include one status_quo answer (keep what was built). That shows a No changes badge and queues no work.',
  'Be aggressive: if an answer accepts the built decision, tag it status_quo. Omit status_quo only in rare cases where every option needs new work.',
  'Only change answers get prompt and context.',
].join('\n');
