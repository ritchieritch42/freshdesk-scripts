import axios from 'axios';
import 'dotenv/config'
import readline from 'node:readline';

const url = process.env.FRESHDESK_URL;
const key = process.env.API_KEY;

async function prompt(rl, question) {
    return(
        await new Promise(resolve => {
            rl.question(question, resolve)
          })
    )
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startingTicket = await prompt(rl, "What ticket number do you want to start with?\n")
const endingTicket = await prompt(rl, "What ticket number do you want to end with?\n")
let ticketNumber = startingTicket;
let axiosArray = [];

while (ticketNumber <= endingTicket) {
    axiosArray.push(
        axios.get(`${url}tickets/${ticketNumber}/conversations`, {
            headers: {
                Authorization: `Basic ${btoa(key)}`,
                Accept: 'application/json'
            }
        })
    );
    ticketNumber++;
}

Promise.all(axiosArray).then((values) => {
    for(let i = 0; i < values.length; i++) {
        console.log(JSON.stringify(values[i].data[0]) + JSON.stringify(values[i].data[0].ticket_id) + "\n" + values[i].data[0].body_text + "\n\n");
    }
  });

rl.close();