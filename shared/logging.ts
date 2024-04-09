export class Logger {
    _service: string;
    _func: string;

    constructor(service: string) {
        this._service = service
        this._func = "root"
    }

    scoped(func: string) {
        const l = new Logger(this._service)
        l._func = func
        
        return l
    }

    private now() {
        return new Date().toLocaleString()
    }

    debug(message?: any, ...args: any[]) {
        this.log("DEBUG", message, ...args)
    }

    info(message?: any, ...args: any[]) {
        this.log("INFO", message, ...args)
    }

    warn(message?: any, ...args: any[]) {
        this.log("WARN", message, ...args)
    }

    error(message?: any, ...args: any[]) {
        this.log("ERROR", message, ...args)
    }

    private log(level: string, message?: any, ...args: any[]) {
        if (args.length > 0) {
            console.log(`${this.now()}: ${level} [${this._service}][${this._func}] ${message} ${JSON.stringify(args)}`)
        } else {
            console.log(`${this.now()}: ${level} [${this._service}][${this._func}] ${message}`)
        }
    }
}