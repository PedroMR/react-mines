import React from 'react';
import { connect } from 'react-redux';
import * as tools from '../Tools';
import * as types from '../types';
import {claimCredits, changeScreen}  from '../meta/MetaActions';

class ScoreTally extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            totalScore: 0,
            scoreRows: undefined,
        }

        const results = props.results;

        const scoreTypes = [
            {name: "Mines found", method: tools.scoreForMinesFound, param: [results.nCorrectFlags], mult: tools.scoreMultiplierForMinesFound},
            {name: "Mines detonated", method: tools.scoreForMinesDetonated, param: [results.nDetonated], mult: tools.scoreMultiplierForMinesDetonated},
            {name: "No damage bonus", addMult: 0.5},
            {name: "Score Multiplier", addMult: tools.scoreMultiplier(props.score) - 1},
        ];

        let totalMultiplier = 1;

        this.state.scoreRows = scoreTypes.map(item => {
            const pointsWorth = item.method ? item.method(props.score, ...item.param) : '';
            this.state.totalScore += pointsWorth;
            const amount = item.param ? item.param[0] : '';
            const ratio = item.mult ? item.mult(props.score) : '';
            const addMult = item.addMult;
            if (addMult) {
                totalMultiplier += addMult;
                const multString = '+'+(addMult * 100).toFixed(0) + "%";
                return <tr key={item.name}><td className="scoreTallyNames">{item.name}</td><td></td><td></td><td colSpan='3' className="scoreTallyPoints">{multString}</td></tr>;
            } else {
                return <tr key={item.name}><td className="scoreTallyNames">{item.name}</td><td>{ratio}</td><td>x{amount}</td><td className="scoreTallyPoints">{pointsWorth}</td></tr>;
            }
        })

        this.state.totalScore = Math.round(this.state.totalScore * tools.scoreMultiplier(this.props.score));

        this.claimCredits = this.claimCredits.bind(this);
    }

    claimCredits() {
        if (this.state.totalScore > 0 && !this.props.claimedRewards) {
            this.props.dispatch(claimCredits(this.state.totalScore));
        }
        this.props.dispatch(changeScreen(types.SCREEN_MAIN));
    }

    render() {

        const claimButtonTitle = this.state.totalScore > 0 ? "Claim Credits" : "Move On";
        const claimButton = <button name="claim" disabled={this.props.claimedRewards} onClick={this.claimCredits}>{claimButtonTitle}</button>;

        return <div className="scoreTally"><table className="scoreTally"><thead></thead><tbody>
            {/* <tr><th className="scoreTallyNames"/><th/><th/><th className="scoreTallyPoints">$</th></tr> */}
                    {this.state.scoreRows}
                    <tr className="scoreTallyTotal"><td className="scoreTallyNames scoreTallyTotal">Total</td><td/><td/><td className="scoreTallyTotal scoreTallyPoints">${this.state.totalScore}</td></tr>
                    <tr><td colSpan='4' className="scoreTallyClaim">{claimButton}</td></tr>
                    </tbody>
                </table></div>;
    }
}

function mapStateToProps(state) {
    return { 
        score: state.meta.score,
        gameOver: state.mines.gameOver,
        claimedRewards: state.mines.claimedRewards,
    }
}

export default connect(mapStateToProps)(ScoreTally);
