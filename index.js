// Discord Alertbot
const { Client, GatewayIntentBits, Events } = require('discord.js')

//  HTTP POST request to send push notification
const fetch = require('node-fetch');

// Loads environment variables from ".env" without exposing secret code
require('dotenv').config();

// Bot instance
const client = new Client({
    // Instance to listen to
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ]
});

// Console.log Bot to Discord Channel
client.once(Events.ClientReady, ()=> {
    console.log(`Logged in as ${client.user.tag}`);
})

// Instantiation for when a new member joins a server the bot is in
client.on(Events.GuildMemberAdd, async (member) => {
    // Details to send to the API or Webhook
    const payload = {
        username: member.user.tag,
        userID: member.user.id,
        guild: member.guild.name,
        guildID: member.guild.id,
        joinedAt: member.joinedAt.toISOString()
    };
    
    try {
        // Send push notification
        const response = await fetch(process.env.NOTIFICATION_URL, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(payload)
        });
        
        // Handle HTTP response
        if (!response.ok) {
            console.log('Failed to send notification: ', response.status);
        } else {
            console.log(`Notification sent for ${payload.username}`)
        }
    } catch (error) {
        console.error('Push notification failed: ', error);
    }

    // Notify Admin
    // try {
    //     const adminUser = await client.user.fetch(process.env.ADMIN_ID); // fetches Admin ID
    //     await adminUser.send(
    //         // Notification
    //         `${member.user.tag} joined the server ${member.guild.name}`
    //     ); 
    // } catch (error) {
    //   console.error("Error: ", error);  
    // }
})

// Start Bot
client.login(process.env.DISCORD_TOKEN);