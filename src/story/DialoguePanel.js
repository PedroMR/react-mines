import './story.css';
import React from 'react';
import { connect } from 'react-redux';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';
import Sound from '../sound';

class DialoguePanel extends React.PureComponent {
    componentDidMount() {
        this.scrollToBottom();
    }

    onTypingDone() {
        this.scrollToBottom();
    }

    onLineTyped(line, lineIndex) {
        // console.log(lineIndex, line);
        this.scrollToBottom();
    }

    onCharacterTyped(character, charIndex) {
        const volume = Math.random()*0.3 + 0.2;
        if (Math.random() < 0.4)
            Sound.playSound(Sound.KEY_TYPE, volume);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight
    }

    render() {
        const story = this.props.story;
        const lastIndex = story.queue.length-1;
        const lineElements = story.queue.map((e, index) => {
            const mainText = e;
            let wrapper = lastIndex === index ? <Typist key={e}
                onCharacterTyped={(c, ci)=>this.onCharacterTyped(c, ci)}
                onLineTyped={(l, i)=>this.onLineTyped(l, i)}
                onTypingDone={() => this.onTypingDone()}
                avgTypingDelay={50} stdTypingDelay={25}
                >{mainText}</Typist> : <p key={e}>{mainText}</p>;
            return wrapper;
        });

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