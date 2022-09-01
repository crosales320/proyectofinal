class Pelicula {
    constructor(pelicula, cantidad) {
        this.id = pelicula.id;
        this.nombre = pelicula.nombre;
        this.precio = pelicula.precio;
        this.cantidad = cantidad;
        this.precioTotal = pelicula.precio;
    }


    agregarUnidadAlaDisponibilidad() {
        return this.cantidad++;
    }

    quitarCantidadDeDisponibilidad() {
        return (this.cantidad -= 1);
    }

    actualizarPrecioTotal() {
        return (this.precioTotal = this.precio * this.cantidad);
    }
}

const peliculas = [
    {
        id: 0,
        nombre: "Thor",
        descripcion: "Ciencia Ficcion - Horario: 21:00hs",
        precio: 700,
        img: "./img/Thor_Love_and_Thunder.jpg",

    },
    {
        id: 1,
        nombre: "3D Minions",
        descripcion: "Dibujos Animados - Horario: 17:00hs",
        precio: 800,
        img: "./img/minions.jpg",

    },
    {
        id: 2,
        nombre: "Elvis",
        descripcion: "Drama Biografica - Horario: 22:00hs",
        precio: 700,
        img: "./img/Elvis.jpg",

    },
    {
        id: 3,
        nombre: "Jurassic World",
        descripcion: "Ciencia Ficcion - Horario: 14:00hs ",
        precio: 850,
        img: "./img/Jurassic_World_Dominion.jpg",

    },
];


let carrito;

function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));

    if (contenidoEnStorage) {

        let array = [];

        for (const objeto of contenidoEnStorage) {

            let pelicula = new Pelicula(objeto, objeto.cantidad);
            pelicula.actualizarPrecioTotal();

            array.push(pelicula);
        }

        imprimirTabla(array);

        return array;
    }

    return [];
}

function imprimirProductosEnHTML(array) {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    for (const pelicula of array) {

        let card = document.createElement("div");

        card.innerHTML = `
        <div class="card text-center" style="width: 18rem;">
            <div class="card-body">
                <img src="${pelicula.img}" id="" class="card-img-top img-fluid" alt="">
                <h2 class="card-title">${pelicula.nombre}</h2>
                <h5 class="card-subtitle mb-2 text-muted">${pelicula.descripcion}</h5>
                <p class="card-text">$${pelicula.precio}</p>

                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button id="agregar${pelicula.id}" type="button" class="btn btn-dark"> Agregar </button>
                </div>
            </div>
        </div>      
        `;

        contenedor.appendChild(card);

        let boton = document.getElementById(`agregar${pelicula.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(pelicula.id));
    }
}

function agregarAlCarrito(idProducto) {

    let peliculaEnCarrito = carrito.find((elemento) => elemento.id === idProducto);

    if (peliculaEnCarrito) {

        let index = carrito.findIndex((elemento) => elemento.id === peliculaEnCarrito.id);

        carrito[index].agregarUnidadAlaDisponibilidad();
        carrito[index].actualizarPrecioTotal();
    } else {

        carrito.push(new Pelicula(peliculas[idProducto], 1));
    }

    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}


function eliminarDelCarrito(id) {

    let pelicula = carrito.find((pelicula) => pelicula.id === id);

    let index = carrito.findIndex((element) => element.id === pelicula.id);

    if (pelicula.cantidad > 1) {

        carrito[index].quitarCantidadDeDisponibilidad();
        carrito[index].actualizarPrecioTotal();
    } else {

        carrito.splice(index, 1);
    }

    swal("Producto eliminado con éxito", "", "success");

    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarCarrito() {
    carrito = [];
    localStorage.removeItem("carritoEnStorage");

    document.getElementById("carrito").innerHTML = "";
    document.getElementById("acciones-carrito").innerHTML = "";
}

function obtenerPrecioTotal(array) {
    return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

function imprimirTabla(array) {
    let precioTotal = obtenerPrecioTotal(array);
    let contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    let tabla = document.createElement("div");

    tabla.innerHTML = `
        <table id="tablaCarrito" class="table table-striped">
            <thead>         
                <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Accion</th>
                </tr>
            </thead>

            <tbody id="bodyTabla">
            </tbody>
        </table>
    `;

    contenedor.appendChild(tabla);

    let bodyTabla = document.getElementById("bodyTabla");

    for (let pelicula of array) {
        let datos = document.createElement("tr");
        datos.innerHTML = `
                <td>${pelicula.nombre}</td>
                <td>${pelicula.cantidad}</td>
                <td>$${pelicula.precioTotal}</td>
                <td><button id="eliminar${pelicula.id}" class="btn btn-dark">Eliminar</button></td>
    `;

        bodyTabla.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${pelicula.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(pelicula.id));
    }

    let accionesCarrito = document.getElementById("acciones-carrito");
    accionesCarrito.innerHTML = `
		<h5>PrecioTotal: $${precioTotal}</h5></br>
		<button id="finalizarCompra" onclick="eliminarCarrito()" class="btn btn-dark">Finalizar Compra</button>`;
}
    


    function filtrarBusqueda(e) {
        e.preventDefault();

        let ingreso = document.getElementById("busqueda").value.toLowerCase();
        let arrayFiltrado = peliculas.filter((elemento) => elemento.nombre.toLowerCase().includes(ingreso));

        imprimirProductosEnHTML(arrayFiltrado);
    }

    let btnFiltrar = document.getElementById("btnFiltrar");
    btnFiltrar.addEventListener("click", filtrarBusqueda);

    imprimirProductosEnHTML(peliculas);

    carrito = chequearCarritoEnStorage();

    //DarMode
    let botonDarkMode = document.getElementById("darkMode");
    botonDarkMode.addEventListener("click", cambiarTema);

    function cambiarTema() {
        document.body.classList.toggle("darkMode");
    }


