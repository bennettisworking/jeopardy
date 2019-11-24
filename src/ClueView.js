import React, { Component } from "react";

class ClueView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text : props.clue.question,
      dd : props.clue.dailydouble
    }
    console.log(this.state.dd);
    this.props.clue.questionview = true;
  }
  showClue() { 
    let toggletext = this.props.clue.questionview ? this.props.clue.question:this.props.clue.answer;
    this.setState({text: toggletext});
  }
  toggleQA(){
    this.props.clue.questionview = !this.props.clue.questionview;
    this.showClue();
  }
  render(){
    let dd = this.state.dd ? ' dailydouble' : '';
    return <div class={"clue-view" + dd}><div class="clue-view--text">{this.state.text}</div>
    <button class="btn clue-view__btn--toggle" onClick={()=>{this.toggleQA()}}>Show/Hide Answer</button>
    <button class="btn clue-view__btn--close" onClick={()=>{this.props.unsetClue()}}>X</button></div>;
  }
}

export default ClueView;