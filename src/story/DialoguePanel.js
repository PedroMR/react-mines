import './story.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';

class DialoguePanel extends React.PureComponent {
    
    render() {
        const text = "Congratulations on completing your basic training."
        return <div className='dialoguePanel'>
            <Typist cursor={{hideWhenDone:true}}>{text}</Typist>
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