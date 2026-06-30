/* ==========================================
   SUPABASE
========================================== */

const SUPABASE_URL =
    'https://ewiejygqzrgrwhkielln.supabase.co';

const SUPABASE_KEY =
    'sb_publishable_yAeRrVsq2u0c3Sqv2-vg9g_669u8lLw';

const client =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );