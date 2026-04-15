import { useState } from 'react';

const FEATURES = [
  {
    idx: 'C_01 //',
    title: 'SOULBOUND_LOCK',
    desc: 'Tickets are soulbound ERC-721 NFTs. Transfers are disabled at the contract level, so ownership stays with the original buyer.',
    pill: 'NON_TRANSFERABLE',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--g)" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="1" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    idx: 'C_02 //',
    title: 'MATCH_CAP_ENFORCEMENT',
    desc: 'Matches are registered on-chain with stadium capacity and enclosure limits. The contract enforces availability at mint time.',
    pill: 'ON_CHAIN_RULES',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--g)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    ),
  },
  {
    idx: 'C_03 //',
    title: 'DYNAMIC_QR_ENTRY',
    desc: 'Gate entry uses a rotating, signed QR payload. Scanners verify ownership and mark tickets as used on-chain.',
    pill: 'GATE_VERIFIED',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--g)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    idx: 'C_04 //',
    title: 'SCANNER_AUTHORIZATION',
    desc: 'Only approved scanners and contract owners can validate entry. Unauthorized scans are rejected at the contract level.',
    pill: 'ROLE_GATED',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--g)" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    idx: 'C_05 //',
    title: 'FAN_LEADERBOARDS',
    desc: 'Leaderboards are computed from on-chain tickets. Each match contributes points to both teams in the fixture.',
    pill: 'TEAM_RANKINGS',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--g)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10" />
        <path d="M6 4l2 10h8l2-10" />
      </svg>
    ),
  },
  {
    idx: 'C_06 //',
    title: 'PUBLIC_LEDGER_AUDIT',
    desc: 'Ticket state is public and auditable on-chain, including match linkage, mint counts, and entry usage.',
    pill: 'OPEN_LEDGER',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--g)" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

function FeatureCard({ feature }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        background: hovered ? 'var(--surface)' : 'var(--bg)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          ...styles.leftBar,
          height: hovered ? '100%' : '0%',
        }}
      />
      <div style={styles.idx}>{feature.idx}</div>
      <div style={styles.iconWrap}>{feature.icon}</div>
      <div style={styles.title}>{feature.title}</div>
      <div style={styles.desc}>{feature.desc}</div>
      <span style={styles.pill}>{feature.pill}</span>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHead}>
        <div style={styles.secNum}>V2</div>
        <div>
          <div style={styles.secTag}>// MODULE_FEATURES</div>
          <div style={styles.secTitle}>CORE_PROTOCOLS</div>
        </div>
      </div>
      <div className="features-grid" style={styles.grid}>
        {FEATURES.map((f) => (
          <FeatureCard key={f.idx} feature={f} />
        ))}
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 48px',
    borderBottom: '1px solid var(--border)',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '20px',
    marginBottom: 'clamp(32px, 5vw, 64px)',
    flexWrap: 'wrap',
  },
  secNum: {
    fontFamily: 'var(--display)',
    fontSize: 'clamp(48px, 6vw, 72px)',
    color: 'var(--border2)',
    lineHeight: 1,
  },
  secTag: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
    letterSpacing: '2px',
    marginBottom: '6px',
  },
  secTitle: {
    fontFamily: 'var(--display)',
    fontSize: 'clamp(24px, 4vw, 36px)',
    color: 'var(--text)',
    letterSpacing: '2px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    background: 'var(--border)',
  },
  card: {
    padding: '36px',
    transition: 'background 0.3s',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  leftBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    background: 'var(--g)',
    transition: 'height 0.35s ease',
  },
  idx: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--dim)',
    letterSpacing: '2px',
    marginBottom: '20px',
  },
  iconWrap: {
    width: '44px',
    height: '44px',
    border: '1px solid var(--border2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  title: {
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    color: 'var(--text)',
    letterSpacing: '1px',
    marginBottom: '10px',
  },
  desc: {
    fontFamily: 'var(--body)',
    fontSize: '12.5px',
    color: 'var(--muted)',
    lineHeight: 1.8,
    fontWeight: 300,
  },
  pill: {
    display: 'inline-block',
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--g)',
    border: '1px solid var(--border2)',
    padding: '3px 10px',
    marginTop: '16px',
    letterSpacing: '1.5px',
    background: 'rgba(0,255,106,0.03)',
  },
};
