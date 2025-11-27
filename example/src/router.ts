import {
  Route,
  RouteDefinition,
  StackRouter,
  useParams,
  useRoute,
  useRouter,
} from "solid-navigation";

declare module "solid-navigation" {
  export interface Routers {
    Default: {
      ScreenOne: RouteDefinition<{
        value: string;
      }>;
      ScreenTwo: RouteDefinition;
      ScreenThree: RouteDefinition;
    };
  }
}

export { Route, StackRouter, useParams, useRoute, useRouter };
