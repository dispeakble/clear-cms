#!/usr/bin/env powershell
$VERSION="v0.0.1"
docker-compose -f "..\versions\$VERSION\base.yaml" down -v