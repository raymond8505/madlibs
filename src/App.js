import Main from "./components/Main";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actionCreators from "./actions/creators";

import "./css/styles.css";

export function mapStateToProps(state) {
  return {
    words: state.words,
    sentence: state.sentence
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);

export default App;
