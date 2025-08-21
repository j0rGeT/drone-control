# 🚁 无人机群控系统 (Drone Swarm Control System)

一个功能完整的无人机群控系统，支持无人机管理、任务分配、编队飞行和模拟器测试。

## ✨ 主要功能

### 1. 无人机管理
- ✅ 添加/删除无人机
- ✅ 查看无人机状态
- ✅ 电池监控
- ✅ 实时位置跟踪

### 2. 任务分配
- ✅ 单独为每个无人机设置任务
- ✅ 支持移动、悬停、起飞、降落任务
- ✅ 任务队列管理
- ✅ 任务状态监控

### 3. 编队飞行
- ✅ 8种内置编队图案：
  - 🔵 圆形 (Circle)
  - 📏 直线 (Line) 
  - ⬜ 方形 (Square)
  - 🔺 三角形 (Triangle)
  - ❤️ 心形 (Heart)
  - ⭐ 星形 (Star)
  - 📋 网格 (Grid)
  - 🌀 螺旋 (Spiral)

### 4. 模拟器支持
- ✅ 完整的虚拟环境
- ✅ 实时可视化界面
- ✅ 交互式命令行
- ✅ 自动演示模式

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 运行方式

#### 1. 交互式模拟器
```bash
npm run simulator
# 或
npm start --simulator
```

#### 2. 圆形编队演示
```bash
npm start --demo-circle
```

#### 3. 心形编队演示
```bash
npm start --demo-heart
```

#### 4. 自动演示
```bash
node src/simulator.js demo
```

#### 5. 运行测试
```bash
npm test
```

## 📖 使用指南

### 编程接口

```javascript
const DroneControlApp = require('./src/main');

async function example() {
    // 初始化系统（模拟模式）
    const app = new DroneControlApp();
    await app.initialize('simulation');
    
    // 添加无人机
    app.addDrone('drone1', 0, 0, 0);
    app.addDrone('drone2', 10, 0, 0);
    app.addDrone('drone3', 0, 10, 0);
    
    // 启动群控系统
    app.startSwarm();
    
    // 单独任务分配
    app.assignTask('drone1', { 
        type: 'takeoff', 
        altitude: 15 
    });
    
    app.assignTask('drone2', { 
        type: 'move', 
        x: 30, y: 30, z: 20 
    });
    
    app.assignTask('drone3', { 
        type: 'hover', 
        duration: 5000 
    });
    
    // 执行编队
    setTimeout(() => {
        app.executeFormation('circle', { 
            radius: 20, 
            altitude: 15 
        });
    }, 3000);
    
    // 查看状态
    setTimeout(() => {
        app.displayStatus();
    }, 6000);
}

example();
```

### 模拟器命令

在交互式模拟器中，可以使用以下命令：

```bash
# 编队命令
formation circle          # 圆形编队
formation heart           # 心形编队
formation star             # 星形编队
formation square           # 方形编队

# 任务命令
task drone1 takeoff 15     # 起飞到15米
task drone1 move 10 20 15  # 移动到指定位置
task drone1 hover 5        # 悬停5秒
task drone1 land           # 降落

# 管理命令
add newdrone              # 添加新无人机
remove drone1             # 删除无人机
start                     # 启动群控
stop                      # 停止群控
emergency                 # 紧急降落所有无人机

# 其他命令
help                      # 显示帮助
quit                      # 退出模拟器
```

## 🏗️ 系统架构

```
src/
├── main.js           # 主应用入口
├── swarmController.js # 群控核心逻辑
├── drone.js          # 无人机类定义
├── formations.js     # 编队图案算法
└── simulator.js      # 模拟器实现

test/
└── test.js           # 单元测试和集成测试
```

### 核心类说明

#### `Drone` 类
- 管理单个无人机的状态、位置、任务
- 支持移动、悬停、起飞、降落操作
- 电池监控和状态跟踪

