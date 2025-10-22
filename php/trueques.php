<?php
header('Content-Type: application/json');
$host = "localhost";
$user = "root";       // Cambia por tu usuario MySQL
$pass = "";    // Cambia por tu contraseña MySQL
$db   = "swapmind"; // Cambia por tu base de datos

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error DB: '.$conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM truques ORDER BY id DESC");
    $truques = [];
    while ($row = $result->fetch_assoc()) {
        $truques[] = $row;
    }
    echo json_encode($truques);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    file_put_contents('debug.txt', print_r($_POST, true)); // Guarda lo que llega en POST

    $nombre = $_POST['nombrePersona'] ?? '';
    $tiene  = $_POST['objetoTiene'] ?? '';
    $quiere = $_POST['objetoQuiere'] ?? '';

    if ($nombre && $tiene && $quiere) {
        $stmt = $conn->prepare("INSERT INTO truques (nombre_persona, objeto_tiene, objeto_quiere) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $tiene, $quiere);
        echo json_encode($stmt->execute() ? ['success'=>true] : ['success'=>false, 'message'=>$stmt->error]);
    } else {
        echo json_encode(['success'=>false, 'message'=>'Faltan datos']);
    }
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombrePersona'] ?? '';
    $tiene  = $_POST['objetoTiene'] ?? '';
    $quiere = $_POST['objetoQuiere'] ?? '';

    if ($nombre && $tiene && $quiere) {
        $stmt = $conn->prepare("INSERT INTO truques (nombre_persona, objeto_tiene, objeto_quiere) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $tiene, $quiere);
        echo json_encode($stmt->execute() ? ['success'=>true] : ['success'=>false, 'message'=>$stmt->error]);
    } else {
        echo json_encode(['success'=>false, 'message'=>'Faltan datos']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $deleteVars);
    $id = intval($deleteVars['id'] ?? $_GET['id'] ?? 0);
    if ($id) {
        $stmt = $conn->prepare("DELETE FROM truques WHERE id=?");
        $stmt->bind_param("i", $id);
        echo json_encode($stmt->execute() ? ['success'=>true] : ['success'=>false, 'message'=>$stmt->error]);
    } else {
        echo json_encode(['success'=>false, 'message'=>'ID no válido']);
    }
    exit;
}

$conn->close();
