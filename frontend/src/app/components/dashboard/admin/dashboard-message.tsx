"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardHeader from './dashboard-header';
import EmailReadPanel from './email-read-panel';

// Props type 
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

type Message = {
  _id: string;
  subject: string;
  body: string;
  sender: {
    username: string;
    email: string;
  };
  targetRoles: string[];
  createdAt: string;
}

const DashboardMessage = ({ setIsOpenSidebar }: IProps) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const handleRoleChange = (role: string) => {
    setTargetRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };
  const userDataString = localStorage.getItem("userData");
  const sendMessage = async () => {
    try {
      const userData = JSON.parse(userDataString);
      const token = userData.token;

      const response = await axios.post(
        'http://localhost:5001/api/messages/send',
        { subject, body, targetRoles },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Message sent:', response.data);
      setSubject('');
      setBody('');
      setTargetRoles([]);
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchMessages = async () => {
    try {
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

      console.log('Fetched messages:', response.data);
      setMessages(response.data.messages);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className='dashboard-body'>
      <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
      <div className="message-input-wrapper mb-30">
        <h2 className="text-2xl font-bold mb-4">Send Message</h2>
        <input
  style={{ width: "100%" }}  
  type="text"
  value={subject}
  onChange={handleSubjectChange}
  className="w-full p-2 mb-2 border rounded"
  placeholder="Subject"
/>
<textarea
  value={body}
  onChange={handleBodyChange}
  className="large-textarea w-full p-2 mb-2"
  placeholder="Type your message here..."
  rows={4}
  style={{
    border: '1px solid #E5E5E5',
    borderRadius: '7px',
    padding: '15px 20px',
    maxWidth: '100%',
    width: '100%',
    resize: 'none'
  }}
/>

        <div className="role-checkboxes mb-4">
          <label className="role-checkbox me-3" >
            <input
              type="checkbox"
              checked={targetRoles.includes('applicant')}
              onChange={() => handleRoleChange('applicant')}
              className=""
            /> Applicant
          </label>
          <label className="role-checkbox me-3">
            <input
              type="checkbox"
              checked={targetRoles.includes('employer')}
              onChange={() => handleRoleChange('employer')}
              className="mr-1"
            /> Employer
          </label>
          <label className="role-checkbox me-3">
            <input
              type="checkbox"
              checked={targetRoles.includes('all')}
              onChange={() => handleRoleChange('all')}
              className="mr-1"
            /> All
          </label>
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Send Message
          </button>
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4">Messages</h3>
        <ul className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <li key={msg._id} className="py-2">
              <h4 className="font-bold">{msg.subject}</h4>
              <p>{msg.body}</p>
              <p className="text-sm text-gray-500">
                From: {msg.sender.username} ({msg.sender.email})
              </p>
              <p className="text-sm text-gray-500">
                Sent to: {msg.targetRoles.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Sent at: {new Date(msg.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
