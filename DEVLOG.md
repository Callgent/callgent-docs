# Development Guide

## Development Setup

## Development Log

### [1、Algolia docsearch](https://www.algolia.com/)

1. Configure your key, in .env

```shell
   # Sign up for an account & Create Aplication
   ALGOLIA_APP_INDEX='YOUR_INDEX_NAME'
   ALGOLIA_APP_ID='Application ID'
   ALGOLIA_API_KEY='Admin API Key'
```

2. please reference file: docusaurus.config.ts

   ```shell
   themeConfig: {
       // ......
   	algolia: {
         appId: process.env.ALGOLIA_APP_ID,
         apiKey: process.env.ALGOLIA_API_KEY,
         indexName: process.env.ALGOLIA_APP_INDEX,
       }
   }
   ```

3. please reference file: docsearch.json，For more configurations, please refer to the [Config templates](https://docsearch.algolia.com/docs/templates/)

   ```shell
   {
     // ......
     "index_name": "YOUR_INDEX_NAME",
     "start_urls": ["YOUR_WEB"],
     "sitemap_urls": ["YOUR_WEB"],
     "stop_urls": ["/search"]
   }
   ```

4. To update the site search data, you can choose one of the three methods

   - Local operation

     ```shell
     yum install -y epel-release
     yum install -y jq
     docker run -it --env-file=.env -e "CONFIG=$(cat docsearch.json | jq -r tostring)" algolia/docsearch-scraper
     ```

   - GitHub Actions

     ```yml
     name: docsearch-scraper

     on:
       push:
         branches: [main]

     jobs:
       scan:
         runs-on: ubuntu-latest

         steps:
           - name: Checkout repo
             uses: actions/checkout@v3

           - name: Run scraper
             env:
               APPLICATION_ID: ${{ secrets.APPLICATION_ID }}
               API_KEY: ${{ secrets.API_KEY }}
             run: |
               CONFIG="$(cat docsearch.json)"
               docker run -i --rm \
                       -e APPLICATION_ID=$APPLICATION_ID \
                       -e API_KEY=$API_KEY \
                       -e CONFIG="${CONFIG}" \
                       algolia/docsearch-scraper
     ```

   - Waiting for official review

     ```shell
     https://docsearch.algolia.com/apply
     ```
