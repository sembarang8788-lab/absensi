import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://dehfvekozfklnmdsqryg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaGZ2ZWtvemZrbG5tZHNxcnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDM5OTgsImV4cCI6MjA4MjU3OTk5OH0.xc4exUhXcw31gOeVaTYJ9UTYPP92N3oVub-8ZyGGgjU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

