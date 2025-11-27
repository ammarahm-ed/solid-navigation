import { render } from "@nativescript-community/solid-js";
import { Frame } from "@nativescript/core";
import { isNullOrUndefined } from "@nativescript/core/utils";
import { createStore } from "solid-js/store";
import {
  NavigationContext,
  NavigationContextInternal,
  useParams as useParamsDefault,
  useRoute as useRouteDefault,
  useRouter as userRouterDefault,
} from "./context";
import { Route as RouteInternal, RouteProps } from "./route";
import { StackItem } from "./stack-item";
import {
  NavigationRoute,
  NavigationStack,
  NavigationStackInternal,
  RouteOptions,
  RouteParams,
  Routers,
} from "./types";
import { createRouteID } from "./utils";

function getRoutes<
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
>(routes?: Routers[Key]) {
  return routes
    ? Object.keys(routes).map(
        (route) =>
          ({
            name: route,
            params: (routes[route as RouteName] as { params: any })?.["params"],
            routeOptions: (routes[route as RouteName] as { options: any })?.[
              "options"
            ],
            component: (routes[route as RouteName] as { component: any })?.[
              "component"
            ],
          } as NavigationRoute<Key, RouteName>)
      )
    : [];
}

export type StackRouterProps<Key extends keyof Routers> = {
  children?: JSX.Element;
  initialRouteName?: keyof Routers[Key] | ({} & string);
  defaultRouteOptions?: RouteOptions;
  /**
   * By default each router will use it's own `Frame` to render pages. However
   * you can set this to `true` so pages will be rendered with the topmost frame
   * in the application.
   */
  useTopMostFrame?: boolean;
  frameProps?: Omit<JSX.IntrinsicElements["text"], "toString">;
  defaultPageProps?: Omit<JSX.IntrinsicElements["page"], "toString">;
};

