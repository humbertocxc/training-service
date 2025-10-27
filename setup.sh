docker-compose up -d db
dotenv -e .env npx prisma migrate dev --name init
dotenv -e .env npx ts-node src/seed.ts
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Training Service - Quick Setup Script ${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}Choose your setup mode:${NC}"
echo -e "  ${BLUE}1)${NC} Local development (installs dependencies locally)"
echo -e "  ${BLUE}2)${NC} Docker development (only starts PostgreSQL container)"
echo -e "  ${BLUE}3)${NC} Docker production (builds and runs full application)"
echo -e ""
read -p "Enter your choice (1-3): " setup_mode
echo ""

case $setup_mode in
	1)
		echo -e "${GREEN}Setting up for local development...${NC}\n"
		;;
	2)
		echo -e "${GREEN}Setting up Docker development mode...${NC}\n"
		;;
	3)
		echo -e "${GREEN}Setting up Docker production mode...${NC}\n"
		;;
	*)
		echo -e "${RED}Invalid choice. Defaulting to local development.${NC}\n"
		setup_mode=1
		;;
esac

# Check if Node.js is installed (for local setup)
if [ "$setup_mode" = "1" ]; then
	if ! command -v node &> /dev/null; then
			echo -e "${RED}[31m Node.js is not installed. Please install Node.js 20+${NC}"
			exit 1
	fi
	echo -e "${GREEN}[32m Node.js found: $(node --version)${NC}"

	if ! command -v npm &> /dev/null; then
			echo -e "${RED}[31m npm is not installed${NC}"
			exit 1
	fi
	echo -e "${GREEN}[32m npm found: $(npm --version)${NC}\n"
fi

# Check if Docker is installed (for Docker setups)
if [ "$setup_mode" = "2" ] || [ "$setup_mode" = "3" ]; then
	if ! command -v docker &> /dev/null; then
			echo -e "${RED}[31m Docker is not installed${NC}"
			exit 1
	fi
	echo -e "${GREEN}[32m Docker found: $(docker --version)${NC}"

	if ! command -v docker compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
			echo -e "${RED}[31m Docker Compose is not installed${NC}"
			exit 1
	fi
	echo -e "${GREEN}[32m Docker Compose found${NC}\n"
fi

# Install dependencies (only for local setup)
if [ "$setup_mode" = "1" ]; then
	echo -e "${YELLOW}[33m Installing dependencies...${NC}"
	npm install

	if [ $? -ne 0 ]; then
			echo -e "${RED}[31m Failed to install dependencies${NC}"
			exit 1
	fi

	echo -e "${GREEN}[32m Dependencies installed${NC}\n"
fi

# Setup environment file
if [ ! -f .env ]; then
		echo -e "${YELLOW}[33m Creating .env file...${NC}"
		cp .env.example .env
		echo -e "${GREEN}[32m .env file created${NC}"
		echo -e "${YELLOW}[33m  Please update DATABASE_URL and secrets in .env${NC}\n"
else
		echo -e "${BLUE}[34m  .env file already exists${NC}\n"
fi

# Docker compose actions
if [ "$setup_mode" = "2" ]; then
	echo -e "${YELLOW}[33m Starting PostgreSQL via docker compose...${NC}"
	docker compose up -d
	echo -e "${GREEN}[32m Postgres started${NC}"
fi

if [ "$setup_mode" = "3" ]; then
	echo -e "${YELLOW}[33m Building and starting production containers...${NC}"
	docker compose -f docker-compose.prod.yml up --build -d
	echo -e "${GREEN}[32m Production containers started${NC}"
fi

echo -e "${GREEN}Setup complete!${NC}"
