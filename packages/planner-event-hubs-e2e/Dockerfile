FROM node:20.2.0-alpine3.16

RUN echo 'https://sjc.edge.kernel.org/alpine/v3.14/main' >> /etc/apk/repositories \
  && echo 'https://sjc.edge.kernel.org/alpine/v3.14/community' >> /etc/apk/repositories
RUN apk add git g++ make chromium
ENV CHROMIUM_BIN=/usr/bin/chromium-browser

ARG LHCI_BUILD_CONTEXT__COMMIT_MESSAGE
ARG LHCI_BUILD_CONTEXT__CURRENT_BRANCH
ARG LHCI_BUILD_CONTEXT__CURRENT_HASH
ARG LHCI_BUILD_CONTEXT__ANCESTOR_HASH
ARG LHCI_BUILD_CONTEXT__AVATAR_URL
ARG LHCI_BUILD_CONTEXT__AUTHOR
ARG LHCI_BUILD_CONTEXT__COMMIT_TIME

# Override the default lighthouse build context. Required for proper result uploads regardless of the source
ENV LHCI_BUILD_CONTEXT__COMMIT_MESSAGE=${LHCI_BUILD_CONTEXT__COMMIT_MESSAGE}
ENV LHCI_BUILD_CONTEXT__CURRENT_BRANCH=${LHCI_BUILD_CONTEXT__CURRENT_BRANCH}
ENV LHCI_BUILD_CONTEXT__CURRENT_HASH=${LHCI_BUILD_CONTEXT__CURRENT_HASH}
ENV LHCI_BUILD_CONTEXT__ANCESTOR_HASH=${LHCI_BUILD_CONTEXT__ANCESTOR_HASH}
ENV LHCI_BUILD_CONTEXT__AVATAR_URL=${LHCI_BUILD_CONTEXT__AVATAR_URL}
ENV LHCI_BUILD_CONTEXT__AUTHOR=${LHCI_BUILD_CONTEXT__AUTHOR}
ENV LHCI_BUILD_CONTEXT__COMMIT_TIME=${LHCI_BUILD_CONTEXT__COMMIT_TIME}

ARG PNPM_VERSION
RUN npm --no-update-notifier --no-fund --global install pnpm@${PNPM_VERSION}

WORKDIR /home/node/app

ARG DIST_DIR='dist'
COPY --chown=node:node ${DIST_DIR}/standalone ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install --prod --frozen-lockfile

USER node
ARG PACKAGE_PATH
WORKDIR ${PACKAGE_PATH}

# Add the lighthouse config and chromium seccomp
COPY chromium-seccomp* lighthouserc* ./

CMD [ "pnpm", "test:e2e" ]
