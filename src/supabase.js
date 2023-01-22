import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tmcmqcqoodrktdrcjvad.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtY21xY3Fvb2Rya3RkcmNqdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQwODIyNjYsImV4cCI6MTk4OTY1ODI2Nn0.11XEU8ak1hdCH4PmEV6hj-evA63vafJWghTWkm3b7lI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
