const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const REQUEST_TIMEOUT = 90000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 3000;

/**
 * Central fetch wrapper that auto-attaches the JWT if provided.
 */
export const apiRequest = async (endpoint, options = {}, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      // 204 No Content (DELETE success) → no body
      if (response.status === 204) {
        return { ok: true, status: 204, data: null };
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: data?.error || 'Request failed',
        };
      }

      return { ok: true, status: response.status, data };
    } catch (error) {
      const isTimeout = error.name === 'AbortError';
      const isNetworkFailure = error instanceof TypeError;

      if (!isTimeout && !isNetworkFailure) {
        throw error;
      }

      if (attempt === MAX_RETRIES) {
        return {
          ok: false,
          status: 0,
          error: isTimeout
            ? 'Server is waking up. Please try again in a moment.'
            : 'Cannot reach server. Check your connection.',
        };
      }

      const retryNumber = attempt + 1;
      console.log(`Retry ${retryNumber}/${MAX_RETRIES}...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    } finally {
      clearTimeout(timeoutId);
    }
  }
};
