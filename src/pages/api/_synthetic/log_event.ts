import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const sessionMetadata = new Map<
  string,
  {
    startTime: string;
    lastActivity: string;
    eventCount: number;
    eventTypes: Record<string, number>;
  }
>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const log = req.body;

    if (!log.session_id || !log.action_type || !log.payload) {
      return res.status(400).json({ error: "Invalid log format" });
    }

    if (!sessionMetadata.has(log.session_id)) {
      sessionMetadata.set(log.session_id, {
        startTime: log.timestamp,
        lastActivity: log.timestamp,
        eventCount: 0,
        eventTypes: {},
      });
    }

    const metadata = sessionMetadata.get(log.session_id)!;
    metadata.lastActivity = log.timestamp;
    metadata.eventCount++;
    metadata.eventTypes[log.action_type] =
      (metadata.eventTypes[log.action_type] || 0) + 1;

    const logsBaseDir = path.join(process.cwd(), "logs");
    const today = new Date().toISOString().split("T")[0] as string;
    const dateDir = path.join(logsBaseDir, today);

    if (!fs.existsSync(logsBaseDir)) {
      fs.mkdirSync(logsBaseDir);
    }
    if (!fs.existsSync(dateDir)) {
      fs.mkdirSync(dateDir);
    }

    const sessionPrefix = `session_${log.session_id}`;
    const jsonlPath = path.join(dateDir, `${sessionPrefix}.jsonl`);
    const readablePath = path.join(dateDir, `${sessionPrefix}_readable.txt`);
    const summaryPath = path.join(dateDir, `${sessionPrefix}_summary.txt`);

    fs.appendFileSync(jsonlPath, JSON.stringify(log) + "\n");

    const readableLog = formatReadableLog(log);
    fs.appendFileSync(readablePath, readableLog);

    const summary = generateSummary(log.session_id, metadata);
    fs.writeFileSync(summaryPath, summary);

    logToConsole(log);

    return res.status(200).json({
      success: true,
      files: {
        jsonl: jsonlPath,
        readable: readablePath,
        summary: summaryPath,
      },
    });
  } catch (error) {
    console.error("❌ Error saving log:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function formatReadableLog(log: any): string {
  return `
${"=".repeat(80)}
[${new Date(log.timestamp).toLocaleString()}] ${log.action_type}
${"-".repeat(80)}
${log.payload.text}
${log.payload.custom_action ? `Action: ${log.payload.custom_action}` : ""}
${log.payload.page_url ? `URL: ${log.payload.page_url}` : ""}
${
  log.payload.element_identifier
    ? `Element: ${log.payload.element_identifier}`
    : ""
}
${log.payload.endpoint ? `Endpoint: ${log.payload.endpoint}` : ""}
${log.payload.method ? `Method: ${log.payload.method}` : ""}
${log.payload.status ? `Status: ${log.payload.status}` : ""}
${
  log.payload.coordinates
    ? `Coordinates: (${log.payload.coordinates.x}, ${log.payload.coordinates.y})`
    : ""
}
${
  log.payload.data
    ? `\nData:\n${JSON.stringify(log.payload.data, null, 2)}`
    : ""
}
${"=".repeat(80)}
`;
}

function generateSummary(sessionId: string, metadata: any): string {
  const duration =
    new Date(metadata.lastActivity).getTime() -
    new Date(metadata.startTime).getTime();
  const durationMinutes = Math.floor(duration / 60000);
  const durationSeconds = Math.floor((duration % 60000) / 1000);

  return `
╔${"═".repeat(78)}╗
║${" ".repeat(25)}SESSION SUMMARY${" ".repeat(38)}║
╚${"═".repeat(78)}╝

Session ID: ${sessionId}

Time Range:
  Started:  ${new Date(metadata.startTime).toLocaleString()}
  Ended:    ${new Date(metadata.lastActivity).toLocaleString()}
  Duration: ${durationMinutes}m ${durationSeconds}s

Total Events: ${metadata.eventCount}

Events by Type:
${Object.entries(metadata.eventTypes)
  .map(([type, count]) => `  ${type.padEnd(15)} : ${count}`)
  .join("\n")}

${"─".repeat(80)}
Generated: ${new Date().toLocaleString()}
`;
}

function logToConsole(log: any): void {
  const shortSession = log.session_id.substring(8, 20);
  console.log(` [${shortSession}] ${log.payload.text}`);
}
