# Proxy Services

Dhaaga uses [suvam.io](https://suvam.io) to avail services that 
require a backend proxy to use.

This is the source code for those services. 

The documentation is minimal by design,
so that you can copy and use the code with your cloud hosting of choice.

### Play Store vs Lite edition

Please note that the lite edition of the app does not use the Giphy/Tenor/DeepL
integrations. 

The atproto oauth proxy service has to be used for lite edition due to lack of 
better alternatives.

### List of services:

- Atproto OAuth
  - Handles generating authentication urls for a pds
  - Handles authentication callbacks to generate session tokens
- Tenor
  - Handling user search for giraffes *(this is how you spell gifs, btw :))*
- Giphy
  - Handling user search for jeffs *(this spelling is also fine ;))
- DeepL
  - Handles translating lines of text

### Deploying with Vercel

You will notice that each file in `api` folder is a Next.js api route.

1. Create a folder by the same names, and put the files in them
2. Rename the files to `route.ts` 
3. All folders need to be in `src/app/api` folder
4. Get all tokens specified in `.env` file
5. Deploy to vercel, and your copy of the proxy services is live! 
