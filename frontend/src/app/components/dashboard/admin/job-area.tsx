import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../../redux/action/userAction';
import DashboardHeader from "../candidate/dashboard-header";
import Image from "next/image";
import view from "@/assets/dashboard/images/icon/icon_18.svg";
import delete_icon from "@/assets/dashboard/images/icon/icon_21.svg";
import UserDetailsModal from "../../common/popup/view-user-modal";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminJobArea: React.FC<IProps> = ({ setIsOpenSidebar }) => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { users, loading, error } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleShowModal = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditSuccess = () => {
    // Action to take after a successful edit
    console.log('Edit successful, refresh the user list or perform any action.');
    dispatch(fetchUsers()); // Optionally, refresh the user list
  };

  const filterEmployerUsers = () => {
    return users.filter((user: any) => user.role === 'applicant');
  };

  const employerUsers = filterEmployerUsers();

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">Employer Users</h2>
        </div>
        <div className="bg-white card-box border-20">
          <div className="tab-content" id="nav-tabContent">
            <div className="tab-pane fade show active" id="a1" role="tabpanel">
              <div className="table-responsive">
                <table className="table job-alert-table">
                  <thead>
                    <tr>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="border-0">
                    {loading ? (
                      <tr>
                        <td colSpan={4}>Loading...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={4}>Error: {error}</td>
                      </tr>
                    ) : (
                      employerUsers.map((user: any) => (
                        <tr key={user._id}>
                          <td>{user.firstName}{''}</td>
                          <td>{user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            <div className="action-dots float-end">
                              <button
                                className="action-btn dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <span></span>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <a className="dropdown-item" href="#" onClick={() => handleShowModal(user)}>
                                    <Image src={view} alt="icon" className="lazy-img" /> View
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="#">
                                    <Image src={delete_icon} alt="icon" className="lazy-img" /> Delete
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-pagination d-flex justify-content-end mt-30">
          <ul className="style-none d-flex align-items-center">
            {/* Pagination controls */}
          </ul>
        </div>
      </div>
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          show={showModal}
          onHide={handleCloseModal}
          onEditSuccess={handleEditSuccess} // Pass the function as a prop
        />
      )}
    </div>
  );
};

export default AdminJobArea;
