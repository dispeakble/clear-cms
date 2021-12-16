
.\stop.ps1

"docker volume prune -f" | cmd
rm -r -fo volumes

.\setup.ps1