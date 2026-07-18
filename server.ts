import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import pkg from "agora-token";
const { RtcTokenBuilder, RtcRole, ChatTokenBuilder } = pkg;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing middleware
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Agora Secure Token & Registration API Endpoint
  app.post("/api/agora-token", async (req, res) => {
    try {
      const { channelName, username } = req.body;
      if (!channelName || !username) {
        return res.status(400).json({ error: "Missing channelName or username" });
      }

      const appId = "dfbc3a91eef84f19af236a1b4ce68c04";
      const appCertificate = "9efa82a366e84bd68420cda1c62c9e01";

      // 1. Clean username for Agora Chat compatibility
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "user_" + Math.floor(Math.random() * 1000);
      const password = "voxa_password_123";

      // 2. Build RTC Token
      const rtcRole = RtcRole.PUBLISHER;
      const expirationTimeInSeconds = 3600;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

      const rtcToken = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        0, // Join as 0 (any dynamic user)
        rtcRole,
        privilegeExpiredTs,
        privilegeExpiredTs
      );

      // 3. Build Chat App Token to interact with REST API securely
      const chatAppToken = ChatTokenBuilder.buildAppToken(appId, appCertificate, 3600);

      const orgName = "61200050902";
      const appName = "200070910";
      const restUrl = "a61.chat.agora.io";

      // 4. Register Agora Chat User Server-Side via Secure REST Call
      try {
        const registerResponse = await fetch(
          `https://${restUrl}/${orgName}/${appName}/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${chatAppToken}`
            },
            body: JSON.stringify({
              username: cleanUsername,
              password: password,
              nickname: username
            })
          }
        );

        if (registerResponse.ok) {
          console.log(`[Agora Server] Successfully registered chat user: ${cleanUsername}`);
        } else {
          const errBody = await registerResponse.json().catch(() => ({}));
          console.log(`[Agora Server] Chat registration non-ok response:`, JSON.stringify(errBody));
        }
      } catch (regErr: any) {
        console.warn(`[Agora Server] REST registration attempt completed:`, regErr.message);
      }

      // 5. Generate Secure Chat User Token for Client Authentication
      const chatUserToken = ChatTokenBuilder.buildUserToken(appId, appCertificate, cleanUsername, 3600);

      res.json({
        rtcToken,
        chatToken: chatUserToken,
        cleanUsername,
        password
      });
    } catch (err: any) {
      console.error("[Agora Server] Token generation/registration error:", err);
      res.status(500).json({ error: "Failed to build tokens", message: err.message });
    }
  });

  // Vite middleware setup for development, or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fullstack Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
