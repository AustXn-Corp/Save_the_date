# GitHub Pages Deployment Guide

This application has been migrated from GitHub Spark to a standalone static site that can be hosted on GitHub Pages.

## 🚀 Deployment Steps

### 1. Enable GitHub Pages

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

### 2. Push Changes

```bash
git add .
git commit -m "Migrate to GitHub Pages"
git push origin main
```

The GitHub Actions workflow will automatically:
- Build the application
- Deploy to GitHub Pages
- Make it available at `https://<username>.github.io/digital-save-the-dat/`

### 3. Monitor Deployment

- Go to the **Actions** tab in your repository
- Watch the "Deploy to GitHub Pages" workflow run
- Once complete, your site will be live!

## ✨ What Changed

- **State Management**: Replaced `useKV` from Spark with `localStorage` for persistent state
- **Export Format**: Simplified to GIF-only mode (removed video export)
- **Base Path**: Configured for `/digital-save-the-dat/` subdirectory deployment
- **Dependencies**: Removed all `@github/spark` packages
- **Deployment**: Automated via GitHub Actions

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Notes

- User data persists in browser localStorage
- All animations and features work identically to the Spark version
- GIF exports work in all modern browsers
- Compatible with mobile browsers for image upload and sharing
