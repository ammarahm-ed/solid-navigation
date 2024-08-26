import { useRoute } from "solid-navigation";
import { useParams, useRouter } from "../router";

export const ScreenOne = () => {
  const router = useRouter();
  const params = useParams<"ScreenOne">();
  const route = useRoute();


  return (
    <>
      <actionbar title={route.name}/>
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
            route.setParams({
              value: Date.now().toString()
            })
            // router.navigate("ScreenTwo");
          }}
        />
        
      </gridlayout>
    </>
  );
};
