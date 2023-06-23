import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";
import LoginPage from "./pages/login";
import Contact from "./pages/contact";
import BookPage from "./pages/book";
import Header from "./components/Header/index";
import Footer from "./components/Footer/index";
import Home from "./components/Home/index";
import RegisterPage from "./pages/register/index";
import { callFetchAccount } from "./service/api";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlide";
import Loading from "./components/Loading/index";
import AdminPage from "./pages/admin/index";
import ProtectedRoute from "./components/ProtectedRoute/index";
import NotFound from "./components/NotFound";
import UserTable from "./pages/admin/user/UserTable";
import BookPageAdmin from "./pages/admin/book/index";
import OrderPage from "./pages/order/OrderPage";
import HistoryPage from "./pages/history/HistoryPage";
import DashBoardPage from "./pages/admin/dashboard";
import OrderTable from "./pages/admin/order/OrderTable";
const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const LayoutAdmin = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  const userRole = user.role;
  return (
    <div className="layout-app">
      {/* {isAdminRoute&& userRole==="ADMIN"&& <Header />} */}
      <AdminPage>
        <Outlet style={{ backgroundColor: "#f4f4f4" }} />
      </AdminPage>

      {/* {isAdminRoute&& userRole==="ADMIN"&& <Footer />} */}
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.account.isLoading);

  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "order",
          element: <OrderPage />,
        },
        {
          path: "history",
          element: <HistoryPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <DashBoardPage />
            </ProtectedRoute>
          ),
        },

        {
          path: "user",
          element: (
            <>
              <UserTable />
            </>
          ),
        },
        {
          path: "book",
          element: <BookPageAdmin />,
        },
        {
          path: "order",
          element: <OrderTable />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
      errorElement: <NotFound />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
      errorElement: <NotFound />,
    },
  ]);
  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
