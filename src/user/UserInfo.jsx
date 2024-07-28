import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const UserInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    address: [],
    city: "",
    avatar: "",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    postal_code: "",
    country: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/info/${id}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const openModal = (index = null) => {
    if (index !== null) {
      setIsEditing(true);
      setCurrentAddressIndex(index);
      setNewAddress(user.address[index]);
    } else {
      setIsEditing(false);
      setNewAddress({
        street: "",
        city: "",
        postal_code: "",
        country: "",
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/users/info/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        alert("User information updated successfully");
        navigate(`/user/info/${id}`);
      } else {
        console.error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const handleAddressSubmit = () => {
    const updatedUser = { ...user };
    if (isEditing) {
      updatedUser.address[currentAddressIndex] = newAddress;
    } else {
      updatedUser.address.push(newAddress);
    }
    setUser(updatedUser);
    closeModal();
  };

  const handleDeleteAddress = (index) => {
    const updatedUser = { ...user };
    updatedUser.address.splice(index, 1);
    setUser(updatedUser);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Information</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Avatar</label>
          <input
            type="text"
            name="avatar"
            value={user.avatar}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              className="mt-4 w-20 h-20 rounded-full"
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Addresses</label>
          <ul className="list-disc pl-5">
            {user.address.map((addr, index) => (
              <li key={index} className="flex justify-between items-center">
                {`${addr.street}, ${addr.city}, ${addr.postal_code}, ${addr.country}`}
                <div>
                  <button
                    type="button"
                    onClick={() => openModal(index)}
                    className="text-blue-500 ml-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(index)}
                    className="text-red-500 ml-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openModal()}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Add Address
          </button>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update
        </button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2>{isEditing ? "Edit Address" : "Add Address"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddressSubmit();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700">Street</label>
            <input
              type="text"
              name="street"
              value={newAddress.street}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={newAddress.city}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={newAddress.postal_code}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={newAddress.country}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {isEditing ? "Update Address" : "Add Address"}
          </button>
        </form>
        <button
          onClick={closeModal}
          className="mt-2 bg-gray-500 text-white p-2 rounded"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default UserInfo;
