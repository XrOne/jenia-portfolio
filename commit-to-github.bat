@echo off
echo ========================================
echo    JENIA PORTFOLIO - COMMIT VERS GITHUB
echo ========================================
echo.

:: Vérifier qu'on est dans le bon dossier
if not exist "package.json" (
    echo [ERREUR] Vous devez executer ce script depuis I:\jenia-portfolio
    pause
    exit /b 1
)

echo [INFO] Verification du dossier...
echo.

:: Afficher l'état actuel
echo [1/6] Etat actuel de Git:
echo ----------------------------------------
git status
echo.
echo.

:: Vérifier que .env n'est pas dans les fichiers à commiter
echo [2/6] Verification que .env est ignore...
echo ----------------------------------------
git status | findstr /C:".env" > nul
if %errorlevel% equ 0 (
    echo [ATTENTION] Le fichier .env apparait dans git status
    echo [ACTION] Suppression de .env du staging...
    git restore --staged .env 2>nul
    echo [OK] .env retire du commit
) else (
    echo [OK] .env est bien ignore
)
echo.

:: Ajouter tous les fichiers
echo [3/6] Ajout de tous les fichiers...
echo ----------------------------------------
git add .
echo [OK] Fichiers ajoutes
echo.

:: Afficher ce qui va être commité
echo [4/6] Fichiers qui seront commites:
echo ----------------------------------------
git status --short
echo.
echo.

:: Demander confirmation
echo [5/6] Confirmation
echo ----------------------------------------
echo Voulez-vous commiter ces fichiers ? (O/N)
set /p confirm="> "

if /i not "%confirm%"=="O" (
    echo [ANNULE] Commit annule
    pause
    exit /b 0
)

:: Créer le commit
echo.
echo [6/6] Creation du commit...
echo ----------------------------------------
git commit -m "feat: Migration vers Supabase Storage + Documentation complete" -m "🎉 Changements majeurs:" -m "- Migration complete vers Supabase Storage" -m "- Module supabase-storage.ts pour la gestion des fichiers" -m "- Upload optimise jusqu'a 1GB par fichier" -m "- Script de test automatise (pnpm test:supabase)" -m "" -m "📚 Documentation:" -m "- 10+ guides complets en francais" -m "- START_HERE.md pour demarrage rapide" -m "- MIGRATION_SUPABASE.md avec instructions detaillees" -m "- DEPLOYMENT.md pour mise en production Vercel" -m "" -m "🔧 Modifications techniques:" -m "- server/upload.ts : Utilise Supabase" -m "- server/_core/env.ts : Variables Supabase" -m "- package.json : Ajout @supabase/supabase-js" -m "- vercel.json : Configuration deploiement" -m "" -m "⚠️ Breaking changes:" -m "- Necessite compte Supabase (gratuit)" -m "- Nouvelles variables d'environnement requises" -m "" -m "📖 Pour demarrer : voir MIGRATION_SUPABASE.md"

if %errorlevel% neq 0 (
    echo [ERREUR] Le commit a echoue
    pause
    exit /b 1
)

echo [OK] Commit cree avec succes !
echo.

:: Pousser vers GitHub
echo ========================================
echo    PUSH VERS GITHUB
echo ========================================
echo.
echo Voulez-vous pusher vers GitHub maintenant ? (O/N)
set /p pushconfirm="> "

if /i not "%pushconfirm%"=="O" (
    echo [INFO] Push annule - Vous pouvez le faire plus tard avec: git push origin main
    pause
    exit /b 0
)

echo.
echo Push en cours vers GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Le push a echoue
    echo.
    echo Causes possibles:
    echo - Vous n'etes pas connecte a Internet
    echo - Vous devez d'abord faire: git pull origin main
    echo - Probleme d'authentification GitHub
    echo.
    echo Essayez manuellement:
    echo   git pull origin main
    echo   git push origin main
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✅ SUCCES !
echo ========================================
echo.
echo Votre code a ete pousse sur GitHub avec succes !
echo.
echo Prochaines etapes:
echo 1. Allez sur https://github.com/XrOne/jenia-portfolio
echo 2. Verifiez que tous les fichiers sont presents
echo 3. Deployez sur Vercel (voir DEPLOYMENT.md)
echo.
pause
