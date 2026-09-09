/**
 * Shared `session/prompt` + result normalization for any {@link AcpSessionTransport}.
 */

import type { PromptResult } from '../acp-client.js';
import type { AcpImagePromptPart, AcpPromptContentBlock, AcpSessionTransport } from '../acp-session-transport.js';
import type { AcpSessionContext } from '../acp-session-context.js';
import { normalizeAcpPromptTurnFailure, normalizeAcpPromptTurnSuccess } from './normalize-acp-prompt-result.js';

export async function sendAcpPromptViaTransport(
  transport: AcpSessionTransport,
  ctx: Pick<AcpSessionContext, 'getStderrText' | 'backendAgentType' | 'agentPromptImageSupported'>,
  sessionId: string,
  promptText: string,
  images?: AcpImagePromptPart[],
): Promise<PromptResult> {
  if (images && images.length > 0 && !ctx.agentPromptImageSupported) {
    await new Promise<void>((r) => setImmediate(r));
    return normalizeAcpPromptTurnFailure(
      new Error(
        'This agent does not advertise image support in ACP (missing agentCapabilities.promptCapabilities.image). Remove images or use an agent that supports prompt images.',
      ),
      ctx.getStderrText(),
    );
  }
  const textBlock = promptText.trim() !== '' ? promptText : images?.length ? ' ' : '';
  const prompt: AcpPromptContentBlock[] = [{ type: 'text', text: textBlock }];
  if (images && images.length > 0) {
    for (const im of images) {
      prompt.push({ type: 'image', mimeType: im.mimeType, data: im.data });
    }
  }
  try {
    const response = await transport.prompt({
      sessionId,
      prompt,
    });
    await new Promise<void>((r) => setImmediate(r));
    const r = response as { stopReason?: string; output?: string };
    return normalizeAcpPromptTurnSuccess({
      stopReason: r?.stopReason,
      output: r?.output,
      stderrCaptureText: ctx.getStderrText(),
      backendAgentType: ctx.backendAgentType,
    });
  } catch (err) {
    await new Promise<void>((r) => setImmediate(r));
    return normalizeAcpPromptTurnFailure(err, ctx.getStderrText());
  }
}
