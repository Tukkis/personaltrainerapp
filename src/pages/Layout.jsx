import { Box } from "@mui/material";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {

    return (
      <>
        <nav style={{display: 'flex'}}>
          <Box style={{margin:'5px'}}>
            <Link to="/">Home</Link>
          </Box>
          <Box style={{margin:'5px'}}>
            <Link to="/customers">Customers</Link>
          </Box>
          <Box style={{margin:'5px'}}>
            <Link to="/trainings">Trainings</Link>
          </Box>
          <Box style={{margin:'5px'}}>
            <Link to="/calendar">Calendar</Link>
          </Box>
          <Box style={{margin:'5px'}}>
            <Link to="/stats">Stats</Link>
          </Box>
        </nav>
  
        <hr />
        <Outlet style={{width:"100%"}} />
      </>
    );
}