/**
 * Seluruh logika keranjang ada di sini. File ini murni browser-side:
 * dipakai dari <script> di halaman Astro, bukan di frontmatter, supaya
 * halaman tetap statis dan tidak perlu adapter SSR.
 */

export const KERANJANG_KEY = 'keranjang';

const EVENT_KERANJANG = 'keranjang:change';

export type KeranjangItem = {
	slug: string;
	name: string;
	price: number;
	image: string;
	qty: number;
};

type ItemBaru = Omit<KeranjangItem, 'qty'>;

/** Validasi data hasil baca localStorage (bisa rusak atau dari versi lama). */
function bersihkanItem(nilai: unknown): KeranjangItem | null {
	if (!nilai || typeof nilai !== 'object') return null;
	const item = nilai as Record<string, unknown>;

	if (typeof item.slug !== 'string' || !item.slug) return null;
	if (typeof item.name !== 'string' || !item.name) return null;

	const price = Number(item.price);
	const qty = Number(item.qty);
	if (!Number.isFinite(price) || price < 0) return null;
	if (!Number.isFinite(qty) || qty < 1) return null;

	return {
		slug: item.slug,
		name: item.name,
		price,
		image: typeof item.image === 'string' ? item.image : '',
		qty: Math.floor(qty),
	};
}

/** Baca keranjang dari localStorage. Selalu mengembalikan array yang aman dipakai. */
export function bacaKeranjang(): KeranjangItem[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const mentah = localStorage.getItem(KERANJANG_KEY);
		if (!mentah) return [];
		const hasil: unknown = JSON.parse(mentah);
		if (!Array.isArray(hasil)) return [];
		return hasil
			.map(bersihkanItem)
			.filter((item): item is KeranjangItem => item !== null);
	} catch {
		return [];
	}
}

/** Simpan ke localStorage, lalu beri tahu semua pemanggang di halaman yang sama. */
function simpan(items: KeranjangItem[]): KeranjangItem[] {
	try {
		localStorage.setItem(KERANJANG_KEY, JSON.stringify(items));
	} catch {
		// Penyimpanan bisa penuh atau diblokir; UI tetap diperbarui di halaman ini.
	}
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent<KeranjangItem[]>(EVENT_KERANJANG, { detail: items }));
	}
	return items;
}

/** Tambah produk. Kalau slug sudah ada, qty-nya dinaikkan. */
export function tambahItem(item: ItemBaru): KeranjangItem[] {
	const items = bacaKeranjang();
	const indeks = items.findIndex((yangAda) => yangAda.slug === item.slug);

	if (indeks === -1) {
		items.push({ ...item, qty: 1 });
	} else {
		const yangAda = items[indeks];
		items[indeks] = { ...yangAda, qty: yangAda.qty + 1 };
	}

	return simpan(items);
}

/** Ubah qty. Bila hasilnya < 1, produk dihapus dari keranjang. */
export function ubahQty(slug: string, delta: number): KeranjangItem[] {
	const items = bacaKeranjang();
	const indeks = items.findIndex((item) => item.slug === slug);
	if (indeks === -1) return items;

	const qtyBaru = items[indeks].qty + delta;
	if (qtyBaru < 1) {
		items.splice(indeks, 1);
	} else {
		items[indeks] = { ...items[indeks], qty: qtyBaru };
	}

	return simpan(items);
}

/** Hapus satu produk berdasarkan slug. */
export function hapusItem(slug: string): KeranjangItem[] {
	return simpan(bacaKeranjang().filter((item) => item.slug !== slug));
}

/** Jumlah total item (akumulasi qty) — dipakai badge di header. */
export function hitungJumlahItem(items: KeranjangItem[]): number {
	return items.reduce((total, item) => total + item.qty, 0);
}

/** Total harga seluruh keranjang. */
export function hitungTotal(items: KeranjangItem[]): number {
	return items.reduce((total, item) => total + item.price * item.qty, 0);
}

/**
 * Dengarkan perubahan keranjang: baik dari script lain di halaman yang sama
 * maupun dari tab lain (event `storage`). Dipakai header dan halaman /keranjang.
 */
export function onKeranjangBerubah(callback: (items: KeranjangItem[]) => void): void {
	window.addEventListener(EVENT_KERANJANG, (event) => {
		callback((event as CustomEvent<KeranjangItem[]>).detail);
	});
	window.addEventListener('storage', (event) => {
		if (event.key === KERANJANG_KEY || event.key === null) callback(bacaKeranjang());
	});
}

/** Pasang pembaruan badge keranjang di header (dipanggil dari script header). */
export function initBadgeKeranjang(): void {
	const perbarui = (items: KeranjangItem[]) => {
		const jumlah = hitungJumlahItem(items);
		const label = `Keranjang, ${jumlah} item`;
		document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
			el.textContent = String(jumlah);
		});
		document.querySelectorAll<HTMLElement>('[data-cart-sr]').forEach((el) => {
			el.textContent = label;
		});
	};

	perbarui(bacaKeranjang());
	onKeranjangBerubah(perbarui);
}
