import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractInfo from '../utils/contractData.json';

const RPC_URL = process.env.NEXT_PUBLIC_WIREFLUID_RPC_URL || 'https://evm.wirefluid.com';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractInfo.address;
const NETWORK_LABEL = process.env.NEXT_PUBLIC_NETWORK_NAME || 'WireFluid Testnet';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || '92533';

export default function Ticker() {
  const [stats, setStats] = useState({
    contractStatus: 'CHECKING',
    blockNumber: '--',
    minted: '--',
    activeMatches: '--',
    totalMatches: '--',
    balance: '--',
    gasPrice: '--',
  });

  useEffect(() => {
    let active = true;
    let timer;

    const loadTicker = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const [code, blockNumber, feeData, balance] = await Promise.all([
          provider.getCode(CONTRACT_ADDRESS),
          provider.getBlockNumber(),
          provider.getFeeData(),
          provider.getBalance(CONTRACT_ADDRESS),
        ]);

        const contractStatus = code && code !== '0x' ? 'ACTIVE' : 'NOT_DEPLOYED';
        if (code && code !== '0x') {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractInfo.abi, provider);
          const [totalSupply, matchCount] = await Promise.all([
            contract.totalSupply(),
            contract.getMatchCount(),
          ]);

          const matchTotal = Number(matchCount);
          const matches = await Promise.all(
            Array.from({ length: matchTotal }, (_, idx) =>
              contract.matches(idx).catch(() => null)
            )
          );
          const activeMatches = matches.filter((match) => match?.isActive).length;

          const gasPrice = feeData?.gasPrice
            ? `${ethers.formatUnits(feeData.gasPrice, 'gwei')} GWEI`
            : '--';

          if (active) {
            setStats({
              contractStatus,
              blockNumber: `#${blockNumber.toLocaleString()}`,
              minted: `${Number(totalSupply).toLocaleString()} NFTs`,
              activeMatches: activeMatches.toLocaleString(),
              totalMatches: matchTotal.toLocaleString(),
              balance: `${Number(ethers.formatEther(balance)).toFixed(3)} WIRE`,
              gasPrice,
            });
          }
        } else if (active) {
          setStats((prev) => ({
            ...prev,
            contractStatus,
            blockNumber: `#${blockNumber.toLocaleString()}`,
          }));
        }
      } catch (error) {
        console.error('Failed to load ticker stats:', error);
        if (active) {
          setStats((prev) => ({
            ...prev,
            contractStatus: 'OFFLINE',
          }));
        }
      }
    };

    loadTicker();
    timer = setInterval(loadTicker, 20000);

    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  const items = [
    { label: 'CONTRACT', value: stats.contractStatus, gold: stats.contractStatus !== 'ACTIVE' },
    { label: 'BLOCK', value: stats.blockNumber, gold: false },
    { label: 'MINTED', value: stats.minted, gold: false },
    { label: 'MATCHES_ACTIVE', value: stats.activeMatches, gold: false },
    { label: 'MATCHES_TOTAL', value: stats.totalMatches, gold: false },
    { label: 'BALANCE', value: stats.balance, gold: true },
    { label: 'GAS', value: stats.gasPrice, gold: false },
    { label: 'NETWORK', value: NETWORK_LABEL.toUpperCase(), gold: false },
    { label: 'CHAIN_ID', value: CHAIN_ID, gold: false },
  ];

  const TickerItems = () => (
    <div style={styles.seg}>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} style={styles.item}>
          {item.label}:{' '}
          <b style={{ color: item.gold ? 'var(--gold)' : 'var(--g)', fontWeight: 400 }}>
            {item.value}
          </b>
        </span>
      ))}
    </div>
  );

  return (
    <div style={styles.ticker}>
      <div style={styles.track}>
        <TickerItems />
        <TickerItems />
      </div>
      <style>{`
        @keyframes tick {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  ticker: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '8px 0',
    overflow: 'hidden',
  },
  track: {
    display: 'flex',
    animation: 'tick 28s linear infinite',
    whiteSpace: 'nowrap',
  },
  seg: {
    display: 'flex',
    flexShrink: 0,
  },
  item: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    letterSpacing: '1.5px',
    color: 'var(--dim)',
    padding: '0 24px',
    borderRight: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
};
