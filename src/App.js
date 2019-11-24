import React, { Component } from "react";
import ClueView from './ClueView.js';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      categories: [],
      clues : []
    }
    this.categoryOffset = 0;
    this.columnCount = 5;
    this.clueCount = 5;
    this.dailydouble = [Math.floor(Math.random() * this.columnCount), Math.floor(Math.random() * this.clueCount)];
    this.unsetClue = this.unsetClue.bind(this);
    this.setCategoryLimit = this.setCategoryLimit.bind(this);
    this.setClueLimit = this.setClueLimit.bind(this);
  }

  componentDidMount() {
    this.fetchAPI();
  }

  fetchAPI(){
    fetch('http://jservice.io/api/categories?count=' + this.columnCount + '&offset=' + this.categoryOffset)
      .then(response => response.json())
      .then(data => {
        this.setState({ categories: data });
        data.forEach((category, ind) => {
          fetch('http://jservice.io/api/clues?category=' + category.id)
          .then(response => response.json())
          .then(data => {
            let temp = this.state.clues;
            temp[ind] = data.slice(0, this.clueCount);
            this.setState({clues: temp});
            });
          })
      })
  }

  setCategoryLimit(e) {
    e.preventDefault();
    this.columnCount = e.target.value;
    this.resetGame();
    }

  setClueLimit(e) {
    e.preventDefault();
    this.clueCount = e.target.value;
    this.resetGame();
    }

  resetGame(){
    this.setState({
      categories: [],
      clues : []
    });
    this.dailydouble = [Math.floor(Math.random() * this.columnCount), Math.floor(Math.random() * this.clueCount)];
    this.categoryOffset += this.columnCount;
    this.fetchAPI();
  }

  setClue(cat,clu){
    let currentclue = this.state.clues[cat][clu];
    currentclue.opened = true;
    this.setState({showClue: currentclue})
  }

  unsetClue(){
    this.setState({showClue: 0})
  }

  createBoard(){
    const categories= this.state.categories;//.categories;
    const clues = this.state.clues;
    let board = [];
    categories.forEach((category, catindex) => {
      let cluecolumn = [];
      if(clues.length >0) {
        if(catindex in clues){
          clues[catindex].forEach((clue, clueindex) => {
            let opened = clue.opened ? ' opened' : '';
            if (this.dailydouble[0] === catindex && this.dailydouble[1] === clueindex) {
              clue.dailydouble = true;
            }
            cluecolumn.push(<div key={clue.id} className={"clue" + opened} onClick={()=>{this.setClue(catindex, clueindex)}}>{clue.value}</div>);
          });
          board.push(<div className="board__column" key={catindex}><div className="row"><li className="category item--category" 
          key={category.id}><span>{category.title}</span></li>{cluecolumn}</div></div>);
        }
      }
    });
    return(board);
  }

  render() {
    let isClueView;
    isClueView = this.state.showClue ? <ClueView clue={this.state.showClue} unsetClue={this.unsetClue}/> : ''
    return (
      <div className="jeopardy-app">
        <div className="board">
          {isClueView}
          {this.createBoard()}
        </div>
        <button className="board__reset btn" onClick={()=>{this.resetGame()}}>reset</button>
        <div className="board__dropdowns">
          <label>Number of Questions </label>
          <select onChange={this.setCategoryLimit}>
            <option value="4">Four</option>
            <option value="5">Five</option>
            <option value="6">Six</option>
          </select>
          <label>Number of Categories </label>
          <select onChange={this.setClueLimit}>
            <option value="4">Four</option>
            <option value="5">Five</option>
            <option value="6">Six</option>
          </select>
        </div>
      </div>
    );
  }
}

export default App;
