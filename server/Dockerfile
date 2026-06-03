FROM node:22-alpine AS build
WORKDIR /app
COPY miniapp/package.json miniapp/package-lock.json* miniapp/
RUN cd miniapp && npm ci 2>/dev/null || (cd miniapp && npm install)
COPY miniapp/ miniapp/
RUN cd miniapp && npm run build

COPY server/package.json server/package-lock.json* server/
RUN cd server && npm ci 2>/dev/null || (cd server && npm install)
COPY server/ server/
RUN cd server && npm run build && node scripts/copy-miniapp.mjs

FROM node:22-alpine
WORKDIR /app/server
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/server/package.json ./
COPY --from=build /app/server/public ./public
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
