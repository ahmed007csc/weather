# Weather App (Static Version)

This app is now optimized for **GitHub Pages**. It does not require a backend server.

## How to Deploy to GitHub Pages

1. **Commit and Push**: Ensure your changes are pushed to your GitHub repository.
2. **Open Repository Settings**: Go to your repository on GitHub.com.
3. **Pages Section**: On the left sidebar, click **Settings** -> **Pages**.
4. **Build and Deployment**:
   - Source: **Deploy from a branch**.
   - Branch: Select **main** (or your current branch) and folder **/(root)**.
5. **Save**: Click the **Save** button.
6. **Wait**: After a minute, your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.

## Local Development (Optional)
If you still want to run it locally with a server, you can use:
```bash
npm start
```
But for GitHub Pages, only the `index.html`, `style.css`, `app.js`, and `countries.json` are needed.
