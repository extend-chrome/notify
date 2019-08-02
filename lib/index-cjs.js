'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var chromep = _interopDefault(require('chrome-promise'));
var chromeRxjs = require('@bumble/chrome-rxjs');
var operators = require('rxjs/operators');

const { name, icons = {} } = chrome.runtime.getManifest();

const iconUrl =
  icons[
    Object.keys(icons)
      .map((s) => parseInt(s))
      .reduce((r, x) => (r > x ? r : x), 0)
      .toString()
  ];

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
  };

  const created = id
    ? chromep.notifications.create(id, msg)
    : chromep.notifications.create(msg);

  return created
    .then(handleBtnClick(buttons))
    .then(handleClick(onClick))
    .catch((error) => {
      console.error('Could not create notification.');
      console.error(error);
    })
};

const handleBtnClick = (buttons) => (id) => {
  if (buttons.length) {
    chromeRxjs.notifications.buttonClick$
      .pipe(operators.first(({ noteId }) => noteId === id))
      .subscribe(({ noteId, buttonIndex }) => {
        buttons[buttonIndex].onClick(noteId);
        chrome.notifications.clear(noteId);
      });
  }

  return id
};

const handleClick = (onClick) => (id) => {
  chromeRxjs.notifications.click$
    .pipe(operators.first((noteId) => noteId === id))
    .subscribe((noteId) => {
      onClick(noteId);
      chrome.notifications.clear(noteId);
    });

  return id
};

const notify = (message) => create({ message });

Object.assign(notify, chromep.notifications, { create });

