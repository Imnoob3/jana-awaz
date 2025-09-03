
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://jkhhvfcrwfwlaaarmrlb.supabase.co';
// This key is safe to use in a browser if you have enabled Row Level Security for your tables and configured policies.
// It is recommended to use an environment variable for this.
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGh2ZmNyd2Z3bGFhYXJtcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTMwMzQsImV4cCI6MjA3MjMyOTAzNH0.Dzyfk2eBTaLHqwC0IVReOImf2j8p0VuUZNIJUB8_t3w";

export const supabase = createClient(supabaseUrl, supabaseKey);
