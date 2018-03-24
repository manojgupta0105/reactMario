import React from 'react';

import update from 'immutability-helper';
import Mario from './mario';
import Food from './food';

// Images
import keyboard from '../../images/arrowkeys.svg';
import grass from '../../images/grass_txt.jpg';

/**
 * This Component will be responsible to handle the internal Components of the
 * Mario Container...
 */

export default class Container extends React.Component {

  constructor(props) {
    super(props);
    this.dx = 50;
    this.dy = 50;
    this.marioSize = 24;
    this.usedCells = new Set();
    this.containerStyle = {
      backgroundImage: 'url(' + grass + ')',
    };

    document.addEventListener('keydown', this.keyPressed);
    this.state = this.getInitialState(props);
    this.isAnimating = false;

    this.score = 0;
    this.startTime = 0;
    this.totalSteps = 0;
    this.oldCell = -1;
  }

  getInitialState = (props) => {
    return {
      cells: props.rows * props.cols,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.gameEnded;
  }

  componentDidMount(prevProps, prevState) {
    this.ctx = this.canvas.getContext('2d');
    this.initGame(this.props);
    console.log(this.ctx);
  }

  componentWillReceiveProps(newProps) {
    // Each time a key is pressed, Props will change, thus a canvasRender should be called here

  }

  keyPressed = (event) => {
    event.preventDefault();
    if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39
      || event.keyCode === 40) {
        if(!this.isAnimating) {
          // Game Starts...
          this.isAnimating = true;
          this.oldTime = performance.now();
          this.startTime = this.oldTime;
          window.requestAnimationFrame(this.renderContainer);
        }

        this.keyCode = event.keyCode;
    } else {
      this.isAnimating = false;
    }
  }

	render() {
    let content = null;
    if(this.state.gameEnded) {
      content = (
        <div className="wrapper">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col s8 offset-s2">
                  <div className="valign-wrapper">
                    <div className="card blue-grey darken-1">
                      <div className="card-content white-text">
                        <span className="card-title"><h4>!!! Superb !!!</h4></span>
                        <hr />
                        <p> Game Over... </p>
                        <hr style={{borderStyle: "dotted"}}/>

                        <p> <i> Here are your Results: </i> </p>
                        <p><b>Score</b>: {this.score}</p>
                        <p><b>Total Time Taken</b>: {Math.floor(this.totalTime / 1000)} secs</p>
                        <p><b>Total Steps Took</b>: {this.totalSteps}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      content = (
        <div className="wrapper">
          <div className="instructions">
            <h5 className="center-align"> Game Instructions </h5>
            <img src={keyboard} alt="Keys" className="arrow-keys-img" />
            <h6 className="center-align">  Press any arrow key to START!!! </h6>
          </div>
          <div className="mario-base">
            <canvas ref={(gameContainer) => { this.canvas = gameContainer; } }
             width={this.dx * this.props.cols + "px"} height={this.dy * this.props.rows + "px"}>
            </canvas>
          </div>
        </div>
    )
    }
		return (
			<div id="game-container" style={this.containerStyle}>
        {content}
			</div>
		);
	}

  initGame = (props) => {
    let self = this;
    this.drawBaseGrid(props.rows, props.cols);
    this.foods = {};
    let total = Math.floor((this.props.rows + this.props.cols) / 2);
    while ( this.usedCells.size < total ) {
      this.usedCells.add(Math.floor((Math.random() * 1000)) % (props.rows * props.cols));
    }

    // Create Food in Random Positions...
    this.usedCells.forEach( function(data) {
      self.foods[data] = new Food({ ...props,
        dx: self.dx,
        dy: self.dy,
        cell: data,
        ctx: self.ctx
      });
    });

    this.mario = new Mario({...props,
      dx: this.dx,
      dy: this.dy,
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height
    });

  }

  renderContainer = (timestamp) => {
    let diffTime = timestamp - this.oldTime > 0 ? timestamp - this.oldTime : 0;
    // Clear the Canvas...
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // RE-render all the components, on new Frame...
    this.drawBaseGrid(this.props.rows, this.props.cols);
    for(var key in this.foods) {
      this.foods[key].render(diffTime);
    }
    this.mario.render(diffTime, this.keyCode);
    this.collide(this.mario, this.foods);
    if(this.isAnimating) {
      this.oldTime = timestamp;
      window.requestAnimationFrame(this.renderContainer);
    }
  }

  drawBaseGrid = (rows, cols) => {
    let cells = rows * cols;
    let iRow = 0, iCol=0;
    let index = 0;

    while (index < cells) {
      this.ctx.strokeRect(iCol * this.dx, iRow * this.dy, this.dx, this.dy);
      index++;
      iCol = index % cols;
      iRow = Math.floor(index / cols);
    }

  }

  collide = (mario, foods) => {
    let xyMin = this.getCellFromPixels(mario.position.x, mario.position.y);
    let xyMax = this.getCellFromPixels(mario.position.x + mario.marioWidth, mario.position.y + mario.marioHeight);
    let xyMid = this.getCellFromPixels(mario.position.x + mario.marioWidthC, mario.position.y + mario.marioHeightC);
    let collidedFood = foods[xyMin];
    collidedFood = collidedFood ? collidedFood : foods[xyMax];

    if (this.oldCell !== -1 && this.oldCell != xyMid) {
      this.totalSteps += 1;
    }

    if(collidedFood && !collidedFood.isEaten) {
      collidedFood.hide();
      // Also Increase the Score;;;;;
      this.score += 1;
      this.usedCells.delete(collidedFood.props.cell);
      // If all foods are eaten then, stop the loop, end the game, show the score...
      if (this.usedCells.size <= 0) {
        this.isAnimating = false;
        document.removeEventListener("keydown", this.keyPressed);
        this.totalTime = performance.now() - this.startTime;
        console.log("Score: ", this.score, ", Total Time: ", this.totalTime, ", Total Steps: ", this.totalSteps);
        this.setState(update(this.state, {
          gameEnded: {$set: true}
        }))
      }
    }

    this.oldCell = xyMid;
  }

  getCellFromPixels = (pixelX, pixelY) => {
    let correctedX = pixelX > this.canvasWidth ? this.canvasWidth : pixelX < 0 ? 0 : pixelX;
    let correctedY = pixelY > this.canvasHeight ? this.canvasHeight : pixelY < 0 ? 0 : pixelY;
    return (
      (Math.floor(correctedY / this.dy) * this.props.cols) + Math.floor(correctedX/this.dx)
    );
  }

}
