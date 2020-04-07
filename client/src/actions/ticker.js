import axios from "axios";
import _ from "lodash";
import { combineReducers } from "redux";
import { apiUrl } from "../variables";

// -------------- Action types -----------
const GET_TICKERS_STARTED = "GET_TICKERS_STARTED";
const GET_TICKERS_SUCCESS = "GET_TICKERS_SUCCESS";
const GET_TICKERS_ERROR = "GET_TICKERS_ERROR";

// -------------- Action creators -----------
export const getTickers = () => async (dispatch, getState) => {
  dispatch(getTickersStarted());
  try {
    const res = await axios.get(`${apiUrl}/tickers`);
    dispatch(getTickersSuccess(res.data));
  } catch (e) {
    dispatch(getTickersFailure(e.message));
  }
};

const getTickersSuccess = tickers => ({
  type: GET_TICKERS_SUCCESS,
  payload: {
    ...tickers
  }
});

const getTickersStarted = () => ({
  type: GET_TICKERS_STARTED
});

const getTickersFailure = error => ({
  type: GET_TICKERS_ERROR,
  payload: {
    error
  }
});

export const updateTicker = ticker => {
  return getTickersSuccess(ticker);
};

// -------------- Reducers -----------
const tickersReducer = (tickers = {}, action) => {
  switch (action.type) {
    case GET_TICKERS_SUCCESS:
      return _.merge({}, tickers, action.payload);
    default:
      return tickers;
  }
};

export const reducers = combineReducers({
  tickers: tickersReducer
});
