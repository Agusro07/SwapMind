<?php
header("Content-Type: application/json");

$productos = [
    ["id" => 1, "nombre" => "Bicicleta", "descripcion" => "Bici de montaña", "usuario_id" => 1],
    ["id" => 2, "nombre" => "Laptop", "descripcion" => "Core i5, 8GB RAM", "usuario_id" => 2]
];

$accion = $_GET['accion'] ?? 'listar';

if ($accion === 'listar') {
    echo json_encode($productos);
} elseif ($accion === 'detalle') {
    $id = $_GET['id'] ?? null;
    $producto = array_filter($productos, fn($p) => $p['id'] == $id);
    echo json_encode(array_values($producto));
} else {
    echo json_encode(["error" => "Acción no válida"]);
}
