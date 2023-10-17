const config = require('./Config')
const express = require('express')
const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
const cors = require('cors')
app.use(cors())
//app.use(express.static('build'))
const db = require("./Conexion")

//obterner personas (todos)
app.get('/api/personas', async (req, res) => {
    let result;
    try {
        connection = await db.abrirConexion()
        result = await connection.execute(`SELECT * FROM persona`)
    } catch (err) {
        return res.send(err.message);
    } finally {
        await db.cerrarConexion(connection)
        if (result.rows.length == 0) {
            return res.send('no hay respuesta')
        } else {
            return res.send(result.rows)
        }
    }
})

//insertar personas
app.post('/api/personas', async (req, res, next) => {
    const body = req.body; //trae el cuerpo de la petición
    if (!body.nombre || !body.apellido || !body.tipoDoc || !body.nDoc || !body.direccion || !body.correo || !body.celular) { //compueba si alguno de los campos de la petición estan vacios
        console.log(body)
        return res.status(400).json({
            error: 'información faltante'
        })
    }

    let result;
    try {
        connection = await db.abrirConexion()
        result = await connection.execute(`insert into persona values ('${body.tipoDoc}','${body.nDoc}','${body.nombre}','${body.apellido}','${body.direccion}','${body.correo}','${body.celular}')`)
        await connection.execute(`commit`)
    } catch (err) {
        if (err.message.includes('ORA-00001')) {
            console.log('Entrada duplicada, el registro ya existe.')
        }
    } finally {
        await db.cerrarConexion(connection)
        if (!result) {
            return res.status(409).send("La persona ya existe")
        }
        res.status(201).send("Persona creada correctamente")
    }
})

//obterner persona (uno solo)
app.get('/api/personas/:tipoDoc/:nDoc', async (req, res) => {
    let result;
    try {
        connection = await db.abrirConexion()
        result = await connection.execute(`SELECT * FROM persona WHERE IdTipoDoc = '${req.params.tipoDoc}' AND nDocumento = '${req.params.nDoc}'`)
    } catch (err) {
        return res.send(err.message);
    } finally {
        await db.cerrarConexion(connection)
        if (result.rows.length == 0) {
            return res.send('no hay respuesta')
        } else {
            return res.send(result.rows)
        }
    }
})

//Actualizar persona (solo uno)
app.put('/api/personas/:tipoDoc/:nDoc', async (req, res) => {
    const body = req.body; //trae el cuerpo de la petición
    if (!body.nombre || !body.apellido || !body.direccion || !body.correo || !body.celular) { //compueba si alguno de los campos de la petición estan vacios
        return res.status(400).json({
            error: 'información faltante'
        })
    }
    let result;
    try {
        connection = await db.abrirConexion()
        result = await connection.execute(`UPDATE persona SET nombre = '${body.nombre}' , apellido = '${body.apellido}' , direccion = '${body.direccion}' , correo = '${body.correo}' , celular = '${body.celular}' WHERE IdTipoDoc = '${req.params.tipoDoc}' AND nDocumento = '${req.params.nDoc}'`)
        await connection.execute(`commit`)
    } catch (err) {
        console.log(err)
    } finally {
        await db.cerrarConexion(connection)
        //en caso de que se pierda la conexión
        if(!result){
            return res.status(500).send("no se pudo realizar la petición")
        }
        //en caso de que no se haya encontrado a la persona
        if (result.rowsAffected == 0) {
            return res.status(404).send("no se ha encontrado la persona para actualizar")
        }
        //todo se ha realizado perfectamente
        res.status(200).send("Persona actualizada correctamente")
    }
})

//trare tipos de documento 
app.get('/api/tipodoc', async (req, res) => {
    let result;
    try {
        connection = await db.abrirConexion()
        result = await connection.execute(`SELECT * FROM tipoDoc`)
    } catch (err) {
        return res.send(err.message);
    } finally {
        await db.cerrarConexion(connection)
        if (result.rows.length == 0) {
            return res.send('no hay respuesta')
        } else {
            return res.send(result.rows)
        }
    }
})

app.listen(config.PORT, () => console.log("nodeOracleRestApi app listening on port %s!", config.PORT))