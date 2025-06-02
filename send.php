<?php
header("Content-Type: application/json");

// --- 1. Σύνδεση με βάση ---
$host = "localhost";
$user = "root";        // default για XAMPP
$password = "";        // default για XAMPP
$database = "hermes_rollers_skate_db";

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

// --- 2. Λήψη δεδομένων από τη φόρμα ---
$name = $_POST["name"] ?? "";
$surname = $_POST["surname"] ?? "";
$email = $_POST["email"] ?? "";
$phone = $_POST["phone"] ?? "";
$category = $_POST["category"] ?? "";
$subject = $_POST["subject"] ?? "";
$message = $_POST["message"] ?? "";

// --- 3. Προετοιμασία και εκτέλεση του INSERT ---
$stmt = $conn->prepare("INSERT INTO contact_messages (name, surname, email, phone, category, subject, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $name, $surname, $email, $phone, $category, $subject, $message);

$success = $stmt->execute();
$stmt->close();
$conn->close();

// --- 4. Αν θες, στέλνουμε και email (προαιρετικό) ---
if ($success) {
    // require 'phpmailer/PHPMailer.php';
    // require 'phpmailer/SMTP.php';
    // require 'phpmailer/Exception.php';

    // use PHPMailer\PHPMailer\PHPMailer;
    // use PHPMailer\PHPMailer\Exception;

    // $mail = new PHPMailer(true);
    // try {
    //     $mail->isSMTP();
    //     $mail->Host = 'smtp.gmail.com';
    //     $mail->SMTPAuth = true;
    //     $mail->Username = 'your_email@gmail.com'; // ΤΟ EMAIL ΣΟΥ
    //     $mail->Password = 'your_app_password';   // ΤΟ APP PASSWORD
    //     $mail->SMTPSecure = 'tls';
    //     $mail->Port = 587;

    //     $mail->setFrom($email, $name . ' ' . $surname);
    //     $mail->addAddress('your_email@gmail.com'); // Ο παραλήπτης

    //     $mail->isHTML(true);
    //     $mail->Subject = $subject;
    //     $mail->Body    = "<strong>Κατηγορία:</strong> $category<br><strong>Μήνυμα:</strong><br>$message<br><br><strong>Email αποστολέα:</strong> $email<br><strong>Τηλέφωνο:</strong> $phone";
    //     $mail->send();
    // } catch (Exception $e) {
    //     echo json_encode(["success" => false, "error" => "Mailer Error"]);
    //     exit;
    // }
}

// --- 5. Απάντηση στο JavaScript ---
echo json_encode(["success" => $success]);
