export default function Home() {
  return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center'}}>
      <div style={{textAlign:'center'}}>
        <h1 style={{fontSize:'3rem',letterSpacing:'0.08em'}}>NØID</h1>
        <p style={{opacity:.8,marginTop:8}}>Welcome to Luxgrid UI</p>
        <nav style={{display:'flex',gap:16,justifyContent:'center',marginTop:20}}>
          <a href="/features">Features</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/founder">Founder</a>
        </nav>
      </div>
    </main>
  );
}
