async function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await response.json();

    console.log(data);
    console.log(localStorage.getItem("access"));

    if (response.ok) {

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        alert("Login Successful");

        window.location = "feed.html";

    } else {

        alert("Invalid Username or Password");
        console.log(data);

    }

}