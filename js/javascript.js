class Producto{
    constructor(id, nombre, precio, img){
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.img = img
        this.cantidad = 0
    }
}
class Productocontroller{
    constructor(carrito){
        this.catalogo = []
        this.carrito = carrito
    }
    agregarproducto(producto){
        this.catalogo.push(producto)
    }
    mostrarcatalogo(){
        let producto_controller = document.getElementById("producto-controller")
        this.catalogo.forEach( producto =>{
            producto_controller.innerHTML+= 
            `<div id="pc-elemento" class="elemento">
            <p>${producto.nombre}</p>
            <div class="imgcontainer">
                <img id="pc-img" src="${producto.img}" alt="">
            </div>
            <p>$${producto.precio}</p>
            <button type="button" id="añadirproducto-${producto.id}" class="btn btn-primary btn-añadir">AÑADIR A TU COMPRA</button>
        </div> `
        })
        //seteo el evento al clikear añadir carrito
        this.catalogo.forEach(producto => {
            let agregar_carrito = document.getElementById(`añadirproducto-${producto.id}`)
            agregar_carrito.addEventListener("click", () =>{
                this.carrito.agregaralcarrito(producto)
                this.carrito.mostrarproductos()
            })
        })   
    }


}
class Carrito{
    constructor(){
        this.listacarrito = []
        this.total_compra = 0
        this.compraFinalizada = false;
    }
    agregaralcarrito(producto) {
        if (!this.compraFinalizada) {
            let productoExistente = this.listacarrito.find((p) => p.id === producto.id);
            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                producto.cantidad += 1
                this.listacarrito.push(producto);
            }
            let suma_carrito = document.getElementById("suma-carrito")
            suma_carrito.innerHTML++
            localStorage.setItem("suma_carrito", suma_carrito.innerHTML )
            this.guardarenstorage()
            this.actualizarTotalCompra();    
        }   
    }  
    guardarenstorage(){
        let guardado_storage = JSON.stringify(this.listacarrito)
        localStorage.setItem("guardado_storage", guardado_storage)
    }
    levantardestorage(){
        let levantado_storage = localStorage.getItem("guardado_storage")
        this.listacarrito = JSON.parse(levantado_storage)
        this.mostrarproductos()
        this.actualizarTotalCompra()
    }
    levantar_sumacarrito_storage(){
        let suma_carrito = document.getElementById("suma-carrito")
        suma_carrito.innerHTML = localStorage.getItem("suma_carrito", suma_carrito.innerHTML )
    }
    actualizarTotalCompra() {
        this.total_compra = 0;
        this.sumaiva = 0;
        this.listacarrito.forEach((producto) => {
           this.total_compra += producto.cantidad * producto.precio;
        });
        this.sumaiva = this.total_compra * 21 / 100
        this.total_compra = this.total_compra + this.sumaiva
        let mostrar_total = document.getElementById("total-compra");
        mostrar_total.innerHTML = "$" + this.total_compra;
    }
    mostrarproductos(){
        if (!this.compraFinalizada){
            let productos_carrito = document.getElementById("productos_carrito")
            productos_carrito.innerHTML = ""
            this.listacarrito.forEach( producto =>{
                productos_carrito.innerHTML += ` 
                <article class="card-producto" id="card-producto-${producto.id}">
                    <div class="card-section">
                        <p class="p-card1">Producto:</p>
                        <div  class="imgcard">
                            <img src="${producto.img}" alt="">
                        </div>
                    </div>
                    <div class="card-section">
                        <p class="p-card1">Nombre:</p>
                        <p class="p-card2">${producto.nombre}</p>
                    </div>
                    <div class="card-section">
                        <p class="p-card1">Precio:</p>
                        <p class="p-card2">$${producto.precio}</p>
                    </div>
                    <div class="card-section">
                        <p class="p-card1">Cantidad:</p>
                        <div class="sumar-restar-cantidad">
                            <button id="btn-restar-${producto.id}" class="rest-sum"><i class="fa-solid fa-minus"></i></button>
                            <p id="p-cantidad-${producto.id}" class="p-card2"></p>
                            <button id="btn-sumar-${producto.id}" class="rest-sum"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <!-- deletebottom -->
                    <button id="btn-eliminar-${producto.id}" type="button" class="btn btn-primary delete"><i class="fa-solid fa-trash"></i></button>
                </article> 
                `
            })
    
            this.listacarrito.forEach(producto => {
                //eliminar
                let btn_eliminar = document.getElementById(`btn-eliminar-${producto.id}`)
                btn_eliminar.addEventListener("click", () =>{
                    this.eliminarproducto(producto)
                    this.mostrarproductos()
                })
                //sumar-restar
                let cantidad_producto = document.getElementById(`p-cantidad-${producto.id}`);
                cantidad_producto.innerHTML = producto.cantidad;
                let btn_sumar = document.getElementById(`btn-sumar-${producto.id}`);
                let btn_restar = document.getElementById(`btn-restar-${producto.id}`);
                
                btn_sumar.addEventListener("click", () => {
                    producto.cantidad += 1;
                    cantidad_producto.innerHTML = producto.cantidad;
                    let suma_carrito = document.getElementById("suma-carrito")
                    suma_carrito.innerHTML++
                    localStorage.setItem("suma_carrito", suma_carrito.innerHTML )
                    this.guardarenstorage()
                    this.actualizarTotalCompra();
                });
    
                btn_restar.addEventListener("click", () => {
                    let suma_carrito = document.getElementById("suma-carrito")
                    if (producto.cantidad > 1) {
                        producto.cantidad -= 1;
                        cantidad_producto.innerHTML = producto.cantidad;
                        suma_carrito.innerHTML--
                    }
                    localStorage.setItem("suma_carrito", suma_carrito.innerHTML )
                    this.guardarenstorage()
                    this.actualizarTotalCompra();
                });    
            }) 
        }      
    }  
    eliminarproducto(productoeliminar) {
        let product_obt = this.listacarrito.find((el) => el.id === productoeliminar.id)
        let index = this.listacarrito.indexOf(product_obt)
        let suma_previa = 0
        let suma_carrito = document.getElementById("suma-carrito")
        if(product_obt){
            suma_previa = productoeliminar.cantidad
            productoeliminar.cantidad = 0
            this.listacarrito.splice(index, 1)
            suma_carrito.innerHTML= suma_carrito.innerHTML - suma_previa
        }
        localStorage.setItem("suma_carrito", suma_carrito.innerHTML )

        this.guardarenstorage()
        this.actualizarTotalCompra();
    }
    finalizarcompra_muestraprevia(){
            this.compraFinalizada = true;
            let productos_carrito = document.getElementById("productos_carrito")
            productos_carrito.innerHTML = ""
            this.listacarrito.forEach((producto)=>{
            productos_carrito.innerHTML+=
            ` 
            <article class="card-producto-finalizar-compra " id="card-producto-${producto.id}">
                <div class="card-section">
                    <div class="section-p">
                        <p class="p-card1">Producto: ${producto.nombre}</p>
                    </div>
                    <div class="section-p">
                        <p class="p-card1">Cantidad: ${producto.cantidad}</p>
                    </div>
                    <div class="section-p">
                        <p class="p-card1">Precio: ${producto.precio*producto.cantidad}</p>
                    </div>
                    <div class="section-p">
                        <p class="p-card1">(+iva): ${producto.precio*producto.cantidad*(21/100)}</p>
                    </div>
                    <div class="section-p">
                        <p class="p-card1">Total: ${producto.precio*producto.cantidad*(21/100)+producto.precio*producto.cantidad}</p>
                    </div>  
                </div>
            </article>
            `
            })
        

        

    }
    compracancelada(){
        this.compraFinalizada = false;
    }

    finalizarcompra(){
        
        this.listacarrito.forEach((producto) => {
            producto.cantidad = 0; // Restablecer la cantidad de cada producto a 0
        });
        this.listacarrito =[]
        this.mostrarproductos()
        this.compraFinalizada = false;
        localStorage.removeItem("guardado_storage")
        localStorage.removeItem("suma_carrito")
        let productos_carrito = document.getElementById("productos_carrito")
        productos_carrito.innerHTML = ""
        let suma_carrito = document.getElementById("suma-carrito")
        suma_carrito.innerHTML = " "
    }
    

}

