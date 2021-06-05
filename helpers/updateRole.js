
const { controladorUsuario } = require('../index') 

async function updateRoles(newState) {
    const tiempo = controladorUsuario.getRegistroPorTagNUM(newState.member.user.tag)?.tiempoTranscurrido
    if(tiempo) {
        const roles = [
            newState.guild.roles.cache.find( role => role.name === "fracaso" ).id,
            newState.guild.roles.cache.find( role => role.name === "Dumb Pepe").id,
            newState.guild.roles.cache.find( role => role.name === "Small Brain Pepe").id,
            newState.guild.roles.cache.find( role => role.name === "Procrastinator Pepe").id,
            newState.guild.roles.cache.find( role => role.name === "Smart Pepe").id,
            newState.guild.roles.cache.find( role => role.name === "Pepe Nerd").id,
            newState.guild.roles.cache.find( role => role.name === "Big Brain Pepe").id
        ]
        
        if ( tiempo < 18 ) {
            await newState.member.roles.add( roles[0] )
        } else if( tiempo < 300) {
            if (newState.member._roles.includes(roles[0]) ) {
                await newState.member.roles.remove( roles[0] )
                await newState.member.roles.add( roles[1] )
                return `Felicidades ${newState.member.user.tag}, te has convertido en un Dumb Pepe`
            }
        } else if( tiempo < 600 ) {
            if (newState.member._roles.includes(roles[1]) ) {
                await newState.member.roles.remove( roles[1] )
                await newState.member.roles.add( roles[2] )
                return `Felicidades ${newState.member.user.tag}, te has convertido en un Small Brain Pepe`
            }
        } else if( tiempo < 1380 ) {
            if (newState.member._roles.includes(roles[2]) ) {
                await newState.member.roles.remove( roles[2] )
                await newState.member.roles.add( roles[3] )
                return `Felicidades ${newState.member.user.tag}, te has convertido en un Procrastinator Pepe`

            }
        } else if( tiempo < 3900 ) {
            if (newState.member._roles.includes(roles[3]) ) {
                await newState.member.roles.remove( roles[3] )
                await newState.member.roles.add( roles[4] )
                return `Felicidades ${newState.member.user.tag}, te has convertido en un Smart Pepe`
            }
        } else if( tiempo < 5640 ) {
            if (newState.member._roles.includes(roles[4]) ) {
                await newState.member.roles.remove( roles[4] )
                await newState.member.roles.add( roles[5] )
                return `Felicidades ${newState.member.user.tag}, te has convertido en un Pepe Nerd`

            }        
        } else if( tiempo > 5640 ) {
            if (newState.member._roles.includes(roles[5]) ) {
                await newState.member.roles.remove( roles[5] )
                await newState.member.roles.add( roles[6] )
                return `Felicidades ${newState.member.user.tag}, te has convertido en un Big Brain Pepe`
            }
        } else {
            console.log('rer')
        }   
    }
}

module.exports = {
    updateRoles
}
