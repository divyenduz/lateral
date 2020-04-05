import Task from "./Task.ts";

export default class Job {
  private _tasks: Task[];

  private _logs: {
    [key: string]: string;
  } = {};

  constructor(tasks: Task[], delay = 0) {
    this._tasks = tasks;
  }

  async logs() {
    return this._logs;
  }

  async getLog(id: string) {
    return this._logs[id];
  }

  async execute() {
    return Promise.allSettled(this._tasks.map(task => {
      return task.execute().then(async (_) => {
        const timestamp = new Date().toISOString();
        const taskId = task.id();
        const taskLog = await task.log();
        this._logs[taskId] = `${timestamp}: ${taskLog}`;
      });
    }));
  }
}
