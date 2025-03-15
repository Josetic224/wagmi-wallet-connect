import { useEffect, useState } from "react";
import "./index.css";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance, useChainId } from "wagmi";
import { supportedChains } from "./wagmi";

const Wagmi = () => {
  const { address, connector, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  
  // New: Use the useBalance hook to fetch account balance
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address,
    watch: true,
  });

  const [isWalletSelectionOpen, setWalletSelectionOpen] = useState(false);
  const [activeConnector, setActiveConnector] = useState(null);
  const [animateIntro, setAnimateIntro] = useState(true);
  const [connectStatus, setConnectStatus] = useState({});
  const [walletIcons, setWalletIcons] = useState({});
  const [activePage, setActivePage] = useState("intro");
  
  // New: State for formatted balance display
  const [formattedBalance, setFormattedBalance] = useState({
    value: "0.00",
    symbol: "ETH",
    usdValue: "0.00",
  });

  // New: Fetch token prices for USD conversion (mock implementation)
  const getTokenPrice = (symbol) => {
    // This would be replaced with an actual price API
    const mockPrices = {
      "ETH": 3450.75,
      "MATIC": 1.25,
      "AVAX": 28.50,
      "BNB": 440.80,
      "ARBITRUM": 1.75,
      "OPTIMISM": 3.20,
    };
    
    return mockPrices[symbol] || 0;
  };

  // New: Update balance display when balanceData changes
  useEffect(() => {
    if (balanceData) {
      // Format the native token value (truncated to 4 decimal places)
      const tokenValue = parseFloat(balanceData.formatted).toFixed(4);
      const tokenSymbol = balanceData.symbol;
      
      // Calculate USD value based on token price
      const tokenPrice = getTokenPrice(tokenSymbol);
      const usdValue = (parseFloat(tokenValue) * tokenPrice).toFixed(2);
      
      setFormattedBalance({
        value: tokenValue,
        symbol: tokenSymbol,
        usdValue: usdValue,
      });
    }
  }, [balanceData, chainId]);

  useEffect(() => {
    // Extract icons from connectors
    const icons = {};
    connectors.forEach(connector => {
      if (connector.icon) {
        icons[connector.id] = connector.icon;
      }
    });
    setWalletIcons(icons);
  }, [connectors]);

  useEffect(() => {
    if (connectors.length === 0 || !address) return;
    setActiveConnector(connector);
    setWalletSelectionOpen(false);
  }, [connector, connectors, address]);

  useEffect(() => {
    // Turn off intro animation after 3 seconds
    const timer = setTimeout(() => setAnimateIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleConnectWallet = () => setWalletSelectionOpen(true);
  
  const handleSelectConnector = (selectedConnector) => {
    setConnectStatus(prev => ({ 
      ...prev, 
      [selectedConnector.id]: "connecting" 
    }));
    connect({ connector: selectedConnector });
  };

  const handleDisconnectWallet = () => {
    if (activeConnector) {
      disconnect();
      setActiveConnector(null);
      setWalletSelectionOpen(false);
    }
  };

  const handleSwitchNetwork = async (chainId) => switchChain({ chainId: Number(chainId) });

  // Function to render wallet icon
  const renderWalletIcon = (wallet) => {
    if (walletIcons[wallet.id]) {
      return (
        <img 
          src={walletIcons[wallet.id]} 
          alt={`${wallet.name} icon`} 
          className="w-6 h-6 mr-3"
        />
      );
    } else {
      return (
        <div className="w-6 h-6 mr-3 rounded-full bg-teal-500 flex items-center justify-center text-xs text-black font-bold">
          {wallet.name.charAt(0)}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black flex items-center justify-center p-6 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 rounded-full blur-3xl animate-blob"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(56,189,248,0.8) 0%, rgba(20,184,166,0.5) 100%)`,
              transformOrigin: 'center',
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Glass panel container */}
      <div className={`w-full max-w-md relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ${
        animateIntro ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        {/* Top highlight bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400"></div>
        
        {!activeConnector ? (
          <div className="p-0">
            {!isWalletSelectionOpen ? (
              <div className="flex flex-col">
                {/* Header with logo */}
                <div className="pt-8 px-8 pb-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 mb-4">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">JoeLynn Finance</h1>
                  <p className="text-slate-400 text-sm">Discover the universe of decentralized finance</p>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                  <button 
                    onClick={() => setActivePage("intro")}
                    className={`flex-1 text-sm font-medium py-3 ${activePage === "intro" ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => setActivePage("features")}
                    className={`flex-1 text-sm font-medium py-3 ${activePage === "features" ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'}`}
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => setActivePage("about")}
                    className={`flex-1 text-sm font-medium py-3 ${activePage === "about" ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'}`}
                  >
                    About
                  </button>
                </div>
                
                {/* Dynamic content based on active page */}
                <div className="p-8">
                  {activePage === "intro" && (
                    <div className="space-y-8">
                      <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h2 className="text-lg font-semibold text-white mb-2">Your Digital Asset Portal</h2>
                        <p className="text-sm text-slate-300 mb-4">Connect your wallet to access your personalized dashboard.</p>
                        <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
                          <div>
                            <span className="block text-sky-400 text-lg font-bold">100+</span>
                            Assets
                          </div>
                          <div>
                            <span className="block text-sky-400 text-lg font-bold">24/7</span>
                            Access
                          </div>
                          <div>
                            <span className="block text-sky-400 text-lg font-bold">12+</span>
                            Networks
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleConnectWallet}
                        className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-medium py-3.5 px-6 rounded-xl relative overflow-hidden group"
                      >
                        <span className="absolute top-0 right-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                        <span className="relative flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Connect Wallet
                        </span>
                      </button>
                    </div>
                  )}
                  
                  {activePage === "features" && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-white mb-4">Platform Features</h2>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">Advanced Analytics</h3>
                            <p className="text-xs text-slate-400">Real-time insights into your portfolio performance</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                          <div className="p-2 rounded-lg bg-teal-500/20 text-teal-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">Multi-Chain Support</h3>
                            <p className="text-xs text-slate-400">Seamlessly switch between different blockchains</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">Enhanced Security</h3>
                            <p className="text-xs text-slate-400">Industry-leading security protocols to protect your assets</p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleConnectWallet}
                        className="w-full mt-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-medium py-3.5 px-6 rounded-xl relative overflow-hidden group"
                      >
                        <span className="absolute top-0 right-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                        <span className="relative flex items-center justify-center gap-2">
                          Connect Wallet
                        </span>
                      </button>
                    </div>
                  )}
                  
                  {activePage === "about" && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-white mb-4">About JoeLynn Finance</h2>
                      <p className="text-sm text-slate-300 mb-4">
                        JoeLynn Finance was created to bring institutional-grade blockchain tools to everyone. Our platform simplifies complex Web3 interactions while providing powerful insights into your digital assets.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                          <span className="text-sky-400 text-xl font-bold">2022</span>
                          <span className="text-xs text-slate-400">Founded</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                          <span className="text-sky-400 text-xl font-bold">25+</span>
                          <span className="text-xs text-slate-400">Team Members</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleConnectWallet}
                        className="w-full mt-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-medium py-3.5 px-6 rounded-xl relative overflow-hidden group"
                      >
                        <span className="absolute top-0 right-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                        <span className="relative flex items-center justify-center gap-2">
                          Connect Wallet
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
                  <button 
                    onClick={() => setWalletSelectionOpen(false)}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-teal-500 rounded-xl blur opacity-20"></div>
                  <div className="relative rounded-xl overflow-hidden">
                    {connectors.map((wallet, index) => {
                      const isConnecting = connectStatus[wallet.id] === "connecting" || 
                                          (isPending && wallet.id === "walletConnect");
                      
                      return (
                        <button
                          key={wallet.id}
                          onClick={() => handleSelectConnector(wallet)}
                          disabled={isConnecting}
                          className={`flex items-center w-full p-4 bg-slate-800 hover:bg-slate-700 transition-colors duration-200 ${
                            index !== connectors.length - 1 ? 'border-b border-slate-700' : ''
                          }`}
                        >
                          {/* Wallet logo */}
                          {renderWalletIcon(wallet)}
                          
                          {/* Wallet name */}
                          <span className="font-medium text-white flex-grow text-left">{wallet.name}</span>
                          
                          {/* Status indicator */}
                          {isConnecting ? (
                            <svg className="animate-spin h-5 w-5 text-teal-400" viewBox="0 0 24 24">
                              <circle 
                                className="opacity-25" 
                                cx="12" cy="12" r="10" 
                                stroke="currentColor" 
                                strokeWidth="4" 
                                fill="none" 
                              />
                              <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                              <svg className="w-3 h-3 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="pt-4 text-center">
                  <p className="text-xs text-slate-400 mb-4">
                    By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-0">
            {/* Connected header */}
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeConnector && walletIcons[activeConnector.id] ? (
                  <img 
                    src={walletIcons[activeConnector.id]} 
                    alt={`${activeConnector.name} icon`} 
                    className="w-8 h-8 rounded-full border border-slate-600 p-1"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
                    {activeConnector?.name?.charAt(0) || 'W'}
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-medium text-white">{activeConnector?.name || "Wallet"}</h2>
                  <span className="text-xs text-teal-400">{isConnected ? "Connected" : "Connecting..."}</span>
                </div>
              </div>
              <button 
                onClick={handleDisconnectWallet}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
            
            {/* Connected body */}
            <div className="p-6 space-y-6">
              {/* Address card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Wallet Address</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {chain?.name || "Unknown Network"}
                  </span>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="font-mono text-sm text-slate-300 truncate">
                    {address}
                  </div>
                </div>
              </div>
              
              {/* Network selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Network</label>
                <div className="relative">
                  <select
                    value={chain?.id}
                    onChange={(e) => handleSwitchNetwork(e.target.value)}
                    className="w-full py-3 px-4 pr-8 appearance-none bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {supportedChains.map((network) => (
                      <option key={network.id} value={network.id}>
                        {network.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Dashboard overview - WITH DYNAMIC BALANCE */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white">Dashboard Overview</h3>
                  <span className="text-xs text-teal-400">View All</span>
                </div>
                
                <div className="space-y-3">
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-slate-700 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-400">Current Balance</span>
                        {isBalanceLoading ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-teal-400" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="text-sm text-slate-300">Loading...</span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-lg font-semibold text-white">${formattedBalance.usdValue}</span>
                            <div className="text-xs text-teal-400 mt-1">
                              {formattedBalance.value} {formattedBalance.symbol}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mb-1">
                      <div className="bg-gradient-to-r from-sky-500 to-teal-500 h-1.5 rounded-full" style={{ width: `${Math.min(parseFloat(formattedBalance.usdValue) / 100, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Monthly Goal</span>
                      <span className="text-teal-400">{Math.min(Math.round(parseFloat(formattedBalance.usdValue) / 100 * 100), 100)}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400">Chain ID</span>
                        <span className="text-lg font-semibold text-white">{chainId || "—"}</span><span className="text-lg font-semibold text-white">{chainId || "—"}</span>
                        <span className="text-xs text-teal-400 mt-1">{chain?.name || "Unknown Network"}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400">Network Status</span>
                        <span className="text-lg font-semibold text-white">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          Active
                        </span>
                        <span className="text-xs text-teal-400 mt-1">Low gas fees</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent activity - simplified */}
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-400">Recent Activity</span>
                    </div>
                    <div className="text-xs text-center text-slate-400 py-2">
                      {isBalanceLoading ? 
                        "Loading recent activity..." : 
                        `Balance updated for ${chain?.name || "current network"}`
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Disconnect button */}
              <button
                onClick={handleDisconnectWallet}
                className="w-full bg-slate-800 border border-slate-700 hover:border-red-500/30 text-white hover:text-red-400 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wagmi;