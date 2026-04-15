import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractInfo from '../utils/contractData.json';

const RPC_URL = process.env.NEXT_PUBLIC_WIREFLUID_RPC_URL || 'https://evm.wirefluid.com';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractInfo.address;

function StatBlock({ idx, value, label, pill, pillGold, gold }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="stat-block"
      style={{
        ...styles.block,
        ...(hovered ? styles.blockHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.idx}>{idx}</div>
      <div style={{ ...styles.num, color: gold ? 'var(--gold)' : 'var(--g)' }}>{value}</div>
      <div style={styles.label}>{label}</div>
      <span style={{ ...styles.pill, ...(pillGold ? styles.pillGold : {}) }}>{pill}</span>
      <div
        style={{
          ...styles.underline,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />
    </div>
  );
}

export default function StatsBand() {
  const [stats, setStats] = useState({
    minted: null,
    matchTotal: null,
    activeMatches: null,
    contractBalance: null,
  });

  useEffect(() => {
    let active = true;
    let timer;

    const loadStats = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const code = await provider.getCode(CONTRACT_ADDRESS);
        if (!code || code === '0x') {
          if (active) {
            setStats({ minted: null, matchTotal: null, activeMatches: null, contractBalance: null });
          }
          return;
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractInfo.abi, provider);
        const [totalSupply, matchCount, balance] = await Promise.all([
          contract.totalSupply(),
          contract.getMatchCount(),
          provider.getBalance(CONTRACT_ADDRESS),
        ]);

        const matchTotal = Number(matchCount);
        const matches = await Promise.all(
          Array.from({ length: matchTotal }, (_, idx) =>
            contract.matches(idx).catch(() => null)
          )
        );
        const activeMatches = matches.filter((match) => match?.isActive).length;
        const contractBalance = Number(ethers.formatEther(balance));

        if (active) {
          setStats({
            minted: Number(totalSupply),
            matchTotal,
            activeMatches,
            contractBalance,
          });
        }
      } catch (error) {
        console.error('Failed to load live stats:', error);
        if (active) {
          setStats({ minted: null, matchTotal: null, activeMatches: null, contractBalance: null });
        }
      }
    };

    loadStats();
    timer = setInterval(loadStats, 30000);

    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  const mintedDisplay = stats.minted === null ? '--' : stats.minted.toLocaleString();
  const matchTotalDisplay = stats.matchTotal === null ? '--' : stats.matchTotal.toLocaleString();
  const activeMatchesDisplay = stats.activeMatches === null ? '--' : stats.activeMatches.toLocaleString();
  const contractBalanceDisplay = stats.contractBalance === null
    ? '--'
    : `${stats.contractBalance.toFixed(3)} WIRE`;

  return (
    <div className="stats-band" style={styles.band}>
      <StatBlock idx="STATS_01 //" value={mintedDisplay} label="TICKETS_MINTED" pill="SOURCE: ON_CHAIN" />
      <StatBlock idx="STATS_02 //" value={matchTotalDisplay} label="MATCHES_TOTAL" pill="SOURCE: ON_CHAIN" />
      <StatBlock idx="STATS_03 //" value={activeMatchesDisplay} label="MATCHES_ACTIVE" pill="STATUS: LIVE" />
      <StatBlock idx="STATS_04 //" value={contractBalanceDisplay} label="CONTRACT_BALANCE" pill="ASSETS: CUSTODIAL" gold pillGold />

      <style>{`
        @media (max-width: 860px) {
          .stats-band { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-block { border-bottom: 1px solid var(--border) !important; padding: 24px 20px !important; }
          .stat-block:nth-child(2), .stat-block:nth-child(4) { border-right: none !important; }
          .stat-block:nth-child(3), .stat-block:nth-child(4) { border-bottom: none !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  band: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    borderBottom: '1px solid var(--border)',
  },
  block: {
    padding: 'clamp(20px, 4vw, 36px) clamp(16px, 3vw, 40px)',
    borderRight: '1px solid var(--border)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.3s',
    cursor: 'default',
  },
  blockHover: {
    background: 'var(--surface)',
  },
  idx: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--dim)',
    letterSpacing: '2px',
    marginBottom: '14px',
  },
  num: {
    fontFamily: 'var(--display)',
    fontSize: 'clamp(28px, 4vw, 44px)',
    letterSpacing: '1px',
    lineHeight: 1,
  },
  label: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
    letterSpacing: '1.5px',
    marginTop: '8px',
  },
  pill: {
    display: 'inline-block',
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--g)',
    border: '1px solid var(--border2)',
    padding: '3px 8px',
    marginTop: '10px',
    letterSpacing: '1px',
  },
  pillGold: {
    color: 'var(--gold)',
    borderColor: 'var(--gold2)',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'var(--g)',
    transformOrigin: 'left',
    transition: 'transform 0.5s ease',
  },
};
