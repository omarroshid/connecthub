import "./index.css";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { SalesvueReview } from "./SalesvueReview";
import { totalDuration as salesvueTotalDuration } from "./SalesvueReview/timeline";
import { PodiaReview } from "./PodiaReview";
import podiaTimelineData from "./PodiaReview/timeline.json";

const FPS = 30;
const SALESVUE_DURATION_IN_FRAMES = Math.ceil(salesvueTotalDuration * FPS) + 15;
const PODIA_DURATION_IN_FRAMES = Math.ceil(podiaTimelineData.totalDuration * FPS) + 15;

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      <Composition
        id="SalesvueReview"
        component={SalesvueReview}
        durationInFrames={SALESVUE_DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="PodiaReview"
        component={PodiaReview}
        durationInFrames={PODIA_DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoColor1: "#91dAE2",
          logoColor2: "#86A8E7",
        }}
      />
    </>
  );
};
