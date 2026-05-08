# ------------------------------------------------------------------------------
#  🎨 COLORS & SYMBOLS
# ------------------------------------------------------------------------------
BOLD    = \033[1m
RED     = \033[31m
GREEN   = \033[32m
YELLOW  = \033[33m
BLUE    = \033[34m
MAGENTA = \033[35m
CYAN    = \033[36m
RESET   = \033[0m

# Visual Icons
ICON_OK     = ✅
ICON_BUILD  = 🏗️
ICON_ROCKET = 🚀
ICON_TRASH  = 🗑️
ICON_STOP   = 🛑
ICON_LOGS   = 📋
ICON_DB     = 💾
ICON_RELOAD = 🔄

# ------------------------------------------------------------------------------
#  ⚙️ VARIABLES
# ------------------------------------------------------------------------------
NAME    = ft_transcendence
COMPOSE = docker-compose.yml
PROD_COMPOSE = docker-compose.prod.yml
DOCKER  = docker compose

# ------------------------------------------------------------------------------
#  🚀 MAIN RULES
# ------------------------------------------------------------------------------

# Default rule: build and bring up
all: build up

# Visual Help Menu
help:
	@echo "$(BOLD)$(CYAN)--- $(NAME) Makefile Help ---$(RESET)"
	@echo "$(GREEN)make build$(RESET)   : Build images without starting"
	@echo "$(GREEN)make up$(RESET)      : Start the project in the background"
	@echo "$(GREEN)make test$(RESET)    : Run same checks as GitHub pipeline"
	@echo "$(YELLOW)make down$(RESET)    : Stop and remove containers"
	@echo "$(BLUE)make logs$(RESET)    : Display real-time logs"
	@echo "$(MAGENTA)make restart$(RESET) : Restart containers"
	@echo "$(RED)make clean$(RESET)   : Remove containers and networks"
	@echo "$(RED)make fclean$(RESET)  : Remove EVERYTHING (Images, Volumes, Cache)"
	@echo "$(MAGENTA)make re$(RESET)      : Total restart (Fclean + All)"
	@echo ""
	@echo "$(BOLD)$(CYAN)🏭 PRODUCTION:$(RESET)"
	@echo "$(GREEN)make prod$(RESET)           : Build + start production (uses docker-compose.prod.yml)"
	@echo "$(GREEN)make prod-build$(RESET)     : Build production images"
	@echo "$(GREEN)make prod-up$(RESET)        : Start production services"
	@echo "$(YELLOW)make prod-down$(RESET)      : Stop production services"
	@echo "$(GREEN)make build-frontend$(RESET) : Run Vite build locally (test)"
	@echo ""
	@echo "$(BOLD)$(YELLOW)🎯 PRO TIP FOR INDIVIDUAL SERVICES:$(RESET)"
	@echo "Add $(CYAN)c=service_name$(RESET) at the end of any command."
	@echo "Examples:"
	@echo "  $(CYAN)make build c=tr_chat$(RESET)    -> Build only the chat"
	@echo "  $(CYAN)make up c=tr_frontend$(RESET)   -> Start only the frontend"
	@echo "  $(CYAN)make restart c=tr_chat$(RESET)  -> Restart only the chat"
	@echo "  $(CYAN)make logs c=tr_postgres$(RESET) -> View logs for DB only"

# ------------------------------------------------------------------------------
#  🛠️ BUILD & RUN
# ------------------------------------------------------------------------------

build:
	@echo "\n$(BOLD)$(BLUE)$(ICON_BUILD)  Building Docker images...$(RESET)"
	@$(DOCKER) build $(c)
	@echo "$(GREEN)$(ICON_OK)  Build finished.$(RESET)"

up:
	@echo "\n$(BOLD)$(MAGENTA)$(ICON_ROCKET)  Starting services in the background...$(RESET)"
	@$(DOCKER) up -d --remove-orphans $(c)
	@echo "$(BOLD)$(GREEN)$(ICON_OK)  Project online! Access at: https://localhost:8443$(RESET)"

# -------------------------------------------------------
#  🏭 PRODUCTION TARGETS
# -------------------------------------------------------
prod: prod-build prod-up

prod-build:
	@echo "\n$(BOLD)$(BLUE)$(ICON_BUILD)  Building production images...$(RESET)"
	@$(DOCKER) -f $(PROD_COMPOSE) build --build-arg VITE_GOOGLE_MAPS_API_KEY="$${VITE_GOOGLE_MAPS_API_KEY:-}" $(c)
	@echo "$(GREEN)$(ICON_OK)  Production build finished.$(RESET)"

prod-up:
	@echo "\n$(BOLD)$(MAGENTA)$(ICON_ROCKET)  Starting production services...$(RESET)"
	@$(DOCKER) -f $(PROD_COMPOSE) up -d --remove-orphans $(c)
	@echo "$(BOLD)$(GREEN)$(ICON_OK)  Production online! Access at: https://ventomarket.store$(RESET)"

prod-down:
	@echo "\n$(BOLD)$(YELLOW)$(ICON_STOP)  Stopping production services...$(RESET)"
	@$(DOCKER) -f $(PROD_COMPOSE) down $(c)

build-frontend:
	@echo "\n$(BOLD)$(BLUE)$(ICON_BUILD)  Building frontend (Vite)...$(RESET)"
	@cd services/frontend && npm ci && npm run build
	@echo "$(GREEN)$(ICON_OK)  Frontend built at services/frontend/dist/$(RESET)"

start:
	@echo "\n$(BOLD)$(GREEN)Starting existing containers...$(RESET)"
	@$(DOCKER) start $(c)

stop:
	@echo "\n$(BOLD)$(YELLOW)$(ICON_STOP)  Stopping services...$(RESET)"
	@$(DOCKER) stop $(c)

restart:
	@echo "\n$(BOLD)$(CYAN)$(ICON_RELOAD)  Restarting services...$(RESET)"
	@$(DOCKER) restart $(c)

down:
	@echo "\n$(BOLD)$(YELLOW)$(ICON_STOP)  Taking down containers and networks...$(RESET)"
	@$(DOCKER) down $(c)

# ------------------------------------------------------------------------------
#  👀 MONITORING & UTILS
# ------------------------------------------------------------------------------

logs:
	@echo "\n$(BOLD)$(BLUE)$(ICON_LOGS)  Showing logs (Ctrl+C to exit)...$(RESET)"
	@$(DOCKER) logs -f $(c)

ps:
	@echo "\n$(BOLD)$(CYAN)Container status:$(RESET)"
	@$(DOCKER) ps

test:
	@command -v npm >/dev/null 2>&1 || { printf "$(RED)Error: npm is not installed. Please install Node.js.$(RESET)\n"; exit 1; }
	@command -v npx >/dev/null 2>&1 || { printf "$(RED)Error: npx is not installed. Please install Node.js.$(RESET)\n"; exit 1; }
	@$(MAKE) --no-print-directory test-filenames
	@$(MAKE) --no-print-directory test-filesize
	@$(MAKE) --no-print-directory test-code-style
	@$(MAKE) --no-print-directory test-commits
	@printf "\n$(BOLD)$(GREEN)$(ICON_OK) All pipeline checks passed successfully!$(RESET)\n"

test-filenames:
	@printf "$(BOLD)Validating filenames (ls-lint)...$(RESET)\n"
	@npx --yes @ls-lint/ls-lint .
	@printf "$(GREEN)$(ICON_OK) Filenames are valid.$(RESET)\n"

test-filesize:
	@printf "$(BOLD)Validating file sizes...$(RESET)\n"
	@./.github/scripts/check-file-size.sh

test-code-style:
	@printf "$(BOLD)Ensuring dependencies...$(RESET)\n"
	@if [ ! -d "node_modules" ]; then \
		npm install --silent; \
	fi
	@if [ ! -d "services/frontend/node_modules" ]; then \
		cd services/frontend && npm install --silent; \
	fi
	@printf "$(BOLD)Running linters and typechecks...$(RESET)\n"
	@npm run lint --silent
	@npm run typecheck:frontend --silent
	@printf "$(GREEN)$(ICON_OK) Code style and types are correct.$(RESET)\n"

test-commits:
	@printf "$(BOLD)Validating latest commit message (commitlint)...$(RESET)\n"
	@npx commitlint --from HEAD~1 --to HEAD --quiet
	@printf "$(GREEN)$(ICON_OK) Commit message follows conventional standards.$(RESET)\n"

.PHONY: all help build up start stop restart down logs ps test test-filenames test-filesize test-code-style test-commits prod prod-build prod-up prod-down build-frontend