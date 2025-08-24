import React, { useState, useEffect } from 'react';
import { fetchSettings } from '../services/api';
import { ethers } from 'ethers';
import '../styles/style.css';
import loadingIcon from '../images/loading-icon.png';

import dolsLogo from '../images/dols-logo-200h.png';
import bnbLogo from '../images/bnb-logo-200h.png';
import zetexLogo from '../images/zetexsmall-500h.png';
import mmLogo from '../images/mm-logo.svg';
import wcLogo from '../images/wc-logo.svg';
import infoIcon from '../images/info.png';

export default function Exchange() {
    const [settings, setSettings] = useState({});
    const [buyAmount, setBuyAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const [myAddress, setMyAddress] = useState('-');
    const [myBnbBalance, setMyBnbBalance] = useState('-');
    const [myRemaining, setMyRemaining] = useState('-');
    const [myUnclaimed, setMyUnclaimed] = useState('-');
    const [showWalletPopup, setShowWalletPopup] = useState(false);
    const [loadingWallet, setLoadingWallet] = useState(false);
    const [remainingTime, setRemainingTime] = useState('Calculating...');

    const [walletConnectProvider, setWalletConnectProvider] = useState(null);

    const contractAddress = "0x31046069a7CC1070B51B83a45E51671190ae4d46";
    const contractABI = [
        {
            "inputs": [
                { "internalType": "address", "name": "tokenAddress", "type": "address" },
                { "internalType": "uint256", "name": "initialRate", "type": "uint256" },
                { "internalType": "address", "name": "initialOwner", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "buyTokens",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "OwnableUnauthorizedAccount",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "ethAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokenAmount",
                    "type": "uint256"
                }
            ],
            "name": "TokensPurchased",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "rate",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "token",
            "outputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdrawUnsoldTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ];

    useEffect(() => {
        loadSettings();
        initializeWalletConnect();
    }, []);

    const loadSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('http://localhost:5000/api/settings', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load settings');
            }

            const data = await response.json();
            const activeIco = Array.isArray(data) ? data[0] : data;
            setSettings(activeIco || {});
        } catch (err) {
            setError(err.message);
            console.error('Error loading settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExchange = async () => {
        if (!walletConnected || !myAddress || !buyAmount || buyAmount <= 0) {
            alert('Connect wallet and enter a valid amount');
            return;
        }
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.buyTokens({
                value: ethers.utils.parseEther(buyAmount.toString()),
            });
            await tx.wait();

            await tx.wait();
            alert('Exchange successful!');
        } catch (err) {
            console.error('Exchange failed:', err);
            alert('Exchange failed');
        }
    };

    const initializeWalletConnect = async () => {
        try {
            if (window.importEthereumProvider) {
                const provider = await window.importEthereumProvider.init({
                    projectId: settings.walletConnectProjectId,
                    chains: [parseInt(settings.walletConnectNetworkId) || 56],
                    showQrModal: true,
                    metadata: {
                        name: settings.walletConnectPromptTitle || 'Zetex ICO',
                        description: settings.walletConnectPromptDesc || 'Token Sale',
                        url: settings.walletConnectPromptUrl || window.location.origin,
                        icons: settings.walletConnectPromptIcons ? [settings.walletConnectPromptIcons] : []
                    }
                });
                setWalletConnectProvider(provider);
            }
        } catch (err) {
            console.warn('WalletConnect initialization failed:', err);
        }
    };

    const formatTime = (milliseconds) => {
        if (milliseconds <= 0) return 'Sale ended';

        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        return `${days}d ${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s left`;
    };

    useEffect(() => {
        if (!settings.contractAddressSaleEndDate) return;

        const interval = setInterval(() => {
            const endDate = new Date(settings.contractAddressSaleEndDate).getTime();
            const now = Date.now();
            const distance = endDate - now;

            setRemainingTime(formatTime(distance));

            if (distance <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [settings.contractAddressSaleEndDate]);

    const connectMetaMask = async () => {
        setLoadingWallet(true);
        try {
            if (!window.ethereum) {
                alert('MetaMask is not installed. Please install MetaMask and try again.');
                return;
            }

            console.log('Connecting to MetaMask...');

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log("MetaMask connected chain:", parseInt(chainId, 16));

            window.ethereum.on('chainChanged', (chainId) => {
                console.log("Network changed:", parseInt(chainId, 16));
                fetchWalletData(myAddress);
            });

            console.log('Connected accounts:', accounts);

            if (accounts && accounts.length > 0) {
                const address = accounts[0];
                setMyAddress(address);
                setWalletConnected(true);
                setShowWalletPopup(false);

                setTimeout(() => {
                    fetchWalletData(address);
                }, 100);
            }
        } catch (err) {
            console.error('MetaMask connection failed:', err);
            setError('Failed to connect MetaMask');
        } finally {
            setLoadingWallet(false);
        }
    };

    const connectWalletConnect = async () => {
        if (!walletConnectProvider) {
            alert('WalletConnect not initialized');
            return;
        }

        setLoadingWallet(true);
        try {
            await walletConnectProvider.enable();

            const provider = new ethers.providers.Web3Provider(walletConnectProvider);
            const accounts = await provider.listAccounts();
            const network = await provider.getNetwork();

            console.log("WalletConnect connected:", accounts[0], "on chain", network.chainId);

            if (accounts && accounts.length > 0) {
                setMyAddress(accounts[0]);
                setWalletConnected(true);
                setShowWalletPopup(false);

                await fetchWalletData(accounts[0], provider);
            }
        } catch (err) {
            console.error('WalletConnect connection failed:', err);
            setError('Failed to connect WalletConnect');
        } finally {
            setLoadingWallet(false);
        }
    };


    const fetchWalletData = async (address, customProvider = null) => {
        try {
            if (!address || address === '-') return;

            let provider;

            if (customProvider) {
                provider = customProvider;
            } else if (window.ethereum) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
            } else if (walletConnectProvider) {
                provider = new ethers.providers.Web3Provider(walletConnectProvider);
            } else {
                const fallbackChainId = parseInt(settings.walletConnectNetworkId || "56");
                const rpcUrl = fallbackChainId === 97
                    ? "https://data-seed-prebsc-1-s1.binance.org:8545/"
                    : "https://bsc-dataseed1.binance.org";
                provider = new ethers.providers.JsonRpcProvider(rpcUrl);
            }

            const network = await provider.getNetwork();
            console.log("Fetching data from chain:", network.chainId);

            const balance = await provider.getBalance(address);
            setMyBnbBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(6));

            setMyRemaining('1.0');
            setMyUnclaimed('0');
        } catch (err) {
            console.error('Failed to fetch wallet data:', err);
            setMyBnbBalance('-');
            setMyRemaining('-');
        }
    };

    const handleBuy = async () => {
        if (!walletConnected || !buyAmount || buyAmount <= 0) {
            alert('Please connect wallet and enter a valid amount');
            return;
        }

        try {
            alert('Buy functionality to be implemented with smart contract integration');
        } catch (err) {
            console.error('Buy transaction failed:', err);
            setError('Transaction failed');
        }
    };

    const handleClaim = async () => {
        if (!walletConnected) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            alert('Claim functionality to be implemented with smart contract integration');
        } catch (err) {
            console.error('Claim transaction failed:', err);
            setError('Claim failed');
        }
    };

    const handleHowToBuy = () => {
        if (settings.walletConnectHowToBuyUrl) {
            window.open(settings.walletConnectHowToBuyUrl, '_blank');
        } else {
            alert('How to buy guide not configured');
        }
    };

    const copyReferralLink = () => {
        if (!walletConnected || myAddress === '-') {
            alert('Please connect your wallet first');
            return;
        }

        const referralLink = `${window.location.origin}${window.location.pathname}?ref=${myAddress}`;
        navigator.clipboard.writeText(referralLink).then(() => {
            const snackbar = document.getElementById('snackbar');
            snackbar.textContent = 'Referral link copied to clipboard!';
            snackbar.className = 'show';
            setTimeout(() => {
                snackbar.className = snackbar.className.replace('show', '');
            }, 3000);
        }).catch(() => {
            alert('Failed to copy referral link');
        });
    };

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setMyAddress(accounts[0]);
                setWalletConnected(true);
                fetchWalletData(accounts[0]);
            } else {
                setMyAddress('-');
                setWalletConnected(false);
                setMyBnbBalance('-');
                setMyRemaining('-');
                setMyUnclaimed('-');
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);

            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        handleAccountsChanged(accounts);
                    }
                });
        }

        return () => {
            if (window.ethereum && window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    const calculateTokenAmount = () => {
        if (!buyAmount || !settings.contractAddressSaleRate) return '0';
        return (parseFloat(buyAmount) * parseFloat(settings.contractAddressSaleRate)).toFixed(2);
    };

    if (loading) {
        return (
            <div className="exchange-container">
                <div className="home-zetex-wp-connect-loading">
                    <img src={loadingIcon} alt="Loading" className="home-zetex-wp-connect-loading-icon" />
                </div>
            </div>
        );
    }

    return (
        <div className="exchange-container">
            <div id="snackbar"></div>

            <div className="home-container">
                <div className="home-zetex-wp">
                    <img
                        alt="Token Icon"
                        src={dolsLogo}
                        className="home-top-tkn-icon"
                    />
                    <span className="home-buy-text">
                        <span>Buy {settings.contractAddressTokenSymbol || 'TOKEN'}</span>
                    </span>
                    <span className="home-timer-text">
                        <span>{remainingTime}</span>
                        <br />
                    </span>

                    <div className="home-container-value">
                        <span className="home-tnk2-bnb">
                            <span>1 BNB = {settings.contractAddressSaleRate || '0'} {settings.contractAddressTokenSymbol || 'TOKEN'}</span>
                        </span>
                    </div>

                    <div className="home-container-pay">
                        <span className="home-you-pay-title">Amount you pay</span>
                        <div className="home-amount">
                            <input
                                type="number"
                                placeholder="0"
                                value={buyAmount}
                                onChange={(e) => setBuyAmount(e.target.value)}
                                min="0"
                                style={{
                                    cursor: 'auto',
                                    borderColor: 'var(--dl-color-gray-black)',
                                    borderWidth: '0px',
                                    borderRadius: '0px',
                                    paddingLeft: 'var(--dl-space-space-unit)',
                                    backgroundColor: 'transparent',
                                    flex: '0.5',
                                    color: '#c0c0c5',
                                    fontSize: '1.25rem',
                                    fontStyle: 'normal',
                                    fontFamily: 'Konnect Medium',
                                    fontWeight: '700',
                                    lineHeight: '1.15',
                                    width: '100%'
                                }}
                                id="zexetBuyAmount"
                            />
                            <div className="home-bnb-info">
                                <span className="home-name">BNB</span>
                                <img
                                    alt="BNB Logo"
                                    src={bnbLogo}
                                    className="home-icon"
                                />
                            </div>
                        </div>

                        <div className="home-unclaimed">
                            <span className="home-title">
                                <span>Your BNB Balance: </span>
                                <br />
                            </span>
                            <span className="home-value">
                                <span id="zetexMyBnbBalance">{myBnbBalance}</span>
                                <br />
                            </span>
                            <span className="home-title">
                                <span> BNB</span>
                                <br />
                            </span>
                        </div>
                    </div>

                    <div className="home-container-get">
                        <span className="home-you-get-title">Amount in {settings.contractAddressTokenSymbol || 'TOKEN'} you get</span>
                        <div className="home-amount1">
                            <span id="zetexTKNValue" className="home-you-get">{calculateTokenAmount()}</span>
                            <div className="home-tkn-info">
                                <span className="home-name1">{settings.contractAddressTokenSymbol || 'TOKEN'}</span>
                                <img
                                    alt="Token Logo"
                                    src={dolsLogo}
                                    className="home-icon1"
                                />
                            </div>
                        </div>

                        <div className="home-unclaimed">
                            <span className="home-title">
                                <span>Unclaimed tokens:&nbsp;</span>
                                <br />
                            </span>
                            <span id="zetexMyUnclaimed" className="home-value">
                                <span>{myUnclaimed} {settings.contractAddressTokenSymbol || 'TOKEN'}</span>
                                <br />
                            </span>
                        </div>

                        <div className="home-unclaimed">
                            <span className="home-title">
                                <span>Address:&nbsp;</span>
                                <br />
                            </span>
                            <span className="home-value">
                                <span id="zetexMyAddress">{myAddress}</span>
                                <br />
                            </span>
                        </div>

                        <div className="home-unclaimed" id="zetexCopyRefLinkContainer">
                            <span className="home-title">
                                <a>
                                    <span
                                        id="zetexCopyRefLink"
                                        style={{ cursor: 'pointer' }}
                                        onClick={copyReferralLink}
                                    >
                                        - Copy referral link
                                    </span>
                                </a>
                                <br />
                            </span>
                        </div>
                    </div>

                    <div className="home-container-buttons">
                        {!walletConnected ? (
                            <button
                                type="button"
                                id="zetexConnect"
                                className="home-button-connect home-button-actions"
                                onClick={() => setShowWalletPopup(true)}
                            >
                                Connect Wallet
                            </button>
                        ) : (
                            <button
                                type="button"
                                id="zetexExchangeBtn"
                                className="home-button-exchange home-button-actions home-button-connect"
                                onClick={handleExchange}
                            >
                                Exchange
                            </button>
                        )}
                        <button
                            type="button"
                            id="zetexBuyBtn"
                            className="home-button-buy home-button-actions"
                            onClick={handleBuy}
                        >
                            Buy
                        </button>
                        <button
                            type="button"
                            id="zetexClaimBtn"
                            className="home-button-claim home-button-actions"
                            onClick={handleClaim}
                        >
                            Claim {settings.contractAddressTokenSymbol || 'TOKEN'}
                        </button>
                        <button
                            type="button"
                            id="zetexHowToBuy"
                            className="home-button-htb home-button-actions"
                            onClick={handleHowToBuy}
                        >
                            How to buy
                        </button>
                    </div>
                </div>

                {showWalletPopup && <div className="home-zetex-wp-connect-cover" id="home-zetex-wp-connect-cover"></div>}

                {showWalletPopup && (
                    <div className="home-zetex-wp-connect" id="home-zetex-wp-connect">
                        <img
                            alt="Token"
                            src={dolsLogo}
                            className="home-c-tkn-icon"
                        />
                        <span className="home-c-cw-title">Connect Wallet</span>
                        <span className="home-c-cw-info">
                            <span>Choose your wallet to connect</span>
                            <br />
                        </span>
                        <div className="home-c-container-buttons-connect">
                            <button
                                type="button"
                                className="home-c-button-mm home-button-actions"
                                id="home-c-button-mm"
                                onClick={connectMetaMask}
                                disabled={loadingWallet}
                            >
                                <span className="home-c-text2">MetaMask</span>
                                <img
                                    alt="MetaMask"
                                    src={mmLogo}
                                    className="home-c-icon"
                                />
                            </button>
                            <button
                                type="button"
                                className="home-c-button-wc home-button-actions"
                                id="home-c-button-wc"
                                onClick={connectWalletConnect}
                                disabled={loadingWallet}
                            >
                                <span className="home-c-text3">Wallet Connect</span>
                                <img
                                    alt="WalletConnect"
                                    src={wcLogo}
                                    className="home-c-icon1"
                                />
                            </button>
                            <button
                                type="button"
                                className="home-c-button-htc home-button-actions"
                                id="home-c-button-htc"
                                onClick={() => {
                                    window.open(settings.walletConnectNoWalletUrl || '#', '_blank');
                                    setShowWalletPopup(false);
                                }}
                            >
                                <span className="home-c-text4">I don't have a wallet</span>
                                <img
                                    alt="Info"
                                    src={infoIcon}
                                    className="home-c-icon2"
                                />
                            </button>
                        </div>
                    </div>
                )}

                {loadingWallet && (
                    <div className="home-zetex-wp-connect-loading" id="home-zetex-wp-connect-loading">
                        <img
                            alt="Loading"
                            src={loadingIcon}
                            className="home-zetex-wp-connect-loading-icon"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}