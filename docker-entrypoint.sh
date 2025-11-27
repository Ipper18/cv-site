#!/bin/sh
set -e

npx prisma db push
npm run prisma:seed
npm run start
