# 🎫 REST API - Pemesanan Tiket Online
### Praktikum 4 - Application Programming Interface (API)
**Dosen:** Ir. Alam Rahmatulloh, S.T., M.T., MCE., IPM.

---

## 📁 Struktur Folder Project

```
pemesanan_tiket/
├── config/
│   └── Database.php          ← Koneksi database (OOP)
├── models/
│   └── Tiket.php             ← Class Model (CRUD logic)
├── api/
│   ├── read.php              ← GET semua tiket
│   ├── read_one.php          ← GET tiket by ID
│   ├── create.php            ← POST tiket baru
│   ├── update.php            ← PUT update tiket
│   └── delete.php            ← DELETE hapus tiket
├── database.sql              ← Script setup database
└── README.md
```

---

## ⚙️ Langkah-Langkah Pengerjaan

### Langkah 1: Setup Database
1. Buka **phpMyAdmin** di browser: `http://localhost/phpmyadmin`
2. Klik tab **SQL**
3. Copy-paste seluruh isi file `database.sql` dan klik **Go**
4. Database `pemesanan_tiket` dan tabel `tiket` akan terbuat otomatis beserta 5 data contoh.

---

### Langkah 2: Setup Project di Laragon
1. Buka folder Laragon → `laragon/www/`
2. Buat folder baru bernama **`pemesanan_tiket`**
3. Salin semua file project ke dalam folder tersebut:
   ```
   laragon/www/pemesanan_tiket/
   ├── config/Database.php
   ├── models/Tiket.php
   ├── api/read.php
   ├── api/read_one.php
   ├── api/create.php
   ├── api/update.php
   └── api/delete.php
   ```

---

### Langkah 3: Pengujian API dengan Postman

#### 🔵 READ - Ambil Semua Tiket
| Field  | Value |
|--------|-------|
| Method | `GET` |
| URL    | `http://localhost/pemesanan_tiket/api/read.php` |

**Contoh Response (200 OK):**
```json
[
  {
    "id": "1",
    "kode_tiket": "TKT-001",
    "nama_penumpang": "Budi Santoso",
    "rute": "Jakarta - Bandung",
    "tanggal_berangkat": "2025-08-01",
    "kursi": "A1",
    "harga": "150000.00",
    "status": "tersedia"
  }
]
```

---

#### 🔵 READ ONE - Ambil Tiket Berdasarkan ID
| Field  | Value |
|--------|-------|
| Method | `GET` |
| URL    | `http://localhost/pemesanan_tiket/api/read_one.php?id=1` |

**Contoh Response (200 OK):**
```json
{
  "id": "1",
  "kode_tiket": "TKT-001",
  "nama_penumpang": "Budi Santoso",
  "rute": "Jakarta - Bandung",
  "tanggal_berangkat": "2025-08-01",
  "kursi": "A1",
  "harga": "150000.00",
  "status": "tersedia"
}
```

---

#### 🟢 CREATE - Tambah Tiket Baru
| Field        | Value |
|--------------|-------|
| Method       | `POST` |
| URL          | `http://localhost/pemesanan_tiket/api/create.php` |
| Body (raw)   | JSON |
| Content-Type | `application/json` |

**Body JSON:**
```json
{
  "kode_tiket": "TKT-006",
  "nama_penumpang": "Ahmad Fauzi",
  "rute": "Jakarta - Lombok",
  "tanggal_berangkat": "2025-08-15",
  "kursi": "F6",
  "harga": 650000,
  "status": "tersedia"
}
```

**Contoh Response (201 Created):**
```json
{
  "message": "Tiket berhasil ditambahkan."
}
```

---

#### 🟡 UPDATE - Perbarui Data Tiket
| Field        | Value |
|--------------|-------|
| Method       | `PUT` |
| URL          | `http://localhost/pemesanan_tiket/api/update.php` |
| Body (raw)   | JSON |
| Content-Type | `application/json` |

**Body JSON:**
```json
{
  "id": 1,
  "kode_tiket": "TKT-001",
  "nama_penumpang": "Budi Santoso",
  "rute": "Jakarta - Bandung",
  "tanggal_berangkat": "2025-08-01",
  "kursi": "A1",
  "harga": 175000,
  "status": "dipesan"
}
```

**Contoh Response (200 OK):**
```json
{
  "message": "Data tiket berhasil diperbarui."
}
```

---

#### 🔴 DELETE - Hapus Tiket
| Field        | Value |
|--------------|-------|
| Method       | `DELETE` |
| URL          | `http://localhost/pemesanan_tiket/api/delete.php` |
| Body (raw)   | JSON |
| Content-Type | `application/json` |

**Body JSON:**
```json
{
  "id": 1
}
```

**Contoh Response (200 OK):**
```json
{
  "message": "Tiket berhasil dihapus."
}
```

---

### Langkah 4: Upload ke GitHub
```bash
# Inisialisasi git di folder project
git init
git add .
git commit -m "Praktikum 4 - REST API Pemesanan Tiket Online"

# Hubungkan ke repository GitHub yang sudah dibuat
git remote add origin https://github.com/USERNAME/pemesanan-tiket.git
git branch -M main
git push -u origin main
```

---

### Langkah 5: Deploy ke Server

#### Setup Database di Server
```bash
mysql -u root
```
```sql
CREATE DATABASE pemesanan_tiket;
CREATE USER 'user_tiket'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON pemesanan_tiket.* TO 'user_tiket'@'localhost';
FLUSH PRIVILEGES;
```
Lalu jalankan isi `database.sql` di server.

#### Clone dari GitHub
```bash
cd /var/www/
mkdir praktikum && cd praktikum
git clone https://github.com/USERNAME/pemesanan-tiket.git .
```

#### Update Kredensial Database
```bash
nano config/Database.php
# Ganti: username, password sesuai user yang dibuat di server
```

#### Konfigurasi Apache
```bash
cd /etc/apache2/sites-available
cp 000-default.conf praktikum.conf
nano praktikum.conf
# Ubah DocumentRoot menjadi /var/www/praktikum

a2dissite 000-default.conf
a2ensite praktikum.conf
systemctl reload apache2
```

---

## 📋 Ringkasan Endpoint API

| Method | Endpoint           | Fungsi                    |
|--------|--------------------|---------------------------|
| GET    | /api/read.php      | Ambil semua data tiket    |
| GET    | /api/read_one.php?id={id} | Ambil tiket by ID  |
| POST   | /api/create.php    | Tambah tiket baru         |
| PUT    | /api/update.php    | Update data tiket         |
| DELETE | /api/delete.php    | Hapus tiket               |

---

## 📊 Struktur Tabel `tiket`

| Kolom             | Tipe                                        | Keterangan              |
|-------------------|---------------------------------------------|-------------------------|
| id                | INT AUTO_INCREMENT PRIMARY KEY              | ID unik tiket           |
| kode_tiket        | VARCHAR(20) UNIQUE NOT NULL                 | Kode unik tiket         |
| nama_penumpang    | VARCHAR(100) NOT NULL                       | Nama penumpang          |
| rute              | VARCHAR(100) NOT NULL                       | Rute perjalanan         |
| tanggal_berangkat | DATE NOT NULL                               | Tanggal keberangkatan   |
| kursi             | VARCHAR(10) NOT NULL                        | Nomor kursi             |
| harga             | DECIMAL(10,2) NOT NULL                      | Harga tiket             |
| status            | ENUM('tersedia','dipesan','dibatalkan')      | Status tiket            |
| created_at        | TIMESTAMP DEFAULT CURRENT_TIMESTAMP         | Waktu dibuat            |
