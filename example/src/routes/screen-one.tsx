import { useParams, useRouter } from "../router";

export const ScreenOne = () => {
  const router = useRouter();
  const params = useParams<"ScreenOne">();
 
  return (
    <>
      <actionbar title="Screen One"/>
      {/* @ts-ignore */}
      <gridlayout rows="*,auto,*">
        <button
          row="1"
          iosOverflowSafeArea="false" 
          text={params.value || "GO TO SCREEN B"}
          style={{
            "background-color": "#446b9e",
            width: 200,
            "border-radius":10,
            height: 45,
            color: "white"
          }}
          on:tap={() => {
            router.navigate("ScreenTwo");
          }}
        />
        
      </gridlayout>
    </>
  );
};
