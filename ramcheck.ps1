Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 25 Name, @{N='RAM_MB';E={[math]::Round($_.WorkingSet64/1MB,1)}}, Id | Format-Table -AutoSize
