import { fetchHarborStatus } from "@/lib/status";

export const revalidate = 120;

const BEAM: Record<string, string> = {
  none: "Steady beam. All systems operational — keep the channel.",
  minor: "The lamp flickers. Something on the platform is degraded.",
  major: "Heavy weather on the rocks. A major outage is in view.",
  critical: "The light is almost out. Critical impact — seek the status page.",
};

export default async function HomePage() {
  let error: string | null = null;
  let status = null;
  try {
    status = await fetchHarborStatus();
  } catch (err) {
    error = err instanceof Error ? err.message : "Fog ate the lighthouse.";
  }

  const indicator = status?.indicator ?? "none";
  const troubled = status?.components.filter((c) => c.status !== "operational") ?? [];
  const okCount = (status?.components.length ?? 0) - troubled.length;

  return (
    <div className={`page lighthouse-page beam-${indicator}`}>
      <div className="lighthouse-sky" aria-hidden="true">
        <div className="lighthouse-tower">
          <div className="lamp" />
          <div className="beam" />
        </div>
        <div className="lighthouse-sea" />
      </div>
      <main className="report">
        <p className="eyebrow">Public Harness status · no token</p>
        <h1>Lighthouse</h1>
        {error ? <p className="error">{error}</p> : null}
        {status ? (
          <>
            <p className="lede">{BEAM[indicator]}</p>
            <p className="meta">{status.description}</p>
            <section className="stats">
              <article>
                <span>Beam</span>
                <b>{indicator}</b>
              </article>
              <article>
                <span>Steady lamps</span>
                <b>{okCount}</b>
              </article>
              <article>
                <span>Flickering</span>
                <b>{troubled.length}</b>
              </article>
              <article>
                <span>Open incidents</span>
                <b>{status.incidents.length}</b>
              </article>
            </section>
            {status.incidents.length > 0 ? (
              <>
                <h2>Ships in the fog</h2>
                <ul className="forecast">
                  {status.incidents.map((incident) => (
                    <li key={incident.name} className="tile">
                      <div>
                        <strong>
                          {incident.shortlink ? (
                            <a href={incident.shortlink} target="_blank" rel="noreferrer">
                              {incident.name}
                            </a>
                          ) : (
                            incident.name
                          )}
                        </strong>
                        <p>
                          {incident.status} · {incident.impact} impact
                        </p>
                      </div>
                      <span>⚠️</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="meta">No open incidents on the public board.</p>
            )}
            {troubled.length > 0 ? (
              <>
                <h2>Flickering lamps</h2>
                <ul className="forecast">
                  {troubled.map((component) => (
                    <li key={component.name} className="tile">
                      <div>
                        <strong>{component.name}</strong>
                        <p>{component.status.replace(/_/g, " ")}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className="fineprint">
              Live from{" "}
              <a href="https://status.harness.io" target="_blank" rel="noreferrer">
                status.harness.io
              </a>
              . Anyone can look. No Harness account required.
            </p>
          </>
        ) : null}
      </main>
    </div>
  );
}
