// Images
import marioImg from '../../images/mario.jpg';

/**
 * This Component will be responsible to handle the internal Components of the
 * HomePage section...
 */

export default class Mario {

  constructor(props) {
    let self = this;
    this.props = props;
    this.mario = new Image();
    this.mario.src = marioImg;
    this.mario.onload = function() {
      self.init();
    };
    this.isBounceAnimating = false;
  }

  init = () => {
    this.marioWidth = this.mario.width;
    this.marioHeight = this.mario.height;
    this.marioWidthC = this.marioWidth/2;
    this.marioHeightC = this.marioHeight/2;
    let randRow = Math.floor(this.props.rows * Math.random());
    let randCol = Math.floor(this.props.cols * Math.random());

    // this.position, signifies the center of the Mario Image...
    this.position = {
      x: Math.floor(randCol * this.props.dx),
      y: Math.floor(randRow * this.props.dy)
    };
    this.position.x = this.position.x + (this.props.dx/2 - this.marioWidthC);
    this.position.y = this.position.y + (this.props.dy/2 - this.marioHeightC);
    this.draw(this.position.x, this.position.y);
  }

  bounce = (timestamp) => {
    let diffTime = timestamp - this.oldTime > 0 ? timestamp - this.oldTime : 0;

    if (this.shouldBounce(this.bounceKey)() && this.isBounceAnimating) {
      // Clear the Mario Canvas...
      this.props.ctx.clearRect(this.position.x, this.position.y,
        this.marioWidth, this.marioHeight);
      this.render(diffTime, this.bounceKey, 1);
      this.oldTime = timestamp;
      window.requestAnimationFrame(this.bounce);
    } else {
      this.isBounceAnimating = false;
    }
  }

  /**
   * Render will be automatically called on each Animation frame, so we need to
   * update the Mario's position on each Render, respective to Keyboard's key
   * pressed
   */
  render = (diffTime, keyCode, speedCode) => {
    let move = this.getDirection(keyCode);

    let speed = speedCode ? this.getSpeed(speedCode) : this.getSpeed(0);
    move(diffTime/speed);
  }

  getSpeed = (i) => {
    switch(i){
      case -1: // very slow;
        return 16;
      case 0: // defalut speed;
        return 8;
      case 1: // very fast;
        return 4;
    }
  }

  /**
   * Draws the Mario from Center...
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @return {[type]}   [description]
   */
  draw = (x, y) => {
    this.props.ctx.drawImage(this.mario, x, y);
  }

  moveRight = (pixels) => {
    this.position.x = this.position.x + pixels;
    if (this.position.x + this.marioWidth > this.props.canvasWidth) {
      // Using, this.props.canvasWidth-2, as 1px border is already present...
      // Which would also get cleared, if I clear the Mario Canvas...
      this.startBounce(37);
    }
    this.draw(this.position.x, this.position.y);
  }

  moveLeft = (pixels) => {
    this.position.x = this.position.x - pixels;
    if (this.position.x < 0) {
      this.startBounce(39);
    }
    this.draw(this.position.x, this.position.y);
  }

  moveTop = (pixels) => {
    this.position.y = this.position.y - pixels;
    if (this.position.y < 0) {
      this.startBounce(40);
    }
    this.draw(this.position.x, this.position.y);
  }

  moveBottom = (pixels) => {
    this.position.y = this.position.y + pixels;
    if (this.position.y + this.marioHeight > this.props.canvasHeight) {
      this.startBounce(38);
    }
    this.draw(this.position.x, this.position.y);
  }

  startBounce = (keyCode) => {
    if(!this.isBounceAnimating) {
      this.isBounceAnimating = true;
      this.oldTime = performance.now();
      this.bounceKey = keyCode;
      window.requestAnimationFrame(this.bounce);
    }
  }

  shouldBounceLeft = () => {
    return !(this.position.x + this.marioWidth < this.props.canvasWidth - (this.props.dx/2 - this.marioWidthC));
  }

  shouldBounceRight = () => {
    return !(this.position.x > 0 + (this.props.dx/2 - this.marioWidthC));
  }

  shouldBounceTop = () => {
    return !(this.position.y + this.marioHeight < this.props.canvasHeight - (this.props.dy/2 - this.marioHeightC));
  }

  shouldBounceBottom = () => {
    return !(this.position.y > 0 + (this.props.dy/2 - this.marioWidthC));
  }

  getDirection = (keyCode) => {
    switch (keyCode) {
      case 37:
        return this.moveLeft;
      case 38:
        return this.moveTop;
      case 39:
        return this.moveRight;
      case 40:
        return this.moveBottom;
    }
  }

  shouldBounce = (keyCode) => {
    switch (keyCode) {
      case 37:
        return this.shouldBounceLeft;
      case 38:
        return this.shouldBounceTop;
      case 39:
        return this.shouldBounceRight;
      case 40:
        return this.shouldBounceBottom;
    }
  }
}
