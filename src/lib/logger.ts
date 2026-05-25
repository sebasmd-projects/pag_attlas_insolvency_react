// src/lib/logger.ts
// Structured logger for server-side logging
// Replaces console.error with sanitized, structured logging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
}

// Sensitive fields that should be redacted
const SENSITIVE_FIELDS = [
    'password',
    'token',
    'auth_token',
    'access_token',
    'refresh_token',
    'authorization',
    'cookie',
    'secret',
    'api_key',
    'apikey',
    'bearer',
    'cedula',
    'document_number',
    'birth_date',
    'email',
    'phone',
];

/**
 * Redact sensitive information from log context
 */
function redactSensitive(obj: unknown, depth = 0): unknown {
    if (depth > 5) return '[MAX_DEPTH]';
    
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
        // Redact JWT tokens
        if (obj.match(/^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/)) {
            return '[REDACTED_TOKEN]';
        }
        // Redact potential auth headers
        if (obj.toLowerCase().startsWith('bearer ')) {
            return 'Bearer [REDACTED]';
        }
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => redactSensitive(item, depth + 1));
    }
    
    if (typeof obj === 'object') {
        const redacted: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            const lowerKey = key.toLowerCase();
            if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
                redacted[key] = '[REDACTED]';
            } else {
                redacted[key] = redactSensitive(value, depth + 1);
            }
        }
        return redacted;
    }
    
    return obj;
}

/**
 * Format log entry for output
 */
function formatLog(entry: LogEntry): string {
    const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
    if (entry.context && Object.keys(entry.context).length > 0) {
        return `${base} ${JSON.stringify(entry.context)}`;
    }
    return base;
}

/**
 * Create a log entry
 */
function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
        timestamp: new Date().toISOString(),
        level,
        message,
        context: context ? redactSensitive(context) as LogContext : undefined,
    };
}

/**
 * Server-side logger with redaction for sensitive data
 */
export const serverLogger = {
    debug(message: string, context?: LogContext) {
        if (process.env.NODE_ENV === 'development') {
            const entry = createLogEntry('debug', message, context);
            console.debug(formatLog(entry));
        }
    },
    
    info(message: string, context?: LogContext) {
        const entry = createLogEntry('info', message, context);
        console.info(formatLog(entry));
    },
    
    warn(message: string, context?: LogContext) {
        const entry = createLogEntry('warn', message, context);
        console.warn(formatLog(entry));
    },
    
    error(message: string, context?: LogContext) {
        const entry = createLogEntry('error', message, context);
        console.error(formatLog(entry));
    },
};

/**
 * Client-side logger (only logs in development, never exposes sensitive data)
 */
export const clientLogger = {
    debug(message: string) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[DEBUG] ${message}`);
        }
    },
    
    info(message: string) {
        if (process.env.NODE_ENV === 'development') {
            console.info(`[INFO] ${message}`);
        }
    },
    
    warn(message: string) {
        console.warn(`[WARN] ${message}`);
    },
    
    error(message: string) {
        // In production, only log generic error without details
        if (process.env.NODE_ENV === 'production') {
            console.error('[ERROR] An error occurred');
        } else {
            console.error(`[ERROR] ${message}`);
        }
    },
};

export default serverLogger;
