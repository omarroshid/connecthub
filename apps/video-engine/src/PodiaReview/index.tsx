import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "../shared/Captions";
import { KeywordPop } from "../shared/KeywordPop";
import { KineticLine } from "../shared/KineticLine";
import { SectionBackground } from "../shared/SectionBackground";
import { SectionTransition } from "../shared/SectionTransition";
import { BulletBoard } from "../shared/BulletBoard";
import { IntroScene } from "./IntroScene";
import { HowItWorksScene } from "./HowItWorksScene";
import { VerdictScene } from "./VerdictScene";
import { podiaTheme as theme } from "../shared/theme";
import { makeTimelineHelpers, secondsToFrames } from "../shared/timeline";
import timelineData from "./timeline.json";

const timeline = makeTimelineHelpers(timelineData);

const Block: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => {
  const { fps } = useVideoConfig();
  const span = timeline.sectionSpan(name);
  const from = secondsToFrames(span.start, fps);
  const durationInFrames = secondsToFrames(span.end - span.start, fps);
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      {children}
    </Sequence>
  );
};

export const PodiaReview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Audio src={staticFile("audio/podiareview/narration.mp3")} />
      <Audio src={staticFile("audio/podiareview/music-bed.mp3")} loop volume={0.1} />

      <Block name="hook">
        <SectionBackground kind="energetic" theme={theme} />
        <KineticLine timeline={timeline} theme={theme} sectionName="hook" fontSize={62} />
      </Block>

      <Block name="intro">
        <SectionBackground kind="content" theme={theme} />
        <IntroScene timeline={timeline} />
      </Block>

      <Block name="how-it-works">
        <SectionBackground kind="content" theme={theme} />
        <HowItWorksScene timeline={timeline} />
      </Block>

      <Block name="pros-title">
        <SectionBackground kind="transition" theme={theme} />
        <SectionTransition label="PROS" emoji="✅" color={theme.green} theme={theme} />
      </Block>

      <Block name="pros">
        <SectionBackground kind="content" theme={theme} />
        <BulletBoard
          timeline={timeline}
          theme={theme}
          sectionName="pros"
          heading="PROS"
          color={theme.green}
          bgColor={theme.greenBg}
          icon="✅"
        />
      </Block>

      <Block name="cons-title">
        <SectionBackground kind="transition" theme={theme} />
        <SectionTransition label="CONS" emoji="❌" color={theme.red} theme={theme} />
      </Block>

      <Block name="cons">
        <SectionBackground kind="content" theme={theme} />
        <BulletBoard
          timeline={timeline}
          theme={theme}
          sectionName="cons"
          heading="CONS"
          color={theme.red}
          bgColor={theme.redBg}
          icon="❌"
        />
      </Block>

      <Block name="who-for">
        <SectionBackground kind="content" theme={theme} />
        <BulletBoard
          timeline={timeline}
          theme={theme}
          sectionName="who-for"
          heading="WHO IT'S FOR"
          color={theme.brand}
          bgColor={theme.panel}
          icon="👉"
        />
      </Block>

      <Block name="verdict">
        <SectionBackground kind="content" theme={theme} />
        <VerdictScene timeline={timeline} />
      </Block>

      <Block name="cta">
        <SectionBackground kind="energetic" theme={theme} />
        <KineticLine timeline={timeline} theme={theme} sectionName="cta" fontSize={56} />
      </Block>

      <KeywordPop timeline={timeline} theme={theme} />
      <Captions timeline={timeline} theme={theme} hideForSections={["hook", "cta"]} />
    </AbsoluteFill>
  );
};
