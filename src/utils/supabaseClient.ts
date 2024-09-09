import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUniquePolicyAreas() {
  const { data, error } = await supabase
    .from('Bill')
    .select('policyArea')
    .not('policyArea', 'is', null)
    .order('policyArea');

  
  if (error) {
    console.error('Error fetching policy areas:', error);
    return [];
  }

  const uniquePolicyAreas = Array.from(new Set(data.map(item => item.policyArea)));
  return uniquePolicyAreas;
}