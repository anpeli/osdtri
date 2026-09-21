# Östersund Triathlon

Website for Östersund Triathlon, built with Vue 3 and Vite.

The site contains the public pages for the club, including:

- Home page with the latest posts
- Events page
- About page
- Contact page
- Decap CMS administration at `/admin/`

## Requirements

- Node.js 22 or newer
- npm

## Install

Clone the repository, enter the project directory, and install the dependencies:

```sh
npm install
```

## Development

Start the Vite development server:

```sh
npm run dev
```

The site is available at <http://localhost:3000>.

## Production Build

Create an optimized production build in `dist/`:

```sh
npm run build
```

To serve the production build locally:

```sh
npm run preview
```

Vite uses the `GITHUB_REPOSITORY` environment variable, when available, to set the correct base path for GitHub Pages. Without it, the app uses a relative base path.

## Content

Posts are stored as Markdown files in `src/content/posts/`. Each post can contain front matter such as:

```md
---
title: Example post
date: 2026-01-01
author: Author name
image: /assets/uploads/example.jpg
---

Post content goes here.
```

The home page discovers these Markdown files at build time and renders them in date order.

## Decap CMS

The CMS configuration is in `admin/config.yml`. Before deploying, replace
`YOUR_GITHUB_USERNAME/YOUR_GITHUB_REPOSITORY` with the GitHub repository that hosts the site.

For local CMS editing, run the Vite server and the Decap local backend in separate terminals:

```sh
npm run dev
npm run cms
```

Then open <http://localhost:3000/admin/>. The local backend writes CMS changes to the repository on disk. The deployed CMS uses GitHub OAuth.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` deploys the site to GitHub Pages whenever changes are pushed to `main`. It installs dependencies, runs `npm run build`, copies `dist/index.html` to `dist/404.html` for SPA routes, and publishes the `dist/` directory.

To enable deployment, configure GitHub Pages to use **GitHub Actions** and make sure the repository name in `admin/config.yml` is correct.

## Project Structure

```text
src/
  components/       Shared header and footer components
  content/posts/    Markdown news posts
  router/           Vue Router configuration
  styles/           Global styles
  views/            Home, events, about, and contact pages
admin/              Decap CMS configuration and documentation
.github/workflows/  GitHub Pages deployment workflow
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Build the production files into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run cms` | Start the Decap CMS local backend |
