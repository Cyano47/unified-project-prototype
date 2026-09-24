import type { CSSProperties, ReactNode } from "react";

const C = {
  text: "#1B1F24",
  text2: "#4D5B7C",
  text3: "#8690A2",
  text4: "#A7AFBF",
  border: "#DFE3EB",
  page: "#F5F7FA",
  blue: "#0069FF",
  blueTint: "#EAF2FF",
  white: "#FFFFFF",
  font: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export function useHostTheme() {
  return { text: { primary: C.text, secondary: C.text2, tertiary: C.text3, quaternary: C.text4 } };
}

export function Stack({ gap = 8, style, children }: { gap?: number; style?: CSSProperties; children?: ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>{children}</div>;
}

export function Row({ gap = 8, align = "center", wrap, children }: { gap?: number; align?: "start" | "center" | "end"; wrap?: boolean; children?: ReactNode }) {
  const ai = align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";
  return <div style={{ display: "flex", gap, alignItems: ai, flexWrap: wrap ? "wrap" : "nowrap" }}>{children}</div>;
}

export function Grid({ columns, gap = 12, children }: { columns: number; gap?: number; children?: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}>{children}</div>;
}

export function H1({ children }: { children?: ReactNode }) {
  return <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#031B4E" }}>{children}</h1>;
}

export function H2({ children }: { children?: ReactNode }) {
  return <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#031B4E" }}>{children}</h2>;
}

export function Text({
  children, size, tone, weight, style,
}: { children?: ReactNode; size?: "small"; tone?: "secondary" | "tertiary"; weight?: "semibold"; style?: CSSProperties }) {
  const color = tone === "secondary" ? C.text2 : tone === "tertiary" ? C.text3 : C.text;
  return <span style={{ fontSize: size === "small" ? 12.5 : 14, lineHeight: 1.5, color, fontWeight: weight === "semibold" ? 600 : 400, ...style }}>{children}</span>;
}

export function Divider() {
  return <div style={{ height: 1, background: C.border }} />;
}

export function Link({ href, children }: { href: string; children?: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" style={{ color: C.blue, textDecoration: "none" }}>{children}</a>;
}

export function Pill({ children, active, onClick, size }: { children?: ReactNode; active?: boolean; onClick?: () => void; size?: "sm" }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: C.font, fontSize: size === "sm" ? 11.5 : 12.5, fontWeight: active ? 600 : 500, padding: size === "sm" ? "3px 9px" : "5px 12px",
        borderRadius: 14, cursor: "pointer", whiteSpace: "nowrap",
        border: `1px solid ${active ? C.blue : C.border}`, background: active ? C.blueTint : C.white, color: active ? C.blue : C.text2,
      }}
    >
      {children}
    </button>
  );
}

export function Button({ children, variant = "primary", disabled, onClick }: { children?: ReactNode; variant?: "primary" | "secondary"; disabled?: boolean; onClick?: () => void }) {
  const primary = variant === "primary";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        fontFamily: C.font, fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 6, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1,
        border: `1px solid ${primary ? C.blue : C.border}`, background: primary ? C.blue : C.white, color: primary ? C.white : C.blue,
      }}
    >
      {children}
    </button>
  );
}

export function Callout({ title, children }: { tone?: "neutral" | "info" | "warning"; title: string; children?: ReactNode }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, background: C.page, borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{title}</span>
      <span style={{ fontSize: 12.5, lineHeight: 1.5, color: C.text2 }}>{children}</span>
    </div>
  );
}

export function Table({ headers, rows, striped }: { headers: string[]; rows: ReactNode[][]; striped?: boolean }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", background: C.white }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: C.page }}>
            {headers.map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: C.text2, textTransform: "uppercase", letterSpacing: 0.3, borderBottom: `1px solid ${C.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: striped && i % 2 === 1 ? "#FAFBFD" : C.white }}>
              {r.map((c, j) => (
                <td key={j} style={{ padding: "9px 12px", color: C.text, verticalAlign: "top", lineHeight: 1.5, borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none" }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
