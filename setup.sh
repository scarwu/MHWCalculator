#!/bin/sh

cd `dirname $0`

composer install
yarn install

./src/tools/convertJson.php
