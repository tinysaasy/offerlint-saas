import Link from "next/link";

export default function DoctorsPage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1>Réseau médecins partenaires</h1>
      <p style={{ opacity: .8 }}>Portail de vérification membre pour consultations.</p>
      <Link href="/doctor/verify">Aller au module de vérification</Link>
    </main>
  );
}
