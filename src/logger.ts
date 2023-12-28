import ky from "ky";

import type { ConfigType, LoggerType } from "./types";

export class logger {

    private readonly defaultConfig: {
        [P in keyof ConfigType]-?: ConfigType[P]; // Remove Optional Property
    } = {
        endpoint: "US",
        headers: {
            "Content-Type": "application/json",
        }
    };

    private readonly url: string;
    private readonly app: string;
    private readonly headers: Record<string, string | undefined>;

    constructor(v: LoggerType) {

        const config = { ...this.defaultConfig, ...v.config };
        this.headers = config.headers;

        const endpoints: { [key in typeof this.defaultConfig["endpoint"]]: string } = {
            "EU": "https://log-api.eu.newrelic.com/log/v1",
            "US": "https://log-api.newrelic.com/log/v1",
        };

        const url = new URL(endpoints[config.endpoint]);
        url.searchParams.set("Api-Key", v.licenseKey);
        this.url = url.toString();

        this.app = v.app;
    }

    private async fetchApi(level: "log"|"warn"|"error", message: any)
    {

        return ky.post(this.url, {
            headers: this.headers,
            json: {
                level,
                app: this.app,
                message: JSON.stringify(message)
            }
        });
    }

    log(...messages: any[]) {

        (async () => {

            for(const message of messages) {
                await this.fetchApi("log", message);
            }
        })();
    }

    warn(...messages: any[]) {

        (async () => {

            for(const message of messages) {
                await this.fetchApi("warn", message);
            }
        })();
    }

    error(...messages: any[]) {

        (async () => {

            for(const message of messages) {
                await this.fetchApi("error", message);
            }
        })();
    }
}