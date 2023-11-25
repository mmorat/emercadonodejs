document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const forBody = {
      "username" : username,
      "password" : password
    }

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(forBody),
    })
    
    const bodyJSON = await response.json();
    localStorage.setItem("token", bodyJSON.token); 

    if (username === "" || password === "") {
      alert("¡Rellena los campos faltantes!");
    } else {
      localStorage.setItem("username", username);
      window.location.href = "index.html";
    }
  });
});
