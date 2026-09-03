import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./Captions";
import { TitleCard } from "./TitleCard";
import { IntroExplainer } from "./IntroExplainer";
import { SectionTransition } from "./SectionTransition";
import { BulletBoard } from "./BulletBoard";
import { Verdict } from "./Verdict";
import { Outro } from "./Outro";
import { secondsToFrames, sectionSpan } from "./timeline";
import { theme } from "./theme";

const Block: React.FC<{ name: string; children: React.ReactNode }> = ({
  name,
  children,
}) => {
  const { fps } = useVideoConfig();
  const span = sectionSpan(name);
  const from = secondsToFrames(span.start, fps);
  const durationInFrames = secondsToFrames(span.end - span.start, fps);
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      {children}
    </Sequence>
  );
};

export const SalesvueReview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Audio src={staticFile("audio/narration.mp3")} />

      <Block name="title">
        <TitleCard />
      </Block>
      <Block name="intro">
        <IntroExplainer />
      </Block>
      <Block name="pros-title">
        <SectionTransition label="PROS" emoji="✅" color={theme.green} />
      </Block>
      <Block name="pros">
        <BulletBoard
          sectionName="pros"
          heading="PROS"
          color={theme.green}
          bgColor={theme.greenBg}
          icon="✅"
        />
      </Block>
      <Block name="cons-title">
        <SectionTransition label="CONS" emoji="❌" color={theme.red} />
      </Block>
      <Block name="cons">
        <BulletBoard
          sectionName="cons"
          heading="CONS"
          color={theme.red}
          bgColor={theme.redBg}
          icon="❌"
        />
      </Block>
      <Block name="verdict">
        <Verdict />
      </Block>
      <Block name="outro">
        <Outro />
      </Block>

      <Captions />
    </AbsoluteFill>
  );
};
