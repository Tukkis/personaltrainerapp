import { Outlet, Link } from "react-router-dom";


export default function Layout() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
            <li>
              <Link to="/trainings">Trainings</Link>
            </li>
            <li>
              <Link to="/calendar">Calendar</Link>
            </li>
          </ul>
        </nav>
  
        <hr />
        <Outlet />
      </div>
    );
}