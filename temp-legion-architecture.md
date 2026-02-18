# Project Legion - Architecture Overview

## What is Project Legion?

An AI-powered multi-agent system for automated task execution and monitoring.

## Core Components

```
┌─────────────────────────────────────────────────────────┐
│                    Project Legion                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Workers   │  │   Queue     │  │  Scheduler  │     │
│  │             │  │  (Redis)    │  │  (Cron)     │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         └────────────────┼────────────────┘             │
│                          │                              │
│                   ┌──────┴──────┐                       │
│                   │  Coordinator │                       │
│                   │   (Python)   │                       │
│                   └──────┬──────┘                       │
│                          │                              │
│         ┌────────────────┼────────────────┐             │
│         │                │                │             │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐     │
│  │   LLM API   │  │  Database   │  │   Storage   │     │
│  │  (Ollama)   │  │  (SQLite)   │  │   (Files)   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Worker Pattern

Workers are independent agents that:
1. Pull tasks from a queue
2. Execute using LLM or custom logic
3. Report results back
4. Handle failures gracefully

### Base Worker Structure

```python
class BaseWorker:
    def __init__(self, name, queue):
        self.name = name
        self.queue = queue
    
    def run(self):
        while True:
            task = self.queue.get()
            try:
                result = self.process(task)
                self.report_success(task, result)
            except Exception as e:
                self.report_failure(task, e)
    
    def process(self, task):
        """Override this in your worker"""
        raise NotImplementedError
```

## Queue System

Uses Redis for:
- Task distribution
- Result collection
- Worker coordination
- Pub/sub for real-time updates

### Queue Schema

```python
# Task structure
{
    "id": "uuid",
    "type": "worker_type",
    "payload": { ... },
    "priority": 1-10,
    "created_at": "timestamp",
    "timeout": 300
}

# Result structure
{
    "task_id": "uuid",
    "status": "success|failure",
    "result": { ... },
    "duration_ms": 1234,
    "completed_at": "timestamp"
}
```

## Scheduler

Cron-based scheduling for:
- Periodic health checks
- Batch processing jobs
- Cleanup tasks
- Report generation

## Getting Started

1. Install dependencies
2. Set up Redis
3. Configure environment variables
4. Create your workers
5. Define your task types
6. Start the coordinator

See `/docs/setup.md` for detailed instructions.
