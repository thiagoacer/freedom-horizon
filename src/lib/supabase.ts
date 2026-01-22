import { createClient } from '@supabase/supabase-js';

// Fallback keys for immediate "Zero Config" usage
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gcomdzrwelxdzurofbvy.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdjb21kenJ3ZWx4ZHp1cm9mYnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDA5NDgsImV4cCI6MjA4NDY3Njk0OH0.pwJ__hlpyPASZ0j7QTJA8MyneKvezDB05NHdshL-OwY";

if (!supabaseUrl || !supabaseKey) {
    console.error("ERRO CRÍTICO: Variáveis do Supabase não encontradas e fallback falhou.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
