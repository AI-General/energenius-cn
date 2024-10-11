import { createClient } from "@supabase/supabase-js";
export const supabaseUrl: string = "https://pvyqszflhydcdxrbznlm.supabase.co";
const supabaseKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eXFzemZsaHlkY2R4cmJ6bmxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDE2Nzk0NCwiZXhwIjoyMDM5NzQzOTQ0fQ.fsJUYx11DptzqmVOxb1gu0Upia1FHn6QRRdZxwZehr4";
export const supabase = createClient(supabaseUrl, supabaseKey);
