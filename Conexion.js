const config = require('./Config')
const oracledb = require('oracledb')
oracledb.initOracleClient({ libDir: `${config.ORACLE_CLIENT}` })
var password = `${config.PASSWORD}`

abrirConexion = async () => {

    try {
        const connection = await oracledb.getConnection({
            user: "BD181",
            password: password,
            connectString: "localhost:1521/xe"
        });
        console.log('Conectado a la base');
        return connection;
    } catch (err) {
        console.error(err.message);
    }


}

cerrarConexion = async (connection) => {
    if (connection) {
        try {
            // Always close connections
            await connection.close();
            console.log('Se ha cerrado la conexión');
        } catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = {
    abrirConexion,
    cerrarConexion
}