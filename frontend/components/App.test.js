import AppFunctional from "./AppFunctional";
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event'

test('sanity', () => {
  expect(true).toBe(true)
})

test('renders without errors', async () => {
  render(<AppFunctional />);
});

test("UP button renders in document", async () => {
  render(<AppFunctional />);

  const upButton = screen.queryByText('UP');
  expect(upButton).toBeInTheDocument();
});

test("DOWN button renders in document", async () => {
  render(<AppFunctional />);

  const downButton = screen.queryByText('DOWN');

  expect(downButton).toBeInTheDocument();
});

test("RIGHT button renders in document", async () => {
  render(<AppFunctional />);

  const rightButton = screen.queryByText('RIGHT');

  expect(rightButton).toBeInTheDocument();
});

test("LEFT button renders in document", async () => {
  render(<AppFunctional />);

  const leftButton = screen.queryByText('LEFT');

  expect(leftButton).toBeInTheDocument();
});
