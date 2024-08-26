import { NavigationContext, ParamsContext, RouteContext } from "./context";
import { NavigationRoute, NavigationStack, Routers } from "./types";

export type StackItemProps<
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
> = {
  context: NavigationStack<Key, RouteName>;
  paramAccessor: { [name: string]: any };
  route: NavigationRoute<Key, RouteName>;
};

export function StackItem<
  Key extends keyof Routers,
  RouteName extends keyof Routers[Key]
>(props: StackItemProps<Key, RouteName>) {
  const RouteComponent = props.route.component as () => JSX.Element;
  return (
    <NavigationContext.Provider value={props.context}>
      <ParamsContext.Provider value={props.paramAccessor}>
        <RouteContext.Provider value={props.route}>
          <RouteComponent />
        </RouteContext.Provider>
      </ParamsContext.Provider>
    </NavigationContext.Provider>
  );
}
