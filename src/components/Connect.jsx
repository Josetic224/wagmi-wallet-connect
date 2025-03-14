import * as React from 'react';
import { useConnect } from 'wagmi';
import { mainnet, optimism, base } from 'wagmi/chains';

export function Connect() {
  const { connectors, connect } = useConnect();
  const [selectedChainId, setSelectedChainId] = React.useState(mainnet.id);

  const availableChains = [mainnet, optimism, base];

  return (
    <div className="container">
      <label>Select Chain:</label>
      <select
        onChange={(e) => setSelectedChainId(Number(e.target.value))}
        value={selectedChainId}
      >
        {availableChains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>

      <div className="buttons">
        {connectors.map((connector) => (
          <ConnectorButton
            key={connector.uid}
            connector={connector}
            onClick={() => connect({ connector, chainId: selectedChainId })}
          />
        ))}
      </div>
    </div>
  );
}

function ConnectorButton({ connector, onClick }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button className="button" disabled={!ready} onClick={onClick} type="button">
      {connector.name}
    </button>
  );
}
