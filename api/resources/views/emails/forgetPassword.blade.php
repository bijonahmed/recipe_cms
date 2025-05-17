<!DOCTYPE html>
<html>
<head>
    <title>Reset Password Notification</title>
</head>
<body>
<p>Hello,</p>
    <p>You are receiving this email because we received a password reset request for your account.</p>
    <p>Click the link below to reset your password:</p>
    <p>
       <a href="{{ $baseUrl }}/{{ $token }}">Reset Password</a>
    </p>
    <p>If you did not request a password reset, no further action is required.</p>
    <p>Regards,<br>OCN</p>
</body>
</html>
