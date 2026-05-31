// Shared CORS headers for FitGuard Edge Functions.
// In production, lock `Access-Control-Allow-Origin` down to your app's origin(s).
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
