<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Day-Wise Graph</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
       
        <canvas id="dailyChart"></canvas>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
        $(document).ready(function(){

// Function to fetch data and update chart
function fetchDataAndUpdateChart() {
    $.ajax({
        url: '/chart-data', // Replace with your Laravel endpoint
        method: 'GET',
        success: function(response) {
            const labels = Object.keys(response);
            const dataValues = Object.values(response).map(value => parseFloat(value)); // Parse values as floats

            // Update chart data
            dailyChart.data.labels = labels;
            dailyChart.data.datasets[0].data = dataValues;
            dailyChart.update();

            // Initial chart setup
const ctx = document.getElementById('dailyChart').getContext('2d');
const dailyChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Initially empty, will be populated by fetched data
        datasets: [{
            label: 'Circulating Supply',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        if (tooltipItem.dataset) {
                            return tooltipItem.dataset.data[tooltipItem.dataIndex].toFixed(10);
                        }
                        return '';
                    }
                }
            }
        }
    }
});
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}



// Fetch data and update chart initially
fetchDataAndUpdateChart();

// Update chart data every 10 seconds
setInterval(fetchDataAndUpdateChart, 10000); // 10 seconds interval (10000 milliseconds)
});

    </script>
</body>
</html>
