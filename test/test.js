const DroneControlApp = require('../src/main');

async function runTests() {
    console.log('🧪 Running Drone Control System Tests...\n');
    
    let testsPassed = 0;
    let totalTests = 0;
    
    function test(name, testFn) {
        totalTests++;
        console.log(`Testing: ${name}`);
        try {
            testFn();
            console.log(`✅ PASS: ${name}`);
            testsPassed++;
        } catch (error) {
            console.log(`❌ FAIL: ${name} - ${error.message}`);
        }
        console.log('');
    }
    
    // Initialize app in simulation mode without test drones
    const app = new DroneControlApp();
    await app.initialize('simulation', false);
    
    // Test 1: Drone Management
    test('Add drone', () => {
        const drone = app.addDrone('test1', 10, 20, 5);
        if (!drone || drone.id !== 'test1') {
            throw new Error('Failed to add drone');
        }
        if (drone.position.x !== 10 || drone.position.y !== 20 || drone.position.z !== 5) {
            throw new Error('Drone position not set correctly');
        }
    });
    
    test('Get drone', () => {
        const drone = app.getDrone('test1');
        if (!drone || drone.id !== 'test1') {
            throw new Error('Failed to retrieve drone');
        }
    });
    
    test('Add multiple drones', () => {
        app.addDrone('test2', 0, 0, 0);
        app.addDrone('test3', -10, -10, 0);
        const allDrones = app.getAllDrones();
        if (allDrones.length !== 3) {
            throw new Error(`Expected 3 drones, got ${allDrones.length}`);
        }
    });
    
    // Test 2: Task Assignment
    test('Assign move task', () => {
        const result = app.assignTask('test1', { 
            type: 'move', 
            x: 30, 
            y: 40, 
            z: 50 
        });
        if (!result) {
            throw new Error('Failed to assign move task');
        }
        
        const drone = app.getDrone('test1');
        if (drone.tasks.length === 0) {
            throw new Error('Task not added to drone queue');
        }
    });
    
    test('Assign takeoff task', () => {
        const result = app.assignTask('test2', { 
            type: 'takeoff', 
            altitude: 15 
        });
        if (!result) {
            throw new Error('Failed to assign takeoff task');
        }
    });
    
    test('Assign hover task', () => {
        const result = app.assignTask('test3', { 
            type: 'hover', 
            duration: 3000 
        });
        if (!result) {
            throw new Error('Failed to assign hover task');
        }
    });
    
    // Test 3: Formation Control
    test('Get available formations', () => {
        const formations = app.getAvailableFormations();
        const expectedFormations = ['circle', 'line', 'square', 'triangle', 'heart', 'star', 'grid', 'spiral'];
        
        expectedFormations.forEach(formation => {
            if (!formations.includes(formation)) {
                throw new Error(`Missing formation: ${formation}`);
            }
        });
    });
    
    test('Execute circle formation', () => {
        const result = app.executeFormation('circle', { radius: 15 });
        if (!result) {
            throw new Error('Failed to execute circle formation');
        }
        
        // Check that drones have movement tasks
        const drones = app.getAllDrones();
        let hasMoveTasks = false;
        drones.forEach(drone => {
            if (drone.tasks.some(task => task.type === 'move')) {
                hasMoveTasks = true;
            }
        });
        
        if (!hasMoveTasks) {
            throw new Error('Formation did not assign movement tasks');
        }
    });
    
    test('Execute heart formation', () => {
        const result = app.executeFormation('heart', { scale: 10 });
        if (!result) {
            throw new Error('Failed to execute heart formation');
        }
    });
    
    // Test 4: Swarm Control
    test('Start swarm', () => {
        app.startSwarm();
        const status = app.getSwarmStatus();
        if (!status.isRunning) {
            throw new Error('Swarm not running after start command');
        }
    });
    
    test('Get swarm status', () => {
        const status = app.getSwarmStatus();
        if (!status || typeof status.totalDrones !== 'number') {
            throw new Error('Invalid swarm status format');
        }
        if (status.totalDrones !== 3) {
            throw new Error(`Expected 3 drones in status, got ${status.totalDrones}`);
        }
    });
    
    // Test 5: Error Handling
    test('Handle invalid drone ID', () => {
        try {
            app.assignTask('nonexistent', { type: 'move', x: 0, y: 0, z: 0 });
            throw new Error('Should have thrown error for invalid drone ID');
        } catch (error) {
            if (!error.message.includes('not found')) {
                throw new Error('Wrong error message for invalid drone ID');
            }
        }
    });
    
    test('Handle duplicate drone ID', () => {
        try {
            app.addDrone('test1', 0, 0, 0); // test1 already exists
            throw new Error('Should have thrown error for duplicate drone ID');
        } catch (error) {
            if (!error.message.includes('already exists')) {
                throw new Error('Wrong error message for duplicate drone ID');
            }
        }
    });
    
    test('Handle invalid formation', () => {
        try {
            app.executeFormation('invalid_formation');
            throw new Error('Should have thrown error for invalid formation');
        } catch (error) {
            if (!error.message.includes('not found')) {
                throw new Error('Wrong error message for invalid formation');
            }
        }
    });
    
    // Test 6: Drone Removal
    test('Remove drone', () => {
        const result = app.removeDrone('test3');
        if (!result) {
            throw new Error('Failed to remove drone');
        }
        
        const drone = app.getDrone('test3');
        if (drone) {
            throw new Error('Drone still exists after removal');
        }
        
        const allDrones = app.getAllDrones();
        if (allDrones.length !== 2) {
            throw new Error(`Expected 2 drones after removal, got ${allDrones.length}`);
        }
    });
    
    // Clean up
    app.stopSwarm();
    
    // Test Results
    console.log('🏁 Test Results:');
    console.log('================');
    console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
    console.log(`Success Rate: ${((testsPassed/totalTests) * 100).toFixed(1)}%`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 All tests passed! The drone control system is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the implementation.');
        process.exit(1);
    }
}

