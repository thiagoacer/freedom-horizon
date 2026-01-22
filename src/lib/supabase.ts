import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback Keys (Public/Anon) - Guarantees app works even if .env fails to load
const FALLBACK_URL = "https://gcomdzrwelxdzurofbvy.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdjb21kenJ3ZWx4ZHp1cm9mYnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDA5NDgsImV4cCI6MjA4NDY3Njk0OH0.pwJ__hlpyPASZ0j7QTJA8MyneKvezDB05NHdshL-OwY";

// Security Check in Console
if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ AVISO: Variáveis de ambiente Supabase ausentes. Usando chaves de fallback públicas para evitar crash.");
}

// A SOLUÇÃO BLINDADA:
// Usa chaves reais como fallback para garantir que o lead seja salvo.
export const supabase = createClient(
    supabaseUrl || FALLBACK_URL,
    supabaseKey || FALLBACK_KEY
);
