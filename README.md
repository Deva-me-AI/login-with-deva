# Deva SDK

## Development

The sdk functions on Client apps. You'll need to create a client app on deva.me. Make sure you fill in the redirect and origin uris. 

### Example app

There is a basic example app in example/. This is a plain react app that loads the sdk using pnpm links

You'll need to first create a example/.env file. Then add a client id for the app to it

```
VITE_DEVA_CLIENT_ID="f9dbe5bc-…"
```

You can create client's on deva.me settings.


To install the dependencies use `pnpm run dev:install`. This will install the packages for both sdk and the example app.
Then you can start the dev process with: 

```
pnpm run example:link # links the example app to the sdk in the root dir
pnpm run dev # runs the library builder on watch (required)
pnpm run dev:example # runs the dev server for the example app
```

You'll need the content server and deva.me running locally. 
