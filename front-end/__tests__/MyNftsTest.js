import * as React from "react";
import { Router } from "react-router";
import { App } from "../src/App";

import { rtlRender, screen, userEvent } from "@testing-library/react";

// pretend this is in another file, and we:
// import {LocationDisplay} from './location-display'
const render = (ui, { route = "/nfts/all" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return rtlRender(ui, { wrapper: Router });
};

test("full app rendering/navigating", () => {
  render(<App />);
  //   expect(screen.getByText(/you are home/i)).toBeInTheDocument();

  userEvent.click(screen.getByText(/about/i));

  expect(screen.getByText(/you are on the about page/i)).toBeInTheDocument();
});
