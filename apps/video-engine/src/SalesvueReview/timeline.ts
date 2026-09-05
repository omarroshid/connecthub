import timelineData from "./timeline.json";

export type ScriptLine = {
  section: string;
  bullet: number | null;
  label: string | null;
  text: string;
  start: number;
  end: number;
};

export type Section = {
  name: string;
  start: number;
  end: number;
  lines: ScriptLine[];
};

export const lines = timelineData.lines as ScriptLine[];
export const totalDuration = timelineData.totalDuration as number;

export const sections: Section[] = (() => {
  const result: Section[] = [];
  for (const line of lines) {
    const last = result[result.length - 1];
    if (last && last.name === line.section) {
      last.end = line.end;
      last.lines.push(line);
    } else {
      result.push({
        name: line.section,
        start: line.start,
        end: line.end,
        lines: [line],
      });
    }
  }
  return result;
})();

export const getSection = (name: string): Section => {
  const found = sections.find((s) => s.name === name);
  if (!found) throw new Error(`Unknown section: ${name}`);
  return found;
};

// A section's own lines can end well before the next section's lines start
// (there's a silence gap for pacing). If a Sequence only ran for the
// section's own line span, the screen would go blank during that gap. This
// stretches each section's visual span to the start of the next section (or
// totalDuration for the last one) so it holds through the silence instead.
export const sectionSpan = (name: string): { start: number; end: number } => {
  const index = sections.findIndex((s) => s.name === name);
  if (index === -1) throw new Error(`Unknown section: ${name}`);
  const start = sections[index].start;
  const end = index + 1 < sections.length ? sections[index + 1].start : totalDuration;
  return { start, end };
};

export const secondsToFrames = (seconds: number, fps: number): number =>
  Math.round(seconds * fps);

// First timeline line (by bullet number) within a section, used to trigger
// a bullet card's on-screen reveal at the moment it starts being spoken.
export const bulletStarts = (sectionName: string): Record<number, number> => {
  const result: Record<number, number> = {};
  for (const line of getSection(sectionName).lines) {
    if (line.bullet != null && !(line.bullet in result)) {
      result[line.bullet] = line.start;
    }
  }
  return result;
};

export const bulletLabels = (sectionName: string): Record<number, string> => {
  const result: Record<number, string> = {};
  for (const line of getSection(sectionName).lines) {
    if (line.bullet != null && line.label && !(line.bullet in result)) {
      result[line.bullet] = line.label;
    }
  }
  return result;
};
