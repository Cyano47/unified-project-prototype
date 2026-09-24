import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Button, Callout, Divider, Grid, H1, H2, Link, Pill, Row, Stack, Table, Text, useHostTheme } from "./ui";

/* DigitalOcean console palette. Used only inside the mock console, by request. */
const DO = {
  navy: "#031B4E",
  navyActive: "#1B3A78",
  navyText: "#C9D4EA",
  navyHeader: "#8FA3C8",
  blue: "#0069FF",
  blueTint: "#EAF2FF",
  text: "#1B1F24",
  text2: "#4D5B7C",
  text3: "#8690A2",
  border: "#DFE3EB",
  page: "#F5F7FA",
  white: "#FFFFFF",
  green: "#0B7A43",
  greenBg: "#E3F7EC",
  greenDot: "#15CD72",
  amber: "#8A5A00",
  amberBg: "#FFF4DB",
  amberDot: "#F5A623",
  red: "#B42318",
  redBg: "#FDECEC",
  redDot: "#E5484D",
  teal: "#13C4B8",
  font: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

type Tone = "ok" | "warn" | "bad" | "draft" | "info" | "neutral";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconName =
  | "droplet" | "db" | "spaces" | "app" | "lb" | "kb" | "agent" | "github" | "globe" | "check" | "chevron" | "dots"
  | "search" | "plus" | "bell" | "help" | "sun" | "shield" | "key" | "doc" | "sparkle" | "arrow" | "mail";

const PATHS: Record<IconName, string> = {
  droplet: "M8 1.5c2.5 3 4.5 5.4 4.5 8a4.5 4.5 0 0 1-9 0c0-2.6 2-5 4.5-8z",
  db: "M3 4c0-1.1 2.2-2 5-2s5 .9 5 2-2.2 2-5 2-5-.9-5-2zM3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2",
  spaces: "M8 2.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  app: "M4 3h8a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 12 13H4a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 4 3zM2.5 6h11",
  lb: "M8 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM3.5 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12.5 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM8 5v3M8 8l-4 3M8 8l4 3",
  kb: "M3 3h4a1 1 0 0 1 1 1v9a1 1 0 0 0-1-1H3zM13 3H9a1 1 0 0 0-1 1v9a1 1 0 0 1 1-1h4z",
  agent: "M5 5h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 2v3M6 9h.01M10 9h.01",
  github: "M8 1.5a6.5 6.5 0 0 0-2 12.7c.3 0 .4-.2.4-.4v-1.3c-1.8.4-2.2-.8-2.2-.8-.3-.8-.7-1-.7-1-.6-.4 0-.4 0-.4.6 0 1 .7 1 .7.6 1 1.5.7 1.9.5 0-.4.2-.7.4-.9-1.4-.2-3-.7-3-3.2 0-.7.3-1.3.7-1.7-.1-.2-.3-.9.1-1.8 0 0 .5-.2 1.8.7a6 6 0 0 1 3.2 0c1.3-.9 1.8-.7 1.8-.7.4.9.2 1.6.1 1.8.4.4.7 1 .7 1.7 0 2.5-1.5 3-3 3.2.2.2.4.6.4 1.1v1.7c0 .2.1.4.4.4A6.5 6.5 0 0 0 8 1.5z",
  globe: "M8 2.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM2.5 8h11M8 2.5c1.8 2 1.8 9 0 11M8 2.5c-1.8 2-1.8 9 0 11",
  check: "M3.5 8.5l3 3 6-7",
  chevron: "M4 6l4 4 4-4",
  dots: "M3.5 8h.01M8 8h.01M12.5 8h.01",
  search: "M7 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM10.5 10.5L14 14",
  plus: "M8 3v10M3 8h10",
  bell: "M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3zM6.5 14h3",
  help: "M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2zM6.5 6.5a1.5 1.5 0 1 1 2 1.4c-.4.2-.5.5-.5.9V9.5M8 11.5h.01",
  sun: "M8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1",
  shield: "M8 1.5l5 2v4c0 3.2-2.2 5.6-5 7-2.8-1.4-5-3.8-5-7v-4z",
  key: "M5 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM7 8.5l6-6M11 4.5l1.5 1.5",
  doc: "M4 1.5h5l3 3v10H4zM9 1.5v3h3",
  sparkle: "M8 2l1.4 3.6L13 7l-3.6 1.4L8 12l-1.4-3.6L3 7l3.6-1.4z",
  arrow: "M3 8h10M9 4l4 4-4 4",
  mail: "M2.5 4h11v8h-11zM2.5 4.5L8 9l5.5-4.5",
};

function Ico({ name, size = 16, color = "currentColor", width = 1.4 }: { name: IconName; size?: number; color?: string; width?: number }) {
  const filled = name === "github";
  const dots = name === "dots";
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, display: "block" }}>
      <path
        d={PATHS[name]}
        fill={filled ? color : "none"}
        stroke={filled ? "none" : color}
        strokeWidth={dots ? 2.6 : width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21v-3.6a5.4 5.4 0 1 0-5.4-5.4H3a9 9 0 1 1 9 9z" fill={DO.white} />
      <rect x="8.4" y="14.2" width="3.6" height="3.2" fill={DO.white} />
      <rect x="5.4" y="17.4" width="3" height="3" fill={DO.white} />
    </svg>
  );
}

function iconFor(kind: string): IconName {
  if (kind.startsWith("Droplet")) return "droplet";
  if (kind.includes("Postgres") || kind.includes("Valkey")) return "db";
  if (kind.startsWith("Spaces")) return "spaces";
  if (kind.startsWith("App Platform")) return "app";
  if (kind.startsWith("Load Balancer")) return "lb";
  if (kind.startsWith("Knowledge")) return "kb";
  if (kind.startsWith("Agent")) return "agent";
  return "doc";
}

/* ------------------------------------------------------------------ */
/* DO primitives                                                       */
/* ------------------------------------------------------------------ */

const s = (o: CSSProperties) => o;

function T({ children, size = 13, weight = 400, color = DO.text, style }: { children: ReactNode; size?: number; weight?: number; color?: string; style?: CSSProperties }) {
  return <span style={{ fontSize: size, fontWeight: weight, color, lineHeight: 1.45, ...style }}>{children}</span>;
}

function Btn({
  children, variant = "primary", onClick, disabled, full, icon,
}: { children: ReactNode; variant?: "primary" | "secondary" | "link" | "danger"; onClick?: () => void; disabled?: boolean; full?: boolean; icon?: IconName }) {
  const base: CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: full ? 38 : 32, padding: variant === "link" ? 0 : "0 14px",
    borderRadius: full ? 20 : 6, fontSize: 13, fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1,
    width: full ? "100%" : undefined, boxSizing: "border-box", whiteSpace: "nowrap", fontFamily: DO.font,
  };
  const v: Record<string, CSSProperties> = {
    primary: { background: DO.blue, color: DO.white, border: `1px solid ${DO.blue}` },
    secondary: { background: DO.white, color: DO.blue, border: `1px solid ${DO.border}` },
    link: { background: "transparent", color: DO.blue, border: "none", height: "auto" },
    danger: { background: DO.white, color: DO.red, border: `1px solid ${DO.border}` },
  };
  return (
    <div onClick={disabled ? undefined : onClick} style={{ ...base, ...v[variant] }}>
      {icon && <Ico name={icon} size={14} />}
      {children}
    </div>
  );
}

function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  const map: Record<Tone, [string, string, string]> = {
    ok: [DO.greenBg, DO.green, DO.greenDot],
    warn: [DO.amberBg, DO.amber, DO.amberDot],
    bad: [DO.redBg, DO.red, DO.redDot],
    draft: [DO.page, DO.text2, DO.text3],
    info: [DO.blueTint, DO.blue, DO.blue],
    neutral: [DO.page, DO.text2, DO.text3],
  };
  const [bg, fg, dot] = map[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, color: fg, fontSize: 11, fontWeight: 600, borderRadius: 12, padding: "2px 8px", whiteSpace: "nowrap", border: tone === "draft" ? `1px dashed ${DO.text3}` : "none" }}>
      <span style={{ width: 6, height: 6, borderRadius: 6, background: dot }} />
      {children}
    </span>
  );
}

function Card({ children, pad = 20, style }: { children: ReactNode; pad?: number; style?: CSSProperties }) {
  return <div style={{ background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, padding: pad, display: "flex", flexDirection: "column", gap: 14, ...style }}>{children}</div>;
}

function Banner({ tone, title, children }: { tone: "info" | "warn" | "bad" | "ok"; title: string; children?: ReactNode }) {
  const c = { info: [DO.blueTint, DO.blue], warn: [DO.amberBg, DO.amber], bad: [DO.redBg, DO.red], ok: [DO.greenBg, DO.green] }[tone];
  return (
    <div style={{ background: c[0], borderRadius: 8, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ color: c[1], paddingTop: 1 }}><Ico name={tone === "ok" ? "check" : tone === "info" ? "help" : "shield"} /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <T weight={600} color={c[1]}>{title}</T>
        {children && <T size={12} color={DO.text}>{children}</T>}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <T size={13} weight={600}>{label}</T>
      {children}
      {hint && <T size={12} color={DO.text3}>{hint}</T>}
    </div>
  );
}

