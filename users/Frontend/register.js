async function register() {

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    const data = await response.json();

    console.log(data);

    if (response.ok) {
        alert("Registration Successful");
        window.location = "login.html";
    } else {
        alert("Registration Failed");
        alert(JSON.stringify(data));
    }
}
