<?php
header("Content-Type: application/json");

// Simulamos una "base de datos" temporal
$usuarios = [
    ["id" => 1, "username" => "allan", "email" => "allan@troka.com", "password" => password_hash("1234", PASSWORD_DEFAULT)]
];

// Recibimos datos por POST
$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$username || !$email || !$password) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

// Simulamos guardar usuario
$nuevoUsuario = [
    "id" => count($usuarios) + 1,
    "username" => $username,
    "email" => $email,
    "password" => password_hash($password, PASSWORD_DEFAULT)
];

$usuarios[] = $nuevoUsuario;

echo json_encode(["mensaje" => "Usuario registrado con éxito", "usuario" => $nuevoUsuario]);
