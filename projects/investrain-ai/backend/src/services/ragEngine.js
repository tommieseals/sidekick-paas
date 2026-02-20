import { getChatHistory, addChatMessage } from '../db/sqlite.js';
import { queryLLM } from './llm.js';

/**
 * RAG Engine - Retrieval-Augmented Generation for Portfolio Q&A
 * 
 * Pipeline:
 * 1. Retrieve portfolio context (holdings, prices, metrics)
 * 2. Build enhanced prompt with financial data
 * 3. Query LLM with context
 * 4. Format and return response
 */

/**
 * Build context string from portfolio data
 */
function buildPortfolioContext(portfolioData) {
  const { 
    portfolioValue, 
    dailyChange, 
    dailyChangePercent,
    holdings, 
    sectors, 
    topGainer, 
    topLoser, 
    highestRisk,
    beta 
  } = portfolioData;
  
  // Format currency
  const fmt = (n) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2 
  }).format(n);
  
  const pct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
  
  // Build holdings table
  const holdingsTable = holdings.map(h => 
    `| ${h.symbol.padEnd(6)} | ${h.shares.toString().padStart(6)} | ${fmt(h.value).padStart(12)} | ${pct(h.dayChangePercent).padStart(8)} | ${pct(h.gainPercent).padStart(10)} | ${h.sector.padEnd(12)} | ${(h.volatility * 100).toFixed(1)}% |`
  ).join('\n');
  
  // Build sectors breakdown
  const sectorsBreakdown = Object.entries(sectors)
    .sort((a, b) => b[1].percent - a[1].percent)
    .map(([name, data]) => `- ${name}: ${data.percent.toFixed(1)}% (${fmt(data.value)})`)
    .join('\n');
  
  return `
PORTFOLIO SUMMARY:
==================
Total Value: ${fmt(portfolioValue)}
Today's Change: ${fmt(dailyChange)} (${pct(dailyChangePercent)})
Portfolio Beta: ${beta.toFixed(2)} (vs S&P 500 = 1.0)
Number of Holdings: ${holdings.length}

HOLDINGS:
=========
| Symbol | Shares |        Value |   Today |   Total P&L | Sector       | Vol.  |
|--------|--------|--------------|---------|-------------|--------------|-------|
${holdingsTable}

SECTOR ALLOCATION:
==================
${sectorsBreakdown}

KEY METRICS:
============
- Top Gainer Today: ${topGainer?.symbol} (${pct(topGainer?.dayChangePercent || 0)})
- Top Loser Today: ${topLoser?.symbol} (${pct(topLoser?.dayChangePercent || 0)})
- Highest Risk Asset: ${highestRisk?.symbol} (Volatility: ${((highestRisk?.volatility || 0) * 100).toFixed(1)}%, Beta: ${highestRisk?.beta?.toFixed(2) || 'N/A'})
- Most Concentrated Sector: ${Object.entries(sectors).sort((a, b) => b[1].percent - a[1].percent)[0]?.[0] || 'N/A'}

RISK PROFILE:
=============
- Portfolio Beta ${beta.toFixed(2)} means your portfolio is ${beta > 1 ? 'more volatile' : 'less volatile'} than the market.
- ${beta > 1.3 ? '⚠️ High beta suggests elevated market risk.' : beta < 0.8 ? '✅ Low beta suggests defensive positioning.' : '📊 Moderate risk profile.'}
`.trim();
}

/**
 * System prompt for the financial AI
 */
const SYSTEM_PROMPT = `You are an expert financial analyst assistant helping users understand their investment portfolio. 

Your role:
1. Analyze portfolio data and provide clear, actionable insights
2. Answer questions using specific numbers from the portfolio
3. Explain financial concepts in simple terms
4. Highlight risks and opportunities
5. Never give specific buy/sell recommendations (say "consider" instead)

Style:
- Be concise but thorough
- Use bullet points for lists
- Bold important numbers and symbols
- Reference specific holdings when relevant
- Compare to benchmarks (S&P 500, sector averages)
- Be honest about limitations

Important disclaimers:
- This is educational analysis, not financial advice
- Past performance doesn't guarantee future results
- Always recommend consulting a financial advisor for major decisions`;

/**
 * Answer a question about the portfolio
 */