exports.notify = notify;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtY2pzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNocm9tZXAgZnJvbSAnY2hyb21lLXByb21pc2UnXG5pbXBvcnQgeyBub3RpZmljYXRpb25zIH0gZnJvbSAnQGJ1bWJsZS9jaHJvbWUtcnhqcydcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5cbmNvbnN0IHsgbmFtZSwgaWNvbnMgPSB7fSB9ID0gY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKVxuXG5jb25zdCBpY29uVXJsID1cbiAgaWNvbnNbXG4gICAgT2JqZWN0LmtleXMoaWNvbnMpXG4gICAgICAubWFwKChzKSA9PiBwYXJzZUludChzKSlcbiAgICAgIC5yZWR1Y2UoKHIsIHgpID0+IChyID4geCA/IHIgOiB4KSwgMClcbiAgICAgIC50b1N0cmluZygpXG4gIF1cblxuLyoqXG4gKiBAZXhhbXBsZVxuICogbm90aWZ5LmNyZWF0ZSh7XG4gKiAgIG1lc3NhZ2U6ICdDbGljayBoZXJlIGZvciBhd2Vzb21lbmVzcy4nXG4gKiAgIG9uQ2xpY2s6IHllc1BsZWFzZVxuICogICBidXR0b25zOiBbXG4gKiAgICAgeyB0aXRsZTogJ09LJywgb25DbGljazogeWVzUGxlYXNlIH0sXG4gKiAgICAgeyB0aXRsZTogJ05vIHdheScsIG9uQ2xpY2s6IGRvbnRXYW50SXQgfVxuICogICBdXG4gKiB9KVxuICovXG5jb25zdCBjcmVhdGUgPSAoe1xuICBvbkNsaWNrID0gKCkgPT4ge30sXG4gIGJ1dHRvbnMgPSBbXSxcbiAgaWQsXG4gIC4uLnJlc3Rcbn0pID0+IHtcbiAgY29uc3QgbXNnID0ge1xuICAgIHR5cGU6ICdiYXNpYycsXG4gICAgdGl0bGU6IG5hbWUsXG4gICAgaWNvblVybCxcbiAgICBidXR0b25zOiBidXR0b25zLm1hcCgoeyB0aXRsZSwgaWNvblVybCB9KSA9PiAoe1xuICAgICAgdGl0bGUsXG4gICAgICBpY29uVXJsLFxuICAgIH0pKSxcbiAgICAuLi5yZXN0LFxuICB9XG5cbiAgY29uc3QgY3JlYXRlZCA9IGlkXG4gICAgPyBjaHJvbWVwLm5vdGlmaWNhdGlvbnMuY3JlYXRlKGlkLCBtc2cpXG4gICAgOiBjaHJvbWVwLm5vdGlmaWNhdGlvbnMuY3JlYXRlKG1zZylcblxuICByZXR1cm4gY3JlYXRlZFxuICAgIC50aGVuKGhhbmRsZUJ0bkNsaWNrKGJ1dHRvbnMpKVxuICAgIC50aGVuKGhhbmRsZUNsaWNrKG9uQ2xpY2spKVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBjcmVhdGUgbm90aWZpY2F0aW9uLicpXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIH0pXG59XG5cbmNvbnN0IGhhbmRsZUJ0bkNsaWNrID0gKGJ1dHRvbnMpID0+IChpZCkgPT4ge1xuICBpZiAoYnV0dG9ucy5sZW5ndGgpIHtcbiAgICBub3RpZmljYXRpb25zLmJ1dHRvbkNsaWNrJFxuICAgICAgLnBpcGUoZmlyc3QoKHsgbm90ZUlkIH0pID0+IG5vdGVJZCA9PT0gaWQpKVxuICAgICAgLnN1YnNjcmliZSgoeyBub3RlSWQsIGJ1dHRvbkluZGV4IH0pID0+IHtcbiAgICAgICAgYnV0dG9uc1tidXR0b25JbmRleF0ub25DbGljayhub3RlSWQpXG4gICAgICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNsZWFyKG5vdGVJZClcbiAgICAgIH0pXG4gIH1cblxuICByZXR1cm4gaWRcbn1cblxuY29uc3QgaGFuZGxlQ2xpY2sgPSAob25DbGljaykgPT4gKGlkKSA9PiB7XG4gIG5vdGlmaWNhdGlvbnMuY2xpY2skXG4gICAgLnBpcGUoZmlyc3QoKG5vdGVJZCkgPT4gbm90ZUlkID09PSBpZCkpXG4gICAgLnN1YnNjcmliZSgobm90ZUlkKSA9PiB7XG4gICAgICBvbkNsaWNrKG5vdGVJZClcbiAgICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNsZWFyKG5vdGVJZClcbiAgICB9KVxuXG4gIHJldHVybiBpZFxufVxuXG5leHBvcnQgY29uc3Qgbm90aWZ5ID0gKG1lc3NhZ2UpID0+IGNyZWF0ZSh7IG1lc3NhZ2UgfSlcblxuT2JqZWN0LmFzc2lnbihub3RpZnksIGNocm9tZXAubm90aWZpY2F0aW9ucywgeyBjcmVhdGUgfSlcbiJdLCJuYW1lcyI6WyJub3RpZmljYXRpb25zIiwiZmlyc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRTs7QUFFekQsTUFBTSxPQUFPO0VBQ1gsS0FBSztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ2YsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUNwQyxRQUFRLEVBQUU7SUFDZDs7Ozs7Ozs7Ozs7OztBQWFILE1BQU0sTUFBTSxHQUFHLENBQUM7RUFDZCxPQUFPLEdBQUcsTUFBTSxFQUFFO0VBQ2xCLE9BQU8sR0FBRyxFQUFFO0VBQ1osRUFBRTtFQUNGLEdBQUcsSUFBSTtDQUNSLEtBQUs7RUFDSixNQUFNLEdBQUcsR0FBRztJQUNWLElBQUksRUFBRSxPQUFPO0lBQ2IsS0FBSyxFQUFFLElBQUk7SUFDWCxPQUFPO0lBQ1AsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTTtNQUM1QyxLQUFLO01BQ0wsT0FBTztLQUNSLENBQUMsQ0FBQztJQUNILEdBQUcsSUFBSTtJQUNSOztFQUVELE1BQU0sT0FBTyxHQUFHLEVBQUU7TUFDZCxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDO01BQ3JDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBQzs7RUFFckMsT0FBTyxPQUFPO0tBQ1gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzFCLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSztNQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFDO01BQy9DLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDO0tBQ3JCLENBQUM7RUFDTDs7QUFFRCxNQUFNLGNBQWMsR0FBRyxDQUFDLE9BQU8sS0FBSyxDQUFDLEVBQUUsS0FBSztFQUMxQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7SUFDbEJBLHdCQUFhLENBQUMsWUFBWTtPQUN2QixJQUFJLENBQUNDLGVBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssTUFBTSxLQUFLLEVBQUUsQ0FBQyxDQUFDO09BQzFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLO1FBQ3RDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDO1FBQ3BDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQztPQUNuQyxFQUFDO0dBQ0w7O0VBRUQsT0FBTyxFQUFFO0VBQ1Y7O0FBRUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFLEtBQUs7RUFDdkNELHdCQUFhLENBQUMsTUFBTTtLQUNqQixJQUFJLENBQUNDLGVBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxNQUFNLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDdEMsU0FBUyxDQUFDLENBQUMsTUFBTSxLQUFLO01BQ3JCLE9BQU8sQ0FBQyxNQUFNLEVBQUM7TUFDZixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUM7S0FDbkMsRUFBQzs7RUFFSixPQUFPLEVBQUU7RUFDVjs7QUFFRCxBQUFZLE1BQUMsTUFBTSxHQUFHLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFDOztBQUV0RCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUM7Ozs7In0=
