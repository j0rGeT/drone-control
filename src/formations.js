class FormationPatterns {
    constructor() {
        this.patterns = {
            circle: this.generateCircle.bind(this),
            line: this.generateLine.bind(this),
            square: this.generateSquare.bind(this),
            triangle: this.generateTriangle.bind(this),
            heart: this.generateHeart.bind(this),
            star: this.generateStar.bind(this),
            grid: this.generateGrid.bind(this),
            spiral: this.generateSpiral.bind(this)
        };
    }

    getPattern(name) {
        const pattern = this.patterns[name];
        if (!pattern) {
            return null;
        }
        return {
            generatePositions: pattern
        };
    }

    getAvailablePatterns() {
        return Object.keys(this.patterns);
    }

    generateCircle(droneCount, options = {}) {
        const radius = options.radius || 20;
        const centerX = options.centerX || 0;
        const centerY = options.centerY || 0;
        const altitude = options.altitude || 15;
        
        const positions = [];
        const angleStep = (2 * Math.PI) / droneCount;
        
        for (let i = 0; i < droneCount; i++) {
            const angle = i * angleStep;
            positions.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                z: altitude
            });
        }
        
        return positions;
    }

    generateLine(droneCount, options = {}) {
        const spacing = options.spacing || 5;
        const startX = options.startX || -(droneCount * spacing) / 2;
        const y = options.y || 0;
        const altitude = options.altitude || 15;
        
        const positions = [];
        
        for (let i = 0; i < droneCount; i++) {
            positions.push({
                x: startX + i * spacing,
                y: y,
                z: altitude
            });
        }
        
        return positions;
    }

    generateSquare(droneCount, options = {}) {
        const size = options.size || 20;
        const centerX = options.centerX || 0;
        const centerY = options.centerY || 0;
        const altitude = options.altitude || 15;
        
        const positions = [];
        const perimeter = 4 * size;
        const spacing = perimeter / droneCount;
        
        for (let i = 0; i < droneCount; i++) {
            const distance = i * spacing;
            let x, y;
            
            if (distance < size) {
                // Top side
                x = centerX - size/2 + distance;
                y = centerY + size/2;
            } else if (distance < 2 * size) {
                // Right side
                x = centerX + size/2;
                y = centerY + size/2 - (distance - size);
            } else if (distance < 3 * size) {
                // Bottom side
                x = centerX + size/2 - (distance - 2 * size);
                y = centerY - size/2;
            } else {
                // Left side
                x = centerX - size/2;
                y = centerY - size/2 + (distance - 3 * size);
            }
            
            positions.push({ x, y, z: altitude });
        }
        
        return positions;
    }

    generateTriangle(droneCount, options = {}) {
        const size = options.size || 20;
        const centerX = options.centerX || 0;
        const centerY = options.centerY || 0;
        const altitude = options.altitude || 15;
        
        const positions = [];
        const height = size * Math.sqrt(3) / 2;
        
        // Triangle vertices
        const vertices = [
            { x: centerX, y: centerY + height * 2/3 }, // Top
            { x: centerX - size/2, y: centerY - height/3 }, // Bottom left
            { x: centerX + size/2, y: centerY - height/3 }  // Bottom right
        ];
        
        const perimeter = 3 * size;
        const spacing = perimeter / droneCount;
        
        for (let i = 0; i < droneCount; i++) {
            const distance = i * spacing;
            let x, y;
            
            if (distance < size) {
                // Side 1: top to bottom-right
                const t = distance / size;
                x = vertices[0].x + t * (vertices[2].x - vertices[0].x);
                y = vertices[0].y + t * (vertices[2].y - vertices[0].y);
            } else if (distance < 2 * size) {
                // Side 2: bottom-right to bottom-left
                const t = (distance - size) / size;
                x = vertices[2].x + t * (vertices[1].x - vertices[2].x);
                y = vertices[2].y + t * (vertices[1].y - vertices[2].y);
            } else {
                // Side 3: bottom-left to top
                const t = (distance - 2 * size) / size;
                x = vertices[1].x + t * (vertices[0].x - vertices[1].x);
                y = vertices[1].y + t * (vertices[0].y - vertices[1].y);
            }
            
            positions.push({ x, y, z: altitude });
        }
        
        return positions;
    }

    generateHeart(droneCount, options = {}) {
        const scale = options.scale || 10;
        const centerX = options.centerX || 0;
        const centerY = options.centerY || 0;
        const altitude = options.altitude || 15;
        
        const positions = [];
        
        for (let i = 0; i < droneCount; i++) {
            const t = (i / droneCount) * 2 * Math.PI;
            
            // Heart shape parametric equations
            const x = centerX + scale * (16 * Math.pow(Math.sin(t), 3));
            const y = centerY + scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            positions.push({ x: x/16, y: y/16, z: altitude });
        }
        
        return positions;
    }

    generateStar(droneCount, options = {}) {
        const outerRadius = options.outerRadius || 20;
        const innerRadius = options.innerRadius || 10;
        const centerX = options.centerX || 0;
        const centerY = options.centerY || 0;
        const altitude = options.altitude || 15;
        const points = options.points || 5;
        
        const positions = [];
        const totalPoints = points * 2; // Outer and inner points
        const angleStep = (2 * Math.PI) / totalPoints;
        
        const dronesPerPoint = Math.ceil(droneCount / totalPoints);
        let droneIndex = 0;
        
        for (let i = 0; i < totalPoints && droneIndex < droneCount; i++) {
            const angle = i * angleStep;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            
            for (let j = 0; j < dronesPerPoint && droneIndex < droneCount; j++) {
                const adjustedRadius = radius * (1 - j * 0.1); // Slight inward spacing
                positions.push({
                    x: centerX + adjustedRadius * Math.cos(angle),
                    y: centerY + adjustedRadius * Math.sin(angle),
                    z: altitude
                });
                droneIndex++;
            }
        }
        
        return positions.slice(0, droneCount);
    }

    generateGrid(droneCount, options = {}) {
        const spacing = options.spacing || 5;
        const centerX = options.centerX || 0;
        const centerY = options.centerY || 0;
        const altitude = options.altitude || 15;
        
        const positions = [];
        const gridSize = Math.ceil(Math.sqrt(droneCount));
        const totalWidth = (gridSize - 1) * spacing;
        const startX = centerX - totalWidth / 2;
        const startY = centerY - totalWidth / 2;
        
        for (let i = 0; i < droneCount; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            
            positions.push({
                x: startX + col * spacing,
                y: startY + row * spacing,
                z: altitude
            });
        }
        
        return positions;
    }

    generateSpiral(droneCount, options = {}) {
        const maxRadius = options.maxRadius || 25;
        const centerX = options.centerX || 0;
        const centerY = options.centerY || 0;
        const altitude = options.altitude || 15;
        const turns = options.turns || 3;
        
        const positions = [];
        
        for (let i = 0; i < droneCount; i++) {
            const t = (i / droneCount) * turns * 2 * Math.PI;
            const radius = (i / droneCount) * maxRadius;
            
            positions.push({
                x: centerX + radius * Math.cos(t),
                y: centerY + radius * Math.sin(t),
                z: altitude
            });
        }
        
        return positions;
    }
}

module.exports = FormationPatterns;