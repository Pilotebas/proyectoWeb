import { getAll } from "../modules/modules.js";

class MyCardConten extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <section class="item">
                <div class="imagen"><img src="" alt=""></div>
                <div class="item_contenido">
                    <div class="name">
                        <h1>Nombre</h1>
                        <h2></h2>
                    </div>
                    <div class="cantidad">
                        <h1>Cantidad</h1>
                        <h1></h1>
                    </div>
                    <div class="precio">
                        <h1>Precio</h1>
                        <h1></h1>
                    </div>
                    <div class="subtotal">
                        <h2>Subtotal</h2>
                        <h2>$</h2>
                    </div>
                    <div class="eliminar">
                        <i class='bx bx-trash' data-id=""></i>
                    </div>
                </div>
            </section>
        `;
    }

    connectedCallback() {
        const nombre = this.getAttribute("nombre");
        const imagen = this.getAttribute("imagen");
        const precio = this.getAttribute("precio");
        const id = this.getAttribute("id");

        this.shadowRoot.querySelector(".name h2").textContent = nombre;
        this.shadowRoot.querySelector(".imagen img").src = imagen;
        this.shadowRoot.querySelector(".precio h1:nth-of-type(2)").textContent = `$${precio}`;
        this.shadowRoot.querySelector(".cantidad h1:nth-of-type(2)").textContent = id;
        this.shadowRoot.querySelector(".eliminar i").setAttribute("data-id", id);

        this.shadowRoot.querySelector(".eliminar i").addEventListener("click", () => {
            this.removeItemFromList(id);
            this.remove();
            // Llama a la función para volver a renderizar los componentes del carrito
            document.getElementById("carritoContainer").click();
        });
    }

    removeItemFromList(id) {
        let ids = localStorage.getItem("idProduct");
        ids = ids ? ids.split(", ") : [];
        const index = ids.indexOf(id);
        if (index > -1) {
            ids.splice(index, 1);
            localStorage.setItem("idProduct", ids.join(", "));
            console.log(`Item with ID ${id} removed. Updated valuesList:`, ids);
        }
    }
}

customElements.define("carrito-contenido", MyCardConten);

document.addEventListener("DOMContentLoaded", async () => {
    let container = document.getElementById("contenido");

    const string = localStorage.getItem("idProduct");
    const valores = string ? string.split(", ") : [];

    function agregarComponentesCarrito(json) {
        container.innerHTML = "";
        json.forEach((item) => {
            if (valores.includes(item.id.toString())) {
                const myCardConten = document.createElement("carrito-contenido");
                myCardConten.setAttribute("nombre", item.nombre);
                myCardConten.setAttribute("imagen", item.imagen);
                myCardConten.setAttribute("precio", item.precio);
                myCardConten.setAttribute("id", item.id);

                container.appendChild(myCardConten);
            }
        });
    }

    document.getElementById("carritoContainer").addEventListener("click", async () => {
        let jsonOpcion4 = await getAll();
        agregarComponentesCarrito(jsonOpcion4);
    });

    // Cargar componentes del carrito al cargar la página
    let jsonOpcion4 = await getAll();
    agregarComponentesCarrito(jsonOpcion4);
});
