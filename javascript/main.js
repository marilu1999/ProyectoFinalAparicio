document.addEventListener("DOMContentLoaded", () => {
    const articulosStore = document.getElementById("articulos");
    const verCarrito = document.getElementById("carrito");
    const modalContainer = document.getElementById("modalContainer");

    let carrito = [];

    const displayProductos = (productos) => {
        productos.forEach((product) => {
            let content = document.createElement("div");
            content.className = "card";
            content.innerHTML = `
                <img src="${product.img}">
                <h2>${product.nombre}</h2>
                <p class="price">${product.precio} $</p>
            `;

            articulosStore.append(content);

            let comprar = document.createElement("button");
            comprar.innerText = "Comprar";
            comprar.className = "comprar";

            content.append(comprar);

            comprar.addEventListener("click", () => {
                console.log("Haciendo clic en Comprar");
                carrito.push({
                    id: product.id,
                    img: product.img,
                    nombre: product.nombre,
                    precio: product.precio
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Producto añadido al carrito',
                    showConfirmButton: false,
                    timer: 1500
                });
                updateLocalStorage();
            });
        });
    };

    const getProducts = async () => {
        try {
            const response = await fetch("./javascript/data.json");
            const data = await response.json();
            console.log("Productos cargados:", data);
            displayProductos(data);
        } catch (error) {
            console.error("Error al cargar data.json:", error);
        }
    };

    verCarrito.addEventListener("click", () => {
        console.log("Haciendo clic en Ver Carrito");
        modalContainer.innerHTML = "";
        modalContainer.style.display = "flex";
        const modalHeader = document.createElement("div");
        modalHeader.className = "modalH";
        modalHeader.innerHTML = `
            <h2 class="modalTitulo">Carrito</h2>
        `;
        
        const modalButton = document.createElement("h3");
        modalButton.innerText = "x";
        modalButton.className = "modalHbutton";
        modalButton.addEventListener("click", () => {
            modalContainer.style.display = "none";
        });

        modalHeader.append(modalButton);
        modalContainer.append(modalHeader);

        carrito.forEach((product, index) => {
            let carritoContent = document.createElement("div");
            carritoContent.className = "modalContent"
            carritoContent.innerHTML = `
                <img src=${product.img}>
                <h3>${product.nombre}</h3>
                <p>${product.precio} $</p>
                <span class="eliminar" data-index="${index}">X</span>
            `;
            modalContainer.append(carritoContent);
        });

        const total = carrito.reduce((acc, el) => acc + parseFloat(el.precio), 0);

        const totalApagar = document.createElement("div");
        totalApagar.className = "totalContent";
        totalApagar.innerHTML = `Total a pagar: ${total} $`
        modalContainer.append(totalApagar);

        const finalizarCompraButton = document.createElement("button");
        finalizarCompraButton.innerText = "Finalizar Compra";
        finalizarCompraButton.id = "finalizarCompraButton";
        finalizarCompraButton.addEventListener("click", () => {
            Swal.fire({
                icon: 'success',
                title: 'Compra realizada con éxito',
                text: `Total a pagar: ${total} $`,
                confirmButtonText: 'Aceptar'
            }).then(() => {
                carrito = [];
                updateLocalStorage();
                modalContainer.style.display = "none";
            });
        });

        modalContainer.append(finalizarCompraButton);

        const eliminarBotones = document.querySelectorAll(".eliminar");
        eliminarBotones.forEach((eliminarBoton) => {
            eliminarBoton.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                if (index !== null) {
                    carrito.splice(index, 1);
                    updateLocalStorage();
                    verCarrito.click();
                }
            });
        });
    });


    function updateLocalStorage() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }


    const storedCarrito = localStorage.getItem("carrito");
    if (storedCarrito) {
        carrito = JSON.parse(storedCarrito);
    }
    getProducts();
});