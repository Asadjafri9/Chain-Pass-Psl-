const STEPS = [
  {
    num: '01',
    title: 'LOGIN_WITH_WALLET',
    desc: 'Connect your wallet to verify your identity. Your ticket ownership stays bound to the same wallet from mint to entry.',
  },
  {
    num: '02',
    title: 'PAY_WITH_WIREFLUID',
    desc: 'Pay directly on WireFluid. The mint transaction is recorded on-chain and tied to your wallet.',
  },
  {
    num: '03',
    title: 'NFT_LIVES_IN_WALLET',
    desc: 'Your ticket appears in "My Tickets" as a verifiable NFT. It is a permanent on-chain record of attendance and fan status.',
  },
  {
    num: '04',
    title: 'SCAN_AT_STADIUM_GATE',
    desc: 'Present the live-refreshing QR code. The gate scanner verifies on-chain ownership in real time. Verification confirmed — entry granted.',
  },
];

export default function HowItWorks() {
  return (
    <div className="how-it-works-section" style={styles.section}>
      <div className="how-it-works-left" style={styles.left}>
        <div style={styles.tag}>// V3</div>
        <div style={styles.title}>HOW_IT<br />WORKS</div>
        <div style={styles.subtitle}>
          Wallet-first flow. Four steps from mint to stadium gate.
        </div>
      </div>
      <div className="how-it-works-right" style={styles.right}>
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            style={{
              ...styles.stepRow,
              borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={styles.stepNum}>{step.num}</div>
            <div>
              <div style={styles.stepTitle}>{step.title}</div>
              <div style={styles.stepDesc}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .how-it-works-section { grid-template-columns: 1fr !important; }
          .how-it-works-left { border-right: none !important; border-bottom: 1px solid var(--border) !important; padding-bottom: 40px !important; align-items: center !important; text-align: center !important; }
          .how-it-works-right { padding-top: 40px !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  section: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    borderBottom: '1px solid var(--border)',
  },
  left: {
    padding: 'clamp(40px, 6vw, 64px) clamp(24px, 4vw, 40px)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tag: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
    letterSpacing: '2px',
    marginBottom: '12px',
  },
  title: {
    fontFamily: 'var(--display)',
    fontSize: 'clamp(32px, 5vw, 40px)',
    color: 'var(--text)',
    letterSpacing: '2px',
    marginBottom: '16px',
    lineHeight: 1,
  },
  subtitle: {
    fontFamily: 'var(--body)',
    fontSize: '13px',
    color: 'var(--muted)',
    lineHeight: 1.8,
    fontWeight: 300,
  },
  right: {
    padding: 'clamp(40px, 6vw, 64px) clamp(24px, 4vw, 48px)',
  },
  stepRow: {
    display: 'flex',
    gap: 'clamp(12px, 3vw, 20px)',
    padding: '24px 0',
  },
  stepNum: {
    width: '32px',
    height: '32px',
    border: '1px solid var(--border2)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
    marginTop: '2px',
  },
  stepTitle: {
    fontFamily: 'var(--mono)',
    fontSize: '13px',
    color: 'var(--text)',
    letterSpacing: '1px',
    marginBottom: '6px',
  },
  stepDesc: {
    fontFamily: 'var(--body)',
    fontSize: '12px',
    color: 'var(--muted)',
    lineHeight: 1.7,
    fontWeight: 300,
  },
};
