const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');

function normalizePath(path) {
  if (!path || path === '/admin') return '/admin';
  return path.startsWith('/admin') ? path : `/admin${path.startsWith('/') ? path : `/${path}`}`;
}

function buildUrl(path, params) {
  const basePath = `${API_BASE_URL}${normalizePath(path)}`;
  const url = new URL(basePath, window.location.origin);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

function isFileLike(value) {
  return typeof File !== 'undefined' && value instanceof File;
}

function shouldUseFormData(data, forceFormData = false) {
  if (forceFormData || data instanceof FormData) return true;
  if (!data || typeof data !== 'object') return false;
  return Object.values(data).some((value) => isFileLike(value));
}

function appendFormValue(formData, key, value) {
  if (value === undefined || value === null) return;
  if (typeof value === 'boolean') {
    formData.append(key, value ? '1' : '0');
    return;
  }
  formData.append(key, value);
}

function toFormData(data) {
  if (data instanceof FormData) return data;

  const formData = new FormData();
  Object.entries(data || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => appendFormValue(formData, `${key}[${index}]`, item));
      return;
    }
    appendFormValue(formData, key, value);
  });
  return formData;
}

function requestBody(data, forceFormData = false) {
  if (data === undefined) return undefined;
  if (shouldUseFormData(data, forceFormData)) return toFormData(data);
  return JSON.stringify(data || {});
}

function payloadHeaders(data) {
  if (data instanceof FormData) return {};
  return { 'Content-Type': 'application/json' };
}

export function adminPathToSpa(path) {
  if (!path || path === '/admin') return '/';
  return path.replace(/^\/admin/, '') || '/';
}

export async function apiRequest(path, options = {}) {
  const body = requestBody(options.body, options.forceFormData);

  const response = await fetch(buildUrl(path, options.params), {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/json',
      ...payloadHeaders(body),
      ...(options.headers || {}),
    },
    body,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object'
      ? payload.message || Object.values(payload.errors || {})?.flat()?.[0]
      : payload;
    const error = new Error(message || 'Request failed.');
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function formDataWithMethod(formData, method) {
  const next = formData instanceof FormData ? formData : new FormData();
  next.set('_method', method);
  return next;
}
