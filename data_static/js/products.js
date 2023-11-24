document.addEventListener("DOMContentLoaded", function () {

  const lista = document.getElementById("showProd");
  const catID = localStorage.getItem("catID");
  let URL = `http://localhost:3000/cats_products/${catID}`;

  function compararAscendente(a, b) {
    return a.cost - b.cost;
  }

  function compararDescendente(a, b) {
    return b.cost - a.cost;
  }

  function compararRelevancia(a, b) {
    return b.soldCount - a.soldCount;
  }

  function limpiarLista() {
    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }
  }

  function getTheme() {
    const htmlElement = document.querySelector("html");
    return htmlElement.getAttribute("data-bs-theme");
  }

  function bgClass(item) {
    const tema = getTheme();

    if (tema === "dark") {
      return item.classList.add("bg-dark");
    } else if (tema === "light") {
      return item.classList.add("bg-light");
    }
  }

  function mostrarProducts(products) {
    products.forEach((product) => {
      const item = document.createElement("div");
      item.classList.add("producto");

      bgClass(item);

      const img = document.createElement("img");
      img.src = product.image;
      item.appendChild(img);

      const soldCountDiv = document.createElement("div");
      soldCountDiv.classList.add("sold-count");
      soldCountDiv.textContent = `${product.soldCount} vendidos`;
      item.appendChild(soldCountDiv);

      const h4 = document.createElement("h4");
      h4.classList.add("tituloh4");
      h4.textContent = `${product.name} - ${product.currency}$ ${product.cost}`;

      item.appendChild(h4);

      item.appendChild(document.createTextNode(product.description));

      lista.appendChild(item);

      item.setAttribute("data-id", product.id);

      item.addEventListener("click", function () {
        const selectedId = item.getAttribute("data-id");
        seleccionarProducto(selectedId); // Llamar a la función con el ID del producto
      });
    });
  }

  let arrayProducts = [];

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      arrayProducts = data.products; // guarda los datos en el array creado anteriormente
      data.products.forEach((product) => {
        const item = document.createElement("div");
        item.classList.add("producto");
        bgClass(item);

        const img = document.createElement("img");
        img.src = product.image;
        item.appendChild(img);

        const soldCountDiv = document.createElement("div");
        soldCountDiv.classList.add("sold-count");
        soldCountDiv.textContent = `${product.soldCount} vendidos`;
        item.appendChild(soldCountDiv);

        const h4 = document.createElement("h4");
        h4.textContent = `${product.name} - ${product.currency}$ ${product.cost}`;
        h4.classList.add("tituloh4");
        item.appendChild(h4);

        item.setAttribute("data-id", product.id);

        item.addEventListener("click", function () {
          const selectedId = item.getAttribute("data-id");
          seleccionarProducto(selectedId); // Llamar a la función con el ID del producto
        });
        // fin cambios A.R.
        item.appendChild(document.createTextNode(product.description));

        lista.appendChild(item);
      });

      //modificación del título de la página donde anuncia la categoría seleccionada
      let categoria = data.catName;
      document.getElementById("tituloProd").textContent +=
        ' "' + categoria + '"';

      //botones:
      const precioA = document.getElementById("sortAsc");
      const precioD = document.getElementById("sortDesc");
      const rel = document.getElementById("sortBySold");
      const filtrar = document.getElementById("rangeFilterCount");
      const limpiar = document.getElementById("clearSearchInput");
      //input precio:
      const pMin = document.getElementById("rangeFilterCountMin");
      const pMax = document.getElementById("rangeFilterCountMax");

      //función que ordena según el precio de manera ascendente
      precioA.addEventListener("click", function () {
        arrayProducts.sort(compararAscendente);
        limpiarLista();
        mostrarProducts(arrayProducts);
      });

      //función que ordena según el precio de manera descendente
      precioD.addEventListener("click", function () {
        arrayProducts.sort(compararDescendente);
        limpiarLista();
        mostrarProducts(arrayProducts);
      });

      //función que ordena según la cantidad de unidades vendidas
      rel.addEventListener("click", function () {
        arrayProducts.sort(compararRelevancia);
        limpiarLista();
        mostrarProducts(arrayProducts);
      });

      //función que, al presionar "Filtrar", muestra sólo los productos que entran en el rango de precios ingresado
      filtrar.addEventListener("click", function () {
        let arrayFiltrado = [];

        arrayProducts.forEach((product) => {
          const min = pMin ? pMin.value : 0; // si pMin está definido, min utiliza su valor. Si no lo está, min vale 0.
          const max =
            pMax !== undefined && pMax.value !== ""
              ? parseFloat(pMax.value)
              : Infinity; // si pMax está definido, max utiliza su valor. Si no lo está, max vale Infinity.

          if (product.cost >= min && product.cost <= max) {
            arrayFiltrado.push(product);
          }
        });

        limpiarLista();
        mostrarProducts(arrayFiltrado);
      });

      //función que limpia  los campos de precio mínimo y máximo y nos vuelve a mostrar todos los productos
      limpiar.addEventListener("click", function () {
        limpiarLista();
        pMin.value = "";
        pMax.value = "";
        mostrarProducts(arrayProducts);
      });
    })
    .catch((error) => console.log(error));

  // campo buscador
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const textoBusqueda = searchInput.value.trim().toLowerCase();

    // Filtrar los productos según el texto de búsqueda
    const productosFiltrados = arrayProducts.filter((producto) => {
      const titulo = producto.name.toLowerCase();
      const descripcion = producto.description.toLowerCase();
      return (
        titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda)
      );
    });

    // Limpiar la lista y mostrar los productos filtrados
    limpiarLista();
    mostrarProducts(productosFiltrados);
  });
  // se crea la funcion seleccionar producto que tome el id del producto del local y lo redirija a product-info
  function seleccionarProducto(id) {
    localStorage.setItem("selectedProductId", id);
    window.location.href = "product-info.html";
  }
});