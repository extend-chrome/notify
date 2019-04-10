import chromep from 'chrome-promise'
import log from '@bumble/rxjs-log'
import { notifications } from '@bumble/chrome-rxjs'
import { first } from 'rxjs/operators'

const { name, icons = {} } = chrome.runtime.getManifest()

const iconUrl =
  icons[
    Object.keys(icons)
      .map(s => parseInt(s))
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
  return chromep.notifications
    .create(msg)
    .then(handleBtnClick(buttons))
    .then(handleClick(onClick))
    .catch(err => {
      console.error('create', err)
    })
}

const handleBtnClick = buttons => id => {
  if (buttons.length) {
    notifications
      .buttonClicks()
      .pipe(
        log('onButtonClicked'),
        first(({ noteId }) => noteId === id),
      )
      .subscribe(({ noteId, buttonIndex }) => {
        buttons[buttonIndex].onClick()
        chrome.notifications.clear(noteId)
      })
  }
  return id
}

const handleClick = onClick => id => {
  notifications
    .clicks()
    .pipe(
      log('onClicked'),
      first(noteId => noteId === id),
    )
    .subscribe(id => {
      onClick()
      chrome.notifications.clear(id)
    })

  return id
}

/**
 * @example
 * notify('You have been notified!')
 */
const notify = message => create({ message })

Object.assign(notify, chromep.notifications, { create })

export default notify
