#!/bin/sh

cd `dirname $0`

composer install
yarn install

./tools/convertJson.php
