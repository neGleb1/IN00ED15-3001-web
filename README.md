# IN00ED15-3001-web
Web-ohjelmoinnin sovellusprojekti (syksy 2024)

```
docker run --detach --name db --volume ./db:/docker-entrypoint-initdb.d --env POSTGRES_USER=admin --env POSTGRES_PASSWORD=87654321 --env POSTGRES_DB=todo -p 127.0.0.1:5435:5432 postgres:17-alpine
```