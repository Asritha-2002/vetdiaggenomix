import { useEffect } from "react";

const FloatingBackground = () => {
  useEffect(() => {
    if (document.getElementById("floating-bg")) return;

    const container = document.createElement("div");
    container.id = "floating-bg";

    container.className =
      "fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden";

    container.innerHTML = `
      <div class="floating-circle w-96 h-96 top-10 left-10"></div>
      <div class="floating-circle w-64 h-64 top-1/2 right-20"></div>
      <div class="floating-circle w-48 h-48 bottom-20 left-1/3"></div>
    `;

    document.body.appendChild(container);

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      const el = document.getElementById("floating-bg");
      if (el) el.remove();
    };
  }, []);

  return null;
};

export default FloatingBackground;