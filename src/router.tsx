import Layout from "@/components/layout";
import HomePage from "@/pages/home";
import { createBrowserRouter } from "react-router-dom";
import ExplorePage from "./pages/explore";
import NotFound from "./pages/404";
import ProfilePage from "./pages/profile";
import NewPage from "./pages/new";
import ActivityPage from "./pages/activity";
import { ErrorBoundary } from "./components/error-boundary";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/explore",
          element: <ExplorePage />,
        },
        {
          path: "/new",
          element: <NewPage />,
          handle: {
            back: true,
            title: "Tạo mới",
          },
        },
        {
          path: "/activity",
          element: <ActivityPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          handle: {
            profile: true,
          },
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
      ErrorBoundary,
    },
  ],
  { basename: getBasePath() }
);

export function getBasePath() {
  const urlParams = new URLSearchParams(window.location.search);
  const appEnv = urlParams.get("env");

  if (
    import.meta.env.PROD ||
    appEnv === "TESTING_LOCAL" ||
    appEnv === "TESTING" ||
    appEnv === "DEVELOPMENT"
  ) {
    return `/zapps/${window.APP_ID}`;
  }

  return window.BASE_PATH || "";
}

export default router;
