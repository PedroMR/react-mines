import './story.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';
import Story from './Story';

class DialoguePanel extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const story = this.props.story;
        let text = ''; //Story.getLine(this.props.meta); //"Congratulations on completing your basic training."
        let prevText = '';
        if (story.queue.length > 0) {
            const last = story.queue.length-1;
            text = story.queue[last];
            prevText = story.queue[last-1];
        }
        //cursor={{hideWhenDone:true}}
        return <div className='dialoguePanel'>{prevText}
            <Typist avgTypingDelay={50} stdTypingDelay={0.1}  >{text}</Typist> 
            </div>;
    }
}


function mapStateToProps(state) {
    return {
        meta: state.meta,
        story: state.meta.story,
        current: state.meta.current,
    }
}

export default connect(mapStateToProps)(DialoguePanel);