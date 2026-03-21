import { redirect } from "next/navigation";

export default function LegacyAppLayoutRedirect() {
  redirect("/dashboard");
}
