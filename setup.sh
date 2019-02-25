#!/bin/sh

cd `dirname $0`

composer install
yarn install

./scripts/convertJson.php
