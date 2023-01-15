import { createContext, useContext } from "solid-js";

export const NavigationContext = createContext();
export function useRouter() {
  return useContext(NavigationContext);
}

export const ParamsContext = createContext<() => unknown>();
export function useParams() {
  return useContext(ParamsContext);
}
