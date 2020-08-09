import {WORD_ACTIONS} from "../actions/creators";

function words(state = [], action) {

  switch(action.type)
  {
    case WORD_ACTIONS.SET:

      state = action.words;
      break;
  }

  return state;
}

export default words;
