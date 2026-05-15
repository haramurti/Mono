```
Mono
├─ .DS_Store
├─ backend
│  ├─ .env
│  ├─ cmd
│  │  ├─ api
│  │  │  └─ main.go
│  │  └─ bootstrap
│  │     └─ bootstrap.go
│  ├─ config
│  │  └─ config.go
│  ├─ docker-compose.yaml
│  ├─ go.mod
│  ├─ go.sum
│  ├─ internal
│  │  ├─ app
│  │  │  ├─ Users
│  │  │  │  ├─ contract
│  │  │  │  │  └─ contract.go
│  │  │  │  ├─ dto
│  │  │  │  │  └─ dto.go
│  │  │  │  ├─ entity
│  │  │  │  │  ├─ refresh_token.go
│  │  │  │  │  ├─ user.go
│  │  │  │  │  └─ user_memory.go
│  │  │  │  ├─ handler
│  │  │  │  │  └─ handler.go
│  │  │  │  ├─ repository
│  │  │  │  │  └─ repository.go
│  │  │  │  └─ service
│  │  │  │     └─ service.go
│  │  │  ├─ chat
│  │  │  │  ├─ contract
│  │  │  │  │  └─ chat_contract.go
│  │  │  │  ├─ dto
│  │  │  │  │  └─ chat_dto.go
│  │  │  │  ├─ entity
│  │  │  │  │  ├─ chat_message.go
│  │  │  │  │  └─ chat_session.go
│  │  │  │  ├─ handler
│  │  │  │  │  └─ chat_handler.go
│  │  │  │  ├─ repository
│  │  │  │  │  └─ chat_repository.go
│  │  │  │  └─ service
│  │  │  │     └─ chat_service.go
│  │  │  └─ journal
│  │  ├─ infra
│  │  │  ├─ database
│  │  │  │  ├─ connection.go
│  │  │  │  └─ migration.go
│  │  │  └─ gemini
│  │  │     └─ gemini_client.go
│  │  ├─ middleware
│  │  │  └─ middleware.go
│  │  └─ routes
│  │     └─ routes.go
│  ├─ pkg
│  └─ readme.md
```
