document.addEventListener("DOMContentLoaded", function(){
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
  
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const rememberCheckbox = document.getElementById("recordar-sesion");
  
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
  
        if (username === "" || password === "") {
            alert("¡Rellena los campos faltantes!");
        } else {
            if (rememberCheckbox.checked) {
                localStorage.setItem("username", username);
            } else {
                sessionStorage.setItem("username", username);
            }
            window.location.href = "index.html";

        }
    });
});