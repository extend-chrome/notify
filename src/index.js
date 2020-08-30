import { notifications } from '@extend-chrome/events-rxjs'
import chromep from 'chrome-promise'
import { first } from 'rxjs/operators'

const { name, icons = {} } = chrome.runtime.getManifest()

const iconUrl =
  icons[
    Object.keys(icons)
      .map((s) => parseInt(s))
      .reduce((r, x) => (r > x ? r : x), 0)
      .toString()
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
  onClick = () => {},
  buttons = [],
  id,
  ...rest
}) => {
  const msg = {
    type: 'basic',
    title: name,
    iconUrl,
    buttons: buttons.map(({ title, iconUrl }) => ({
      title,
      iconUrl,
    })),
    ...rest,
  }

  const created = id
    ? chromep.notifications.create(id, msg)
    : chromep.notifications.create(msg)

  return created
    .then(handleBtnClick(buttons))
    .then(handleClick(onClick))
    .catch((error) => {
      console.error('Could not create notification.')
      console.error(error)
    })
}

const handleBtnClick = (buttons) => (id) => {
  if (buttons.length) {
    notifications.buttonClick$
      .pipe(first(({ noteId }) => noteId === id))
      .subscribe(({ noteId, buttonIndex }) => {
        buttons[buttonIndex].onClick(noteId)
        chrome.notifications.clear(noteId)
      })
  }

  return id
}

const handleClick = (onClick) => (id) => {
  notifications.click$
    .pipe(first((noteId) => noteId === id))
    .subscribe((noteId) => {
      onClick(noteId)
      chrome.notifications.clear(noteId)
    })

  return id
}

export const notify = (message) => create({ message })

Object.assign(notify, chromep.notifications, { create })
