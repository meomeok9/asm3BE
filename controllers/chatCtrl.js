const User = require("../models/users");
const ChatDatas = require("../models/chat-data");
const { contextsKey } = require("express-validator/src/base");
module.exports.addMessage = async (data) => {
  const isUser = data.fromClient;
  const userId = data.userId || data.toUser;
  const message = data.message;
  try {
    const existChatRoom = await ChatDatas.findOne({ userId });

    if (existChatRoom) {
      existChatRoom.message.push({ message, isUser });
      return await existChatRoom.save();
    } else {
      const newMessage = new ChatDatas({
        userId,
        message: [{ message, isUser }],
      });
      return await newMessage.save();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.getMessages = async () => {
  try {
    const messages = await ChatDatas.find();
    const fakedata = [];
    for (let i = 0; i < messages.length; i++) {
      const existUser = await User.findById(messages[i].userId);

      fakedata[i] = { ...messages[i]._doc };
      fakedata[i].useName = existUser.fullName;
    }
    return fakedata;
  } catch (err) {
    console.log(err);
  }
};
