import { Component } from "solid-js";
import { ParamsContext, NavigationContext } from "./context";

export const StackItem: Component<{
  context: any;
  paramAccessor: any;
  component: any;
}> = (props) => {
  const RouteComponent = props.component;
  return (
    <NavigationContext.Provider value={props.context}>
      <ParamsContext.Provider value={props.paramAccessor}>
        <RouteComponent />
      </ParamsContext.Provider>
    </NavigationContext.Provider>
  );
};
