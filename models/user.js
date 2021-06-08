const fs = require('fs')
const path = require('path')
const { connectDB, queryDB, insertNewDB, updateDB } = require('../data/database')

class UsuariosManegment {
    constructor() {
        this.inicio = [] // [{ usuario, countInit } ...]
        this.final = [] // [ { usuario, tiempoTranscurrido }, ... ]
        
        this.readDB()
    }

    get diasHorasMinutos() {
        const arr = [ ...this.final ]
        arr.sort( (a ,b) => {
            if(a.tiempoTranscurrido > b.tiempoTranscurrido) return -1;
            if(a.tiempoTranscurrido < b.tiempoTranscurrido) return 1;
            return 0;
        })
        const arrFinal = arr.map( obj => {
            const tiempoEnMinutos = obj.tiempoTranscurrido
            const usuario = obj.usuario
            return {usuario , tiempoTranscurrido: `${Math.trunc( tiempoEnMinutos / 1440 )}d ${Math.trunc( (tiempoEnMinutos % 1440) / 60 )}h ${(tiempoEnMinutos % 1440) % 60}min`}
        })
        return arrFinal
    }
    get minutos() {
        return [ ...this.final ]
    }
    
    getRegistroPorTagNUM(id) {
        const arrDiasHorasMinutos = this.minutos
        const usuarioSolicitado = arrDiasHorasMinutos.find( obj => obj.usuario === id )
    
        return usuarioSolicitado
    }

    getRegistroPorTag(id) {
        const arrDiasHorasMinutos = this.diasHorasMinutos 
        const usuarioSolicitado = arrDiasHorasMinutos.find( obj => obj.usuario === id )
    
        return usuarioSolicitado
    }
    
    
    async readDB() {
        await connectDB()
        const users = await queryDB('SELECT * FROM usuarios ORDER BY tiempoTranscurrido DESC')
        this.final = users
    }

    iniciar(id) {
        const date = new Date()
        const countInit = date.getTime()
        this.inicio.push( { usuario: id, countInit } )
    }

    async finalizar(id) {
        const date = new Date()
        const countEnd = date.getTime()

        const indiceInicio = this.inicio.findIndex( obj => obj.usuario === id)
        if ( indiceInicio === -1 ) {
            throw 'Has llamado a finalizar y el tiempo no ha empezado a transcurrir'
        }
        // Le sumo porque el índice 0 evalua false

        const { countInit } = this.inicio[indiceInicio]
        const tiempoMs = countEnd - countInit
        const tiempoMin = Math.trunc( (tiempoMs / 1000 ) / 60)

        console.log('Tiempo transcurrido en min:\n', tiempoMin )

        const indiceFinal = this.final.findIndex(obj => obj.usuario === id)
        if ( indiceFinal === -1 ) {
            this.final.push( { usuario: id, tiempoTranscurrido: tiempoMin})
            // Saving on database
            await insertNewDB(id, tiempoMin )

        } else {
            this.final[indiceFinal].tiempoTranscurrido += tiempoMin
            // Saving on database
            await updateDB(id, this.final[indiceFinal].tiempoTranscurrido )
        }

        this.inicio.splice(indiceInicio, 1)
    }
}

module.exports = UsuariosManegment