@echo off
git diff --name-only main...codex/complete-formdata-initial-state-and-add-mutation > diff_output.txt 2>&1
echo Done >> diff_output.txt