export function createStackRouter<Key extends keyof Routers>(
  routes?: Routers[Key]
) {
  const StackRouter = <RouteName extends keyof Routers[Key]>(
    props: StackRouterProps<Key>
  ): JSX.Element => {
    let frameRef: Frame | undefined = props.useTopMostFrame
      ? undefined
      : Frame.topmost();
    const parentContext = useRouter() as never;
    const [state, setState] = createStore<{
      routes: NavigationRoute<Key, RouteName>[];
      stack: NavigationRoute<Key, RouteName>[];
    }>({
      routes: getRoutes(routes),
      stack: [],
    });
    const navigate = (
      routeName: keyof Routers[Key],
      options?: RouteOptions & { params?: any }
    ) => {
      const routeIndex = state.routes.findIndex(
        (route) => route.name === routeName
      );
      const route = state.routes[routeIndex];
      if (!route)
        //@ts-ignore
        return console.warn(
          `Trying to navigate to a route "${
            routeName as string
          }" that does not exist in the route map.`
        );
      frameRef = !props.useTopMostFrame ? frameRef : Frame.topmost();
      frameRef?.navigate({
        create: () => {
          const page = document.createElement("Page");

          if (route.pageProps || props.defaultPageProps) {
            Object.assign(page, route.pageProps || props.defaultPageProps);
          }

          page.id = createRouteID(routeName as string, 16);

          if (
            !isNullOrUndefined(options?.noHeader) ||
            !isNullOrUndefined(props.defaultRouteOptions?.noHeader) ||
            !isNullOrUndefined(route.routeOptions?.noHeader)
          ) {
            page.actionBarHidden =
              options?.noHeader ||
              props.defaultRouteOptions?.noHeader ||
              route.routeOptions?.noHeader ||
              false;
          }

          const [paramAccessor, paramSetter] = createStore<{
            [name: string]: unknown;
          }>(options?.params || route.params);

          const stackItem = {
            ...route,
            id: page.id,
            ref: page as any,
            params: options?.params || route.params,
            setParams: paramSetter,
          };

          setState("stack", (stack) => {
            return [...stack, stackItem];
          });

          const disposer = render(
            () => (
              <StackItem
                context={context}
                paramAccessor={paramAccessor}
                route={stackItem}
              />
            ),
            page as any
          );

          const disposeNativeView = () => {
            //@ts-ignore
            disposer();
            setState("stack", (routes) => {
              const _routes = [...routes].splice(
                routes.findIndex((r) => r.id === page.id),
                1
              );
              return _routes;
            });
            page.off("disposeNativeView", disposeNativeView);
          };
          page.on("disposeNativeView", disposeNativeView);

          return page as any;
        },
        transition:
          options?.transition ||
          route.routeOptions?.transition ||
          props.defaultRouteOptions?.transition,
        transitionAndroid:
          options?.transitionAndroid ||
          route.routeOptions?.transitionAndroid ||
          props.defaultRouteOptions?.transitionAndroid,
        transitioniOS:
          options?.transitionIOS ||
          route.routeOptions?.transitionIOS ||
          props.defaultRouteOptions?.transitionIOS,
        clearHistory:
          typeof options?.clearHistory === "boolean"
            ? options?.clearHistory
            : route.routeOptions?.clearHistory ||
              props.defaultRouteOptions?.clearHistory,
        backstackVisible:
          typeof options?.backstackVisible === "boolean"
            ? options?.backstackVisible
            : route.routeOptions?.backstackVisible ||
              props.defaultRouteOptions?.backstackVisible,
      });
    };

    const context: NavigationStack<Key, RouteName> = {
      ref: () => frameRef,
      navigate: navigate,
      goBack: () => {
        frameRef = !props.useTopMostFrame ? frameRef : Frame.topmost();
        frameRef?.goBack();
      },
      routes: state.routes,
      stack: state.stack,
      current: () => state.stack[state.stack.length - 1],
      initialRouteName: props.initialRouteName as RouteName,
      parent: () => parentContext,
    };

    const contextInternal: NavigationStackInternal<Key, RouteName> = {
      pushRoute: (route) => {
        if (state.routes.findIndex((r) => r.name === route.name) > -1) return;
        setState("routes", (routes) => [...routes, route]);
      },
      removeRoute: (route) => {
        const index = state.routes.findIndex((r) => r.name === route.name);
        if (index > -1) {
          setState("routes", (routes) => {
            const _routes = [...routes].splice(index, 1);
            return _routes;
          });
        }
      },
    };

    return (
      <NavigationContextInternal.Provider value={contextInternal}>
        <NavigationContext.Provider value={context}>
          {!props.useTopMostFrame ? (
            <frame
              {...props.frameProps}
              ref={(ref) => {
                frameRef = ref as unknown as Frame;
              }}
            />
          ) : null}
          {props.children}
        </NavigationContext.Provider>
      </NavigationContextInternal.Provider>
    );
  };

  return (<RouteName extends keyof Routers[Key]>() => ({
    Route: RouteInternal as <RouteName extends keyof Routers[Key]>(
      props: RouteProps<Key, RouteName>
    ) => JSX.Element,
    StackRouter: StackRouter,
    useRouter: userRouterDefault as () => NavigationStack<Key, RouteName>,
    useRoute: useRouteDefault as <
      RouteName extends keyof Routers[Key]
    >() => NavigationRoute<Key, RouteName>,
    useParams: useParamsDefault as <
      Route extends keyof Routers[Key]
    >() => RouteParams<Key, Route>,
  }))();
}

/**
 *
 * Create a default stack router
 */

const { Route, StackRouter, useParams, useRoute, useRouter } =
  //@ts-ignore
  createStackRouter<"Default">() as {
    Route: (
      //@ts-ignore
      props: RouteProps<"Default", keyof Routers["Default"]>
    ) => JSX.Element;
    StackRouter: (
      //@ts-ignore
      props: StackRouterProps<"Default">
    ) => JSX.Element;
    //@ts-ignore
    useRouter: () => NavigationStack<"Default", keyof Routers["Default"]>;
    //@ts-ignore
    useRoute: <RouteName extends keyof Routers["Default"]>() => NavigationRoute<
      //@ts-ignore
      "Default",
      //@ts-ignore
      RouteName
    >;
    //@ts-ignore
    useParams: <RouteName extends keyof Routers["Default"]>() => RouteParams<
      //@ts-ignore
      "Default",
      //@ts-ignore
      RouteName
    >;
  };

export { Route, StackRouter, useParams, useRoute, useRouter };
