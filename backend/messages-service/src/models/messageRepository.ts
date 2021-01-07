import messageModel, { IMessageModel } from "./messageModel";
import { IMessage } from "./message";

function findAll(accountId: number) {
  return messageModel.findAll<IMessageModel>({ where: { accountId } });
}

function findById(messageId: number, accountId: number) {
  return messageModel.findOne<IMessageModel>({
    where: { id: messageId, accountId: accountId },
  });
}

async function add(message: IMessage, accountId: number) {
  message.accountId = accountId;
  const result = await messageModel.create(message);
  message.id = result.id!;
  return message;
}

async function set(messageId: number, message: IMessage, accountId: number) {
  const originalMessage = await messageModel.findOne({
    where: { id: messageId, accountId: accountId },
  });
  if (originalMessage === null) return null;
  if (message.subject) originalMessage.subject= message.subject;
  if (message.body) originalMessage.body = message.body;
  if (message.status) originalMessage.status = message.status;
  if (message.sendDate) originalMessage.sendDate = message.sendDate;

  const result = await originalMessage.save();
  message.id = result.id;
  return message;
}

function removeById(messageId: number, accountId: number) {
  return messageModel.destroy({
    where: { id: messageId, accountId: accountId },
  });
}

export default { findAll, findById, add, removeById, set };
