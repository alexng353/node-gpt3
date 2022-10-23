import logger from "./utils/logger";
import fs from "fs";
import fetch from "node-fetch";

require("dotenv").config();

const API_KEY = process.env.API_KEY;

async function prompt(prompt: string) {
  // input function for nodejs
  const res = await new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdout.write(prompt + "\n>>> ");
    process.stdin.on("data", (text) => {
      resolve(text);
    });
  });
  return res;
}

async function main() {
  const ask = await prompt("Enter a prompt");
  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-002",
      prompt: ask,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      // logger.info(json);
      console.log("Response: ");
      // format the text so that it is at max 160 characters wide with proper word wrapping
      // const formatted = json.choices[0].text.match(/.{1,160}(\s|$)/g);
      const formatted = json.choices[0].text.split(" ");

      // loop over the text and print it out in the same line until that line reaches over 160 characters
      console.log(Array.from("=".repeat(160)).join(""));

      console.log("\n\n");

      let line = "";
      for (let i = 0; i < formatted.length; i++) {
        if (line.length + formatted[i].length > 80) {
          console.log(line);
          line = "";
        }
        line += formatted[i] + " ";
      }
      console.log(line);
      console.log("\n\n");
      console.log(Array.from("=".repeat(80)).join(""));

      process.exit();

      // console.log(json.choices[0].text);
    });
}

function getModels() {
  fetch("https://api.openai.com/v1/models", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      const bruh = json.data.map((model: any) => {
        // return model.name;
        return model.id;
      });
      // console.log(bruh);
    });
}

main();
// getModels();
