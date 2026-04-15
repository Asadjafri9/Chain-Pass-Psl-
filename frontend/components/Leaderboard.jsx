import { useEffect, useMemo, useState } from 'react';
import { useWeb3 } from '../utils/Web3Context';
import { PSL_TEAMS } from '../utils/stadiumData';

const TEAM_LOGOS = {
  'hyderabad kingsmen': '/team_logos/hyderabad.png',
  'islamabad united': '/team_logos/islamabad.png',
  'karachi kings': '/team_logos/Karachi.png',
  'lahore qalandars': '/team_logos/lahore.png',
  'multan sultans': '/team_logos/multan.png',
  'peshawar zalmi': '/team_logos/peshawar.png',
  'quetta gladiators': '/team_logos/quetta.png',
  'rawalpindiz': '/team_logos/rawalpindiz.png',
};

const getTeamLogo = (team) => TEAM_LOGOS[team.toLowerCase()] || '';

export default function Leaderboard() {
  const { contract, account, web3Error } = useWeb3();
  const [overallRows, setOverallRows] = useState([]);
  const [teamRows, setTeamRows] = useState({});
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const teamMap = useMemo(() => {
    return PSL_TEAMS.reduce((acc, team) => {
      acc[team] = new Map();
      return acc;
    }, {});
  }, []);

  const extractTeams = (teamsLabel) => {
    if (!teamsLabel) return [];
    const label = teamsLabel.toLowerCase();
    const matched = PSL_TEAMS.filter((team) => label.includes(team.toLowerCase()));
    if (matched.length) return matched;

    const parts = teamsLabel
      .split(/vs|v\.|v|-/i)
      .map((part) => part.trim())
      .filter(Boolean);
    return parts.length ? parts.slice(0, 2) : [];
  };

  useEffect(() => {
    let active = true;
    const loadLeaderboard = async () => {
      if (web3Error) {
        if (active) {
          setOverallRows([]);
          setTeamRows({});
          setError(web3Error);
          setLoading(false);
        }
        return;
      }
      if (!contract) {
        if (active) {
          setOverallRows([]);
          setTeamRows({});
          setError('');
          setLoading(false);
        }
        return;
      }
      try {
        const tallies = new Map();
        const matchIds = new Set();
        const perTeam = PSL_TEAMS.reduce((acc, team) => {
          acc[team] = new Map();
          return acc;
        }, {});

        const totalSupply = await contract.totalSupply();
        for (let tokenId = 0; tokenId < Number(totalSupply); tokenId++) {
          const ticketData = await contract.getTicketData(tokenId);
          const owner = (ticketData?.owner ?? ticketData?.[0] ?? '').toString();
          const ticketObj = ticketData?.ticketObj ?? ticketData?.[1];
          const matchObj = ticketData?.matchObj ?? ticketData?.[2];
          const wallet = owner.toLowerCase();
          if (!wallet) continue;

          const current = tallies.get(wallet) || { wallet, count: 0, matches: new Set() };
          const personCount = Number(ticketObj?.personCount ?? 1n);
          const matchId = Number(ticketObj?.matchId ?? matchObj?.matchId ?? 0);

          if (!Number.isNaN(matchId)) {
            current.matches.add(matchId);
            matchIds.add(matchId);
          }
          current.count += personCount;
          tallies.set(wallet, current);

          const teams = extractTeams(matchObj?.teams);
          teams.forEach((team) => {
            const teamBucket = perTeam[team] || teamMap[team];
            if (!teamBucket) return;
            const currentTeam = teamBucket.get(wallet) || { wallet, count: 0, matches: new Set() };
            if (!Number.isNaN(matchId)) currentTeam.matches.add(matchId);
            currentTeam.count += personCount;
            teamBucket.set(wallet, currentTeam);
          });
        }

        const sortedRows = [...tallies.values()]
          .map((row) => ({
            wallet: row.wallet,
            count: row.count,
            matches: row.matches.size,
          }))
          .sort((left, right) => {
            if (right.matches !== left.matches) return right.matches - left.matches;
            if (right.count !== left.count) return right.count - left.count;
            return left.wallet.localeCompare(right.wallet);
          });

        const perTeamRows = Object.fromEntries(
          PSL_TEAMS.map((team) => {
            const teamBucket = perTeam[team] || teamMap[team];
            const rows = [...teamBucket.values()]
              .map((row) => ({
                wallet: row.wallet,
                count: row.count,
                matches: row.matches.size,
              }))
              .sort((left, right) => {
                if (right.matches !== left.matches) return right.matches - left.matches;
                if (right.count !== left.count) return right.count - left.count;
                return left.wallet.localeCompare(right.wallet);
              });
            return [team, rows];
          })
        );

        if (active) {
          setOverallRows(sortedRows);
          setTeamRows(perTeamRows);
          setTotalMatches(matchIds.size);
          setError('');
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        if (active) {
          setOverallRows([]);
          setTeamRows({});
          setError('Unable to load leaderboard data.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    loadLeaderboard();
    return () => { active = false; };
  }, [account, contract, web3Error, teamMap]);

  return (
    <section style={styles.panel}>
      <div style={styles.header}>
        <div style={styles.tag}>// LIFETIME_LEADERBOARD</div>
        <h2 style={styles.title}>TOP_WALLET_RANKINGS</h2>
        <p style={styles.copy}>
          Ranked by points earned from total matches watched. Each ticket counts toward both teams in its match.
        </p>
      </div>

      <div className="leaderboard-summary" style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{overallRows.length.toLocaleString()}</div>
          <div style={styles.summaryLabel}>WALLETS_TRACKED</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{totalMatches.toLocaleString()}</div>
          <div style={styles.summaryLabel}>MATCHES_WATCHED</div>
        </div>
      </div>

      {loading ? (
        <div style={styles.state}>
          <div style={styles.spinner} />
          <span>// LOADING_LEADERBOARD...</span>
        </div>
      ) : error ? (
        <div style={{ ...styles.state, ...styles.errorState }}>{error}</div>
      ) : overallRows.length === 0 ? (
        <div style={styles.state}>NO_TICKET_ACTIVITY_YET.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <div style={styles.table}>
            <div style={styles.tableHead}>
              <span>RANK</span>
              <span>WALLET</span>
              <span style={{ textAlign: 'right' }}>POINTS</span>
              <span style={{ textAlign: 'right' }}>STATUS</span>
            </div>

            {overallRows.slice(0, 10).map((row, index) => {
              const isCurrentWallet = account && row.wallet === account.toLowerCase();
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;

              return (
                <div
                  key={row.wallet}
                  style={{
                    ...styles.tableRow,
                    ...(isCurrentWallet ? styles.currentRow : {}),
                    ...(index === 0 ? styles.topRow : {}),
                  }}
                >
                  <span style={styles.rank}>
                    {medal || `#${String(index + 1).padStart(2, '0')}`}
                  </span>
                  <span style={styles.wallet}>
                    {row.wallet.slice(0, 6)}...{row.wallet.slice(-6)}
                  </span>
                  <span style={styles.count}>{row.matches.toLocaleString()}</span>
                  <span
                    style={{
                      ...styles.status,
                      color: isCurrentWallet ? 'var(--g)' : index === 0 ? 'var(--gold)' : 'var(--muted)',
                    }}
                  >
                    {isCurrentWallet ? 'YOU' : index === 0 ? 'LEADER' : 'TRACKED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.teamSection}>
        <div style={styles.teamHeader}>
          <div style={styles.tag}>// TEAM_LEADERBOARDS</div>
          <h3 style={styles.teamTitle}>FAN_BASE_RANKINGS_BY_TEAM</h3>
          <p style={styles.copy}>Each ticket counts for both teams in the match. Points equal total matches watched.</p>
        </div>

        <div style={styles.teamGrid}>
          {PSL_TEAMS.map((team) => {
            const rows = teamRows[team] || [];
            const logo = getTeamLogo(team);
            return (
              <div key={team} style={styles.teamCard}>
                <div style={styles.teamCardHeader}>
                  <div style={styles.teamTitleRow}>
                    {logo ? (
                      <img
                        src={logo}
                        alt={`${team} logo`}
                        style={styles.teamLogo}
                      />
                    ) : (
                      <div style={styles.teamLogoFallback} />
                    )}
                    <div style={styles.teamName}>{team.toUpperCase()}</div>
                  </div>
                  <div style={styles.teamMeta}>
                    {rows.length.toLocaleString()} WALLETS
                  </div>
                </div>

                {loading ? (
                  <div style={styles.teamState}>LOADING...</div>
                ) : rows.length === 0 ? (
                  <div style={styles.teamState}>NO_ACTIVITY</div>
                ) : (
                  <div style={styles.teamTable}>
                    <div style={styles.teamHead}>
                      <span>RANK</span>
                      <span>WALLET</span>
                      <span style={{ textAlign: 'right' }}>POINTS</span>
                    </div>
                    {rows.slice(0, 5).map((row, index) => {
                      const isCurrentWallet = account && row.wallet === account.toLowerCase();
                      return (
                        <div
                          key={`${team}-${row.wallet}`}
                          style={{
                            ...styles.teamRow,
                            ...(isCurrentWallet ? styles.currentRow : {}),
                          }}
                        >
                          <span style={styles.rank}>#{String(index + 1).padStart(2, '0')}</span>
                          <span style={styles.wallet}>
                            {row.wallet.slice(0, 6)}...{row.wallet.slice(-6)}
                          </span>
                          <span style={styles.count}>{row.matches.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes rotateSpinner { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .leaderboard-summary { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .leaderboard-summary { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

const styles = {
  panel: {
    border: '1px solid var(--border)',
    background: 'linear-gradient(180deg, rgba(0,255,106,0.03), rgba(255,255,255,0.01))',
    padding: 'clamp(20px, 4vw, 28px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderRadius: '4px',
  },
  header: { display: 'flex', flexDirection: 'column', gap: '10px' },
  tag: { fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--g)', letterSpacing: '2.5px' },
  title: { fontFamily: 'var(--display)', fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '1px' },
  copy: { fontFamily: 'var(--mono)', fontSize: '11px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '640px' },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  summaryCard: {
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.02)',
    padding: 'clamp(14px, 3vw, 20px)',
    borderRadius: '4px',
  },
  summaryValue: { fontFamily: 'var(--display)', fontSize: 'clamp(22px, 4vw, 32px)', color: 'var(--text)', marginBottom: '6px' },
  summaryLabel: { fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--dim)', letterSpacing: '1.5px' },
  state: {
    border: '1px dashed var(--border2)',
    padding: '20px',
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderRadius: '4px',
  },
  errorState: { color: 'var(--danger)', borderColor: 'var(--danger)' },
  spinner: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid var(--border2)',
    borderTopColor: 'var(--g)',
    animation: 'rotateSpinner 0.8s linear infinite',
    flexShrink: 0,
  },
  tableWrapper: { overflowX: 'auto', width: '100%' },
  table: { display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '520px' },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '60px minmax(0, 1fr) 90px 90px',
    gap: '12px',
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--dim)',
    letterSpacing: '1.5px',
    padding: '0 14px',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '60px minmax(0, 1fr) 90px 90px',
    gap: '12px',
    alignItems: 'center',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.02)',
    padding: '12px 14px',
    transition: 'border-color 0.2s, background 0.2s',
    borderRadius: '2px',
  },
  currentRow: {
    borderColor: 'var(--g)',
    background: 'rgba(0,255,106,0.04)',
    boxShadow: '0 0 0 1px rgba(0,255,106,0.1) inset',
  },
  topRow: {
    borderColor: 'var(--gold2)',
    background: 'rgba(232,184,75,0.04)',
  },
  rank: {
    fontFamily: 'var(--display)',
    fontSize: '18px',
    color: 'var(--g)',
  },
  wallet: {
    fontFamily: 'var(--mono)',
    fontSize: 'clamp(10px, 1.5vw, 12px)',
    color: 'var(--text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  count: {
    fontFamily: 'var(--display)',
    fontSize: '20px',
    color: 'var(--text)',
    textAlign: 'right',
  },
  status: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    textAlign: 'right',
    letterSpacing: '1px',
  },
  teamSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  teamHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  teamTitle: {
    fontFamily: 'var(--display)',
    fontSize: 'clamp(20px, 3vw, 26px)',
    letterSpacing: '1px',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '14px',
  },
  teamCard: {
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.015)',
    borderRadius: '4px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  teamCardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  teamTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  teamLogo: {
    width: '26px',
    height: '26px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 6px rgba(0,255,106,0.2))',
  },
  teamLogoFallback: {
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    border: '1px solid var(--border2)',
    background: 'rgba(255,255,255,0.03)',
  },
  teamName: {
    fontFamily: 'var(--display)',
    fontSize: '18px',
    letterSpacing: '1px',
  },
  teamMeta: {
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--muted)',
    letterSpacing: '1.5px',
  },
  teamTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  teamHead: {
    display: 'grid',
    gridTemplateColumns: '52px minmax(0, 1fr) 70px',
    gap: '8px',
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--dim)',
    letterSpacing: '1.5px',
  },
  teamRow: {
    display: 'grid',
    gridTemplateColumns: '52px minmax(0, 1fr) 70px',
    gap: '8px',
    alignItems: 'center',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.02)',
    padding: '10px 12px',
    borderRadius: '3px',
  },
  teamState: {
    border: '1px dashed var(--border2)',
    padding: '14px',
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--muted)',
    textAlign: 'center',
    borderRadius: '3px',
  },
};
