"use client";

import { useState } from "react";

type Dep = { full_name: string; relationship: string; date_of_birth: string };

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [flow, setFlow] = useState<"standard" | "diaspora">("standard");
  const [plan, setPlan] = useState("standard");
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nif, setNif] = useState("");
  const [deps, setDeps] = useState<Dep[]>([]);
  const [msg, setMsg] = useState("");

  const addDep = () => setDeps([...deps, { full_name: "", relationship: "", date_of_birth: "" }]);
  const updateDep = (i: number, key: keyof Dep, value: string) => {
    const next = [...deps];
    next[i][key] = value;
    setDeps(next);
  };

  const submit = async () => {
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        flow_type: flow,
        plan_code: plan,
        payer_full_name: flow === "diaspora" ? payerName : undefined,
        payer_email: flow === "diaspora" ? payerEmail : undefined,
        beneficiary_full_name: beneficiaryName,
        beneficiary_email: beneficiaryEmail,
        beneficiary_phone: phone,
        beneficiary_address: address,
        nif,
        dependents: deps.filter(d => d.full_name && d.relationship),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Erreur");
    setMsg(`Inscription enregistrée. Référence: ${data.intakeId}`);
    setStep(5);
  };

  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: 24 }}>
      <h1>Inscription Vita Santé</h1>
      <p style={{ opacity: .8 }}>Parcours multi-étapes (standard + diaspora).</p>

      {step === 1 && (
        <section style={card}>
          <h3>Étape 1 — Type de souscription</h3>
          <label><input type="radio" checked={flow === "standard"} onChange={() => setFlow("standard")} /> Standard</label>
          <label style={{ marginLeft: 12 }}><input type="radio" checked={flow === "diaspora"} onChange={() => setFlow("diaspora")} /> Diaspora (payer pour un proche)</label>
          <div style={{ marginTop: 10 }}>
            <select value={plan} onChange={e => setPlan(e.target.value)} style={input}>
              <option value="basique">Basique</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <button onClick={() => setStep(2)} style={btn}>Suivant</button>
        </section>
      )}

      {step === 2 && (
        <section style={card}>
          <h3>Étape 2 — Informations principales</h3>
          {flow === "diaspora" && (
            <>
              <input placeholder="Nom du payeur diaspora" value={payerName} onChange={e => setPayerName(e.target.value)} style={input} />
              <input placeholder="Email du payeur diaspora" value={payerEmail} onChange={e => setPayerEmail(e.target.value)} style={input} />
            </>
          )}
          <input placeholder="Nom complet du bénéficiaire" value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} style={input} />
          <input placeholder="Email bénéficiaire" value={beneficiaryEmail} onChange={e => setBeneficiaryEmail(e.target.value)} style={input} />
          <input placeholder="Téléphone" value={phone} onChange={e => setPhone(e.target.value)} style={input} />
          <input placeholder="Adresse Haïti" value={address} onChange={e => setAddress(e.target.value)} style={input} />
          <input placeholder="NIF (optionnel)" value={nif} onChange={e => setNif(e.target.value)} style={input} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(1)} style={ghost}>Retour</button>
            <button onClick={() => setStep(3)} style={btn}>Suivant</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section style={card}>
          <h3>Étape 3 — Dépendants</h3>
          {deps.map((d, i) => (
            <div key={i} style={{ display: "grid", gap: 6, border: "1px solid #23304f", borderRadius: 10, padding: 8, marginBottom: 8 }}>
              <input placeholder="Nom" value={d.full_name} onChange={e => updateDep(i, "full_name", e.target.value)} style={input} />
              <input placeholder="Lien de parenté" value={d.relationship} onChange={e => updateDep(i, "relationship", e.target.value)} style={input} />
              <input placeholder="Date de naissance" value={d.date_of_birth} onChange={e => updateDep(i, "date_of_birth", e.target.value)} style={input} />
            </div>
          ))}
          <button onClick={addDep} style={ghost}>+ Ajouter un dépendant</button>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => setStep(2)} style={ghost}>Retour</button>
            <button onClick={() => setStep(4)} style={btn}>Suivant</button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section style={card}>
          <h3>Étape 4 — Récapitulatif</h3>
          <p>Plan: {plan}</p>
          <p>Bénéficiaire: {beneficiaryName} — {beneficiaryEmail}</p>
          <p>Dépendants: {deps.filter(d => d.full_name).length}</p>
          <p style={{ opacity: .75 }}>Étape paiement Stripe: base prête (activation ultérieure).</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(3)} style={ghost}>Retour</button>
            <button onClick={submit} style={btn}>Confirmer inscription</button>
          </div>
        </section>
      )}

      {step === 5 && <section style={card}><h3>Étape 5 — Confirmation</h3><p>{msg}</p></section>}
      {msg && step !== 5 ? <p style={{ marginTop: 10 }}>{msg}</p> : null}
    </main>
  );
}

const card: React.CSSProperties = { border: "1px solid #243252", borderRadius: 14, background: "#0b1224", padding: 14, display: "grid", gap: 8 };
const input: React.CSSProperties = { background: "#0f162a", color: "#eaf0ff", border: "1px solid #243252", borderRadius: 10, padding: "10px 12px" };
const btn: React.CSSProperties = { background: "#6f86ff", color: "#fff", border: 0, borderRadius: 10, padding: "10px 12px" };
const ghost: React.CSSProperties = { background: "transparent", color: "#c8d5ff", border: "1px solid #30426d", borderRadius: 10, padding: "10px 12px" };
