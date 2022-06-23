import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole( 'textbox', { name: /Add New Item/i});
  const inputDate = screen.getByRole( 'textbox', { name: /Due Date/i});
  const element = screen.getByRole( 'button', { name: /Add/i});
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2022"}});
  fireEvent.click(element);
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2022"}});
  fireEvent.click(element);
  const check = screen.getAllByText(new RegExp(/History Test/i));
  expect(check.length).toBe(1);
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByRole( 'textbox', { name: /Due Date/i});
  const element = screen.getByRole( 'button', { name: /Add/i});
  fireEvent.change(inputDate, { target: { value: "05/30/2022"}});
  fireEvent.click(element);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole( 'textbox', { name: /Add New Item/i});
  const element = screen.getByRole( 'button', { name: /Add/i});
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.click(element);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole( 'textbox', { name: /Add New Item/i});
  const inputDate = screen.getByRole( 'textbox', { name: /Due Date/i});
  const element = screen.getByRole( 'button', { name: /Add/i});
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2022"}});
  fireEvent.click(element);
  const taskCheckedOff = screen.getByRole('checkbox');
  fireEvent.click(taskCheckedOff);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole( 'textbox', { name: /Add New Item/i});
  const inputDate = screen.getByRole( 'textbox', { name: /Due Date/i});
  const element = screen.getByRole( 'button', { name: /Add/i});
  fireEvent.change(inputTask, { target: { value: "History Test A"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2023"}});
  fireEvent.click(element);
  fireEvent.change(inputTask, { target: { value: "History Test B"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2020"}});
  fireEvent.click(element);
  const ongoingEvent= screen.getByTestId(/History Test A/i).style.background;
  const pastEvent = screen.getByTestId(/History Test B/i).style.background;
  expect( pastEvent === ongoingEvent ).toBe(false);
 });
