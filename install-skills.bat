@echo off
REM ============================================
REM  Instalador de Skills do Agente
REM  Copia a pasta .agents/ para qualquer projeto
REM ============================================

set "SOURCE=%~dp0.agents"
set "TARGET=%1"

if "%TARGET%"=="" (
    echo.
    echo  USO: install-skills.bat "C:\caminho\do\seu\projeto"
    echo.
    echo  Exemplo:
    echo    install-skills.bat "C:\Users\heinr\MeuProjeto"
    echo.
    pause
    exit /b 1
)

if not exist "%SOURCE%" (
    echo ERRO: Pasta .agents nao encontrada em %SOURCE%
    pause
    exit /b 1
)

echo Copiando skills para: %TARGET%\.agents\
xcopy "%SOURCE%" "%TARGET%\.agents" /E /I /Y /Q
echo.
echo Skills instaladas com sucesso em: %TARGET%\.agents\
echo.
pause
