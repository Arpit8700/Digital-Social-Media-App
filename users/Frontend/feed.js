const token = localStorage.getItem("access");

if (!token) {
    window.location = "login.html";
}
// Create Post
async function createPost() {

    const content = document.getElementById("content").value;

    document.getElementById("loading").style.display = "block";

    const image = document.getElementById("postImage").files[0];

    const formData = new FormData();

    formData.append("content", content);

    if (image) {
        formData.append("image", image);
    }

    const response = await fetch(
        "http://127.0.0.1:8000/api/posts/",
        {
            method: "POST",

            headers: {
                "Authorization": "Bearer " + token
            },

            body: formData
        }
    );

    const data = await response.json();

    if (response.ok) {

        alert("Post Created Successfully");

        document.getElementById("content").value = "";
        document.getElementById("postImage").value = "";

        loadPosts();

    } else {


        alert(JSON.stringify(data));

    }
}

// Load Posts
async function loadPosts() {

    const response = await fetch("http://127.0.0.1:8000/api/posts/", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const posts = await response.json();

    let html = "";

    posts.forEach(post => {

        html += `
        <div class="post">

            <h4>👤 User ${post.user}</h4>
            <hr>

            <button onclick="followUser(${post.user})">
            ➕ Follow
            </button>

            <button onclick="unfollowUser(${post.user})">
            ➖ Unfollow
            </button>


    <p>${post.content}</p>

    ${post.image ? `
    <img src="${post.image}" width="250">
`   : ""}

            <button onclick="likePost(${post.id})">
            ❤️ Like
            </button>

            <button onclick="unlikePost(${post.id})">
            💔 Unlike
            </button>

            <button onclick="showEditBox(${post.id}, '${post.content}')">
            ✏️ Edit
            </button>

            <button onclick="deletePost(${post.id})">
            🗑 Delete
            </button>

            <p>
                Likes : ${post.total_likes}
            </p>

            <button onclick="showCommentBox(${post.id})">
            💬 Comment
            </button>

            <div id="commentBox${post.id}"></div>

            <div id="comments${post.id}"></div>

        </div>
        `;
    });

    document.getElementById("posts").innerHTML = html;

    // Load comments for every post
    posts.forEach(post => {
        loadComments(post.id);
    });
}

loadPosts();

// Like Post
async function likePost(postId){

    const response = await fetch(
        `http://127.0.0.1:8000/api/likes/post/${postId}/`,
        {
            method:"POST",

            headers:{
                "Authorization":"Bearer "+token
            }
        }
    );

    const data = await response.json();

    alert(data.message);

    loadPosts();
}

//FOllow User
async function followUser(userId){

    const response = await fetch(
        `http://127.0.0.1:8000/api/follows/follow/${userId}/`,
        {
            method:"POST",

            headers:{
                "Authorization":"Bearer " + token
            }
        }
    );

    const data = await response.json();

    alert(data.message);

}

//Unfollow User
async function unfollowUser(userId){

    const response = await fetch(
        `http://127.0.0.1:8000/api/follows/unfollow/${userId}/`,
        {
            method:"DELETE",

            headers:{
                "Authorization":"Bearer " + token
            }
        }
    );

    const data = await response.json();

    alert(data.message);

}



// Unlike Post
async function unlikePost(postId){

    const response = await fetch(
        `http://127.0.0.1:8000/api/likes/unlike/${postId}/`,
        {
            method:"DELETE",

            headers:{
                "Authorization":"Bearer "+token
            }
        }
    );

    const data = await response.json();

    alert(data.message);

    loadPosts();
}

// Show Comment Box
function showCommentBox(postId){

    document.getElementById(`commentBox${postId}`).innerHTML = `
        <input
            id="comment${postId}"
            placeholder="Write Comment">

        <button onclick="addComment(${postId})">
            Send
        </button>
    `;
}

// Add Comment
async function addComment(postId){

    const text = document.getElementById(`comment${postId}`).value;

    const response = await fetch(
        `http://127.0.0.1:8000/api/comments/post/${postId}/`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+token
            },

            body:JSON.stringify({
                post:postId,
                text:text
            })
        }
    );

    const data = await response.json();

    alert("Comment Added");

    loadPosts();
}

// Load Comments
async function loadComments(postId){

    const response = await fetch(
        `http://127.0.0.1:8000/api/comments/post/${postId}/`,
        {
            headers:{
                "Authorization":"Bearer "+token
            }
        }
    );

    const comments = await response.json();

    let html = "";

    comments.forEach(comment => {

        html += `
        <div class="comment">

             ${comment.text}

            <button onclick="showEditComment(${comment.id}, '${comment.text}')">
              Edit  
            </button>

            <button onclick="deleteComment(${comment.id})">
              Delete  
            </button>

            <div id="editComment${comment.id}"></div>

        </div>
        `;

    });

    document.getElementById(`comments${postId}`).innerHTML = html;

}

// Show Edit Box
function showEditBox(postId, oldContent){

    document.getElementById(`commentBox${postId}`).innerHTML = `

        <input
            id="edit${postId}"
            value="${oldContent}">

        <button onclick="updatePost(${postId})">
            Save
        </button>

    `;

}

//Update Post
async function updatePost(postId){

    const content = document.getElementById(`edit${postId}`).value;

    const response = await fetch(
        `http://127.0.0.1:8000/api/posts/${postId}/update/`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                content: content
            })
        }
    );

    const data = await response.json();

    if(response.ok){
        alert("Post Updated Successfully");
        loadPosts();
    }else{
        alert(JSON.stringify(data));
    }

}

// Delete Post
async function deletePost(postId){

    const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
    );

    if(!confirmDelete){
        return;
    }

    const response = await fetch(

        `http://127.0.0.1:8000/api/posts/${postId}/delete/`,

        {

            method:"DELETE",

            headers:{
                "Authorization":"Bearer " + token
            }

        }

    );

    if(response.ok){

        alert("Post Deleted Successfully");

        loadPosts();

    }

    else{

        const data = await response.json();

        alert(JSON.stringify(data));

    }

}
// show Edit Comment
function showEditComment(commentId, text){

    document.getElementById(`editComment${commentId}`).innerHTML = `

        <input
            id="newComment${commentId}"
            value="${text}">

        <button onclick="updateComment(${commentId})">
            Save
        </button>

    `;

}

// Update Comment
async function updateComment(commentId){

    const text = document.getElementById(`newComment${commentId}`).value;

    const response = await fetch(

        `http://127.0.0.1:8000/api/comments/update/${commentId}/`,

        {

            method:"PUT",

            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+token
            },

            body:JSON.stringify({
                text:text
            })

        }

    );

    if(response.ok){

        alert("Comment Updated");

        loadPosts();

    }else{

        const data = await response.json();

        alert(JSON.stringify(data));

    }

}

// Delete Comment
async function deleteComment(commentId){

    const response = await fetch(

        `http://127.0.0.1:8000/api/comments/delete/${commentId}/`,

        {

            method:"DELETE",

            headers:{
                "Authorization":"Bearer "+token
            }

        }

    );

    if(response.ok){

        alert("Comment Deleted");

        loadPosts();

    }else{

        const data = await response.json();

        alert(JSON.stringify(data));

    }

}

// Logout
function logout(){

    localStorage.clear();

    window.location = "login.html";

}