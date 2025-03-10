# Deva SDK

## Development

### Example app

There is a basic example app in /example. This is a plain react app that loads the sdk using pnpm links

To install the dependencies use `pnpm run dev:install`. This will install the packages for both sdk and the example app.
Then you can start the dev process with: 

```
pnpm run example:link # links the example app to the sdk in the root dir
pnpm run dev # runs the library builder on watch (required)
pnpm run dev:example # runs the dev server for the example app
```

You'll need the content server and deva.me running locally. 