#### `SwarmController` 类  
- 群控系统核心
- 无人机管理（添加/删除）
- 任务分配和执行
- 编队控制

#### `FormationPatterns` 类
- 8种编队图案的算法实现
- 可配置参数（大小、位置、高度等）
- 支持不同数量的无人机

#### `DroneSimulator` 类
- 完整的模拟环境
- 可视化界面
- 交互式控制
- 演示模式

## 🎮 模拟器界面

模拟器提供实时的可视化界面：

```
🚁 DRONE SWARM SIMULATOR
========================
Status: 🟢 RUNNING
Total Drones: 8

Grid View (🚁=flying, 🛸=idle, 🔋=low battery):
· · · · · · · · · · · · · · · · · · · ·
· · · · · · · · · · · · · · · · · · · ·
· · · · · · 🚁 · · · · · · 🛸 · · · · ·
· · · · · · · · · · · · · · · · · · · ·
· · · 🚁 · · · · · · · · · · · · 🚁 · ·
· · · · · · · · · · 🛸 · · · · · · · ·
· · · · · · · · · · · · · · · · · · · ·
· · · · · · · · · · · · · · · · · · · ·

Drone Details:
ID        | Position      | Status    | Battery | Tasks
----------|---------------|-----------|---------|-------
drone_1   | (15.0,0.0,15) | flying    | 98.5%   | 2
drone_2   | (10.6,10.6,15)| idle      | 99.2%   | 0
...
```

## 🧪 测试

系统包含全面的测试套件：

- **单元测试**: 测试各个组件功能
- **集成测试**: 测试完整工作流程
- **错误处理测试**: 测试异常情况处理

```bash
npm test
```

测试覆盖：
- ✅ 无人机管理
- ✅ 任务分配
- ✅ 编队控制
- ✅ 错误处理
- ✅ 集成场景

## 🔧 配置选项

### 编队参数示例

```javascript
// 圆形编队
app.executeFormation('circle', {
    radius: 20,        // 半径
    centerX: 0,        // 中心X坐标
    centerY: 0,        // 中心Y坐标
    altitude: 15       // 飞行高度
});

// 星形编队
app.executeFormation('star', {
    outerRadius: 25,   // 外半径
    innerRadius: 12,   // 内半径
    points: 5,         // 星角数量
    altitude: 15
});

// 心形编队
app.executeFormation('heart', {
    scale: 10,         // 缩放比例
    altitude: 15
});
```

## 🚀 扩展开发

### 添加新的编队图案

在 `src/formations.js` 中添加新的生成函数：

```javascript
generateCustomPattern(droneCount, options = {}) {
    const positions = [];
    // 你的算法逻辑
    for (let i = 0; i < droneCount; i++) {
        positions.push({
            x: // 计算X坐标,
            y: // 计算Y坐标,
            z: options.altitude || 15
        });
    }
    return positions;
}
```

然后在构造函数中注册：

```javascript
this.patterns = {
    // 现有图案...
    custom: this.generateCustomPattern.bind(this)
};
```

### 添加新的任务类型

在 `src/drone.js` 中扩展任务处理：

```javascript
// 在 Drone 类中添加新方法
newTaskType(params) {
    const task = {
        type: 'newTaskType',
        params: params,
        timestamp: Date.now()
    };
    this.addTask(task);
    return task;
}
```

在 `src/swarmController.js` 中添加任务分配逻辑：

```javascript
case 'newTaskType':
    drone.newTaskType(task.params);
    break;
```

## 📋 TODO 和未来改进

- [ ] WebSocket 接口支持
- [ ] 3D 可视化界面
- [ ] GPS 坐标系统
- [ ] 碰撞检测和避障
- [ ] 实际硬件接口
- [ ] 配置文件支持
- [ ] 日志记录系统
- [ ] 性能监控

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

🚁 **享受你的无人机群控系统！** 🚁# drone-control
