"""
Base Worker Pattern
A reusable pattern for building task workers.
"""

import os
import json
import time
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


class BaseWorker(ABC):
    """
    Abstract base class for task workers.
    
    Subclass this and implement the `process` method.
    """
    
    def __init__(self, name: str, config: Optional[Dict] = None):
        self.name = name
        self.config = config or {}
        self.logger = logging.getLogger(name)
        self.running = False
        self.tasks_processed = 0
        self.tasks_failed = 0
    
    @abstractmethod
    def process(self, task: Dict) -> Any:
        """
        Process a single task. Override this in your worker.
        
        Args:
            task: Task dictionary with 'id', 'type', 'payload'
            
        Returns:
            Result of processing (any type)
            
        Raises:
            Exception if processing fails
        """
        pass
    
    def get_task(self) -> Optional[Dict]:
        """
        Get the next task from queue.
        Override to use your queue system (Redis, etc.)
        """
        # Default: no-op, override in subclass
        return None
    
    def report_success(self, task: Dict, result: Any) -> None:
        """Report successful task completion."""
        self.tasks_processed += 1
        self.logger.info(f"Task {task.get('id')} completed successfully")
    
    def report_failure(self, task: Dict, error: Exception) -> None:
        """Report task failure."""
        self.tasks_failed += 1
        self.logger.error(f"Task {task.get('id')} failed: {error}")
    
    def run(self, max_tasks: Optional[int] = None) -> None:
        """
        Main worker loop.
        
        Args:
            max_tasks: Stop after N tasks (None = run forever)
        """
        self.running = True
        self.logger.info(f"Worker '{self.name}' starting...")
        
        tasks_run = 0
        while self.running:
            if max_tasks and tasks_run >= max_tasks:
                break
                
            task = self.get_task()
            if not task:
                time.sleep(1)  # No task, wait before retry
                continue
            
            start_time = time.time()
            try:
                result = self.process(task)
                duration = time.time() - start_time
                self.report_success(task, result)
                self.logger.info(f"Task completed in {duration:.2f}s")
            except Exception as e:
                self.report_failure(task, e)
            
            tasks_run += 1
        
        self.logger.info(f"Worker stopped. Processed: {self.tasks_processed}, Failed: {self.tasks_failed}")
    
    def stop(self) -> None:
        """Stop the worker gracefully."""
        self.running = False


class ExampleWorker(BaseWorker):
    """
    Example worker implementation.
    Replace the process method with your logic.
    """
    
    def process(self, task: Dict) -> Dict:
        """
        Example processing logic.
        """
        payload = task.get('payload', {})
        
        # Your processing logic here
        result = {
            'processed': True,
            'input': payload,
            'timestamp': datetime.now().isoformat()
        }
        
        return result


# Example usage
if __name__ == '__main__':
    # Create worker
    worker = ExampleWorker(
        name='example-worker',
        config={'timeout': 30}
    )
    
    # For testing, process a single task directly
    test_task = {
        'id': 'test-123',
        'type': 'example',
        'payload': {'message': 'Hello, World!'}
    }
    
    result = worker.process(test_task)
    print(f"Result: {json.dumps(result, indent=2)}")
