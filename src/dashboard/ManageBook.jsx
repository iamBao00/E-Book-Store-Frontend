import React, { useEffect, useState } from "react";
import { Button, Table, TableBody } from "flowbite-react";
import { Link } from "react-router-dom";

const ManageBook = () => {
  const [allBooks, setAllBooks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/book/get-all")
      .then((res) => res.json())
      .then((data) => setAllBooks(data));
  }, []);

  console.log(allBooks);

  // delete a book
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/book/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.text(); // Dùng .text() thay vì .json() để đọc phản hồi như là chuỗi
      })
      .then((text) => {
        console.log("text: " + text); // Nếu không phải JSON, chỉ in chuỗi phản hồi
        alert("Book deleted successfully!");
        setAllBooks(allBooks.filter((book) => book._id !== id));
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch(delete) operation:",
          error
        );
        alert("There was a problem with the delete: " + error.message);
      });
  };

  return (
    <div className="px-4 my-12">
      <h2 className="mb-8 text-3xl font-bold"> Manage Your Book</h2>

      {/* Table for book data */}
      <Table className="lg:w-[1180px]">
        <Table.Head>
          <Table.HeadCell>No</Table.HeadCell>
          <Table.HeadCell>Book title</Table.HeadCell>
          <Table.HeadCell>Author's name</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>
            <span>Edit or Manage</span>
          </Table.HeadCell>
        </Table.Head>

        {allBooks.map((book, index) => (
          <TableBody className="divide-y" key={book._id}>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {index + 1}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {book.title}
              </Table.Cell>
              <Table.Cell>{book.author}</Table.Cell>
              <Table.Cell>{book.category_name}</Table.Cell>
              <Table.Cell>{book.price}</Table.Cell>
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
