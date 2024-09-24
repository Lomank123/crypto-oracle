# crypto-oracle


## Details


### Security

For price manipulation protection and new data sources reliability 2 mechanisms were implemented:
- Outliers detection using inter-quartile range (IQR) filtering
- Last timestamp check to detect unreliable sources


### Data sources

Available data sources:
- Coinbase (id: `coinbase`)
- Crypto Compare (id: `crypto-compare`)

Ids must be used during create/delete/update operations related to data sources.


#### Data source reliability

- Prices are re-checked every N minutes
- On each check field `lastCheckedAt` is updated
- If `lastCheckedAt` was M minutes ago, then price will be considered unreliable
- Also, if during IQR check the price from the data source will be out of bounds the flag `isOutOfBounds` is set
- If either of these conditions are met, the price from data source won't be included in calculation
- If more than X % of the prices are considered unreliable (previous point) then the data source is also considered unreliable

Note: variables N, M and X can be changed in `.env` file


### Caching

- Caching is implemented and used when fetching single token pair price
  - When token pair data is changed (update/delete) cache will be invalidated


### Prices Update

- Prices are updated every N minutes (can be set in `.env`) for all token pairs via periodic task
- Can be updated manually (using endpoint `POST /refresh-prices` with empty payload)


## Prerequisites

- NodeJS
- Docker, docker-compose


## Installation

- Clone repository:

```shell
git clone https://github.com/Lomank123/crypto-oracle.git
```

- Copy `.env.sample` to `.env` and change env variables if needed:

```shell
cp .env.sample .env
```


### k8s setup

- Create namespace:

```shell
kubectl create namespace oracle
```

- Create config map:

```shell
kubectl create configmap oracle-config --from-env-file=.env --namespace=oracle
```

- Build the containers:

```shell
docker compose build
```

- Start:

```shell
kubectl apply -f k8s
```

- Check pod/svc:

```shell
kubectl get pod -n oracle
kubectl get svc -n oracle
```


### Docker Compose setup

- Create docker network:

```shell
docker network create oracle-network
```

- Build and up the containers:

```shell
docker compose up -d --build
```


### Local setup

- Install all packages:

```shell
npm install
```

- Run the app:

```shell
npm run start
```


## Usage

Postman schema:

- https://www.postman.com/lomankhexens/lomank-public/collection/zog0fdk/crypto-oracle?action=share&creator=36930562


### Default Flow

- Get available data sources list:

```
GET /available-data-sources

Response example:

[
    {
        "dataSource": "crypto-compare",
        "isReliable": true
    },
    {
        "dataSource": "coinbase",
        "isReliable": true
    }
]
```

- Create a token pair with chosen data sources:

```
POST /api/v1/token-pair

Payload:
{
    "pair": "USDT/BTC",
    "dataSources": ["crypto-compare", "coinbase"]
}
```

- Manually refresh the prices:

```
POST /refresh-prices

Payload: 
{}
```

In response, you'll receive a message telling that prices have been refreshed successfully.

- Get token pair price (Token Pair input format: `<TOKEN_1>-<TOKEN_2>`):

```
GET /token-pair/price/USDT-BTC

Response example:

{
    "pair": "USDT/BTC",
    "price": 0.0000159466450215
} 
```


## What's next?

- For now if all prices will be outdated the single token price endpoint will return `-1` for price field. Perhaps we can show last reliable price and the timestamp instead
- Add more data sources
- Store history of prices
    - Calculate reliability score for data sources based on prices history
- Remove extra fields from response objects
- Use `Promise.all()` to perform requests when fetching prices from data sources in async way
- Add mongoose transactions to update/delete endpoints


## Links

- https://byjus.com/maths/interquartile-range/
- https://academy.binance.com/en/glossary/decentralized-exchange
- https://academy.binance.com/en/glossary/centralized-exchange
- https://chain.link/education/blockchain-oracles
- https://www.immunebytes.com/blog/what-are-oracle-manipulation-attacks-in-blockchain/
