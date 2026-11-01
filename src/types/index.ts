export type SourceType = 'news' | 'official' | 'sns' | 'rumor' | 'community' | 'expert' | 'video' | 'blog';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sourceType: SourceType;
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
  author?: string;
  engagement?: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
  };
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
  totalSources: number;
  sourceBreakdown: {
    news: number;
    official: number;
    sns: number;
    rumor: number;
    community: number;
    expert: number;
  };
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
  provider: 'openai' | 'anthropic';
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  newsApiKey?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  pricing?: {
    input: number;
    output: number;
  };
}

export interface APIUsage {
  totalRequests: number;
  totalTokens: number;
  lastRequest?: string;
  estimatedCost: number;
}

export interface SearchFilters {
  dateRange: '1h' | '6h' | '24h' | '7d' | '30d' | 'all';
  credibility: number;
  biasFilter: 'all' | 'left' | 'center' | 'right';
  sortBy: 'importance' | 'date' | 'credibility' | 'relevance';
  sourceType: 'all' | SourceType;
}

export interface SearchStrategy {
  mainQuery: string;
  relatedQueries: string[];
  angles: string[];
  keyEntities: string[];
  suggestedSources: string[];
}
