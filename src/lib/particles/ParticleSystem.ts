import * as THREE from 'three'

export interface ParticleConfig {
  count: number
  size: number
  color: THREE.Color | string
  opacity: number
  speed: number
  chaos: number
  spread: number
}

export interface MorphTarget {
  name: string
  positions: Float32Array
  colors?: Float32Array
}

export class ParticleSystem {
  public positions: Float32Array
  public velocities: Float32Array
  public colors: Float32Array
  public sizes: Float32Array
  public lifetimes: Float32Array

  private config: ParticleConfig
  private morphTargets: Map<string, MorphTarget> = new Map()
  private currentMorphTarget: string | null = null
  private morphProgress: number = 0
  private isExploding: boolean = false
  private explosionCenter: THREE.Vector3 = new THREE.Vector3()
  private explosionProgress: number = 0

  constructor(config: ParticleConfig) {
    this.config = config
    const count = config.count

    this.positions = new Float32Array(count * 3)
    this.velocities = new Float32Array(count * 3)
    this.colors = new Float32Array(count * 3)
    this.sizes = new Float32Array(count)
    this.lifetimes = new Float32Array(count)

    this.initializeParticles()
  }

  private initializeParticles(): void {
    const { count, color, size, spread } = this.config
    const baseColor = color instanceof THREE.Color ? color : new THREE.Color(color)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = spread * Math.cbrt(Math.random()) // Cube root for uniform volume

      this.positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      this.positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      this.positions[i3 + 2] = radius * Math.cos(phi)

      // Random velocities
      this.velocities[i3] = (Math.random() - 0.5) * 0.02
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.02

      // Colors with slight variation
      const colorVariation = 0.1
      this.colors[i3] = baseColor.r + (Math.random() - 0.5) * colorVariation
      this.colors[i3 + 1] = baseColor.g + (Math.random() - 0.5) * colorVariation
      this.colors[i3 + 2] = baseColor.b + (Math.random() - 0.5) * colorVariation

      // Random sizes
      this.sizes[i] = size * (0.5 + Math.random() * 0.5)

      // Lifetimes for spawn/despawn
      this.lifetimes[i] = Math.random()
    }
  }

  public addMorphTarget(target: MorphTarget): void {
    this.morphTargets.set(target.name, target)
  }

  public morphTo(targetName: string, duration: number = 1): void {
    if (this.morphTargets.has(targetName)) {
      this.currentMorphTarget = targetName
      this.morphProgress = 0
    }
  }

  public explode(center?: THREE.Vector3): void {
    this.isExploding = true
    this.explosionProgress = 0
    if (center) {
      this.explosionCenter.copy(center)
    }
  }

  public implode(center?: THREE.Vector3): void {
    this.isExploding = false
    this.explosionProgress = 1
    if (center) {
      this.explosionCenter.copy(center)
    }
  }

  public setColor(color: THREE.Color | string): void {
    const baseColor = color instanceof THREE.Color ? color : new THREE.Color(color)
    const count = this.config.count

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const colorVariation = 0.1
      this.colors[i3] = baseColor.r + (Math.random() - 0.5) * colorVariation
      this.colors[i3 + 1] = baseColor.g + (Math.random() - 0.5) * colorVariation
      this.colors[i3 + 2] = baseColor.b + (Math.random() - 0.5) * colorVariation
    }
  }

  public update(delta: number, chaos: number = this.config.chaos): void {
    const { count, speed } = this.config

    // Handle explosion animation
    if (this.isExploding && this.explosionProgress < 1) {
      this.explosionProgress = Math.min(1, this.explosionProgress + delta * 2)
    } else if (!this.isExploding && this.explosionProgress > 0) {
      this.explosionProgress = Math.max(0, this.explosionProgress - delta * 2)
    }

    // Handle morphing
    if (this.currentMorphTarget && this.morphProgress < 1) {
      this.morphProgress = Math.min(1, this.morphProgress + delta)
      const target = this.morphTargets.get(this.currentMorphTarget)!
      const t = this.easeInOutCubic(this.morphProgress)

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        this.positions[i3] = THREE.MathUtils.lerp(this.positions[i3], target.positions[i3], t * delta * 3)
        this.positions[i3 + 1] = THREE.MathUtils.lerp(this.positions[i3 + 1], target.positions[i3 + 1], t * delta * 3)
        this.positions[i3 + 2] = THREE.MathUtils.lerp(this.positions[i3 + 2], target.positions[i3 + 2], t * delta * 3)
      }
    }

    // Update particle positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Apply velocity with chaos
      const chaosMultiplier = chaos * (1 + this.explosionProgress * 5)
      this.positions[i3] += this.velocities[i3] * speed * chaosMultiplier
      this.positions[i3 + 1] += this.velocities[i3 + 1] * speed * chaosMultiplier
      this.positions[i3 + 2] += this.velocities[i3 + 2] * speed * chaosMultiplier

      // Explosion force
      if (this.explosionProgress > 0) {
        const dx = this.positions[i3] - this.explosionCenter.x
        const dy = this.positions[i3 + 1] - this.explosionCenter.y
        const dz = this.positions[i3 + 2] - this.explosionCenter.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001

        const force = this.explosionProgress * 0.5 / dist
        this.positions[i3] += dx * force * delta
        this.positions[i3 + 1] += dy * force * delta
        this.positions[i3 + 2] += dz * force * delta
      }

      // Boundary constraints (soft)
      const maxDist = this.config.spread * 3
      const dist = Math.sqrt(
        this.positions[i3] ** 2 +
        this.positions[i3 + 1] ** 2 +
        this.positions[i3 + 2] ** 2
      )

      if (dist > maxDist) {
        const scale = maxDist / dist
        this.positions[i3] *= scale
        this.positions[i3 + 1] *= scale
        this.positions[i3 + 2] *= scale

        // Reverse velocity
        this.velocities[i3] *= -0.5
        this.velocities[i3 + 1] *= -0.5
        this.velocities[i3 + 2] *= -0.5
      }

      // Random velocity perturbation
      this.velocities[i3] += (Math.random() - 0.5) * chaos * 0.01
      this.velocities[i3 + 1] += (Math.random() - 0.5) * chaos * 0.01
      this.velocities[i3 + 2] += (Math.random() - 0.5) * chaos * 0.01
    }
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  public getPositions(): Float32Array {
    return this.positions
  }

  public getColors(): Float32Array {
    return this.colors
  }

  public getSizes(): Float32Array {
    return this.sizes
  }

  public dispose(): void {
    this.morphTargets.clear()
  }
}

