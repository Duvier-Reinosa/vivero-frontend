document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const producerList = document.getElementById('producer-list');
    const emailDomainCounts = {};
    let chart;

    function updateChart() {
        const labels = Object.keys(emailDomainCounts);
        const data = Object.values(emailDomainCounts);

        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.update();
        } else {
            const ctx = document.getElementById('emailDomainChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cantidad de productores por dominio de email',
                        data: data,
                        backgroundColor: '#3498db',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Productores por dominio de email',
                            font: {
                                size: 18
                            }
                        }
                    }
                }
            });
        }
    }

    function insertRowIntoTable(producer) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producer.document}</td>
            <td>${producer.name}</td>
            <td>${producer.last_name}</td>
            <td>${producer.phone}</td>
            <td>${producer.email}</td>
        `;
        producerList.appendChild(row);
    }

    function updateEmailDomain(email) {
        const domain = email.split('@')[1];
        if (domain) {
            emailDomainCounts[domain] = (emailDomainCounts[domain] || 0) + 1;
            updateChart();
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const producerData = {
            document: form.document.value.trim(),
            name: form.name.value.trim(),
            last_name: form.last_name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim()
        };

        // Enviar datos al servidor con AJAX (usa jQuery si estás incluyendo el CDN)
        $.ajax({
            url: 'http://localhost:3000/productor', // cambia esto por tu endpoint real
            method: 'POST',
            data: producerData,
            success: function (response) {
                // Actualizar la tabla y gráfica
                insertRowIntoTable(producerData);
                updateEmailDomain(producerData.email);
                form.reset();
            },
            error: function () {
                alert('Error al enviar los datos al servidor.');
            }
        });
    });
});