//instanciamos el carrito (unica vez)
const Carritodecompras = new Carrito()
//instanciamos producto controler (unica vez)
const ProductoController = new Productocontroller(Carritodecompras)
//creamos productos
const producto1 = new Producto(1,"Set de mancuernas", 1500, "./img/producto1.png" )
const producto2 = new Producto(2,"Barra de dominadas", 2000, "./img/producto2.png" )
const producto3 = new Producto(3,"Botines spoty gym", 2500, "./img/producto1.png" )
const producto4 = new Producto(4,"Botellas x1-m2", 3000, "./img/producto1.png" )
const producto5 = new Producto(5,"Set Pesas 5kg", 3500, "./img/producto1.png" )
const producto6 = new Producto(6,"Guantes de boxeo fg-1", 4000, "./img/producto1.png" )
const producto7 = new Producto(7,"Cuerda 2 pulgadas", 4500, "./img/producto1.png" )
const producto8 = new Producto(8,"Cabezal boxing", 5000, "./img/producto1.png" )
//agregamos losproductos al producto controler
ProductoController.agregarproducto(producto1)
ProductoController.agregarproducto(producto2)
ProductoController.agregarproducto(producto3)
ProductoController.agregarproducto(producto4)
ProductoController.agregarproducto(producto5)
ProductoController.agregarproducto(producto6)
ProductoController.agregarproducto(producto7)
ProductoController.agregarproducto(producto8)
//agrego productos al catalogo (render)
ProductoController.mostrarcatalogo()


