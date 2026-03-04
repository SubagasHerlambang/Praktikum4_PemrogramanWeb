<?php
//Nama : Subagas Herlambang
//NPM : 247006111100
class Database {
    private $host = "localhost";
    private $db_name = "pemesanan_tiket";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Koneksi Gagal: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
