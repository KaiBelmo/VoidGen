export interface ValidationConfig {
  requiredFields?: string[];
  errorStatus?: number;
}

export interface ErrorInjectionConfig {
  enabled: boolean;
  statusCode?: number;
  message?: string;
  probability?: number; // 0-1, chance of error
}

export interface RateLimitConfig {
  windowMs: number; // time window in milliseconds
  maxRequests: number; // max requests per window
  message?: string;
  statusCode?: number;
}

export interface BehaviorConfig {
  delay?: number;
  validation?: ValidationConfig;
  errorInjection?: ErrorInjectionConfig;
  rateLimit?: RateLimitConfig;
}
