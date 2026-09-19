# Lighthouse

**The Harness status page, but it is a lighthouse.**

This app reads the public [Harness status API](https://status.harness.io/api/v2/summary.json) and turns it into a lamp on the rocks. A steady beam means the platform is operational. A flicker means something is degraded. You do not need an account, org, project, or PAT.

```
          ✨
         /|\
        / | \
       |  |  |     keep the channel
       |  |  |
    ~~~~~~~~~~~~~~~~
```

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your local browser. That is the whole station.

Do not use the LAN/`Network:` URL Next sometimes prints, and skip Cursor port-forward preview links — those often go through a proxy that shows “Accessible only on corporate network.”
