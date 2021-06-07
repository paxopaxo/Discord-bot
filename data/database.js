const mysql = require('mysql2');

const con = mysql.createConnection({
  host: "b6nwka7ebz6awckhrnug-mysql.services.clever-cloud.com",
  user: "uzstvrtg7yh6kn2n",
  password: "FG4IkDIT38JBVCnb6Uzk",
  database: 'b6nwka7ebz6awckhrnug'
})

const connectDB = () => {
    return new Promise( (resolve, reject) => {
        con.connect( (err) => {
            if (err) throw reject(err);
            else resolve()
        })
    })
}
const queryDB = (query) => {
    return new Promise( (resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) reject(err);
            else {
                const resultArray = Object.values(JSON.parse(JSON.stringify(result)))
                resolve(resultArray)
            }
          })
    })
}
const insertNewDB = (obj) => {
    return new Promise( (resolve, reject) => {
        // const obj = { usuario: 'pixulitax#3182', tiempoTranscurrido: 90 }
        const query = con.query('INSERT INTO usuarios SET ?', obj, (error, results, fields) => {
            if (error) reject(error)
            else resolve(results)           
        })
    })
}
const updateDB = (usuario, tiempoTranscurrido ) => {
    return new Promise( (resolve, reject) => {
        const query = con.query('UPDATE usuarios SET tiempoTranscurrido = ? WHERE usuario = ?', [tiempoTranscurrido, usuario], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}



module.exports = {
    connectDB,
    queryDB,
    insertNewDB,
    updateDB
}