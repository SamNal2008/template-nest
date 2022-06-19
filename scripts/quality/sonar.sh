#!/bin/bash

token=$1

sonar-scanner \
  -Dsonar.projectKey=Fidelity-backend \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$token
