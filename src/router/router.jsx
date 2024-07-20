import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import Blog from "../components/Blog";
import SingleBook from "../shop/SingleBook";
import DashboardLayout from "../dashboard/DashboardLayout";
import ManageCategory from "../dashboard/ManageCategory";
import UploadBook from "../dashboard/UploadBook";
import ManageBook from "../dashboard/ManageBook";
import EditBook from "../dashboard/EditBook";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import { User } from "../user/User";
import PrivateRoute from "../dashboard/PrivateRoute";
import ManageCart from "../user/ManageCart";
import PaymentPage from "../user/PaymentPage";
import OrderHistory from "../user/OrderHistory";
import ManageOrder from "../dashboard/ManageOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/book/:id",
        element: <SingleBook />,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/book/getById/${params.id}`),
      },
    ],
  },
  {
    path: "/admin/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/admin/dashboard/category",
        element: <ManageCategory />,
      },
      {
        path: "/admin/dashboard/upload",
        element: <UploadBook />,
      },
      {
        path: "/admin/dashboard",
        element: <ManageBook />,
      },
      {
        path: "/admin/dashboard/edit/:id",
        element: <EditBook />,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/book/getById/${params.id}`),
      },
      {
        path: "/admin/dashboard/order",
        element: <ManageOrder />,
      },
    ],
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/user",
    element: <User />,
    children: [
      {
        path: "/user/manage-cart",
        element: <ManageCart />,
      },
      { path: "/user/payment", element: <PaymentPage /> },

      { path: "/user/order-history", element: <OrderHistory /> },
    ],
  },
]);

export default router;
