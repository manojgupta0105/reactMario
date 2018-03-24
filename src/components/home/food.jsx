// Images
import foodImg from '../../images/mushroom.png';

/**
 * This Component will be responsible to handle the internal Components of the
 * HomePage section...
 */

export default class Food {

  constructor(props) {
    let self = this;
    this.props = props;
    this.food = new Image();
    this.food.src = foodImg;
    this.food.onload = function() {
      self.init();
    };
  }

  init = () => {
    this.foodWidth = this.food.width;
    this.foodHeight = this.food.height;
    this.foodWidthC = this.foodWidth/2;
    this.foodHeightC = this.foodHeight/2;
    console.log("Food: ",this.props.cell);
    let row = Math.floor(this.props.cell / this.props.cols);
    let col = this.props.cell % this.props.cols;
    // this.position, signifies the center of the Mario Image...
    this.position = {
      x: Math.floor(col * this.props.dx),
      y: Math.floor(row * this.props.dy)
    };
    this.position.x = this.position.x + (this.props.dx/2 - this.foodWidthC);
    this.position.y = this.position.y + (this.props.dy/2 - this.foodHeightC);
    this.draw(this.position.x, this.position.y);
  }

  draw = (x, y) => {
    this.props.ctx.drawImage(this.food, x, y);
  }

  render = (diffTime) => {
    if(!this.isEaten) {
      this.draw(this.position.x, this.position.y);
    }
  }

  hide = () => {
    this.props.ctx.clearRect(this.position.x, this.position.y, this.foodWidth, this.foodHeight);
    this.isEaten = true;
  }

}
