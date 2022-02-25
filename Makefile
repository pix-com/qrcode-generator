APP_NAME?=ura-bot
APP_DIR = /src/${APP_NAME}
PWD=$(shell pwd)

clean-up:
	@docker rm -f ${APP_NAME}-node

debug-node:
	@clear
	@echo "\e[1m\033[33mDebug mode\e[0m"
	@docker run -it -v ${PWD}:${APP_DIR} -w ${APP_DIR} \
		-p 8092:3000 --rm --name ${APP_NAME}-node node:16.14 bash

ip:
	@docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${APP_NAME}-node
