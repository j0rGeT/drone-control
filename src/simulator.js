const SwarmController = require('./swarmController');

class DroneSimulator {
    constructor() {
        this.swarm = new SwarmController();
        this.visualMode = true;
        this.logInterval = null;
    }

    async initialize(addTestDrones = true) {
        console.log('🎮 Initializing Drone Simulator...');
        console.log('=====================================');
        
        if (addTestDrones) {
            // Add some test drones
            for (let i = 1; i <= 8; i++) {
                this.swarm.addDrone(`drone_${i}`, 
                    Math.random() * 20 - 10, 
                    Math.random() * 20 - 10, 
                    0
                );
            }
            
            console.log(`✓ Added ${this.swarm.drones.size} simulated drones`);
        }
        
        // Mark all drones as simulated
        this.swarm.getAllDrones().forEach(drone => {
            drone.isSimulated = true;
        });
    }

    startVisualMode() {
        if (this.logInterval) {
            clearInterval(this.logInterval);
        }
        
        this.logInterval = setInterval(() => {
            this.displaySwarmStatus();
        }, 1000);
        
        console.log('📺 Visual mode started - Swarm status updates every second');
    }

    stopVisualMode() {
        if (this.logInterval) {
            clearInterval(this.logInterval);
            this.logInterval = null;
        }
        console.log('📺 Visual mode stopped');
    }

    displaySwarmStatus() {
        console.clear();
        console.log('🚁 DRONE SWARM SIMULATOR');
        console.log('========================');
        
        const status = this.swarm.getSwarmStatus();
        console.log(`Status: ${status.isRunning ? '🟢 RUNNING' : '🔴 STOPPED'}`);
        console.log(`Total Drones: ${status.totalDrones}`);
        console.log('');
        
        // Display grid view
        this.displayGrid(status.drones);
        
        console.log('\nDrone Details:');
        console.log('ID        | Position      | Status    | Battery | Tasks');
        console.log('----------|---------------|-----------|---------|-------');
        
        Object.values(status.drones).forEach(drone => {
            const pos = `(${drone.position.x.toFixed(1)},${drone.position.y.toFixed(1)},${drone.position.z.toFixed(1)})`;
            const battery = `${drone.battery.toFixed(1)}%`;
            console.log(`${drone.id.padEnd(9)} | ${pos.padEnd(13)} | ${drone.status.padEnd(9)} | ${battery.padEnd(7)} | ${drone.tasksRemaining}`);
        });
        
        console.log('\n📋 Commands: formation <pattern> | task <droneId> <type> | start | stop | quit');
    }

    displayGrid(drones) {
        const gridSize = 20;
        const grid = Array(gridSize).fill().map(() => Array(gridSize).fill('·'));
        
        Object.values(drones).forEach(drone => {
            const x = Math.floor((drone.position.x + 25) / 50 * gridSize);
            const y = Math.floor((drone.position.y + 25) / 50 * gridSize);
            
            if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                const symbol = drone.status === 'flying' ? '🚁' : 
                            drone.status === 'idle' ? '🛸' : 
                            drone.status === 'low_battery' ? '🔋' : '❌';
                grid[y][x] = symbol;
            }
        });
        
