# CORS Fix Guide - Running Your Portfolio Locally

## Problem
When opening `index.html` directly with `file://` protocol, browsers block CORS requests to load `experience.json` due to security policies.

## Solutions

### ✅ Option 1: Python HTTP Server (Recommended)

```bash
# Navigate to your portfolio directory
cd d:\Github\basharulalammazu.github.io

# Python 3.x
python -m http.server 8000

# Python 2.x (if using older version)
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### ✅ Option 2: Node.js HTTP Server

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Run in your portfolio directory
cd d:\Github\basharulalammazu.github.io
http-server -p 8000
```

Then open: `http://localhost:8000`

### ✅ Option 3: VS Code Live Server Extension

1. Install **Live Server** extension by Ritwick Dey
2. Right-click on `index.html` → "Open with Live Server"
3. Browser will automatically open with proper server

### ✅ Option 4: PHP Built-in Server

```bash
cd d:\Github\basharulalammazu.github.io
php -S localhost:8000
```

Then open: `http://localhost:8000`

## What Was Updated

### 1. **experience.json** - Updated Job Information
- Added new position: **Software Engineer at Impulse Bangladesh** (Active)
- Previous role marked as Completed: **Software Engineer Intern at DMA**

### 2. **script.js** - Improved CORS Handling
- Added XMLHttpRequest fallback for better compatibility
- Improved error message with setup instructions
- Graceful degradation when JSON fails to load

### 3. **style.css** - Enhanced Hero Avatar
- Improved avatar ring animation with better scaling
- Enhanced shadow and glow effects
- Better flex alignment for centering
- Brighter hover effects

### 4. **Font Configuration**
- Times New Roman properly set with Georgia fallback: `'Times New Roman', 'Georgia', serif`
- Applied throughout display typography

## Testing
Once you run the local server:
1. Experience section should load with both positions
2. New "Software Engineer" role displays first with "Active" status
3. Previous internship shows as "Completed"
4. Avatar has smoother animations and better visual hierarchy

## Notes
- The updated `experience.json` now has your current position at the top
- Previous DMA internship is still in history with all project details
- Local server is required only for development; deployment on actual web hosts works fine with CORS
