export type StatusIndicator = "none" | "minor" | "major" | "critical";

export type StatusComponent = {
  name: string;
  status: string;
};

export type StatusIncident = {
  name: string;
  status: string;
  impact: string;
  shortlink?: string;
};

export type HarborStatus = {
  description: string;
  indicator: StatusIndicator;
  components: StatusComponent[];
  incidents: StatusIncident[];
};

export async function fetchHarborStatus(): Promise<HarborStatus> {
  const res = await fetch("https://status.harness.io/api/v2/summary.json", {
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error("Could not read the Harness lighthouse.");
  const json = (await res.json()) as {
    status?: { description?: string; indicator?: string };
    components?: { name?: string; status?: string }[];
    incidents?: { name?: string; status?: string; impact?: string; shortlink?: string }[];
  };

  const seen = new Set<string>();
  const components = (json.components ?? [])
    .map((c) => ({ name: c.name || "Unknown", status: c.status || "operational" }))
    .filter((c) => {
      const key = `${c.name}:${c.status}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return {
    description: json.status?.description || "Unknown",
    indicator: (json.status?.indicator as StatusIndicator) || "none",
    components,
    incidents: (json.incidents ?? []).map((i) => ({
      name: i.name || "Incident",
      status: i.status || "investigating",
      impact: i.impact || "none",
      shortlink: i.shortlink,
    })),
  };
}
