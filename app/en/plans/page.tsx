import Link from "next/link";

const plans = [
  { key: "basic", monthly: 19, yearly: 199, coverage: "General consultations", cap: "Basic cap" },
  { key: "standard", monthly: 39, yearly: 399, coverage: "GP + Specialist", cap: "Mid cap" },
  { key: "premium", monthly: 69, yearly: 699, coverage: "Extended coverage", cap: "High cap" },
];

export default function PlansEN() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1>Insurance plans</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr><th>Plan</th><th>Monthly</th><th>Yearly</th><th>Coverage</th><th>Cap</th><th></th></tr></thead>
        <tbody>
          {plans.map(p => (
            <tr key={p.key} style={{ borderTop: "1px solid #23304f" }}>
              <td>{p.key}</td><td>${p.monthly}</td><td>${p.yearly}</td><td>{p.coverage}</td><td>{p.cap}</td>
              <td><Link href={`/signup?plan=${p.key}`}>Choose</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
