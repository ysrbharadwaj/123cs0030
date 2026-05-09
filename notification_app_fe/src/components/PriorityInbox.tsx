import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Grid, CircularProgress, TextField } from "@mui/material";
import { Log } from "../logger";

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

const getWeight = (type: string) => {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  return 1;
};

const PriorityInbox = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      await Log("info", "api", "Fetching notifications for priority inbox");
      const response = await fetch(
        "/evaluation-service/notifications",
        {
          headers: {
            Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIxMjNjczAwMzBAaWlpdGsuYWMuaW4iLCJleHAiOjE3NzgzMTE3MTIsImlhdCI6MTc3ODMxMDgxMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImExODE0MjJmLTU0ZWEtNDYzMC04MjJiLTM1MDFlZmZkYzQxMSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Inkgc3JpIHJhbWEgYmhhcmFkd2FqIiwic3ViIjoiNTNjMDExMTItNTAzNi00OWUwLWI5OGItN2M1ZDA3Yjk5NTFjIn0sImVtYWlsIjoiMTIzY3MwMDMwQGlpaXRrLmFjLmluIiwibmFtZSI6Inkgc3JpIHJhbWEgYmhhcmFkd2FqIiwicm9sbE5vIjoiMTIzY3MwMDMwIiwiYWNjZXNzQ29kZSI6InVaeVNBVCIsImNsaWVudElEIjoiNTNjMDExMTItNTAzNi00OWUwLWI5OGItN2M1ZDA3Yjk5NTFjIiwiY2xpZW50U2VjcmV0IjoiaENIUFN0eVV5dEpKTWpncCJ9.r_aOUryVSNlBkfeBz9uMLycR3-ftGZkj7GYn5_5cBgY`,
          },
        }
      );
      const data = await response.json();
      const sorted = (data.notifications || data || []).sort((a: Notification, b: Notification) => {
        const weightDiff = getWeight(b.Type) - getWeight(a.Type);
        if (weightDiff !== 0) return weightDiff;
        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
      });
      setNotifications(sorted);
      await Log("info", "component", `Priority inbox loaded with ${sorted.length} notifications`);
    } catch (error) {
      await Log("error", "api", `Failed to fetch priority notifications: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (type: string) => {
    if (type === "Placement") return "success";
    if (type === "Result") return "warning";
    return "info";
  };

  if (loading) return <CircularProgress sx={{ mt: 4, display: "block", mx: "auto" }} />;

  return (
    <>
      <TextField
        label="Show Top N Notifications"
        type="number"
        value={topN}
        onChange={(e) => {
          setTopN(Number(e.target.value));
          Log("info", "component", `Top N changed to ${e.target.value}`);
        }}
        sx={{ mb: 3 }}
        slotProps={{ htmlInput: { min: 1 } }}
      />
      <Grid container spacing={2}>
        {notifications.slice(0, topN).map((n, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={n.ID}>
            <Card sx={{ border: "2px solid #1976d2" }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">#{index + 1} Priority</Typography>
                <br />
                <Chip label={n.Type} color={getColor(n.Type) as any} size="small" sx={{ mb: 1 }} />
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

export default PriorityInbox;