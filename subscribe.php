<?php
// subscribe.php

// 1) Check if we have a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2) Retrieve the email input (assume 'email' is the name in <input>)
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

    // 3) Basic email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Not a valid email
        // You can show an error message or redirect
        echo "Invalid email address!";
        exit;
    }

    // 4) Store or send the email:
    // Option A) Save to a text file
    // Option B) Insert into a database
    // Option C) Send to a mailing list service (Mailchimp, etc.)

    // Option A: Save to a simple text file (data/newsletter.txt)
    // Make sure the 'data' folder is writable (chmod, permissions)
    $file = __DIR__ . '/data/newsletter.txt';
    file_put_contents($file, $email . PHP_EOL, FILE_APPEND | LOCK_EX);

    // 5) Output or redirect to a "Thank You" page
    echo "Thank you for subscribing!";
} else {
    // Not a POST request
    echo "Method not allowed.";
}
