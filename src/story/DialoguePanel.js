import './story.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';
import Story from './Story';

class DialoguePanel extends React.PureComponent {
    
    render() {
        const text = Story.getLine(this.props.meta); //"Congratulations on completing your basic training."
        //cursor={{hideWhenDone:true}}
        return <div className='dialoguePanel'>
            <Typist avgTypingDelay='50' stdTypingDelay='0.1' >{text}</Typist> 
            </div>;
    }
}


function mapStateToProps(state) {
    return {
        meta: state.meta,
        current: state.meta.current,
    }
}

export default connect(mapStateToProps)(DialoguePanel);