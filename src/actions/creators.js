export function setWords(words) {
  return {
    type: WORD_ACTIONS.SET,
    words: words
  };
}

export function setSentence(sentence)
{
  return {
    type : SENTENCE_ACTIONS.SET,
    sentence : sentence
  }
}

export const WORD_ACTIONS = {
  SET: "SET_WORDS"
};

export const SENTENCE_ACTIONS = {
  SET : "SET_SENTENCE"
}
