<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Moon Nest Account</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 40px auto;
            padding: 30px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        h2 {
            color: #2c3e50;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
        }

        ul {
            list-style-type: none;
            padding: 0;
        }

        ul li {
            font-size: 16px;
            margin-bottom: 10px;
            background-color: #f9f9f9;
            padding: 10px 15px;
            border-radius: 6px;
        }

        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }

        .btn:hover {
            background-color: #43a047;
        }

        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Welcome to Moon Nest!</h2>

        <p>Dear user,</p>

        <p>Thank you for registering. Below are your login credentials:</p>

        <ul>
            <li><strong>Username:</strong> {{ $acdata['username'] ?? 'Not Provided' }}</li>
            <li><strong>Password:</strong> {{ $acdata['password'] ?? 'Not Provided' }}</li>
        </ul>

        <p>Please keep this information safe and do not share it with anyone.</p>
        
        <p>
            <a href="{{ $acdata['login_url'] }}" class="btn">Login to Moon Nest</a>
        </p>

        <div class="footer">
            <p>Best regards,<br><strong>Moon Nest Team</strong></p>
        </div>
    </div>
</body>
</html>
