import { NODE_COLORS, SHAPE_DEFAULT_SIZES } from "@/types/canvas"
import type { CanvasEdge, CanvasNode, NodeColor, NodeShape } from "@/types/canvas"

interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

const NEUTRAL = NODE_COLORS[0]
const BLUE = NODE_COLORS[1]
const PURPLE = NODE_COLORS[2]
const ORANGE = NODE_COLORS[3]
const RED = NODE_COLORS[4]
const PINK = NODE_COLORS[5]
const GREEN = NODE_COLORS[6]
const TEAL = NODE_COLORS[7]

function createTemplateNode(
  id: string,
  label: string,
  shape: NodeShape,
  color: NodeColor,
  position: { x: number; y: number }
): CanvasNode {
  const { width, height } = SHAPE_DEFAULT_SIZES[shape]

  return {
    id,
    type: "canvasNode",
    position,
    width,
    height,
    data: { label, color: color.fill, shape },
  }
}

function createTemplateEdge(id: string, source: string, target: string, label?: string): CanvasEdge {
  return {
    id,
    type: "canvasEdge",
    source,
    target,
    data: label ? { label } : {},
  }
}

const MICROSERVICES_TEMPLATE: CanvasTemplate = {
  id: "microservices",
  name: "Microservices",
  description: "A client talking to backend services through an API gateway, each with its own database.",
  nodes: [
    createTemplateNode("client", "Client", "circle", NEUTRAL, { x: 40, y: 160 }),
    createTemplateNode("gateway", "API Gateway", "hexagon", TEAL, { x: 260, y: 150 }),
    createTemplateNode("auth-service", "Auth Service", "pill", PURPLE, { x: 520, y: 40 }),
    createTemplateNode("orders-service", "Orders Service", "pill", ORANGE, { x: 520, y: 160 }),
    createTemplateNode("users-service", "Users Service", "pill", GREEN, { x: 520, y: 280 }),
    createTemplateNode("orders-db", "Orders DB", "cylinder", ORANGE, { x: 760, y: 155 }),
    createTemplateNode("users-db", "Users DB", "cylinder", GREEN, { x: 760, y: 275 }),
  ],
  edges: [
    createTemplateEdge("client-gateway", "client", "gateway"),
    createTemplateEdge("gateway-auth", "gateway", "auth-service"),
    createTemplateEdge("gateway-orders", "gateway", "orders-service"),
    createTemplateEdge("gateway-users", "gateway", "users-service"),
    createTemplateEdge("orders-orders-db", "orders-service", "orders-db"),
    createTemplateEdge("users-users-db", "users-service", "users-db"),
  ],
}

const CICD_PIPELINE_TEMPLATE: CanvasTemplate = {
  id: "cicd-pipeline",
  name: "CI/CD Pipeline",
  description: "A build pipeline from a git push through tests and an approval gate to staging and production.",
  nodes: [
    createTemplateNode("git-push", "Git Push", "circle", NEUTRAL, { x: 40, y: 130 }),
    createTemplateNode("build", "Build", "pill", BLUE, { x: 260, y: 130 }),
    createTemplateNode("test", "Test", "pill", PURPLE, { x: 480, y: 130 }),
    createTemplateNode("artifact-registry", "Artifact Registry", "cylinder", BLUE, { x: 480, y: 290 }),
    createTemplateNode("approval-gate", "Approval Gate", "diamond", ORANGE, { x: 700, y: 110 }),
    createTemplateNode("deploy-staging", "Deploy Staging", "pill", TEAL, { x: 940, y: 40 }),
    createTemplateNode("deploy-production", "Deploy Production", "pill", RED, { x: 940, y: 210 }),
  ],
  edges: [
    createTemplateEdge("push-build", "git-push", "build"),
    createTemplateEdge("build-test", "build", "test"),
    createTemplateEdge("build-registry", "build", "artifact-registry"),
    createTemplateEdge("test-gate", "test", "approval-gate"),
    createTemplateEdge("gate-staging", "approval-gate", "deploy-staging"),
    createTemplateEdge("staging-production", "deploy-staging", "deploy-production"),
  ],
}

const EVENT_DRIVEN_TEMPLATE: CanvasTemplate = {
  id: "event-driven",
  name: "Event-Driven System",
  description: "A producer publishing events through a shared event bus to multiple independent consumers.",
  nodes: [
    createTemplateNode("producer", "Producer Service", "pill", BLUE, { x: 40, y: 160 }),
    createTemplateNode("event-bus", "Event Bus", "hexagon", TEAL, { x: 300, y: 150 }),
    createTemplateNode("notification-consumer", "Notification Consumer", "pill", PINK, { x: 560, y: 30 }),
    createTemplateNode("analytics-consumer", "Analytics Consumer", "pill", PURPLE, { x: 560, y: 160 }),
    createTemplateNode("inventory-consumer", "Inventory Consumer", "pill", GREEN, { x: 560, y: 290 }),
    createTemplateNode("analytics-store", "Analytics Store", "cylinder", PURPLE, { x: 800, y: 155 }),
  ],
  edges: [
    createTemplateEdge("producer-bus", "producer", "event-bus"),
    createTemplateEdge("bus-notification", "event-bus", "notification-consumer"),
    createTemplateEdge("bus-analytics", "event-bus", "analytics-consumer"),
    createTemplateEdge("bus-inventory", "event-bus", "inventory-consumer"),
    createTemplateEdge("analytics-analytics-store", "analytics-consumer", "analytics-store"),
  ],
}

const CANVAS_TEMPLATES: readonly CanvasTemplate[] = [
  MICROSERVICES_TEMPLATE,
  CICD_PIPELINE_TEMPLATE,
  EVENT_DRIVEN_TEMPLATE,
]

export { CANVAS_TEMPLATES }
export type { CanvasTemplate }
