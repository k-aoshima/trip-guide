import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "@/features/home/HomePage";
import { SignInPage } from "@/features/auth/SignInPage";
import { NewTripPage } from "@/features/create/NewTripPage";
import { TripViewerPage } from "@/features/viewer/TripViewerPage";

export const router = createBrowserRouter([
  // 今は 10/12〜14 の旅程だけを使うので、開いたらいきなりその画面にする。
  // 一覧(ホーム)は /home に残してある
  { path: "/", element: <Navigate to="/trip/matsumoto-himi-3days" replace /> },
  { path: "/home", element: <HomePage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/new", element: <NewTripPage /> },
  { path: "/trip/:id", element: <TripViewerPage /> },
  { path: "/p/:public_id", element: <TripViewerPage /> },
  // Phase 1.0 ではまだ作っていない画面はホームへ
  { path: "/library", element: <Navigate to="/" replace /> },
  { path: "/discover", element: <Navigate to="/" replace /> },
  { path: "/profile", element: <Navigate to="/signin" replace /> },
]);
