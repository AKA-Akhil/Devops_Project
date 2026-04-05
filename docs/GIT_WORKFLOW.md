# Devops project Git Workflow

## Branch strategy

- `main`: production-ready code.
- `develop`: integration branch.
- `feature/<short-name>`: feature work.
- `fix/<short-name>`: bug fixes.
- `chore/<short-name>`: maintenance.

## Commit message format

Use Conventional Commits:

- `feat: add repository pulse panel`
- `fix: handle empty weekly commit stats`
- `docs: add kubernetes deployment guide`

## Pull request policy

1. Open PR from feature branch into `develop`.
2. Wait for green CI checks.
3. Request at least one review.
4. Squash merge into `develop`.
5. Merge `develop` into `main` for release.

## Release tagging

- Tag release commits on `main` as `vX.Y.Z`.
- Example: `v1.0.0`.
