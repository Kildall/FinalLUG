
import express from 'express' //Libreria de express (El servidor)
import dotenv from 'dotenv' //Libreria de .env (Obtiene las variables de entorno)
import mongoose from 'mongoose' //Libreria de Mongoose (Base de datos)

import apiRouter from './routes' //La unica ruta de nuestra api (Por convencion)

const app = express() //Iniciamos el server

//Le decimos al server que transforme los bodys (Que se mandan en JSON) de los request en objetos
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true}))

dotenv.config();

app.use('/api', apiRouter) //Cargamos la unica ruta de nuestra api

//Abrimos el servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en el puerto ${process.env.PORT}`)
}) 

//Conectamos a la Base de Datos
ConectarDB().then(() => { //Then se ejecuta cuando no arroja error la funcion
    console.log('Se ha conectado a la base de datos.')
}).catch(()=>{ //Catch se ejecuta cuando la funcion arroja un error
    console.log('Ha ocurrido un error conectandose a la base de datos.')
})


async function ConectarDB() { //Funcion asincronica porque es una conexion a una base de datos
    if(process.env.MONGOOSE_CONNECTION_STRING){ //Checkeamos si el string de conexion existe
        mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING) //Nos conectamos a la base de datos (Puede arrojar error como por ejemplo si no tenemos internet.)
    } else {
        console.log('Mongoose Connection String faltante.') //Mandamos el mensaje que no existe el connection string.
        throw new Error()
    }
}
