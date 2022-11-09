
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const cards2 = document.getElementById('cards2');
const items2 = document.getElementById('items2');


const templatecarrito = document.getElementById('template-carrito').content
const templatecards = document.getElementById('template-card').content
const templatecards2 = document.getElementById('template-card2').content
const templatefooter = document.getElementById('template-footer').content

// genero el fragment para evitar el reflow
const fragment = document.createDocumentFragment()
// aca se almacenas los productos
let carrito = {
    materas:{

    },
    especies:{

    }
}


document.addEventListener('DOMContentLoaded',() =>{
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarcarrito()
    }
})
document.addEventListener('DOMContentLoaded', () =>{
    fecthDate()
})
// captura el evento del click de los botones
cards.addEventListener('click', e =>{
    addcarrito(e);
})
cards2.addEventListener('click', e=>{
    addcarrito(e);
})

items.addEventListener('click', e=>{
    btnaccion(e)
})



// se crea una constate para seleccionar la api o el archivo json
const fecthDate = async () =>{
    // el try catch para verificar si en la ejecucion hay un error
    try {
        const res = await fetch('productos/macetas.json')
        const data = await res.json()

        const res2 = await fetch('productos/materas.json')
        const data2 = await res2.json()
        pintarcards(data,data2)
    } catch (error) {
        console.log(error)
    }

}


const pintarcards = (data2,data) =>{

    data.forEach(producto1 => {
        templatecards.querySelector('.T1').textContent = producto1.title
        templatecards.querySelector('.P1').textContent = producto1.precio
        templatecards.querySelector('img').setAttribute('src',producto1.thumbnailUrl)
        templatecards.querySelector('.btn-dark').dataset.id= producto1.id
        const clone = templatecards.cloneNode(true)
        fragment.appendChild(clone)
        cards.appendChild(fragment)
    });

    data2.forEach(producto2 => {
        templatecards2.querySelector('.T2').textContent = producto2.title
        templatecards2.querySelector('.P2').textContent = producto2.precio
        templatecards2.querySelector('img').setAttribute('src',producto2.thumbnailUrl)
        templatecards2.querySelector('.btn-dark2').dataset.id= producto2.id
        const clone2 = templatecards2.cloneNode(true)
        fragment.appendChild(clone2)
        cards2.appendChild(fragment)

});
}

function addcarrito(e) {
    // console.log(e.target.classList.contains('btn-dark'))

    if (e.target.classList.contains('btn-dark')) {
        setcarrito(e.target.parentElement);
    }
    if (e.target.classList.contains('btn-dark2')) {
        setcarrito(e.target.parentElement);
    }
    e.stopPropagation();
}

const setcarrito = Object =>{
    // console.log(Object)

        if(Object.classList.contains('card')){
                const producto1 ={
                    id: Object.querySelector('.btn-dark').dataset.id,
                    title: Object.querySelector('.T1').textContent,
                    precio:Object.querySelector('.P1').textContent,
                    cantidad: 1
                }
                if (carrito.hasOwnProperty(producto1.id)){
                    producto1.cantidad = carrito[producto1.id].cantidad + 1
                }

                carrito[producto1.id]={...producto1}
                pintarcarrito()
            }
            if(Object.classList.contains('card2')){
                const producto2 ={
                    id: Object.querySelector('.btn-dark2').dataset.id,
                    title: Object.querySelector('.T2').textContent,
                    precio:Object.querySelector('.P2').textContent,
                    cantidad: 1
                }
                if (carrito.hasOwnProperty(producto2.id)){
                    producto2.cantidad = carrito[producto2.id].cantidad + 1
                }
                carrito[producto2.id]={...producto2}
                pintarcarrito()
    }
}


const pintarcarrito = () => {
    items.innerHTML= ''
        Object.values(carrito).forEach(producto=> {
            templatecarrito.querySelector('th').textContent = producto.id
            templatecarrito.querySelectorAll('td')[0].textContent = producto.title
            templatecarrito.querySelectorAll('td')[1].textContent = producto.cantidad
            templatecarrito.querySelector('.btn-info').dataset.id = producto.id
            templatecarrito.querySelector('.btn-danger').dataset.id = producto.id
            templatecarrito.querySelector('span').textContent = producto.cantidad * producto.precio
            const clone =templatecarrito.cloneNode(true)
            fragment.appendChild(clone)
        })
    items.appendChild(fragment)
    localStorage.setItem('carrito', JSON.stringify(carrito))
    pintarfooter()
}





const pintarfooter = () => {
    footer.innerHTML=''

    if (Object.keys(carrito).length ===0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const nprecio = Object.values(carrito).reduce((acc, { cantidad, precio}) => acc + cantidad*precio, 0);

    templatefooter.querySelectorAll('td')[0].textContent = nCantidad
    templatefooter.querySelector('span').textContent = nprecio

    const clone = templatefooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.getElementById('vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarcarrito()
    })
}

const btnaccion = e =>{

    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarcarrito()
    }
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarcarrito()
    }
}