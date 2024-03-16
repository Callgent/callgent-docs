# Botlet.IO Documentation Site

<p align="center"><a href="#license">
<a href="https://app.snyk.io/test/github/Botlet-IO/botlet-docs" alt="FOSSA Status"><img src="https://snyk.io/test/github/Botlet-IO/botlet-docs/badge.svg"/></a>
<a href="https://app.fossa.com/projects/git%2Bgithub.com%2FBotlet-IO%2Fbotlet-docs?ref=badge_shield&issueType=license" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FBotlet-IO%2Fbotlet-docs.svg?type=shield&issueType=license"/></a>
<a href="https://github.com/Botlet-IO/botlet-docs/issues">
<img src="https://img.shields.io/github/issues/Botlet-IO/botlet-docs.svg" alt="GitHub issues" /></a>
<a href="https://github.com/Botlet-IO/botlet-docs/pulls">
<img src="https://img.shields.io/github/issues-pr/Botlet-IO/botlet-docs.svg" alt="GitHub pull requests" /></a>
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" height="20px">
</p>

This is the portal website of [Botlet.IO](https://botlet.io), gratefully forked from [NextJSTemplates](https://github.com/NextJSTemplates/startup-nextjs).

## Development

1. "node": ">=18.17.0"
2. checkout the repository:

    ```bash
    
    ```
    
3. rename `.env.example` to `.env`
4. Start the Service

    - Development Environment

        ```bash
        # Modify the API_SITE_URL on line 7 of your package.json file to set your development server.
        npm i -g pnpm
        pnpm install
        pnpm run start
        ```

    - Production Environment

        ```bash
        # Modify the API_SITE_URL in your .env file to set your production environment server.
        pnpm install
        pnpm run build
        pnpm run serve
        ```
        

## Contributing

We welcome contributions from the community! Before submitting a pull request, please review our [Contributor Development Agreement (CDO)](CONTRIBUTING.md).

### DCO Signoff

please commit with `-s`:

```bash
git commit -s -m '...'
```
