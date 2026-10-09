import type { RequestInput } from '../lib/validation'
import type { Request } from '../types'
import { useWorkspaceStore } from '../stores/workspace-store'
import { delay } from './project-adapter'

export const requestAdapter = {
  async create(input: RequestInput): Promise<Request> {
    await delay(500)
    return useWorkspaceStore.getState().createRequest(input)
  },
  async setStatus(id: string, status: Request['status']) {
    await delay(250)
    useWorkspaceStore.getState().setRequestStatus(id, status)
  },
}
