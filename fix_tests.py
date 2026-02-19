#!/usr/bin/env python3
"""Fix test_optimizer.py to add missing sample_analysis fixture to TestReportGeneration"""

with open('tests/test_optimizer.py', 'r') as f:
    content = f.read()

# Find the TestReportGeneration class and add sample_analysis fixture after the docstring
old_fixture = '''class TestReportGeneration:
    """Tests for report generation."""

    @pytest.fixture
    def sample_recommendation(self, sample_analysis):'''

new_fixture = '''class TestReportGeneration:
    """Tests for report generation."""

    @pytest.fixture
    def sample_analysis(self):
        """Create sample analysis for testing."""
        records = [
            UsageRecord(
                timestamp=datetime(2024, 1, 15, 9, 0),
                model="gpt-4-turbo",
                prompt_tokens=100,
                completion_tokens=50,
                total_tokens=150,
                task_type="simple",
                cost=0.005,
            ),
            UsageRecord(
                timestamp=datetime(2024, 1, 15, 10, 0),
                model="gpt-4-turbo",
                prompt_tokens=500,
                completion_tokens=300,
                total_tokens=800,
                task_type="code",
                cost=0.025,
            ),
            UsageRecord(
                timestamp=datetime(2024, 1, 15, 11, 0),
                model="claude-3-opus",
                prompt_tokens=1000,
                completion_tokens=800,
                total_tokens=1800,
                task_type="reasoning",
                cost=0.075,
            ),
        ]

        cost_by_model = defaultdict(float)
        tokens_by_model = defaultdict(int)
        requests_by_model = defaultdict(int)
        cost_by_task = defaultdict(float)
        tokens_by_task = defaultdict(int)
        task_distribution = defaultdict(int)

        for r in records:
            cost_by_model[r.model] += r.cost
            tokens_by_model[r.model] += r.total_tokens
            requests_by_model[r.model] += 1
            cost_by_task[r.task_type] += r.cost
            tokens_by_task[r.task_type] += r.total_tokens
            task_distribution[r.task_type] += 1

        return UsageAnalysis(
            records=records,
            start_date=datetime(2024, 1, 15),
            end_date=datetime(2024, 1, 15),
            total_requests=3,
            total_tokens=2750,
            total_cost=0.105,
            cost_by_model=dict(cost_by_model),
            tokens_by_model=dict(tokens_by_model),
            requests_by_model=dict(requests_by_model),
            cost_by_task=dict(cost_by_task),
            tokens_by_task=dict(tokens_by_task),
            daily_costs={"2024-01-15": 0.105},
            hourly_distribution={9: 1, 10: 1, 11: 1},
            avg_tokens_per_request=916.67,
            avg_cost_per_request=0.035,
            task_distribution=dict(task_distribution),
        )

    @pytest.fixture
    def sample_recommendation(self, sample_analysis):'''

content = content.replace(old_fixture, new_fixture)

with open('tests/test_optimizer.py', 'w') as f:
    f.write(content)

print("Fixed tests/test_optimizer.py - added sample_analysis fixture to TestReportGeneration")
