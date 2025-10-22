<?php
header("Content-Type: application/json");

$trueques = [
    ["id" => 1, "producto_ofrecido" => "Bicicleta", "producto_solicitado" => "Laptop", "estado" => "pendiente"],
    ["id" => 2, "producto_ofrecido" => "Celular", "producto_solicitado" => "Bicicleta", "estado" => "aceptado"]
];

$accion = $_GET['accion'] ?? 'listar';

if ($accion === 'listar') {
    echo json_encode($trueques);
} else {
    echo json_encode(["error" => "Acción no válida"]);
}
