import './story.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';
import Story from './Story';
import * as Scroll from 'react-scroll';

class DialoguePanel extends React.PureComponent {

    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.scrollToBottom();
    }

    onTypingDone() {
        this.scrollToBottom();
    }

    onLineTyped(line, lineIndex) {
        console.log(lineIndex, line);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight
    }

    render() {
        const story = this.props.story;
        let text = ''; 
        let prevText = '';

        const lastIndex = story.queue.length-1;
        const lineElements = story.queue.map((e, index) => {
            const mainText = e;
            let wrapper = lastIndex === index ? <Typist onLineTyped={()=>this.onLineTyped()} onTypingDone={() => this.onTypingDone()}>{mainText}</Typist> : mainText;
            return <li key={e}>{wrapper}</li>;
            // return <Scroll.Element key={e}>{wrapper}</Scroll.Element>;
        });

        //cursor={{hideWhenDone:true}}
        return <div className='dialoguePanel' ref={elem => this.container = elem}>
                {lineElements}
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