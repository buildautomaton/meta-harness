/** Forward ACP session events to the host; also invoke optional plugin hooks. */

import type { AcpClientOptions } from '../client-types.js';
import type { ClientHostHooks } from '../../core/manager/types.js';
import { mapRequestKind } from './map-request-kind.js';

export function acpSessionHooks(params: {
  hostHooks?: ClientHostHooks;
  sendSessionUpdate: (payload: unknown) => void;
  sendRequest: (payload: unknown) => void;
}): Pick<AcpClientOptions, 'onSessionUpdate' | 'onRequest' | 'onFileChange'> {
  const { hostHooks, sendSessionUpdate, sendRequest } = params;
  return {
    onSessionUpdate: (payload) => {
      sendSessionUpdate(payload);
      hostHooks?.onSessionUpdate?.(payload);
    },
    onRequest: (request) => {
      sendRequest({
        type: 'session_update',
        requestId: request.requestId,
        kind: mapRequestKind(request.method),
        payload: {
          sessionUpdate: mapRequestKind(request.method),
          requestId: request.requestId,
          method: request.method,
          params: request.params,
        },
      });
      hostHooks?.onRequest?.(request);
    },
    onFileChange: hostHooks?.onFileChange,
  };
}
