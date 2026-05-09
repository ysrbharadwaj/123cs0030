import React, { useEffect, useState } from "react";
import { Container, AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";
import NotificationList from "./components/NotificationList";
import PriorityInbox from "./components/PriorityInbox";
import { Log } from "./logger";

function App() {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    Log("info", "component", "App loaded successfully");
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    Log("info", "component", `Tab changed to ${newValue === 0 ? "All Notifications" : "Priority Inbox"}`);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Campus Notifications</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>
      </Box>
      <Container sx={{ mt: 3 }}>
        {tab === 0 && <NotificationList />}
        {tab === 1 && <PriorityInbox />}
      </Container>
    </>
  );
}

export default App;