document.addEventListener("DOMContentLoaded",  () => {
    // Verifica si hay datos en el almacenamiento local antes de intentar levantarlos
    if (localStorage.getItem("guardado_storage")) {
        Carritodecompras.levantardestorage();
    }
    // Verifica si hay datos de suma de carrito en el almacenamiento local antes de intentar levantarlos
    if (localStorage.getItem("suma_carrito")) {
        Carritodecompras.levantar_sumacarrito_storage();
    }
});

//aca estoy añadiendo eventos a los botones cancelar, y continuar, haciendo que continuar
//se convierta en finalizar, y que al cancelar, se vuelvan a mostrar la lista de carrito y se restaure el continuar otra ves
const btn_continuar = document.getElementById("btn-continuar");
let primerevento = true;
let segundoevento = false;
btn_continuar.addEventListener("click", () => {
    if (primerevento && !segundoevento && Carritodecompras.listacarrito.length > 0) { // si estoy en el primer evento y si es verdadero que segundoevento es falso
        console.log("presionado1");//dejo los console loge para que sea facil estudiar y entender que pasa , por si me olvido
        btn_continuar.innerHTML = "Finalizar"; //convierto el boton en finalizar
        btn_continuar.removeEventListener("click", primerclickevento); //remuevo este evento del boton
        primerevento = false; //cambio los buleanos para estar en el segundo click
        segundoevento = true;
        btn_continuar.addEventListener("click", segundoclickevento); //le agrego el segundo click
        Carritodecompras.finalizarcompra_muestraprevia();
    }
});
//primer click en funcion aparte porque al estar queriendo darle un nuevo evento dentro de otro evento,
// llamo a esta funcion que replica todo el primer evento y me lo toma para eliminarlo
function primerclickevento(event) {
    if (primerevento && !segundoevento && Carritodecompras.listacarrito.length > 0){
        console.log("presionado1");
        btn_continuar.innerHTML = "Finalizar";
        btn_continuar.removeEventListener("click", primerclickevento);
        primerevento = false;
        segundoevento = true;
        btn_continuar.addEventListener("click", segundoclickevento);
        Carritodecompras.finalizarcompra_muestraprevia();
    } 
}
//aca es lo que va a hacer el boton convertido en finalizar. Podria ser un mensaje de confiarmacion
function segundoclickevento(event) {
    console.log("presionado2")
    primerevento = true;
    segundoevento = false;
    btn_continuar.removeEventListener("click", segundoclickevento); 
    btn_continuar.addEventListener("click", primerclickevento);
    btn_continuar.innerHTML = "Continuar";
    Carritodecompras.finalizarcompra()
}
//al presionar cancelar, tengo que reconvertir el finalizar en continar, volviendo las variables buleanas a su estado de "primer click"
// y ademas eliminando elsegundo evento que agregue cuando se convirtio en finalizar previamente 
const btn_cancelarcompra = document.getElementById("btn-cancelar");
btn_cancelarcompra.addEventListener("click", ()=>{
    console.log("compra cancelada")
    btn_continuar.removeEventListener("click", segundoclickevento); //al presionar 
    Carritodecompras.compracancelada() //cambio la variable que me bloqeua la posibilidad de seguir agregando y mostrando carrito
    //cuaando estoy en vista "finalizar compra" para poder agregar y mostrar nuevamente
    Carritodecompras.mostrarproductos()
    primerevento = true;
    segundoevento = false;
    btn_continuar.innerHTML = "Continuar";
})
