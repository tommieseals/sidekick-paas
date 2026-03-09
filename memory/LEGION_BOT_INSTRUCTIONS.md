# 🚀 PROJECT LEGION - Bot Instructions

**For any bot/agent that needs to run automated job applications**

## Quick Start (One Command)

```bash
ssh tommie@100.88.105.106 "python3 ~/project-legion-rusty-fix/Project-Legion/legion_auto.py --count 5"
```

## Options

```bash
# Apply to 5 jobs (default)
python3 ~/project-legion-rusty-fix/Project-Legion/legion_auto.py

# Apply to 10 jobs
python3 ~/project-legion-rusty-fix/Project-Legion/legion_auto.py --count 10

# Custom search
python3 ~/project-legion-rusty-fix/Project-Legion/legion_auto.py --search "IT Support" --count 5

# Different location
python3 ~/project-legion-rusty-fix/Project-Legion/legion_auto.py --search "Systems Admin" --location "Remote"
```

## How It Works

1. **Navigates** Safari to Indeed job search
2. **Finds** all Easy Apply jobs on the page
3. **Applies** to each one automatically:
   - Fills address, salary, experience
   - Answers Yes to qualification questions
   - Clicks through form pages
   - Submits application
4. **Reports** summary of applications submitted

## Prerequisites

- Safari must be running on Mac Mini
- Safari must be logged into Indeed (tommieseals7700@gmail.com)
- JavaScript from Apple Events must be enabled in Safari

## Profile Data (Auto-filled)

| Field | Value |
|-------|-------|
| Address | 16451 Dunmoor, Houston, TX 77095 |
| Salary | $75,000 |
| Work Auth | US Citizen |
| Relocate | Yes |
| Experience | 5 years |

## Example Bot Task

```
Run Project Legion to apply to 10 IT jobs:
ssh tommie@100.88.105.106 "python3 ~/project-legion-rusty-fix/Project-Legion/legion_auto.py --search 'IT Support' --count 10"
```

## Limitations

- Jobs requiring resume tailoring are skipped
- Some multi-step applications may fail
- Indeed may rate-limit after many applications

## Troubleshooting

If Safari isn't responding:
```bash
ssh tommie@100.88.105.106 "osascript -e 'tell application \"Safari\" to activate'"
```

---
*Last Updated: 2026-03-02*
*Location: Mac Mini (100.88.105.106)*
