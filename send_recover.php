<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Συμπερίληψη των απαραίτητων αρχείων
require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Παραλαβή στοιχείων φόρμας
    $name = $_POST["name"] ?? '';
    $surname = $_POST["surname"] ?? '';
    $email = $_POST["email"] ?? '';
    $phone = $_POST["phone"] ?? '';
    $category = $_POST["category"] ?? '';
    $subject = $_POST["subject"] ?? '';
    $message = $_POST["message"] ?? '';

    $mail = new PHPMailer(true);

    try {
        // Ρυθμίσεις SMTP (για Gmail)
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;

        // 👉 Εδώ βάλε το δικό σου Gmail και App Password
        $mail->Username = 'buffon.feizai@gmail.com';
        $mail->Password = 'acnb swfh lesy htqt'; // App Password

        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Από και προς
        $mail->setFrom($mail->Username, 'Hermes Rollerskate Website');
        $mail->addAddress('buffon.feizai@gmail.com'); // Παραλήπτης

        // Περιεχόμενο email
        $mail->isHTML(true);
        $mail->Subject = "Νέο μήνυμα επικοινωνίας - $subject";
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mailBody = "
        <h2>Φόρμα Επικοινωνίας</h2>
        <p><strong>Όνομα:</strong> $name</p>
        <p><strong>Επώνυμο:</strong> $surname</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Τηλέφωνο:</strong> $phone</p>
        <p><strong>Κατηγορία:</strong> $category</p>
        <p><strong>Μήνυμα:</strong><br>$message</p>
        <hr>
        <p><small>Ημερομηνία: " . date("Y-m-d H:i:s") . "</small></p>";

        $mail->Body = $mailBody;

        $mail->send();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $mail->ErrorInfo]);
    }
}
?>