import { Frame, NavigationTransition, Page } from "@nativescript/core";

/**
     * The `Routers` interface is used to define your routers once so that solid-navigation
     * can use it to give you helpful intellisense across your project.
     * 
     * You can define your Routers like below in the `SolidNavigation` global namespace while
     * creating your router.
    ```ts
    import { RouteDefinition, createStackRouter } from "solid-navigation"
    declare module "solid-navigation" {
      export interface Routers {
        Default: {
          // A route with initial params
          Home: RouteDefinition<{
            user: string;
          }>;
          // Routes without any initial params.
          Settings: RouteDefinition;
          Feed: RouteDefinition;
        };
      }
    }
    // And then create your router
    export const { Route, StackRouter, useParams, useRouter } = createStackRouter<"Default">();
    ```
     */
export interface Routers {}

export type RouteDefinition<T = undefined> = {
  options?: RouteOptions;
  params: T;
  component: () => JSX.Element;
};

export type RouteParams<
  Key extends keyof Routers,
  Route extends keyof Routers[Key]
//@ts-ignore
> = Routers[Key][Route]["params"];

export type NavigationRoute<
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
> = {
  id?: string;
  name: RouteName;
  component?: () => JSX.Element;
  ref?: Page;
  params: Routers[Key][RouteName]["params"];
  setParams: <RouteName extends keyof Routers[Key]>(
    params: RouteParams<Key, RouteName>
  ) => void;
  routeOptions?: RouteOptions;
  pageProps?: Omit<JSX.IntrinsicElements["page"], "toString">
};

export interface NavigationStack<
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
> {
  /**
   * Get the ref of the Frame that is rendering the current page.
   */
  ref: () => Frame | undefined;
  /**
   * Navigate to a page in stack.
   */
  navigate: <RouteName extends keyof Routers[Key]>(
    routeName: RouteName,
    //@ts-ignore
    options?: RouteOptions & { params?: Routers[Key][RouteName]["params"] }
  ) => void;
  /**
   * Go back to previous route.
   * @returns
   */
  goBack: () => void;
  /**
   * Get all the routes that have been registered with this router.
   */
  routes: NavigationRoute<Key, RouteName>[];
  /**
   * Get all the routes in the history stack.
   */
  stack: NavigationRoute<Key, RouteName>[];
  /**
   * Get the current route
   */
  current: () => NavigationRoute<Key, RouteName>;
  /**
   * The initial route to render when the app loads.
   */
  initialRouteName?: RouteName;
  /**
   * Gets the parent router context if any exists.
   */
  parent: <
    K extends keyof Routers,
    R extends keyof Routers[Key]
  >() => NavigationStack<K, R>;
}

export interface NavigationStackInternal<
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
> {
  pushRoute: (route: NavigationRoute<Key, RouteName>) => void;
  removeRoute: (route: NavigationRoute<Key, RouteName>) => void;
  setFrameRef: (ref: Frame | undefined) => void;
  useTopMostFrame: () => boolean
  frameProps?: () => Omit<JSX.IntrinsicElements["text"], "toString">;
}

export type RouteOptions = {
  animated?: boolean;
  transition?: NavigationTransitionSolid;
  transitionIOS?: NavigationTransitionSolid;
  transitionAndroid?: NavigationTransitionSolid;
  clearHistory?: boolean;
  backstackVisible?: boolean;
  noHeader?: boolean
};

export type Transition =
  | "curl"
  | "curlUp"
  | "curlDown"
  | "explode"
  | "fade"
  | "flip"
  | "flipRight"
  | "flipLeft"
  | "slide"
  | "slideLeft"
  | "slideRight"
  | "slideTop"
  | "slideBottom";

export type NavigationTransitionSolid = Omit<NavigationTransition, "name"> & {
  /**
   * Can be one of the built-in transitions:
   * - curl (same as curlUp) (iOS only)
   * - curlUp (iOS only)
   * - curlDown (iOS only)
   * - explode (Android Lollipop(21) and up only)
   * - fade
   * - flip (same as flipRight)
   * - flipRight
   * - flipLeft
   * - slide (same as slideLeft)
   * - slideLeft
   * - slideRight
   * - slideTop
   * - slideBottom
   */
  name?: Transition;
};
