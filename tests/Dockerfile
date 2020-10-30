FROM cypress/base:13.8.0

ADD . /tmp
WORKDIR /tmp
#CI=true reduces the verbosity of the installation logs
RUN cd /tmp && CI=true yarn install
RUN CI=true /tmp/node_modules/.bin/cypress install

CMD ["yarn", "e2e:ci"]