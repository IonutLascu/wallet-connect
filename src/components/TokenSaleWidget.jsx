import React, { useEffect, useState } from 'react';
import { fetchSettings } from '../services/api';

const TokenSaleWidget = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      const cfg = await fetchSettings();
      setSettings(cfg);

      // Inject globals for tokensale.ui.js
      window.contractAddressSale = cfg.contractAddressSale;
      window.contractAddressSaleRate = cfg.contractAddressSaleRate;
      window.contractAddressToken = cfg.contractAddressToken;
      window.contractAddressTokenSymbol = cfg.contractAddressTokenSymbol;

      window.walletConnectProjectId = cfg.walletConnectProjectId;
      window.walletConnectNetworkId = cfg.walletConnectNetworkId;
      window.walletConnectPromptTitle = cfg.walletConnectPromptTitle;
      window.walletConnectPromptDesc = cfg.walletConnectPromptDesc;
      window.walletConnectPromptUrl = cfg.walletConnectPromptUrl;
      window.walletConnectPromptIcons = cfg.walletConnectPromptIcons;
      window.walletConnectHowToBuyUrl = cfg.walletConnectHowToBuyUrl;
      window.walletConnectNoWalletUrl = cfg.walletConnectNoWalletUrl;

      // Call init logic if it exists
      if (typeof init === 'function') init();
    };

    loadSettings();
  }, []);

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div id="app">
      {/* The token sale interface goes here */}
    </div>
  );
};

export default TokenSaleWidget;