function Input({ value, mono }: { value: string; mono?: boolean }) {
  return (
    <div style={{ border: `1px solid ${DO.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 13, color: DO.text, background: DO.white, fontFamily: mono ? "monospace" : DO.font, minHeight: 18 }}>
      {value}
    </div>
  );
}

function SelectBox({ value }: { value: string }) {
  return (
    <div style={{ border: `1px solid ${DO.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 13, color: DO.text, background: DO.white, display: "flex", alignItems: "center" }}>
      <span style={{ flex: 1 }}>{value}</span>
      <Ico name="chevron" size={14} color={DO.text2} />
    </div>
  );
}

function TextBox({ value }: { value: string }) {
  return <div style={{ border: `1px solid ${DO.border}`, borderRadius: 6, padding: "10px 12px", fontSize: 13, color: DO.text, background: DO.white, minHeight: 44, lineHeight: 1.5 }}>{value}</div>;
}

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width: 32, height: 18, borderRadius: 9, background: on ? DO.blue : "#C7CEDB", position: "relative", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 14, height: 14, borderRadius: 7, background: DO.white }} />
    </div>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <div style={{ width: 16, height: 16, borderRadius: 8, border: `1.5px solid ${on ? DO.blue : "#B5BECF"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {on && <div style={{ width: 8, height: 8, borderRadius: 4, background: DO.blue }} />}
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 12, color: DO.text2, background: DO.page, border: `1px solid ${DO.border}`, borderRadius: 14, padding: "3px 10px", whiteSpace: "nowrap" }}>{children}</span>;
}

function DTable({ headers, rows, tones }: { headers: string[]; rows: ReactNode[][]; tones?: (Tone | undefined)[] }) {
  return (
    <div style={{ border: `1px solid ${DO.border}`, borderRadius: 8, overflow: "hidden", background: DO.white }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`, background: DO.page, borderBottom: `1px solid ${DO.border}` }}>
        {headers.map((h) => (
          <div key={h} style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: DO.text2, textTransform: "uppercase", letterSpacing: 0.3 }}>{h}</div>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`, borderBottom: i < rows.length - 1 ? `1px solid ${DO.border}` : "none", alignItems: "center" }}>
          {r.map((c, j) => (
            <div key={j} style={{ padding: "10px 12px", fontSize: 12.5, color: DO.text, display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              {j === 0 && tones?.[i] && <span style={{ width: 6, height: 6, borderRadius: 6, flexShrink: 0, background: { ok: DO.greenDot, warn: DO.amberDot, bad: DO.redDot, info: DO.blue, draft: DO.text3, neutral: DO.text3 }[tones[i] as Tone] }} />}
              {c}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <T size={12.5} color={DO.text2} style={{ width: 140, flexShrink: 0 }}>{k}</T>
      <T size={12.5}>{v}</T>
    </div>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: "monospace", fontSize: 12, background: DO.page, border: `1px solid ${DO.border}`, borderRadius: 6, padding: "8px 10px", color: DO.text, whiteSpace: "pre-wrap" }}>{children}</div>;
}

function IconTile({ name, color = DO.blue, bg = DO.blueTint, size = 28 }: { name: IconName; color?: string; bg?: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Ico name={name} size={size * 0.55} />
    </div>
  );
}

function Stepper({ at }: { at: number }) {
  const steps = ["Start", "Understand", "Choose", "Review", "Approve"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
      {steps.map((st, i) => (
        <div key={st} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", background: i <= at ? DO.blue : DO.white, color: i <= at ? DO.white : DO.text3, border: i <= at ? "none" : `1px solid ${DO.border}` }}>
              {i < at ? <Ico name="check" size={12} width={2} /> : i + 1}
            </div>
            <T size={12.5} weight={i === at ? 600 : 400} color={i === at ? DO.text : DO.text3}>{st}</T>
          </div>
          {i < steps.length - 1 && <div style={{ width: 28, height: 1, background: DO.border }} />}
        </div>
      ))}
    </div>
  );
}

function PageHeader({ title, sub, crumb, right, icon }: { title: string; sub?: string; crumb?: string; right?: ReactNode; icon?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {icon && (
        <div style={{ width: 44, height: 44, borderRadius: 8, background: DO.teal, display: "flex", alignItems: "center", justifyContent: "center", color: DO.white }}>
          <Ico name="sparkle" size={22} color={DO.white} />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
        {crumb && <T size={12} color={DO.text3}>{crumb}</T>}
        <T size={24} weight={700} color={DO.navy}>{title}</T>
        {sub && <T size={13} color={DO.text2}>{sub}</T>}
      </div>
      {right}
    </div>
  );
}

function Tabs({ items, active }: { items: string[]; active: string }) {
  return (
    <div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${DO.border}` }}>
      {items.map((it) => (
        <div key={it} style={{ padding: "8px 2px", fontSize: 13, fontWeight: it === active ? 600 : 400, color: it === active ? DO.text : DO.text2, borderBottom: it === active ? `2px solid ${DO.blue}` : "2px solid transparent", marginBottom: -1 }}>
          {it}
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <T size={13} weight={600} color={DO.text}>{children}</T>;
}

/* ------------------------------------------------------------------ */
/* Scenarios                                                           */
/* ------------------------------------------------------------------ */

type ScenarioId = "health" | "fin" | "kit";
type Line = { name: string; kind: string; why: string; price: number; usage?: string; cli?: string };
type Guard = { id: string; name: string; what: string; price: number; priceText: string; defaultOn: boolean };

type Scenario = {
  id: ScenarioId;
  project: string;
  repo?: string;
  owner: string;
  context: string;
  found: [string, string, string][];
  env: string;
  purpose: string;
  signal?: { title: string; body: string };
  guards: Guard[];
  lines: Line[];
  hipaaLines?: Line[];
  swaps?: [string, string, string][];
  ask: string;
  pauseAt: number;
  usageEstimate: number;
  scopes: string[];
  hipaaScopes?: string[];
  proof: { q: string; a: string };
  hipaaProof?: { q: string; a: string };
};

const SCENARIOS: Record<ScenarioId, Scenario> = {
  health: {
    id: "health",
    project: "clinic-notes",
    repo: "brightpath/clinic-notes",
    owner: "priya@brightpath.health",
    context: "A two-person team built a visit-notes app for a small clinic network with a coding agent. Nothing runs on DigitalOcean yet.",
    found: [
      ["Web app", "package.json: next build / next start", "App Platform web service"],
      ["Postgres", "prisma/schema.prisma provider = postgresql", "Managed Postgres"],
      ["File uploads", "@aws-sdk/client-s3 in lib/upload.ts", "Spaces bucket (private)"],
      ["Notes search", "embeddings call in lib/search.ts", "Knowledge base"],
    ],
    env: "Production",
    purpose: "Web app with health records",
    signal: {
      title: "This looks like it stores health records",
      body: "Found patient_id, dob and diagnosis_code in prisma/schema.prisma, and the fhir-kit-client package. We suggest HIPAA mode. It changes which products the plan can use.",
    },
    guards: [
      { id: "hipaa", name: "HIPAA mode", what: "Uses only products on DigitalOcean's HIPAA-eligible list and swaps out the rest. Sign DigitalOcean's BAA (through Sales) before storing patient data.", price: 0, priceText: "$0", defaultOn: true },
      { id: "vpc", name: "Private networking and firewall", what: "Web and database Droplets on one VPC. Only 443 is open, on the load balancer. The database accepts traffic from web-1 only.", price: 0, priceText: "$0", defaultOn: true },
      { id: "backup", name: "Droplet backups", what: "Weekly backups of web-1 and db-1, kept 4 weeks. 20% of the Droplet price.", price: 7.2, priceText: "+$7.20/mo", defaultOn: true },
      { id: "cspm", name: "CSPM Basic on 2 workloads", what: "Checks web-1 and db-1 for open ports and weak settings, $5 per workload. Scans are manual today; the plan would run one after deploy and after every change.", price: 10, priceText: "+$10/mo", defaultOn: true },
    ],
    lines: [
      { name: "web", kind: "App Platform · 1 GB", why: "package.json has next build / next start", price: 12, cli: "doctl apps get clinic-notes" },
      { name: "postgres", kind: "Managed Postgres 16 · 1 GB", why: "Prisma provider is postgresql", price: 15.15, cli: "doctl databases get clinic-postgres" },
      { name: "uploads", kind: "Spaces bucket", why: "S3 client used in lib/upload.ts", price: 5 },
      { name: "notes-kb", kind: "Knowledge base + OpenSearch 2 GB", why: "Embeddings call in lib/search.ts", price: 19.6, usage: "embeddings from $0.009/1M tokens" },
    ],
    hipaaLines: [
      { name: "lb", kind: "Load Balancer", why: "Serves HTTPS and keeps web-1 off the public internet", price: 12 },
      { name: "web-1", kind: "Droplet · 2 GB", why: "Runs the Next.js app in Docker. App Platform is not HIPAA-eligible.", price: 12, cli: "doctl compute droplet get web-1" },
      { name: "db-1", kind: "Droplet · 4 GB + 50 GB Volume", why: "Postgres 16 with pgvector. Managed Databases are not HIPAA-eligible.", price: 29, cli: "doctl compute droplet get db-1" },
      { name: "uploads", kind: "Spaces bucket (private)", why: "S3 client used in lib/upload.ts. Spaces is eligible.", price: 5 },
    ],
    swaps: [
      ["App Platform web service", "Droplet behind a Load Balancer", "App Platform is not on the eligible list"],
      ["Managed Postgres", "Postgres on a Droplet with a Volume", "Managed Databases are not on the eligible list"],
      ["Knowledge base for note search", "pgvector inside db-1", "Knowledge Bases are not on the eligible list"],
      ["Spaces bucket", "Spaces bucket (no change)", "Eligible"],
    ],
    ask: "Deploy clinic-notes from GitHub. It stores patient notes, so keep it HIPAA-ready. Keep it under $80 a month.",
    pauseAt: 40,
    usageEstimate: 8,
    scopes: ["app:create", "database:create", "spaces:create", "genai:create", "vpc:create"],
    hipaaScopes: ["droplet:create", "load_balancer:create", "block_storage:create", "spaces:create", "vpc:create", "firewall:create"],
    proof: { q: "GET /api/health and one test note search", a: "clinic-notes-x7k2.ondigitalocean.app returned 200. Prisma migrations applied (11 tables). A search for \"follow-up in 2 weeks\" returned 3 test notes." },
    hipaaProof: { q: "GET https://notes.brightpath.health/api/health and one test note search", a: "Returned 200 through the load balancer. Prisma migrations applied (11 tables). A pgvector search for \"follow-up in 2 weeks\" returned 3 test notes. db-1 refused a connection from outside the VPC." },
  },
  fin: {
    id: "fin",
    project: "ledger-app",
    repo: "northgate/ledger-app",
    owner: "sam@northgate.dev",
    context: "An agency builds invoicing software for a client. They want to pick every resource themselves but still see price and posture.",
    found: [
      ["API", "Dockerfile + gunicorn in Procfile", "Droplet or App Platform"],
      ["Postgres", "django.db.backends.postgresql", "Managed Postgres"],
      ["Cache / queue", "celery + REDIS_URL", "Managed Valkey"],
    ],
    env: "Production",
    purpose: "Payments and invoicing",
    signal: {
      title: "This handles payment data",
      body: "Found the stripe and plaid packages and an iban column in migrations. Keep card data with Stripe so this app stays out of card-data scope. DigitalOcean's PCI-DSS attestation (SAQ-A) covers its admin environment, not your app.",
    },
    guards: [
      { id: "cspm", name: "CSPM Basic on 2 workloads", what: "Checks api-1 and ledger-db for open ports and weak settings, $5 per workload. Scans are manual today; the plan would run one after deploy and after every change.", price: 10, priceText: "+$10/mo", defaultOn: true },
      { id: "fw", name: "Cloud Firewall", what: "Only 443 open to the internet; SSH from your office IP only.", price: 0, priceText: "$0", defaultOn: true },
      { id: "vpc", name: "Private networking", what: "Droplet, database and Valkey on one VPC. Database accepts trusted sources only.", price: 0, priceText: "$0", defaultOn: true },
      { id: "backup", name: "Droplet backups", what: "Weekly backups kept 4 weeks.", price: 4.8, priceText: "+$4.80/mo", defaultOn: false },
    ],
    lines: [
      { name: "api-1", kind: "Droplet · 2 vCPU / 4 GB", why: "You picked it", price: 24, cli: "doctl compute droplet get api-1" },
      { name: "ledger-db", kind: "Managed Postgres 16 · 1 GB", why: "You picked it", price: 15.15, cli: "doctl databases get ledger-db" },
      { name: "jobs-cache", kind: "Managed Valkey · 1 GB", why: "You picked it", price: 15 },
    ],
    ask: "",
    pauseAt: 0,
    usageEstimate: 0,
    scopes: ["droplet:create", "database:create", "firewall:create", "vpc:create"],
    proof: { q: "GET https://api-1/health and a test Celery job", a: "api-1 returned 200 over HTTPS. Django migrations applied (38 tables). A test Celery job ran through jobs-cache in 1.2 s." },
  },
  kit: {
    id: "kit",
    project: "support-bot",
    owner: "maya@acme.io",
    context: "A founder has no repo yet. They want a support chatbot over their help docs and start from a written description.",
    found: [
      ["Chat app", "From your description", "App Platform"],
      ["Model", "From your description", "Agent Platform"],
      ["Docs search", "From your description", "Knowledge base"],
      ["Safety", "Customer-facing chat", "Guardrails"],
    ],
    env: "Production",
    purpose: "Customer support chatbot",
    guards: [
      { id: "sdd", name: "Sensitive data detection", what: "Stops customer emails and card numbers from appearing in answers.", price: 0, priceText: "$0.34/1M tokens", defaultOn: true },
      { id: "jb", name: "Jailbreak detection", what: "Blocks prompts that try to override your instructions.", price: 0, priceText: "$0.20/1M tokens", defaultOn: true },
      { id: "cm", name: "Content moderation", what: "Filters violent, sexual or self-harm content out of answers.", price: 0, priceText: "$0.20/1M tokens", defaultOn: true },
    ],
    lines: [
      { name: "chatbot", kind: "App Platform · 1 vCPU / 2 GB", why: "Hosts the chat widget and API", price: 25, cli: "doctl apps get support-bot" },
      { name: "agent", kind: "Agent Platform", why: "Answers questions; default model nemotron-3-super-120b", price: 0, usage: "$0.30/1M tokens" },
      { name: "help-kb", kind: "Knowledge base + OpenSearch 2 GB", why: "Indexes help.acme.io", price: 19.6, usage: "embeddings $0.04/1M tokens" },
    ],
    ask: "A support chatbot that answers from help.acme.io. Keep usage under $30 a month.",
    pauseAt: 30,
    usageEstimate: 6,
    scopes: ["app:create", "genai:create"],
    proof: { q: "How do I reset my password?", a: "Go to Settings, then Security, and choose Reset password. You will get an email within a minute. Source: help.acme.io/account/reset" },
  },
};

type Guards = Record<string, boolean>;

function linesFor(sc: Scenario, g: Guards): Line[] {
  return g.hipaa && sc.hipaaLines ? sc.hipaaLines : sc.lines;
}

function usageFor(sc: Scenario, g: Guards) {
  const has = linesFor(sc, g).some((l) => l.usage);
  return { pauseAt: has ? sc.pauseAt : 0, estimate: has ? sc.usageEstimate : 0 };
}

function money(n: number) {
  return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

function fixedTotal(sc: Scenario, g: Guards, extra: Line[] = []) {
  return [...linesFor(sc, g), ...extra].reduce((a, l) => a + l.price, 0) + sc.guards.filter((x) => g[x.id]).reduce((a, x) => a + x.price, 0);
}

/* ------------------------------------------------------------------ */
/* Resource map layouts (from the earlier Outcome Plans canvas)        */
/* ------------------------------------------------------------------ */

type MapNode = { id: string; x: number; y: number; external?: { title: string; kind: string; icon: IconName } };
type MapEdge = { from: string; to: string; label?: string };
type MapDef = { w: number; h: number; nodes: MapNode[]; edges: MapEdge[]; group: { x: number; y: number; w: number; h: number } };

const NW = 150;
const NH = 70;

const MAPS: Record<string, MapDef> = {
  "health-hipaa": {
    w: 860, h: 300,
    nodes: [
      { id: "internet", x: 14, y: 115, external: { title: "Internet", kind: "Clinic staff", icon: "globe" } },
      { id: "lb", x: 224, y: 115 },
      { id: "web-1", x: 444, y: 115 },
      { id: "db-1", x: 690, y: 40 },
      { id: "uploads", x: 690, y: 190 },
      { id: "worker-1", x: 444, y: 215 },
    ],
    edges: [
      { from: "internet", to: "lb", label: "HTTPS" },
      { from: "lb", to: "web-1", label: "VPC" },
      { from: "web-1", to: "db-1", label: "DATABASE_URL" },
      { from: "web-1", to: "uploads", label: "SPACES_KEY" },
      { from: "worker-1", to: "db-1", label: "jobs" },
    ],
    group: { x: 210, y: 14, w: 640, h: 278 },
  },
  health: {
    w: 860, h: 300,
    nodes: [
      { id: "internet", x: 14, y: 115, external: { title: "Internet", kind: "Clinic staff", icon: "globe" } },
      { id: "web", x: 224, y: 115 },
      { id: "postgres", x: 444, y: 40 },
      { id: "uploads", x: 444, y: 190 },
      { id: "notes-kb", x: 690, y: 190 },
    ],
    edges: [
      { from: "internet", to: "web" },
      { from: "web", to: "postgres", label: "DATABASE_URL" },
      { from: "web", to: "uploads" },
      { from: "uploads", to: "notes-kb", label: "indexed" },
    ],
    group: { x: 210, y: 14, w: 640, h: 278 },
  },
  fin: {
    w: 860, h: 300,
    nodes: [
      { id: "internet", x: 14, y: 115, external: { title: "Internet", kind: "Client's customers", icon: "globe" } },
      { id: "api-1", x: 224, y: 115 },
      { id: "ledger-db", x: 444, y: 40 },
      { id: "jobs-cache", x: 444, y: 190 },
      { id: "files", x: 690, y: 40 },
      { id: "lb-1", x: 690, y: 115 },
      { id: "api-2", x: 690, y: 190 },
    ],
    edges: [
      { from: "internet", to: "api-1", label: "443" },
      { from: "api-1", to: "ledger-db", label: "VPC" },
      { from: "api-1", to: "jobs-cache", label: "REDIS_URL" },
    ],
    group: { x: 210, y: 14, w: 640, h: 278 },
  },
  kit: {
    w: 860, h: 300,
    nodes: [
      { id: "users", x: 14, y: 90, external: { title: "Website visitors", kind: "Chat widget", icon: "globe" } },
      { id: "chatbot", x: 224, y: 90 },
      { id: "agent", x: 444, y: 90 },
      { id: "help-kb", x: 690, y: 90 },
      { id: "source", x: 690, y: 215, external: { title: "help.acme.io", kind: "Your help center", icon: "doc" } },
    ],
    edges: [
      { from: "users", to: "chatbot" },
      { from: "chatbot", to: "agent", label: "access key" },
      { from: "agent", to: "help-kb", label: "retrieve" },
      { from: "source", to: "help-kb", label: "crawl" },
    ],
    group: { x: 210, y: 14, w: 640, h: 180 },
  },
};

function mapKey(sc: Scenario, g: Guards) {
  return sc.id === "health" ? (g.hipaa ? "health-hipaa" : "health") : sc.id;
}

/* ------------------------------------------------------------------ */
/* Screens and paths                                                   */
/* ------------------------------------------------------------------ */

type ScreenId =
  | "home" | "start" | "github" | "analysis" | "compliance" | "mode" | "kits" | "ask" | "plan" | "manual"
  | "approve" | "deploy" | "project" | "add" | "diff" | "alertEmail" | "alertConsole" | "brief" | "pause" | "undo" | "export" | "agent";

const META: Record<ScreenId, { title: string; stage: string; note: string }> = {
  home: { title: "Projects home", stage: "Start", note: "One entry point. Launchpad becomes Starter kits in the nav and opens this same flow. The Create something new tiles on the project page become Add to this project." },
  start: { title: "Name and how to start", stage: "Start", note: "Replaces both the Create Project form and the Launchpad kit form. Environment type and purpose are inferred later instead of being required dropdowns." },
  github: { title: "Connect GitHub", stage: "Start", note: "Read-only access to the repos you pick. The repo already says what the app needs." },
  analysis: { title: "What we found", stage: "Understand", note: "Every detected part shows its evidence. Nothing is guessed silently. Data signals decide whether compliance suggestions appear." },
  compliance: { title: "Recommended protections", stage: "Understand", note: "HIPAA mode changes the plan: App Platform, Managed Databases and Knowledge Bases are not on DigitalOcean's HIPAA-eligible list, so it swaps to Droplets, a Volume and pgvector. Toggle it to see the swap and the price change." },
  mode: { title: "Choose a path", stage: "Choose", note: "The one real fork. VibeCloud proposes and keeps watch. Manual lets you pick every resource. Both share the Summary panel, compliance warnings and approval." },
  kits: { title: "Starter kits as examples", stage: "Start", note: "The three Launchpad kits survive as example prompts, not separate products." },
  ask: { title: "Ask with a cost ceiling", stage: "VibeCloud", note: "Plain language plus the ceiling in one sentence. Only region, size, model and pause point can change here." },
  plan: { title: "Priced plan", stage: "VibeCloud", note: "The resource map from the earlier canvas, in draft: dashed boxes are not created and cost $0. Click any box for why it exists and what it costs." },
  manual: { title: "Manual builder", stage: "Manual", note: "Today's Create menu, inside the project. Live price and warnings when a choice conflicts with a protection." },
  approve: { title: "Approve", stage: "Approve", note: "Nothing bills until this click. Exact scopes, a revocable plan credential, and the BAA status for HIPAA." },
  deploy: { title: "Deploy and verify", stage: "Approve", note: "Success means a real request returned a real answer. A failed setup removes everything it created." },
  project: { title: "Project page (after)", stage: "Keep running", note: "Resources grouped by the plan they serve. Map view is the resource map from the earlier canvas, now live; List view is the familiar DO resource list." },
  add: { title: "Add to this project", stage: "Keep running", note: "Same flow, entered from an existing project. Existing resources are context." },
  diff: { title: "Plan as a change", stage: "Keep running", note: "The map shows the new part dashed on top of what exists. Managed Valkey is skipped because it is not HIPAA-eligible." },
  alertEmail: { title: "A check fails: email", stage: "Keep running", note: "Day 9. The owner hears within the hour: which part, the last change, who made it, and a priced fix." },
  alertConsole: { title: "A check fails: console", stage: "Keep running", note: "The broken part is red on the map. The fix is a draft with a price and undo." },
  brief: { title: "Weekly brief", stage: "Keep running", note: "Health, cost vs estimate, and upkeep. Every fix is a draft that says whether it can be undone." },
  pause: { title: "Pause point reached", stage: "Keep running", note: "Usage inside the plan stops growing and the app stays up. Not a bill cap." },
  undo: { title: "History and undo", stage: "Keep running", note: "Every change has a 72-hour undo window." },
  export: { title: "Export and release", stage: "Leave", note: "Export is a Terraform snapshot. Release ends the plan and leaves every resource running." },
  agent: { title: "Same plan from an agent", stage: "Any surface", note: "A coding agent calls plan_outcome on the DO MCP server and gets the same priced draft." },
};

type PathId = "A" | "B" | "C" | "D" | "E" | "F";
type PathDef = { id: PathId; name: string; scenario: ScenarioId; start: "github" | "describe" | "empty"; mode: "vibe" | "manual"; steps: ScreenId[] };

const FLOWS: PathDef[] = [
  { id: "A", name: "Health repo · VibeCloud · HIPAA", scenario: "health", start: "github", mode: "vibe", steps: ["home", "start", "github", "analysis", "compliance", "mode", "ask", "plan", "approve", "deploy", "project"] },
  { id: "B", name: "Fintech repo · Manual · CSPM", scenario: "fin", start: "github", mode: "manual", steps: ["home", "start", "github", "analysis", "compliance", "mode", "manual", "approve", "deploy", "project"] },
  { id: "C", name: "No repo · Starter kit", scenario: "kit", start: "describe", mode: "vibe", steps: ["home", "start", "kits", "analysis", "compliance", "ask", "plan", "approve", "deploy", "project"] },
  { id: "D", name: "Day 9 to month 3", scenario: "kit", start: "describe", mode: "vibe", steps: ["project", "alertEmail", "alertConsole", "brief", "pause", "undo", "export"] },
  { id: "E", name: "Coding agent", scenario: "health", start: "github", mode: "vibe", steps: ["agent", "approve", "project"] },
  { id: "F", name: "Add to existing project", scenario: "health", start: "github", mode: "vibe", steps: ["project", "add", "diff", "approve", "project"] },
];

type Ctx = {
  sc: Scenario;
  path: PathDef;
  next: () => void;
  guards: Guards;
  setGuard: (id: string, v: boolean) => void;
  mode: "vibe" | "manual";
  setMode: (m: "vibe" | "manual") => void;
  missingScope: boolean;
  setMissingScope: (v: boolean) => void;
  extra: Line[];
  addExtra: (l: Line) => void;
  step: number;
};

/* ------------------------------------------------------------------ */
/* Resource map                                                        */
/* ------------------------------------------------------------------ */

type NodeState = [Tone, string];

function ResourceMap({
  map, lines, mode, overrides, draftIds, groupLabel, groupRight, meter, selected, onSelect,
}: {
  map: MapDef;
  lines: Line[];
  mode: "draft" | "live";
  overrides?: Record<string, NodeState>;
  draftIds?: string[];
  groupLabel: string;
  groupRight: string;
  meter?: { text: string; pct: number; warn?: boolean };
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const byLine: Record<string, Line> = {};
  lines.forEach((l) => (byLine[l.name] = l));
  const nodes = map.nodes.filter((n) => n.external || byLine[n.id]);
  const pos: Record<string, MapNode> = {};
  nodes.forEach((n) => (pos[n.id] = n));
  const edges = map.edges.filter((e) => pos[e.from] && pos[e.to]);
  const g = map.group;
  const groupDraft = mode === "draft";

  const state = (id: string): NodeState => {
    if (overrides?.[id]) return overrides[id];
    if (mode === "draft" || draftIds?.includes(id)) return ["draft", "Not created · $0 until approved"];
    return ["ok", "Healthy"];
  };

  const geo = (e: MapEdge) => {
    const a = pos[e.from];
    const b = pos[e.to];
    if (Math.abs(a.x - b.x) < 10) {
      const x = a.x + NW / 2;
      const up = b.y < a.y;
      const y1 = up ? a.y : a.y + NH;
      const y2 = up ? b.y + NH : b.y;
      return { d: `M ${x} ${y1} L ${x} ${y2}`, lx: x + 26, ly: (y1 + y2) / 2 + 4 };
    }
    const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2, mx = (x1 + x2) / 2;
    return { d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, lx: mx, ly: (y1 + y2) / 2 - 6 };
  };

  return (
    <div
      onClick={(ev: { target: unknown; currentTarget: unknown }) => {
        if (ev.target === ev.currentTarget) onSelect(null);
      }}
      style={{ position: "relative", width: map.w, height: map.h, background: DO.page, border: `1px solid ${DO.border}`, borderRadius: 8, overflow: "hidden", flexShrink: 0, backgroundImage: `radial-gradient(${DO.border} 1px, transparent 1px)`, backgroundSize: "16px 16px" }}
    >
      <div style={{ position: "absolute", left: g.x, top: g.y, width: g.w, height: g.h, borderRadius: 10, border: `1px ${groupDraft ? "dashed" : "solid"} ${groupDraft ? "#9FB3D9" : DO.border}`, background: groupDraft ? "rgba(0,105,255,0.03)" : DO.white, boxSizing: "border-box", padding: "8px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <T size={11} weight={600} color={DO.text2}>{groupLabel}</T>
          <T size={11} color={DO.text3}>{groupRight}</T>
        </div>
        {meter && (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 8 }}>
            <T size={10.5} color={DO.text3}>{meter.text}</T>
            <div style={{ height: 4, borderRadius: 2, background: DO.border, marginTop: 3 }}>
              <div style={{ height: 4, borderRadius: 2, width: `${Math.max(meter.pct, 1)}%`, background: meter.warn ? DO.amberDot : DO.greenDot }} />
            </div>
          </div>
        )}
      </div>
      <svg width={map.w} height={map.h} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {edges.map((e) => {
          const p = geo(e);
          const dashed = state(e.to)[0] === "draft" || state(e.from)[0] === "draft";
          return (
            <g key={`${e.from}-${e.to}`}>
              <path d={p.d} fill="none" stroke={dashed ? "#9FB3D9" : "#8FA0BF"} strokeWidth={1.2} strokeDasharray={dashed ? "4 4" : undefined} />
              {e.label && <text x={p.lx} y={p.ly} fontSize={9.5} fill={DO.text3} textAnchor="middle" fontFamily={DO.font} stroke={DO.page} strokeWidth={3} paintOrder="stroke">{e.label}</text>}
            </g>
          );
        })}
      </svg>
      {nodes.map((n) => {
        const line = byLine[n.id];
        const ext = n.external;
        const [tone, text] = ext ? (["neutral", ext.kind] as NodeState) : state(n.id);
        const draft = tone === "draft";
        const sel = selected === n.id;
        const kind = ext ? "External" : line.kind;
        const icon = ext ? ext.icon : iconFor(line.kind);
        const dot = { ok: DO.greenDot, warn: DO.amberDot, bad: DO.redDot, draft: "transparent", info: DO.blue, neutral: DO.text3 }[tone];
        return (
          <div
            key={n.id}
            onClick={() => !ext && onSelect(sel ? null : n.id)}
            style={{
              position: "absolute", left: n.x, top: n.y, width: NW, height: NH, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8,
              background: draft ? "#FAFCFF" : DO.white, cursor: ext ? "default" : "pointer", display: "flex", flexDirection: "column", gap: 3,
              border: sel ? `2px solid ${DO.blue}` : `1px ${draft ? "dashed" : "solid"} ${tone === "bad" ? DO.redDot : draft ? "#9FB3D9" : DO.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <IconTile name={icon} size={20} color={ext ? DO.text2 : DO.blue} bg={ext ? DO.page : DO.blueTint} />
              <T size={12.5} weight={600} color={draft ? DO.text2 : DO.text} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ext ? ext.title : n.id}</T>
            </div>
            <T size={10.5} color={DO.text3} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{kind}</T>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: "auto" }}>
              {!ext && <span style={{ width: 6, height: 6, borderRadius: 6, background: dot, border: draft ? `1px dashed ${DO.text3}` : "none", flexShrink: 0 }} />}
              <T size={10.5} color={tone === "bad" ? DO.red : DO.text2} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ext ? "" : text}</T>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NodeDrawer({ line, stateText, onClose }: { line: Line; stateText: string; onClose: () => void }) {
  return (
    <div style={{ width: 250, flexShrink: 0, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 10, alignSelf: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconTile name={iconFor(line.kind)} size={26} />
        <T size={14} weight={700} style={{ flex: 1 }}>{line.name}</T>
        <Btn variant="link" onClick={onClose}>Close</Btn>
      </div>
      <T size={12} color={DO.text2}>{line.kind}</T>
      <div style={{ height: 1, background: DO.border }} />
      <KV k="Status" v={stateText} />
      <KV k="Why it exists" v={line.why} />
      <KV k="Cost" v={`${line.price ? `${money(line.price)}/mo` : "$0 fixed"}${line.usage ? ` + ${line.usage}` : ""}`} />
      {line.cli && (
        <>
          <T size={11} weight={600} color={DO.text3} style={{ textTransform: "uppercase", letterSpacing: 0.3 }}>Same object elsewhere</T>
          <Mono>{line.cli}</Mono>
        </>
      )}
    </div>
  );
}

function MapWithDrawer(props: {
  map: MapDef; lines: Line[]; mode: "draft" | "live"; overrides?: Record<string, NodeState>; draftIds?: string[];
  groupLabel: string; groupRight: string; meter?: { text: string; pct: number; warn?: boolean };
}) {
  const [sel, setSel] = useState<string | null>(null);
  const line = props.lines.find((l) => l.name === sel);
  const st = sel && props.overrides?.[sel] ? props.overrides[sel][1] : props.mode === "draft" || (sel && props.draftIds?.includes(sel)) ? "Not created · $0 until approved" : "Healthy";
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
      <ResourceMap {...props} selected={sel} onSelect={setSel} />
      {line && <NodeDrawer line={line} stateText={st} onClose={() => setSel(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Summary panel (Launchpad style)                                     */
/* ------------------------------------------------------------------ */

function Summary({ sc, guards, cta, onCta, extra, disabled }: { sc: Scenario; guards: Guards; cta?: string; onCta?: () => void; extra?: Line[]; disabled?: boolean }) {
  const lines = [...linesFor(sc, guards), ...(extra ?? [])];
  const onGuards = sc.guards.filter((x) => guards[x.id]);
  const u = usageFor(sc, guards);
  const total = fixedTotal(sc, guards, extra);
  return (
    <div style={{ width: 260, flexShrink: 0, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, alignSelf: "flex-start", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${DO.border}` }}>
        <T size={14} weight={700}>Summary</T>
      </div>
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {lines.map((l) => (
          <div key={l.name} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ color: DO.text2, paddingTop: 2 }}><Ico name={iconFor(l.kind)} size={15} /></div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <T size={12.5} weight={600}>{l.name}</T>
              <T size={11.5} color={DO.text3}>{l.kind}</T>
              {l.usage && <T size={11.5} color={DO.text3}>{l.usage}</T>}
            </div>
            <T size={12.5} weight={600}>{l.price ? `${money(l.price)}/mo` : "Variable"}</T>
          </div>
        ))}
        {onGuards.length > 0 && <div style={{ height: 1, background: DO.border }} />}
        {onGuards.map((x) => (
          <div key={x.id} style={{ display: "flex", gap: 10 }}>
            <div style={{ color: DO.text2, paddingTop: 2 }}><Ico name="shield" size={15} /></div>
            <T size={12} color={DO.text2} style={{ flex: 1 }}>{x.name}</T>
            <T size={12} color={DO.text2}>{x.priceText}</T>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${DO.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex" }}>
          <T size={13} color={DO.text2} style={{ flex: 1 }}>Monthly cost</T>
          <T size={13} weight={700}>{`${money(total)}/mo${u.pauseAt ? " + usage" : ""}`}</T>
        </div>
        {u.pauseAt > 0 && <T size={11.5} color={DO.text3}>{`Usage expected about ${money(u.estimate)}. Pauses at ${money(u.pauseAt)}; the app stays up.`}</T>}
        {guards.hipaa && (
          <>
            <Badge tone="ok">Every part HIPAA-eligible</Badge>
            <Badge tone="warn">BAA not signed yet</Badge>
          </>
        )}
        {sc.hipaaLines && !guards.hipaa && <Badge tone="bad">3 parts can't hold patient data</Badge>}
        <T size={11.5} color={DO.text3}>
          Nothing bills until you approve. By selecting Approve, I agree to the DigitalOcean <span style={{ color: DO.blue }}>Terms of Service</span>.
        </T>
        {cta && <Btn full onClick={onCta} disabled={disabled}>{cta}</Btn>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Frames                                                              */
/* ------------------------------------------------------------------ */

function NavItem({ label, active, badge, icon, dim }: { label: string; active?: boolean; badge?: string; icon?: ReactNode; dim?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", margin: "0 6px", borderRadius: 4, background: active ? DO.navyActive : "transparent" }}>
      {icon}
      <span style={{ fontSize: 12.5, color: active ? DO.white : dim ? DO.navyHeader : DO.navyText, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      {badge && <span style={{ fontSize: 9, fontWeight: 700, color: DO.navy, background: "#9FE6FF", borderRadius: 3, padding: "1px 4px" }}>{badge}</span>}
    </div>
  );
}

function NavHeader({ label, open }: { label: string; open?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "12px 20px 4px", color: DO.navyHeader }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, flex: 1 }}>{label}</span>
      <div style={{ transform: open ? "rotate(180deg)" : "none" }}><Ico name="chevron" size={12} color={DO.navyHeader} /></div>
    </div>
  );
}

function ConsoleFrame({ children, active, project }: { children: ReactNode; active: string; project?: string }) {
  const projects = ["first-project", "NewsAgent", ...(project && project !== "NewsAgent" ? [project] : [])];
  return (
    <div style={{ fontFamily: DO.font, border: `1px solid ${DO.border}`, borderRadius: 10, overflow: "hidden", display: "flex", minHeight: 700, background: DO.page, color: DO.text }}>
      <div style={{ width: 176, flexShrink: 0, background: DO.navy, display: "flex", flexDirection: "column", paddingBottom: 16 }}>
        <div style={{ padding: "14px 18px 10px" }}><DoLogo /></div>
        <NavItem label="Home" active={active === "Home"} />
        <NavItem label="Starter kits" active={active === "Starter kits"} />
        <NavHeader label="PROJECTS" open />
        <NavItem
          label="New Project"
          active={active === "New project"}
          icon={<span style={{ width: 16, height: 16, borderRadius: 3, background: DO.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico name="plus" size={11} color={DO.white} width={2} /></span>}
        />
        {projects.map((p) => <NavItem key={p} label={p} active={active === p} />)}
        <NavHeader label="FAVORITES" open />
        <NavItem label="Star Your Favorite" dim />
        <NavHeader label="MANAGED AGENTS" open />
        <NavItem label="Harness Runtime" badge="NEW" />
        <NavItem label="Action Gateway" badge="NEW" />
        {["INFERENCE ENGINE", "DATA & LEARNING", "CORE CLOUD", "MARKETPLACE", "SECURITY", "ACCOUNT"].map((h) => <NavHeader key={h} label={h} />)}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ height: 52, background: DO.white, borderBottom: `1px solid ${DO.border}`, display: "flex", alignItems: "center", gap: 14, padding: "0 18px" }}>
          <div style={{ width: 280, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${DO.border}`, borderRadius: 18, padding: "6px 12px", color: DO.text3 }}>
            <Ico name="search" size={13} />
            <span style={{ fontSize: 12 }}>Search by resource name or public IP (Cmd+B)</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: DO.blue, color: DO.white, borderRadius: 16, padding: "6px 12px", fontSize: 12.5, fontWeight: 600 }}>
            Create <Ico name="chevron" size={12} color={DO.white} />
          </div>
          <div style={{ color: DO.text2, display: "flex", gap: 12 }}>
            <Ico name="help" size={17} />
            <Ico name="bell" size={17} />
            <Ico name="sun" size={17} />
          </div>
          <T size={12.5} color={DO.text2}>Test</T>
          <div style={{ width: 26, height: 26, borderRadius: 13, background: DO.blue, color: DO.white, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>T</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${DO.blue}`, color: DO.blue, borderRadius: 16, padding: "5px 12px", fontSize: 12.5, fontWeight: 600 }}>
            <Ico name="sparkle" size={13} /> AI Assistant
          </div>
        </div>
        <div style={{ padding: "28px 36px 70px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 1060, display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
        </div>
        <div style={{ position: "absolute", right: 16, bottom: 14, background: DO.blue, color: DO.white, borderRadius: 18, padding: "7px 14px", fontSize: 12, fontWeight: 600 }}>Share Feedback</div>
      </div>
    </div>
  );
}

function EmailFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: DO.font, border: `1px solid ${DO.border}`, borderRadius: 10, overflow: "hidden", minHeight: 700, background: "#F6F8FC", color: DO.text }}>
      <div style={{ height: 48, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: `1px solid ${DO.border}`, background: DO.white }}>
        <Ico name="mail" size={18} color={DO.text2} />
        <T size={14} weight={600} color={DO.text2}>Inbox</T>
      </div>
      <div style={{ padding: 28, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 600, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ background: DO.navy, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <DoLogo size={20} />
            <T size={13} weight={600} color={DO.white}>DigitalOcean</T>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function IdeFrame({ side }: { side: ReactNode }) {
  const bg = "#181818";
  const fg = "#CCCCCC";
  return (
    <div style={{ fontFamily: DO.font, border: "1px solid #2B2B2B", borderRadius: 10, overflow: "hidden", minHeight: 700, display: "flex", background: bg, color: fg }}>
      <div style={{ flex: 1, minWidth: 0, borderRight: "1px solid #2B2B2B" }}>
        <div style={{ height: 36, borderBottom: "1px solid #2B2B2B", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 12, color: "#9D9D9D" }}>clinic-notes · prisma/schema.prisma</div>
        <div style={{ padding: 16, fontFamily: "monospace", fontSize: 12, lineHeight: "20px", color: "#9CDCFE", whiteSpace: "pre" }}>
          {"model Visit {\n  id             String   @id\n  patient_id     String\n  dob            DateTime\n  diagnosis_code String\n  notes          String\n  embedding      Unsupported(\"vector\")\n}\n"}
        </div>
      </div>
      <div style={{ width: 420, flexShrink: 0, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>{side}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screens: start, understand, choose                                  */
/* ------------------------------------------------------------------ */

type SP = { ctx: Ctx };

function Centered({ children, width = 640 }: { children: ReactNode; width?: number }) {
  return <div style={{ width: "100%", maxWidth: width, alignSelf: "center", display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>;
}

function OptionCard({ on, onClick, icon, title, body, tag }: { on: boolean; onClick?: () => void; icon: IconName; title: string; body: string; tag?: string }) {
  return (
    <div onClick={onClick} style={{ flex: 1, minWidth: 0, display: "flex", gap: 12, alignItems: "flex-start", padding: 16, borderRadius: 8, background: DO.white, cursor: onClick ? "pointer" : "default", border: on ? `2px solid ${DO.blue}` : `1px solid ${DO.border}` }}>
      <Radio on={on} />
      <IconTile name={icon} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <T weight={600}>{title}</T>
          {tag && <Badge tone="info">{tag}</Badge>}
        </div>
        <T size={12} color={DO.text2}>{body}</T>
      </div>
    </div>
  );
}

function HomeScreen({ ctx }: SP) {
  const rows = [
    ["first-project", "Default project", "2 Droplets, 1 Space", "Manual"],
    ["NewsAgent", "Agent that summarizes the news", "App, agent, knowledge base", "VibeCloud plan"],
  ];
  return (
    <ConsoleFrame active="Home">
      <PageHeader title="Projects" sub="Every project starts the same way: connect a repo, describe what you want, or start empty." right={<Btn icon="plus" onClick={ctx.next}>New project</Btn>} />
      <Banner tone="info" title="Launchpad is now Starter kits">Starter kits open the same New project flow with a description already filled in. Nothing to learn twice.</Banner>
      <DTable
        headers={["Project", "Purpose", "Resources", "Managed by"]}
        rows={rows.map((r) => [<T weight={600} color={DO.blue}>{r[0]}</T>, r[1], r[2], <Badge tone={r[3] === "Manual" ? "neutral" : "info"}>{r[3]}</Badge>])}
      />
      <SectionLabel>Start from an example</SectionLabel>
      <div style={{ display: "flex", gap: 12 }}>
        {[["agent", "Customer support chatbot"], ["kb", "RAG knowledge assistant"], ["app", "Web app with database"]].map(([ic, t]) => (
          <Card key={t} pad={14} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <IconTile name={ic as IconName} />
            <T weight={600} size={12.5}>{t}</T>
          </Card>
        ))}
      </div>
    </ConsoleFrame>
  );
}

function StartScreen({ ctx }: SP) {
  const st = ctx.path.start;
  return (
    <ConsoleFrame active="New project">
      <Stepper at={0} />
      <Centered>
        <T size={24} weight={700} color={DO.navy} style={{ textAlign: "center" }}>Create new project</T>
        <Card>
          <Field label="Project name"><Input value={ctx.sc.project} /></Field>
          <Field label="Description (optional)"><Input value="" /></Field>
          <SectionLabel>How do you want to start?</SectionLabel>
          <OptionCard on={st === "github"} icon="github" title="Connect a GitHub repo" tag="Recommended" body="We read the repo to find what the app needs: runtime, database, storage, and any sensitive data." />
          <OptionCard on={st === "describe"} icon="sparkle" title="Describe it, or pick a starter kit" body="Write what you want in a sentence. Starter kits are pre-filled descriptions." />
          <OptionCard on={st === "empty"} icon="plus" title="Start empty" body="Create the project and add resources yourself from the Create menu." />
          <T size={12} color={DO.text3}>Environment and purpose are no longer required here. We infer them and you can change them on the next step.</T>
          <Btn full onClick={ctx.next}>Continue</Btn>
          <div style={{ textAlign: "center" }}><Btn variant="link">Cancel</Btn></div>
        </Card>
      </Centered>
    </ConsoleFrame>
  );
}

function GithubScreen({ ctx }: SP) {
  const repo = ctx.sc.repo ?? "";
  const org = repo.split("/")[0];
  const repos = [repo, `${org}/marketing-site`, `${org}/infra-scripts`];
  return (
    <ConsoleFrame active="New project">
      <Stepper at={0} />
      <Centered width={560}>
        <Card>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <IconTile name="github" color={DO.white} bg={DO.text} size={36} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <T size={16} weight={700}>Connect GitHub</T>
              <T size={12} color={DO.text2}>{`Connected as ${ctx.sc.owner} · organization ${org}`}</T>
            </div>
          </div>
          <SectionLabel>Pick a repository</SectionLabel>
          {repos.map((r, i) => (
            <div key={r} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 6, border: i === 0 ? `2px solid ${DO.blue}` : `1px solid ${DO.border}` }}>
              <Radio on={i === 0} />
              <T weight={i === 0 ? 600 : 400} style={{ flex: 1 }}>{r}</T>
              <T size={12} color={DO.text3}>{["main · 2 hours ago", "main · 3 weeks ago", "main · 4 months ago"][i]}</T>
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["Read code and metadata of the repos you pick", "No write access. We never push to your repo", "Revoke any time in Settings > Integrations"].map((p) => (
              <div key={p} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Ico name="check" size={14} color={DO.green} width={2} />
                <T size={12.5} color={DO.text2}>{p}</T>
              </div>
            ))}
          </div>
          <Btn full onClick={ctx.next}>{`Continue with ${repo}`}</Btn>
        </Card>
      </Centered>
    </ConsoleFrame>
  );
}

function AnalysisScreen({ ctx }: SP) {
  const sc = ctx.sc;
  return (
    <ConsoleFrame active="New project">
      <Stepper at={1} />
      <PageHeader crumb={`New project · ${sc.project}`} title={sc.repo ? `What we found in ${sc.repo}` : "What we understood"} sub={sc.repo ? "Every part below has evidence from the repo. Change anything that's wrong." : "From your description. Change anything that's wrong."} />
      <DTable headers={["Part", "Evidence", "Suggested product"]} rows={sc.found.map((f) => [<T weight={600}>{f[0]}</T>, <T size={12} color={DO.text2} style={{ fontFamily: "monospace" }}>{f[1]}</T>, f[2]])} tones={sc.found.map(() => "ok")} />
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}><Field label="Environment" hint="Inferred: the repo has a production branch and a custom domain."><SelectBox value={sc.env} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Purpose" hint="Inferred from the code. Used to suggest protections."><SelectBox value={sc.purpose} /></Field></div>
      </div>
      {sc.signal && <Banner tone="warn" title={sc.signal.title}>{sc.signal.body}</Banner>}
      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={ctx.next}>Continue</Btn>
        <Btn variant="secondary">Edit parts</Btn>
      </div>
    </ConsoleFrame>
  );
}

function ComplianceScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const title = sc.id === "health" ? "Recommended protections for health records" : sc.id === "fin" ? "Recommended protections for payment data" : "Recommended protections for a public chatbot";
  return (
    <ConsoleFrame active="New project">
      <Stepper at={1} />
      <PageHeader crumb={`New project · ${sc.project}`} title={title} sub="On by default because of what we found. Each one shows its price." />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
          {sc.guards.map((x) => (
            <Card key={x.id} pad={16} style={{ flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
              <IconTile name="shield" color={g[x.id] ? DO.green : DO.text3} bg={g[x.id] ? DO.greenBg : DO.page} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <T weight={600}>{x.name}</T>
                  <T size={12} color={DO.text3}>{x.priceText}</T>
                </div>
                <T size={12.5} color={DO.text2}>{x.what}</T>
              </div>
              <Switch on={!!g[x.id]} onChange={(v) => ctx.setGuard(x.id, v)} />
            </Card>
          ))}
          {sc.swaps && g.hipaa && (
            <>
              <SectionLabel>What HIPAA mode changes in the plan</SectionLabel>
              <DTable headers={["Would have used", "Uses instead", "Why"]} rows={sc.swaps.map((r) => [r[0], <T weight={600}>{r[1]}</T>, <T size={12} color={DO.text2}>{r[2]}</T>])} tones={sc.swaps.map((r) => (r[2] === "Eligible" ? "ok" : "warn"))} />
            </>
          )}
          {sc.swaps && !g.hipaa && (
            <Banner tone="bad" title="App Platform, Managed Postgres and the knowledge base can't hold patient data">They are not on DigitalOcean's HIPAA-eligible list. Keep HIPAA mode off only if this app will never store real patient records.</Banner>
          )}
          {sc.id === "fin" && <Banner tone="info" title="Scans are manual in CSPM today">The plan runs a scan after deploy and after every change. Hourly scanning would need CSPM to support scheduled scans.</Banner>}
          <div><Btn onClick={ctx.next}>Continue</Btn></div>
        </div>
        <Summary sc={sc} guards={g} />
      </div>
    </ConsoleFrame>
  );
}

function ModeScreen({ ctx }: SP) {
  const m = ctx.mode;
  return (
    <ConsoleFrame active="New project">
      <Stepper at={2} />
      <Centered width={820}>
        <T size={24} weight={700} color={DO.navy} style={{ textAlign: "center" }}>How should this project be built?</T>
        <div style={{ display: "flex", gap: 14 }}>
          <OptionCard on={m === "vibe"} onClick={() => ctx.setMode("vibe")} icon="sparkle" title="VibeCloud" tag="Recommended" body="Say the outcome and a cost ceiling. We propose a priced plan, create it after you approve, check it hourly and send a weekly brief." />
          <OptionCard on={m === "manual"} onClick={() => ctx.setMode("manual")} icon="dots" title="Manual" body="Pick each resource yourself from the Create menu. You still get the Summary panel, protection warnings and one approval." />
        </div>
        <DTable
          headers={["", "VibeCloud", "Manual"]}
          rows={[
            ["Who picks resources", "We propose, you approve", "You"],
            ["Price before anything bills", "Yes", "Yes"],
            ["Protections from the previous step", "Built into the plan", "Warnings when a choice conflicts"],
            ["Hourly checks and weekly brief", "Yes", "No"],
            ["Undo and Terraform export", "Yes", "Export only"],
          ]}
        />
        {m !== ctx.path.mode && <Banner tone="info" title={`This path continues as ${ctx.path.mode === "vibe" ? "VibeCloud" : "Manual"}`}>Pick the other path at the top of the canvas to walk through that version.</Banner>}
        <Btn full onClick={ctx.next}>Continue</Btn>
      </Centered>
    </ConsoleFrame>
  );
}

function KitsScreen({ ctx }: SP) {
  const kits: [string, string, IconName[], string][] = [
    ["Customer support chatbot", "Answers from your help center with guardrails on.", ["app", "agent", "kb"], "From $44.60/mo + usage"],
    ["RAG knowledge assistant", "Search and chat over your own documents.", ["agent", "kb", "spaces"], "From $24.60/mo + usage"],
    ["Web app with database", "A web service and a managed Postgres.", ["app", "db"], "From $27.15/mo"],
  ];
  return (
    <ConsoleFrame active="Starter kits">
      <PageHeader title="Starter kits" sub="Examples of what a project can be. Picking one fills in the description; the rest of the flow is the same." />
      <div style={{ display: "flex", gap: 14 }}>
        {kits.map(([t, d, ics, p], i) => (
          <div key={t} onClick={i === 0 ? ctx.next : undefined} style={{ flex: 1, background: DO.white, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 10, cursor: i === 0 ? "pointer" : "default", border: i === 0 ? `2px solid ${DO.blue}` : `1px solid ${DO.border}` }}>
            <div style={{ display: "flex", gap: 6 }}>{ics.map((ic) => <IconTile key={ic} name={ic} size={26} />)}</div>
            <T size={15} weight={700}>{t}</T>
            <T size={12.5} color={DO.text2}>{d}</T>
            <T size={12} color={DO.text3}>{p}</T>
            <div style={{ marginTop: "auto" }}><Btn variant={i === 0 ? "primary" : "secondary"} full>Use as starting point</Btn></div>
          </div>
        ))}
      </div>
      <Field label="Or describe what you want" hint="A sentence is enough. Add a cost ceiling if you have one."><TextBox value="" /></Field>
    </ConsoleFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Screens: plan, manual, approve, deploy, project                     */
/* ------------------------------------------------------------------ */

const WORKER: Line = { name: "worker-1", kind: "Droplet · 1 GB", why: "Runs the reminder job each morning. Uses a jobs table in db-1 as the queue.", price: 6, cli: "doctl compute droplet get worker-1" };

function planMeter(sc: Scenario, g: Guards, spent: number, warn?: boolean) {
  const u = usageFor(sc, g);
  if (!u.pauseAt) return undefined;
  return { text: `Usage ${money(spent)} of ${money(u.pauseAt)} pause point`, pct: Math.min(100, (spent / u.pauseAt) * 100), warn };
}

function AskScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const u = usageFor(sc, ctx.guards);
  return (
    <ConsoleFrame active="New project">
      <Stepper at={3} />
      <PageHeader crumb={`New project · ${sc.project} · VibeCloud`} title="What should this project do?" sub="Say the outcome and a cost ceiling. We turn it into a priced plan you can read before anything is created." />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 420 }}>
          <Field label="Outcome"><TextBox value={sc.ask} /></Field>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}><Field label="Datacenter region"><SelectBox value="New York · NYC3" /></Field></div>
            <div style={{ flex: 1 }}><Field label="Size"><SelectBox value="Smallest that passes checks" /></Field></div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {sc.id === "kit" && <div style={{ flex: 1 }}><Field label="Model"><SelectBox value="nemotron-3-super-120b" /></Field></div>}
            <div style={{ flex: 1 }}>
              <Field label="Pause point" hint={u.pauseAt ? "Usage stops growing at this amount. The app stays up. Not a bill cap." : "No usage-billed parts in this plan, so there's nothing to pause."}>
                <Input value={u.pauseAt ? money(u.pauseAt) : "Not needed"} />
              </Field>
            </div>
          </div>
          <T size={12} color={DO.text3}>Only these can change here. Everything else comes from the repo, the protections you kept, and your sentence.</T>
        </Card>
        <Summary sc={sc} guards={ctx.guards} cta="Build plan" onCta={ctx.next} />
      </div>
    </ConsoleFrame>
  );
}

function PlanScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const u = usageFor(sc, g);
  const proof = g.hipaa && sc.hipaaProof ? sc.hipaaProof : sc.proof;
  return (
    <ConsoleFrame active="New project">
      <Stepper at={3} />
      <PageHeader crumb={`New project · ${sc.project} · VibeCloud`} title={`Plan for ${sc.project}`} sub="Draft. Dashed boxes are not created and cost $0 until you approve. Click a box to see why it's there." right={<Badge tone="draft">Draft</Badge>} />
      <MapWithDrawer map={MAPS[mapKey(sc, g)]} lines={linesFor(sc, g)} mode="draft" groupLabel={`Plan · ${sc.project}`} groupRight="draft · not created" meter={u.pauseAt ? { text: `Usage pauses at ${money(u.pauseAt)} · expected about ${money(u.estimate)}`, pct: (u.estimate / u.pauseAt) * 100 } : undefined} />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 420 }}>
          <SectionLabel>What happens after you approve</SectionLabel>
          <KV k="Create" v={`${linesFor(sc, g).length} resources in project ${sc.project}, in dependency order`} />
          <KV k="Prove it works" v={proof.q} />
          <KV k="Keep watch" v="Hourly checks. You hear within the hour if one fails, with the last change and who made it." />
          <KV k="Weekly brief" v="Health, cost against this estimate, and upkeep drafts." />
          {u.pauseAt > 0 && <KV k="Pause point" v={`${money(u.pauseAt)} of usage. The app stays up.`} />}
          <KV k="Undo" v="Every change can be undone for 72 hours." />
          <KV k="Leave" v="Export to Terraform or release the plan any time. Resources keep running." />
        </Card>
        <Summary sc={sc} guards={g} cta="Continue to approval" onCta={ctx.next} />
      </div>
    </ConsoleFrame>
  );
}

function ManualScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const catalog: [IconName, string, Line | null][] = [
    ["droplet", "Droplets", { name: "api-2", kind: "Droplet · 2 vCPU / 4 GB", why: "You picked it", price: 24 }],
    ["lb", "Load Balancers", { name: "lb-1", kind: "Load Balancer", why: "You picked it", price: 12 }],
    ["spaces", "Spaces Object Storage", { name: "files", kind: "Spaces bucket", why: "You picked it", price: 5 }],
    ["db", "Databases", null],
    ["app", "App Platform", null],
    ["kb", "Knowledge Bases", null],
  ];
  const all = [...linesFor(sc, g), ...ctx.extra];
  return (
    <ConsoleFrame active={sc.project} project={sc.project}>
      <Stepper at={3} />
      <PageHeader crumb={`New project · ${sc.project} · Manual`} title={sc.project} sub="Pick resources yourself. Protections and price stay on." icon />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420, display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionLabel>{`Resources you picked (${all.length})`}</SectionLabel>
          <DTable headers={["Name", "Type", "Monthly"]} rows={all.map((l) => [<T weight={600}>{l.name}</T>, l.kind, l.price ? `${money(l.price)}/mo` : "Variable"])} tones={all.map(() => "draft")} />
          {!g.backup && (
            <Banner tone="warn" title="api-1 has no backups">ledger-db is backed up daily by Managed Databases, but the Droplet is not. For payment software, turn on weekly backups.</Banner>
          )}
          {!g.backup && <div><Btn variant="secondary" onClick={() => ctx.setGuard("backup", true)}>Turn on backups · +$4.80/mo</Btn></div>}
          <SectionLabel>Add a resource</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
            {catalog.map(([ic, label, line]) => {
              const added = line && ctx.extra.some((e) => e.name === line.name);
              return (
                <div key={label} onClick={line && !added ? () => ctx.addExtra(line) : undefined} style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, borderRadius: 8, background: DO.white, border: `1px solid ${DO.border}`, cursor: line && !added ? "pointer" : "default", opacity: line ? 1 : 0.6 }}>
                  <IconTile name={ic} />
                  <T size={12.5} weight={600} style={{ flex: 1 }}>{label}</T>
                  {added ? <Ico name="check" size={14} color={DO.green} width={2} /> : <Ico name="plus" size={14} color={DO.blue} />}
                </div>
              );
            })}
          </div>
        </div>
        <Summary sc={sc} guards={g} extra={ctx.extra} cta="Review and approve" onCta={ctx.next} />
      </div>
    </ConsoleFrame>
  );
}

function ApproveScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const scopes = g.hipaa && sc.hipaaScopes ? sc.hipaaScopes : sc.scopes;
  const isChange = ctx.path.id === "F";
  const extra = isChange ? [WORKER] : ctx.extra;
  const lines = [...linesFor(sc, g), ...extra];
  const u = usageFor(sc, g);
  const vibe = ctx.path.mode === "vibe";
  return (
    <ConsoleFrame active={isChange ? sc.project : "New project"} project={isChange ? sc.project : undefined}>
      {!isChange && <Stepper at={4} />}
      <PageHeader crumb={isChange ? `${sc.project} · Add to this project` : `New project · ${sc.project}`} title={isChange ? "Approve change" : `Approve ${sc.project}`} sub="Nothing bills until you approve. This is the only step that creates anything." />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420, display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <SectionLabel>This will</SectionLabel>
            <KV k={isChange ? "Create" : "Create"} v={isChange ? "1 Droplet (worker-1) and change 2 existing resources" : `${lines.length} resources: ${lines.map((l) => l.name).join(", ")}`} />
            <KV k="Monthly cost" v={`${money(fixedTotal(sc, g, extra))}/mo${u.pauseAt ? " + usage" : ""}`} />
            {u.pauseAt > 0 && <KV k="Pause point" v={money(u.pauseAt)} />}
            {vibe && <KV k="Checks" v="Hourly, starting right after deploy" />}
            <KV k="Undo" v={vibe ? "72 hours for every change" : "Delete resources from the project page"} />
          </Card>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IconTile name="key" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <T weight={600}>Plan credential</T>
                <T size={12} color={DO.text2}>{`Scoped to project ${sc.project}. Revoke any time in API > Plan credentials.`}</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {scopes.map((s0) => (
                <span key={s0} style={{ fontFamily: "monospace", fontSize: 11.5, borderRadius: 4, padding: "2px 6px", background: ctx.missingScope && s0 === scopes[1] ? DO.redBg : DO.page, color: ctx.missingScope && s0 === scopes[1] ? DO.red : DO.text2, textDecoration: ctx.missingScope && s0 === scopes[1] ? "line-through" : "none", border: `1px solid ${DO.border}` }}>{s0}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Switch on={ctx.missingScope} onChange={ctx.setMissingScope} />
              <T size={12} color={DO.text2}>Show what happens if your role can't grant a scope</T>
            </div>
            {ctx.missingScope && (
              <Banner tone="bad" title={`Can't approve: your role can't grant ${scopes[1]}`}>Nothing has been created. Ask a team owner to approve, or remove the part that needs it.</Banner>
            )}
          </Card>
          {g.hipaa && (
            <Banner tone="warn" title="BAA not signed yet">Resources can deploy now. Don't store real patient data until DigitalOcean's Business Associate Agreement is signed. Request it through Sales or Support.</Banner>
          )}
        </div>
        <Summary sc={sc} guards={g} extra={extra} cta={isChange ? "Approve change" : "Approve and deploy"} onCta={ctx.next} disabled={ctx.missingScope} />
      </div>
    </ConsoleFrame>
  );
}

function DeployScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const lines = [...linesFor(sc, g), ...ctx.extra];
  const proof = g.hipaa && sc.hipaaProof ? sc.hipaaProof : sc.proof;
  const secs = [14, 38, 71, 22, 19, 45, 30];
  return (
    <ConsoleFrame active="New project">
      <Stepper at={5} />
      <PageHeader crumb={`New project · ${sc.project}`} title={`${sc.project} is live`} sub="Created, connected, and checked with a real request." />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 340 }}>
          <SectionLabel>Created</SectionLabel>
          {lines.map((l, i) => (
            <div key={l.name} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Ico name="check" size={14} color={DO.green} width={2} />
              <IconTile name={iconFor(l.kind)} size={22} />
              <T size={12.5} weight={600} style={{ flex: 1 }}>{l.name}</T>
              <T size={12} color={DO.text3}>{`${secs[i % secs.length]}s`}</T>
            </div>
          ))}
          {sc.guards.filter((x) => g[x.id]).map((x) => (
            <div key={x.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Ico name="check" size={14} color={DO.green} width={2} />
              <IconTile name="shield" size={22} color={DO.green} bg={DO.greenBg} />
              <T size={12.5} style={{ flex: 1 }}>{x.name}</T>
            </div>
          ))}
        </Card>
        <Card style={{ flex: 1, minWidth: 340 }}>
          <SectionLabel>Proof it works</SectionLabel>
          <T size={12} color={DO.text2}>Request</T>
          <Mono>{proof.q}</Mono>
          <T size={12} color={DO.text2}>Answer</T>
          <Mono>{proof.a}</Mono>
          {g.cspm && <Badge tone="ok">CSPM scan: 0 critical, 0 high</Badge>}
          <T size={12} color={DO.text3}>If any step had failed, everything created so far would have been removed and nothing billed.</T>
          <Btn full onClick={ctx.next}>Go to project</Btn>
        </Card>
      </div>
    </ConsoleFrame>
  );
}

function ProjectShell({ ctx, tab, banner, children, right }: { ctx: Ctx; tab: string; banner?: ReactNode; children: ReactNode; right?: ReactNode }) {
  const sc = ctx.sc;
  const vibe = ctx.path.mode === "vibe";
  return (
    <ConsoleFrame active={sc.project} project={sc.project}>
      <PageHeader icon title={sc.project} sub={`${vibe ? "Managed by a VibeCloud plan" : "Built manually"} · owner ${sc.owner}`} right={right} />
      <Tabs items={["Resources", "Activity", "Settings"]} active={tab} />
      {banner}
      {children}
    </ConsoleFrame>
  );
}

function ResourceList({ sc, lines, vibe, tones }: { sc: Scenario; lines: Line[]; vibe: boolean; tones?: Record<string, NodeState> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <T size={13} weight={600}>{`${vibe ? "Plan" : "Resources"} · ${sc.project} (${lines.length})`}</T>
      {lines.map((l) => {
        const st = tones?.[l.name];
        return (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8 }}>
            <IconTile name={iconFor(l.kind)} />
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <T weight={600} color={DO.blue}>{l.name}</T>
              <T size={12} color={DO.text3}>{l.kind}</T>
            </div>
            <T size={12.5} color={DO.text2}>{l.price ? `${money(l.price)}/mo` : l.usage ?? ""}</T>
            <Badge tone={st ? st[0] : "ok"}>{st ? st[1] : "Active"}</Badge>
            <Ico name="dots" size={16} color={DO.text3} width={2.5} />
          </div>
        );
      })}
    </div>
  );
}

function ViewToggle({ view, setView }: { view: "map" | "list"; setView: (v: "map" | "list") => void }) {
  return (
    <div style={{ display: "inline-flex", border: `1px solid ${DO.border}`, borderRadius: 6, overflow: "hidden", alignSelf: "flex-start" }}>
      {(["map", "list"] as const).map((v) => (
        <div key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", background: view === v ? DO.blueTint : DO.white, color: view === v ? DO.blue : DO.text2 }}>
          {v === "map" ? "Map" : "List"}
        </div>
      ))}
    </div>
  );
}

function ProjectScreen({ ctx }: SP) {
  const [view, setView] = useState<"map" | "list">("map");
  const sc = ctx.sc;
  const g = ctx.guards;
  const vibe = ctx.path.mode === "vibe";
  const extra = ctx.step > 0 ? ctx.extra : [];
  const lines = [...linesFor(sc, g), ...extra];
  const u = usageFor(sc, g);
  const nextIsAdd = ctx.path.steps[ctx.step + 1] === "add";
  const nextIsAlert = ctx.path.steps[ctx.step + 1] === "alertEmail";
  return (
    <ProjectShell
      ctx={ctx}
      tab="Resources"
      right={<Btn icon="plus" variant={nextIsAdd ? "primary" : "secondary"} onClick={nextIsAdd ? ctx.next : undefined}>Add to this project</Btn>}
      banner={nextIsAlert ? <Banner tone="ok" title="Day 9 · all checks passing">Continue to see what happens when one fails.</Banner> : undefined}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <Card pad={14} style={{ flex: 1, gap: 2 }}><T size={12} color={DO.text3}>Monthly cost</T><T size={18} weight={700}>{`${money(fixedTotal(sc, g, extra))}${u.pauseAt ? " + usage" : ""}`}</T></Card>
        <Card pad={14} style={{ flex: 1, gap: 2 }}><T size={12} color={DO.text3}>{vibe ? "Checks" : "Protections"}</T><T size={18} weight={700}>{vibe ? "Passing · hourly" : `${sc.guards.filter((x) => g[x.id]).length} on`}</T></Card>
        <Card pad={14} style={{ flex: 1, gap: 2 }}><T size={12} color={DO.text3}>{vibe ? "Next brief" : "Last CSPM scan"}</T><T size={18} weight={700}>{vibe ? "Monday" : "0 critical"}</T></Card>
      </div>
      <ViewToggle view={view} setView={setView} />
      {view === "map" ? (
        <MapWithDrawer map={MAPS[mapKey(sc, g)]} lines={lines} mode="live" groupLabel={`${vibe ? "Plan" : "Resources"} · ${sc.project}`} groupRight={vibe ? "verified · checked hourly" : "you manage"} meter={vibe ? planMeter(sc, g, 3.4) : undefined} />
      ) : (
        <ResourceList sc={sc} lines={lines} vibe={vibe} />
      )}
    </ProjectShell>
  );
}

/* ------------------------------------------------------------------ */
/* Screens: keep running and leave                                     */
/* ------------------------------------------------------------------ */

function AddScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const lines = linesFor(sc, ctx.guards);
  return (
    <ProjectShell ctx={ctx} tab="Resources">
      <Centered width={720}>
        <Card>
          <T size={18} weight={700} color={DO.navy}>Add to this project</T>
          <T size={12.5} color={DO.text2}>Same flow as a new project. What's already here is used as context, and HIPAA mode stays on.</T>
          <Field label="What should change?"><TextBox value="Send appointment reminder emails to patients every morning at 7." /></Field>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <T size={12} color={DO.text3}>Context:</T>
            {lines.map((l) => <Chip key={l.name}>{l.name}</Chip>)}
            <Chip>HIPAA mode on</Chip>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={ctx.next}>Build change plan</Btn>
            <Btn variant="secondary">Browse starter kits</Btn>
            <Btn variant="link">Create a resource manually</Btn>
          </div>
        </Card>
      </Centered>
    </ProjectShell>
  );
}

function DiffScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const lines = [...linesFor(sc, g), WORKER];
  return (
    <ProjectShell ctx={ctx} tab="Resources" right={<Badge tone="draft">Change draft</Badge>}>
      <T size={16} weight={700}>Change plan: appointment reminders</T>
      <MapWithDrawer map={MAPS["health-hipaa"]} lines={lines} mode="live" draftIds={["worker-1"]} groupLabel={`Plan · ${sc.project}`} groupRight="1 new part · 2 changed" />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420 }}>
          <DTable
            headers={["Change", "Part", "Cost"]}
            rows={[
              [<Badge tone="info">Add</Badge>, "worker-1 · Droplet 1 GB", "+$6/mo"],
              [<Badge tone="neutral">Change</Badge>, "db-1 · adds a jobs table (pg-boss)", "$0"],
              [<Badge tone="neutral">Change</Badge>, "web-1 · schedules reminders", "$0"],
              [<Badge tone="warn">Not used</Badge>, "Managed Valkey queue · not HIPAA-eligible", "$0"],
            ]}
          />
        </div>
        <Summary sc={sc} guards={g} extra={[WORKER]} cta="Continue to approval" onCta={() => { if (!ctx.extra.some((e) => e.name === WORKER.name)) ctx.addExtra(WORKER); ctx.next(); }} />
      </div>
    </ProjectShell>
  );
}

function AlertEmailScreen({ ctx }: SP) {
  return (
    <EmailFrame>
      <T size={12} color={DO.text3}>{`To ${ctx.sc.owner} · Today 09:14`}</T>
      <T size={18} weight={700}>support-bot stopped answering</T>
      <Banner tone="bad" title="Hourly check failed at 09:14">The test question got a 401 from agent. Visitors see an error in the chat widget.</Banner>
      <KV k="Broken part" v="agent (Agent Platform)" />
      <KV k="Last change" v="Access key deleted by alex@acme.io at 08:52" />
      <KV k="Proposed fix" v="Create a new access key and update chatbot's AGENT_KEY. $0. Can be undone for 72 hours." />
      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={ctx.next}>Review fix in console</Btn>
        <Btn variant="secondary">Reply to alex@acme.io</Btn>
      </div>
      <T size={11.5} color={DO.text3}>You get this because you own the support-bot plan. Change alert settings in the project.</T>
    </EmailFrame>
  );
}

function AlertConsoleScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const lines = linesFor(sc, g);
  const overrides: Record<string, NodeState> = { agent: ["bad", "Access key deleted"], chatbot: ["warn", "Getting 401s"] };
  return (
    <ProjectShell ctx={ctx} tab="Resources" banner={<Banner tone="bad" title="1 check failing since 09:14">agent's access key was deleted by alex@acme.io at 08:52. chatbot can't reach it.</Banner>}>
      <MapWithDrawer map={MAPS.kit} lines={lines} mode="live" overrides={overrides} groupLabel={`Plan · ${sc.project}`} groupRight="check failed" meter={planMeter(sc, g, 3.4)} />
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SectionLabel>Proposed fix</SectionLabel>
          <Badge tone="draft">Draft</Badge>
        </div>
        <DTable headers={["Step", "Part", "Cost"]} rows={[["Create a new access key", "agent", "$0"], ["Set AGENT_KEY and redeploy", "chatbot", "$0"], ["Ask the test question again", "chatbot → agent", "$0"]]} />
        <T size={12} color={DO.text3}>Can be undone for 72 hours. The deleted key stays deleted.</T>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={ctx.next}>Apply fix</Btn>
          <Btn variant="secondary">Dismiss</Btn>
        </div>
      </Card>
      <ResourceList sc={sc} lines={lines} vibe tones={overrides} />
    </ProjectShell>
  );
}

function BriefScreen({ ctx }: SP) {
  return (
    <EmailFrame>
      <T size={12} color={DO.text3}>{`To ${ctx.sc.owner} · Monday 08:00`}</T>
      <T size={18} weight={700}>Weekly brief · support-bot · week 6</T>
      <div style={{ display: "flex", gap: 10 }}>
        <Card pad={12} style={{ flex: 1, gap: 2 }}><T size={11.5} color={DO.text3}>Health</T><T weight={700}>167 of 168 checks passed</T></Card>
        <Card pad={12} style={{ flex: 1, gap: 2 }}><T size={11.5} color={DO.text3}>Cost this week</T><T weight={700}>$10.30 fixed + $1.40 usage</T></Card>
        <Card pad={12} style={{ flex: 1, gap: 2 }}><T size={11.5} color={DO.text3}>Against estimate</T><T weight={700} color={DO.green}>On track</T></Card>
      </div>
      <SectionLabel>Upkeep drafts</SectionLabel>
      <DTable
        headers={["Draft", "Cost", "Undo"]}
        rows={[
          ["help.acme.io added /guides (42 pages). Re-index help-kb.", "about $0.02 once", "Yes"],
          ["Newer model answers 9 of 10 test questions vs 8 of 10. Same price.", "$0", "Yes"],
          ["CSPM not needed: no Droplets or databases in this plan.", "—", "—"],
        ]}
      />
      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={ctx.next}>Review drafts</Btn>
        <Btn variant="secondary">Open project</Btn>
      </div>
    </EmailFrame>
  );
}

function PauseScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const u = usageFor(sc, g);
  return (
    <ProjectShell ctx={ctx} tab="Resources" banner={<Banner tone="warn" title={`Usage paused at ${money(u.pauseAt)}`}>A traffic spike used this month's usage budget on the 21st. The chatbot stays up and shows a "Contact support" link instead of answers. Fixed costs keep billing. This is a pause point, not a bill cap.</Banner>}>
      <MapWithDrawer map={MAPS.kit} lines={linesFor(sc, g)} mode="live" overrides={{ agent: ["warn", "Paused · usage limit"], "help-kb": ["warn", "Paused · no new queries"] }} groupLabel={`Plan · ${sc.project}`} groupRight="paused" meter={planMeter(sc, g, u.pauseAt, true)} />
      <Card>
        <SectionLabel>Choose what happens next</SectionLabel>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn onClick={ctx.next}>Raise pause point to $45</Btn>
          <Btn variant="secondary">Stay paused until Oct 1</Btn>
          <Btn variant="link">See what used it</Btn>
        </div>
      </Card>
    </ProjectShell>
  );
}

function UndoScreen({ ctx }: SP) {
  const rows: [string, string, string, boolean][] = [
    ["Today 10:02", "Raised pause point $30 → $45", ctx.sc.owner, true],
    ["Mon 08:40", "Re-indexed help-kb (/guides)", "plan (approved by maya)", true],
    ["Day 9 09:31", "New agent access key, chatbot redeployed", "plan (approved by maya)", false],
    ["Day 1 14:12", "Created support-bot plan", ctx.sc.owner, false],
  ];
  return (
    <ProjectShell ctx={ctx} tab="Activity">
      <DTable
        headers={["When", "Change", "By", "Undo"]}
        rows={rows.map((r) => [r[0], <T weight={600}>{r[1]}</T>, <T size={12} color={DO.text2}>{r[2]}</T>, r[3] ? <Btn variant="secondary">Undo</Btn> : <T size={12} color={DO.text3}>Window closed (72 h)</T>])}
        tones={rows.map((r) => (r[3] ? "info" : "neutral"))}
      />
      <T size={12} color={DO.text3}>Undo restores the previous settings and resources. Deleted data (like a removed access key) can't come back, and the undo says so before you click.</T>
      <div><Btn onClick={ctx.next}>Go to Settings</Btn></div>
    </ProjectShell>
  );
}

function ExportScreen({ ctx }: SP) {
  const [released, setReleased] = useState(false);
  const sc = ctx.sc;
  return (
    <ProjectShell ctx={ctx} tab="Settings">
      <Card>
        <SectionLabel>Export as Terraform</SectionLabel>
        <T size={12.5} color={DO.text2}>A snapshot of every resource in the plan, as it runs today. Use it to move to your own pipeline.</T>
        <Mono>{`resource "digitalocean_app" "chatbot" {\n  spec { name = "support-bot" region = "nyc" }\n}\nresource "digitalocean_genai_agent" "agent" { ... }\nresource "digitalocean_genai_knowledge_base" "help_kb" { ... }`}</Mono>
        <div><Btn variant="secondary" icon="doc">Download main.tf</Btn></div>
      </Card>
      <Card>
        <SectionLabel>Release plan</SectionLabel>
        <T size={12.5} color={DO.text2}>Stops checks, briefs and the pause point. Every resource keeps running and billing as a normal resource. The plan credential is revoked.</T>
        {released ? (
          <Banner tone="ok" title="Plan released">{`${linesFor(sc, ctx.guards).length} resources keep running in ${sc.project}. You manage them from here on.`}</Banner>
        ) : (
          <div><Btn variant="danger" onClick={() => setReleased(true)}>Release plan</Btn></div>
        )}
      </Card>
    </ProjectShell>
  );
}

function AgentScreen({ ctx }: SP) {
  const sc = ctx.sc;
  const g = ctx.guards;
  const bubble = (who: string, body: ReactNode, dark?: boolean) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: "#8A8A8A" }}>{who}</span>
      <div style={{ background: dark ? "#252526" : "#2D2D30", borderRadius: 6, padding: 10, fontSize: 12.5, color: "#DDDDDD", lineHeight: 1.5 }}>{body}</div>
    </div>
  );
  return (
    <IdeFrame
      side={
        <>
          {bubble("You", "Deploy this to DigitalOcean. It stores patient notes so keep it HIPAA-ready, under $80 a month.")}
          {bubble("Tool call · DigitalOcean MCP", <span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{`plan_outcome(repo="${sc.repo}", hipaa=true, budget=80)`}</span>, true)}
          <div style={{ background: DO.white, borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", gap: 8, color: DO.text }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconTile name="sparkle" size={22} />
              <T weight={700}>{`Draft plan · ${sc.project}`}</T>
            </div>
            <T size={12.5}>{`${money(fixedTotal(sc, g))}/mo · ${linesFor(sc, g).length} resources · ${sc.guards.filter((x) => g[x.id]).length} protections`}</T>
            <T size={12} color={DO.text2}>{linesFor(sc, g).map((l) => l.name).join(", ")}</T>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge tone="ok">Every part HIPAA-eligible</Badge>
              <Badge tone="warn">BAA pending</Badge>
            </div>
            <T size={11.5} color={DO.text3}>Agents can draft. Only a person with the right role can approve.</T>
            <Btn full onClick={ctx.next}>Open in console to approve</Btn>
          </div>
          {bubble("Also works from the terminal", <span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{`doctl plans create --repo ${sc.repo} --hipaa --budget 80`}</span>, true)}
        </>
      }
    />
  );
}

const RENDER: Record<ScreenId, (p: SP) => ReactNode> = {
  home: HomeScreen, start: StartScreen, github: GithubScreen, analysis: AnalysisScreen, compliance: ComplianceScreen, mode: ModeScreen, kits: KitsScreen,
  ask: AskScreen, plan: PlanScreen, manual: ManualScreen, approve: ApproveScreen, deploy: DeployScreen, project: ProjectScreen, add: AddScreen, diff: DiffScreen,
  alertEmail: AlertEmailScreen, alertConsole: AlertConsoleScreen, brief: BriefScreen, pause: PauseScreen, undo: UndoScreen, export: ExportScreen, agent: AgentScreen,
};

function ScreenBody({ id, ctx }: { id: ScreenId; ctx: Ctx }) {
  const C = RENDER[id];
  return <C ctx={ctx} />;
}

function defaultGuards(sc: Scenario): Guards {
  const g: Guards = {};
  sc.guards.forEach((x) => (g[x.id] = x.defaultOn));
  return g;
}

export default function DoConsolePrototype() {
  const theme = useHostTheme();
  const [pid, setPid] = useState<PathId>("A");
  const [i, setI] = useState(0);
  const path = FLOWS.find((p) => p.id === pid) ?? FLOWS[0];
  const sc = SCENARIOS[path.scenario];
  const [guards, setGuards] = useState<Guards>(defaultGuards(SCENARIOS.health));
  const [mode, setMode] = useState<"vibe" | "manual">("vibe");
  const [missingScope, setMissingScope] = useState(false);
  const [extra, setExtra] = useState<Line[]>([]);

  const pick = (id: PathId) => {
    const p = FLOWS.find((x) => x.id === id) ?? FLOWS[0];
    setPid(id);
    setI(0);
    setGuards(defaultGuards(SCENARIOS[p.scenario]));
    setMode(p.mode);
    setMissingScope(false);
    setExtra([]);
  };

  const idx = Math.min(i, path.steps.length - 1);
  const id = path.steps[idx];
  const meta = META[id];
  const next = () => setI(Math.min(idx + 1, path.steps.length - 1));
  const ctx: Ctx = {
    sc, path, next, guards, setGuard: (k, v) => setGuards({ ...guards, [k]: v }), mode, setMode, missingScope, setMissingScope,
    extra, addExtra: (l) => setExtra([...extra, l]), step: idx,
  };
  const usedIn = (sid: ScreenId) => FLOWS.filter((p) => p.steps.includes(sid)).map((p) => p.id).join(" ");

  return (
    <Stack gap={22} style={{ padding: 24, maxWidth: 1480 }}>
      <Stack gap={6}>
        <H1>One way to start a project on DigitalOcean</H1>
        <Text tone="secondary">
          Clickable prototype in the DigitalOcean console style. Projects and Launchpad merge into one flow: start from GitHub, a description, or empty, then build it
          yourself (Manual) or let DigitalOcean propose it and keep watch (VibeCloud). The resource map from the Outcome Plans canvas shows the plan as a draft, then live
          on the project page. Pick a path; buttons inside the screen move it forward.
        </Text>
      </Stack>

      <Stack gap={10}>
        <Row gap={8} align="center" wrap>
          <Text size="small" tone="tertiary" style={{ width: 52 }}>Path</Text>
          {FLOWS.map((p) => (
            <Pill key={p.id} active={pid === p.id} onClick={() => pick(p.id)}>{`${p.id}  ${p.name}`}</Pill>
          ))}
        </Row>
        <Row gap={6} align="center" wrap>
          <Text size="small" tone="tertiary" style={{ width: 52 }}>Screen</Text>
          {path.steps.map((st, k) => (
            <Pill key={`${st}-${k}`} size="sm" active={k === idx} onClick={() => setI(k)}>{`${k + 1} ${META[st].title}`}</Pill>
          ))}
        </Row>
      </Stack>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ScreenBody key={`${pid}-${idx}-${id}`} id={id} ctx={ctx} />
        </div>
        <div style={{ width: 250, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
          <Text size="small" tone="tertiary">{`${meta.stage} · ${idx + 1} of ${path.steps.length}`}</Text>
          <Text weight="semibold">{meta.title}</Text>
          <Text size="small" tone="secondary">{meta.note}</Text>
          <Divider />
          <Text size="small" tone="tertiary">{sc.context}</Text>
          <Row gap={8}>
            <Button variant="secondary" disabled={idx === 0} onClick={() => setI(idx - 1)}>Back</Button>
            <Button variant="secondary" disabled={idx === path.steps.length - 1} onClick={next}>Next</Button>
          </Row>
          <div style={{ fontSize: 11, color: theme.text.quaternary }}>{`Also in paths: ${usedIn(id)}`}</div>
        </div>
      </div>

      <Stack gap={10}>
        <H2>Why one flow</H2>
        <Grid columns={3} gap={16}>
          <Stack gap={6}>
            <Text weight="semibold">Today: two front doors, same result</Text>
            <Text size="small" tone="secondary">
              New Project creates an empty container, then asks you to assign resources. Launchpad asks for a project name again and deploys a fixed kit into a new project.
              The project page adds a third entry with its "Create something new" tiles.
            </Text>
          </Stack>
          <Stack gap={6}>
            <Text weight="semibold">What Launchpad taught us</Text>
            <Text size="small" tone="secondary">
              Launchpad apps were redeployed 7% of the time vs 70% for ordinary apps. 41% were deleted within a day. Setup failures rose from 9% to 71% and nobody was told.
            </Text>
          </Stack>
          <Stack gap={6}>
            <Text weight="semibold">The change</Text>
            <Text size="small" tone="secondary">
              One noun (project), one entry (New project, or Add to this project), two ways to fill it. Both share the Summary panel and protection checks. Kits become examples.
            </Text>
          </Stack>
        </Grid>
      </Stack>

      <Stack gap={10}>
        <H2>Every screen</H2>
        <Table
          headers={["Screen", "Stage", "Paths"]}
          rows={(Object.keys(META) as ScreenId[]).map((k) => [META[k].title, META[k].stage, usedIn(k)])}
          striped
        />
      </Stack>

      <Stack gap={10}>
        <H2>Checked against DigitalOcean's public pages</H2>
        <Text size="small" tone="secondary">Web search on 24 Sep 2026. The biggest finding: the HIPAA path can't use App Platform, Managed Databases or Knowledge Bases.</Text>
        <Table
          headers={["Fact", "What it changed", "Source"]}
          rows={[
            ["HIPAA-eligible: Droplets, GPU Droplets, Kubernetes, 1-Click Models, Monitoring, Firewalls, Load Balancers, Reserved IPs, VPC, Spaces, Volumes, backups and snapshots, Container Registry, Custom Images. BAA through Sales or Support.", "HIPAA mode swaps to Droplets, a Volume and pgvector. BAA shown as pending.", <Link href="https://www.digitalocean.com/trust/hipaa-at-do">HIPAA at DO</Link>],
            ["CSPM is under Security. Scans are manual. Basic is $5 per covered workload per month (Droplets, Managed Databases).", "CSPM priced per workload. Scans after deploy and changes are labeled as a proposal.", <Link href="https://docs.digitalocean.com/products/cspm/details/pricing/">CSPM pricing</Link>],
            ["PCI-DSS SAQ-A covers DigitalOcean's admin environment only.", "Fintech path says keep card data with Stripe; no PCI claim for the customer's app.", <Link href="https://www.digitalocean.com/trust/certification-reports">Certification reports</Link>],
            ["Guardrails: content moderation and jailbreak $0.20, sensitive data $0.34 per 1M tokens.", "Kit guardrail prices.", <Link href="https://docs.digitalocean.com/products/inference/details/pricing/">Inference pricing</Link>],
            ["Knowledge bases bill embeddings plus OpenSearch, from $19.60/mo.", "Knowledge base line price.", <Link href="https://www.digitalocean.com/pricing/managed-databases">Managed Databases pricing</Link>],
            ["App Platform 1 GiB $12, 2 GiB $25. Managed Postgres 1 GiB $15.15. Valkey 1 GiB $15.", "Line prices.", <Link href="https://www.digitalocean.com/pricing/app-platform">App Platform pricing</Link>],
          ]}
        />
      </Stack>

      <Callout tone="neutral" title="Still open">
        Whether App Platform, Managed Databases and Knowledge Bases should join the HIPAA list, since today HIPAA customers fall back to self-managed Droplets. Hourly CSPM
        checks need scheduled scans, which CSPM doesn't offer yet. The brief's model update and the weekly numbers are examples.
      </Callout>
    </Stack>
  );
}
