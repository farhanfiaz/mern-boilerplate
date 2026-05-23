class Logger {

    private isDev = process.env.NODE_ENV === "development";

    info(...args: any[]) {
        if (this.isDev) {
            console.log("[INFO]:", ...args);
        }
    }

    log(...args: any[]) {
        if (this.isDev) {
            console.log("[LOG]:", ...args);
        }
    }

    warn(...args: any[]) {
        if (this.isDev) {
            console.warn("[WARN]:", ...args);
        }
    }

    error(...args: any[]) {
        console.error("[ERROR]:", ...args);
    }

    success(...args: any[]) {
        if (this.isDev) {
            console.log("%c[SUCCESS]:", "color: green; font-weight: bold;", ...args);
        }
    }

}

const logger = new Logger();

export default logger;