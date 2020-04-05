import Task from "./Task.ts";

interface JobArgs {
  tasks: Task[];
}

export default class Job {
  private _tasks: Task[];

  private _logs: {
    [key: string]: string;
  } = {};

  constructor({ tasks }: JobArgs) {
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
        const taskDidTimeout = task.didTimeout();
        const timeoutMessage = taskDidTimeout
          ? ` (timed out)`
          : ``;
        this._logs[taskId] = `${timestamp}:${timeoutMessage} ${taskLog}`;
      });
    }));
  }
}
