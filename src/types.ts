export type ConfigType = {
    endpoint?: "US"|"EU",
    headers?: Record<string, string | undefined>
};

export type LoggerType = {
    apiKey: string,
    licenseKey?: string,
    config?: ConfigType
} | {
    apiKey?: string,
    licenseKey: string,
    config?: ConfigType
};