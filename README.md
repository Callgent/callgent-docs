# Callgent Documentation Site

<p align="center">
    <a href="https://callgent.com" target="_blank">
        <img alt="Static Badge" src="https://img.shields.io/badge/COM-COM?logo=COM&logoColor=%20%23f5f5f5&label=Callgent&labelColor=%20%23155EEF&color=%23EAECF0"></a>
    <a href="https://discord.gg/V9HKBukSRp" target="_blank">
        <img src="https://img.shields.io/discord/1215998670265127102?logo=discord"
            alt="chat on Discord"></a>
    <a href="https://twitter.com/intent/follow?screen_name=Callgent" target="_blank">
        <img src="https://img.shields.io/twitter/follow/Callgent?style=social&logo=X"
            alt="follow on Twitter"></a>
<a href="https://app.snyk.io/test/github/Callgent/callgent-docs" alt="FOSSA Status"><img src="https://snyk.io/test/github/Callgent/callgent-docs/badge.svg"/></a>
<a href="https://app.fossa.com/projects/git%2Bgithub.com%2FCallgent%2Fcallgent-docs?ref=badge_shield&issueType=license" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FCallgent%2Fcallgent-docs.svg?type=shield&issueType=license"/></a>
<a href="https://github.com/Callgent/callgent-docs/issues">
<img src="https://img.shields.io/github/issues/Callgent/callgent-docs.svg" alt="GitHub issues" /></a>
<a href="https://github.com/Callgent/callgent-docs/pulls">
<img src="https://img.shields.io/github/issues-pr/Callgent/callgent-docs.svg" alt="GitHub pull requests" /></a>
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" height="20px">
</p>

This is the portal website of [Callgent](https://callgent.com), gratefully forked from [NextJSTemplates](https://github.com/NextJSTemplates/startup-nextjs).

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
