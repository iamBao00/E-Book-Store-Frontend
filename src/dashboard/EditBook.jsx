import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  FileInput,
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
      category_id,
      image: imageUrl,
    };

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
      console.log("Book updated successfully!");
      console.log(data);
      alert("Book updated successfully!");
      setCurrentBook(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("There was a problem with the update: " + error.message);
    }
  };

  return (
    <div className="px-4 my-12">
      <h2 className="mb-8 text-3xl font-bold">EDIT Book</h2>
      <form
        onSubmit={handleBookSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
      >
        {/* Book title */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Book Title" />
          </div>
          <TextInput
            id="title"
            name="title"
            type="text"
            placeholder="Book name"
            className="w-full"
            required
            defaultValue={currentBook.title}
          />
        </div>

        {/* Author's name */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="author" value="Author's Name" />
          </div>
          <TextInput
            id="author"
            name="author"
            type="text"
            placeholder="Author's name"
            className="w-full"
            required
            defaultValue={currentBook.author}
          />
        </div>

        {/* Price */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="price" value="Price" />
          </div>
          <TextInput
            id="price"
            name="price"
            type="number"
            placeholder="Price"
            className="w-full"
            required
            defaultValue={currentBook.price}
          />
        </div>

        {/* Publisher */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="publisher" value="Publisher" />
          </div>
          <TextInput
            id="publisher"
            name="publisher"
            type="text"
            placeholder="Publisher"
            className="w-full"
            required
            defaultValue={currentBook.publisher}
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <div className="mb-2 block">
            <Label htmlFor="description" value="Description" />
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            className="w-full"
            rows={4}
            required
            defaultValue={currentBook.description}
          />
        </div>

        {/* Quantity */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="stock_quantity" value="Quantity" />
          </div>
          <TextInput
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            placeholder="Quantity"
            className="w-full"
            required
            defaultValue={currentBook.stock_quantity}
          />
        </div>

        {/* Category */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="inputState" value="Book Category" />
          </div>
          <Select
            id="inputState"
            name="category_id"
            className="w-full rounded"
            value={selectedCategory}
            onChange={handleChangeSelectedValue}
            required
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
        <div className="col-span-2">
          <div className="mb-2 block">
            <Label htmlFor="image" value="Image" />
          </div>
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Current Book Cover"
              className="w-40 h-auto"
            />
          </div>
          <FileInput
            id="image"
            name="image"
            type="file"
            onChange={handleImageChange}
          />
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
