const token = localStorage.getItem("access");

if (!token) {
    window.location = "login.html";
}

async function loadProfile() {
    console.log(token);
    console.log("Bearer " + token);

    const response = await fetch(
        "http://127.0.0.1:8000/api/users/profile/",
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    console.log(response.status);

    const data = await response.json();

    document.getElementById("username").innerText = data.username;
    document.getElementById("bio").innerText = data.bio;
    document.getElementById("followers").innerText = data.followers;
    document.getElementById("following").innerText = data.following;
    document.getElementById("posts").innerText = data.posts;

    if (data.profile_pic) {

    document.getElementById("profileImage").src =
        "http://127.0.0.1:8000" + data.profile_pic;

}

}

loadProfile();

async function updateProfile() {

    const bio = document.getElementById("newBio").value;

    const image = document.getElementById("profilePic").files[0];

    const formData = new FormData();

    formData.append("bio", bio);

    if (image) {
        formData.append("profile_pic", image);
    }

    const response = await fetch(
        "http://127.0.0.1:8000/api/users/update-profile/",
        {
            method: "PUT",

            headers: {
                "Authorization": "Bearer " + token
            },

            body: formData
        }
    );

    const data = await response.json();

    alert(data.message);

    loadProfile();
}
