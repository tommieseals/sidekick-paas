"""Command-line interface for LLM Router."""

import argparse
import json
from .router import Router


def main():
    parser = argparse.ArgumentParser(description="LLM Router CLI")
    parser.add_argument("prompt", nargs="?", help="Query prompt")
    parser.add_argument("--task", "-t", default="routine", help="Task type (code, fast, research, etc)")
    parser.add_argument("--image", "-i", help="Image URL for vision tasks")
    parser.add_argument("--provider", "-p", help="Force specific provider")
    parser.add_argument("--health", action="store_true", help="Check provider health")
    parser.add_argument("--usage", action="store_true", help="Show usage statistics")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    
    args = parser.parse_args()
    router = Router()
    
    if args.health:
        result = router.check_health()
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            for pid, status in result.items():
                healthy = "✓" if status.get("healthy") else "✗"
                print(f"{healthy} {pid}: {status}")
        return
    
    if args.usage:
        result = router.get_usage()
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            for pid, stats in result.items():
                print(f"\n{pid}:")
                for day, data in stats.items():
                    print(f"  {day}: {data['calls']} calls, {data['tokens']} tokens")
        return
    
    if not args.prompt:
        parser.print_help()
        return
    
    result = router.query(
        args.prompt,
        task=args.task,
        image_url=args.image,
        force_provider=args.provider
    )
    
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        if result.get("error"):
            print(f"Error: {result['error']}")
        else:
            print(result.get("content", ""))
            print(f"\n---\nProvider: {result.get('provider')} | Model: {result.get('model')} | {result.get('elapsed_ms', 0)}ms")


if __name__ == "__main__":
    main()
