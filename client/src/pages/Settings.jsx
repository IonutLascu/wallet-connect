import React, { useState, useEffect } from 'react';
import { fetchSettings, createSettings } from '../services/api';
import '../styles/style.css';

const FIELDS = [
    { key: 'contractAddressSale', label: 'Smart Contract Presale Address', type: 'text' },
    { key: 'contractAddressSaleEndDate', label: 'Smart Contract Presale End Date', type: 'datetime-local' },
    { key: 'contractAddressSaleRate', label: 'Smart Contract Presale BNB Rate (1 BNB = x$TKN)', type: 'text' },
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

export default function Settings() {
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/login?session=expired');
            return;
        }
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await fetchSettings();
            setValues(data || {});
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        setError(null);

        try {
            await createSettings(values);
            setMessage('ICO created successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const renderCreateForm = () => (
        <div className="create-form">
            {message && <div className="message success">{message}</div>}
            {error && <div className="message error">{error}</div>}

            <form onSubmit={handleSubmit} className="settings-form">
                {FIELDS.map(field => (
                    <div key={field.key} className="form-group">
                        <label htmlFor={field.key}>{field.label}*</label>
                        <input
                            id={field.key}
                            type={field.type}
                            value={values[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={saving}
                >
                    {saving ? 'Saving ICO...' : 'Save ICO'}
                </button>
            </form>
        </div>
    );

    if (loading) {
        return (
            <div className="settings-container">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="settings-container">
            {renderCreateForm()}
        </div>
    );
}