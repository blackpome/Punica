"use client";

import { useCallback } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const INITIAL_NODES: Node[] = [
  {
    id: "internet",
    position: { x: 0, y: 120 },
    data: { label: "Internet" },
    type: "input",
  },
  { id: "waf", position: { x: 220, y: 120 }, data: { label: "WAF / CDN" } },
  {
    id: "lb",
    position: { x: 440, y: 120 },
    data: { label: "Load Balancer" },
  },
  { id: "web", position: { x: 660, y: 40 }, data: { label: "Web App" } },
  { id: "api", position: { x: 660, y: 200 }, data: { label: "API Service" } },
  {
    id: "db",
    position: { x: 900, y: 120 },
    data: { label: "PostgreSQL" },
    type: "output",
  },
  {
    id: "idp",
    position: { x: 440, y: 300 },
    data: { label: "Identity Provider" },
  },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "internet", target: "waf", animated: true },
  { id: "e2", source: "waf", target: "lb" },
  { id: "e3", source: "lb", target: "web" },
  { id: "e4", source: "lb", target: "api" },
  { id: "e5", source: "web", target: "db" },
  { id: "e6", source: "api", target: "db" },
  { id: "e7", source: "api", target: "idp" },
];

export function ArchitectureFlow() {
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-[60vh] w-full overflow-hidden rounded-xl border border-border/60 bg-card/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}
