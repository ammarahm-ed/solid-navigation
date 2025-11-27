import { onCleanup, onMount } from "solid-js";
import { useRouter, useRouterInternal } from "./context";
import {
  NavigationRoute,
  NavigationStack,
  NavigationStackInternal,
  RouteOptions,
  Routers,
} from "./types";

export type RouteProps<
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
> = {
  name: RouteName;
  component: () => JSX.Element;
  //@ts-ignore
  initialParams?: Routers[Key][RouteName]["params"] extends undefined
    ? { [name: string]: any }  
    : Routers[Key][RouteName]["params"];
  routeOptions?: RouteOptions;
  pageProps?: Omit<JSX.IntrinsicElements["page"], "toString">;
};

export const Route = <
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
>(
  props: RouteProps<Key, RouteName>
): JSX.Element => {
  const router = useRouter() as NavigationStack<Key, RouteName>;
  const routerInternal = useRouterInternal() as NavigationStackInternal<
    Key,
    RouteName
  >;
  const route = {
    name: props.name,
    component: props.component,
    routeOptions: props.routeOptions,
    pageProps: props.pageProps,
  } as NavigationRoute<never, any>;

  onMount(() => {
    routerInternal?.pushRoute(route);
    if (router?.initialRouteName === props.name && !router.current()) {
      router?.navigate(props.name, {
        params: props.initialParams,
      });
    }
  });

  onCleanup(() => {
    routerInternal?.removeRoute(route);
  });

  return null;
};
