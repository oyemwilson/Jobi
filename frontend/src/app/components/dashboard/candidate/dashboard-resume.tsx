import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardHeader from './dashboard-header';

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
};

type FileType = 'cv' | 'coverLetter';

interface UploadedFile {
  type: FileType;
  url: string;
  name: string;
}

const DashboardResume = ({ setIsOpenSidebar }: IProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const { token } = userData;

        const fetchFile = async (type: FileType) => {
          try {
            const response = await axios.get(`http://localhost:5001/api/view/${type}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: 'blob',
            });

            if (response.data) {
              const blob = new Blob([response.data], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              return { type, url, name: `${type === 'cv' ? 'CV' : 'Cover Letter'}.pdf` };
            }
          } catch (error) {
            console.error(`Error fetching ${type}:`, error);
          }
          return null;
        };

        const files = await Promise.all([
          fetchFile('cv'),
          fetchFile('coverLetter')
        ]);

        setUploadedFiles(files.filter((file): file is UploadedFile => file !== null));

        if (files.every(file => file === null)) {
          setMessage("No files uploaded yet.");
        } else {
          setMessage("");
        }
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      setMessage("Error fetching uploaded files.");
    }
  };

  const handleFileUpload = async (type: FileType, file: File) => {
    const userDataString = localStorage.getItem('userData');
  
    if (!userDataString) {
      setMessage('Not authorized, no token found');
      return;
    }
  
    try {
      const userData = JSON.parse(userDataString);
      const { token } = userData;
  
      const formData = new FormData();
      formData.append(type, file);
  
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        setMessage(`${type === 'cv' ? 'CV' : 'Cover Letter'} uploaded successfully!`);
        fetchUploadedFiles();
      } else {
        setMessage(`Failed to upload ${type === 'cv' ? 'CV' : 'Cover Letter'}.`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setMessage(`Error uploading ${type}: ${error.response?.data?.message || error.message}`);
    }
  };
  const handleFileDelete = async (type: FileType) => {
    const userDataString = localStorage.getItem('userData');
  
    if (!userDataString) {
      setMessage('Not authorized, no token found');
      return;
    }
  
    try {
      const userData = JSON.parse(userDataString);
      const { token } = userData;
  
      const response = await axios.delete(`http://localhost:5001/api/delete/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setMessage(`${type === 'cv' ? 'CV' : 'Cover Letter'} deleted successfully!`);
        setUploadedFiles(prevFiles => prevFiles.filter(file => file.type !== type));
      } else {
        setMessage(`Failed to delete ${type === 'cv' ? 'CV' : 'Cover Letter'}.`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      setMessage(`Error deleting ${type}: ${error.response?.data?.message || error.message}`);
    }
  }

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <h2 className="main-title">My Resume</h2>
        
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Upload Documents</h4>
          
          <div className="dash-input-wrapper mb-20">
            <label htmlFor="uploadCV">CV Attachment*</label>
            <input
              type="file"
              id="uploadCV"
              name="uploadCV"
              onChange={(e) => e.target.files && handleFileUpload('cv', e.target.files[0])}
              accept=".pdf"
            />
            <small>Upload PDF file only</small>
          </div>

          <div className="dash-input-wrapper mb-20">
            <label htmlFor="uploadCoverLetter">Cover Letter Attachment*</label>
            <input
              type="file"
              id="uploadCoverLetter"
              name="uploadCoverLetter"
              onChange={(e) => e.target.files && handleFileUpload('coverLetter', e.target.files[0])}
              accept=".pdf"
            />
            <small>Upload PDF file only</small>
          </div>

          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>

        <div className="bg-white card-box border-20 mt-4">
          <h4 className="dash-title-three">Uploaded Documents</h4>
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, index) => (
              <div key={index} className="mb-4 row">
                <h5>{file.type === 'cv' ? 'CV' : 'Cover Letter'}</h5>
                <button
                  onClick={() => window.open(file.url, '_blank')}
                  className="btn btn-primary mt-2 mr-2"
                >
                  View {file.name}
                </button>
                <button
                  onClick={() => handleFileDelete(file.type)}
                  className="btn btn-danger mt-2"
                >
                  Delete {file.type === 'cv' ? 'CV' : 'Cover Letter'}
                </button>
              </div>
            ))
          ) : (
            <p>No documents uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardResume;