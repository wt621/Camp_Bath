import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["menu"];

  toggle() {
    const currentDisplay =
      window.getComputedStyle(
        this.menuTarget
      ).display;

    if (currentDisplay === "none") {
      this.menuTarget.style.display = "block";
    } else {
      this.menuTarget.style.display = "none";
    }
  }
}
