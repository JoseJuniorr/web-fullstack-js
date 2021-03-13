/**
 * Esta função deve receber um payload da fila
 * Gerar um JWT com  a secret das variaveis de ambiente
 * Realizar uma chamada para o backend enviando o jwt + payload
 * o retorno dessa chamada será statusCode 202
 */
const request = require("request");
const jwt = require("../../../lib/ms-auth");
const sqsParse = require("../../../lib/aws-parse-sqs");

async function main(event) {
  try {
    const isSqsMessage = Boolean(event.Records);

    if (isSqsMessage) {
      const payloadParsed = await sqsParse.parseMessages(event);
      const payload = payloadParsed[0];

      const msJWT = await jwt.sign(payload);

      const options = {
        url: `${process.env.MS_URL_MESSAGES}/messages/sendings`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
          "x-access-token": msJWT,
        },
        body: payload,
        json: true,
      };

      await request(options)
        .then((result) => {
          return {
            statusCode: 200,
            body: JSON.stringify({ result }),
          };
        })
        .catch((error) => {
          return {
            statusCode: 500,
            body: JSON.stringify({ error }),
          };
        });
    }
  } catch (error) {
    console.log(`sendMessage: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
}

module.exports = sendMessage = main;
