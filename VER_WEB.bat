@echo off
title VigorNova - Servidor Local
echo -----------------------------------------
echo    ENCENDIENDO VIGORNOVA 
echo -----------------------------------------
echo.
echo 1. Abriendo el navegador en http://localhost:3000...
start http://localhost:3000
echo 2. Iniciando el motor de la web (Next.js)...
echo.
echo Presiona Ctrl+C para apagar la web cuando termines.
echo.
npm run dev
pause
