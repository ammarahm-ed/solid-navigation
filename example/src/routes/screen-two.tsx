import { useRouter } from "../router";

export const ScreenTwo = () => {
  const router = useRouter();
  return (
    <>
      <actionbar title="Screen Two" />
      <flexboxlayout
        style={{
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center",
        }}
      >
        <button
          text="View a list"
          style={{
            "background-color": "#0CDC73",
            width: 200,
            "border-radius":10,
            height: 45,
            marginBottom: 10
          }}
          on:tap={() => {
            router.navigate("ScreenThree")
          }}
        />

        <button
          text="Go Back"
          style={{
            "background-color": "#ffafcc",
            width: 200,
            "border-radius":10,
            height: 45
          }}
          on:tap={() => {
            router.goBack();
          }}
        />
      </flexboxlayout>c
    </>
  );
};
