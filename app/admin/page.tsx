export default function AdminPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>
      <h1>Admin</h1>
      <p>Use API endpoints to pull waitlist + analyses from Supabase.</p>
      <p>Endpoints: <code>/api/waitlist</code>, <code>/api/analyze</code></p>
    </main>
  );
}
