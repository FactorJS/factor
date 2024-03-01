import events from 'node:events'

let __globalEvent: NodeJS.EventEmitter

function getGlobalEventBus(): NodeJS.EventEmitter {
  if (!__globalEvent) {
    __globalEvent = new events.EventEmitter()
    // set max listeners to 50 as the limit of 10 is sometimes too low (form listeners)
    __globalEvent.setMaxListeners(50)
  }
  return __globalEvent
}
/**
 * Emits an event which can be listened to from onEvent
 */
export function emitEvent(event: string, ...data: unknown[]): void {
  getGlobalEventBus().emit(event, ...data)
}
/**
 * Listens for an event emitted by emitEvent
 */
export function onEvent(event: string, callback: (...args: any[]) => void): NodeJS.EventEmitter {
  return getGlobalEventBus().on(event, callback)
}
/**
 * Removes an event
 */
export function removeEvent(event: string, callback: (...args: any[]) => void): void {
  getGlobalEventBus().off(event, callback)
}
