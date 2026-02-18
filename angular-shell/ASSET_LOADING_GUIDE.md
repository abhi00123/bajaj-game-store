# Asset Loading Monitoring Guide

## Overview

The Angular shell now includes comprehensive asset loading monitoring to track and troubleshoot asset loading issues. This guide explains the new logging capabilities and how to use them.

## Features Added

### 1. **AssetLoadingLogger Service** (`asset-loading.logger.ts`)

A comprehensive service that monitors all asset loading events:

- **Script Loading**: Tracks JavaScript files
- **Stylesheet Loading**: Monitors CSS files
- **Image Loading**: Tracks image assets
- **Font Loading**: Monitors web fonts
- **Performance API Monitoring**: Uses PerformanceObserver to track all resources
- **Error Monitoring**: Captures global errors and unhandled rejections related to assets
- **Network Issues**: Detects CORS and other network-related failures

### 2. **Enhanced Console Logging**

The application now logs detailed information about:

#### **App Initialization** (app.config.ts)
```
╔════════════════════════════════════════════════════════════╗
║         🎮 INITIALIZING GAMIFICATION SHELL               ║
╚════════════════════════════════════════════════════════════╝
[AppInit] Starting application initialization...
[AppInit] Loading federation manifest...
[AppInit] ✅ Federation manifest loaded in XXms
[AppInit] Scheduling background asset prefetch...
```

#### **Federation Manifest Loading** (federation.service.ts)
```
[FederationService] 📥 Loading manifest from assets/federation.manifest.json...
[FederationService] ✅ Manifest loaded successfully in XXms
[FederationService] 📊 Manifest Summary:
  • Total Games: X
  • Popular Games: Y - [game1, game2, ...]
[FederationService] 📋 Game Details:
  • game-id:
    - Display Name: Game Name
    - Type: module|other
    - Remote Entry: /assets/games/game-id/index.js
    - Exposed Module: ./Game
    - Assets: N
    - Popular: true|false
```

#### **Asset Prefetching** (asset-prefetch.service.ts)
```
[AssetPrefetch] 🎮 Starting prefetch for popular games: [game1, game2]
[AssetPrefetch] ⏳ Processing game: game1
[AssetPrefetch] 📦 Prefetching N assets for game: game1
[AssetPrefetch] ✅ Cached: https://example.com/asset.js
[AssetPrefetch] 📊 Cache results for game1:
  ✅ Cached: M/N
  ❌ Failed: K
    • https://example.com/failed-asset.js: Error message
```

#### **Individual Asset Tracking** (asset-loading.logger.ts)
```
[AssetLoadingLogger] Script loaded: /assets/games/game1/index.js (45.23ms)
[AssetLoadingLogger] Stylesheet loaded: /assets/styles/main.css (12.56ms)
[AssetLoadingLogger] Image loaded: /assets/images/logo.png (78.90ms)
[AssetLoadingLogger] Script failed: /assets/games/game2/missing.js - Script load failed
```

### 3. **Asset Loading Reports**

#### **Automatic Reports**
- **App startup**: Initial asset summary after 2 seconds
- **Periodic**: Every 10 seconds during app runtime
- **Window load**: Complete report when all resources finish loading
- **App destruction**: Final asset report when component destroys

#### **Manual Report Access**

In the browser console, you can access:

```typescript
// Get the AssetLoadingLogger service
const logger = ng.probe(document.body).injector.get('AssetLoadingLogger');

// Print detailed report
logger.printReport();

// Get all logs
const logs = logger.getLogs();

// Get failed assets
const failed = logger.getFailedAssets();

// Get summary
const summary = logger.getSummary();

// Get logs for a specific game
const gameLogs = logger.getLogsForGame('game-id');

// Export logs as JSON
const jsonExport = logger.exportLogs();
console.save(jsonExport, 'asset-logs.json');
```

## Understanding the Reports

### Asset Loading Report Example

