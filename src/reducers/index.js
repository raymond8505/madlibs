import { combineReducers } from "redux";
import words from "./words";
import sentence from "./sentence";

const rootReducer = combineReducers({
  words,
  sentence
});

export default rootReducer;
