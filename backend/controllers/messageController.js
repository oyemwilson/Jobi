import Message from '../models/messageModel.js';

export const sendMessage = async (req, res) => {
  try {
    const { subject, body, targetRoles } = req.body;
    const sender = req.user._id;

    // Validate targetRoles
    const validRoles = ['applicant', 'employer', 'admin', 'all'];
    const isValidRoles = Array.isArray(targetRoles) && targetRoles.every(role => validRoles.includes(role));
    if (!isValidRoles) {
      return res.status(400).json({ error: 'Invalid target roles' });
    }

    const newMessage = new Message({
      sender,
      subject,
      body,
      targetRoles
    });

    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully', messageId: newMessage._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};





export const getMessages = async (req, res) => {
  try {
    const userRole = req.user.role;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { targetRoles: userRole },
        { targetRoles: 'all' }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'username email');

    // Reset isNew to false for fetched messages
    await Message.updateMany(
      {
        _id: { $in: messages.map(msg => msg._id) },
        isNew: true
      },
      { $set: { isNew: false } }
    );

    const totalMessages = await Message.countDocuments({
      $or: [
        { targetRoles: userRole },
        { targetRoles: 'all' }
      ]
    });
    const totalPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      messages,
      currentPage: page,
      totalPages,
      totalMessages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const markAsRead = async (req, res) => {
    try {
      const messageId = req.params.id;
      const userId = req.user._id;
  
      console.log(`Received request to mark message ID: ${messageId} as read by user ID: ${userId}`);
  
      const message = await Message.findById(messageId);
  
      if (!message) {
        console.log(`Message with ID: ${messageId} not found`);
        return res.status(404).json({ error: 'Message not found' });
      }
  
      // Check if the user has already read the message
      if (message.readBy.includes(userId)) {
        console.log(`Message with ID: ${messageId} has already been marked as read by user ID: ${userId}`);
        return res.status(400).json({ error: 'Message already marked as read' });
      }
  
      // Mark the message as read by adding userId to readBy array
      message.readBy.push(userId);
      await message.save();
  
      console.log(`Message with ID: ${messageId} marked as read by user ID: ${userId}`);
  
      res.status(200).json({ message: 'Message marked as read' });
    } catch (error) {
      console.error('Error marking message as read:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };


// messageController.js

export const getNewMessagesCount = async (req, res) => {
    try {
      const userRole = req.user.role;
  
      const newMessagesCount = await Message.countDocuments({
        $or: [
          { targetRoles: userRole },
          { targetRoles: 'all' }
        ],
        isNew: true
      });
  
      res.status(200).json({ newMessagesCount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
  export const getLatestMessages = async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { targetRoles: req.user.role },
          { targetRoles: 'all' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(5) // Limiting to latest 5 messages for example
      .populate('sender', 'username');
  
      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error fetching latest messages:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
