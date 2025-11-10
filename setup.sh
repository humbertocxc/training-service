#!/bin/bash

echo "Training Service - setup"
echo "1) Local development (install deps)"
echo "2) Docker development (start postgres & rabbitmq)"
echo "3) Docker production (build & run)"
read -p "Enter your choice (1-3): " setup_mode
case $setup_mode in
	1) ;;
	2) ;;
	3) ;;
	*)
		echo "Invalid choice, defaulting to 1"
		setup_mode=1
		;;
esac

if [ "$setup_mode" = "1" ]; then
	if ! command -v node &> /dev/null; then
		echo "Node.js not found (need Node.js 20+)."
		exit 1
	fi
	if ! command -v npm &> /dev/null; then
		echo "npm not found."
		exit 1
	fi
	echo "Node and npm found"
	echo "Installing dependencies..."
	npm install || { echo "npm install failed"; exit 1; }
fi

if [ "$setup_mode" = "2" ] || [ "$setup_mode" = "3" ]; then
	if ! command -v docker &> /dev/null; then
		echo "Docker not found"
		exit 1
	fi
	if docker compose version &> /dev/null 2>&1; then
		COMPOSE_CMD="docker compose"
	elif command -v docker-compose &> /dev/null; then
		COMPOSE_CMD="docker-compose"
	else
		echo "Docker Compose not found"
		exit 1
	fi
fi

if [ "$setup_mode" = "1" ]; then
	echo -e "${YELLOW}[33m Installing dependencies...${NC}"
	npm install

	if [ $? -ne 0 ]; then
			echo -e "${RED}[31m Failed to install dependencies${NC}"
			exit 1
	fi

	echo -e "${GREEN}[32m Dependencies installed${NC}\n"
fi

if [ ! -f .env ]; then
	if { [ "$setup_mode" = "2" ] || [ "$setup_mode" = "3" ]; } && [ -f .env.docker ]; then
		cp .env.docker .env
		echo ".env created from .env.docker"
	elif [ -f .env.example ]; then
		cp .env.example .env
		echo ".env created from .env.example"
	else
		touch .env
		echo "Empty .env created"
	fi
else
	echo ".env already exists"
fi

if [ "$setup_mode" = "2" ]; then
	if [ -n "$COMPOSE_CMD" ]; then
		$COMPOSE_CMD up -d postgres rabbitmq
	else
		docker compose up -d postgres rabbitmq
	fi
	echo "Postgres and RabbitMQ started"
fi

if [ "$setup_mode" = "3" ]; then
	if [ -n "$COMPOSE_CMD" ]; then
		$COMPOSE_CMD up --build
	else
		docker compose up --build
	fi
	echo "Production containers started"
fi

echo -e "${GREEN}Setup complete!${NC}"
