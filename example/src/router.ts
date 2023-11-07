import { createStackRouter, RouteDefinition } from "solid-navigation";

declare module "solid-navigation" {
  export interface Routers {
    Default: {
      ScreenOne: RouteDefinition<{
        value: string
      }>;
      ScreenTwo: RouteDefinition;
      ScreenThree: RouteDefinition
    };
  }
}

export const { Route, StackRouter, useParams, useRouter } =
  createStackRouter<"Default">();