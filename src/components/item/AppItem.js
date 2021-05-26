import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { getAppExtra } from '../../utils/itemExtra';
import { requestApiAccessToken } from '../../api/app';
import {
  GET_AUTH_TOKEN,
  GET_AUTH_TOKEN_SUCCEEDED,
  GET_CONTEXT_SUCCEEDED,
  GET_CONTEXT,
} from '../../types/appItem';
import { hooks } from '../../config/queryClient';
import { API_HOST } from '../../config/constants';
import Loader from '../common/Loader';

const AppItem = ({ item }) => {
  const iframeRef = useRef();
  const url = getAppExtra(item?.get('extra'))?.url;
  const { data: user, isLoading } = hooks.useCurrentMember();

  const channel = new MessageChannel();
  const { port1 } = channel;

  const getToken = async ({ app, origin }) => {
    // get token from backend
    const { token } = await requestApiAccessToken({
      id: item.get('id'),
      // the app should provide this (in the message)
      // this id is "manually" added as a "registered" app id.
      // each app that uses the API needs one.
      app,
      origin,
    });

    return token;
  };

  // receive message from app through MessageChannel
  const onMessage = async (e) => {
    const { data, origin: requestOrigin } = e;

    // responds only to corresponding app
    if (!url.includes(requestOrigin)) {
      return;
    }

    const { type, payload } = JSON.parse(data);
    if (type === GET_AUTH_TOKEN) {
      const token = await getToken(payload);
      port1.postMessage(
        JSON.stringify({ type: GET_AUTH_TOKEN_SUCCEEDED, payload: { token } }),
      );
    }
  };

  const windowOnMessage = async (e) => {
    const { data, origin: requestOrigin } = e;
    const { type } = JSON.parse(data);

    // responds only to corresponding app
    if (!url.includes(requestOrigin)) {
      return;
    }

    // return context data and message channel port to app
    if (type === GET_CONTEXT) {
      // Listen for messages on port1
      port1.onmessage = onMessage;

      // Transfer port2 to the iframe
      // provide port2 to app and item's data
      iframeRef.current.contentWindow.postMessage(
        {
          type: GET_CONTEXT_SUCCEEDED,
          payload: {
            itemId: item.get('id'),
            userId: user?.get('id'),
            apiHost: API_HOST.substr('http://'.length), // todo: to change
            mode: 'student', // todo: to change
          },
        },
        '*',
        [channel.port2],
      );
    }

    // further communication will pass through message channel
    // so we can stop listening on message
    window.removeEventListener('message', windowOnMessage);
  };

  useEffect(() => {
    window.addEventListener('message', windowOnMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <iframe
      title={item?.get('name')}
      ref={iframeRef}
      width="100%"
      height={300}
      src={url}
      frameBorder={0}
    />
  );
};

AppItem.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default AppItem;
