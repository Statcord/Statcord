# /bin/bash

# write defualt value to file so that nuxt has a file to read from when building
echo "export default {}" > swaggerRoutes.mjs

# run devmode in background
npm run dev > /tmp/devBuild.log 2>&1 & 

# wait for nitro to be built
( tail -f -n0 /tmp/devBuild.log & ) | grep -q "Nitro built"

# remove empty object from file
sed -i '$s/..$//' swaggerRoutes.mjs

# download openapi json file and save to swaggerRoutes.mjs
curl http://127.0.0.1:3000/_nitro/openapi.json >> swaggerRoutes.mjs

# kill background nuxt env
kill 1