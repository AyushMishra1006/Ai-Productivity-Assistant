/**
 * SSE Event Parser - handles chunked SSE responses
 * Buffers incomplete lines and emits complete events
 */
export function createSSEParser(onEvent) {
  let buffer = '';

  return function processChunk(chunk) {
    buffer += chunk;
    const events = buffer.split('\n\n');
    buffer = events.pop(); // Keep incomplete event in buffer

    for (const raw of events) {
      if (!raw.trim()) continue;

      const lines = raw.split('\n');
      let eventType = 'message';
      let data = '';

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7);
        }
        if (line.startsWith('data: ')) {
          data = line.slice(6);
        }
      }

      if (data) {
        try {
          const parsedData = JSON.parse(data);
          onEvent(eventType, parsedData);
        } catch (e) {
          console.error('Failed to parse SSE event data:', data, e);
        }
      }
    }
  };
}
