# Run once if git reports "bad config line 1 in file .git/config"
$configPath = Join-Path $PSScriptRoot ".git\config"

$content = @"
[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true

"@

[System.IO.File]::WriteAllText($configPath, $content.Replace("`n", "`r`n"), [System.Text.UTF8Encoding]::new($false))
Write-Host "Fixed: $configPath" -ForegroundColor Green
git -C $PSScriptRoot status -sb
