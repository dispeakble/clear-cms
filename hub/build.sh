#!/usr/bin/env bash
docker build . -t crm-registry.me:5000/crm-hub && docker push crm-registry.me:5000/crm-hub