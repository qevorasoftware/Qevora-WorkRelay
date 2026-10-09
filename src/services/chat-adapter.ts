import { useChatStore } from '../stores/chat-demo-store'
import { delay } from './project-adapter'

export const chatAdapter = {
  /** Future realtime transport replaces this with websocket send. */
  async send(body: string) {
    await delay(150)
    useChatStore.getState().sendMessage(body)
  },
}
