const fs = require('fs')
const path = require('path')

class UsuariosManegment {
    constructor() {
        this.inicio = [] // [{ usuario, countInit } ...]
        this.final = [] // [ { usuario, tiempoTranscurrido }, ... ]
        this.dbPath = path.join( __dirname, '../data/data.json' )
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
            
            if ( tiempoEnMinutos < 60) {
                return { usuario, tiempoTranscurrido: `0d 0h ${tiempoEnMinutos}min` }
            } else if (60 <= tiempoEnMinutos && tiempoEnMinutos < 1440) {
                return { usuario, tiempoTranscurrido: `0d ${Math.trunc( tiempoEnMinutos / 60 )}h ${ tiempoEnMinutos % 60 }min` }
            } else if ( tiempoEnMinutos >= 1440) {
                return {usuario , tiempoTranscurrido: `${Math.trunc( tiempoEnMinutos / 1440 )}d ${Math.trunc( (tiempoEnMinutos % 1440) / 60 )}h ${(tiempoEnMinutos % 1440) % 60}min`}
            } else {
                return { usuario, tiempoTranscurrido: 'rer' }
            }
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
    
    
    readDB() {
        const final = JSON.parse( fs.readFileSync( this.dbPath ) )
        this.final = final
    }

    iniciar(id) {
        const date = new Date()
        const countInit = date.getTime()
        this.inicio.push( { usuario: id, countInit } )
    }

    finalizar(id) {
        const date = new Date()
        const countEnd = date.getTime()

        const indiceInicio = this.inicio.findIndex( obj => obj.usuario === id)
        if ( indiceInicio === -1 ) {
            throw new Error('Has llamado a finalizar y el tiempo no ha empezado a transcurrir')
        }
        // Le sumo porque el índice 0 evalua false

        const { countInit } = this.inicio[indiceInicio]
        const tiempoMs = countEnd - countInit
        const tiempoMin = Math.trunc( (tiempoMs / 1000 ) / 60)

        console.log('Tiempo transcurrido en min:\n', tiempoMin )

        const indiceFinal = this.final.findIndex(obj => obj.usuario == id)
        if ( indiceFinal === -1 ) {
            this.final.push( { usuario: id, tiempoTranscurrido: tiempoMin})
        } else {
            this.final[indiceFinal].tiempoTranscurrido += tiempoMin
        }

        this.saveDB()
        this.inicio.splice(indiceInicio, 1)
    }

    saveDB() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.final))
    }


}

module.exports = UsuariosManegment