import { createStore } from "redux";
import rootReducer from "./reducers/index";

const defaultState = {
  words: {},
  sentence: "The {adjective} {noun} {verb} the {adjective} {noun}"
};

const store = createStore(rootReducer, defaultState);

export default store;
