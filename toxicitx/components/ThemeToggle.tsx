"use client";

export default function ThemeToggle() {
  function toggle() {
    const cur = document.documentElement.getAttribute("data-theme");
    const dark = cur
      ? cur === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
  }
  return (
    <button
      className="iconbtn"
      onClick={toggle}
      title="Basculer le thème"
      aria-label="Basculer le thème"
    >
      ◐
    </button>
  );
}
