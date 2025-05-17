<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Welcome Page</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Custom Styles for Full-Screen Sections */
        .full-screen {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <!-- Full-Screen Header Section -->
    <header class="bg-primary text-white text-center full-screen">
        <div class="container">
            <h1 class="display-3 fw-bold">Welcome to Our API</h1>
            <p class="lead">Your gateway to powerful integrations and limitless possibilities.</p>
            <a href="#features" class="btn btn-light btn-lg mt-3">Explore Features</a>
        </div>
    </header>

    <!-- Full-Screen Features Section -->
    <section id="features" class="bg-light text-center full-screen">
        <div class="container">
            <h2 class="mb-4 fw-bold">Key Features</h2>
            <div class="row">
                <div class="col-md-4">
                    <div class="card border-primary shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">Fast & Reliable</h5>
                            <p class="card-text">Our API ensures seamless and high-speed operations for your projects.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-success shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">Secure</h5>
                            <p class="card-text">We prioritize security to keep your data safe at all times.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-warning shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">Developer Friendly</h5>
                            <p class="card-text">Clear documentation and support for easy integration.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Full-Screen Documentation Section -->
    <section class="bg-dark text-white text-center full-screen">
        <div class="container">
            <h2 class="mb-4 fw-bold">Get Started</h2>
            <p class="mb-4">Dive into our documentation and begin your journey with our API.</p>
          
        </div>
    </section>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
