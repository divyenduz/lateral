interface TaskArgs {
  id: string;
  command: string;
  delay?: number;
  timeout?: number;
}

export default class Task {
  private _command: string;
  private _task: Deno.Process;
  private _id: string;
  private _delay: number = 0;
  private _timeout: number = 0;

  private _timedOut: boolean = false;

  constructor({ id, command, delay = 0, timeout = 0 }: TaskArgs) {
    this._command = command;
    this._task = Deno.run({
      // TODO: Make this run arbitrary shell code (e.g. `echo "  Piped Data  " | xargs`). Currently, it can only run shell executables
      args: this._command.split(" "),
      stdin: "piped",
      stdout: "piped",
      stderr: "piped"
    });
    this._id = id;
    this._delay = delay;
    this._timeout = timeout;
  }

  id() {
    return this._id;
  }

  didTimeout() {
    return this._timedOut;
  }

  async status() {
    const taskStatus = await this._task.status();
    return taskStatus;
  }

  async execute() {
    if (Boolean(this._delay)) {
      await this._sleep(this._delay);
    }
    const executables = [this.status()];
    if (Boolean(this._timeout)) {
      executables.push(this._timeoutFn(this._timeout));
    }
    const taskStatus = await Promise.race(executables);
    const { code } = taskStatus;
    if (code === -1) {
      this._timedOut = true;
    }
    return code;
  }

  async log() {
    const output = await this._task.output();
    return new TextDecoder().decode(output);
  }

  // Timeout in seconds
  private async _sleep(timeout: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout * 1000);
    });
  }

  // Timeout in seconds
  private async _timeoutFn(timeout: number) {
    return new Promise<Deno.ProcessStatus>((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          code: -1
        });
      }, timeout * 1000);
    });
  }
}
