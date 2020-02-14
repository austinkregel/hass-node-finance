ARG BUILD_FROM
FROM $BUILD_FROM

USER root

ADD . /src

ENV LANG C.UTF-8

RUN apk update
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/v3.7/main/ nodejs=8.9.3-r1
RUN apk add --update sqlite python make g++


RUN npm install -g --unsafe-perm knex cross-env sqlite3

COPY ./run_finance_app.sh /run_finance_app.sh
RUN chmod a+x /run_finance_app.sh

ADD ./src /finance
WORKDIR /finance

RUN npm install

RUN touch fringe.sqlite
RUN knex migrate:latest
RUN npm run develop

CMD ["/run_finance_app.sh"]
