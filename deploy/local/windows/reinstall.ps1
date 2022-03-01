#!/usr/bin/env powershell
param ($force)
.\stop.ps1

if($force) {
    "docker volume prune -f" | cmd
    rm -r -fo volumes
}

.\setup.ps1