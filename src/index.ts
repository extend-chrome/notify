import chromep from 'chrome-promise'

const { name, icons = {} } = chrome.runtime.getManifest()

const iconUrl =
  icons[
    Object.keys(icons)
      .map((size) => parseInt(size))
      .reduce((r, x) => (r > x ? r : x), 0)
  ]

/**
 * @example
 * notify.create({
 *   message: 'Click here for awesomeness.'
 *   onClick: yesPlease
 *   buttons: [
 *     { title: 'OK', onClick: yesPlease },
 *     { title: 'No way', onClick: dontWantIt }
 *   ]
 * })
 */
const create = ({
  buttons = [],
  id,
  ...rest
}: Partial<chrome.notifications.NotificationOptions> & {
  id?: string
}) => {
  const msg = {
    type: 'basic' as browser.notifications.TemplateType,
    title: name,
    iconUrl,
    buttons: buttons.map(({ title, iconUrl }) => ({
      title,
      iconUrl,
    })),
    ...rest,
  } as browser.notifications.CreateNotificationOptions

  const created =
    typeof id === 'string'
      ? chromep.notifications.create(id, msg)
      : chromep.notifications.create(msg)

  return created
}

export const notify = (message: string): Promise<string> => create({ message })

Object.assign(notify, chromep.notifications, { create })
