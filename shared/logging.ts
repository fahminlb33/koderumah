export function getLogger(serviceName: string, functioName: string) {
    return new Logger(serviceName, functioName);
}

export class Logger {
    _service: string;
    _func: string;

    constructor(service: string, func: string) {
        this._service = service
        this._func = func
    }

    private now() {
        return new Date().toLocaleString()
    }

    info(message?: any) {
        console.log(`${this.now()}: [${this._service}][${this._func}] ${message}`)
    }

    error(message?: any) {
        console.log(`${this.now()}: [${this._service}][${this._func}] ${message}`)
    }
}