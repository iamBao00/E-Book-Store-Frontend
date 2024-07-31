import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Label, Table } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editedCategoryName, setEditedCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/category/get-all");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch("http://localhost:3000/category/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      // Reload the page to reflect changes
      window.location.reload();

      setNewCategoryName("");
      setAddModalOpen(false);
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/category/update/${currentCategory._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editedCategoryName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      // Reload the page to reflect changes
      window.location.reload();

      setCurrentCategory(null);
      setEditModalOpen(false);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/category/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Reload the page to reflect changes
      window.location.reload();

      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Manage Categories</h2>
      <Button
        onClick={() => setAddModalOpen(true)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white"
      >
        Add Category
      </Button>

      {/* Category List */}
      <Table>
        <Table.Head>
          <Table.HeadCell className="w-1/2">Name</Table.HeadCell>
          <Table.HeadCell className="w-1/2">Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category._id}>
              <Table.Cell className="w-1/2">{category.name}</Table.Cell>
              <Table.Cell className="flex space-x-2 w-1/2">
                <Button
                  onClick={() => {
                    setCurrentCategory(category);
                    setEditedCategoryName(category.name);
                    setEditModalOpen(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-500 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Add Category Modal */}
      <Modal show={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <Modal.Header>Add Category</Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <Label htmlFor="newCategoryName" value="Category Name" />
            <TextInput
              id="newCategoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleAddCategory}
            className="bg-blue-500 hover:bg-blue-700 text-white"
          >
            Add
          </Button>
          <Button
            onClick={() => setAddModalOpen(false)}
            className="bg-gray-500 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <Modal.Header>Edit Category</Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <Label htmlFor="editedCategoryName" value="Category Name" />
            <TextInput
              id="editedCategoryName"
              value={editedCategoryName}
              onChange={(e) => setEditedCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleEditCategory}
            className="bg-yellow-500 hover:bg-yellow-700 text-white"
          >
            Save
          </Button>
          <Button
            onClick={() => setEditModalOpen(false)}
            className="bg-gray-500 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer />
    </div>
  );
};

export default ManageCategory;
