## YOUR ROLE - CODING AGENT

You are continuing work on a long-running autonomous development task for Gojica 2.0.
This is a FRESH context window - you have no memory of previous sessions.

### STEP 1: GET YOUR BEARINGS (MANDATORY)

Start by orienting yourself:

```bash
# 1. See your working directory
pwd

# 2. List files to understand project structure
ls -la

# 3. Read the project specification
cat harness/prompts/app_spec.txt

# 4. Read the feature list to see all work
cat feature_list.json | head -50

# 5. Read progress notes from previous sessions
cat claude-progress.txt

# 6. Check recent git history
git log --oneline -20

# 7. Count remaining tests
grep '"passes": false' feature_list.json | wc -l
```

### STEP 2: START SERVERS (IF NOT RUNNING)

If `init.sh` exists, run it:
```bash
chmod +x init.sh
./init.sh
```

Otherwise, start servers manually:
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd Gojica2.0前端
npm run dev
```

### STEP 3: VERIFICATION TEST (CRITICAL!)

**MANDATORY BEFORE NEW WORK:**

Before implementing anything new, verify the app still works by running existing tests.

Run Playwright tests to check for regressions:
```bash
cd Gojica2.0前端
npx playwright test
```

Or run backend tests:
```bash
cd server
node comprehensive-test.js
```

**If you find ANY issues:**
- Mark that feature as "passes": false immediately in feature_list.json
- Fix the issues BEFORE moving to new features
- Document issues in claude-progress.txt

### STEP 4: CHOOSE ONE FEATURE TO IMPLEMENT

Look at feature_list.json and find the highest-priority feature with "passes": false.

The list is ordered by priority - work from top to bottom.

Focus on completing one feature perfectly before moving on.

### STEP 5: IMPLEMENT THE FEATURE

Implement the chosen feature:
1. Write the code (frontend in Gojica2.0前端/, backend in server/)
2. Test manually using Playwright
3. Fix any issues discovered
4. Verify the feature works end-to-end

### STEP 6: VERIFY WITH PLAYWRIGHT

**CRITICAL:** You MUST verify features through the actual UI.

Use Playwright browser automation:
```bash
cd Gojica2.0前端
npx playwright test
```

Or run specific test:
```bash
npx playwright test test-follow-fixed.js
```

**DO:**
- Test through the UI with clicks and keyboard input
- Take screenshots to verify visual appearance
- Check for console errors in browser
- Verify complete user workflows end-to-end

**DON'T:**
- Only test with curl commands (backend alone is insufficient)
- Use JavaScript evaluation to bypass UI
- Skip visual verification
- Mark tests passing without thorough verification

### STEP 7: UPDATE feature_list.json (CAREFULLY!)

**YOU CAN ONLY MODIFY ONE FIELD: "passes"**

After thorough verification, change:
```json
"passes": false
```
to:
```json
"passes": true
```

**NEVER:**
- Remove tests
- Edit test descriptions
- Modify test steps
- Combine or consolidate tests
- Reorder tests

**ONLY CHANGE "passes" FIELD AFTER VERIFICATION.**

### STEP 8: COMMIT YOUR PROGRESS

Make a descriptive git commit:
```bash
git add .
git commit -m "Implement: [feature description]

- Added [specific changes]
- Tested with Playwright E2E tests
- Updated feature_list.json: marked as passing
"
```

### STEP 9: UPDATE PROGRESS NOTES

Update `claude-progress.txt` with:
- What you accomplished this session
- Which test(s) you completed
- Any issues discovered or fixed
- Current completion status

### STEP 10: END SESSION CLEANLY

Before context fills up:
1. Commit all working code
2. Update claude-progress.txt
3. Update feature_list.json if tests verified
4. Ensure no uncommitted changes
5. Leave app in working state

---

## IMPORTANT REMINDERS

**Your Goal:** All features in feature_list.json marked as passing

**This Session's Goal:** Complete at least one feature perfectly

**Priority:** Fix broken tests before implementing new features

**Quality Bar:**
- Zero console errors
- Polished UI
- All features work end-to-end
- Playwright tests passing

---

Begin by running Step 1 (Get Your Bearings).
