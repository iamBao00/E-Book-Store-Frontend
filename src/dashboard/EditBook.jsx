import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import { useLoaderData, useParams } from "react-router-dom";

const EditBook = () => {
  const id = useParams();
  console.log(id);
  const book = useLoaderData();
  console.log(book);

  const [categories, setCategories] = useState([]);

  // for update  book after updated successfully
  const [currentBook, setCurrentBook] = useState(book);

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

  // Set default category
  useEffect(() => {
    if (book && book.category_name && categories.length > 0) {
      const category = categories.find(
        (cat) => cat.name === book.category_name
      );
      if (category) {
        setCategory(category._id);
      }
    }
  }, [book, categories]);

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

    // call update API
    fetch(`http://localhost:3000/book/update/${book._id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(bookObj),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json(); // Chuyển đổi phản hồi thành JSON
      })
      .then((data) => {
        console.log("Book updated successfully!");
        console.log(data);
        alert("Book updated successfully!");

        // Cập nhật trạng thái currentBook
        setCurrentBook(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        alert("There was a problem with the update: " + error.message);
      });
  };

  return (
    <div className="px-4 my-12">
      <h2 className="mb-8 text-3xl font-bold"> EDIT Book</h2>
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
            defaultValue={currentBook.category_id}
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
            defaultValue={currentBook.image}
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
