const username = sessionStorage.getItem("username") || localStorage.getItem("username");
const email = document.getElementById("email");
let inputNombre = document.getElementById("nombre");
let nombreTexto = document.getElementById("nombreValid");
let inputApellido = document.getElementById("apellido");
let apellidoTexto = document.getElementById("apellidoValid");
let inpuTel = document.getElementById("telefono");
let telTexto = document.getElementById("telValid");
let input2nombre = document.getElementById("segundoNombre");
let input2apellido = document.getElementById("segundoApellido");


document.addEventListener("DOMContentLoaded", () => {
    email.value = username;
    const nombre = localStorage.getItem("nombre");
    inputNombre.value = nombre;
    const apellido = localStorage.getItem("apellido");
    inputApellido.value = apellido;
    const telefono = localStorage.getItem("telefono");
    inpuTel.value = telefono;
    const segundoNombre = localStorage.getItem("segundo-nombre");
    input2nombre.value = segundoNombre;
    const segundoApellido = localStorage.getItem("segundo-apellido");
    input2apellido.value = segundoApellido;

    const fileInput = document.getElementById('foto');
    const profileImage = document.getElementById('img');

    
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
        profileImage.src = storedImage;
    }

    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = e.target.result;
                profileImage.src = imageData;
                localStorage.setItem('profileImage', imageData); 
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    //VALIDACION Y Almacenamiento del usario en el localstorage
    const form = document.getElementById("perfil");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        //input name
        if (inputNombre.value === "") {
            inputNombre.classList.remove("is-valid");
            inputNombre.classList.add("is-invalid");

            nombreTexto.classList.remove("valid-feedback");
            nombreTexto.classList.add("invalid-feedback");

            nombreTexto.innerHTML = "Por favor, ingrese su nombre.";
        } else {
            inputNombre.classList.remove("is-invalid");
            inputNombre.classList.add("is-valid");

            nombreTexto.classList.remove("invalid-feedback");
            nombreTexto.classList.add("valid-feedback");
            nombreTexto.innerHTML = "";
        }
        localStorage.setItem("nombre", inputNombre.value);

        //input apellido

        if (inputApellido.value === "") {
            inputApellido.classList.remove("is-valid");
            inputApellido.classList.add("is-invalid");

            apellidoTexto.classList.remove("valid-feedback");
            apellidoTexto.classList.add("invalid-feedback");

            apellidoTexto.innerHTML = "Por favor, ingrese su apellido.";
        } else {
            inputApellido.classList.remove("is-invalid");
            inputApellido.classList.add("is-valid");

            apellidoTexto.classList.remove("invalid-feedback");
            apellidoTexto.classList.add("valid-feedback");
            apellidoTexto.innerHTML = "";
        }
        localStorage.setItem("apellido", inputApellido.value);


        //input telefono

        if (inpuTel.value === "") {
            inpuTel.classList.remove("is-valid");
            inpuTel.classList.add("is-invalid");

            telTexto.classList.remove("valid-feedback");
            telTexto.classList.add("invalid-feedback");

            telTexto.innerHTML = "Por favor, ingrese su teléfono.";
        } else if (isNaN(inpuTel.value)) {
            inpuTel.classList.remove("is-valid");
            inpuTel.classList.add("is-invalid");

            telTexto.classList.remove("valid-feedback");
            telTexto.classList.add("invalid-feedback");

            telTexto.innerHTML = "tipee en formato numero por favor";
        } else {
            inpuTel.classList.remove("is-invalid");
            inpuTel.classList.add("is-valid");

            telTexto.classList.remove("invalid-feedback");
            telTexto.classList.add("valid-feedback");
            telTexto.innerHTML = "";
        }
        localStorage.setItem("telefono", inpuTel.value);


        // Datos no obligatorios pero que se almacenan
        localStorage.setItem("segundo-nombre", input2nombre.value);
        localStorage.setItem("segundo-apellido", input2apellido.value);
    });
});