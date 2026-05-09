import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Grid, CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Log } from "../logger";

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [viewed, setViewed] = useState<string[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      await Log("info", "api", "Fetching all notifications");
      const response = await fetch(
        "/evaluation-service/notifications",
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIxMjNjczAwMzBAaWlpdGsuYWMuaW4iLCJleHAiOjE3NzgzMTE3MTIsImlhdCI6MTc3ODMxMDgxMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImExODE0MjJmLTU0ZWEtNDYzMC04MjJiLTM1MDFlZmZkYzQxMSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Inkgc3JpIHJhbWEgYmhhcmFkd2FqIiwic3ViIjoiNTNjMDExMTItNTAzNi00OWUwLWI5OGItN2M1ZDA3Yjk5NTFjIn0sImVtYWlsIjoiMTIzY3MwMDMwQGlpaXRrLmFjLmluIiwibmFtZSI6Inkgc3JpIHJhbWEgYmhhcmFkd2FqIiwicm9sbE5vIjoiMTIzY3MwMDMwIiwiYWNjZXNzQ29kZSI6InVaeVNBVCIsImNsaWVudElEIjoiNTNjMDExMTItNTAzNi00OWUwLWI5OGItN2M1ZDA3Yjk5NTFjIiwiY2xpZW50U2VjcmV0IjoiaENIUFN0eVV5dEpKTWpncCJ9.r_aOUryVSNlBkfeBz9uMLycR3-ftGZkj7GYn5_5cBgY`,
          },
        }
      );
      const data = await response.json();
      console.log("API RESPONSE:", data);
      const list = Array.isArray(data) ? data : data.notifications || data.data || [];
      setNotifications(list);
      await Log("info", "api", `Fetched ${list.length} notifications`);
    } catch (error) {
      await Log("error", "api", `Failed to fetch notifications: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    if (!viewed.includes(id)) {
      setViewed([...viewed, id]);
      Log("info", "component", `Notification ${id} marked as viewed`);
    }
  };

  const filtered = filter === "All" ? notifications : notifications.filter((n) => n.Type === filter);

  const getColor = (type: string) => {
    if (type === "Placement") return "success";
    if (type === "Result") return "warning";
    return "info";
  };

  if (loading) return <CircularProgress sx={{ mt: 4, display: "block", mx: "auto" }} />;

  return (
    <>
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select value={filter} label="Filter by Type" onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={2} component="div">
        {filtered.map((n) => (
          <Grid size={{ xs: 12, md: 6 }} key={n.ID}>
            <Card
              onClick={() => handleView(n.ID)}
              sx={{
                cursor: "pointer",
                border: viewed.includes(n.ID) ? "1px solid #ccc" : "2px solid #1976d2",
                opacity: viewed.includes(n.ID) ? 0.7 : 1,
              }}
            >
              <CardContent>
                <Chip label={n.Type} color={getColor(n.Type) as any} size="small" sx={{ mb: 1 }} />
                {!viewed.includes(n.ID) && (
                  <Chip label="New" color="error" size="small" sx={{ mb: 1, ml: 1 }} />
                )}
                <Typography variant="body1">{n.Message}</Typography>
                <Typography variant="caption" color="text.secondary">{n.Timestamp}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default NotificationList;