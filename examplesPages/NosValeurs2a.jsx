// Section « Nos valeurs » — variante 2a (split texte / terminal)
// Fonts requises : Montserrat (800), Inter (300–600)
// ex. <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@200;300;400;500;600&display=swap" rel="stylesheet">
// Keyframe requise (globale) : @keyframes hgBlink { 0%,55% {opacity:1} 56%,100% {opacity:0} }

const mono = "ui-monospace,Menlo,Consolas,monospace";

const VALUES = [
  { title: "Transparence", body: "Une transparence sur l'avancement, les coûts, les choix. Pas de surprises." },
  { title: "Souveraineté", body: "Votre code, vos données, votre liberté. Vous restez propriétaire de tout ce qu'on construit pour vous. Si vous restez, c'est par choix, pas par dépendance." },
  { title: "Fiabilité", body: "Un partenaire proche, réactif et présent dans la durée." },
  { title: "Curiosité", body: "Curieux par nature. On explore, on teste, on apprend en continu. On pilote l'IA au quotidien pour investir notre temps là où l'humain compte : le contact et le support." },
];

function Prompt() {
  return (
    <>
      <span style={{ color: "#96b9f9" }}>➜</span>{" "}
      <span style={{ color: "#2563eb" }}>~/hargile-tech-studio</span>
    </>
  );
}

export default function NosValeurs() {
  return (
    <section style={{ background: "#050508", color: "#ededed", padding: "96px 24px", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 360px", minWidth: 320 }}>
          <div style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".14em", color: "#96b9f9", marginBottom: 18 }}>NOS VALEURS</div>
          <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 46, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 22px" }}>
            Sculpté avec intention.
          </h2>
          <p style={{ fontSize: 15.5, fontWeight: 300, color: "rgba(237,237,237,.7)", lineHeight: 1.75, margin: "0 0 20px" }}>
            Chez HARGILE, nous façonnons notre développement comme on sculpte une œuvre : avec soin, intention et sens du détail.
          </p>
          <div style={{ fontFamily: mono, fontSize: 12, color: "rgba(237,237,237,.4)" }}>// lisible par les humains, écrit avec soin</div>
        </div>

        <div style={{ flex: 1, minWidth: 520, border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, background: "#07070c", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            {["#2563eb", "#96b9f9", "#F5C26B"].map((c) => (
              <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "block" }} />
            ))}
            <span style={{ flex: 1, textAlign: "center", fontFamily: mono, fontSize: 12, color: "rgba(237,237,237,.45)" }}>hargile — valeurs.md</span>
          </div>
          <div style={{ padding: "26px 28px", fontFamily: mono, fontSize: 13, lineHeight: 1.75 }}>
            <div><Prompt /> <span style={{ color: "#ededed" }}>cat valeurs.md</span></div>
            <div style={{ color: "rgba(237,237,237,.4)", margin: "10px 0 18px" }}># 4 valeurs · compilées depuis 2025 · 0 warning</div>
            {VALUES.map((v) => (
              <div key={v.title} style={{ marginBottom: 16 }}>
                <div><span style={{ color: "#2563eb" }}>##</span> <b style={{ color: "#ededed" }}>{v.title}</b></div>
                <div style={{ color: "rgba(237,237,237,.62)" }}>{v.body}</div>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <Prompt />{" "}
              <span style={{ display: "inline-block", width: 9, height: 17, background: "#96b9f9", verticalAlign: -3, animation: "hgBlink 1.1s steps(1) infinite" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
