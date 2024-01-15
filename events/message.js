const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const config = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(config);

module.exports = {
  name: 'messageCreate',
  async execute(message){
    if(message.author.bot) return;
    if(message.mentions.has('1135973889198014616')){
      try{
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message.content }],
        });
        console.log(completion);// remove me
        await message.reply(completion.data.choices[0].message);
      } catch (e) {
        console.error(e);
      }
      return;
    }
  }
}