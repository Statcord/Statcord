#/bin/bash

# make docker dir
mkdir docker

# make data dirs
mkdir docker/data
mkdir docker/data/DisStat
mkdir docker/data/DisStat/apiConfig
mkdir docker/data/DisStat/cacheData
mkdir docker/data/DisStat/dbData
mkdir docker/data/DisStat/influxdbData

# make docker volumes
docker volume create --driver local \
    --opt type=non \
    --opt o=bind\
    --opt device=$currentPath/docker/data/DisStat/apiConfig\
    config
docker volume create --driver local \
    --opt type=non \
    --opt o=bind\
    --opt device=$currentPath/docker/data/DisStat/cacheData\
    cacheData
docker volume create --driver local \
    --opt type=non \
    --opt o=bind\
    --opt device=$currentPath/docker/data/DisStat/dbData\
    dbData
docker volume create --driver local \
    --opt type=non \
    --opt o=bind\
    --opt device=$currentPath/docker/data/DisStat/influxdbData\
    influxdbData

# create source dir
mkdir docker/source
cd docker/source/

# remove old version and download new version
rm -r ./DisStat
git clone https://github.com/DisStat/DisStat
cd DisStat

# build and deploy 
docker-compose build --no-cache && docker-compose up -d


# Error response from daemon: failed to mount local volume: mount /docker/data/DisStat/cacheData:/var/lib/docker/volumes/cacheData/_data, flags: 0x1000: no such file or directory
