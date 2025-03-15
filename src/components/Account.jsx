// import * as React from 'react';
// import { useAccount, useConnect, useDisconnect } from 'wagmi';
// import { mainnet, optimism, base, polygon } from 'wagmi/chains';
// import { useSwitchChain } from 'wagmi';

// const ConnectWalletModal = () => {
//   const { isConnected } = useAccount();
//   const { connectors, connect, isPending } = useConnect();
//   const { disconnect } = useDisconnect();
//   const { switchChain } = useSwitchChain();
  
//   const [selectedChain, setSelectedChain] = React.useState('mainnet');
//   const [isOpen, setIsOpen] = React.useState(true);
  
//   const blockchains = [
//     { id: 'mainnet', name: 'Bitcoin', chainId: mainnet.id },
//     { id: 'ethereum', name: 'Ethereum', chainId: mainnet.id },
//     { id: 'solana', name: 'Solana', chainId: mainnet.id },
//     { id: 'polygon', name: 'Polygon', chainId: polygon.id }
//   ];
  
//   const handleChainSelect = (chainId) => {
//     setSelectedChain(chainId);
//     const selected = blockchains.find(chain => chain.id === chainId);
//     if (selected && isConnected) {
//       switchChain({ chainId: selected.chainId });
//     }
//   };
  
//   const handleCloseModal = () => {
//     setIsOpen(false);
//   };
  
//   // Function to get wallet icon URLs based on connector ID
//   const getWalletIconUrl = (connectorId) => {
//     const iconMap = {
//       'metaMask': '/api/placeholder/24/24', // Replace with real MetaMask icon URL 
//       'walletConnect': '/api/placeholder/24/24', // Replace with real WalletConnect icon URL
//       'coinbaseWallet': '/api/placeholder/24/24', // Replace with real Coinbase Wallet icon URL
//       'safe': '/api/placeholder/24/24', // Replace with real Safe icon URL
//       'ledger': '/api/placeholder/24/24', // Replace with real Ledger icon URL
//       'trust': '/api/placeholder/24/24', // Replace with real Trust Wallet icon URL
//       'exodus': '/api/placeholder/24/24', // Replace with real Exodus icon URL
//     };
    
//     return iconMap[connectorId] || '/api/placeholder/24/24';
//   };
  
//   // Split connectors into popular and more categories
//   const popularConnectors = connectors.filter(c => 
//     ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Trust Wallet'].includes(c.name)
//   );
  
//   const moreConnectors = connectors.filter(c => 
//     !['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Trust Wallet'].includes(c.name)
//   );
  
//   if (!isOpen) return null;
  
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-90 fixed inset-0 z-50">
//       <div className="bg-black w-full max-w-md rounded-lg border border-gray-800 p-6 text-white shadow-lg">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <div className="bg-purple-500 p-2 rounded mr-3">
//               <span className="text-white font-bold">FG</span>
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">Connect wallet</h2>
//               <p className="text-sm text-gray-400">Select your wallet from the options below</p>
//             </div>
//           </div>
//           <button 
//             className="text-gray-400 hover:text-white"
//             onClick={handleCloseModal}
//           >
//             ✕
//           </button>
//         </div>
        
//         <div className="flex space-x-4 mb-4 border-b border-gray-800 pb-2">
//           {blockchains.map(chain => (
//             <button
//               key={chain.id}
//               className={`pb-2 ${selectedChain === chain.id ? 'border-b-2 border-white font-medium' : 'text-gray-400'}`}
//               onClick={() => handleChainSelect(chain.id)}
//             >
//               {chain.name}
//             </button>
//           ))}
//         </div>
        
//         {!isConnected ? (
//           <>
//             {popularConnectors.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-xs text-gray-500 mb-2">POPULAR</p>
//                 {popularConnectors.map((connector) => {
//                   const connectorId = connector.id || connector.uid;
//                   return (
//                     <div 
//                       key={connector.uid}
//                       className="bg-gray-900 rounded-lg p-4 mb-2 flex justify-between items-center cursor-pointer hover:bg-gray-800"
//                       onClick={() => connect({ connector })}
//                     >
//                       <span>{connector.name}</span>
//                       <img 
//                         src={getWalletIconUrl(connectorId)} 
//                         alt={`${connector.name} icon`}
//                         className="h-6 w-6"
//                       />
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
            
//             {moreConnectors.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-xs text-gray-500 mb-2">MORE</p>
//                 {moreConnectors.map((connector) => {
//                   const connectorId = connector.id || connector.uid;
//                   return (
//                     <div 
//                       key={connector.uid}
//                       className="bg-gray-900 rounded-lg p-4 mb-2 flex justify-between items-center cursor-pointer hover:bg-gray-800"
//                       onClick={() => connect({ connector })}
//                     >
//                       <span>{connector.name}</span>
//                       <img 
//                         src={getWalletIconUrl(connectorId)} 
//                         alt={`${connector.name} icon`}
//                         className="h-6 w-6"
//                       />
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="account-info">
//             <div className="avatar" />
//             <div className="account-details">
//               <button 
//                 className="disconnect-button" 
//                 onClick={() => disconnect()} 
//                 type="button"
//               >
//                 Disconnect
//               </button>
//             </div>
//           </div>
//         )}
        
//         <p className="text-xs text-gray-500 mt-4">
//           Your passkeys are to be kept private to you and not shared with anyone. We will never call you to ask for them.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ConnectWalletModal;