
# Sync Repo (Cursor Command)

Safely sync **all changes** that have happened: pull all remote changes and push all local changes, ensuring complete bidirectional synchronization. This command ensures nothing is left behind - all commits, all files, all changes are synced.

## Safety rules

- **Do not lose work**: if there are local changes, commit them before pushing.
- **Prefer rebase** to keep history clean: `git pull --rebase`.
- **If a commit is requested**: keep the whole commit process under **30 seconds**.
- **Always pull before push** to avoid conflicts.

## Steps

1. **Inspect current state (check for ALL changes)**
   - `git status` (check for modified, added, deleted, and untracked files)
   - `git remote -v` (verify remote configuration)
   - `git branch --show-current` (confirm current branch)
   - `git log --oneline -10` (check recent local commits)
   - `git log --oneline origin/<branch> -10` (check recent remote commits, if branch exists remotely)
2. **Handle ALL uncommitted local changes**
   - If there are uncommitted changes (modified, added, deleted, or untracked files): stage ALL and commit with a descriptive message
   - Use `git add -A` to ensure all changes are included (modified, new, deleted files)
   - If explicitly asked NOT to commit: `git stash push -u -m "wip: before sync"` (restore after sync)
3. **Pull ALL remote changes first**
   - `git fetch --all --prune` (fetch all branches and prune deleted remote branches)
   - `git pull --rebase` (pull all remote commits and rebase local commits on top)
   - Verify all remote changes were pulled: `git log --oneline HEAD..origin/<branch>` should be empty
4. **If conflicts happen during pull**
   - Resolve conflicts carefully (prefer the minimal change)
   - `git rebase --continue`
   - Repeat until rebase completes (ensure ALL commits are rebased)
5. **Push ALL local changes to remote**
   - `git push` (or `git push --set-upstream origin <branch>` if first push)
   - Verify all local commits were pushed: `git log --oneline origin/<branch>..HEAD` should be empty
   - If push fails due to remote changes: pull again, then retry push (ensure nothing is missed)
6. **Post-sync sanity checks (fast)**
   - For app: `cd hair-vision && npm run lint` (only if needed to verify a fix)

## What to report back

- Current branch name
- Whether sync succeeded (both pull and push)
- Number of commits pulled from remote (if any)
- Number of commits pushed to remote (if any)
- Any uncommitted changes that were committed/stashed
- Any conflicts + how they were resolved
- Verification that all changes were synced (no pending commits on either side)
- Any lint/build errors discovered during sanity checks


