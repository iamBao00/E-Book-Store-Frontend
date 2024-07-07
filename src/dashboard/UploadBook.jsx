import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";

const UploadBook = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/category/get-all")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err.message));
  }, []);

  const [selectedCategory, setCategory] = useState("");
  const handleChangeSelectedValue = (event) => {
    setCategory(event.target.value);
  };

  const handleBookSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const title = form.title.value;
    const author = form.author.value;
    const price = form.price.value;
    const publisher = form.publisher.value;
    const description = form.description.value;
    const stock_quantity = form.stock_quantity.value;
    const category_id = form.category_id.value;
    const image = form.image.value;

    const bookObj = {
      title,
      author,
      price,
      publisher,
      description,
      stock_quantity,
      category_id,
      image,
    };
    console.log(bookObj);

    // send data to DB
    fetch("http://localhost:3000/book/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(bookObj),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.text(); // Dùng .text() thay vì .json() để đọc phản hồi như là chuỗi
      })
      .then((text) => {
        try {
          const data = JSON.parse(text); // Thử phân tích chuỗi JSON
          console.log(`Book uploaded successfully!`);
          console.log(data);
          alert("Book uploaded successfully!");
        } catch (err) {
          console.log(`Book uploaded successfully!`);
          console.log("text: " + text); // Nếu không phải JSON, chỉ in chuỗi phản hồi
          alert("Book uploaded successfully!");
        }
        form.reset();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        alert("There was a problem with the upload: " + error.message);
      });
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
            type="number"
            placeholder="Price"
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

        {/* Image URL */}
        <div className="col-span-2">
          <div className="mb-2 block">
            <Label htmlFor="image" value="Image URL" />
          </div>
          <TextInput
            id="image"
            name="image"
            type="text"
            placeholder="URL"
            className="w-full"
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
