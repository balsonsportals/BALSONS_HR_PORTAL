/**
 * BALSONS HR & PAYROLL MANAGER
 * API Client — CORS-Safe Transport Bridge
 * Transport: POST with text/plain (avoids CORS preflight failures across origins)
 */

const BalsonsHrApi = {
  call: async function(action, payload = {}) {
    const session = BalsonsHrAuth.getSession();
    const token = session ? session.token : null;

    const requestBody = {
      action: action,
      authToken: token,
      payload: payload,
      clientTimestamp: new Date().toISOString(),
      requestId: 'REQ-HR-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    };

    try {
      const response = await fetch(BALSONS_HR_CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(requestBody),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const resJson = await response.json();
      return resJson;
    } catch (err) {
      console.warn(`[BalsonsHrApi] Transport Notice (${action}):`, err.message);
      // Fallback response structure
      return {
        success: false,
        error: { code: 'NETWORK_OR_OFFLINE', message: err.message },
        data: null
      };
    }
  }
};
