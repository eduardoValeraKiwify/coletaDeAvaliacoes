const supabaseUrl = "https://cvdxbfeevcdepcybfitm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZHhiZmVldmNkZXBjeWJmaXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNDExNDYsImV4cCI6MjA3MjYxNzE0Nn0.ZbZY__2D8LAeZYPf9YsoTjXGd28p1ev-WDkmuTpNLzQ";
export const supabaseInit = supabase.createClient(supabaseUrl, supabaseKey);
