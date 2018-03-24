import React from 'react';

import update from 'immutability-helper';
import Container from './container';

// Images
import keyboard from '../../images/arrowkeys.svg';

/**
 * This Component will be responsible to handle the internal Components of the
 * HomePage section...
 */

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = (props) => {
    return {
      gameOn: false
    }
  }

  submit = (e, data, ele) => {
    e.preventDefault();
    let rows = document.querySelector("#row_count");
    let cols = document.querySelector("#col_count");
    let rowCount = window.parseInt(rows.value);
    let colCount = window.parseInt(cols.value);
    if(rowCount && rowCount > 1){
      this.rowCount = rowCount;
    } else {
      rows.classList.remove("valid");
      rows.classList.add("invalid");
    }
    if(colCount && colCount > 1){
      this.colCount = colCount;
    } else {
      cols.classList.remove("valid");
      cols.classList.add("invalid");
    }

    if(this.rowCount && this.colCount) {
      this.setState(update(this.state, {
        gameOn: {$set: true}
      }))
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.state.gameOn;
  }

	render() {
    var container = null;
    if(this.state.gameOn) {
      container = <Container
        rows={this.rowCount}
        cols={this.colCount}
      />
    } else {
      container = (
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col s8 offset-s2">
                <div className="valign-wrapper">
                  <h3> !!! Enter Data to Start Game !!! </h3>
                  <form onSubmit={this.submit} className="row">
                    <div className="input-field col s12">
                      <input id="row_count" type="text" className="validate" name="row" />
                      <label htmlFor="row_count">Number of Rows</label>
                    </div>
                    <div className="input-field col s12">
                      <input id="col_count" type="text" className="validate" name="col" />
                      <label htmlFor="col_count">Number of Columns</label>
                    </div>
                    <button className="btn waves-effect waves-light col s12" type="submit" name="action">Start Game</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
		return (
			<div id="react-dom">
        {container}
			</div>
		);
	}
}
