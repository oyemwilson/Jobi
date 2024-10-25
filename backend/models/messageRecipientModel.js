import mongoose from 'mongoose';

const messageRecipientSchema = new mongoose.Schema({
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readAt: {
    type: Date,
    default: null
  }
});

// Create a compound index for efficient querying
messageRecipientSchema.index({ message: 1, recipient: 1 }, { unique: true });

const MessageRecipient = mongoose.model('MessageRecipient', messageRecipientSchema);

export default MessageRecipient;