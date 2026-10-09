import type { Project } from '../types'
import { useWorkspaceStore } from '../stores/workspace-store'

/**
 * Mock adapter — Documentation §9: services are the future boundary
 * between UI and a real REST/realtime backend. Swap the bodies with
 * fetch() calls in the backend phase without touching UI code.
 */
export const delay = (ms = 650) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const projectAdapter = {
  async getProjects(): Promise<Project[]> {
    await delay()
    return useWorkspaceStore.getState().projects
  },
  async getProject(id: string): Promise<Project | undefined> {
    await delay(400)
    return useWorkspaceStore.getState().projects.find((p) => p.id === id)
  },
}
