#!/usr/bin/env powershell
param ($force = 0, [Boolean]$custom = 0)
.\stop.ps1

if($force) {
    "docker volume prune -f" | cmd
    rm -r -fo volumes
}

.\setup.ps1 -custom $custom