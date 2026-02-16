# Master Micro-Frontend Shell - Deployment Guide

## Overview

This guide explains how to deploy the Angular Shell and the 3 React games to production on the Bajaj CDN.

## Architecture

```
balicuat.bajajlifeinsurance.com/gamification/
├── shell/                    # Angular Shell (Host)
│   ├── index.html
│   ├── *.js
│   └── assets/
│       └── federation.manifest.json
├── scramble-words/          # Game 1
│   ├── index.html
│   ├── index.js (main bundle)
│   └── assets/
├── life-goals/              # Game 2
│   ├── index.html
│   ├── index.js (main bundle)
│   └── assets/
│       └── videos/          # Heavy MP4 assets
└── quiz-game/               # Game 3
    ├── index.html
    ├── index.js (main bundle)
    └── assets/
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm (install with: `npm install -g pnpm`)

### 1. Install Dependencies

**Angular Shell:**

```bash
cd angular-shell
pnpm install
```

**Each Game:**

```bash
cd Scramble-Words
pnpm install

cd ../game12
pnpm install

cd ../quiz-game
pnpm install
```

### 2. Run Locally

**Start Angular Shell:**

```bash
cd angular-shell
ng serve --port 4200
```

**Start Games (in separate terminals):**

```bash
# Terminal 1
cd Scramble-Words
pnpm dev  # Runs on port 5001

# Terminal 2
cd game12
pnpm dev  # Runs on port 5002

# Terminal 3
cd quiz-game
pnpm dev  # Runs on port 5003
```

### 3. Test Locally

- **Lobby**: http://localhost:4200
- **Direct Game Access**: http://localhost:4200/play/life-goals
- **JWT Auth Flow**: http://localhost:4200/auth?token=<YOUR_JWT_TOKEN>

---

## Production Build

### 1. Build All Games

```bash
# Build Scramble Words
cd Scramble-Words
pnpm build
# Output: dist/

# Build Life Goals
cd game12
pnpm build
# Output: dist/

# Build Quiz Game
cd quiz-game
pnpm build
# Output: dist/
```

### 2. Build Angular Shell

```bash
cd angular-shell
ng build --configuration production
# Output: dist/angular-shell/browser/
```

### 3. Update Production Manifest

Before building the Shell, ensure `src/assets/federation.manifest.json` uses production URLs or create a separate production manifest and swap it during deployment.

**Production Manifest** (already created at `federation.manifest.prod.json`):

- Use this file in production by copying it to `assets/federation.manifest.json` after build

---

## Deployment to Bajaj CDN

### Directory Structure on Server

```
/var/www/balicuat.bajajlifeinsurance.com/gamification/
├── shell/                    # Angular Shell build output
├── scramble-words/          # Game 1 build output
├── life-goals/              # Game 2 build output
└── quiz-game/               # Game 3 build output
```

### Deployment Steps

#### Option A: Manual Deployment

1. **Deploy Angular Shell:**

```bash
cd angular-shell
ng build --configuration production

# Copy production manifest
cp src/assets/federation.manifest.prod.json dist/angular-shell/browser/assets/federation.manifest.json

