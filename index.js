import path from 'path'
import { URL } from 'url'; // in Browser, the URL in native accessible on window
import { readFileSync } from 'fs';
//importacion desde node
import { writeFile, readFile } from "node:fs/promises";

const __filename = new URL('', import.meta.url).pathname;
// Will contain trailing slash
const __dirname = new URL('.', import.meta.url).pathname;

console.log("filename :", __filename)
console.log("dirname : ", __dirname)
console.log("ruta sin path.join: ", __dirname + "/public/index.html")

const ruta = path.join(__dirname + "/public/index.html")

console.log("Ruta con path.join: ", ruta)


// importar express e instanciarlo en variable app
import express from "express";
const app = express();

//Para el servicio de archivos estáticos en una carpeta definida
app.use(express.static('public'));

// activacion de middleware para enviar informacion al servidor
app.use(express.json());

// defino constante con 2 posibles valores si hay un .env y valor en PORT o sino el valor 4000
const PORT = process.env.PORT || 3000;

// levantamos el servidor
app.listen(PORT, () => {
    console.log(`Server en puerto: http://localhost:${PORT}`);
});


// CRUD aplicado al arreglo
// ejecutando el metodo get en la ruta raiz /, que devolvera un archivo estatico index.html
app.get("/", (req, res) => {
    console.log(ruta)
    res.sendFile(ruta);
})

// ruta consumida desde el frontend 
app.get("/canciones", (req, res) => {
    const canciones = JSON.parse(readFileSync("mirepertorio.json"))
    res.json(canciones)
})

// metodo get en ruta /todos/id para mostrar un registro u objeto por su id
app.get("/canciones/:id", async (req, res) => {
    const id = req.params.id; // capturamos el parametro de la ruta

    const fsResponse = await readFile("mirepertorio.json", "utf-8");
    const todos = JSON.parse(fsResponse);
    // buscas el id en el array todos
    const todo = todos.find((todo) => todo.id == id);
    console.log("Valor de todo al buscar: ", todo)

    // condicional para definir que hacer si esta y que si no esta
    if (!todo) res.status(404).json({ message: "Todo with ID not found" });  res.json(todo);
});


// metodo post en ruta /todos, con funcion asincrona, probar desde TC o Postman
app.post("/canciones", async (req, res) => {
    const { titulo, artista, tono } = req.body; // extraemos del body del request

    // nuevo objeto para el array 
    const newTodo = {
        id: nanoid(),  //generar valor aleatorio
        titulo,
        artista,
        tono,
    };

    const fsResponse = await readFile("mirepertorio.json", "utf-8"); //lee el archivo
    const todos = JSON.parse(fsResponse); // transforma en  array de objetos Json
    todos.push(newTodo); // agegar el nuevo objeto al array

    await writeFile("mirepertorio.json", JSON.stringify(todos)); //graba nuevo contenido para el archivo, con valor agregado
    res.status(201).json({ ok: true, msg: "Todo created", todo: newTodo }); //respuesta servidor
});

// metodo put/patch en la ruta /todos/:id que permite ubicar un producto y actualizarlo
app.put("/canciones/:id", async (req, res) => {
    // capturamos el params y el body, de la peticion request
    const { id } = req.params;
    console.log(id);
    const { titulo, artista,tono } = req.body;
    console.log({ titulo, artista,tono });


    if (!titulo || !artista   || !tono)
        return res
            .status(400)
            .json({ ok: false, msg: "Titulo, artista y tono are required" });
        
    const fsResponse = await readFile("mirepertorio.json", "utf-8");
    const todos = JSON.parse(fsResponse);
    
    const newTodos = todos.map((todo) => {
        if (todo.id === id) {
            return {
                ...todo,
                title,
                description,
            };
        }
        return todo;
    });

    console.log(newTodos);
    await writeFile("mirepertorio.json", JSON.stringify(newTodos));
    res.status(200).json({ ok: true, msg: "Todo updated" });
});

// METODO DELETE en ruta todos/id para eliminar un objeto en especifico del array
app.delete("/canciones/:id", async (req, res) => {
    const { id } = req.params;
    const fsResponse = await readFile("mirepertorio.json", "utf-8");
    const todos = JSON.parse(fsResponse);
    const newTodos = todos.filter((todo) => todo.id !== id); // obtiene todos menos uno a eliminar  si cumple
    await writeFile("mirepertorio.json", JSON.stringify(newTodos));
    res.status(200).json({ ok: true, msg: "Todo deleted" });
});

