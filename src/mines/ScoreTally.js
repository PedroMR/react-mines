import React from 'react';
import { connect } from 'react-redux';
import * as tools from '../Tools';
import * as types from '../types';
import {claimCredits, changeScreen, debugToggleFeature}  from '../meta/MetaActions';
import ReactGA from 'react-ga';
import Features from '../meta/Features';
import Items from '../meta/Items';
import Sound from '../sound';
import { Modal, Button } from 'react-bootstrap';

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
            {name: "No damage bonus", addMult: 1.5, gotIt: results.noDetonations},
            {name: "Score Multiplier", addMult: Items.getBestMultiplier(props.items), gotIt: true},
        ];

        let totalMultiplier = 1;

        let scoreRows = scoreTypes.map(item => {
            const pointsWorth = item.method ? item.method(props.score, ...item.param) : '';
            this.state.totalScore += pointsWorth;
            const amount = item.param ? item.param[0] : '';
            const ratio = item.mult ? item.mult(props.score) : '';
            const addMult = item.addMult;
            if (addMult) {
                if (addMult === 1) return null;
                let multString = '+'+((addMult-1) * 100).toFixed(0) + "%";
                if (item.gotIt)
                    totalMultiplier += (addMult-1);
                else
                    multString = 'X'; //TODO replace with forbidden icon
                return <tr key={item.name}><td className="scoreTallyNames">{item.name}</td><td></td><td></td><td colSpan='3' className="scoreTallyPoints">{multString}</td></tr>;
            } else {
                return <tr key={item.name}><td className="scoreTallyNames">{item.name}</td><td>{ratio}</td><td>x{amount}</td><td className="scoreTallyPoints">{tools.formatPrice(pointsWorth)}</td></tr>;
            }
        })
        this.state.totalScore = Math.round(this.state.totalScore * totalMultiplier);
        const totalScore = this.state.totalScore;
        this.state.scoreRows = scoreRows.concat(
            <tr key='total' className="scoreTallyTotal"><td className="scoreTallyNames scoreTallyTotal">Total</td><td/><td/><td className="scoreTallyTotal scoreTallyPoints">{tools.formatPrice(totalScore)}</td></tr>
        );

        this.claimCredits = this.claimCredits.bind(this);
    }

    claimCredits() {
        ReactGA.event({
            category: 'game',
            action: 'claim-credits',
            value: this.state.totalScore
        });
        if (this.state.totalScore > 0 && !this.props.claimedRewards) {
            this.props.dispatch(claimCredits(this.state.totalScore));
            if (!Features.hasFeature(types.FEATURE_SHOW_SHOP))
                this.props.dispatch(debugToggleFeature(types.FEATURE_SHOW_SHOP, true));
        }
        this.props.dispatch(changeScreen(types.SCREEN_MAIN));
        Sound.playSound(this.state.totalScore > 0 ? Sound.CLAIM_CREDITS : Sound.CLAIM_NO_CREDITS);
    }

    render() {
        const totalScore = this.state.totalScore;
        const gettingRewards = totalScore > 0;

        const claimButtonTitle = gettingRewards ? "Claim Credits" : "Move On";
        const scoreTally = <div className="scoreTally"><table className="scoreTally"><thead></thead><tbody>
        {/* <tr><th className="scoreTallyNames"/><th/><th/><th className="scoreTallyPoints">$</th></tr> */}
                {this.state.scoreRows}
                
                </tbody>
            </table></div>;

        return <div className="static-modal"><Modal.Dialog>
                <Modal.Header><Modal.Title>GAME OVER</Modal.Title></Modal.Header>
                <Modal.Body>{scoreTally}</Modal.Body>
                <Modal.Footer>
                    <Button bsStyle={gettingRewards ? "primary" : 'default'} disabled={this.props.claimedRewards} onClick={this.claimCredits}>{claimButtonTitle}</Button>
                </Modal.Footer>
            </Modal.Dialog></div>;
    }
}

function mapStateToProps(state) {
    return { 
        score: state.meta.score,
        gameOver: state.mines.gameOver,
        claimedRewards: state.mines.claimedRewards,
        items: state.meta.items,
    }
}

export default connect(mapStateToProps)(ScoreTally);
