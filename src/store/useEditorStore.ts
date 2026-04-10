"use client"

import { create } from "zustand"
import type { JourneyDefinition, JourneyNode, JourneyEdge } from "../types/journey"
import type { Node, Edge } from "reactflow"

export interface EditorState {
  journey: JourneyDefinition | null
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
  isDirty: boolean
}

export interface EditorActions {
  setJourney: (journey: JourneyDefinition) => void
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (node: Node) => void
  updateNode: (id: string, data: Partial<JourneyNode>) => void
  deleteNode: (id: string) => void
  addEdge: (edge: Edge) => void
  updateEdge: (id: string, data: Partial<JourneyEdge>) => void
  deleteEdge: (id: string) => void
  selectNode: (id: string | null) => void
  selectEdge: (id: string | null) => void
  setDirty: (dirty: boolean) => void
  updateJourneyMeta: (meta: Partial<Pick<JourneyDefinition, "name" | "version" | "status">>) => void
}

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  journey: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  isDirty: false,

  setJourney: (journey) => {
    set({ journey, isDirty: false })
  },

  setNodes: (nodes) => {
    set({ nodes, isDirty: true })
  },

  setEdges: (edges) => {
    set({ edges, isDirty: true })
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
      isDirty: true
    }))
  },

  updateNode: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
      isDirty: true
    }))
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      isDirty: true
    }))
  },

  addEdge: (edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
      isDirty: true
    }))
  },

  updateEdge: (id, data) => {
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === id ? { ...edge, data: { ...edge.data, ...data } } : edge
      ),
      isDirty: true
    }))
  },

  deleteEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
      isDirty: true
    }))
  },

  selectNode: (id) => {
    set({ selectedNodeId: id })
  },

  selectEdge: (id) => {
    set({ selectedEdgeId: id })
  },

  setDirty: (dirty) => {
    set({ isDirty: dirty })
  },

  updateJourneyMeta: (meta) => {
    set((state) => ({
      journey: state.journey ? { ...state.journey, ...meta } : null,
      isDirty: true
    }))
  }
}))
