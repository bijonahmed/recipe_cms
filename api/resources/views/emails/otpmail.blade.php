<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Ocean Trade AI! Verify Your Email with OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            max-width: 600px;
            margin: 40px auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            font-size: 24px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background-color: #f4f4f4;
            color: #777;
            font-size: 14px;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Ocean Trade AI!</h1>
        </div>
        <div class="content">
            <p>Dear User</p>
            <p>Welcome to Ocean Trade AI!</p>
            <p>To complete your registration, please verify your email address using the One-Time Password (OTP) provided below:</p>
            <p class="otp">Your OTP is: {{ $details['otp'] }}</p>
            <p>This OTP is valid for the next 10 minutes. Please enter it in the registration form to confirm your email address.</p>
            <p>If you did not initiate this request, please ignore this email.</p>
            <p>If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:support@oceantradeai.com">support@oceantradeai.com</a>.</p>
            <p>Thank you for joining Ocean Trade AI!</p>
            <p>Best regards,</p>
            <p>John Doe<br>
            Customer Success Manager<br>
            Ocean Trade AI</p>
            <p><a href="https://www.oceantradeai.com">www.oceantradeai.com</a></p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Ocean Trade AI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
