import baseAPI from "./api";
import baseURLs from "../config/baseURLs";

class MessageService {
  constructor() {
    this.api = baseAPI(baseURLs.API_MESSAGES);
  }

  async getAll() {
    const result = await this.api.get("messages/?includeRemoved=true");

    return result.data;
  }

  async getOne(messageId) {
    const result = await this.api.get(`messages/${messageId}`);

    return result.data;
  }

  async add(messageModel) {
    const result = await this.api.post("messages", messageModel);

    return result;
  }

  async delete(messageId) {
    const result = await this.api.delete(`messages/${messageId}`);

    return result;
  }

  async send(messageId) {
    const result = await this.api.post(`messages/${messageId}/send`);

    return result;
  }
}

export default MessageService;
