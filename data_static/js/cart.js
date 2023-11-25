document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "https://japceibal.github.io/emercado-api/user_cart/";
  const userID = 25801; // ID de usuario específico
  const URL = baseURL + userID + ".json";

  let USD = 40; // valor del dólar en UYU 

  const cart = document.getElementById("cart");
  const total = document.getElementById("total");
  const costoEnvio = document.getElementById("costoEnvio");
  const costoTotalEnvio = document.getElementById("costoTotalEnvio");
  const envioRadios = document.getElementsByName("envio");

  let arrPreciosUSD = [];

  let envioSeleccionado = "";
  let precioEnvio = "";
  let totalConEnvio = "";


  //darkmode
  function getTheme(){
    const htmlElement = document.querySelector('html');
    return htmlElement.getAttribute('data-bs-theme');
    }

  const switchBackgroundClasses = (fromClass, toClass) => {
    const elements = document.querySelectorAll(`.${fromClass}`);
    
    elements.forEach(element => {
      element.classList.remove(fromClass);
      element.classList.add(toClass);
    });
  };

  function darkmodeDinamico() {
    
    const tema = getTheme();
  
    if (tema === 'dark') {
      switchBackgroundClasses('bg-light', 'bg-dark');
      switchBackgroundClasses('btn-light', 'btn-dark'); 
    } else if (tema === 'light'){
      switchBackgroundClasses('bg-dark', 'bg-light');
      switchBackgroundClasses('btn-dark', 'btn-light');  
    };
  };

  // función para sumar todos los elementos de un array
  function sumarArray(arr) {
    return arr.reduce((acumulador, elemento) => acumulador + elemento, 0);
  }

  // agrega event listener para cada botón radial, actualizando el valor de envioSeleccionado y el valor total
  envioRadios.forEach(radio => {
    radio.addEventListener("change", function() {
      envioSeleccionado = parseFloat(this.value);
      actualizarTotal();
    });
  });
  
  // función para actualizar el total
  function actualizarTotal() {
    // vaciar array
    arrPreciosUSD = [];
    // agrega todos los subtotales en dólares al array
    const preciosUSD = cart.querySelectorAll(".usd");
    preciosUSD.forEach((element) => {
      arrPreciosUSD.push(parseInt(element.textContent));
    });
    // convierte todos los precios en pesos a dólares y los agrega al array
    const preciosUYU = cart.querySelectorAll(".uyu");
    preciosUYU.forEach((element) => {
      let precioEnUSD = parseInt(element.textContent) / USD;
      arrPreciosUSD.push(precioEnUSD);
    });
    // calcula costo total del carrito, costo de envío, y el total del carrito con el envío
    let precioCarrito = sumarArray(arrPreciosUSD);
    total.textContent =  `USD$ `+ precioCarrito;

    precioEnvio = precioCarrito*envioSeleccionado;
    costoEnvio.textContent =  `USD$ `+ precioEnvio;

    totalConEnvio = precioCarrito + precioEnvio;
    costoTotalEnvio.textContent =  `USD$ `+ totalConEnvio;
  }




  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      data.articles.forEach((product) => {
        const articulo = document.createElement("tr");
        articulo.classList.add("articulo");

        const td1 = document.createElement("td");
        td1.classList.add("td1");
        const img = document.createElement("img");
        img.src = product.image;
        td1.appendChild(img);
        articulo.appendChild(td1);

        const td2 = document.createElement("td");
        td2.classList.add("td2");
        const nombre = document.createElement("p");
        nombre.textContent = product.name;
        td2.appendChild(nombre);
        articulo.appendChild(td2);

        const td3 = document.createElement("td");
        td3.classList.add("td3");
        const precio = document.createElement("p");
        precio.textContent = `${product.currency}$ ${product.unitCost}`;
        td3.appendChild(precio);
        articulo.appendChild(td3);

        const td4 = document.createElement("td");
        td4.classList.add("td4");
        const input = document.createElement("input");
        input.type = "number";
        input.name = "Cant.";
        input.value = product.count;
        input.min = "1";
        input.max = "10";
        input.classList.add("bg-light");
        td4.appendChild(input);
        articulo.appendChild(td4);
        

        const td5 = document.createElement("td");
        td5.classList.add("td5");
        const p = document.createElement("p");
        p.textContent = `${product.currency} $`;
        td5.appendChild(p);
        articulo.appendChild(td5);

        const td6 = document.createElement("td");
        td6.classList.add("td6");
        let subtotal = input.value * product.unitCost;
        const pSubtotal = document.createElement("p");
        pSubtotal.textContent = subtotal;
        if (product.currency === "USD") {
          td6.classList.add("usd");
        } else if (product.currency === "UYU") {
          td6.classList.add("uyu");
        }
        td6.appendChild(pSubtotal);
        articulo.appendChild(td6);

        const td7 = document.createElement("td");
        td7.classList.add("td7");
        const button = document.createElement("button");
        button.textContent = "Eliminar";
        button.classList.add("btn", "btn-danger");
        td7.appendChild(button);
        articulo.appendChild(td7);

        button.addEventListener("click", () => {
           const index = arrayProd.indexOf(product.id);
           if (index !== -1) {
               arrayProd.splice(index, 1);
               localStorage.setItem("cartProducts", JSON.stringify(arrayProd));
           }

           articulo.remove();
           actualizarTotal();
        });

        cart.appendChild(articulo);

        actualizarTotal();
        darkmodeDinamico();

        input.addEventListener("input", (e) => {
          e.stopPropagation();
          subtotal = input.value * product.unitCost;
          pSubtotal.textContent = subtotal;
          actualizarTotal();
        });
      });
    })
    .catch((error) =>
      console.error("Error al obtener los datos del carrito:", error)
    );

  //carrito manual

  const arrayProd = JSON.parse(localStorage.getItem("cartProducts")) || [];
  arrayProd.forEach((id) => {
    const productURL = `https://japceibal.github.io/emercado-api/products/${id}.json`;
    fetch(productURL)
      .then((response) => response.json())
      .then((product) => {
        const existingProduct = document.querySelector(`.articulo[data-product-id="${product.id}"]`);
  
        let input = null;
        let pSubtotal = null;
  
        if (!existingProduct) {
          const articulo = document.createElement("tr");
          articulo.classList.add("articulo");
          articulo.setAttribute('data-product-id', product.id);
  
          const td1 = document.createElement("td");
          td1.classList.add("td1");
          const img = document.createElement("img");
          img.src = product.images[0];
          td1.appendChild(img);
          articulo.appendChild(td1);
  
          const td2 = document.createElement("td");
          td2.classList.add("td2");
          const nombre = document.createElement("p");
          nombre.textContent = product.name;
          td2.appendChild(nombre);
          articulo.appendChild(td2);
  
          const td3 = document.createElement("td");
          td3.classList.add("td3");
          const precio = document.createElement("p");
          precio.textContent = `${product.currency}$ ${product.cost}`;
          td3.appendChild(precio);
          articulo.appendChild(td3);
  
          const td4 = document.createElement("td");
          td4.classList.add("td4");
          input = document.createElement("input");
          input.type = "number";
          input.name = "Cant.";
          input.value = "1";
          input.min = "1";
          input.max = "10";
          input.classList.add("bg-light");
          td4.appendChild(input);
          articulo.appendChild(td4);
  
          const td5 = document.createElement("td");
          td5.classList.add("td5");
          const p = document.createElement("p");
          p.textContent = `${product.currency} $`;
          td5.appendChild(p);
          articulo.appendChild(td5);
  
          const td6 = document.createElement("td");
          td6.classList.add("td6");
          let subtotal = input.value * product.cost;
          pSubtotal = document.createElement("p");
          pSubtotal.textContent = subtotal;
          pSubtotal.id = product.id;
          if (product.currency === "USD") {
            td6.classList.add("usd");
          } else if (product.currency === "UYU") {
            td6.classList.add("uyu");
          }
          td6.appendChild(pSubtotal);
          articulo.appendChild(td6);
  
          const td7 = document.createElement("td");
          td7.classList.add("td7");
          const button = document.createElement("button");
          button.textContent = "Eliminar";
          button.classList.add("btn", "btn-danger");
          td7.appendChild(button);
          articulo.appendChild(td7);
  
          button.addEventListener("click", () => {
            const index = arrayProd.indexOf(id);
            if (index !== -1) {
              arrayProd.splice(index, 1);
              localStorage.setItem("cartProducts", JSON.stringify(arrayProd));
            }
  
            articulo.remove();
            actualizarTotal();
           darkmodeDinamico;
          });
  
          cart.appendChild(articulo);
        } else {
          // If the product is already in the cart, update the quantity
          const quantityInput = existingProduct.querySelector('.td4 input');
          quantityInput.value = parseInt(quantityInput.value) + 1; 
          let subtotal = quantityInput.value * product.cost;
          const pSubtotal = document.getElementById(`${product.id}`);
          pSubtotal.textContent = subtotal;
          actualizarTotal();
        }
  


        
        if (input) {
          input.addEventListener("input", (e) => {
            e.stopPropagation();
            let subtotal = input.value * product.cost;
            pSubtotal.textContent = subtotal;
            actualizarTotal();
          });
        }
      });
  });
});

