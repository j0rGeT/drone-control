const SwarmController = require('./swarmController');
const DroneSimulator = require('./simulator');

class DroneControlApp {
    constructor() {
        this.swarm = new SwarmController();
        this.simulator = null;
        this.mode = 'production'; // 'production' or 'simulation'
    }

    async initialize(mode = 'production', addTestDrones = true) {
        this.mode = mode;
        console.log(`🚁 Initializing Drone Control System (${mode} mode)...`);
        
        if (mode === 'simulation') {
            this.simulator = new DroneSimulator();
            await this.simulator.initialize(addTestDrones);
            this.swarm = this.simulator.swarm;
        }
        
        console.log('✅ System initialized successfully');
        return this;
    }

    // Drone Management API
    addDrone(id, x = 0, y = 0, z = 0) {
        return this.swarm.addDrone(id, x, y, z);
    }

    removeDrone(id) {
        return this.swarm.removeDrone(id);
    }

    getDrone(id) {
        return this.swarm.getDrone(id);
    }

    getAllDrones() {
        return this.swarm.getAllDrones();
    }

    // Task Management API
    assignTask(droneId, task) {
        return this.swarm.assignTask(droneId, task);
    }

    // Formation Control API
    executeFormation(patternName, options = {}) {
        return this.swarm.executeFormation(patternName, options);
    }

    getAvailableFormations() {
        return this.swarm.formations.getAvailablePatterns();
    }

    // Swarm Control API
    startSwarm() {
        this.swarm.startSwarm();
        if (this.simulator && this.simulator.visualMode) {
            this.simulator.startVisualMode();
        }
    }

    stopSwarm() {
        this.swarm.stopSwarm();
        if (this.simulator) {
            this.simulator.stopVisualMode();
        }
    }

    getSwarmStatus() {
        return this.swarm.getSwarmStatus();
    }

    emergencyLandAll() {
        return this.swarm.emergencyLandAll();
    }

    // Utility methods
    displayStatus() {
        const status = this.getSwarmStatus();
        
        console.log('\n🚁 DRONE SWARM STATUS');
        console.log('=====================');
        console.log(`Mode: ${this.mode}`);
        console.log(`Status: ${status.isRunning ? '🟢 RUNNING' : '🔴 STOPPED'}`);
        console.log(`Total Drones: ${status.totalDrones}`);
        console.log('');
        
        if (status.totalDrones > 0) {
            console.log('Drone Details:');
            console.log('ID        | Position      | Status    | Battery | Tasks');
            console.log('----------|---------------|-----------|---------|-------');
            
            Object.values(status.drones).forEach(drone => {
                const pos = `(${drone.position.x.toFixed(1)},${drone.position.y.toFixed(1)},${drone.position.z.toFixed(1)})`;
                const battery = `${drone.battery.toFixed(1)}%`;
                console.log(`${drone.id.padEnd(9)} | ${pos.padEnd(13)} | ${drone.status.padEnd(9)} | ${battery.padEnd(7)} | ${drone.tasksRemaining}`);
            });
        }
        
        return status;
    }

    // Quick demo functions
    async runCircleDemo() {
        console.log('🎯 Running Circle Formation Demo...');
        
        // Add 6 drones if none exist
        if (this.getAllDrones().length === 0) {
            for (let i = 1; i <= 6; i++) {
                this.addDrone(`demo_${i}`, 0, 0, 0);
            }
        }
        
        // Take off all drones
        this.getAllDrones().forEach(drone => {
            this.assignTask(drone.id, { type: 'takeoff', altitude: 15 });
        });
        
        // Wait and execute circle formation
        setTimeout(() => {
            this.executeFormation('circle', { radius: 20 });
        }, 2000);
        
        this.startSwarm();
        return this;
    }

    async runHeartDemo() {
        console.log('💖 Running Heart Formation Demo...');
        
        // Add 12 drones for better heart shape
        if (this.getAllDrones().length === 0) {
            for (let i = 1; i <= 12; i++) {
                this.addDrone(`heart_${i}`, 0, 0, 0);
            }
        }
        
        // Take off all drones
        this.getAllDrones().forEach(drone => {
            this.assignTask(drone.id, { type: 'takeoff', altitude: 15 });
        });
        
        // Wait and execute heart formation
        setTimeout(() => {
            this.executeFormation('heart', { scale: 10 });
        }, 2000);
        
        this.startSwarm();
        return this;
    }
}

// CLI interface
async function runCLI() {
    const app = new DroneControlApp();
    const args = process.argv.slice(2);
    const mode = args.includes('--simulator') ? 'simulation' : 'production';
    
    await app.initialize(mode);
    
    if (args.includes('demo-circle')) {
        await app.runCircleDemo();
        setTimeout(() => {
            app.displayStatus();
        }, 3000);
    } else if (args.includes('demo-heart')) {
        await app.runHeartDemo();
        setTimeout(() => {
            app.displayStatus();
        }, 3000);
    } else if (mode === 'simulation') {
        // Run interactive simulator
        const simulator = app.simulator;
        await simulator.runInteractiveMode();
    } else {
        console.log('🎮 Drone Control System Ready!');
        console.log('');
        console.log('📋 Available commands:');
        console.log('  npm start --simulator          - Run with simulator');
        console.log('  npm start --demo-circle        - Circle formation demo');
        console.log('  npm start --demo-heart         - Heart formation demo');
        console.log('  npm run simulator              - Interactive simulator');
        console.log('');
        console.log('💡 Use the DroneControlApp class in your code:');
        console.log('   const app = require("./src/main");');
        console.log('   await app.initialize("simulation");');
        console.log('   app.addDrone("test1", 0, 0, 0);');
        console.log('   app.executeFormation("circle");');
    }
}

// Export for programmatic use
module.exports = DroneControlApp;

// Run CLI if called directly
if (require.main === module) {
    runCLI().catch(console.error);
}