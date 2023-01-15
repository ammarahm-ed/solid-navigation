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
          Home: RouteDefinition<{
            user: string;
          }>;
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
  options?: {
    animated?: boolean;
    transition?: NavigationTransitionSolid;
    transitionIOS?: NavigationTransitionSolid;
    transitionAndroid?: NavigationTransitionSolid;
    clearHistory?: boolean;
    backstackVisible?: boolean;
  };
  params?: T;
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
  component?: JSX.Element;
  ref?: Page;
  //@ts-ignore
  params?: Routers[Key][RouteName]["params"];
  setParams?: <RouteName extends keyof Routers[Key]>(
    params: RouteParams<Key, RouteName>
  ) => void;
  routeOptions?: RouteOptions;
};

export interface NavigationStack<
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
> {
  ref: () => Frame | undefined;
  navigate: <RouteName extends keyof Routers[Key]>(
    routeName: RouteName,
    //@ts-ignore
    options?: RouteOptions & { params?: Routers[Key][RouteName]["params"] }
  ) => void;
  goBack: () => void;
  routes: NavigationRoute<Key, RouteName>[];
  stack: NavigationRoute<Key, RouteName>[];
  pushRoute: (route: NavigationRoute<Key, RouteName>) => void;
  removeRoute: (route: NavigationRoute<Key, RouteName>) => void;
  current: () => NavigationRoute<Key, RouteName>;
  initialRouteName?: RouteName;
}

export type RouteOptions = {
  animated?: boolean;
  transition?: NavigationTransitionSolid;
  transitionIOS?: NavigationTransitionSolid;
  transitionAndroid?: NavigationTransitionSolid;
  clearHistory?: boolean;
  backstackVisible?: boolean;
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
