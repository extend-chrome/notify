import chromep from 'chrome-promise'

export interface NotifyOptions
  extends Partial<chrome.notifications.NotificationOptions> {
  message: string
}

export const notify: ((message: string) => Promise<string>) &
  typeof chromep.notifications & {
    /**
     * Resolves to the notification id (either supplied or generated) that represents the created notification.
     */
    create(options: NotifyOptions): Promise<string>
  }
