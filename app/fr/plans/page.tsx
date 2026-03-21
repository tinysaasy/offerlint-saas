import Link from "next/link";

const plans = [
  { key: "basique", monthly: 19, yearly: 199, coverage: "Consultations générales", cap: "Plafond basique" },
  { key: "standard", monthly: 39, yearly: 399, coverage: "Généraliste + Spécialiste", cap: "Plafond intermédiaire" },
  { key: "premium", monthly: 69, yearly: 699, coverage: "Couverture étendue", cap: "Plafond élevé" },
];

export default function PlansFR() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1>Plans d’assurance</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr><th>Plan</th><th>Mensuel</th><th>Annuel</th><th>Couverture</th><th>Plafond</th><th></th></tr></thead>
        <tbody>
          {plans.map(p => (
            <tr key={p.key} style={{ borderTop: "1px solid #23304f" }}>
              <td>{p.key}</td><td>${p.monthly}</td><td>${p.yearly}</td><td>{p.coverage}</td><td>{p.cap}</td>
              <td><Link href={`/signup?plan=${p.key}`}>Choisir</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
