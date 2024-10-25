import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardHeader from './dashboard-header';

// Props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

type Message = {
  _id: string;
  subject: string;
  body: string;
  sender: {
    username: string;
  };
  targetRoles: string[];
  createdAt: string;
  read: boolean; // Track read/unread status
};

const DashboardMessage = ({ setIsOpenSidebar }: IProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedMessageIds, setExpandedMessageIds] = useState<string[]>([]);

  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const fetchMessages = async () => {
    try {
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        console.error('User data not found');
        return;
      }

      const userData = JSON.parse(userDataString);
      const token = userData.token;

      const response = await axios.get(
        `http://localhost:5001/api/messages?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data.messages);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        console.error('User data not found');
        return;
      }
  
      const userData = JSON.parse(userDataString);
      const token = userData.token;
  
      const response = await axios.put(
        `http://localhost:5001/api/messages/${messageId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(`Message with ID: ${messageId} marked as read:`, response.data);
  
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, readBy: [...msg.readBy, userData.userId] } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  const toggleMessageExpansion = (id: string) => {
    setExpandedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );

    // Mark as read when expanded
    if (!expandedMessageIds.includes(id)) {
      markAsRead(id);
    }
  };

  return (
    <div className="dashboard-body">
      <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

      <div className="message-input-wrapper mb-30">
        <h3 className="text-xl font-bold mt-8 mb-4">Messages</h3>
        <ul className="divide-y divide-gray-200">
  {messages.map((msg) => (
    <li
      key={msg._id}
      style={{
        padding: '8px 16px',
        cursor: 'pointer',
        backgroundColor: msg.read ? '#f3f4f6' : '#ffffff',
        borderBottom: '2px solid',
        borderBottomColor: msg.read ? '#86efac' : '#fca5a5'
      }}
      onClick={() => toggleMessageExpansion(msg._id)}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold">{msg.sender.username}</span>
        <span style={{ fontWeight: 'bold', color: msg.read ? '#6b7280' : '#000000' }}>
          {msg.subject}
        </span>
      </div>
      {expandedMessageIds.includes(msg._id) && (
        <div style={{ marginTop: '8px', paddingLeft: '16px', borderLeft: '2px solid #d1d5db' }}>
          <p>{msg.body}</p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Sent to: {msg.targetRoles.join(', ')}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Sent at: {new Date(msg.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </li>
  ))}
</ul>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMessage;
