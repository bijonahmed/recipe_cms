<!-- resources/views/enter-game.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enter Game</title>
</head>
<body>

    <h1>Enter the Game</h1>

    <!-- Display success or error messages -->
    @if (session('success'))
        <div style="color: green;">
            {{ session('success') }}
            <br>
            <a href="{{ session('gameurl') }}" target="_blank">Go to Game</a>
        </div>
    @elseif (session('error'))
        <div style="color: red;">
            {{ session('error') }}
        </div>
    @endif

    <!-- Form for Enter Game -->
    <form action="{{ route('enterGame.submit') }}" method="POST">
        @csrf
        <div>
            <label for="gameid">Game ID:</label>
            <input type="text" name="gameid" id="gameid" required>
        </div>

        <div>
            <label for="token">Token:</label>
            <input type="text" name="token" id="token" required>
        </div>

        <div>
            <label for="lang">Language (Optional):</label>
            <input type="text" name="lang" id="lang" value="en">
        </div>

        <div>
            <label for="nick">Nickname:</label>
            <input type="text" name="nick" id="nick" maxlength="40" required>
        </div>

        <div>
            <label for="app_id">App ID:</label>
            <input type="text" name="app_id" id="app_id" required>
        </div>

        <div>
            <label for="cid">Currency ID:</label>
            <input type="number" name="cid" id="cid" value="1" required>
        </div>

        <button type="submit">Enter Game</button>
    </form>

</body>
</html>
