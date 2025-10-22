<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $contrasena = password_hash(trim($_POST['contrasena']), PASSWORD_DEFAULT);

    // Verificar si el correo ya existe
    $consulta = $conexion->prepare("SELECT id FROM usuarios WHERE email=?");
    if(!$consulta){
        echo "error_preparar_consulta: ".$conexion->error;
        exit;
    }
    $consulta->bind_param("s", $email);
    $consulta->execute();
    $consulta->store_result();

    if($consulta->num_rows > 0){
        echo "correo_existente";
    } else {
        $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)");
        if(!$stmt){
            echo "error_preparar_insert: ".$conexion->error;
            exit;
        }
        $stmt->bind_param("sss", $nombre, $email, $contrasena);
        if(!$stmt->execute()){
            echo "error_ejecutar_insert: ".$stmt->error;
            exit;
        }
        echo "registro_exitoso";
    }
} else {
    echo "metodo_no_permitido";
}
?>
