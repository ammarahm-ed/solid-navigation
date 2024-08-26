import { createContext, useContext } from "solid-js";

export const NavigationContextInternal = createContext();
export function useRouterInternal() {
  return useContext(NavigationContextInternal);
}

export const NavigationContext = createContext();
export function useRouter() {
  return useContext(NavigationContext);
}

export const ParamsContext = createContext<unknown>();
export function useParams() {
  return useContext(ParamsContext);
}

export const RouteContext = createContext<unknown>();
export function useRoute() {
  return useContext(RouteContext);
}
