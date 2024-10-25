import React, { useState } from 'react';
import axios from 'axios';

const SendMessageForm = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/messages/send', {
        subject,
        body,
        recipients
      });

      console.log(response.data.message);
      // Reset form fields
      setSubject('');
      setBody('');
      setRecipients([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Send Message</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              type="text"
              className="form-control"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="body" className="form-label">
              Message Body
            </label>
            <textarea
              className="form-control"
              id="body"
              rows="5"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="recipients" className="form-label">
              Recipients
            </label>
            <input
              type="text"
              className="form-control"
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value.split(','))}
              placeholder="Enter user IDs separated by comma"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendMessageForm;