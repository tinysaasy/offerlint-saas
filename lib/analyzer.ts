export function analyzeOffer(input: { headline: string; audience: string; offer: string; proof?: string; cta?: string }) {
  const issues: string[] = [];
  let score = 100;

  const h = input.headline.trim();
  const a = input.audience.trim();
  const o = input.offer.trim();
  const p = (input.proof || "").trim();
  const c = (input.cta || "").trim();

  if (h.length < 12) { score -= 18; issues.push("Headline is too vague/short."); }
  if (!/\d|%|days|hours|x/i.test(h + " " + o)) { score -= 15; issues.push("No concrete outcome/timeline in headline or offer."); }
  if (a.length < 8) { score -= 12; issues.push("Audience targeting is unclear."); }
  if (o.length < 40) { score -= 18; issues.push("Offer body is too thin."); }
  if (!/guarantee|refund|risk|cancel/i.test(o + " " + c)) { score -= 12; issues.push("No risk-reversal language."); }
  if (p.length < 15) { score -= 15; issues.push("Proof is weak or missing."); }
  if (!/book|start|apply|join|buy|get/i.test(c)) { score -= 10; issues.push("CTA is not action-oriented."); }

  score = Math.max(0, score);
  const verdict = score >= 80 ? "Strong" : score >= 60 ? "Average" : "Weak";

  const rewrite = {
    headline: `For ${a || "[specific audience]"}: ${h || "[clear outcome]"} in 14 days without wasting months testing random tactics`,
    cta: "Book a 15-min fit call",
  };

  return { score, verdict, issues, rewrite };
}
