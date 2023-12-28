export type ConfigType = {
    endpoint?: "US"|"EU",
    headers?: Record<string, string | undefined>
};

export type LoggerType = {
    licenseKey: string,
    app: string,
    config?: ConfigType
};