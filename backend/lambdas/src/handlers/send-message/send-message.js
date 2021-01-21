const sqsParse = require("../../../lib/aws-parse-sqs");

async function sendMessage(event) {
  try {
    const isSqsMessage = Boolean(event.Records);

    if (isSqsMessage) {
      console.log("Função de envio foi chamada pelo SQS");

      const payloasParsed = await sqsParse.parseMessages(event);
      const payload = payloasParsed[0];

      console.log(`messageId: ${payload.messageId}`);
      console.log(`messageId: ${payload.accountId}`);
      console.log(`messageId: ${payload.contactId}`);

      return {
        statusCode: 200,
      };
    }
  } catch (error) {
    console.log(`sendMessage: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
}

module.exports = sendMessage;
