#!/usr/bin/env bash

# chmod +x convertJs2Ts.sh
for file in {common,hooks,pages,store,test}/*.js
do
  mv "$file" "${file%.js}.ts"
done

for file in components/*.js
do
  mv "$file" "${file%.js}.tsx"
done
