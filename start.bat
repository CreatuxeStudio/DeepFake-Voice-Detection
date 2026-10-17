@echo off
echo Starting Deepfake Voice Detection System...
echo ----------------------------------------------------

:: Detect python executable
where python >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=python
) else (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        set PY_CMD=py
    ) else (
        echo [ERROR] Neither python nor py launcher was found on PATH.
        pause
        exit /b 1
    )
)

echo Starting Django Backend Server on 0.0.0.0:8000 (using %PY_CMD%)
start "Django Backend" cmd /k "cd /d %~dp0backend && %PY_CMD% manage.py runserver 0.0.0.0:8000"

timeout /t 3 /nobreak >nul

echo Starting React Vite Frontend on 0.0.0.0:5173
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 0.0.0.0 --port 5173"

echo ----------------------------------------------------
echo Prototype is launching!
echo.
echo   [Windows PC]     http://127.0.0.1:5173
echo   [Android Mobile] Check the 'Network:' IP in the React Frontend
echo                    window (e.g. http://192.168.1.x:5173) and open
echo                    it on your Android phone's browser!
echo ----------------------------------------------------
pause
