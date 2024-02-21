import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import Projects from "./Projects";
import Root from "./Root";
import Inbox from "./Inbox";
import NextActions from "./NextActions";
import ProjectDetail from "./ProjectDetail";
import CalendarDetail from "./CalendarDetail";
import Calendar from "./Calendar";
import NextActionDetail from "./NextActionDetail";
import References from "./References";
import ReferenceDetail from "./ReferenceDetail";
import ReferenceDecide from "./ReferenceDecide";
import InboxDetail from "./InboxDetail";
import Someday from "./Someday";
import SomedayDetail from "./SomedayDetail";
import WaitingFor from "./WaitingFor";
import WaitingForDetail from "./WaitingForDetail";
import { useCallback, useEffect, useState } from "react";
import {
  PersistentStorage,
  PersistentStorageContext,
} from "utils/PersistentStorage";
import RemoteStorage from "utils/RemoteStorage";
import Habits from "./Habits";
import HabitDetail from "./HabitDetail";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "inbox/:id",
        element: <InboxDetail />,
      },
      {
        path: "inbox/:id/reference-decide",
        element: <ReferenceDecide />,
      },
      {
        path: "next-actions",
        element: <NextActions />,
      },
      {
        path: "next-actions/:id",
        element: <NextActionDetail />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetail />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "calendar/:id",
        element: <CalendarDetail />,
      },
      {
        path: "references",
        element: <References />,
      },
      {
        path: "references/:id",
        element: <ReferenceDetail />,
      },
      {
        path: "someday",
        element: <Someday />,
      },
      {
        path: "someday/:id",
        element: <SomedayDetail />,
      },
      {
        path: "waiting-for",
        element: <WaitingFor />,
      },
      {
        path: "waiting-for/:id",
        element: <WaitingForDetail />,
      },
      {
        path: "habits",
        element: <Habits />,
      },
      {
        path: "habits/:id",
        element: <HabitDetail />,
      },
      {
        path: "",
        element: <Navigate to="/inbox" replace />,
      },
    ],
  },
]);

export default function App() {
  const [remoteStorage, setRemoteStorage] = useState<PersistentStorage | null>(
    null
  );

  const loadData = useCallback(async () => {
    const remoteStorage = new RemoteStorage();

    await remoteStorage.load();

    setRemoteStorage(remoteStorage);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PersistentStorageContext.Provider value={remoteStorage}>
      <RouterProvider router={router} />
    </PersistentStorageContext.Provider>
  );
}
