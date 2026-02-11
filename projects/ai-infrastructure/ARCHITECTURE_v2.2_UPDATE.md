# Architecture v2.2 Update Complete
**Date:** February 8, 2026  
**Status:** ✅ All changes applied

## Summary

Successfully migrated from 3-node architecture (Mac Mini + Dell + Oracle Cloud) to 2-node architecture (Mac Mini + Google Cloud VM), removing the Dell i9 work computer from personal AI infrastructure.

## Critical Changes Applied

### 1. Dell Removed from Infrastructure ⚠️

**Why:** Dell i9 at 100.119.87.108 is Tommie's work computer monitored by CrowdStrike enterprise security. Using it for personal AI workloads violates acceptable use policy and creates security liability.

**Action Taken:** Complete removal from all scripts, configs, and role prompts.

### 2. Google Cloud Worker Setup ✅

**New Cloud Worker:**
- **Provider:** Google Cloud (GCP e2-standard-2 instance)
- **Tailscale IP:** 100.107.231.87
- **Ollama Endpoint:** http://100.107.231.87:11434
- **Models:** qwen2.5:7b, nomic-embed-text
- **Additional Tools:** Whisper, yt-dlp for transcription pipeline
- **Security:** UFW firewall (Tailscale + SSH only)

### 3. Model Size Discipline 📏

**Mac Mini (16GB RAM):**
- Only models ≤3GB: qwen2.5:3b, gemma2:2b, phi3:mini, llama3.2:3b
- ✅ Pulled qwen2.5:3b (1.9GB)

**Google Cloud (24GB RAM):**
- 7B+ models: qwen2.5:7b, llama3.1:8b, mistral:7b, etc.
- Primary inference endpoint for heavy workloads

## Files Updated

### Scripts (5 files)
1. **~/scripts/get_free_ram.sh**
   - Removed Dell offload reference
   - Updated messaging to reference "cloud worker"

2. **~/scripts/admin-security.sh**
   - Replaced Dell IP (100.119.87.108) with Google Cloud IP (100.107.231.87)
   - Changed model: qwen2.5:7b-instruct-q8_0 → qwen2.5:3b (local) or qwen2.5:7b (cloud)
   - Added MODEL variable with cloud offload logic

3. **~/scripts/admin-network.sh**
   - Replaced Dell latency check with Google Cloud latency check
   - Updated peer count expectation from 3 to 2
   - Changed variable names: WORKER_IP → CLOUD_IP, WORKER_LATENCY → CLOUD_LATENCY
   - Updated model routing logic

4. **~/scripts/admin-systems.sh**
   - Removed all Dell hardware monitoring
   - Updated context to reference cloud worker instead of Dell
   - Changed model routing to use qwen2.5:3b locally, qwen2.5:7b on cloud
   - Removed Dell offload suggestion message

5. **~/scripts/admin-dta.sh**
   - Updated network data parsing to use cloud_latency instead of worker_latency
   - Changed offload routing to Google Cloud
   - Updated model variable

### Role Prompts (4 files)
All role prompts in `~/clawd/projects/ai-infrastructure/roles/` updated with:

1. **HARD BOUNDARY warning block:**
   ```
   HARD BOUNDARY — DELL COMPUTER:
   The Dell i9 at 100.119.87.108 is Tommie's WORK COMPUTER monitored by CrowdStrike 
   enterprise security. NEVER route tasks, offload work, or send any data to this IP. 
   It is NOT part of the AI infrastructure. If any script or config references 
   100.119.87.108 as a worker/offload target, flag it immediately as a CRITICAL 
   security issue.
   ```

2. **Updated hardware descriptions:**
   - OLD: "Mac Mini hub (16GB), Dell worker (64GB), Oracle Cloud ARM (24GB)"
   - NEW: "Mac Mini hub (M-chip/16GB RAM) + Google Cloud VM (4 OCPU/24GB RAM). Connected via Tailscale VPN."

Files updated:
- security-admin.txt
- network-admin.txt  
- systems-admin.txt
- dta-admin.txt

### Memory & Shared Data (3 files)
1. **~/clawd/MEMORY.md**
   - Updated from Playbook v2.1 to v2.2
   - Removed Dell from hardware nodes
   - Added Dell CRITICAL boundary warning
   - Updated RAM-aware routing thresholds
   - Changed model size recommendations
   - Updated admin role descriptions

2. **~/shared-memory/network.json** - Cleared (removed Dell peer data)
3. **~/shared-memory/systems.json** - Cleared (removed Dell hardware status)
4. **~/shared-memory/security.json** - Cleared (fresh start with new architecture)

## Architecture Overview

### Before (v2.1) - WRONG
```
Node 1: Mac Mini (16GB) — Hub/Orchestrator
Node 2: Dell i9 (64GB) — Worker ❌ WORK COMPUTER
Node 3: Oracle Cloud ARM (24GB) — Failover (not provisioned)
```

### After (v2.2) - CORRECT
```
Node 1: Mac Mini (16GB) — Hub/Orchestrator + small models (3B)
Node 2: Google Cloud VM (24GB) — Worker + large models (7B+)

REMOVED: Dell i9 (100.119.87.108) — PERMANENTLY OFF LIMITS
```

## RAM-Aware Routing Logic

| Free RAM | Action | Model | Location |
|----------|--------|-------|----------|
| >8 GB | Run locally | qwen2.5:3b | Mac Mini |
| 5-8 GB | Offload heavy | qwen2.5:7b | Google Cloud |
| 3-5 GB | Offload or defer | qwen2.5:7b | Google Cloud |
| <3 GB | Skip & alert | - | - |

## Verification Checklist

✅ **qwen2.5:3b pulled** on Mac Mini (1.9GB)  
✅ **Cloud worker accessible** at http://100.107.231.87:11434  
✅ **Cloud models confirmed:** qwen2.5:7b, nomic-embed-text  
✅ **All scripts updated** (5 files)  
✅ **All role prompts updated** (4 files)  
✅ **MEMORY.md updated** with new architecture  
✅ **Shared-memory cleared** of Dell data  
✅ **get_free_ram.sh tested** - working  
⏸️ **Admin scripts tested** - RAM currently low (2.9GB), will test when >3GB  

## Next Steps

1. **Test full admin cycle when RAM >3GB:**
   ```bash
   ~/scripts/admin-security.sh
   ~/scripts/admin-network.sh
   ~/scripts/admin-systems.sh
   ~/scripts/admin-dta.sh
   ```

2. **Verify cloud offload logic** when RAM drops below 5GB

3. **Monitor for any remaining Dell references** in logs or outputs

4. **Update LaunchAgents** if any are configured to reference Dell

## Important Reminders

🚫 **NEVER use 100.119.87.108 for any personal AI tasks**  
✅ **Mac Mini: 3B models only** (qwen2.5:3b, gemma2:2b, phi3:mini)  
✅ **Google Cloud: 7B+ models** (qwen2.5:7b, llama3.1:8b, etc.)  
✅ **All offload routing points to:** 100.107.231.87:11434  

---

*Architecture correction completed at 00:40 CST, February 8, 2026*  
*All Dell references removed. 2-node Google Cloud architecture active.*
