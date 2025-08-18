import React, { useEffect, useState } from 'react';

const FIELDS = [
  { key: 'contractAddressSale', label: 'Smart Contract Presale Address', type: 'text' },
  { key: 'contractAddressSaleEndDate', label: 'Smart Contract Presale End Date', type: 'datetime-local' },
  { key: 'contractAddressSaleRate', label: 'Smart Contract Presale BNB Rate (1 BNB = x TKN)', type: 'text' },
  { key: 'contractAddressToken', label: 'Smart Contract Token Address', type: 'text' },
  { key: 'contractAddressTokenSymbol', label: 'Smart Contract Token Symbol', type: 'text' },
  { key: 'walletConnectProjectId', label: 'Wallet Connect Project Id', type: 'text' },
  { key: 'walletConnectNetworkId', label: 'Wallet Connect Network Id', type: 'text' },
  { key: 'walletConnectPromptTitle', label: 'Wallet Connect Prompt Title', type: 'text' },
  { key: 'walletConnectPromptDesc', label: 'Wallet Connect Prompt Description', type: 'text' },
  { key: 'walletConnectPromptUrl', label: 'Wallet Connect Prompt Url', type: 'text' },
  { key: 'walletConnectPromptIcons', label: 'Wallet Connect Prompt Icons', type: 'text' },
  { key: 'walletConnectHowToBuyUrl', label: 'Wallet Connect How To Buy Url', type: 'text' },
  { key: 'walletConnectNoWalletUrl', label: 'Wallet Connect Don\'t have a wallet Url', type: 'text' }
];

export default function AdminSettings() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/settings');
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setValues({
          contractAddressSale: data.contractAddressSale || '',
          contractAddressSaleEndDate: data.contractAddressSaleEndDate || '',
          contractAddressSaleRate: data.contractAddressSaleRate || '',
          contractAddressToken: data.contractAddressToken || '',
          contractAddressTokenSymbol: data.contractAddressTokenSymbol || '',
          walletConnectProjectId: data.walletConnectProjectId || '',
          walletConnectNetworkId: data.walletConnectNetworkId || '',
          walletConnectPromptTitle: data.walletConnectPromptTitle || '',
          walletConnectPromptDesc: data.walletConnectPromptDesc || '',
          walletConnectPromptUrl: data.walletConnectPromptUrl || '',
          walletConnectPromptIcons: data.walletConnectPromptIcons || '',
          walletConnectHowToBuyUrl: data.walletConnectHowToBuyUrl || '',
          walletConnectNoWalletUrl: data.walletConnectNoWalletUrl || ''
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(k, v) {
    setValues(prev => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setError(null);
    try {
      const res = await fetch('/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg('Settings saved.');
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading admin settings...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error.message}</div>;

  return (
    <div className="admin-wrap" style={{ maxWidth: 900, margin: '24px auto', padding: 16 }}>
      <h1>Zetex ICO — Admin Settings</h1>
      <p>Here you can set all the options for ICO</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        {FIELDS.map(f => (
          <label key={f.key} style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600 }}>{f.label}</span>
            <input
              type={f.type}
              value={values[f.key] || ''}
              onChange={ev => handleChange(f.key, ev.target.value)}
              style={{ padding: '8px', fontSize: 14 }}
            />
          </label>
        ))}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="submit" disabled={saving} style={{ padding: '8px 16px' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          {msg && <span style={{ color: 'green' }}>{msg}</span>}
          {error && <span style={{ color: 'red' }}>{error.message}</span>}
        </div>
      </form>
    </div>
  );
}