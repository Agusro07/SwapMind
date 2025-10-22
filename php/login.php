<?php
session_start();
require 'conexion.php';

$email = $_POST['email'];
$contrasena = $_POST['contrasena'];

// Buscar usuario
$stmt = $conexion->prepare("SELECT id, nombre, contrasena FROM usuarios WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $nombre, $hash);

// Verificar credenciales
if ($stmt->num_rows > 0) {
    $stmt->fetch();
    if (password_verify($contrasena, $hash)) {
        $_SESSION['usuario'] = $nombre;
        echo "login_exitoso";
    } else {
        echo "contrasena_incorrecta";
    }
} else {
    echo "usuario_no_encontrado";
}
?>
