// batchClient.ts
import { apiPost } from "./apiClient";

type BatchRequest = { endpoint: string; body?: any; method?: "GET" | "POST" };

let queue: BatchRequest[] = [];
let pendingResolvers: ((value: any) => void)[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

export function batchApiCall<T>(request: BatchRequest): Promise<T> {
  return new Promise((resolve) => {
    queue.push(request);
    pendingResolvers.push(resolve);

    // Start batch timer if not already running
    if (!batchTimeout) {
      batchTimeout = setTimeout(flushBatch, 10); // 10ms window
    }
  });
}

async function flushBatch() {
  const currentQueue = [...queue];
  const currentResolvers = [...pendingResolvers];

  // Reset for next batch
  queue = [];
  pendingResolvers = [];
  batchTimeout = null;

  try {
    const batchResponse = await apiPost("/batch", { requests: currentQueue });

    // Map responses back to individual promises
    // AxiosResponse has the data property, so use batchResponse.data.results
    const results = batchResponse.data?.results;
    if (Array.isArray(results)) {
      results.forEach((res: any, index: number) => {
        currentResolvers[index](res.data);
      });
    } else {
      // If results are missing or not an array, resolve all as null
      currentResolvers.forEach((resolve) => resolve(null));
    }
  } catch (error) {
    currentResolvers.forEach((resolve) => resolve(null));
  }
}