```
╔════════════════════════════════════════════════════════════╗
║           ASSET LOADING REPORT                             ║
╚════════════════════════════════════════════════════════════╝

📊 SUMMARY:
  Total Assets: 45
  ✅ Loaded: 44
  ❌ Failed: 1
  ⏱️  Total Duration: 2345.67ms

📈 BY TYPE:
  script       : 15/15 loaded (100%)
  stylesheet   : 8/8 loaded (100%)
  image        : 18/19 loaded (94.7%) ⚠️  1 failed
  font         : 3/3 loaded (100%)
  other        : 1/1 loaded (100%)

❌ FAILED ASSETS (1):
  • https://cdn.example.com/images/missing-image.png
    └─ Image load failed
    └─ Duration: 156.23ms

📋 ALL LOGS:
[Table of all asset logs with timestamps and details]
```

### Asset Status Codes

- **loaded**: Asset successfully loaded
- **failed**: Asset load failed (network error, 404, etc.)
- **error**: Runtime error related to the asset
- **loading**: Asset is currently loading

## Troubleshooting Common Issues

### 1. **404 Not Found Assets**

If you see:
```
[AssetLoadingLogger] Script failed: /assets/games/game-id/missing.js - Script load failed
```

**Action**: Check if the file exists at that path in your public/assets directory.

### 2. **CORS Issues**

If you see warnings about "No data transferred":
```
[AssetLoadingLogger] Resource warning: https://external-cdn.com/asset.js - No data transferred
```

**Action**: Check CORS headers on the remote server or add CORS proxy.

### 3. **Slow Asset Loading**

If total duration is high:
```
⏱️  Total Duration: 15000ms
```

**Action**: 
- Check network tab in DevTools
- Consider asset optimization (minification, compression)
- Enable caching headers

### 4. **Manifest Loading Failures**

If you see:
```
[FederationService] ❌ Failed to load manifest in 245.67ms
```

**Action**: 
- Verify `assets/federation.manifest.json` exists
- Check file permissions
- Verify JSON syntax

## Key Log Prefixes

| Prefix | Meaning | Severity |
|--------|---------|----------|
| `[AppInit]` | App initialization phase | Info |
| `[FederationService]` | Game manifest loading | Info |
| `[AssetPrefetch]` | Background asset prefetching | Info |
| `[AssetLoadingLogger]` | Individual asset loading | Info/Warning |
| `❌` | Failed operation | Error |
| `✅` | Successful operation | Success |
| `⚠️` | Warning/Issue | Warning |
| `📊` | Summary/Report | Info |

## Browser DevTools Integration

### Chrome DevTools

1. **Open Console**: F12 or Right-click → Inspect
2. **Look for asset logs**: Search for `[AssetLoadingLogger]`
3. **View reports**: Search for `ASSET LOADING REPORT`
4. **Check failures**: Search for `❌` or `failed`

### Performance Tab

1. **Open Performance Tab**: F12 → Performance
2. **Record**: Click red circle to start recording
3. **Interact**: Trigger asset loading
4. **Stop**: Click red circle to stop
5. **Analyze**: View timeline of asset loading

## Environment-Specific Logging

### Development

All logs are enabled by default. Console output is verbose to help identify issues.

### Production

Consider enabling logs via URL parameter:
```
https://yourapp.com?debug-assets=true
```

Or conditionally in `app.component.ts`:
```typescript
if (environment.production === false || new URLSearchParams(window.location.search).has('debug-assets')) {
  this.assetLogger.printReport();
}
```

## Exporting Logs for Analysis

```typescript
// In browser console
const logger = ng.probe(document.body).injector.get('AssetLoadingLogger');
const json = logger.exportLogs();

// Copy to clipboard
copy(json);

// Or save to file
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'asset-logs-' + new Date().toISOString() + '.json';
a.click();
```

## Performance Metrics

### Typical Load Times (ms)

| Asset Type | Typical Duration | Acceptable Range |
|------------|------------------|------------------|
| Script | 10-100ms | < 500ms |
| Stylesheet | 5-50ms | < 300ms |
| Image | 20-200ms | < 1000ms |
| Font | 30-300ms | < 2000ms |

Monitor total duration - if exceeding 5000ms, consider optimization.

## Next Steps

1. Monitor the console logs during development
2. Check the asset loading report for failures
3. Use the asset logger to identify bottlenecks
4. Optimize slow-loading assets
5. Test in different network conditions

## Support

If issues persist:

1. Export asset logs: `logger.exportLogs()`
2. Take a screenshot of the Asset Loading Report
3. Note the failed assets and error messages
4. Share with your development team
