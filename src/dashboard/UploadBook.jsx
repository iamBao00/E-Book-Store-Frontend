import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";

const UploadBook = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/category/get-all")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err.message));
  }, []);

  const handleChangeSelectedValue = (event) => {
    setCategory(event.target.value);
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
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

    try {
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        // Gửi yêu cầu tới endpoint /upload để tải ảnh lên
        const uploadResponse = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl; // Lấy URL ảnh từ phản hồi
      }

      // Gửi thông tin sách tới endpoint /book/add
      const bookObj = {
        title,
        author,
        price,
        publisher,
        description,
        stock_quantity,
        category_id,
        image: imageUrl, // Sử dụng URL của ảnh
      };

      const bookResponse = await fetch("http://localhost:3000/book/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(bookObj),
      });

      if (!bookResponse.ok) {
        throw new Error(
          "Network response was not ok " + bookResponse.statusText
        );
      }

      const msg = await bookResponse.json();
      console.log("Book uploaded successfully!", msg);
      alert("Book uploaded successfully!");
      form.reset();
      setImageFile(null); // Clear image file after upload
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("There was a problem with the upload: " + error.message);
    }
  };

  return (
    <div className="px-4 my-12">
      <h2 className="mb-8 text-3xl font-bold"> Upload a Book</h2>
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
            type="text"
            placeholder="Price"
            pattern="^\d+(\.\d{1,2})?$"
            className="w-full"
            required
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
            <option value=""></option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Image Upload */}
        <div className="col-span-2">
          <div className="mb-2 block">
            <Label htmlFor="image" value="Upload Image" />
          </div>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleImageChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-2">
          <Button
            type="submit"
            className="flex w-full mt-5 bg-blue-500 hover:bg-blue-700 text-white items-center justify-center"
          >
            Upload Book
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadBook;
