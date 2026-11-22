/** Format angka sebagai Rupiah Indonesia tanpa desimal. Dipakai server dan browser. */
export function formatRupiah(nilai: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(nilai);
}
