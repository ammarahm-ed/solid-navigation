import { onCleanup, onMount } from "solid-js";
import { useRouter } from "./context";
import { NavigationStack, RouteOptions, Routers } from "./types";

export function createRoute<Key extends keyof Routers>() {
  const Route = <RouteName extends keyof Routers[Key]>(props: {
    name: RouteName;
    component: JSX.Element;
    //@ts-ignore
    initialParams?: Routers[Key][RouteName]["params"];
    routeOptions?: RouteOptions;
  }): JSX.Element => {
    const router = useRouter() as NavigationStack<Key, RouteName>;
    const route = {
      name: props.name,
      component: props.component,
      routeOptions: props.routeOptions,
    };

    onMount(() => {
      router?.pushRoute(route);
      if (router?.initialRouteName === props.name && !router.current()) {
        router?.navigate(props.name, {
          params: props.initialParams,
        });
      }
    });

    onCleanup(() => {
      router?.removeRoute(route);
    });

    return null;
  };

  return Route;
}
