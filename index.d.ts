import chromep from 'chrome-promise'

// Type definitions for @bumble/notify
// Definitions by: Jack and Amy Steam <https://jackandamy.rocks>
/// <reference types="chrome" />

export interface NotifyOptions
  extends chrome.notifications.NotificationOptions {
  message: string
  /**
   * This only works if the background page is persistent.
   */
  onClick?: (id: string) => void
  /**
   * This only works if the background page is persistent.
   */
  buttons?: [(id: string) => void, (id: string) => void]
}

export function notify(message: string): Promise<string>
export namespace notify {
  /**
   * Resolves to the notification id (either supplied or generated) that represents the created notification.
   */
  export function create(NotifyOptions): Promise<string>
}
