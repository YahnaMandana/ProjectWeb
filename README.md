# 🌭 KUSTINI STORE — Website Toko Makanan

Website penjualan makanan (sosis, nugget, bakso, frozen food & snack) untuk **KUSTINI STORE**.

## 📁 Struktur File

```
ProjectWeb/
├── index.html        ← Halaman Beranda
├── produk.html       ← Katalog Produk
├── tentang.html      ← Tentang Kami
├── kontak.html       ← Kontak & Form Pesan
├── css/
│   └── style.css     ← Semua styling website
├── js/
│   └── main.js       ← Interaktivitas (menu, keranjang, form)
└── images/           ← Letakkan logo & foto produk di sini
```

## 🚀 Cara Menggunakan

1. **Buka file** `index.html` di browser untuk melihat website.
2. Tidak perlu server khusus — cukup buka file langsung.

## ✏️ Hal yang Perlu Anda Isi / Ganti

Cari teks berikut di semua halaman HTML dan ganti dengan data Anda:

| Teks Placeholder | Ganti Dengan |
|---|---|
| `+62 [Nomor Telepon Anda]` | Nomor HP / WhatsApp toko |
| `[Email Anda]` | Alamat email toko |
| `[Alamat Toko]` / `[Alamat Lengkap...]` | Alamat fisik toko |
| `Rp [Harga]` | Harga setiap produk |
| `https://wa.me/628XXXXXXXXXX` | Link WhatsApp Anda |

## 🖼️ Menambahkan Logo & Foto

### Logo
1. Simpan file logo Anda sebagai `images/logo.png`
2. Di setiap halaman HTML, cari kode blok logo (`<div>` dengan huruf "K") dan ganti dengan:
   ```html
   <img src="images/logo.png" alt="KUSTINI STORE" class="logo-img" />
   ```

### Foto Produk
Untuk setiap produk, cari blok placeholder:
```html
<div class="img-placeholder">
  <div class="ph-icon">🌭</div>
  <div class="ph-text">Foto Produk</div>
</div>
```
Ganti dengan:
```html
<img src="images/nama-foto.jpg" alt="Nama Produk" />
```

## 🎨 Warna & Tampilan

Warna utama dapat diubah di `css/style.css` bagian `:root`:
```css
:root {
  --primary:    #e8451e;   /* Oranye-merah */
  --accent:     #f9a825;   /* Kuning emas  */
}
```

## 📄 Halaman yang Tersedia

| Halaman | File | Keterangan |
|---|---|---|
| Beranda | `index.html` | Hero, kategori, produk unggulan, testimoni |
| Produk | `produk.html` | Katalog lengkap dengan filter kategori |
| Tentang | `tentang.html` | Visi misi, keunggulan, profil toko |
| Kontak | `kontak.html` | Info kontak, form pesan, link WhatsApp |

## 📞 Fitur Website

- ✅ Responsive (mobile & desktop)
- ✅ Menu hamburger untuk mobile
- ✅ Keranjang belanja (tampilan)
- ✅ Filter produk per kategori
- ✅ Form kontak
- ✅ Tombol WhatsApp langsung
- ✅ Notifikasi toast saat tambah produk
