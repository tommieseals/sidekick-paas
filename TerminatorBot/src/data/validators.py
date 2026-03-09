"""
TerminatorBot - Data Validation Module

Handles validation of market data including:
- Missing data detection and handling
- Outlier detection and filtering
- Stale price detection
- Data integrity checks
- Price consistency validation
"""

from __future__ import annotations

import logging
import statistics
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Optional, Sequence

import numpy as np

logger = logging.getLogger(__name__)


class ValidationLevel(Enum):
    """Severity level for validation issues."""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


@dataclass
class ValidationIssue:
    """A single validation issue."""
    field: str
    message: str
    level: ValidationLevel
    value: any = None
    suggested_fix: any = None


@dataclass
class ValidationResult:
    """Result of data validation."""
    is_valid: bool
    issues: list[ValidationIssue] = field(default_factory=list)
    cleaned_data: dict = field(default_factory=dict)
    
    @property
    def errors(self) -> list[str]:
        """Get list of error messages."""
        return [
            f"{issue.field}: {issue.message}"
            for issue in self.issues
            if issue.level in (ValidationLevel.ERROR, ValidationLevel.CRITICAL)
        ]
    
    @property
    def warnings(self) -> list[str]:
        """Get list of warning messages."""
        return [
            f"{issue.field}: {issue.message}"
            for issue in self.issues
            if issue.level == ValidationLevel.WARNING
        ]
    
    @property
    def has_warnings(self) -> bool:
        return any(i.level == ValidationLevel.WARNING for i in self.issues)
    
    @property
    def has_errors(self) -> bool:
        return any(
            i.level in (ValidationLevel.ERROR, ValidationLevel.CRITICAL)
            for i in self.issues
        )


