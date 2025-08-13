// batchClient.ts
import axios from "axios";

export type BatchRequest = { endpoint: string; body?: any; method?: "GET" | "POST" };

type BatchEnvelope = {
	requests: Array<{
		endpoint: string;
		method?: "GET" | "POST";
		body?: any;
	}>;
};

type BatchResultItem = {
	status: number;
	data?: any;
	error?: any;
};

type BatchResponse = {
	results: BatchResultItem[];
};

let queue: BatchRequest[] = [];
let pendingResolvers: ((value: any) => void)[] = [];
let batchTimeout: ReturnType<typeof setTimeout> | null = null;

// Dedicated Axios instance (do not rely on apiClient)
const batchAxios = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || '/',
	timeout: 10000,
});

batchAxios.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt");
	if (token) (config.headers as any).Authorization = `Bearer ${token}`;
	return config;
});

batchAxios.interceptors.response.use(
	(response) => response,
	(error) => {
		// Transport-level 401 (e.g., whole batch rejected)
		if (error?.response?.status === 401) {
			window.dispatchEvent(new CustomEvent('unauthorized-access'));
		}
		return Promise.reject(error);
	}
);

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
		const envelope: BatchEnvelope = {
			requests: currentQueue.map((r) => ({ endpoint: r.endpoint, method: r.method ?? 'POST', body: r.body }))
		};

		const response = await batchAxios.post<BatchResponse>("/batch", envelope);
		const results = response?.data?.results;

		let unauthorizedFound = false;

		if (Array.isArray(results)) {
			results.forEach((res, index) => {
				if (res?.status === 401) unauthorizedFound = true;
				const value = res?.status >= 200 && res?.status < 300 ? res?.data ?? null : null;
				currentResolvers[index](value as any);
			});
		} else {
			// If results are missing or not an array, resolve all as null
			currentResolvers.forEach((resolve) => resolve(null as any));
		}

		// If any item returned 401 within batch results, notify AuthProvider
		if (unauthorizedFound) {
			window.dispatchEvent(new CustomEvent('unauthorized-access'));
		}
	} catch (error) {
		// Network/transport error: resolve all as null
		currentResolvers.forEach((resolve) => resolve(null as any));
	}
}
