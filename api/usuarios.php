<?php
header("Content-Type: application/json");

$usuarios = [
    ["id" => 1, "username" => "allan", "email" => "allan@troka.com"],
    ["id" => 2, "username" => "demian", "email" => "demian@troka.com"]
];

// Simular acción según parámetro
$accion = $_GET['accion'] ?? 'listar';

if ($accion === 'listar') {
    echo json_encode($usuarios);
} elseif ($accion === 'perfil') {
    $id = $_GET['id'] ?? null;
    $usuario = array_filter($usuarios, fn($u) => $u['id'] == $id);
    echo json_encode(array_values($usuario));
} else {
    echo json_encode(["error" => "Acción no válida"]);
}
