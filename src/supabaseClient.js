import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fakhxzycjmlokihzsply.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2h4enljam1sb2tpaHpzcGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc0NDYsImV4cCI6MjA3MTI4MzQ0Nn0.c2DE8LgYEqAKH5QN3PlbYdwYg0QQEgk7yeXql6e56z4';
export const supabase = createClient(supabaseUrl, supabaseKey);