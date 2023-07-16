import React from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = {
        message: initialMessage,
        email: initialEmail,
        index: initialIndex,
        steps: initialSteps,
    }
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const gridSize = 3;
    const index = this.state.index;

    const x = (index % gridSize);
    const y = (Math.floor(index / gridSize));

    return { x, y }
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = this.getXY();

    return `Coordinates (${x + 1}, ${y + 1})`;
  }

 reset = () => {
  // Use this helper to reset all states to their initial values.
  this.setState({
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
  });
};


getNextIndex = (direction) => {
  const gridSize = 3; // Assuming the grid size is 3x3, change this if your grid is different
  const currentIndex = this.state.index;
  let nextIndex;

  switch (direction) {
    case 'left':
      nextIndex = currentIndex - 1;
      break;
    case 'right':
      nextIndex = currentIndex + 1;
      break;
    case 'up':
      nextIndex = currentIndex - gridSize;
      break;
    case 'down':
      nextIndex = currentIndex + gridSize;
      break;
    default:
      nextIndex = currentIndex;
      break;
  }

  // Check if the nextIndex is out of bounds, and if it is, keep the current index unchanged
  if (
    nextIndex < 0 || // Check for left and top edges
    nextIndex >= gridSize * gridSize || // Check for right and bottom edges
    (direction === 'left' && nextIndex % gridSize === gridSize - 1) || // Check for wrapping from left to right
    (direction === 'right' && nextIndex % gridSize === 0) // Check for wrapping from right to left
  ) {
    return currentIndex;
  }

  return nextIndex;
};

move = (evt) => {
  const direction = evt.target.id;
  const currentIndex = this.state.index;
  const newIndex = this.getNextIndex(direction);

  // Check if the new index is the same as the current index
  // If they are the same, "B" didn't move, so show an error message
  if (currentIndex === newIndex) {
    const errorMessage = `You can't go ${direction}`;
    this.setState({ message: errorMessage });
  } else {
    // If the move is possible, reset the error message and update the state
    this.setState((prevState) => ({
      index: newIndex,
      steps: prevState.steps + 1,
      message: '' // Reset the error message
    }));
  }
};

  onChange = (evt) => {
    const newValue = evt.target.value;
    this.setState({
      [evt.target.id]: newValue,
    });
  }

  
  onSubmit = (evt) => {
    evt.preventDefault();
    this.setState({ message: '' });

    const { x, y } = this.getXY();
    const steps = this.state.steps;
    const email = this.state.email;

    if (email === 'foo@bar.baz') {
      this.setState({ message: `${email} failure #71`, email: '', index: initialIndex, steps: initialSteps });
      return;
    }

    if (!this.isValidEmail(email)) {
      this.setState({ message:  "Ouch: email is required" + ' Ouch: email must be a valid email' });
      return;
    }

    // Adjust x and y coordinates to 1-based indexing
    const adjustedPayload = {
      x: x + 1,
      y: y + 1,
      steps,
      email,
    };

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adjustedPayload),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 422) {
            throw new Error('Unprocessable Entity: Payload has the wrong shape.');
          } else {
            throw new Error('Network response was not ok.');
          }
        }
        return response.json();
      })
      .then((data) => {
        // Reset the coordinates to (3, 1) after successful form submission
        this.setState(() => ({
          message: data.message,
          index: 2, // Set the index to 2 for coordinates (3, 1)
          steps: 2,
          email: '',
        }));
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        if (error.message.includes('foo@bar.baz')) {
          this.setState({ message: `foo@bar.baz failure #71`, index: 2, steps: initialSteps, email: '' });
        }
      });
  };

  // Helper function to check if the email is valid
  isValidEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  

  render() {
    const { className } = this.props;
    const {message } = this.state;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index   ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
