import React                from 'react';
import { render } from 'react-dom';
import { Router }           from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Provider }         from 'react-redux';
import { fromJS }           from 'immutable';
import * as reducers        from 'reducers';
import routes               from 'routes';
import promiseMiddleware    from 'lib/promiseMiddleware';
import immutifyState        from 'lib/immutifyState';
import DevTools             from 'devTools';
import { persistState }     from 'redux-devtools';
import { compose,
				createStore,
				combineReducers,
				applyMiddleware }	from 'redux';

import 'styles/style.scss';  

const initialState = immutifyState(window.__INITIAL_STATE__);

const history = createBrowserHistory();

const reducer = combineReducers(reducers);

const finalCreateStore = compose(
	// Enables your middleware:
	applyMiddleware(promiseMiddleware),
	// Provides support for DevTools:
	DevTools.instrument(),
	// Lets you write ?debug_session=<name> in address bar to persist debug sessions
	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const store = finalCreateStore(reducer, initialState);

class App extends React.Component {
	render() {
		return (
				<Provider store={store}>
					<div>
						<Router children={routes} history={history} />
						<DevTools />
					</div>
				</Provider>
		);
	}
}

render(
  <App />,
  document.getElementById('react-view')
);