// Predefined shape generators
export function generateSpherePositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = r * Math.cos(phi)
  }

  return positions
}

export function generateTorusPositions(count: number, majorRadius: number, minorRadius: number): Float32Array {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 2

    const r = minorRadius * Math.sqrt(Math.random())
    const x = (majorRadius + r * Math.cos(phi)) * Math.cos(theta)
    const y = r * Math.sin(phi)
    const z = (majorRadius + r * Math.cos(phi)) * Math.sin(theta)

    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z
  }

  return positions
}

export function generateHeartPositions(count: number, scale: number): Float32Array {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const t = Math.random() * Math.PI * 2
    const s = Math.random()

    // Parametric heart shape
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    const z = (Math.random() - 0.5) * 4

    positions[i3] = x * scale * 0.05 * s
    positions[i3 + 1] = y * scale * 0.05 * s
    positions[i3 + 2] = z * scale * 0.1 * s
  }

  return positions
}

export function generateStarPositions(count: number, scale: number, points: number = 5): Float32Array {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const angle = Math.random() * Math.PI * 2
    const pointIndex = Math.floor(Math.random() * points)
    const pointAngle = (pointIndex / points) * Math.PI * 2

    // Star rays
    const rayLength = Math.random()
    const innerRadius = 0.4
    const outerRadius = 1.0
    const radius = innerRadius + rayLength * (outerRadius - innerRadius)

    positions[i3] = Math.cos(pointAngle + angle * 0.1) * radius * scale
    positions[i3 + 1] = Math.sin(pointAngle + angle * 0.1) * radius * scale
    positions[i3 + 2] = (Math.random() - 0.5) * scale * 0.3
  }

  return positions
}

export function generateNetworkPositions(count: number, spread: number, nodeCount: number = 20): Float32Array {
  const positions = new Float32Array(count * 3)

  // Generate node positions
  const nodes: THREE.Vector3[] = []
  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread
    ))
  }

  // Distribute particles around nodes and along connections
  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    if (Math.random() < 0.3) {
      // Particle on a node
      const node = nodes[Math.floor(Math.random() * nodeCount)]
      const offset = 0.1
      positions[i3] = node.x + (Math.random() - 0.5) * offset
      positions[i3 + 1] = node.y + (Math.random() - 0.5) * offset
      positions[i3 + 2] = node.z + (Math.random() - 0.5) * offset
    } else {
      // Particle along a connection
      const node1 = nodes[Math.floor(Math.random() * nodeCount)]
      const node2 = nodes[Math.floor(Math.random() * nodeCount)]
      const t = Math.random()
      positions[i3] = node1.x + (node2.x - node1.x) * t
      positions[i3 + 1] = node1.y + (node2.y - node1.y) * t
      positions[i3 + 2] = node1.z + (node2.z - node1.z) * t
    }
  }

  return positions
}

export function generateBookPositions(count: number, width: number, height: number, depth: number): Float32Array {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // Book shape - mostly on surfaces
    const surface = Math.random()

    if (surface < 0.3) {
      // Front/back cover
      positions[i3] = (Math.random() - 0.5) * width
      positions[i3 + 1] = (Math.random() - 0.5) * height
      positions[i3 + 2] = (Math.random() < 0.5 ? -1 : 1) * depth * 0.5
    } else if (surface < 0.6) {
      // Pages (spine area)
      positions[i3] = -width * 0.5 + Math.random() * 0.1
      positions[i3 + 1] = (Math.random() - 0.5) * height
      positions[i3 + 2] = (Math.random() - 0.5) * depth
    } else {
      // Top/bottom edges
      positions[i3] = (Math.random() - 0.5) * width
      positions[i3 + 1] = (Math.random() < 0.5 ? -1 : 1) * height * 0.5
      positions[i3 + 2] = (Math.random() - 0.5) * depth
    }
  }

  return positions
}
