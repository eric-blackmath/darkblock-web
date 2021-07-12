import { Link } from "react-router-dom";

export function keepUserLoggedIn(address) {
  localStorage.setItem("accountAddress", address);
}

export function logOutUser() {
  localStorage.removeItem("accountAddress");
}
