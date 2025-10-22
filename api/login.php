<?php
header("Content-Type: application/json");

// Simulamos usuarios ya registrados
$usuarios = [
    ["id" => 1, "username" => "allan", "email" => "allan@troka.com", "password" => password_hash("1234", PASSWORD_DEFAULT)]
];

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

// Buscar usuario
$usuario = null;
foreach ($usuarios as $u) {
    if ($u['email'] === $email) {
        $usuario = $u;
        break;
    }
}

if (!$usuario || !password_verify($password, $usuario['password'])) {
    echo json_encode(["error" => "Usuario o contraseña incorrectos"]);
} else {
    echo json_encode(["mensaje" => "Login exitoso", "usuario" => $usuario]);
}
