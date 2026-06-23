import { createContext, useContext } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { adminPathToSpa, apiRequest } from './api';

const PageContext = createContext({ props: {}, url: '/' });

export function PageProvider({ value, children }) {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePage() {
  return useContext(PageContext);
}

export function Head({ title }) {
  if (title) {
    document.title = `${title} - Kids Mela Admin`;
  }
  return null;
}

export function Link({ href = '/', to, children, ...props }) {
  return (
    <RouterLink to={adminPathToSpa(to || href)} {...props}>
      {children}
    </RouterLink>
  );
}

let refreshPage = () => {};

export function RouterBridge() {
  const navigate = useNavigate();
  const location = useLocation();

  refreshPage = () => window.dispatchEvent(new Event('admin:refresh'));
  return null;
}

async function mutate(method, path, data, options = {}) {
  try {
    const payload = await apiRequest(path, {
      method,
      body: data,
      forceFormData: options.forceFormData,
    });
    options.onSuccess?.(payload);
    if (options.reload !== false) refreshPage();
    return payload;
  } catch (error) {
    options.onError?.(error.payload?.errors || { request: error.message });
    throw error;
  } finally {
    options.onFinish?.();
  }
}

export const router = {
  get(path, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, value);
    });
    const search = query.toString();
    window.history.pushState(null, '', `${adminPathToSpa(path)}${search ? `?${search}` : ''}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  },
  post(path, data, options) {
    return mutate('POST', path, data, options);
  },
  put(path, data, options) {
    return mutate('PUT', path, data, options);
  },
  patch(path, data, options) {
    return mutate('PATCH', path, data, options);
  },
  delete(path, options) {
    return mutate('DELETE', path, undefined, options);
  },
};
