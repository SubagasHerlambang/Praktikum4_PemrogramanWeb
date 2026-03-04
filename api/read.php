<?php
//Nama : Subagas Herlambang
//NPM : 247006111100
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method tidak diizinkan."]);
    exit;
}

include_once '../config/Database.php';
include_once '../models/Tiket.php';

$database = new Database();
$db = $database->getConnection();

$tiket = new Tiket($db);
$stmt = $tiket->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $tiket_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $tiket_item = array(
            "id"                => $id,
            "kode_tiket"        => $kode_tiket,
            "nama_penumpang"    => $nama_penumpang,
            "rute"              => $rute,
            "tanggal_berangkat" => $tanggal_berangkat,
            "kursi"             => $kursi,
            "harga"             => $harga,
            "status"            => $status
        );
        array_push($tiket_arr, $tiket_item);
    }
    http_response_code(200);
    echo json_encode($tiket_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Data tiket tidak ditemukan."));
}
?>
