const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
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
};