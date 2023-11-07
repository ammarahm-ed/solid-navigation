import "./globals";
import { Route, StackRouter } from "./router";
import { ScreenOne } from "./routes/screen-one";
import { ScreenThree } from "./routes/screen-three";
import { ScreenTwo } from "./routes/screen-two";

const App = () => {
  return (
    <StackRouter initialRouteName="ScreenOne">
      <Route name="ScreenOne" component={ScreenOne} initialParams={{
        value: "hello"
      }} />
      <Route name="ScreenTwo" component={ScreenTwo} />
      <Route name="ScreenThree" component={ScreenThree} />
    </StackRouter>
  );
};

export { App };