// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://roqbpicupvsrmxgdvgxu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcWJwaWN1cHZzcm14Z2R2Z3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTQ1MzAsImV4cCI6MjA2MzQ3MDUzMH0.5Odrzt_ktqZHxfHPKdZvbDC0quEuy-NMv__Oxf4RwCQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);