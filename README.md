# crypto-oracle


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

- Install all packages:

```shell
npm install
```

- Create docker network:

```shell
docker network create oracle-network
```

- Build and up the DB container:

```shell
docker compose up -d --build
```


## Run

- Run the app (in case you're running backend locally):

```shell
npm run start
```


## Usage

TODO: Add sections