const creditCardOption = document.getElementById('creditCardOption');
const bankTransferOption = document.getElementById('bankTransferOption');
const accountNumberInput = document.getElementById('accountNumber');
const cardNumberInput = document.getElementById('cardNumber');
const securityCodeInput = document.getElementById('securityCode');
const expirationDateInput = document.getElementById('expirationDate');

// Agregar eventos de cambio a los elementos de radio
creditCardOption.addEventListener('change', function () {
  accountNumberInput.disabled = true;  
  cardNumberInput.disabled = false; 
  securityCodeInput.disabled = false;  
  expirationDateInput.disabled = false;  
});

bankTransferOption.addEventListener('change', function () {
  accountNumberInput.disabled = false;  
  cardNumberInput.disabled = true; 
  securityCodeInput.disabled = true;  
  expirationDateInput.disabled = true; 
});

//validacion bootstrap
(() => {
  'use strict'
 
  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


//chequea que una de los métodos de pago haya sido elegido
const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", function (event) {
    if (!creditCardOption.checked && !bankTransferOption.checked) {
      event.preventDefault();
      const errorContainer = document.getElementById("errorContainer");
      errorContainer.textContent = "Por favor, seleccione un método de pago.";
    } else if (form.checkValidity()) {
      event.preventDefault();

      const successMessage = document.getElementById("successMessage");
      successMessage.style.display = "block";
      setTimeout(function () {
        successMessage.style.display = "none";
        window.location.href = "index.html";
      }, 4000);
    }
  });
 
  creditCardOption.addEventListener('change', function () {
    clearErrorMessage();  
  });

  bankTransferOption.addEventListener('change', function () {
    clearErrorMessage(); 
  });

  function clearErrorMessage() {
    const errorContainer = document.getElementById("errorContainer");
    errorContainer.textContent = "";
  }