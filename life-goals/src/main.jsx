import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { decryptToken } from './utils/crypto'
console.log('UAT DEPLOYMENT DATE: 11th Feb 2026 , 16:48');

// ── Decrypt gamification token, store payload in sessionStorage & clean URL ──
(() => {
    const params = new URLSearchParams(window.location.search);

    // Store basic query params as fallback (userId, gameId, etc.)
    const basicKeys = ['userId', 'gameId', 'empName', 'empMobile', 'location', 'zone'];
    let hasParams = false;
    basicKeys.forEach(key => {
        const val = params.get(key);
        if (val) {
            sessionStorage.setItem(`gamification_${key}`, val);
            hasParams = true;
        }
    });

    // Decrypt the AES token and store the full payload
    const token = params.get('token');
    if (token) {
        hasParams = true;
        // Store the raw token for potential re-use
        sessionStorage.setItem('gamification_rawToken', token);

        const payload = decryptToken(token);
        if (payload) {
            console.log('[main] Token decrypted successfully:', payload);
            // Store each field from the decrypted payload
            const fieldMap = {
                game_id: 'game_id',
                emp_id: 'emp_id',
                emp_name: 'emp_name',
                emp_mobile: 'emp_mobile',
                location: 'location',
                zone: 'zone',
            };
            Object.entries(fieldMap).forEach(([payloadKey, storageKey]) => {
                if (payload[payloadKey] != null) {
                    sessionStorage.setItem(`gamification_${storageKey}`, String(payload[payloadKey]));
                }
            });

            // Set referral flag — 'N' on first visit, preserve if already 'Y' from a shared link
            const existingReferral = payload.referral;
            sessionStorage.setItem('gamification_referral', existingReferral || 'N');
        } else {
            console.error('[main] Failed to decrypt gamification token');
        }
    }

    // Clean the URL to remove query params
    if (hasParams) {
        window.history.replaceState({}, '', window.location.pathname);
    }
})();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
