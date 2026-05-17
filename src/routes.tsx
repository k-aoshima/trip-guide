import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "@/features/home/HomePage";
import { SignInPage } from "@/features/auth/SignInPage";
import { NewTripPage } from "@/features/create/NewTripPage";
import { TripViewerPage } from "@/features/viewer/TripViewerPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/new", element: <NewTripPage /> },
  { path: "/trip/:id", element: <TripViewerPage /> },
  { path: "/p/:public_id", element: <TripViewerPage /> },
  // Phase 1.0 ではまだ作っていない画面はホームへ
  { path: "/library", element: <Navigate to="/" replace /> },
  { path: "/discover", element: <Navigate to="/" replace /> },
  { path: "/profile", element: <Navigate to="/signin" replace /> },
]);
