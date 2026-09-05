export type ScriptLine = {
  section: string;
  bullet: number | null;
  label: string | null;
  keyword?: string | null;
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

export type TimelineData = {
  totalDuration: number;
  lines: ScriptLine[];
};

const buildSections = (lines: ScriptLine[]): Section[] => {
  const result: Section[] = [];
  for (const line of lines) {
    const last = result[result.length - 1];
    if (last && last.name === line.section) {
      last.end = line.end;
      last.lines.push(line);
    } else {
      result.push({ name: line.section, start: line.start, end: line.end, lines: [line] });
    }
  }
  return result;
};

export const secondsToFrames = (seconds: number, fps: number): number => Math.round(seconds * fps);

// Reusable across every composition: pass in that composition's own timeline.json
// (imported statically so the bundler can resolve it) and get back the same
// section/bullet/keyword helpers every video needs.
export const makeTimelineHelpers = (data: TimelineData) => {
  const { lines, totalDuration } = data;
  const sections = buildSections(lines);

  const getSection = (name: string): Section => {
    const found = sections.find((s) => s.name === name);
    if (!found) throw new Error(`Unknown section: ${name}`);
    return found;
  };

  // Stretches a section's visual span to the start of the next section (or
  // totalDuration for the last one) so the screen holds through any silence
  // gap between sections instead of going blank.
  const sectionSpan = (name: string): { start: number; end: number } => {
    const index = sections.findIndex((s) => s.name === name);
    if (index === -1) throw new Error(`Unknown section: ${name}`);
    const start = sections[index].start;
    const end = index + 1 < sections.length ? sections[index + 1].start : totalDuration;
    return { start, end };
  };

  const bulletStarts = (sectionName: string): Record<number, number> => {
    const result: Record<number, number> = {};
    for (const line of getSection(sectionName).lines) {
      if (line.bullet != null && !(line.bullet in result)) result[line.bullet] = line.start;
    }
    return result;
  };

  const bulletLabels = (sectionName: string): Record<number, string> => {
    const result: Record<number, string> = {};
    for (const line of getSection(sectionName).lines) {
      if (line.bullet != null && line.label && !(line.bullet in result)) result[line.bullet] = line.label;
    }
    return result;
  };

  return { lines, totalDuration, sections, getSection, sectionSpan, bulletStarts, bulletLabels };
};

export type TimelineHelpers = ReturnType<typeof makeTimelineHelpers>;
