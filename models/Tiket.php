<?php
//Nama : Subagas Herlambang
//NPM : 247006111100
class Tiket {
    private $conn;
    private $table_name = "tiket";

    public $id;
    public $kode_tiket;
    public $nama_penumpang;
    public $rute;
    public $tanggal_berangkat;
    public $kursi;
    public $harga;
    public $status; 

    public function __construct($db) {
        $this->conn = $db;
    }

    // READ semua tiket
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ tiket berdasarkan ID
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$this->id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->kode_tiket       = $row['kode_tiket'];
            $this->nama_penumpang   = $row['nama_penumpang'];
            $this->rute             = $row['rute'];
            $this->tanggal_berangkat = $row['tanggal_berangkat'];
            $this->kursi            = $row['kursi'];
            $this->harga            = $row['harga'];
            $this->status           = $row['status'];
            return true;
        }
        return false;
    }

    // CREATE tiket baru
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  (kode_tiket, nama_penumpang, rute,
                  tanggal_berangkat, kursi, harga, status)
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        if ($stmt->execute([
            $this->kode_tiket,
            $this->nama_penumpang,
            $this->rute,
            $this->tanggal_berangkat,
            $this->kursi,
            $this->harga,
            $this->status ?? 'tersedia'
        ])) {
            return true;
        }
        return false;
    }

    // UPDATE tiket
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET kode_tiket = ?, nama_penumpang = ?, rute = ?,
                      tanggal_berangkat = ?, kursi = ?, harga = ?, status = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        if ($stmt->execute([
            $this->kode_tiket,
            $this->nama_penumpang,
            $this->rute,
            $this->tanggal_berangkat,
            $this->kursi,
            $this->harga,
            $this->status,
            $this->id
        ])) {
            return true;
        }
        return false;
    }

    // DELETE tiket
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        if ($stmt->execute([$this->id])) {
            return true;
        }
        return false;
    }
}
?>
