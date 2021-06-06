require('dotenv').config()
const Discord = require('discord.js')
const UsuariosManegment = require('./models/user.js')
const colors = require('colors')

const keepAlive = require('./server')

const client = new Discord.Client()
const controladorUsuario = new UsuariosManegment()

const canalesContadores = new Map( [['Sala de clases', '709959913656418305'], [ 'Sala de clases 2', '846631170975989760' ] ] )

//setInterval( () => {
//    console.log('this.inicio:   ', controladorUsuario.inicio)
//    console.log('this.final:    ', controladorUsuario.final, '\n')
//}, 2000)

client.on('ready', () => {
    console.log(`El bot está listo como ${ client.user.tag }`)
})

client.on('message', message => {
    // console.log(`${message.author.tag} =>  ${message.content}`)
    switch ( message.content.toLocaleLowerCase() ) {
        case 'rer':
            message.channel.send(`<:sas:850136859182628894>`)
            break;
        case 'sas':
            message.channel.send('<:rer:841163561040740382>')
            break
        case '.tiempo':
            // Este try catch actualiza los usuarios si fuera necesario
            try {
                controladorUsuario.finalizar(message.author.tag)
                controladorUsuario.iniciar(message.author.tag)
            } catch (error) {
                console.log('Mandaste a finalizar y no ha comenzado a contar el tiempo'.red)
            }
            const tiempoTranscurrido = controladorUsuario.getRegistroPorTag(message.author.tag)

            if(!tiempoTranscurrido) {
                message.channel.send('No has estado el tiempo suficiente en canales de voz...')
            } else {
                const Embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Tiempo en los canales de estudio :')
                    .setDescription(tiempoTranscurrido.tiempoTranscurrido)
                    .setAuthor('PAXO BOT', message.guild.members.cache.find( member => member.user.username === 'PAXO BOT').user.avatarURL() )                    
                    .setTimestamp()
                    .setFooter(`Solicitado por ${message.member.user.tag}`, message.author.avatarURL() );
                    
                message.channel.send(Embed)
            }
            break
        case '.toptiempo':
            // Este try catch actualiza los usuarios si fuera necesario
            try {
                controladorUsuario.finalizar(message.author.tag)
                controladorUsuario.iniciar(message.author.tag)
            } catch (error) {
                console.log('Mandaste a finalizar y no ha comenzado a contar el tiempo'.red)
            }
            const top = controladorUsuario.diasHorasMinutos
            const topTiempo = [ ...top.map( ( { usuario, tiempoTranscurrido } ) => tiempoTranscurrido ) ]
            const topUsuarios = [ ...top.map( ({usuario, tiempoTranscurrido}) => usuario ) ].map(( user, i ) => `${i+1}.- `+ user )

            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Top usuarios  <:rer:841163561040740382> : ')
                .setAuthor('PAXO BOT', message.guild.members.cache.find( member => member.user.username === 'PAXO BOT').user.avatarURL() )
                // .setThumbnail('https://nextshark.com/wp-content/uploads/2018/10/2-7.jpg')
                .addFields(
                    { name: 'Usuarios:', value: topUsuarios , inline: true },
                    { name: 'Tiempo en el servidor: ', value: topTiempo, inline: true }
                )
                .setTimestamp()
                .setFooter(`Solicitado por ${message.member.user.tag}`, message.author.avatarURL() );
                    
            message.channel.send(exampleEmbed)
            // console.log(controladorUsusario.diasHorasMinutos)
            break
        case '.a':
            break
        default:
            break;
    }
})

client.on('voiceStateUpdate', async(oldState, newState) => {    

    if(newState.channelID !== oldState.channelID) {
        if( oldState.channelID === canalesContadores.get('Sala de clases 2') || oldState.channelID === canalesContadores.get('Sala de clases')) {
            try {
                controladorUsuario.finalizar(newState.member.user.tag)
                console.log(`El usuario ${newState.member.user.tag} se ha ${'DESCONECTADO'.red} de el canal y el contador se ha detenido`)
            } catch (error) {
                console.log(`${error.message}`.red)
            }
        }
        if (  newState.channelID === canalesContadores.get('Sala de clases') ) { 
            controladorUsuario.iniciar(newState.member.user.tag)
            console.log(`El usuario ${newState.member.user.tag} se ha ${'CONECTADO'.green} al canal ${'SALA DE CLASES'.blue} y el contador ha empezado a correr`)
        }
        if ( newState.channelID === canalesContadores.get('Sala de clases 2') ) {
            controladorUsuario.iniciar(newState.member.user.tag)
            console.log(`El usuario ${newState.member.user.tag} se ha ${'CONECTADO'.green} al canal ${'SALA DE CLASES 2'.blue} y el contador ha empezado a correr`)
        }
    }
    let tiempo;
    if ( controladorUsuario.getRegistroPorTagNUM(newState.member.user.tag) ) {
        tiempo = controladorUsuario.getRegistroPorTagNUM(newState.member.user.tag).tiempoTranscurrido
    }

    console.log('TIEMPO: \n '.green, tiempo)
    if(Boolean(tiempo) || tiempo === 0 ) {
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
            await newState.member.roles.remove( roles[0] )
            await newState.member.roles.add( roles[1] )
        } else if( tiempo < 600 ) {
            await newState.member.roles.remove( roles[1] )
            await newState.member.roles.add( roles[2] )
        } else if( tiempo < 1380 ) {
            await newState.member.roles.remove( roles[2] )
            await newState.member.roles.add( roles[3] )
        } else if( tiempo < 3900 ) {
            await newState.member.roles.remove( roles[3] )
            await newState.member.roles.add( roles[4] )
        } else if( tiempo < 5640 ) {
            await newState.member.roles.remove( roles[4] )
            await newState.member.roles.add( roles[5] )
        } else if( tiempo > 5640 ) {
            await newState.member.roles.remove( roles[5] )
            await newState.member.roles.add( roles[6] )
        } else {
            console.log('rer'.bgCyan)
        }
        
    }
    // console.log('roles mi rey: \n', newState.member._roles)
    // console.log('OldState: \n', oldState.channelID)
    // console.log( roles )
})
client.on('guildMemberUpdate', (oldMember, newMember) => {
    console.log('Se ha añadido un rol mi bro'.yellow)
    console.log('oldMember: \n'.yellow, oldMember)
    console.log('newMember: \n'.yellow, newMember)
})

keepAlive()
client.login( process.env.TOKEN )
