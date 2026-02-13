/**
 * PLM/ION API Configuration - TEST ENVIRONMENT
 * OAuth2.0 credentials for Infor CloudSuite TEST Environment
 * This version always uses TEST credentials
 */

// Test environment credentials (ALWAYS USED IN THIS REPO)
const TEST_CONFIG = {
  tenantId: 'ATJZAMEWEF5P4SNV_TST',
  clientName: 'BackendServisi',
  clientId: 'ATJZAMEWEF5P4SNV_TST~vlWkwz2P74KAmRFfihVsdK5yjnHvnfPUrcOt4nl6gkI',
  clientSecret: 'HU1TUcBOX1rkp-uuYKUQ3simFEYzPKNM-XIyf4ewIxe-TYUZOK7RAlXUPd_FwSZMAslt8I9RZmv23xItVKY8EQ',
  serviceAccountAccessKey: 'ATJZAMEWEF5P4SNV_TST#5d3TLFCMqK_CR9wmWsLbIn1UnLv2d8S0ohtIX4TZ4PUBXyvtx-RjHjscLzfB9NBAGZfdWMgzFt3DCpWoJMOHEg',
  serviceAccountSecretKey: 'g0oBJ4ubPxJwgJZjAxAfguExlH3V5-cFF0zove_9Fb_7h4C67eXko45T9Ltjw-DYzfYUbU_iQbCZuTW6wYeX5Q'
};

// Always use TEST config in this repository
const envConfig = TEST_CONFIG;

// Build final config
const PLM_CONFIG = {
  // Tenant Information
  tenantId: envConfig.tenantId,
  clientName: envConfig.clientName,
  
  // OAuth2.0 Credentials
  clientId: envConfig.clientId,
  clientSecret: envConfig.clientSecret,
  
  // Service Account Keys
  serviceAccountAccessKey: envConfig.serviceAccountAccessKey,
  serviceAccountSecretKey: envConfig.serviceAccountSecretKey,
  
  // URLs
  ionApiUrl: 'https://mingle-ionapi.eu1.inforcloudsuite.com',
  providerUrl: `https://mingle-sso.eu1.inforcloudsuite.com:443/${envConfig.tenantId}/as/`,
  
  // OAuth2.0 Endpoints
  endpoints: {
    authorization: 'authorization.oauth2',
    token: 'token.oauth2',
    revoke: 'revoke_token.oauth2'
  }
};

// Log current environment
console.log(`🔧 PLM Config loaded for: TEST (${PLM_CONFIG.tenantId})`);

module.exports = PLM_CONFIG;
