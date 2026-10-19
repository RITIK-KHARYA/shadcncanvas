# GitHub issue drafts

One file per issue. The first `# ` heading is used as the issue title; the rest
is the body. To file them against your repo, provide a token with
`issues: write` and run the helper script.

```powershell
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxx"
powershell -ExecutionPolicy Bypass -File .\scripts\create-issues.ps1
```

The script is idempotent: it skips any title that already exists in the repo.

To file a single issue manually:

```powershell
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxx"
powershell -File .\scripts\create-issues.ps1 -Only 01-remove-theme-management.md
```
