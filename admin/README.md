# Decap CMS

The CMS is available at `/admin/` after deployment.

Before deploying, replace `YOUR_GITHUB_USERNAME/YOUR_GITHUB_REPOSITORY` in
`config.yml` with the GitHub repository that hosts this site.

For local editing, run:

```sh
npm run cms
```

Then open `http://localhost:3000/admin/` while the Vite app is running with
`npm run dev`. The local backend handles file changes on disk; GitHub OAuth is
used by the deployed CMS.