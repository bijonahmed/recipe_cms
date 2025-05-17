<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Verification</title>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-5">



        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="request-to-game-tab" data-bs-toggle="tab"
                    data-bs-target="#request-to-game" type="button" role="tab" aria-controls="request-to-game"
                    aria-selected="true">Request to Game</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="verify-user-tab" data-bs-toggle="tab" data-bs-target="#verify-user"
                    type="button" role="tab" aria-controls="verify-user" aria-selected="false">Verify
                    Session</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="get-balance-tab" data-bs-toggle="tab" data-bs-target="#get-balance"
                    type="button" role="tab" aria-controls="get-balance" aria-selected="false">Get Balance</button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="request-to-game" role="tabpanel"
                aria-labelledby="request-to-game-tab">
                <div class="p-3">
                    <h4>Request to Game</h4>
                    <form id="gameForm" action="{{ url('requesttoGame') }}" method="POST">
                        @csrf
                        <div class="mb-3">
                            <label for="app_id" class="form-label">App ID:</label>
                            <input type="text" id="app_id" name="app_id" class="form-control" value="771">
                        </div>
                        <div class="mb-3">
                            <label for="gameId" class="form-label">Game ID</label>
                            <input type="text" class="form-control" id="gameId" name="gameId" required value="39">
                        </div>
                        <div class="mb-3">
                            <label for="token" class="form-label">Token</label>
                            <input type="text" class="form-control" id="token" name="token" value="50f15a92-ee8d-11ee-9a61-00ff3fae08f7" required>
                        </div>
                        
                      
                        
                        
                        <div class="mb-3">
                            <label for="lang" class="form-label">Language</label>
                            <input type="text" class="form-control" id="lang" name="lang" value="en">
                        </div>
                        <div class="mb-3">
                            <label for="nick" class="form-label">Nickname</label>
                            <input type="text" class="form-control" id="nick" name="nick">
                        </div>
                        <div class="mb-3">
                            <label for="cid" class="form-label">CID</label>
                            <input type="text" class="form-control" id="cid" name="cid" value="0">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
            <div class="tab-pane fade" id="verify-user" role="tabpanel" aria-labelledby="verify-user-tab">
                <div class="p-3">
                    <div class="card p-4 shadow">
                        <h3 class="text-center mb-4">Verify Session</h3>
                        <form id="verifySessionForm">
                           
                            <div class="mb-3">
                                <label for="operator_player_session" class="form-label">Operator Player
                                    Session:</label>
                                <input type="text" id="operator_player_session" name="operator_player_session" value="50f15a92-ee8d-11ee-9a61-00ff3fae08f7"
                                    class="form-control" required>
                            </div>
                            <!--<div class="mb-3">-->
                            <!--    <label for="ip" class="form-label">IP Address:</label>-->
                            <!--    <input type="text" id="ip" name="ip" class="form-control"-->
                            <!--        placeholder="Optional">-->
                            <!--</div>-->
                            <div class="mb-3">
                                <label for="game_id" class="form-label">Game ID:</label>
                                <input type="number" id="game_id" name="game_id" class="form-control game_id"
                                    placeholder="Optional" value="39">
                            </div>
                        <!--      <div class="mb-3">-->
                        <!--    <label for="token" class="form-label">TraceId</label>-->
                        <!--    <input type="text" class="form-control show_traceId" id="traceId" name="traceId" required>-->
                        <!--</div>-->
                            <!--<div class="mb-3">-->
                            <!--    <label for="game_id" class="form-label">Sign:</label>-->
                            <!--    <input type="text" id="sign" name="sign" class="form-control"-->
                            <!--        placeholder="sign">-->
                            <!--</div>-->
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Verify Session</button>
                            </div>
                            <div id="responseMessage"></div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="get-balance" role="tabpanel" aria-labelledby="get-balance-tab">
                <div class="p-3">
                    <h4>Get Balance</h4>
                   
                </div>
            </div>
        </div>


    </div>


   
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" crossorigin="anonymous"></script>
    <script>
        $(document).ready(function() {
            $('#gameForm').on('submit', function(e) {
                e.preventDefault(); // Prevent default form submission
                var formData = $(this).serialize(); // Serialize form data

                $.ajax({
                    url: $(this).attr('action'), // Get the action URL of the form
                    type: 'POST',
                    data: formData,
                    success: function(response) {
                           console.log("Response:" + response.traceId); // Log the server's response
                        $(".show_traceId").val(response.traceId);
                      
                         window.open(response.url,'_blank');
                       
                    },
                    error: function(xhr, status, error) {
                        alert('An error occurred while submitting the form.');
                        console.error(xhr.responseText);
                    }
                });
            });
        });
    </script>
    <script>
        document.getElementById('verifySessionForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = {
                app_id: document.getElementById('app_id').value,
                timestamp: Math.floor(Date.now() / 1000), // current timestamp in seconds
                operator_player_session: document.getElementById('operator_player_session').value,
               // ip: document.getElementById('ip').value,
                game_id: document.getElementById('game_id').value || null
            };
            const headers = {
                'sign': $("#sign").val(),
            }
            const traceId =  $("#traceId").val();
             
            axios.post('/api/luck/user/verify_session?trace_id='+ traceId, formData,{
                headers: headers
            })
                .then(response => {
                    document.getElementById('responseMessage').textContent = response.data.msg;
                    if (response.data.status === 'success') {
                        console.log('Session Data:', response.data.data);
                    }
                })
                .catch(error => {
                    document.getElementById('responseMessage').textContent = 'Error: ' + error.response.data
                        .msg;
                    console.error('Verification Error:', error);
                });
        });
    </script>
</body>

</html>
