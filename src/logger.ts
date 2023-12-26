import ky, { KyInstance } from "ky";

import type { ConfigType, LoggerType } from "./types";

export class logger {

    private defaultConfig: {
        [P in keyof ConfigType]-?: ConfigType[P]; // Remove Optional Property
    } = {
        endpoint: "EU",
        headers: {
            "Content-Type": "application/json",
        }
    };

    private kyInstance: KyInstance;

    constructor(v: LoggerType) {
        if (!v.apiKey && !v.licenseKey)
            throw new Error("Either appKey or licenseKey is required.");

        const config = { ...this.defaultConfig, ...v.config };

        const endpoints: { [key in typeof this.defaultConfig["endpoint"]]: string } = {
            "EU": "https://log-api.eu.newrelic.com/log/v1",
            "US": "https://log-api.newrelic.com/log/v1",
        };

        const token = v.licenseKey ? { "License-Key": v.licenseKey } : { "Api-Key" : v.apiKey };

        this.kyInstance = ky.create({
            prefixUrl: endpoints[config.endpoint],
            headers: {
                ...token,
                ...config.headers
            }
        })
    }

    log(...messages: never[]) {

        (async () => {

            for(const message of messages) {
                await this.kyInstance("", {
                    json: {
                        level: "log",
                        message: JSON.stringify(message)
                    }
                })
            }
        })();
    }

    warn(...messages: never[]) {

        (async () => {

            for(const message of messages) {
                await this.kyInstance("", {
                    json: {
                        level: "warn",
                        message: JSON.stringify(message)
                    }
                })
            }
        })();
    }

    error(...messages: never[]) {

        (async () => {

            for(const message of messages) {
                await this.kyInstance("", {
                    json: {
                        level: "error",
                        message: JSON.stringify(message)
                    }
                })
            }
        })();
    }
}