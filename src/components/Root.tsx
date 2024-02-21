import { NavLink, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <section className="columns section">
      <aside className="menu column is-2">
        <p className="menu-label">Planner</p>
        <ul className="menu-list">
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/inbox"
            >
              Inbox
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/next-actions"
            >
              Next Actions
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/projects"
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/calendar"
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/waiting-for"
            >
              Waiting For
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/references"
            >
              References
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/someday"
            >
              Someday Maybe
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/habits"
            >
              Habits
            </NavLink>
          </li>
        </ul>
      </aside>
      <main className="column is-10 block is-flex is-flex-direction-column is-flex-grow-1">
        <Outlet />
      </main>
    </section>
  );
}
