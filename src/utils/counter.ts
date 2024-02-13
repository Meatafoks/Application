export class Counter {
    public startTime?: number;
    public endTime?: number;

    public constructor() {}

    public start() {
        this.startTime = new Date().getTime();
        return this;
    }

    public stop() {
        this.endTime = new Date().getTime();
        return this;
    }

    public getDelta() {
        if (!this.startTime || !this.endTime) throw new Error('timer has not started or stopped before');
        return this.endTime - this.startTime;
    }

    public getDeltaSeconds() {
        return this.getDelta() / 1000;
    }

    public getDeltaString() {
        return Math.round(this.getDeltaSeconds() * 1000) / 1000 + 's';
    }
}
