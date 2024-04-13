+++
title = 'Running the documentation locally'
date = 2024-04-12T21:30:00Z
+++

### Locally building this site
1. Install Go (https://go.dev/doc/install)
2. Install Hugo (https://gohugo.io/installation/)
3. Navigate to your local git repository
4. Run `hugo serve --source ./docs` to build the site from the Markdown files in ./docs/content.

Adding `-D` to `hugo serve` will include pages marked with `draft = true` in their [front matter](https://gohugo.io/content-management/front-matter/) -- but note that pages marked as draft are not published to the GitHub Pages deployment.