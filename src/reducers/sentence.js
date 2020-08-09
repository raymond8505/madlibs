import {SENTENCE_ACTIONS} from "../actions/creators";

export default function sentence(state = [], action) {
  
  switch(action.type)
  {
    case SENTENCE_ACTIONS.SET :
      state = action.sentence;
      break;
  }

  return state;
}
