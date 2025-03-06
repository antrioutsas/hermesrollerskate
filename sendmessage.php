<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize input data
    $first_name = htmlspecialchars($_POST["first_name"]);
    $last_name = htmlspecialchars($_POST["last_name"]);
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $category = htmlspecialchars($_POST["category"]);
    $title = htmlspecialchars($_POST["title"]);
    $message = htmlspecialchars($_POST["message"]);

    // Your email address (Replace with your actual email)
    $to = "hermesrollerskate@hotmail.com";
    $subject = "New Contact Form Submission: $title";

    // Email Headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Email Content
    $email_body = "You have received a new message from your contact form:\n\n";
    $email_body .= "Name: $first_name $last_name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Category: $category\n";
    $email_body .= "Title: $title\n\n";
    $email_body .= "Message:\n$message\n";

    // Send the email
    if (mail($to, $subject, $email_body, $headers)) {
        echo "Message sent successfully!";
    } else {
        echo "Failed to send message. Please try again later.";
    }
} else {
    echo "Invalid request!";
}
?>
