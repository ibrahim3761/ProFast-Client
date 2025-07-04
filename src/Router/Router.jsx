import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoutes from "../Routes/PrivateRoutes";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layouts/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../Pages/BeARider/BeARider";
import PendingRider from "../Pages/Dashboard/PendingRiders/PendingRIder";
import AcceptedRiders from "../Pages/Dashboard/AcceptedRiders/AcceptedRiders";
import ManageAdmins from "../Pages/Dashboard/MangeAdmins/ManageAdmins";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoutes from "../Routes/AdminRoutes";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import PendingDeliveries from "../Pages/Dashboard/PendingDeliveries/PendingDeliveries";
import RiderRoutes from "../Routes/RiderRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path:"forbidden",
        Component: Forbidden
      },
      {
        path: "coverage",
        Component: Coverage,
        loader: () => fetch("../../public/serviceCenter.json"),
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRoutes>
            <SendParcel></SendParcel>
          </PrivateRoutes>
        ),
      },
      {
        path: "beARider",
        element: <PrivateRoutes><BeARider></BeARider></PrivateRoutes>
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),
    children: [
      {
        path: "myparcels",
        Component: MyParcels,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "paymetnHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      {
        path: "pending-riders",
        element: <AdminRoutes><PendingRider></PendingRider></AdminRoutes>
      },
      {
        path: "accepted-riders",
        element: <AdminRoutes><AcceptedRiders></AcceptedRiders></AdminRoutes>
      },
      {
        path: 'manage-admins',
        element: <AdminRoutes><ManageAdmins></ManageAdmins></AdminRoutes>
      },
      {
        path: 'assign-rider',
        element: <AdminRoutes><AssignRider></AssignRider></AdminRoutes>
      },
      {
        path: 'pending-deliveries',
        element: <RiderRoutes><PendingDeliveries></PendingDeliveries></RiderRoutes>
      }
    ],
  },
]);
