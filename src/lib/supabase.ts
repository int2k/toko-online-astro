import { createClient } from '@supabase/supabase-js';

// Variabel PUBLIC_* tersedia saat build (statik) dan juga di browser.
const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_KEY;

if (!url || !key) {
	throw new Error(
		'PUBLIC_SUPABASE_URL dan PUBLIC_SUPABASE_KEY harus diisi di file .env',
	);
}

export const supabase = createClient(url, key, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});
