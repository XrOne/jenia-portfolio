@echo off
echo Checking status... > deploy_log.txt
git status >> deploy_log.txt 2>&1
echo Adding files... >> deploy_log.txt
git add . >> deploy_log.txt 2>&1
echo Committing... >> deploy_log.txt
git commit -m "fix: resolve build errors and add missions/experience features" >> deploy_log.txt 2>&1
echo Pushing... >> deploy_log.txt
git push >> deploy_log.txt 2>&1
echo Done. >> deploy_log.txt
