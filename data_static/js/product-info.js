document.addEventListener("DOMContentLoaded", function () {
  const selectedProductId = localStorage.getItem("selectedProductId");

  //darkmode
  function getTheme() {
    const htmlElement = document.querySelector("html");
    return htmlElement.getAttribute("data-bs-theme");
  }

  const switchBackgroundClasses = (fromClass, toClass) => {
    const elements = document.querySelectorAll(`.${fromClass}`);

    elements.forEach((element) => {
      element.classList.remove(fromClass);
      element.classList.add(toClass);
    });
  };

  function darkmodeDinamico() {
    const tema = getTheme();

    if (tema === "dark") {
      switchBackgroundClasses("bg-light", "bg-dark");
      switchBackgroundClasses("btn-light", "btn-dark");
    } else if (tema === "light") {
      switchBackgroundClasses("bg-dark", "bg-light");
      switchBackgroundClasses("btn-dark", "btn-light");
    }
  }

  function fetch4DB() {
    fetch(`http://localhost:3000/products/${selectedProductId}`)
      .then((response) => response.json())
      .then((product) => {
        const forBody = {
          cartProducts: [
            {
              productID : product.id,
              name: product.name,
              count: 1,
              unitCost: product.cost,
              currency: product.currency,
              image: product.images[0]
            }
          ]
        };
  
        fetch("http://localhost:3000/product-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(forBody),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result.message);
          });
      });
  }
  

  function fetchInfo() {
    const productInfoURL = `http://localhost:3000/products/${selectedProductId}`;
    fetch(productInfoURL)
      .then((response) => response.json())
      .then((product) => {
        const cont = document.getElementById("infoCont");
        const cont2 = document.getElementById("prodRelacionados");

        const productContainer = document.createElement("div");
        let arrayImagen = product.images;

        const h1 = document.createElement("h1");
        h1.textContent = product.name;
        cont.appendChild(h1);

        const div = document.createElement("div");
        div.setAttribute("id", "infProd");

        const categoria = document.createElement("h4");
        categoria.textContent = "Categoría:";
        div.appendChild(categoria);
        const pCategoria = document.createElement("p");
        pCategoria.textContent = product.category;
        div.appendChild(pCategoria);

        const unidades = document.createElement("h4");
        unidades.textContent = "Cantidad de unidades vendidas:";
        div.appendChild(unidades);
        const pUnidades = document.createElement("p");
        pUnidades.textContent = product.soldCount;
        div.appendChild(pUnidades);

        const precio = document.createElement("h4");
        precio.textContent = "Precio:";
        div.appendChild(precio);
        const pPrecio = document.createElement("p");
        pPrecio.textContent = `${product.currency} $${product.cost}`;
        div.appendChild(pPrecio);

        const descripcion = document.createElement("h4");
        descripcion.textContent = "Descripición:";
        div.appendChild(descripcion);
        const pDescripcion = document.createElement("p");
        pDescripcion.textContent = product.description;
        div.appendChild(pDescripcion);

        cont.appendChild(div);

        // PRODUCTOS RELACIONADOS
        const div2 = document.createElement("div");
        div2.setAttribute("id", "relProducts");

        const prodRel = document.createElement("h2");
        prodRel.textContent = "Productos Relacionados:";
        cont2.appendChild(prodRel);

        const divRel0 = document.createElement("div");
        divRel0.setAttribute("id", "relProd0");
        divRel0.classList.add("bg-light");

        const img0 = document.createElement("img");
        img0.src = product.relatedProducts[0].image;
        divRel0.appendChild(img0);

        const h50 = document.createElement("h5");
        h50.textContent = product.relatedProducts[0].name;
        divRel0.appendChild(h50);

        div2.appendChild(divRel0);

        const divRel1 = document.createElement("div");
        divRel1.setAttribute("id", "relProd1");
        divRel1.classList.add("bg-light");

        const img1 = document.createElement("img");
        img1.src = product.relatedProducts[1].image;
        divRel1.appendChild(img1);

        const h51 = document.createElement("h5");
        h51.textContent = product.relatedProducts[1].name;
        divRel1.appendChild(h51);

        div2.appendChild(divRel1);

        cont2.appendChild(div2);

        darkmodeDinamico();

        // CARRUSEL
        const carruInner = document.getElementById("carousel-inner");

        for (let index = 0; index < arrayImagen.length; index++) {
          const carouselItem = document.createElement("div");
          carouselItem.classList.add("carousel-item");

          const imgElement = document.createElement("img");
          imgElement.src = arrayImagen[index];
          imgElement.classList.add("d-block", "w-100");

          carouselItem.appendChild(imgElement);
          carruInner.appendChild(carouselItem);
          if (index === 0) {
            carouselItem.classList.add("active");
          }
        }

        document.querySelector("main").appendChild(productContainer);
        document
          .getElementById("relProd0")
          .addEventListener("click", function () {
            localStorage.setItem(
              "selectedProductId",
              product.relatedProducts[0].id
            );
            location.reload();
          });
        document
          .getElementById("relProd1")
          .addEventListener("click", function () {
            localStorage.setItem(
              "selectedProductId",
              product.relatedProducts[1].id
            );
            location.reload();
          });
      })
      .catch((error) => {
        console.error("Error al cargar la información del producto", error);
      });
  }

  if (selectedProductId) {
    fetchInfo();
  } else {
    console.log("No se ha seleccionado ningún producto.");
  }

  // COMENTARIOS
  const username = localStorage.getItem("username");
  const containerComentarios = document.getElementById("comments-container");
  const formComentarios = document.getElementById("comment-form");
  let arrComentarios = [];

  function fetchComentarios() {
    fetch(`http://localhost:3000/product_comments/${selectedProductId}`)
      .then((response) => response.json())
      .then((data) => {
        arrComentarios = data.sort(
          (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
        );

        displayComentarios();
      })
      .catch((error) => {
        console.error("Error fetching comments", error);
      });
  }

  function displayComentarios() {
    const containerComentarios = document.getElementById("comments-container");
    containerComentarios.innerHTML = "";
    arrComentarios.forEach((comentario) => {
      const divComentarios = document.createElement("div");
      divComentarios.innerHTML = `
      <p><strong>Usuario: </strong> ${comentario.user}</p>
      <p><strong>Comentario: </strong> ${comentario.description}</p>
      <div class="rating">${getStarsHTML(comentario.score)}</div>
      <p>Fecha: ${comentario.dateTime}</p><hr>
    `;
      containerComentarios.appendChild(divComentarios);
    });
  }

  formComentarios.addEventListener("submit", function (e) {
    e.preventDefault();
    const commentText = document.getElementById("comment").value;
    const rating = document.getElementById("rating").value;
    const now = new Date();
    now.setUTCHours(now.getUTCHours() - 3);
    const fechaHora = now.toISOString().slice(0, 19).replace("T", " ");

    const nuevoComentario = {
      user: username,
      description: commentText,
      score: Number(rating),
      dateTime: fechaHora,
    };
    arrComentarios.push(nuevoComentario);
    displayComentarios();

    formComentarios.reset();
  });

  fetchComentarios();

  // Función para generar HTML de estrellas
  function getStarsHTML(rating) {
    const starsHTML = Array(rating)
      .fill('<span class="fa fa-star checked"></span>')
      .join("");
    const letnumero = 5 - rating;
    const casillasvacias = Array(letnumero)
      .fill('<span class="fa fa-star "></span>')
      .join("");
    return `<div class="stars">${starsHTML + casillasvacias}</div>`;
  }

  const btnComprar = document.getElementById("comprar");

  btnComprar.addEventListener("click", (e) => {
    e.stopPropagation();
    fetch4DB();
    
    btnComprar.classList.remove("btn-primary");
    btnComprar.classList.add("btn-secondary");

    // Recuperar el arreglo de productos del localStorage
    let cartProds = JSON.parse(localStorage.getItem("cartProducts")) || [];
    cartProds.push(selectedProductId);
    localStorage.setItem("cartProducts", JSON.stringify(cartProds));
  });
});
