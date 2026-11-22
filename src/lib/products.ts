import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type Product = {
	id: number;
	slug: string;
	name: string;
	price: number;
	description: string | null;
	image_url: string | null;
};

const STORAGE_BUCKET = import.meta.env.PUBLIC_SUPABASE_STORAGE_BUCKET || 'products';

/**
 * Kolom image_url bisa berisi URL penuh, atau path objek di bucket Storage publik.
 * Kalau berupa path, URL publiknya dibuat dengan getPublicUrl (tanpa request jaringan).
 */
export function getProductImageUrl(imageUrl: string | null): string | null {
	if (!imageUrl) return null;
	if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
	return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imageUrl).data.publicUrl;
}

const COLUMNS = 'id, slug, name, price, description, image_url';

/** Dipakai di getStaticPaths: ambil semua produk saat build. Error diteruskan apa adanya. */
export async function getProducts(): Promise<{
	products: Product[];
	error: PostgrestError | null;
}> {
	const { data, error } = await supabase
		.from('products')
		.select(COLUMNS)
		.order('id', { ascending: true });

	return { products: data ?? [], error };
}
