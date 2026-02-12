import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { PinnacleAd } from "./PinnacleAd";
import { GodMode } from "./GodMode";
import { WorkBench, workBenchSchema } from "./WorkBench";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PinnacleAd"
        component={PinnacleAd}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="GodMode"
        component={GodMode}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* WorkBench Composition */}

      <Composition
        id="WorkBench"
        component={WorkBench}
        calculateMetadata={async () => {
          try {
            const blueprint = await fetch(staticFile("blueprint.json")).then((r) => r.json());
            const durationSecs = blueprint.timeline.reduce((acc: number, s: any) => acc + s.duration, 0);
            return {
              durationInFrames: Math.ceil(durationSecs * 30),
            };
          } catch (e) {
            const duration = await getAudioDurationInSeconds(staticFile("video-source.mp4"));
            return {
              durationInFrames: Math.ceil(duration * 30),
            };
          }
        }}
        fps={30}
        width={1080}
        height={1920}
        schema={workBenchSchema}
        defaultProps={{
          theme: "Standard",
          customCaption: "YOUR TEXT HERE",
          showCaption: true
        }}
      />

      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