        console.log('Grid View (🚁=flying, 🛸=idle, 🔋=low battery):');
        grid.forEach(row => console.log(row.join(' ')));
    }

    async runInteractiveMode() {
        await this.initialize();
        this.startVisualMode();
        this.swarm.startSwarm();
        
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        console.log('\n🎮 Interactive mode started. Type "help" for commands.');
        
        const processCommand = (input) => {
            const parts = input.trim().split(' ');
            const command = parts[0].toLowerCase();
            
            try {
                switch (command) {
                    case 'formation':
                        if (parts[1]) {
                            this.swarm.executeFormation(parts[1]);
                            console.log(`✓ Formation '${parts[1]}' executed`);
                        } else {
                            console.log('Available formations:', this.swarm.formations.getAvailablePatterns().join(', '));
                        }
                        break;
                        
                    case 'task':
                        if (parts.length >= 3) {
                            const droneId = parts[1];
                            const taskType = parts[2];
                            let task = { type: taskType };
                            
                            if (taskType === 'move' && parts.length >= 6) {
                                task.x = parseFloat(parts[3]);
                                task.y = parseFloat(parts[4]);
                                task.z = parseFloat(parts[5]);
                            } else if (taskType === 'takeoff' && parts[3]) {
                                task.altitude = parseFloat(parts[3]);
                            } else if (taskType === 'hover' && parts[3]) {
                                task.duration = parseFloat(parts[3]) * 1000;
                            }
                            
                            this.swarm.assignTask(droneId, task);
                        } else {
                            console.log('Usage: task <droneId> <type> [params]');
                            console.log('Types: move x y z | takeoff [altitude] | land | hover [seconds]');
                        }
                        break;
                        
                    case 'start':
                        this.swarm.startSwarm();
                        break;
                        
                    case 'stop':
                        this.swarm.stopSwarm();
                        break;
                        
                    case 'emergency':
                        this.swarm.emergencyLandAll();
                        break;
                        
                    case 'add':
                        if (parts[1]) {
                            this.swarm.addDrone(parts[1], 
                                Math.random() * 20 - 10, 
                                Math.random() * 20 - 10, 
                                0
                            );
                        }
                        break;
                        
                    case 'remove':
                        if (parts[1]) {
                            this.swarm.removeDrone(parts[1]);
                        }
                        break;
                        
                    case 'help':
                        console.log('\n📋 Available Commands:');
                        console.log('formation <pattern>     - Execute formation (circle, line, square, triangle, heart, star, grid, spiral)');
                        console.log('task <id> move x y z    - Move drone to position');
                        console.log('task <id> takeoff [alt] - Takeoff to altitude');
                        console.log('task <id> land          - Land drone');
                        console.log('task <id> hover [sec]   - Hover for seconds');
                        console.log('add <id>                - Add new drone');
                        console.log('remove <id>             - Remove drone');
                        console.log('start                   - Start swarm');
                        console.log('stop                    - Stop swarm');
                        console.log('emergency               - Emergency land all');
                        console.log('quit                    - Exit simulator\n');
                        break;
                        
                    case 'quit':
                    case 'exit':
                        this.shutdown();
                        rl.close();
                        return;
                        
                    default:
                        if (input.trim()) {
                            console.log(`Unknown command: ${command}. Type "help" for available commands.`);
                        }
                }
            } catch (error) {
                console.log(`❌ Error: ${error.message}`);
            }
            
            rl.prompt();
        };
        
        rl.on('line', processCommand);
        rl.on('close', () => {
            this.shutdown();
            process.exit(0);
        });
        
        rl.prompt();
    }

    async runDemo() {
        console.log('🎭 Running automated demo...');
        await this.initialize();
        this.swarm.startSwarm();
        
        // Demo sequence
        const demos = [
            () => {
                console.log('\n🎯 Demo 1: Circle formation');
                this.swarm.executeFormation('circle', { radius: 15 });
            },
            () => {
                console.log('\n🎯 Demo 2: Star formation');
                this.swarm.executeFormation('star', { outerRadius: 20, points: 5 });
            },
            () => {
                console.log('\n🎯 Demo 3: Heart formation');
                this.swarm.executeFormation('heart', { scale: 8 });
            },
            () => {
                console.log('\n🎯 Demo 4: Individual tasks');
                this.swarm.assignTask('drone_1', { type: 'move', x: 30, y: 30, z: 20 });
                this.swarm.assignTask('drone_2', { type: 'hover', duration: 3000 });
            }
        ];
        
        for (let i = 0; i < demos.length; i++) {
            demos[i]();
            await this.sleep(5000); // Wait 5 seconds between demos
        }
        
        console.log('\n✅ Demo completed!');
        this.shutdown();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    shutdown() {
        this.stopVisualMode();
        this.swarm.stopSwarm();
        console.log('🛑 Simulator shutdown complete');
    }
}

// Command line interface
if (require.main === module) {
    const simulator = new DroneSimulator();
    const mode = process.argv[2] || 'interactive';
    
    if (mode === 'demo') {
        simulator.runDemo();
    } else {
        simulator.runInteractiveMode();
    }
}

module.exports = DroneSimulator;