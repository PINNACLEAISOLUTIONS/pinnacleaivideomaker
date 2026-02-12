import { Composition } from "remotion";
// import { HelloWorld, myCompSchema } from "./HelloWorld";
// import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
// import { PinnacleAd } from "./PinnacleAd";
// import { GodMode } from "./GodMode";
import { WorkBench, workBenchSchema } from "./WorkBench";

const blueprintData = require("../public/blueprint.json");

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WorkBench"
        component={WorkBench}
        calculateMetadata={async () => {
          const durationSecs = blueprintData.timeline.reduce((acc: number, s: any) => acc + s.duration, 0);
          return {
            durationInFrames: Math.ceil(durationSecs * 30),
          };
        }}
        fps={30}
        width={1080}
        height={1920}
        schema={workBenchSchema}
        defaultProps={{
          theme: "Standard",
          customCaption: "YOUR TEXT HERE",
          showCaption: true,
          blueprint: blueprintData
        }}
      />

    </>
  );
};

