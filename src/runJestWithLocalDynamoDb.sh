docker-compose up --no-start --force-recreate dynamodb-local
docker-compose start
export IP_ADDRESS=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' dynamodb-local)
jest int --detectOpenHandles
exit $?
