import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function getInitialPath(): string {
  // Support both hash routing and pathname
  const hash = window.location.hash.slice(1);
  if (hash) {
    return hash.startsWith('/') ? hash : `/${hash}`;
  }
  return window.location.pathname || '/';
}

export const Router: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      setPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    if (to.startsWith('#')) {
      window.location.hash = to;
    } else {
      window.location.hash = to.startsWith('/') ? to : `/${to}`;
    }
    setPath(to.startsWith('/') ? to : `/${to}`);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a Router');
  }
  return ctx;
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function useLocation() {
  const { path } = useRouter();
  const [pathname, search] = path.split('?');
  return {
    pathname: pathname || '/',
    search: search ? `?${search}` : '',
  };
}

export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
  const { path, navigate } = useRouter();
  const [pathname, search] = path.split('?');

  const searchParams = useMemo(() => new URLSearchParams(search || ''), [search]);

  const setSearchParams = (nextParams: URLSearchParams) => {
    const query = nextParams.toString();
    navigate(query ? `${pathname}?${query}` : pathname);
  };

  return [searchParams, setSearchParams];
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, children, className, onClick, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={`#${to.startsWith('/') ? to : `/${to}`}`} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};

interface RouteProps {
  path: string;
  element: React.ReactElement;
}

interface RoutesProps {
  children: ReactNode;
}

// Current params context for useParams
const ParamsContext = createContext<Record<string, string>>({});

export function useParams<T extends Record<string, string | undefined>>(): T {
  return useContext(ParamsContext) as T;
}

function matchRoute(routePath: string, currentPathname: string): { match: boolean; params: Record<string, string> } {
  const routeSegments = routePath.split('/').filter(Boolean);
  const currentSegments = currentPathname.split('/').filter(Boolean);

  if (routeSegments.length !== currentSegments.length) {
    return { match: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeSegments.length; i++) {
    const r = routeSegments[i];
    const c = currentSegments[i];

    if (r.startsWith(':')) {
      const paramName = r.slice(1);
      params[paramName] = decodeURIComponent(c);
    } else if (r !== c) {
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
}

export const Route: React.FC<RouteProps> = () => null;

export const Routes: React.FC<RoutesProps> = ({ children }) => {
  const { pathname } = useLocation();

  const childArray = React.Children.toArray(children) as React.ReactElement<RouteProps>[];

  for (const child of childArray) {
    if (React.isValidElement<RouteProps>(child)) {
      const { path, element } = child.props;
      const { match, params } = matchRoute(path, pathname);
      if (match) {
        return (
          <ParamsContext.Provider value={params}>
            {element}
          </ParamsContext.Provider>
        );
      }
    }
  }

  // Fallback to first element if root or no match
  return null;
};
