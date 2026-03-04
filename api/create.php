<?php
//Nama : Subagas Herlambang
//NPM : 247006111100
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method tidak diizinkan."]);
    exit;
}

include_once '../config/Database.php';
include_once '../models/Tiket.php';

$database = new Database();
$db = $database->getConnection();

$tiket = new Tiket($db);
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->kode_tiket) &&
    !empty($data->nama_penumpang) &&
    !empty($data->rute) &&
    !empty($data->tanggal_berangkat) &&
    !empty($data->kursi) &&
    !empty($data->harga)
) {
    $tiket->kode_tiket        = $data->kode_tiket;
    $tiket->nama_penumpang    = $data->nama_penumpang;
    $tiket->rute              = $data->rute;
    $tiket->tanggal_berangkat = $data->tanggal_berangkat;
    $tiket->kursi             = $data->kursi;
    $tiket->harga             = $data->harga;
    $tiket->status            = isset($data->status) ? $data->status : 'tersedia';

    if ($tiket->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Tiket berhasil ditambahkan."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Gagal menambahkan tiket."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Data tidak lengkap. Pastikan semua field terisi."));
}
?>
