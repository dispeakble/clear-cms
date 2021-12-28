Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0

echo "**************** Starting Installation *****************"

Write-Output "Creating volume folders"

"mkdir -p ./volumes/postgres" | cmd | Out-Null
"mkdir -p ./volumes/pgadmin/sessions" | cmd | Out-Null

"mkdir -p ./volumes/cms/bucket" | cmd | Out-Null

.\start.ps1

Write-Output "Installing NodeJs packages"

.\infrastructure\install-packages.ps1

echo "**************** Finished Installation *****************"