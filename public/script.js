const tbody = document.querySelector("tbody")

const getProducts = async () => {
    alert("entro en getProducts para conexion a Backend")
    const res = await fetch("/canciones") //conectando a una ruta del backend
    const productos = await res.json()
    return productos
}

const fillTableWithProducts = async () => {
    const productos = await getProducts()
    tbody.innerHTML = ""
    productos.forEach(product => {
        tbody.innerHTML += `
                <tr>
                    <th>${product.id}</th>
                    <td>${product.titulo}</td>
                    <td>${product.artista}</td>
                    <td>${product.tono}</td>

                </tr >
                `
    })
}

 fillTableWithProducts()