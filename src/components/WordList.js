import React from 'react';
import PropTypes from 'prop-types'

class WordList extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {};
    }

    static propTypes = {};
    static defaultProps = {}

    render()
    {
        return (
            <dl className="WordList">
                <dt className="WordList__label">{this.props.label}</dt>
                <dd>
                    <ul>
                        {this.props.words.map((word,i) => {
                                            return <li key={i}>{word}</li>

                                                    })}
                    </ul>
                </dd>
            </dl>);
    }
}

export default WordList;