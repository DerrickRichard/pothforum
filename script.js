const WEB_APP_URL = "https://script.google.com/a/macros/pothisd.us/s/AKfycbzSvo5n0ELksg-xVljMX8xyDrY2JrWtXgVqZ1BSC0Mkg4snFWappX3A-CZShfVCM3wekQ/exec";

function submitPost() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const tags = document.getElementById("tags").value.trim();

  if (!title || !description) {
    alert("Please fill in both the title and description.");
    return;
  }

  const post = {
    title,
    description,
    tags,
    timestamp: new Date().toISOString()
  };

  fetch(WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post),
    credentials: "include" // Ensures cookies are sent for domain-authenticated access
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      return res.text();
    })
    .then(response => {
      alert("Question submitted!");
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("tags").value = "";
      loadPosts();
    })
    .catch(err => {
      console.error("Error submitting post:", err);
      alert("Submission failed. Make sure you're signed in with your school account.");
    });
}

function loadPosts() {
  fetch(WEB_APP_URL, {
    method: "GET",
    credentials: "include"
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      return res.json();
    })
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      posts.reverse().forEach(post => {
        const div = document.createElement("div");
        div.className = "post";
        div.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <small>Tags: ${post.tags || "none"} | Posted on ${new Date(post.timestamp).toLocaleString()}</small>
        `;
        postList.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error loading posts:", err);
      alert("Failed to load posts. Make sure you're signed in with your school account.");
    });
}

window.onload = loadPosts;
