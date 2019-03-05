import { listenTo, error, log } from '@bumble/stream'
import chromep from 'chrome-promise'

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
 *   message: 'Hey, gimme some money!'
 *   buttons: [
 *     { title: 'Oh man, you stink!', onClick: giveMoney },
 *     { title: 'Ha ha ha!', onClick: punchInFace }
 *   ]
 * })
 *
 *
 *
 */
const create = ({ message, buttons = [], ...rest }) => {
  const msg = {
    type: 'basic',
    title: name,
    message,
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
    .catch(err => {
      console.error('create', err)
    })
}

const handleBtnClick = buttons => id => {
  try {
    if (buttons.length) {
      listenTo(chrome.notifications.onButtonClicked)
        .forEach(log('onButtonClicked'))
        .filter(noteId => noteId === id)
        .forEach((noteId, [, buttonIndex]) =>
          buttons[buttonIndex].onClick(),
        )
        .clear(() => true) //remove callback
        .catch(error('handleBtnClick'))
    }
  } catch (error) {
    console.error('handleBtnClick', error)
  }
}

/**
 * @example
 * notify('You have been notified!')
 */
const notify = message => create({ message })

Object.assign(notify, chromep.notifications, { create })

export default notify
