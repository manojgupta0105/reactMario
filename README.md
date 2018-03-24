# Payjo React App for Grid based Mario Game

**Problem Statement:**

Build a simple Mario Game in React. Detailed description is in the following steps.

1. The game will run in a m x n grid. Ask the user for number of rows and columns in the grid before the game starts.
2. Place food in random (m + n)/2 cells (food image - https://res.cloudinary.com/payjo-in/image/upload/c_scale,w_24/v1502452864/mushroom-512_f9ma5t.png)
3. Place the Mario in a random location (image: http://res.cloudinary.com/payjo-in/image/upload/c_scale,w_24/v1502452976/1200x630bb_vokqee.jpg)
4. Once the user presses any of the arrow keys Mario should start moving in that direction and will never stop. If Mario hits a wall he will bounce back. 
5. His direction needs to be changed once a different arrow key input is received.
6. Once he touches a cell that has food, the food is disappeared. 
7. Once user makes Mario eat all the food the game is over and show the user the time taken and number steps Mario has taken to eat all the food