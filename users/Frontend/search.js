const token = localStorage.getItem("access");

if (!token) {
    window.location = "login.html";
}

async function searchUser() {

    const search = document.getElementById("search").value;

    const response = await fetch(
        `http://127.0.0.1:8000/api/users/search/?search=${search}`,
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const users = await response.json();

    let html = "";

    users.forEach(user => {

        html += `
        <div style="border:1px solid gray;padding:10px;margin-top:10px;">
            <h3>${user.username}</h3>
            <p>${user.bio}</p>

            <button onclick="followUser(${user.id})">
                Follow
            </button>
        </div>
        `;

    });

    document.getElementById("result").innerHTML = html;
}

async function followUser(userId) {

    const response = await fetch(
        `http://127.0.0.1:8000/api/follows/follow/${userId}/`,
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const data = await response.json();

    alert(data.message);
}