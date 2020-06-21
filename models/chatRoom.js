import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const CHATROOM_TYPES = {
    CONSUMER_TO_CONSUMER: 'consumer-to-consumer',
    CONSUMER_TO_SUPPORT: 'consumer-to-support'
}

const chatRoomSchema = mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, "")
    },
    userIds: Array,
    type: String,
    chatInitiator: String
},
    {
        timestamps: true,
        collection: "chatroom"
    }
);

chatRoomSchema.statics.initiateChat = async function (userIds, type, chatInitiator) {
    try {
        const availableRoom = await this.findOne({
            userIds: {
                $size: userIds.length,
                $all: [...userIds]
            }
        })

        if (availableRoom) {
            return {
                isNew: false,
                message: 'reteriving old chat room',
                chatRoomId: availableRoom._doc._id,
                type: availableRoom._doc.type
            }
        }

        const newRoom = await this.create({ userIds, type, chatInitiator });

        return {
            isNew: true,
            message: 'Created new Chat room',
            chatRoomId: newRoom._doc._id,
            type: newRoom._doc.type

        }

    } catch (error) {
        throw (error);
    }
}
chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
    try {
        const room = await this.findOne({ _id: roomId });
        return room;
    } catch (error) {
        throw error;
    }
}

export default mongoose.model('ChatRoom', chatRoomSchema)