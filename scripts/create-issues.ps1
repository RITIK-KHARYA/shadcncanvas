param(
  [string]$Repo = "RITIK-KHARYA/shadcncanvas",
  [string]$Only = ""
)

$ErrorActionPreference = "Stop"

if (-not $env:GITHUB_TOKEN) {
  throw "Set GITHUB_TOKEN to a personal access token with 'issues: write' scope."
}

$issuesDir = Join-Path $PSScriptRoot "..\plans\github-issues"
$headers = @{
  Authorization = "Bearer $($env:GITHUB_TOKEN)"
  Accept = "application/vnd.github+json"
}

$existing = @()
$existingResponse = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/issues?state=all&per_page=100" -Headers $headers
if ($existingResponse) {
  $existing = @($existingResponse | ForEach-Object { $_.title })
}

$files = Get-ChildItem -LiteralPath $issuesDir -Filter "*.md" |
  Where-Object { $_.Name -ne "README.md" } |
  Where-Object { $Only -eq "" -or $_.Name -eq $Only } |
  Sort-Object Name

foreach ($file in $files) {
  $lines = Get-Content -LiteralPath $file.FullName
  $heading = $lines | Where-Object { $_ -match '^# ' } | Select-Object -First 1
  if (-not $heading) {
    Write-Warning "No '# ' heading in $($file.Name); skipping."
    continue
  }

  $title = ($heading -replace '^#\s+', '').Trim()
  if ($existing -contains $title) {
    Write-Host "skip (exists): $title"
    continue
  }

  $body = ($lines | Select-Object -Skip 1) -join "`n"
  $payload = @{ title = $title; body = $body.Trim() } | ConvertTo-Json -Depth 5
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)

  $result = Invoke-RestMethod -Method Post `
    -Uri "https://api.github.com/repos/$Repo/issues" `
    -Headers $headers `
    -ContentType "application/json; charset=utf-8" `
    -Body $bytes

  Write-Host "created #$($result.number): $($result.title)"
}
