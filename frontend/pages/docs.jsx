import Head from 'next/head';
import Navbar from '../components/Navbar';
import Ticker from '../components/Ticker';

export default function Docs() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'Not configured';
  const networkName = process.env.NEXT_PUBLIC_NETWORK_NAME || 'WireFluid Testnet';
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '92533';
  const rpcUrl = process.env.NEXT_PUBLIC_WIREFLUID_RPC_URL || 'https://evm.wirefluid.com';

  const sections = [
    {
      tag: '01',
      title: 'THE_MISSION',
      content: 'ChainPass PSL delivers verifiable on-chain ticket ownership for PSL matches. Family passes are minted on WireFluid as ERC-721 soulbound NFTs tied to the buyer wallet and validated at gate entry without manual overrides.'
    },
    {
      tag: '02',
      title: 'SOULBOUND_OWNERSHIP',
      content: 'Transfer functions are disabled at the contract level, so ownership remains bound to the original wallet from mint to entry. Minting is restricted to one pass per wallet per match with person count constraints enforced on-chain.'
    },
    {
      tag: '03',
      title: 'MATCH_REGISTRY',
      content: 'Admins register matches on-chain with teams, stadium, timings, and enclosure matrices (name, capacity, and price). The contract enforces active-match checks, enclosure capacity, and stadium limits at mint time.'
    },
    {
      tag: '04',
      title: 'IDENTITY_BINDING',
      content: 'CNIC is formatted and hashed client-side before minting. Only the bytes32 hash is persisted on-chain, preserving privacy while enabling physical-ID validation at entry.'
    },
    {
      tag: '05',
      title: 'SECURE_ENTRY_QR',
      content: 'My Tickets generates a delegated QR payload that rotates on a short interval. Scanner flow verifies signatures, owner address, usage state, and CNIC hash before marking tickets as used on-chain.'
    },
    {
      tag: '06',
      title: 'FAN_LEADERBOARDS',
      content: 'Leaderboard rankings are derived from on-chain mint activity and people-count totals across passes, providing transparent season-wide engagement insights per wallet.'
    }
  ];

  return (
    <>
      <Head>
        <title>Protocol Docs | ChainPass PSL</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.container}>
        <Navbar />
        <Ticker />

        <main style={styles.main}>
          <div className="docs-wrapper" style={styles.docWrapper}>
            {/* Sidebar */}
            <aside className="docs-sidebar" style={styles.sidebar}>
              <div style={styles.sideLabel}>// SYSTEM_DOCUMENTATION</div>
              <ul style={styles.sideList}>
                {sections.map(s => (
                  <li key={s.tag} style={styles.sideItem}>
                    <a href={`#section-${s.tag}`} style={styles.sideLink}>
                      <span style={styles.sideNum}>{s.tag}</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div style={styles.contractBox}>
                <div style={styles.detLabel}>CONTRACT_ADDRESS</div>
                <div style={styles.address}>{contractAddress}</div>
              </div>
            </aside>

            {/* Main content */}
            <section style={styles.content}>
              <header style={styles.header}>
                <div style={styles.secTag}>// TECHNICAL_OVERVIEW</div>
                <h1 style={styles.title}>IMPLEMENTED_ARCHITECTURE</h1>
              </header>

              <div style={styles.sections}>
                {sections.map(s => (
                  <div key={s.tag} id={`section-${s.tag}`} style={styles.docSection}>
                    <div style={styles.secLine} />
                    <div style={styles.secHeader}>
                      <span style={styles.secNum}>{s.tag}</span>
                      <h2 style={styles.secTitle}>{s.title}</h2>
                    </div>
                    <div style={styles.secText}>{s.content}</div>
                  </div>
                ))}
              </div>

              <div style={styles.footerInfo}>
                <div style={styles.infoHex}>i</div>
                <p style={styles.footerText}>
                  This system is configured for <strong>{networkName}</strong> (Chain ID: <strong>{chainId}</strong>){' '}
                  using RPC <strong>{rpcUrl}</strong>. Deployment and initialization scripts target the{' '}
                  <strong>wirefluid</strong> network profile.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        @media (max-width: 860px) {
          .docs-wrapper { grid-template-columns: 1fr !important; }
          .docs-sidebar { position: static !important; display: flex; flex-direction: column; gap: 16px; border-bottom: 1px solid var(--border); padding-bottom: 28px; margin-bottom: 8px; }
        }
      `}</style>
    </>
  );
}

const styles = {
  container: { background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' },
  main: {
    padding: 'clamp(32px, 6vw, 60px) clamp(16px, 5vw, 48px)',
    maxWidth: '1440px',
    margin: '0 auto',
  },
  docWrapper: {
    display: 'grid',
    gridTemplateColumns: 'clamp(200px, 25vw, 300px) 1fr',
    gap: 'clamp(32px, 6vw, 80px)',
  },
  sidebar: {
    position: 'sticky',
    top: '100px',
    alignSelf: 'start',
    height: 'fit-content',
  },
  sideLabel: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--dim)',
    letterSpacing: '2px',
    marginBottom: '28px',
  },
  sideList: { listStyle: 'none', padding: 0, margin: '0 0 48px 0' },
  sideItem: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
    marginBottom: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    letterSpacing: '1px',
    transition: 'color 0.2s',
  },
  sideLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '14px',
    color: 'inherit',
    textDecoration: 'none',
  },
  sideNum: { color: 'var(--g)', fontSize: '10px', flexShrink: 0 },
  contractBox: {
    background: 'rgba(255,255,255,0.02)',
    padding: '16px',
    border: '1px solid var(--border)',
    borderRadius: '4px',
  },
  detLabel: { fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--dim)', marginBottom: '8px', letterSpacing: '1.5px' },
  address: { fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--g)', wordBreak: 'break-all' },
  content: { minWidth: 0 },
  docSection: { position: 'relative', scrollMarginTop: '120px' },
  header: {
    marginBottom: 'clamp(40px, 6vw, 80px)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: 'clamp(24px, 4vw, 40px)',
  },
  secTag: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--muted)',
    letterSpacing: '3px',
    marginBottom: '12px',
  },
  title: {
    fontFamily: 'var(--display)',
    fontSize: 'clamp(32px, 5vw, 56px)',
    letterSpacing: '2px',
    lineHeight: 1.0,
  },
  sections: { display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 7vw, 80px)' },
  docSection: { position: 'relative' },
  secLine: {
    width: '32px',
    height: '2px',
    background: 'var(--g)',
    marginBottom: '20px',
    boxShadow: '0 0 8px rgba(0,255,106,0.4)',
  },
  secHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  secNum: { fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--border2)', flexShrink: 0 },
  secTitle: { fontFamily: 'var(--display)', fontSize: 'clamp(20px, 3vw, 28px)', letterSpacing: '2px' },
  secText: {
    fontFamily: 'var(--body)',
    fontSize: 'clamp(14px, 2vw, 17px)',
    color: 'var(--muted)',
    lineHeight: 1.8,
  },
  footerInfo: {
    marginTop: 'clamp(48px, 8vw, 100px)',
    padding: 'clamp(20px, 4vw, 32px)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    borderRadius: '4px',
    flexWrap: 'wrap',
  },
  infoHex: {
    width: '32px',
    height: '32px',
    background: 'var(--dim)',
    clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    color: 'var(--bg)',
    flexShrink: 0,
  },
  footerText: {
    fontFamily: 'var(--mono)',
    fontSize: 'clamp(11px, 1.5vw, 12px)',
    color: 'var(--dim)',
    lineHeight: 1.7,
    flex: 1,
  },
};
