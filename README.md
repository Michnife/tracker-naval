![Fleet Tracker](https://i.ibb.co/8n2B23B0/Screenshot-2026-06-06-142410.png)

# Tracker Naval (Fleet Tracker)

Ce projet est un tracker naval qui permet de gerer des flottes. Il me permet de demontrer mes competences avec ces differentes technos : [tech stack](#tech-stack)

- frontend : Angular + carte (Leaflet) et affichage des symboles
- backend : Spring Boot + API REST + WebSocket, avec persistance PostgreSQL

## Architecture rapide

- `fleet-tracker-frontend/` : interface utilisateur Angular, consomme l API REST et ecoute les updates WebSocket
- `tracker/` : API Spring Boot (REST + WebSocket), persistance JPA dans PostgreSQL
- `docker-compose.yml` : demarrage complet (db + backend + frontend)

## Tech stack

Frontend
- Angular 21, TypeScript
- Angular Material
- Leaflet
- milsymbol
- RxJS

Backend
- Java 21
- Spring Boot 3.5.11 (Web, WebSocket, Data JPA)
- PostgreSQL
- Maven

Infra
- Docker, Docker Compose

## Endpoints utiles

REST (backend)
- `GET /navires`
- `GET /navires/{id}`
- `POST /navires`
- `DELETE /navires/{id}`
- `PATCH /navires/{id}/position?latitude=...&longitude=...`

- `GET /groupes`
- `GET /groupes/{id}`
- `POST /groupes`
- `DELETE /groupes/{id}`
- `POST /groupes/{id}/navires/{navireId}`

WebSocket
- `ws://localhost:8080/ws`
  - le backend broadcast le navire mis a jour en JSON apres un changement de position

## Demarrage rapide (Docker)

Depuis la racine du depot :

```bash
docker-compose up --build
```

Puis :
- frontend : http://localhost/
- backend : http://localhost:8080/
- postgres : localhost:5432 (db: `fleettracker`, user/pass: `admin` / `admin`)

## Demarrage local (dev)

### Prerequis
- Java 21
- Node.js + npm (npm 10.x recommande)
- PostgreSQL 16
- Angular CLI 21

### Backend

```bash
cd tracker
./mvnw spring-boot:run
```

Sous Windows, utilisez :

```bash
cd tracker
mvnw.cmd spring-boot:run
```

La config base de donnees est dans `tracker/src/main/resources/application.properties`.

### Frontend

```bash
cd fleet-tracker-frontend
npm install
npm start
```

L appli tourne sur http://localhost:4200/ et consomme le backend sur http://localhost:8080.

## Modele de donnees (simplifie)

- Navire : `id`, `nom`, `type`, `latitude`, `longitude`, `statut`, `groupe`
- Groupe : `id`, `nom`, `couleur`, `parent`, `sousGroupes`, `navires`

## Notes

- Les mises a jour de position declenchent un envoi WebSocket vers tous les clients connectes.
- Les migrations sont gerees via JPA (`spring.jpa.hibernate.ddl-auto=update`).
