/**
 * Logika checkout WhatsApp. File ini murni: tidak menyentuh localStorage,
 * tidak membuka tab, dan tidak punya state. Semua input masuk lewat argumen,
 * sehingga buatPesanWhatsApp() mudah diuji dan dijelaskan.
 */

import { formatRupiah } from './format';
import { hitungTotal, type KeranjangItem } from './keranjang';

export type DataPemesanan = {
	nama: string;
	alamat: string;
	catatan: string;
};

/**
 * Susun pesan order dari isi keranjang + data pembeli.
 * Urutan pesan: daftar item (nama × qty = subtotal), total, lalu data pembeli.
 * Baris catatan hanya muncul kalau diisi.
 */
export function buatPesanWhatsApp(items: KeranjangItem[], data: DataPemesanan): string {
	const barisItem = items.map(
		(item) => `• ${item.name} × ${item.qty} = ${formatRupiah(item.price * item.qty)}`,
	);

	const nama = data.nama.trim();
	const alamat = data.alamat.trim();
	const catatan = data.catatan.trim();

	const bagian = [
		'Halo, saya mau pesan:',
		'',
		...barisItem,
		'',
		`Total: ${formatRupiah(hitungTotal(items))}`,
		'',
		`Nama: ${nama}`,
		`Alamat: ${alamat}`,
	];

	if (catatan) bagian.push(`Catatan: ${catatan}`);

	return bagian.join('\n');
}
