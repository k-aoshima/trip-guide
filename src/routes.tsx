import { createBrowserRouter } from "react-router";
import { TripViewer } from "@/features/viewer/TripViewer";
import { SAMPLE_PLANS } from "@/data/sample-plans";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <TripViewer plans={SAMPLE_PLANS} />,
  },
]);
