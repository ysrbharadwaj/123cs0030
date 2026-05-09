const ACCESS_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIxMjNjczAwMzBAaWlpdGsuYWMuaW4iLCJleHAiOjE3NzgzMTE3MTIsImlhdCI6MTc3ODMxMDgxMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImExODE0MjJmLTU0ZWEtNDYzMC04MjJiLTM1MDFlZmZkYzQxMSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Inkgc3JpIHJhbWEgYmhhcmFkd2FqIiwic3ViIjoiNTNjMDExMTItNTAzNi00OWUwLWI5OGItN2M1ZDA3Yjk5NTFjIn0sImVtYWlsIjoiMTIzY3MwMDMwQGlpaXRrLmFjLmluIiwibmFtZSI6Inkgc3JpIHJhbWEgYmhhcmFkd2FqIiwicm9sbE5vIjoiMTIzY3MwMDMwIiwiYWNjZXNzQ29kZSI6InVaeVNBVCIsImNsaWVudElEIjoiNTNjMDExMTItNTAzNi00OWUwLWI5OGItN2M1ZDA3Yjk5NTFjIiwiY2xpZW50U2VjcmV0IjoiaENIUFN0eVV5dEpKTWpncCJ9.r_aOUryVSNlBkfeBz9uMLycR3-ftGZkj7GYn5_5cBgY`;

export async function Log(level: string, pkg: string, message: string): Promise<void> {
  try {
    await fetch("/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack: "frontend",
        level: level,
        package: pkg,
        message: message,
      }),
    });
  } catch (error) {
    console.error("Logging failed:", error);
  }
}