class DataValidator:
    """
    Validates market data for quality and integrity.
    
    Checks:
    - Price ranges (0-1 for probability markets)
    - Volume sanity
    - Missing fields
    - Stale data
    - Outliers
    - Price consistency (yes + no ≈ 1)
    """

    # Price bounds
    MIN_PRICE = 0.0
    MAX_PRICE = 1.0
    
    # Price consistency (yes_price + no_price should be close to 1.0)
    PRICE_SUM_TOLERANCE = 0.10  # Allow 10% deviation
    
    # Volume thresholds
    MIN_VOLUME_THRESHOLD = 0  # Minimum volume to be valid
    MAX_VOLUME_THRESHOLD = 1e12  # Sanity check for volume
    
    # Outlier detection (z-score threshold)
    OUTLIER_Z_THRESHOLD = 3.0
    
    # Stale data thresholds
    STALE_PRICE_MINUTES = 5  # Price older than this = stale
    STALE_DATA_HOURS = 24  # Data older than this = very stale

    def __init__(
        self,
        strict_mode: bool = False,
        auto_clean: bool = True,
    ):
        """
        Initialize validator.
        
        Args:
            strict_mode: If True, warnings become errors
            auto_clean: If True, attempt to fix minor issues
        """
        self.strict_mode = strict_mode
        self.auto_clean = auto_clean

    # ─────────────────────────────────────────────────────────────────
    # Main Validation Methods
    # ─────────────────────────────────────────────────────────────────

    def validate_market_data(
        self,
        yes_price: float | None = None,
        no_price: float | None = None,
        volume: float | None = None,
        liquidity: float | None = None,
        open_interest: float | None = None,
        close_date: str | None = None,
        last_updated: str | None = None,
        **extra_fields,
    ) -> ValidationResult:
        """
        Validate a single market's data.
        
        Returns ValidationResult with issues and optionally cleaned data.
        """
        issues = []
        cleaned = {}
        
        # Validate prices
        if yes_price is not None:
            price_result = self._validate_price(yes_price, "yes_price")
            issues.extend(price_result.issues)
            cleaned["yes_price"] = price_result.cleaned_data.get("yes_price", yes_price)
        else:
            issues.append(ValidationIssue(
                field="yes_price",
                message="Missing yes_price",
                level=ValidationLevel.ERROR,
            ))
            
        if no_price is not None:
            price_result = self._validate_price(no_price, "no_price")
            issues.extend(price_result.issues)
            cleaned["no_price"] = price_result.cleaned_data.get("no_price", no_price)
        else:
            issues.append(ValidationIssue(
                field="no_price",
                message="Missing no_price",
                level=ValidationLevel.ERROR,
            ))
        
        # Check price consistency
        if yes_price is not None and no_price is not None:
            consistency_result = self._check_price_consistency(yes_price, no_price)
            issues.extend(consistency_result.issues)
        
        # Validate volume
        if volume is not None:
            vol_result = self._validate_volume(volume)
            issues.extend(vol_result.issues)
            cleaned["volume"] = vol_result.cleaned_data.get("volume", volume)
        
        # Validate liquidity
        if liquidity is not None:
            liq_result = self._validate_positive_numeric(liquidity, "liquidity")
            issues.extend(liq_result.issues)
            cleaned["liquidity"] = liq_result.cleaned_data.get("liquidity", liquidity)
            
        # Validate open_interest
        if open_interest is not None:
            oi_result = self._validate_positive_numeric(open_interest, "open_interest")
            issues.extend(oi_result.issues)
            cleaned["open_interest"] = oi_result.cleaned_data.get("open_interest", open_interest)
        
        # Validate close_date
        if close_date:
            date_result = self._validate_date(close_date, "close_date")
            issues.extend(date_result.issues)
        
        # Check staleness
        if last_updated:
            stale_result = self._check_staleness(last_updated)
            issues.extend(stale_result.issues)
        
        # Determine overall validity
        has_errors = any(
            i.level in (ValidationLevel.ERROR, ValidationLevel.CRITICAL)
            for i in issues
        )
        
        # In strict mode, warnings are also failures
        if self.strict_mode:
            has_errors = has_errors or any(
                i.level == ValidationLevel.WARNING for i in issues
            )
        
        return ValidationResult(
            is_valid=not has_errors,
            issues=issues,
            cleaned_data=cleaned if self.auto_clean else {},
        )

    def validate_market_batch(
        self,
        markets: list[dict],
    ) -> tuple[list[dict], list[tuple[int, ValidationResult]]]:
        """
        Validate a batch of markets.
        
        Returns:
            (valid_markets, invalid_with_results)
            where invalid_with_results is list of (index, ValidationResult)
        """
        valid = []
        invalid = []
        
        for i, market in enumerate(markets):
            result = self.validate_market_data(
                yes_price=market.get("yes_price"),
                no_price=market.get("no_price"),
                volume=market.get("volume"),
                liquidity=market.get("liquidity"),
                open_interest=market.get("open_interest"),
                close_date=market.get("close_date"),
                last_updated=market.get("last_updated"),
            )
            
            if result.is_valid:
                if self.auto_clean:
                    # Merge cleaned data back
                    cleaned_market = {**market, **result.cleaned_data}
                    valid.append(cleaned_market)
                else:
                    valid.append(market)
            else:
                invalid.append((i, result))
        
        if invalid:
            logger.warning(
                "Batch validation: %d valid, %d invalid",
                len(valid), len(invalid)
            )
        
        return valid, invalid

    # ─────────────────────────────────────────────────────────────────
    # Individual Field Validators
    # ─────────────────────────────────────────────────────────────────

    def _validate_price(
        self,
        price: float,
        field_name: str,
    ) -> ValidationResult:
        """Validate a probability price (0-1 range)."""
        issues = []
        cleaned = {field_name: price}
        
        # Check for NaN/Inf
        if np.isnan(price) or np.isinf(price):
            issues.append(ValidationIssue(
                field=field_name,
                message=f"Invalid value: {price}",
                level=ValidationLevel.ERROR,
                value=price,
            ))
            return ValidationResult(is_valid=False, issues=issues)
        
        # Check range
        if price < self.MIN_PRICE:
            if self.auto_clean:
                cleaned[field_name] = self.MIN_PRICE
                issues.append(ValidationIssue(
                    field=field_name,
                    message=f"Price {price} below minimum, clamped to {self.MIN_PRICE}",
                    level=ValidationLevel.WARNING,
                    value=price,
                    suggested_fix=self.MIN_PRICE,
                ))
            else:
                issues.append(ValidationIssue(
                    field=field_name,
                    message=f"Price {price} below valid range [0, 1]",
                    level=ValidationLevel.ERROR,
                    value=price,
                ))
        elif price > self.MAX_PRICE:
            if self.auto_clean:
                cleaned[field_name] = self.MAX_PRICE
                issues.append(ValidationIssue(
                    field=field_name,
                    message=f"Price {price} above maximum, clamped to {self.MAX_PRICE}",
                    level=ValidationLevel.WARNING,
                    value=price,
                    suggested_fix=self.MAX_PRICE,
                ))
            else:
                issues.append(ValidationIssue(
                    field=field_name,
                    message=f"Price {price} above valid range [0, 1]",
                    level=ValidationLevel.ERROR,
                    value=price,
                ))
        
        has_errors = any(i.level == ValidationLevel.ERROR for i in issues)
        return ValidationResult(
            is_valid=not has_errors,
            issues=issues,
            cleaned_data=cleaned,
        )

    def _check_price_consistency(
        self,
        yes_price: float,
        no_price: float,
    ) -> ValidationResult:
        """Check that yes_price + no_price ≈ 1.0."""
        issues = []
        
        price_sum = yes_price + no_price
        deviation = abs(price_sum - 1.0)
        
        if deviation > self.PRICE_SUM_TOLERANCE:
            # Large deviation - might indicate different contract types
            issues.append(ValidationIssue(
                field="price_consistency",
                message=f"yes + no = {price_sum:.3f} (deviation: {deviation:.3f})",
                level=ValidationLevel.WARNING,
                value=price_sum,
            ))
        
        # Check if prices are exactly inverse (should be)
        if yes_price + no_price > 1.0 + 0.02:
            # Overpriced market (arb opportunity?)
            issues.append(ValidationIssue(
                field="price_sum",
                message=f"Market is overpriced: yes + no = {price_sum:.3f}",
                level=ValidationLevel.INFO,
                value=price_sum,
            ))
        elif yes_price + no_price < 1.0 - 0.02:
            # Underpriced market
            issues.append(ValidationIssue(
                field="price_sum",
                message=f"Market is underpriced: yes + no = {price_sum:.3f}",
                level=ValidationLevel.INFO,
                value=price_sum,
            ))
        
        return ValidationResult(is_valid=True, issues=issues)

    def _validate_volume(self, volume: float) -> ValidationResult:
        """Validate volume field."""
        issues = []
        cleaned = {"volume": volume}
        
        if np.isnan(volume) or np.isinf(volume):
            issues.append(ValidationIssue(
                field="volume",
                message=f"Invalid volume value: {volume}",
                level=ValidationLevel.ERROR,
                value=volume,
            ))
            return ValidationResult(is_valid=False, issues=issues)
        
        if volume < self.MIN_VOLUME_THRESHOLD:
            if self.auto_clean:
                cleaned["volume"] = 0
                issues.append(ValidationIssue(
                    field="volume",
                    message=f"Negative volume {volume}, set to 0",
                    level=ValidationLevel.WARNING,
                    value=volume,
                    suggested_fix=0,
                ))
            else:
                issues.append(ValidationIssue(
                    field="volume",
                    message=f"Volume cannot be negative: {volume}",
                    level=ValidationLevel.ERROR,
                    value=volume,
                ))
        
        if volume > self.MAX_VOLUME_THRESHOLD:
            issues.append(ValidationIssue(
                field="volume",
                message=f"Suspiciously high volume: {volume}",
                level=ValidationLevel.WARNING,
                value=volume,
            ))
        
        has_errors = any(i.level == ValidationLevel.ERROR for i in issues)
        return ValidationResult(
            is_valid=not has_errors,
            issues=issues,
            cleaned_data=cleaned,
        )

    def _validate_positive_numeric(
        self,
        value: float,
        field_name: str,
    ) -> ValidationResult:
        """Validate a positive numeric field."""
        issues = []
        cleaned = {field_name: value}
        
        if np.isnan(value) or np.isinf(value):
            issues.append(ValidationIssue(
                field=field_name,
                message=f"Invalid value: {value}",
                level=ValidationLevel.ERROR,
                value=value,
            ))
            return ValidationResult(is_valid=False, issues=issues)
        
        if value < 0:
            if self.auto_clean:
                cleaned[field_name] = 0
                issues.append(ValidationIssue(
                    field=field_name,
                    message=f"Negative {field_name} {value}, set to 0",
                    level=ValidationLevel.WARNING,
                    value=value,
                    suggested_fix=0,
                ))
            else:
                issues.append(ValidationIssue(
                    field=field_name,
                    message=f"{field_name} cannot be negative: {value}",
                    level=ValidationLevel.ERROR,
                    value=value,
                ))
        
        has_errors = any(i.level == ValidationLevel.ERROR for i in issues)
        return ValidationResult(
            is_valid=not has_errors,
            issues=issues,
            cleaned_data=cleaned,
        )

    def _validate_date(
        self,
        date_str: str,
        field_name: str,
    ) -> ValidationResult:
        """Validate a date string."""
        issues = []
        
        try:
            # Try parsing ISO format
            if date_str.endswith('Z'):
                date_str = date_str[:-1] + '+00:00'
            dt = datetime.fromisoformat(date_str)
            
            # Check if date is in the past (for close_date)
            if field_name == "close_date":
                now = datetime.now(timezone.utc)
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                if dt < now:
                    issues.append(ValidationIssue(
                        field=field_name,
                        message=f"Close date {date_str} is in the past",
                        level=ValidationLevel.INFO,
                        value=date_str,
                    ))
                    
        except (ValueError, TypeError) as e:
            issues.append(ValidationIssue(
                field=field_name,
                message=f"Invalid date format: {date_str}",
                level=ValidationLevel.WARNING,
                value=date_str,
            ))
        
        return ValidationResult(is_valid=True, issues=issues)

    def _check_staleness(self, last_updated: str) -> ValidationResult:
        """Check if data is stale based on last_updated timestamp."""
        issues = []
        
        try:
            if last_updated.endswith('Z'):
                last_updated = last_updated[:-1] + '+00:00'
            dt = datetime.fromisoformat(last_updated)
            
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
                
            now = datetime.now(timezone.utc)
            age = now - dt
            
            if age > timedelta(hours=self.STALE_DATA_HOURS):
                issues.append(ValidationIssue(
                    field="last_updated",
                    message=f"Data is very stale: {age.total_seconds() / 3600:.1f} hours old",
                    level=ValidationLevel.WARNING,
                    value=last_updated,
                ))
            elif age > timedelta(minutes=self.STALE_PRICE_MINUTES):
                issues.append(ValidationIssue(
                    field="last_updated",
                    message=f"Price may be stale: {age.total_seconds() / 60:.1f} minutes old",
                    level=ValidationLevel.INFO,
                    value=last_updated,
                ))
                
        except (ValueError, TypeError):
            issues.append(ValidationIssue(
                field="last_updated",
                message=f"Invalid timestamp format: {last_updated}",
                level=ValidationLevel.WARNING,
                value=last_updated,
            ))
        
        return ValidationResult(is_valid=True, issues=issues)

    # ─────────────────────────────────────────────────────────────────
    # Outlier Detection
    # ─────────────────────────────────────────────────────────────────

    def detect_outliers(
        self,
        values: Sequence[float],
        method: str = "zscore",
    ) -> list[int]:
        """
        Detect outlier indices in a sequence of values.
        
        Args:
            values: Sequence of numeric values
            method: Detection method ('zscore', 'iqr', 'mad')
            
        Returns:
            List of indices that are outliers
        """
        if len(values) < 3:
            return []
            
        values = np.array(values)
        
        # Remove NaN/Inf for calculation
        valid_mask = np.isfinite(values)
        valid_values = values[valid_mask]
        
        if len(valid_values) < 3:
            return []
        
        if method == "zscore":
            return self._detect_zscore_outliers(values, valid_values)
        elif method == "iqr":
            return self._detect_iqr_outliers(values, valid_values)
        elif method == "mad":
            return self._detect_mad_outliers(values, valid_values)
        else:
            raise ValueError(f"Unknown outlier detection method: {method}")

    def _detect_zscore_outliers(
        self,
        all_values: np.ndarray,
        valid_values: np.ndarray,
    ) -> list[int]:
        """Detect outliers using z-score method."""
        mean = np.mean(valid_values)
        std = np.std(valid_values)
        
        if std == 0:
            return []
            
        outliers = []
        for i, val in enumerate(all_values):
            if np.isfinite(val):
                z = abs(val - mean) / std
                if z > self.OUTLIER_Z_THRESHOLD:
                    outliers.append(i)
            else:
                outliers.append(i)  # NaN/Inf are outliers
                
        return outliers

    def _detect_iqr_outliers(
        self,
        all_values: np.ndarray,
        valid_values: np.ndarray,
    ) -> list[int]:
        """Detect outliers using IQR method."""
        q1 = np.percentile(valid_values, 25)
        q3 = np.percentile(valid_values, 75)
        iqr = q3 - q1
        
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        outliers = []
        for i, val in enumerate(all_values):
            if not np.isfinite(val) or val < lower_bound or val > upper_bound:
                outliers.append(i)
                
        return outliers

    def _detect_mad_outliers(
        self,
        all_values: np.ndarray,
        valid_values: np.ndarray,
    ) -> list[int]:
        """Detect outliers using Median Absolute Deviation."""
        median = np.median(valid_values)
        mad = np.median(np.abs(valid_values - median))
        
        if mad == 0:
            return []
            
        # Modified z-score threshold (typically 3.5 for MAD)
        threshold = 3.5
        
        outliers = []
        for i, val in enumerate(all_values):
            if np.isfinite(val):
                modified_z = 0.6745 * (val - median) / mad
                if abs(modified_z) > threshold:
                    outliers.append(i)
            else:
                outliers.append(i)
                
        return outliers

    def filter_outliers(
        self,
        markets: list[dict],
        price_field: str = "yes_price",
    ) -> tuple[list[dict], list[dict]]:
        """
        Filter outlier markets from a list.
        
        Returns (valid_markets, outlier_markets)
        """
        if not markets:
            return [], []
            
        prices = [m.get(price_field, 0.5) for m in markets]
        outlier_indices = set(self.detect_outliers(prices))
        
        valid = []
        outliers = []
        
        for i, market in enumerate(markets):
            if i in outlier_indices:
                outliers.append(market)
            else:
                valid.append(market)
        
        if outliers:
            logger.info(
                "Filtered %d outlier markets from %d total",
                len(outliers), len(markets)
            )
        
        return valid, outliers

    # ─────────────────────────────────────────────────────────────────
    # Data Imputation
    # ─────────────────────────────────────────────────────────────────

    def impute_missing(
        self,
        market: dict,
        defaults: dict | None = None,
    ) -> dict:
        """
        Fill in missing values with defaults or calculated values.
        
        Args:
            market: Market dict with potentially missing fields
            defaults: Optional custom default values
            
        Returns:
            Market dict with missing values filled
        """
        default_values = {
            "yes_price": 0.5,
            "no_price": 0.5,
            "volume": 0,
            "liquidity": 0,
            "open_interest": 0,
            "category": "other",
            "status": "open",
        }
        
        if defaults:
            default_values.update(defaults)
        
        result = dict(market)
        
        for field, default in default_values.items():
            if field not in result or result[field] is None:
                result[field] = default
                logger.debug("Imputed missing %s with %s", field, default)
        
        # Special case: if yes_price exists but no_price doesn't, derive it
        if "yes_price" in market and market["yes_price"] is not None:
            if "no_price" not in result or result["no_price"] is None:
                result["no_price"] = 1.0 - result["yes_price"]
        
        return result

    def impute_batch(
        self,
        markets: list[dict],
        method: str = "default",
    ) -> list[dict]:
        """
        Impute missing values for a batch of markets.
        
        Args:
            markets: List of market dicts
            method: Imputation method ('default', 'median', 'mean')
            
        Returns:
            List of markets with missing values filled
        """
        if method == "default":
            return [self.impute_missing(m) for m in markets]
        
        # Calculate statistics from valid data
        stats = {}
        for field in ["volume", "liquidity", "open_interest"]:
            values = [
                m.get(field) for m in markets
                if m.get(field) is not None and np.isfinite(m.get(field))
            ]
            if values:
                if method == "median":
                    stats[field] = statistics.median(values)
                else:  # mean
                    stats[field] = statistics.mean(values)
        
        return [self.impute_missing(m, stats) for m in markets]
