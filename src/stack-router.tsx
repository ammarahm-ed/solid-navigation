import { render } from "@nativescript-community/solid-js";
import { Frame } from "@nativescript/core";
import { isNullOrUndefined } from "@nativescript/core/utils";
import { createSignal, FlowProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  NavigationContext,
  NavigationContextInternal,
  useParams as useParamsDefault,
  useRoute as useRouteDefault,
  useRouterInternal,
  useRouter as userRouterDefault,
} from "./context";
import { createRoute } from "./route";
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
  RouteName extends keyof Routers[Key],
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
          }) as NavigationRoute<Key, RouteName>,
      )
    : [];
}

export function createStackRouter<Key extends keyof Routers>(
  routes?: Routers[Key],
) {
  const StackRouter = <RouteName extends keyof Routers[Key]>(props: {
    children?: JSX.Element;
    initialRouteName?: keyof Routers[Key];
    defaultRouteOptions?: RouteOptions;
    /**
     * By default each router will use it's own `Frame` to render pages. However
     * you can set this to `true` so pages will be rendered with the topmost frame
     * in the application.
     */
    useTopMostFrame?: boolean;
    frameProps?: Omit<JSX.IntrinsicElements["text"], "toString">;
    defaultPageProps?: Omit<JSX.IntrinsicElements["page"], "toString">;
  }): JSX.Element => {
    const [frameRef, setFrameRef] = createSignal<Frame | undefined>(
      props.useTopMostFrame ? undefined : Frame.topmost(),
    );
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
      options?: RouteOptions & { params?: any },
    ) => {
      const routeIndex = state.routes.findIndex(
        (route) => route.name === routeName,
      );
      const route = state.routes[routeIndex];
      if (!route)
        //@ts-ignore
        return console.warn(
          `Trying to navigate to a route "${
            routeName as string
          }" that does not exist in the route map.`,
        );
      setFrameRef(!props.useTopMostFrame ? frameRef() : Frame.topmost());
      frameRef()?.navigate({
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

          setState(
            "stack",
            produce((stack) => {
              stack.push(stackItem);
            }),
          );

          const disposer = render(
            () => (
              <StackItem
                context={context}
                paramAccessor={paramAccessor}
                route={stackItem}
              />
            ),
            page as any,
          );

          const disposeNativeView = () => {
            //@ts-ignore
            disposer();
            setState(
              "stack",
              produce((stack) => {
                const index = stack.findIndex((r) => r.id === page.id);
                if (index > -1) {
                  stack.splice(index, 1);
                }
              }),
            );
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
      ref: () => frameRef(),
      navigate: navigate,
      goBack: () => {
        setFrameRef(!props.useTopMostFrame ? frameRef() : Frame.topmost());
        frameRef()?.goBack();
      },
      routes: state.routes,
      stack: state.stack,
      current: () => state.stack[state.stack.length - 1],
      initialRouteName: props.initialRouteName as RouteName,
      parent: () => parentContext,
    };

    const contextInternal: NavigationStackInternal<Key, RouteName> = {
      useTopMostFrame: () => props.useTopMostFrame ?? false,
      // @ts-ignore
      frameProps: () => props.frameProps,
      setFrameRef: setFrameRef,
      pushRoute: (route) => {
        setState(
          "routes",
          produce((routes) => {
            if (routes.findIndex((r) => r.name === route.name) === -1) {
              routes.push(route);
            }
          }),
        );
      },
      removeRoute: (route) => {
        setState(
          "routes",
          produce((routes) => {
            const index = routes.findIndex((r) => r.name === route.name);
            if (index > -1) {
              routes.splice(index, 1);
            }
          }),
        );
      },
    };

    return (
      <NavigationContextInternal.Provider value={contextInternal}>
        <NavigationContext.Provider value={context}>
          {props.children}
        </NavigationContext.Provider>
      </NavigationContextInternal.Provider>
    );
  };

  const StackRouterFrame = (props: FlowProps) => {
    const routerInternal = useRouterInternal() as any;

    return (
      <>
        {!routerInternal.useTopMostFrame() ? (
          <frame
            {...routerInternal?.frameProps()}
            ref={routerInternal?.setFrameRef}
          />
        ) : null}
        {props.children}
      </>
    );
  };

  return (<RouteName extends keyof Routers[Key]>() => ({
    Route: createRoute<Key>(),
    StackRouter: StackRouter,
    StackRouterFrame: StackRouterFrame,
    useRouter: userRouterDefault as () => NavigationStack<Key, RouteName>,
    useRoute: useRouteDefault as () => NavigationRoute<Key, RouteName>,
    useParams: useParamsDefault as <
      Route extends keyof Routers[Key],
    >() => RouteParams<Key, Route>,
  }))();
}

/**
 *
 * Create a default stack router
 */
//@ts-ignore
const { Route, StackRouter, useParams, useRoute, useRouter } =
  //@ts-ignore
  createStackRouter<"Default">();
export { Route, StackRouter, useParams, useRoute, useRouter };