# Deploy to server
scp -r dist/angular-shell/browser/* user@server:/var/www/balicuat.bajajlifeinsurance.com/gamification/shell/
```

2. **Deploy Each Game:**

```bash
# Scramble Words
cd Scramble-Words
pnpm build
scp -r dist/* user@server:/var/www/balicuat.bajajlifeinsurance.com/gamification/scramble-words/

# Life Goals
cd game12
pnpm build
scp -r dist/* user@server:/var/www/balicuat.bajajlifeinsurance.com/gamification/life-goals/

# Quiz Game
cd quiz-game
pnpm build
scp -r dist/* user@server:/var/www/balicuat.bajajlifeinsurance.com/gamification/quiz-game/
```

#### Option B: Automated CI/CD

Create a deployment script (`deploy.sh`):

```bash
#!/bin/bash

BASE_PATH="/var/www/balicuat.bajajlifeinsurance.com/gamification"

# Build and deploy Angular Shell
echo "Building Angular Shell..."
cd angular-shell
ng build --configuration production
cp src/assets/federation.manifest.prod.json dist/angular-shell/browser/assets/federation.manifest.json
rsync -avz --delete dist/angular-shell/browser/ $BASE_PATH/shell/

# Build and deploy games
echo "Building Scramble Words..."
cd ../Scramble-Words
pnpm build
rsync -avz --delete dist/ $BASE_PATH/scramble-words/

echo "Building Life Goals..."
cd ../game12
pnpm build
rsync -avz --delete dist/ $BASE_PATH/life-goals/

echo "Building Quiz Game..."
cd ../quiz-game
pnpm build
rsync -avz --delete dist/ $BASE_PATH/quiz-game/

echo "Deployment complete!"
```

---

## Server Configuration

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name balicuat.bajajlifeinsurance.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Main location for gamification
    location /gamification/ {
        root /var/www/balicuat.bajajlifeinsurance.com;

        # Shell is served from /gamification/shell/
        location /gamification/shell/ {
            alias /var/www/balicuat.bajajlifeinsurance.com/gamification/shell/;
            try_files $uri $uri/ /gamification/shell/index.html;

            # CORS headers for Module Federation
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
        }

        # Games
        location ~* /gamification/(scramble-words|life-goals|quiz-game)/ {
            try_files $uri $uri/ =404;

            # CORS headers
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|mp4|webm)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:443>
    ServerName balicuat.bajajlifeinsurance.com
    DocumentRoot /var/www/balicuat.bajajlifeinsurance.com

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    # Module Federation requires CORS
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, OPTIONS"

    # Shell routing
    <Directory "/var/www/balicuat.bajajlifeinsurance.com/gamification/shell">
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ index.html [L]
    </Directory>

    # Cache static assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|mp4|webm)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

---

## JWT Authentication

### JWT Payload Structure

Your JWT should contain:

```json
{
  "gameId": "life-goals",
  "exp": 1739456123,
  "userId": "user123",
  "sessionId": "session456"
}
```

### Example JWT Generation (Node.js)

```javascript
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    gameId: "life-goals",
    userId: "user123",
    sessionId: "session456",
  },
  "your-secret-key",
  { expiresIn: "1h" },
);

// Use this token in URL
const gameUrl = `https://balicuat.bajajlifeinsurance.com/gamification/shell/auth?token=${token}`;
```

### Auth Flow

1. User clicks game link with JWT: `/shell/auth?token=xxx`
2. Shell extracts and validates JWT
3. Shell extracts `gameId` from token
4. Shell navigates to `/shell/play/:gameId` (clean URL, no token)
5. GameWrapper loads the remote React app

---

## Troubleshooting

### Common Issues

**1. "Game not found in manifest"**

- Check if `gameId` in JWT matches manifest keys (`scramble-words`, `life-goals`, `quiz-game`)
- Verify manifest JSON is valid

**2. "Failed to load remoteEntry"**

- Check CORS headers on game servers
- Verify game URLs in manifest are accessible
- Check browser console for network errors

**3. React mounting errors**

- Ensure React and ReactDOM are installed in Angular Shell
- Verify game exports default App component
- Check browser console for React errors

**4. Asset loading issues**

- Verify relative paths (`base: './'`) in vite.config.js
- Check Service Worker cache (DevTools → Application → Cache Storage)
- Ensure CDN URLs are correct in production manifest

**5. Blank screen after deployment**

- Check if Angular routing is configured on server (try_files)
- Verify all files deployed correctly
- Check browser console for errors

---

## Monitoring & Analytics

### Recommended Metrics

1. **Game Load Time**: Measure time from navigation to full game render
2. **Asset Cache Hit Rate**: % of assets served from Service Worker cache
3. **Error Rate**: Track failed game loads and remote module failures
4. **Popular Games**: Monitor which games are played most (already flagged in manifest)

### Error Tracking

Integrate Sentry or similar:

```typescript
// In app.config.ts
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: environment.production ? "production" : "development",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  tracesSampleRate: 1.0,
});
```

---

## Scaling to 100+ Games

### Best Practices

1. **Use CDN**: Serve all games from CDN (CloudFront, Cloudflare)
2. **Versioned Deployment**: Use versioned URLs for cache busting
   ```
   /gamification/life-goals-v2.1.3/index.js
   ```
3. **Lazy Loading**: Games are only loaded when user navigates to them
4. **Manifest Updates**: Update manifest via API, not hardcoded in Shell
5. **A/B Testing**: Use different manifest entries for canary deployments

### Adding New Games

To add a 4th game:

1. Build the game following the same pattern
2. Deploy to `/gamification/new-game/`
3. Update manifest JSON (either manually or via API)
4. **No Shell redeployment needed!**

---

## Security Considerations

1. **JWT Validation**: Always validate signature and expiration
2. **URL Sanitization**: Token is removed from URL immediately after extraction
3. **HTTPS Only**: Enforce HTTPS in production
4. **Content Security Policy**: Configure CSP headers to allow game loading

---

## Contact & Support

For issues or questions:

- Check browser console for errors
- Review nginx/apache logs
- Verify all URLs in manifest are accessible
- Test locally first before deploying to production
