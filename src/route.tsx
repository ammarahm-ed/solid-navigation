import { onCleanup, onMount } from "solid-js";
import { useRouter, useRouterInternal } from "./context";
import {
  NavigationStack,
  NavigationStackInternal,
  RouteOptions,
  Routers,
} from "./types";

export function createRoute<Key extends keyof Routers>() {
  const Route = <RouteName extends keyof Routers[Key]>(props: {
    name: RouteName;
    component: () => JSX.Element;
    //@ts-ignore
    initialParams?: Routers[Key][RouteName]["params"];
    routeOptions?: RouteOptions;
  }): JSX.Element => {
    const router = useRouter() as NavigationStack<Key, RouteName>;
    const routerInternal = useRouterInternal() as NavigationStackInternal<
      Key,
      RouteName
    >;
    const route = {
      name: props.name,
      component: props.component,
      routeOptions: props.routeOptions,
    };

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

  return Route;
}
