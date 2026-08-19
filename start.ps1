# Nenogram V2 — Dev Runner
# Run from: C:\Users\USER\Desktop\nenogram-v2
# Usage: .\start.ps1

$server = "C:\Users\USER\Desktop\nenogram-v2\server"
$client = "C:\Users\USER\Desktop\nenogram-v2\client"
$python = "C:\Users\USER\Desktop\venv\Scripts\python.exe"
$vite   = "node .\node_modules\vite\bin\vite.js"

Write-Host ""
Write-Host "  Nenogram V2 — starting dev servers..." -ForegroundColor Cyan
Write-Host ""

# Start Django in background
$django = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$server'; & '$python' manage.py runserver 8080" -PassThru

# Start Vite in background
$vite_proc = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$client'; $vite" -PassThru

Write-Host "  Django  -> http://127.0.0.1:8080" -ForegroundColor Green
Write-Host "  React   -> http://localhost:5173"  -ForegroundColor Green
Write-Host ""
Write-Host "  Close this window or press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

# Keep alive — kill children on exit
try {
    while ($true) { Start-Sleep -Seconds 5 }
} finally {
    Stop-Process -Id $django.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $vite_proc.Id -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Red
}