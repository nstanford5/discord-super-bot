const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const { token } = require('./config.json');
require('dotenv');
const fetch = require('node-fetch');

const client = new Client({ intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  // set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event  = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

function sleep(ms){
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < ms);
}

// SMS message implementation
client.on('interactionCreate', async interaction => {
  if(!interaction.isButton()) return;
  if(interaction.customId === 'send-sms'){
    const modal = new ModalBuilder()
      .setCustomId('sms-modal')
      .setTitle('Message submission');
    const outgoingMessage = new TextInputBuilder()
      .setCustomId('out-message')
      .setLabel('Enter your outgoing message')
      .setStyle('Paragraph')
      .setPlaceholder('Message here')
      .setRequired(true);
    const firstActionRow = new ActionRowBuilder().addComponents(outgoingMessage);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
  }
})

// TODO -- fetch Cardano something
client.on('interactionCreate', async interaction => {
  if(!interaction.isButton()) return;
  if(interaction.customId === 'test-ada-stuff'){
    // connect to runtime (needs to be done with new docs)
    // retrieve balance    
  }
})

// fetch SOL NFTs
client.on('interactionCreate', async interaction => {
  if(!interaction.isButton()) return;
  if(interaction.customId === 'fetch-sol-nfts'){
    const modal = new ModalBuilder()
      .setCustomId('wallet-sol')
      .setTitle('Wallet submission');
    const addrInput = new TextInputBuilder()
      .setCustomId('address')
      .setLabel('Enter your Solana wallet address')
      .setStyle('Short')
      .setMaxLength(44)
      .setMinLength(44)
      .setPlaceholder('Solana address only')
      .setRequired(true);
    const firstActionRow = new ActionRowBuilder().addComponents(addrInput);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
  }

  // TODO -- implement marlowe-TS-SDK node.js
  if(interaction.customId === 'show-ada-amount'){
    // const {RuntimeLifecycle} = await import ('@marlowe.io/runtime-lifecycle/api');
    // const runtimeLifecycle = await mkRuntimeLifecycle({
    //   walletName: 'nami',
    //   runtimeURL: 'https://marlowe-runtime-preprod-web.demo.scdev.aws.iohkdev.io',
      
    // });
    // console.log(`Connected to runtime`);
  }

  if(interaction.customId === 'fetch-eth-nfts'){
    const modal = new ModalBuilder()
      .setCustomId('wallet-eth')
      .setTitle('Wallet submission');
    const addrInput = new TextInputBuilder()
      .setCustomId('address')
      .setLabel('Enter your Ethereum wallet address')
      .setStyle('Short')
      .setMaxLength(42)
      .setMinLength(42)
      .setPlaceholder('Ethereum address only')
      .setRequired(true);
    const firstActionRow = new ActionRowBuilder().addComponents(addrInput);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
  //  broken?, returns {}
  //   const { FetchNFTClient } = await import('@audius/fetch-nft');
  //
  //   const fetchClient = new FetchNFTClient();
  //   const ethCollects = await fetchClient.getEthereumCollectibles(['0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9']);
  //   const [...Collectibles] = ethCollects['0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9'];
  }
})

// modal submissions
client.on('interactionCreate', async interaction => {
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId === 'wallet-eth'){
    interaction.deferUpdate();

    const wallet = interaction.fields.getTextInputValue('address');
    const url = `https://api.opensea.io/api/v2/chain/ethereum/account/${wallet}/nfts`;
    const options = {
      method: 'GET',
      headers: {accept: 'application/json', 'x-api-key': 'c86e4d569ef3474b8ca670c25cf62e37'}
    };
    const f = await fetch(url, options)
                  .then(response => {
                    if(!response.ok){
                      return response.json()
                        .catch(() => {
                          throw new Error(response.status);
                        })
                        .then(({message}) => {
                          throw new Error(message || response.status);
                        });
                    }
                    return response.json();
                  });

    const [...listNfts] = f['nfts'];
    const len = listNfts.length;
    await interaction.followUp(`I found ${len} nfts in that wallet. I will display them here for your convenience...`);

    let nums = [];
    for(let i = 0; i < len; i++){
      sleep(3000);
      nums[i] = listNfts.pop(i);
      await interaction.followUp(`Name: ${nums[i].name}\n` +
                  `Contract: ${nums[i].contract}\n` +
                  `Image URL: ${nums[i].image_url}\n`);
    }
  }//end of 'wallet-eth' handler
  
  if(interaction.customId === 'wallet-sol'){
    interaction.deferUpdate();
    
    const wallet = interaction.fields.getTextInputValue('address');
    const { FetchNFTClient } = await import('@audius/fetch-nft');
    const solanaConfig = {
      rpcEndpoint: 'https://api.mainnet-beta.solana.com'
    }
    const fetchClient = new FetchNFTClient({ solanaConfig });

    /**
     * This structure collects any amount of NFTs for display and
     * formats them in a friendly way to display to the UI
     */
    const solCollects = await fetchClient.getSolanaCollectibles([wallet]);
    const [...Collectibles] = solCollects[wallet];
    const len = Collectibles.length;
    await interaction.followUp(`I found ${len} Collectibles in that wallet. I will display them here for your convenience...`);
      
    let nums = [];
    for(let i = 0; i < len; i++){
      sleep(3000);
      nums[i] = Collectibles.pop(i);
      await interaction.followUp(`Name: ${nums[i].name}\n` +
            `Token ID: ${nums[i].tokenId}\n` +
            `Description: ${nums[i].description}\n`);
    }
  }//end of 'wallet-sol' handler

  if(interaction.customId === 'sms-modal'){
    interaction.deferUpdate();

    const outgoingMessage = interaction.fields.getTextInputValue('out-message');

    const twilioClient = require('twilio')(process.env.SMS_ACCOUNT_SID, process.env.SMS_AUTH_TOKEN);
    const phoneNumbers = ['+18156401606'];

    // loop through phone numbers and send message to each
    phoneNumbers.forEach((phoneNum) => {
      twilioClient.messages
      .create({
        body: outgoingMessage,
        to: phoneNum,
        from: '+18447305996',// twilio phone number
      })
      .then((m) => console.log(m.sid));
    });
  }// end of 'sms-modal' handler
});

// general interaction handling
client.on('interactionCreate', async interaction => {
  if(!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;
  try{
    await command.execute(interaction);
  } catch (e) {
    console.error(e);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);