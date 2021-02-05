import AWS from "aws-sdk";

AWS.config.update({ region: process.env.AWS_SES_REGION });

async function addEmailIdentity(domainOrEmail: string) {
  const ses = new AWS.SESV2();
  const params = { EmailIdentity: domainOrEmail };

  return await ses.createEmailIdentity(params).promise();
}

export default { addEmailIdentity };
