class SimpleQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.queue = [];
    this.runningCount = 0;
  }

  add(task) {
    return new Promise((resolve) => {
      const executeTask = async () => {
        try {
          this.runningCount++;
          await task();
        } finally {
          this.runningCount--;

          if (this.queue.length > 0) {
            this.queue.shift()(); // Execute the next task in the queue
            console.log("Here")
          } else if (this.runningCount === 0) {
            resolve();
          }
        }
      };

      if (this.runningCount < this.concurrency) {
        executeTask();
      } else {
        this.queue.push(executeTask);
      }
    });
  }

  onIdle() {
    return new Promise((resolve) => {
      if (this.runningCount === 0) {
        resolve();
      } else {
        const checkIdle = () => {
          if (this.runningCount === 0) {
            resolve();
          } else {
            setImmediate(checkIdle);
          }
        };

        setImmediate(checkIdle);
      }
    });
  }
}

module.exports = SimpleQueue;
