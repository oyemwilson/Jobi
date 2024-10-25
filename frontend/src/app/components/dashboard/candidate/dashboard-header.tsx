import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import notifi from "@/assets/dashboard/images/icon/icon_11.svg";
import search from "@/assets/dashboard/images/icon/icon_10.svg";

type Message = {
  _id: string;
  subject: string;
  body: string;
  sender: {
    username: string;
  };
  createdAt: string;
  read: boolean;
};

type IProps = {
  setIsOpenSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardHeader: React.FC<IProps> = ({ setIsOpenSidebar }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Message[]>([]);

  useEffect(() => {
    fetchLatestMessages();
    const interval = setInterval(fetchLatestMessages, 60000); // Fetch every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLatestMessages = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        console.error("User data not found");
        return;
      }

      const userData = JSON.parse(userDataString);
      const token = userData.token;

      // const [messagesResponse, notificationsResponse] = await Promise.all([
      //   axios.get("http://localhost:5001/api/messages/latest", {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }),
      //   axios.get("http://localhost:5001/api/messages/latest", {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }),
      // ]);

      setMessages(messagesResponse.data.messages);
      setNotifications(notificationsResponse.data.messages.slice(0, 3)); // Take the first 3 notifications
    } catch (error) {
      console.error("Error fetching latest messages and notifications:", error);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center justify-content-end">
        <button
          onClick={() => setIsOpenSidebar && setIsOpenSidebar(true)}
          className="dash-mobile-nav-toggler d-block d-md-none me-auto"
        >
          <span></span>
        </button>
        <form action="#" className="search-form">
          <input type="text" placeholder="Search here.." />
          <button>
            <Image src={search} alt="search" className="lazy-img m-auto" />
          </button>
        </form>
        <div className="profile-notification ms-2 ms-md-5 me-4">
          <button
            className="noti-btn dropdown-toggle"
            type="button"
            id="notification-dropdown"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            <Image src={notifi} alt="Notification" className="lazy-img" />
            <div className="badge-pill"></div>
          </button>
          <ul className="dropdown-menu" aria-labelledby="notification-dropdown">
            <li>
              <h4>Messages</h4>
              <ul className="style-none notify-list">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`notify-item ${notification.read ? "" : "unread"}`}
                  >
                    <div className="notify-content">
                      <span className="notify-sender font-bold">
                        {notification.sender.username}
                      </span>
                      <span className="notify-subject font-semibold">
                        {notification.subject}
                      </span>
                      {/* <span className="notify-time text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span> */}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <div>
          {/* 
          <Link
            href="/dashboard/employ-dashboard/submit-job"
            className="job-post-btn tran3s"
          >
            Post a Job
          </Link> 
          */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
