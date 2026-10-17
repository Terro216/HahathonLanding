FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS build
WORKDIR /app
ENV PARCEL_WORKERS=2 CI=true
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY src ./src
COPY public ./public
COPY scripts/finalize-build.mjs ./scripts/finalize-build.mjs
RUN npm run build

FROM nginx:1.27-alpine@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
RUN rm -f /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
USER 101:101
EXPOSE 8080
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
LABEL org.opencontainers.image.source="https://github.com/Terro216/HahathonLanding" \
      org.opencontainers.image.description="CreativeHack 2022 historical archive; registration closed" \
      dev.ilyamedve.archive.source-revision="252bb49cecc2fd53281612da33594e3b62f99f92"
