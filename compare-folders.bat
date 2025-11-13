@echo off
echo ========================================
echo    COMPARAISON DES DOSSIERS
echo ========================================
echo.

set DOSSIER_I=I:\jenia-portfolio
set DOSSIER_CURSOR=C:\Users\User\.cursor\worktrees\jenia-portfolio

echo [INFO] Comparaison entre:
echo   Dossier I: %DOSSIER_I%
echo   Dossier Cursor: %DOSSIER_CURSOR%
echo.
echo ========================================

:: Vérifier que les dossiers existent
if not exist "%DOSSIER_I%" (
    echo [ERREUR] Dossier I:\ introuvable
    pause
    exit /b 1
)

if not exist "%DOSSIER_CURSOR%" (
    echo [ERREUR] Dossier Cursor introuvable
    pause
    exit /b 1
)

:: Comparer les fichiers package.json
echo.
echo [1/5] Comparaison package.json
echo ----------------------------------------
echo Dossier I:\jenia-portfolio:
findstr "@supabase/supabase-js" "%DOSSIER_I%\package.json" >nul
if %errorlevel% equ 0 (
    echo   ✅ Contient @supabase/supabase-js
) else (
    echo   ❌ Ne contient PAS @supabase/supabase-js
)

echo.
echo Dossier Cursor:
findstr "@supabase/supabase-js" "%DOSSIER_CURSOR%\package.json" >nul
if %errorlevel% equ 0 (
    echo   ✅ Contient @supabase/supabase-js
) else (
    echo   ❌ Ne contient PAS @supabase/supabase-js
)

:: Vérifier les fichiers Supabase
echo.
echo [2/5] Verification des fichiers Supabase
echo ----------------------------------------
echo Dossier I:\jenia-portfolio:
if exist "%DOSSIER_I%\server\supabase-storage.ts" (
    echo   ✅ server\supabase-storage.ts present
) else (
    echo   ❌ server\supabase-storage.ts manquant
)

if exist "%DOSSIER_I%\scripts\test-supabase.ts" (
    echo   ✅ scripts\test-supabase.ts present
) else (
    echo   ❌ scripts\test-supabase.ts manquant
)

echo.
echo Dossier Cursor:
if exist "%DOSSIER_CURSOR%\server\supabase-storage.ts" (
    echo   ✅ server\supabase-storage.ts present
) else (
    echo   ❌ server\supabase-storage.ts manquant
)

if exist "%DOSSIER_CURSOR%\scripts\test-supabase.ts" (
    echo   ✅ scripts\test-supabase.ts present
) else (
    echo   ❌ scripts\test-supabase.ts manquant
)

:: Vérifier la documentation
echo.
echo [3/5] Verification de la documentation
echo ----------------------------------------
set DOC_FILES=MIGRATION_SUPABASE.md SUPABASE_SETUP.md DEPLOYMENT.md START_HERE.md QUICKSTART.md

echo Dossier I:\jenia-portfolio:
for %%f in (%DOC_FILES%) do (
    if exist "%DOSSIER_I%\%%f" (
        echo   ✅ %%f
    ) else (
        echo   ❌ %%f manquant
    )
)

echo.
echo Dossier Cursor:
for %%f in (%DOC_FILES%) do (
    if exist "%DOSSIER_CURSOR%\%%f" (
        echo   ✅ %%f
    ) else (
        echo   ❌ %%f manquant
    )
)

:: Vérifier Git
echo.
echo [4/5] Etat Git
echo ----------------------------------------
echo Dossier I:\jenia-portfolio:
cd "%DOSSIER_I%"
git remote -v | findstr "XrOne/jenia-portfolio" >nul
if %errorlevel% equ 0 (
    echo   ✅ Connecte a GitHub: XrOne/jenia-portfolio
) else (
    echo   ❓ Repository Git non configure ou different
)

echo.
echo Dossier Cursor:
cd "%DOSSIER_CURSOR%"
git remote -v | findstr "XrOne/jenia-portfolio" >nul
if %errorlevel% equ 0 (
    echo   ✅ Connecte a GitHub: XrOne/jenia-portfolio
) else (
    echo   ❓ Repository Git non configure ou different
)

:: Recommandation
echo.
echo [5/5] RECOMMANDATION
echo ========================================
echo.

:: Compter les fichiers de documentation dans I:\
cd "%DOSSIER_I%"
set COUNT_I=0
for %%f in (*.md) do set /a COUNT_I+=1

:: Compter les fichiers de documentation dans Cursor
cd "%DOSSIER_CURSOR%"
set COUNT_CURSOR=0
for %%f in (*.md) do set /a COUNT_CURSOR+=1

echo Fichiers .md dans I:\: %COUNT_I%
echo Fichiers .md dans Cursor: %COUNT_CURSOR%
echo.

if %COUNT_I% gtr %COUNT_CURSOR% (
    echo ✅ RECOMMANDATION: Utiliser I:\jenia-portfolio
    echo.
    echo Raisons:
    echo - Plus de documentation (%COUNT_I% vs %COUNT_CURSOR% fichiers)
    echo - Connecte a GitHub
    echo - Contient tous les fichiers de migration Supabase
    echo.
    echo 👉 Executez: I:\jenia-portfolio\commit-to-github.bat
) else if %COUNT_CURSOR% gtr %COUNT_I% (
    echo ✅ RECOMMANDATION: Utiliser dossier Cursor
    echo.
    echo Raisons:
    echo - Plus de documentation (%COUNT_CURSOR% vs %COUNT_I% fichiers)
    echo.
    echo 👉 Copiez les fichiers du dossier Cursor vers I:\jenia-portfolio
) else (
    echo ⚖️ Les deux dossiers semblent equivalents
    echo.
    echo 👉 Utilisez I:\jenia-portfolio (deja connecte a GitHub)
)

echo.
echo ========================================
pause
