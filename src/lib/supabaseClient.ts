import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fvqkzljhlrxgaudnhukb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cWt6bGpobHJ4Z2F1ZG5odWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDEwODUsImV4cCI6MjA2NDk3NzA4NX0.ZcRFk_TYnCVlWenLFd40dez1KWxiPEsRNPV2v4-0ZVQ';

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.log('**********************************************************************************************************************************************************************')
  console.error('ERROR: Supabase URL is not configured. Please replace "YOUR_SUPABASE_URL" in `src/lib/supabaseClient.ts` with your actual Supabase project URL.');
  console.log('**********************************************************************************************************************************************************************')
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('**********************************************************************************************************************************************************************')
  console.error('ERROR: Supabase anon key is not configured. Please replace "YOUR_SUPABASE_ANON_KEY" in `src/lib/supabaseClient.ts` with your actual Supabase anon key.');
  console.log('**********************************************************************************************************************************************************************')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
