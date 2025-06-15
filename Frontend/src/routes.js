// import
import Dashboard from "views/Dashboard/Dashboard.js";
import SignIn from "views/Pages/SignIn.js";
import ManageDriver from "views/Dashboard/ManageDriver";
import ManageVehicle from "views/Dashboard/ManageVehicle";
import CreateBooking from "views/Dashboard/CreateBooking";
import DashboardApprover from "views/Approval/Approval";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Approval",
    component: DashboardApprover,
    layout: "/approver",
  },
    {
    path: "/booking",
    name: "Manage Booking",
    component: CreateBooking,
    layout: "/admin",
  },
  {
    path: "/driver",
    name: "Manage Driver",
    component: ManageDriver,
    layout: "/admin",
  },
  {
    path: "/vehicle",
    name: "Manage Vehicle",
    component: ManageVehicle,
    layout: "/admin",
  },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/signin",
        name: "Sign In",
        component: SignIn,
        layout: "/auth",
      },
    ],
  },
];
export default dashRoutes;
