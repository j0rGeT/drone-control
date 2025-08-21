const Drone = require('./drone');
const FormationPatterns = require('./formations');

class SwarmController {
    constructor() {
        this.drones = new Map();
        this.formations = new FormationPatterns();
        this.isRunning = false;
        this.updateInterval = null;
    }

    addDrone(id, x = 0, y = 0, z = 0) {
        if (this.drones.has(id)) {
            throw new Error(`Drone with ID ${id} already exists`);
        }
        
        const drone = new Drone(id, x, y, z);
        this.drones.set(id, drone);
        console.log(`✓ Drone ${id} added at position (${x}, ${y}, ${z})`);
        return drone;
    }

    removeDrone(id) {
        if (!this.drones.has(id)) {
            throw new Error(`Drone with ID ${id} not found`);
        }
        
        this.drones.delete(id);
        console.log(`✓ Drone ${id} removed`);
        return true;
    }

    getDrone(id) {
        return this.drones.get(id);
    }

    getAllDrones() {
        return Array.from(this.drones.values());
    }

    assignTask(droneId, task) {
        const drone = this.getDrone(droneId);
        if (!drone) {
            throw new Error(`Drone ${droneId} not found`);
        }

        switch (task.type) {
            case 'move':
                drone.moveTo(task.x, task.y, task.z);
                break;
            case 'hover':
                drone.hover(task.duration);
                break;
            case 'takeoff':
                drone.takeOff(task.altitude);
                break;
            case 'land':
                drone.land();
                break;
            default:
                throw new Error(`Unknown task type: ${task.type}`);
        }

        console.log(`✓ Task assigned to drone ${droneId}:`, task);
        return true;
    }

    executeFormation(patternName, options = {}) {
        const pattern = this.formations.getPattern(patternName);
        if (!pattern) {
            throw new Error(`Formation pattern '${patternName}' not found`);
        }

        const drones = this.getAllDrones();
        if (drones.length === 0) {
            throw new Error('No drones available for formation');
        }

        const positions = pattern.generatePositions(drones.length, options);
        
        drones.forEach((drone, index) => {
            if (index < positions.length) {
                const pos = positions[index];
                drone.moveTo(pos.x, pos.y, pos.z);
            }
        });

        console.log(`✓ Formation '${patternName}' executed with ${positions.length} drones`);
        return true;
    }

    startSwarm() {
        if (this.isRunning) {
            console.log('Swarm is already running');
            return;
        }

        this.isRunning = true;
        console.log('🚁 Starting drone swarm...');

        this.updateInterval = setInterval(() => {
            this.updateDrones();
        }, 100); // Update every 100ms
    }

    stopSwarm() {
        if (!this.isRunning) {
            console.log('Swarm is not running');
            return;
        }

        this.isRunning = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        console.log('🛑 Drone swarm stopped');
    }

    updateDrones() {
        this.drones.forEach(drone => {
            if (drone.status === 'flying' || drone.currentTask) {
                this.updateDronePosition(drone);
                drone.updateBattery();
            }
            
            if (!drone.currentTask) {
                drone.executeNextTask();
            }
        });
    }

    updateDronePosition(drone) {
        const current = drone.position;
        const target = drone.targetPosition;
        const speed = 1.0; // units per second
        
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const dz = target.z - current.z;
        
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (distance < 0.5) {
            drone.setPosition(target.x, target.y, target.z);
            drone.completeCurrentTask();
        } else {
            const ratio = (speed * 0.1) / distance; // 0.1 is the update interval
            drone.setPosition(
                current.x + dx * ratio,
                current.y + dy * ratio,
                current.z + dz * ratio
            );
        }
    }

    getSwarmStatus() {
        const status = {
            totalDrones: this.drones.size,
            isRunning: this.isRunning,
            drones: {}
        };

        this.drones.forEach((drone, id) => {
            status.drones[id] = drone.getStatus();
        });

        return status;
    }

    emergencyLandAll() {
        console.log('🚨 EMERGENCY LANDING ALL DRONES');
        this.drones.forEach(drone => {
            drone.tasks = []; // Clear all tasks
            drone.land();
        });
    }
}

module.exports = SwarmController;