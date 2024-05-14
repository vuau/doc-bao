import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import List from "./components/list";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <List />,
      },
      {
        path: "doc-bao/:tag",
        element: <List />,
      },
      {
        path: "doc-bao/:tag?url=:url",
        element: <List />,
      },
    ],
  },
]);
