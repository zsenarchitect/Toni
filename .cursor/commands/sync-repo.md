
# Sync Repo (Cursor Command)

Safely sync the repo bidirectionally: pull remote changes and push local changes, keeping everything in sync.

## Safety rules

- **Do not lose work**: if there are local changes, commit them before pushing.
- **Prefer rebase** to keep history clean: `git pull --rebase`.
- **If a commit is requested**: keep the whole commit process under **30 seconds**.
- **Always pull before push** to avoid conflicts.

## Steps

1. **Inspect current state**
   - `git status`
   - `git remote -v`
   - `git branch --show-current`
2. **Handle uncommitted local changes**
   - If there are uncommitted changes: stage and commit with a descriptive message
   - If explicitly asked NOT to commit: `git stash push -u -m "wip: before sync"` (restore after sync)
3. **Pull remote changes first**
   - `git fetch --all --prune`
   - `git pull --rebase`
4. **If conflicts happen during pull**
   - Resolve conflicts carefully (prefer the minimal change)
   - `git rebase --continue`
   - Repeat until rebase completes
5. **Push local changes to remote**
   - `git push` (or `git push --set-upstream origin <branch>` if first push)
   - If push fails due to remote changes: pull again, then retry push
6. **Post-sync sanity checks (fast)**
   - For app: `cd hair-vision && npm run lint` (only if needed to verify a fix)

## What to report back

- Current branch name
- Whether sync succeeded (both pull and push)
- Any conflicts + how they were resolved
- Number of commits pushed (if any)
- Any lint/build errors discovered during sanity checks


