const token = localStorage.getItem("access");

if (!token) {
    window.location = "login.html";
}

async function loadNotifications() {

    const response = await fetch(
        "http://127.0.0.1:8000/api/notifications/",
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const notifications = await response.json();

    let html = "";

    notifications.forEach(notification => {

        html += `
            <div class="post">
                <p>${notification.message}</p>
                <small>${notification.created_at}</small>
            </div>
        `;
    });

    document.getElementById("notifications").innerHTML = html;
}

loadNotifications();