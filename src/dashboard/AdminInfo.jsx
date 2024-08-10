import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AdminInfo = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    avatar: "",
    address: [],
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [newAddress, setNewAddress] = useState({
    country: "",
    city: "",
    postal_code: "",
    street: "",
  });
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/users/info/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Get user info successfully") {
          setUser(data.user);
          setFormData({
            email: data.user.email,
            phone: data.user.phone,
            avatar: data.user.avatar,
            address: data.user.address,
          });
          setAvatarPreview(data.user.avatar || "");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        alert("Failed to fetch user information.");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressAdd = () => {
    if (editAddressIndex !== null) {
      const updatedAddresses = formData.address.map((addr, index) =>
        index === editAddressIndex ? newAddress : addr
      );
      setFormData((prevData) => ({ ...prevData, address: updatedAddresses }));
      setEditAddressIndex(null);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        address: [...prevData.address, newAddress],
      }));
    }
    setNewAddress({
      country: "",
      city: "",
      postal_code: "",
      street: "",
    });
    setIsModalOpen(false);
  };

  const handleAddressEdit = (index) => {
    setNewAddress(formData.address[index]);
    setEditAddressIndex(index);
    setIsModalOpen(true);
  };

  const handleAddressDelete = (index) => {
    const newAddressList = formData.address.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      address: newAddressList,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setNewAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let avatarUrl = formData.avatar;
    if (newAvatar) {
      const formDataImage = new FormData();
      formDataImage.append("image", newAvatar);

      try {
        const uploadResponse = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formDataImage,
        });
        const uploadData = await uploadResponse.json();
        avatarUrl = uploadData.imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("There was a problem with the image upload: " + error.message);
        return;
      }
    }

    const updatedUser = { ...formData, avatar: avatarUrl };

    fetch(`http://localhost:3000/users/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.message === "User updated successfully") {
          setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Failed to update user information.");
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 my-12">
      <h2 className="mb-8 text-3xl font-bold">User Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={user.username}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            pattern="0[0-9]{9}"
            title="Phone number should start with 0 and be 10 digits long"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Avatar
          </label>
          <div className="mt-1 mb-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Current Avatar"
                className="w-40 h-40 rounded-full object-cover"
              />
            ) : (
              <p>Please upload an avatar</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <table className="w-full border border-gray-300 rounded-md shadow-sm">
            <thead>
              <tr>
                <th className="p-2 border-b">Country</th>
                <th className="p-2 border-b">City</th>
                <th className="p-2 border-b">Postal Code</th>
                <th className="p-2 border-b">Street</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.address.map((addr, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{addr.country}</td>
                  <td className="p-2 border-b">{addr.city}</td>
                  <td className="p-2 border-b">{addr.postal_code}</td>
                  <td className="p-2 border-b">{addr.street}</td>
                  <td className="p-2 border-b">
                    <button
                      type="button"
                      onClick={() => handleAddressEdit(index)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddressDelete(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
          >
            {editAddressIndex !== null ? "Update Address" : "Add Address"}
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Update
        </button>
      </form>
      {/* Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {editAddressIndex !== null ? "Edit Address" : "Add New Address"}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={newAddress.country}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postal_code"
                value={newAddress.postal_code}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddressAdd}
                className="px-4 py-2 bg-green-500 text-white rounded-md mr-2"
              >
                {editAddressIndex !== null ? "Update Address" : "Add Address"}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInfo;
