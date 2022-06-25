#!/bin/bash
cd prisma
rm -rf dev.db
cd ..
npx prisma migrate dev --name initial
npm start

