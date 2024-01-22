export class Scheduler {
    private _time: number;
    private _tasks: Array<Function>;
    constructor(time: number) {
        this._time = time;
        this._tasks = [];
    }
    public addTask(task: Function) {
        this._tasks.push(task);
    }
    public start() {
        setInterval(() => {
            this._tasks.forEach(task => {
                task();
            });
        }, this._time);
    }
}