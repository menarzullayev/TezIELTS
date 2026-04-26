/**
 * Client-side Logger for Simulator Engine
 * Replaces console.log to prevent exposing state/logic to the end user in production.
 * In a real app, this would batch logs and send them to an APM (e.g. Sentry, Datadog) or backend.
 */

const IS_DEV = process.env.NODE_ENV === 'development';

export const log_i = (event: string, data?: any) => {
  if (IS_DEV) {
    console.log(`[INFO] ${event}:`, data || '');
  }
  // TODO: Implement beacon API or fetch to send analytics/logs to backend
};

export const log_w = (event: string, data?: any) => {
  if (IS_DEV) {
    console.warn(`[WARN] ${event}:`, data || '');
  }
};

export const log_e = (event: string, error: any) => {
  if (IS_DEV) {
    console.error(`[ERROR] ${event}:`, error);
  }
  // TODO: Send critical error to backend
};
