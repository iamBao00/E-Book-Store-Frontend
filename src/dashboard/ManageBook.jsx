import React, { useEffect, useState } from "react";
import { Button, Table, TableBody } from "flowbite-react";
import { Link } from "react-router-dom";

const ManageBook = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/book/get-all")
      .then((res) => res.json())
      .then((data) => setAllBooks(data));
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/book/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.msg);
        setAllBooks(allBooks.filter((book) => book._id !== id));
      } else {
        alert(data.msg); // Display the message from backend
      }
    } catch (error) {
      console.error("There was a problem with the delete operation:", error);
      alert("There was a problem with the delete operation.");
    }
  };

  // Filter books based on search query
  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 my-12">
      <h2 className="mb-8 text-3xl font-bold">Manage Your Book</h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded-md w-full"
        />
      </div>

      {/* Table for book data */}
      <Table className="lg:w-[1180px]">
        <Table.Head>
          <Table.HeadCell>No</Table.HeadCell>
          <Table.HeadCell>Book Title</Table.HeadCell>
          <Table.HeadCell>Author's Name</Table.HeadCell>
          <Table.HeadCell>Publisher</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Sold</Table.HeadCell>
          <Table.HeadCell>Active</Table.HeadCell>
          <Table.HeadCell>Stock Quantity</Table.HeadCell>
          <Table.HeadCell>Reviews Quantity</Table.HeadCell>
          <Table.HeadCell>
            <span>Edit or Manage</span>
          </Table.HeadCell>
        </Table.Head>

        {filteredBooks.map((book, index) => (
          <TableBody className="divide-y" key={book._id}>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {index + 1}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {book.title}
              </Table.Cell>
              <Table.Cell>{book.author}</Table.Cell>
              <Table.Cell>{book.publisher}</Table.Cell>
              <Table.Cell>{book.category_name}</Table.Cell>
              <Table.Cell>{book.price}</Table.Cell>
              <Table.Cell>{book.sold}</Table.Cell>
              <Table.Cell>{book.is_active ? "Yes" : "No"}</Table.Cell>
              <Table.Cell>{book.stock_quantity}</Table.Cell>
              <Table.Cell>{book.reviews.length}</Table.Cell>
              <Table.Cell>
                <div className="flex space-x-2">
                  <Link to={`/admin/dashboard/edit/${book._id}`}>
                    <Button color="warning">Edit</Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(book._id)}
                    color="failure"
                  >
                    Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          </TableBody>
        ))}
      </Table>
    </div>
  );
};

export default ManageBook;
