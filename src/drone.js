class Drone {
    constructor(id, x = 0, y = 0, z = 0) {
        this.id = id;
        this.position = { x, y, z };
        this.targetPosition = { x, y, z };
        this.status = 'idle'; // idle, flying, landed, error
        this.battery = 100;
        this.tasks = [];
        this.currentTask = null;
        this.isSimulated = false;
    }

    setPosition(x, y, z) {
        this.position = { x, y, z };
    }

    setTargetPosition(x, y, z) {
        this.targetPosition = { x, y, z };
    }

    addTask(task) {
        this.tasks.push(task);
    }

    executeNextTask() {
        if (this.tasks.length > 0 && !this.currentTask) {
            this.currentTask = this.tasks.shift();
            this.status = 'flying';
            return this.currentTask;
        }
        return null;
    }

    completeCurrentTask() {
        this.currentTask = null;
        if (this.tasks.length === 0) {
            this.status = 'idle';
        }
    }

    moveTo(x, y, z) {
        this.setTargetPosition(x, y, z);
        const task = {
            type: 'move',
            target: { x, y, z },
            timestamp: Date.now()
        };
        this.addTask(task);
        return task;
    }

    hover(duration = 5000) {
        const task = {
            type: 'hover',
            duration,
            timestamp: Date.now()
        };
        this.addTask(task);
        return task;
    }

    land() {
        const task = {
            type: 'land',
            target: { x: this.position.x, y: this.position.y, z: 0 },
            timestamp: Date.now()
        };
        this.addTask(task);
        return task;
    }

    takeOff(altitude = 10) {
        const task = {
            type: 'takeoff',
            target: { x: this.position.x, y: this.position.y, z: altitude },
            timestamp: Date.now()
        };
        this.addTask(task);
        return task;
    }

    getStatus() {
        return {
            id: this.id,
            position: this.position,
            targetPosition: this.targetPosition,
            status: this.status,
            battery: this.battery,
            tasksRemaining: this.tasks.length,
            currentTask: this.currentTask
        };
    }

    updateBattery(consumption = 0.1) {
        this.battery = Math.max(0, this.battery - consumption);
        if (this.battery <= 10 && this.status !== 'error') {
            this.status = 'low_battery';
        }
    }
}

module.exports = Drone;