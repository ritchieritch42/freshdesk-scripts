/*
Make sure that you are logged in to Freshdesk before running this script.
Otherwise you will get an error prompting you to do so.
*/

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
        axios.get(`${url}/tickets/${ticketNumber}`, {
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
        console.log(values[i]['data']['description_text']);
    }
  });

rl.close();