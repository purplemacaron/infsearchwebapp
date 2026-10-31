export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sourceCredibility: number; // 0-100
  publishedAt: string;
  importance: number; // 0-100
  bias: 'left' | 'center' | 'right' | 'mixed';
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  keywords: string[];
  entities: string[];
  factCheckStatus: 'verified' | 'disputed' | 'unverified' | 'partially-verified';
  relatedArticles: string[];
  thumbnail?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  type?: 'chat' | 'research' | 'factcheck' | 'summary';
}

export interface AISummary {
  overview: string;
  keyPoints: string[];
  timeline: TimelineEvent[];
  consensus: string;
  controversies: string[];
  confidence: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  sources: string[];
}

export interface FactCheckResult {
  claim: string;
  status: 'true' | 'false' | 'partially-true' | 'unverified' | 'misleading';
  evidence: string[];
  sources: { name: string; url: string; credibility: number }[];
  explanation: string;
}

export interface BiasAnalysis {
  overallBias: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  framing: string[];
  loadedLanguage: string[];
  omittedContext: string[];
  comparisonWithOtherSources: string;
}

export interface APIConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface SearchFilters {
  dateRange: '1h' | '6h' | '24h' | '7d' | '30d' | 'all';
  credibility: number;
  biasFilter: 'all' | 'left' | 'center' | 'right';
  sortBy: 'importance' | 'date' | 'credibility' | 'relevance';
}
