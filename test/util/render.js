/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { jsdom } from 'jsdom';
import createDailymotion from './createDailymotion';

const document = jsdom('<!doctype html><html><body></body></html>');
global.window = { document };
global.document = document;

const render = (props) => {
  const { Dailymotion, sdkMock, playerMock } = createDailymotion();

  let component;
  // Emulate changes to component.props using a container component's state
  class Container extends React.Component {
    constructor(props) {
      super(props);

      this.state = props;
    }

    render() {
      return (
        <Dailymotion
          ref={dailymotion => { component = dailymotion; }}
          { ...this.state }
        />
      );
    }
  }

  const div = document.createElement('div');
  const container = ReactDOM.render(<Container { ...props } />, div);

  function rerender(newProps) {
    return new Promise(resolve => {
      container.setState(newProps, () => {
        Promise.resolve().then(resolve);
      });
    });
  }

  function unmount() {
    ReactDOM.unmountComponentAtNode(div);
  }

  return component.player.then(() => ({
    sdkMock,
    playerMock,
    component,
    rerender,
    unmount,
  }));
};

export default render;
