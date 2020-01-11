import { NodePart } from 'lit-html';

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}

export const workLoop = {
  isWorking: false,
  queue: [] as (() => NodePart)[],
  result: [] as NodePart[],

  pushWork(work: () => NodePart) {
    this.queue = this.queue.concat(work);
    if (this.isWorking) { return; }
    this.isWorking = true;
    Promise.resolve().then(() => { this._processWork(); });
  },

  _processWork() {
    window.requestIdleCallback((deadline) => {

      while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.queue.length > 0) {
        const work = this.queue[0];
        const part = work();
        this.result = this.result.concat(part);
        this.queue = this.queue.slice(1);
      }

      if (this.queue.length > 0) {
        this._processWork();
      } else if (this.result.length > 0) {
        this._commitWork();
      }

    });
  },

  _commitWork() {
    requestAnimationFrame(() => {
      this.isWorking = false;
      this.result.forEach(part => part.commit());
      this.result = [];
    });
  }
}