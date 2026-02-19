"""Basic usage example for LLM Router."""

from llm_router import Router

def main():
    # Initialize router
    router = Router()
    
    # Simple query (auto-routes to appropriate model)
    response = router.query("What is the capital of France?")
    print(response.get("content", ""))
    
    # Code task (routes to code-specialized model)
    code_response = router.query(
        "Write a Python function to calculate fibonacci numbers",
        task="code"
    )
    print(code_response.get("content", ""))
    
    # Research task with web search (routes to Perplexity)
    research_response = router.query(
        "What are the latest developments in quantum computing?",
        task="research"
    )
    print(research_response.get("content", ""))
    
    # Check provider health
    health = router.check_health()
    print(f"Provider health: {health}")
    
    # Get usage stats
    usage = router.get_usage()
    print(f"Usage stats: {usage}")


if __name__ == "__main__":
    main()
