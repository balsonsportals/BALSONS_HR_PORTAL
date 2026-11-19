/**
 * BALSONS HR & PAYROLL MANAGER
 * Google Apps Script Master API Controller
 * Architecture: BALSONS-SAM-2026 (Locked Baseline)
 */

const HR_CONFIG = {
  PROJECT_ID: 'PRJ-BALSONS-HR-2026',
  PORTAL_NAME: 'BALSONS HR & Payroll Manager',
  VERSION: '1.0.0-foundation',
  ENV: 'staging',
  
  getSpreadsheetId: function() {
    return PropertiesService.getScriptProperties().getProperty('HR_SPREADSHEET_ID');
  }
};

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'health';
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    status: 200,
    system: HR_CONFIG.PORTAL_NAME,
    version: HR_CONFIG.VERSION,
    action: action,
    serverTimestamp: new Date().toISOString(),
    statusMessage: 'BALSONS HR & Payroll Master Gateway Operational'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var startTime = new Date().getTime();
  var request = {};

  try {
    if (e && e.postData && e.postData.contents) {
      request = JSON.parse(e.postData.contents);
    }
  } catch (parseErr) {
    return createJsonResponse({
      success: false,
      status: 400,
      error: { code: 'INVALID_JSON_BODY', message: parseErr.message }
    });
  }

  var action = request.action || 'system.ping';
  var payload = request.payload || {};
  var authToken = request.authToken || null;
  var requestId = request.requestId || ('REQ-' + new Date().getTime());

  var responseData = {};

  try {
    switch (action) {
      case 'system.ping':
        responseData = {
          message: 'HR & Payroll Backend Active',
          version: HR_CONFIG.VERSION,
          environment: HR_CONFIG.ENV
        };
        break;

      case 'auth.login':
        // Test role mapping
        responseData = {
          token: 'HR-TOKEN-' + new Date().getTime(),
          username: payload.username,
          role: payload.role || 'HR Head',
          fullName: 'Priyanka Senapati'
        };
        break;

      default:
        responseData = {
          actionExecuted: action,
          status: 'PROCESSED_SUCCESS'
        };
        break;
    }

    return createJsonResponse({
      success: true,
      status: 200,
      requestId: requestId,
      action: action,
      serverTimestamp: new Date().toISOString(),
      durationMs: (new Date().getTime() - startTime),
      data: responseData
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      status: 500,
      requestId: requestId,
      action: action,
      error: { code: 'SERVER_EXCEPTION', message: err.message }
    });
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
