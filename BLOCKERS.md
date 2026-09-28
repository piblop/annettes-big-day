# Blockers

- **CI workflow not pushed**: the `piblop` GitHub token lacks the `workflow` scope, so pushing `.github/workflows/ci.yml` is rejected. The file is ready in the working tree. Fix: run `gh auth refresh -h github.com -s workflow` (interactive browser approval), then `git add .github/workflows/ci.yml && git commit -m "ci: validate script and sprites on push" && git push`. Everything else in the release shipped without it; the same validations were run locally and pass.
