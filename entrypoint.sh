#!/bin/bash
set -e
case "$1" in
    develop)
        echo "Running Development Server"
        NODE_ENV=develop migrate-mongo up
        npm run start:dev
        npm run copy:templates
        ;;
    debug)
        echo "Running Development Server with the node inspector"
        NODE_ENV=develop migrate-mongo up
        npm run start:debug
        npm run copy:templates
        ;;
    production)
        echo "Running Production Server"
        NODE_ENV=production migrate-mongo up
        npm run build
        npm run copy:assets
        npm run copy:templates
        NODE_ENV=production pm2 start ./dist/main.js -i max
        pm2 logs
        ;;
    *)
        exec "$@"
esac