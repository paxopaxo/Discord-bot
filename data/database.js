const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "b6nwka7ebz6awckhrnug-mysql.services.clever-cloud.com",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

const connectDB = () => {
    return new Promise( (resolve, reject) => {
        con.getConnection( (err) => {
            if (err) throw reject(err);
            else resolve()
        })
    })
}

const queryDB = (query) => {
    return new Promise( (resolve, reject) => {
        pool.getConnection( (err, con) => {
            if (err) reject(err)
            con.query(query, (err, result) => {
                con.release()

                if (err) reject(err)
                else {
                    const resultArray = Object.values(JSON.parse(JSON.stringify(result)))
                    resolve(resultArray)
                }
            })
        })
    })
}
const insertNewDB = (obj) => {
    return new Promise( (resolve, reject) => {
        pool.getConnection( (err, con) => {
            if(err) reject(err)
            // const obj = { usuario: 'pixulitax#3182', tiempoTranscurrido: 90 }
            con.query('INSERT INTO usuarios SET ?', obj, (error, results, fields) => {
                con.release()
                if (error) reject(error)
                else resolve(results)
            })
        })
    })
}
const updateDB = (usuario, tiempoTranscurrido ) => {
    return new Promise( (resolve, reject) => {
        pool.getConnection( (err, con) => {
            if(err) reject(err)

            con.query('UPDATE usuarios SET tiempoTranscurrido = ? WHERE usuario = ?', [tiempoTranscurrido, usuario], (error, result, fields) => {
                con.release()
                if (error) reject(error)
                else resolve(result)
            })
        })
    })
}



module.exports = {
    connectDB,
    queryDB,
    insertNewDB,
    updateDB
}