export async function answerQuestion(question, portfolioData) {
  // Build the enhanced prompt with portfolio context
  const context = buildPortfolioContext(portfolioData);
  
  const prompt = `${SYSTEM_PROMPT}

---
PORTFOLIO DATA:
${context}
---

USER QUESTION: ${question}

Provide a helpful, data-driven response. Reference specific numbers from the portfolio data above.`;

  // Save user message to history
  addChatMessage('user', question);
  
  try {
    // Query the LLM
    const response = await queryLLM(prompt);
    
    // Save assistant message to history
    addChatMessage('assistant', response);
    
    return {
      success: true,
      question,
      answer: response,
      portfolioValue: portfolioData.portfolioValue,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('RAG Engine error:', error);
    
    // Fallback response
    const fallback = generateFallbackResponse(question, portfolioData);
    addChatMessage('assistant', fallback);
    
    return {
      success: true,
      question,
      answer: fallback,
      fallback: true,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generate a basic response without LLM (fallback)
 */
function generateFallbackResponse(question, data) {
  const q = question.toLowerCase();
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  const pct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
  
  // Pattern matching for common questions
  if (q.includes('risk') || q.includes('volatile') || q.includes('dangerous')) {
    const h = data.highestRisk;
    return `Based on volatility analysis, **${h.symbol}** is your highest-risk holding with:\n\n` +
      `- Volatility: ${(h.volatility * 100).toFixed(1)}%\n` +
      `- Beta: ${h.beta.toFixed(2)} (market = 1.0)\n` +
      `- Current Value: ${fmt(h.value)} (${((h.value / data.portfolioValue) * 100).toFixed(1)}% of portfolio)\n\n` +
      `Your overall portfolio beta is ${data.beta.toFixed(2)}.`;
  }
  
  if (q.includes('performance') || q.includes('doing') || q.includes('summary')) {
    return `**Portfolio Summary:**\n\n` +
      `- Total Value: ${fmt(data.portfolioValue)}\n` +
      `- Today's Change: ${fmt(data.dailyChange)} (${pct(data.dailyChangePercent)})\n` +
      `- Top Gainer: ${data.topGainer.symbol} (${pct(data.topGainer.dayChangePercent)})\n` +
      `- Top Loser: ${data.topLoser.symbol} (${pct(data.topLoser.dayChangePercent)})\n` +
      `- Portfolio Beta: ${data.beta.toFixed(2)}`;
  }
  
  if (q.includes('sector') || q.includes('allocation') || q.includes('diversif')) {
    const sectors = Object.entries(data.sectors)
      .sort((a, b) => b[1].percent - a[1].percent)
      .map(([name, d]) => `- ${name}: ${d.percent.toFixed(1)}%`)
      .join('\n');
    return `**Sector Allocation:**\n\n${sectors}\n\n` +
      `${data.sectors['Technology']?.percent > 50 ? '⚠️ Heavy tech concentration. Consider diversifying.' : '✅ Reasonably diversified across sectors.'}`;
  }
  
  if (q.includes('gain') || q.includes('profit') || q.includes('loss') || q.includes('return')) {
    const totalGain = data.holdings.reduce((sum, h) => sum + h.gain, 0);
    const totalGainPercent = (totalGain / (data.portfolioValue - totalGain)) * 100;
    return `**Portfolio Returns:**\n\n` +
      `- Total Unrealized Gain/Loss: ${fmt(totalGain)} (${pct(totalGainPercent)})\n` +
      `- Today's Change: ${fmt(data.dailyChange)} (${pct(data.dailyChangePercent)})\n\n` +
      `Best performer: ${data.holdings.sort((a, b) => b.gainPercent - a.gainPercent)[0].symbol}`;
  }
  
  // Default response
  return `I can help you analyze your portfolio. Here's a quick overview:\n\n` +
    `- Portfolio Value: ${fmt(data.portfolioValue)}\n` +
    `- Holdings: ${data.holdings.length} positions\n` +
    `- Today: ${pct(data.dailyChangePercent)}\n\n` +
    `Try asking about:\n- Risk analysis\n- Sector allocation\n- Performance summary\n- Specific holdings`;
}

/**
 * Get suggested questions based on portfolio state
 */
export function getSuggestedQuestions(portfolioData) {
  const questions = [
    "What is my highest-risk asset?",
    "Summarize my portfolio performance",
    "Am I too concentrated in any sector?",
    "Which holdings are down the most today?",
  ];
  
  // Add contextual suggestions
  if (portfolioData.beta > 1.3) {
    questions.push("Why is my portfolio so volatile?");
  }
  
  const techPercent = portfolioData.sectors['Technology']?.percent || 0;
  if (techPercent > 50) {
    questions.push("Should I reduce my tech exposure?");
  }
  
  return questions.slice(0, 5);
}
