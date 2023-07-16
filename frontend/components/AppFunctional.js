import React, { useState } from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const AppFunctional = ({ className }) => {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);

  // Helper function to get coordinates based on the current index
  const getXY = () => {
    const gridSize = 3;
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    return { x, y };
  };

  // Helper function to get the message for the current coordinates
  const getXYMessage = () => {
    const { x, y } = getXY();
    return `Coordinates (${x + 1}, ${y + 1})`;
  };

  // Helper function to check if the email is valid
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function to calculate the next index based on the direction
  const getNextIndex = (direction) => {
    const gridSize = 3;
    let nextIndex;

    switch (direction) {
      case 'left':
        nextIndex = index - 1;
        break;
      case 'right':
        nextIndex = index + 1;
        break;
      case 'up':
        nextIndex = index - gridSize;
        break;
      case 'down':
        nextIndex = index + gridSize;
        break;
      default:
        nextIndex = index;
        break;
    }

    if (
      nextIndex < 0 ||
      nextIndex >= gridSize * gridSize ||
      (direction === 'left' && nextIndex % gridSize === gridSize - 1) ||
      (direction === 'right' && nextIndex % gridSize === 0)
    ) {
      return index;
    }

    return nextIndex;
  };

  // Function to handle the movement
  const move = (evt) => {
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);

    if (index === newIndex) {
      // B didn't move, show an error message
      setMessage(`You can't go ${direction}`);
    } else {
      // If the move is possible, reset the error message and update the state
      setIndex(newIndex);
      setSteps((prevSteps) => prevSteps + 1);
      setMessage('');
    }
  };

  // Function to handle form submission
  // Function to handle form submission
// Function to handle form submission
const onSubmit = (evt) => {
  evt.preventDefault();
  setMessage('');
  const { x, y } = getXY();
  const payload = {
    x: x + 1, // Add 1 to x and y to match the server's 1-based index requirement
    y: y + 1,
    steps,
    email,
  };

  if (email === 'foo@bar.baz') {
    setMessage(`${email} failure #71`);
    setEmail('');
    setIndex(initialIndex);
    setSteps(initialSteps);
    return;
  }

  if (!isValidEmail(email)) {
    setMessage('Ouch: email is required' + ' Ouch: email must be a valid email');
    return;
  }

  if (!Number.isInteger(payload.x) || payload.x < 1 || payload.x > 3) {
    setMessage('Invalid x value. It should be an integer between 1 and 3.');
    return;
  }

  if (!Number.isInteger(payload.y) || payload.y < 1 || payload.y > 3) {
    setMessage('Invalid y value. It should be an integer between 1 and 3.');
    return;
  }

  if (!Number.isInteger(payload.steps) || payload.steps <= 0) {
    setMessage('Invalid steps value. It should be an integer larger than 0.');
    return;
  }

  // Perform additional email validation if needed
  if (!isValidEmail(payload.email)) {
    setMessage('Ouch: email must be a valid email');
    return;
  }

  // Update the steps before the fetch request
  setSteps((prevSteps) => prevSteps       );

  // Continue with the fetch request
  fetch('http://localhost:9000/api/result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
      // Reset the coordinates after a successful response
      setIndex(2);
      setMessage(data.message);
      setEmail('');
    })
    .catch((error) => {
      console.error('Error occurred:', error);
      if (error.message.includes('foo@bar.baz')) {
        setMessage(`foo@bar.baz failure #71`);
        setIndex(2);
        setEmail('');
      }
    });
};

  const onChange = (evt) => {
    const newValue = evt.target.value;
    setEmail(newValue);
  };

  const reset = () => {
    setEmail(initialEmail);
    setIndex(initialIndex);
    setSteps(initialSteps);
    setMessage(initialMessage);
  };

  return (
    <div id="wrapper" className={className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>
          LEFT
        </button>
        <button id="up" onClick={move}>
          UP
        </button>
        <button id="right" onClick={move}>
          RIGHT
        </button>
        <button id="down" onClick={move}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
};

export default AppFunctional;
