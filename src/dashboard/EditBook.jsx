import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  FileInput,
  Checkbox,
} from "flowbite-react";
import { useLoaderData, useParams } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const book = useLoaderData();
  const [categories, setCategories] = useState([]);
  const [currentBook, setCurrentBook] = useState(book);
  const [selectedCategory, setCategory] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(book.image);
  const [isActive, setIsActive] = useState(book.is_active);

  useEffect(() => {
    // Fetch all categories
    fetch("http://localhost:3000/category/get-all")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        // Set default category after fetching categories
        if (book && book.category_id) {
          const category = data.find((cat) => cat._id === book.category_id);
          if (category) {
            setCategory(category._id);
          }
        }
      })
      .catch((err) => console.log(err.message));
  }, [book]);

  const handleChangeSelectedValue = (event) => {
    setCategory(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "is_active") {
      setIsActive(checked);
    } else {
      setCurrentBook({
        ...currentBook,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleBookSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const title = form.title.value;
    const author = form.author.value;
    const price = form.price.value;
    const publisher = form.publisher.value;
    const description = form.description.value;
    const stock_quantity = form.stock_quantity.value;
    const category_id = form.category_id.value;

    let imageUrl = currentBook.image;
    if (newImage) {
      const formData = new FormData();
      formData.append("image", newImage);

      try {
        const uploadResponse = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("There was a problem with the image upload: " + error.message);
        return;
      }
    }

    const bookObj = {
      title,
      author,
      price,
      publisher,
      description,
      stock_quantity,
      image: imageUrl,
      is_active: isActive,
    };
    if (category_id !== "") bookObj.category_id = category_id;
    console.log("bookObj");
    console.log(bookObj);

    try {
      const response = await fetch(
        `http://localhost:3000/book/update/${book._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(bookObj),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Book updated successfully!");
        console.log(data);
        alert("Book updated successfully!");
        setCurrentBook(data);
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("There was a problem with the update: " + error.message);
    }
  };

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="mb-8 text-3xl font-bold text-center">Edit Book</h2>
      <form
        onSubmit={handleBookSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
      >
        {/* Book title */}
        <div>
          <Label htmlFor="title" value="Book Title" />
          <TextInput
            id="title"
            name="title"
            type="text"
            placeholder="Book name"
            className="w-full mt-1"
            required
            value={currentBook.title}
            onChange={handleInputChange}
          />
        </div>

        {/* Author's name */}
        <div>
          <Label htmlFor="author" value="Author's Name" />
          <TextInput
            id="author"
            name="author"
            type="text"
            placeholder="Author's name"
            className="w-full mt-1"
            required
            value={currentBook.author}
            onChange={handleInputChange}
          />
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price" value="Price" />
          <TextInput
            id="price"
            name="price"
            type="text"
            placeholder="Price"
            pattern="^\d+(\.\d{1,2})?$"
            className="w-full mt-1"
            required
            value={currentBook.price}
            onChange={handleInputChange}
          />
        </div>

        {/* Publisher */}
        <div>
          <Label htmlFor="publisher" value="Publisher" />
          <TextInput
            id="publisher"
            name="publisher"
            type="text"
            placeholder="Publisher"
            className="w-full mt-1"
            required
            value={currentBook.publisher}
            onChange={handleInputChange}
          />
        </div>

        {/* Description */}
        <div className="lg:col-span-2">
          <Label htmlFor="description" value="Description" />
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            className="w-full mt-1"
            rows={4}
            required
            value={currentBook.description}
            onChange={handleInputChange}
          />
        </div>

        {/* Quantity */}
        <div>
          <Label htmlFor="stock_quantity" value="Quantity" />
          <TextInput
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            placeholder="Quantity"
            className="w-full mt-1"
            required
            value={currentBook.stock_quantity}
            onChange={handleInputChange}
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="inputState" value="Book Category" />
          <Select
            id="inputState"
            name="category_id"
            className="w-full mt-1"
            value={selectedCategory}
            onChange={handleChangeSelectedValue}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Image */}
        <div className="lg:col-span-2">
          <Label htmlFor="image" value="Image" />
          <div className="mt-1 mb-4">
            <img
              src={imagePreview}
              alt="Current Book Cover"
              className="w-40 h-auto rounded-lg"
            />
          </div>
          <FileInput
            id="image"
            name="image"
            type="file"
            onChange={handleImageChange}
          />
        </div>

        {/* Active */}
        <div className="flex items-center">
          <Checkbox
            id="is_active"
            name="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <Label htmlFor="is_active" value="Active" className="ml-2" />
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-2">
          <Button
            type="submit"
            className="flex w-full mt-5 bg-blue-500 hover:bg-blue-700 text-white items-center justify-center"
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
