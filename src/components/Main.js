import React from "react";
import store from "../store";
import WordList from "./WordList";
import { setSentence } from "../actions/creators";

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parsingSheet : false
    };
  }

  urlField = React.createRef();
  sentenceInput = React.createRef();
  shareField = React.createRef();

  //https://docs.google.com/spreadsheets/d/1lTowhCvMNxdg8srQREJIEl8yEJxSo4Hh58YlODC-LIg/gviz/tq?gid=0
  defaultWordsURL =
    "https://docs.google.com/spreadsheets/d/1lyGAciRMlbfIJSA4FHXTKlPfWrL3BMipitoNxnPU164/edit?usp=sharing";

  getSheetCode = shareURL => {
    let codeMatch = shareURL.match(/d\/([^/]+)\//i);

    if (codeMatch !== null && codeMatch.length > 1) {
      return codeMatch[1];
    } else {
      throw new Error(shareURL + " is not a valid google sheets url");
    }
  };

  parseWords = (respJSON,cb) => {
    console.log(respJSON);

    let words = {};
    let table = respJSON.table;
    let labels = [];

    table.rows.forEach((rowObj,r) => {

      let row = rowObj.c;

      row.forEach((cell,c) => {

        if(r === 0)
        {
          labels.push(cell.v);
        }
        else
        {
          let label = labels[c];

          if(words[label] === undefined)
          {
            words[label] = [];
          }

          if(cell !== null && cell.v !== null && cell.v.trim() !== '')
            words[label].push(cell.v);
        }
      });

      
    });

    this.props.setWords(words);
    this.setState({parsingSheet : false});
    
    if(cb) cb();
  };

  makeSheetJSONURL = code =>
    "https://docs.google.com/spreadsheets/d/" + code + "/gviz/tq?gid=0";

  handleGenerateSentence = e => {
    
    e.persist();

    let sentence = this.sentenceInput.current.value;

    sentence = this.replaceWords(sentence);

    this.props.setSentence(sentence);

  };

  replaceWords = (sentence) => {

    return this.findVariables(sentence);

  }

  findVariables = (sentence) => {

    let vars = sentence.match(/\{[^}]+\}/gi);

    vars.forEach(variable => {

      let replacement = this.pickWord(variable);

      sentence = sentence.replace(variable,replacement);

      console.log(variable,replacement);
    });

    return sentence;
  }

  pickWord = (variable) => {

    let label = variable.replace(/[\{,\}]/g,'');

    let allWords = store.getState().words;

    if(allWords != {})
    {
      let varWords = allWords[label];

      if(varWords && varWords.length > 0)
      {
        let i = Math.round(Math.random() * (varWords.length - 1));
        return varWords[i];
      }
    }

    return variable;
  }

  fetchSheet(url,cb) {
    fetch(url).then(resp => {
      let promise = Promise.resolve(resp);

      resp.text().then(text => {
        //so hacky
        let jsonMatch = text.match(
          /google\.visualization\.Query\.setResponse\((.+)\)/
        );

        if (jsonMatch !== null && jsonMatch.length > 1) {
          this.parseWords(JSON.parse(jsonMatch[1]),cb);
        }
      });
    });
  }

  makeShareURL = (sheetURL,sentence = '') => {

    return window.location.origin + '?sheet=' + encodeURIComponent(sheetURL) + '&sentence=' + encodeURIComponent(sentence); 
  }

  getSentenceFromURL = () => {
    
    let sentenceMatch = window.location.search.match(/sentence=([^&]+)/);

    if(sentenceMatch !== null && sentenceMatch.length > 1)
    {
      return decodeURIComponent(sentenceMatch[1]);
    }

    return null;
  }

  getSheetFromURL = () => {

    let sheetMatch = window.location.search.match(/sheet=([^&]+)/);

    if(sheetMatch !== null && sheetMatch.length > 1)
    {
      return decodeURIComponent(sheetMatch[1]);
    }

    return null;
  }

  componentDidMount() {
    //this.urlField.current.value = this.defaultWordsURL;

    let sharedSheet = this.getSheetFromURL() || this.defaultWordsURL;

    //this.shareField.current.value = this.makeShareURL(this.defaultWordsURL);

    let sentence = this.getSentenceFromURL() || store.getState().sentence;

    this.sentenceInput.current.value = sentence;

    this.urlField.current.value = sharedSheet;
    this.shareField.current.value = this.makeShareURL(sharedSheet,sentence);
    this.handleGetWordsClick();
    
  }

  handleGetWordsClick = e => {

    let sheetCode = this.getSheetCode(this.urlField.current.value);
    let jsonURL = this.makeSheetJSONURL(sheetCode);

    this.setState({parsingSheet : true});

    this.fetchSheet(jsonURL);
  }

  outputWordLists = () => {

    let words = store.getState().words;

    return Object.keys(words).map(label => {
      
      let wordWords = words[label];

      return <WordList key={label} label={label} words={wordWords} />;
    })
  }

  handleSentenceKeyUp = e => {

    this.shareField.current.value = this.makeShareURL(
      this.urlField.current.value,
      this.sentenceInput.current.value
    );
  }
  render() {

    return (
      <div className="Main">
        <h1>Mad Libs</h1>

        <div className="Main__share-shell">
          <label>Share URL:</label><input className="Main__share-field" readOnly ref={this.shareField} />
        </div>

        <div className="Main__field-shell">
          <input className="Main__url-field" type="text" ref={this.urlField} placeholder="Google Sheet URL" />
          <button 
            type="button" 
            className="Main__get-words-btn"
            onClick={this.handleGetWordsClick}
            disabled={this.state.parsingSheet}>
            Get Words
          </button>
        </div>

        <h2>Sentence Output</h2>

        <textarea className="Main__sentence-input" placeholder="The {adjective} {noun} {verb} the {adjective} {noun}" ref={this.sentenceInput} onKeyUp={this.handleSentenceKeyUp} />
        <button
          className="Main__generate-sentence"
          onClick={this.handleGenerateSentence}
        >
          Generate Sentence
        </button>

        <div className="Main__sentence">
          {store.getState().sentence}
        </div>

        <h2>Words</h2>

        <div className="Main__words">

          {this.outputWordLists()}
        </div>

        <div className="Main__instructions">
          <h2>Instructions</h2>

          <ol>
            <li>Create a Google Sheet</li>
            <li>Add as many columns as you want with the first row being the labels you'll use in your sentence (noun,verb,adjective,etc)</li>
            <li>Add as many words to each column as you want</li>
            <li>Set the sharing permissions on the sheet that everyone with a link can edit</li>
            <li>Paste the sheet's link into the <em>Google Sheet URL</em> field and click <em>Get Words</em></li>
            <li>If you did everything right, the word list will populate</li>
            <li>Write your sentence, marking words you want to randomize from their list with curly braces <strong>{`{}`}</strong>, ex: {`The {adjective} {noun} jumps over the {adjective} {noun}`}</li>
            <li>Click <em>Generate Sentence</em> to generate a sentence with random new words</li>
          </ol>

          <h3>Troubleshooting</h3>
          <ul>
            <li>
              <strong>Nothing's happening</strong><br />
              You probably forgot to hit <strong>get words</strong> or there's an issue with your Google Sheet
            </li>
            <li>
              <strong>One or more words aren't replacing</strong><br />
              Check your spelling in the sentence as well as in the sheet ex: {`{`}noun<strong>s</strong>{`}`} in the sentence, but noun in the sheet
            </li>
          </ul>
        </div>
        
      </div>
    );
  }
}

export default Main;