// Integration test
async function runIntegrationTest() {
    console.log('\n🔄 Running Integration Test...\n');
    
    const app = new DroneControlApp();
    await app.initialize('simulation', false);
    
    // Scenario: Create a swarm, perform formations, assign individual tasks
    console.log('📍 Step 1: Adding 8 drones');
    for (let i = 1; i <= 8; i++) {
        app.addDrone(`integration_${i}`, 0, 0, 0);
    }
    
    console.log('📍 Step 2: Starting swarm');
    app.startSwarm();
    
    console.log('📍 Step 3: All drones take off');
    app.getAllDrones().forEach(drone => {
        app.assignTask(drone.id, { type: 'takeoff', altitude: 15 });
    });
    
    // Wait for takeoff
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('📍 Step 4: Execute circle formation');
    app.executeFormation('circle', { radius: 20 });
    
    // Wait for formation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📍 Step 5: Execute star formation');
    app.executeFormation('star', { outerRadius: 25, points: 4 });
    
    // Wait for formation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📍 Step 6: Individual tasks');
    app.assignTask('integration_1', { type: 'move', x: 50, y: 50, z: 20 });
    app.assignTask('integration_2', { type: 'hover', duration: 3000 });
    
    console.log('📍 Step 7: Final status check');
    const finalStatus = app.getSwarmStatus();
    
    console.log('✅ Integration test completed successfully!');
    console.log(`Final drone count: ${finalStatus.totalDrones}`);
    console.log(`System status: ${finalStatus.isRunning ? 'Running' : 'Stopped'}`);
    
    app.stopSwarm();
}

// Run tests
if (require.main === module) {
    runTests()
        .then(() => runIntegrationTest())
        .catch(console.error);
}

module.exports = { runTests, runIntegrationTest };