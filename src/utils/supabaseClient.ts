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

export async function getResearchProject(projectId: number) {
  const { data, error } = await supabase
    .from('ResearchProject')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching research project:', error);
    return null;
  }

  return data;
}

export async function getBill(billId: number) {
  const { data, error } = await supabase
    .from('Bill')
    .select('*')
    .eq('id', billId)
    .single();

  if (error) {
    console.error('Error fetching bill:', error);
    return null;
  }

  return data;
}

export async function updateResearchProject(projectId: number, updates: {
  title?: string;
  description?: string;
  visibility?: string;
  intent?: string;
}) {
  const { data, error } = await supabase
    .from('ResearchProject')
    .update(updates)
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error updating research project:', error);
    throw error;
  }

  return data;
}