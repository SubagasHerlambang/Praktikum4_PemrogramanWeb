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
$tiket->id = isset($_GET['id']) ? $_GET['id'] : null;

if (empty($tiket->id)) {
    http_response_code(400);
    echo json_encode(array("message" => "Parameter id diperlukan."));
    exit;
}

if ($tiket->readOne()) {
    $tiket_arr = array(
        "id"                => $tiket->id,
        "kode_tiket"        => $tiket->kode_tiket,
        "nama_penumpang"    => $tiket->nama_penumpang,
        "rute"              => $tiket->rute,
        "tanggal_berangkat" => $tiket->tanggal_berangkat,
        "kursi"             => $tiket->kursi,
        "harga"             => $tiket->harga,
        "status"            => $tiket->status
    );
    http_response_code(200);
    echo json_encode($tiket_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Tiket tidak ditemukan."));
}
?>
