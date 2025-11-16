# solid-navigation

Native navigation for SolidJS mobile apps built with NativeScript.

> **Warning**
> This is a work in progress.

## Installation

```
npm install solid-navigation --save
```

## Usage

Create a router inside a new file, for example `app/router.ts`;

```tsx
import { createStackRouter, RouteDefinition } from "solid-navigation";

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

export const { Route, StackRouter, useParams, useRouter } =
  createStackRouter<"Default">();
```

Use the router in your app:

```tsx
import Home from "./home";
import { Route, StackRouter } from "./router";
const App = () => {
  return (
    <StackRouter initialRouteName="Home">
      <StackRouterFrame>
        <Route
          name="Home"
          component={Home}
          initialParams={{
            user: "@ammarahmed",
          }}
        />
      </StackRouterFrame>

      {/* 👇 You can add components independent of the navigation frame that can still use `useRouter()`. */}
      <BottomNavigation />
    </StackRouter>
  );
};
```

## MIT Licensed
