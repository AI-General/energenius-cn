"use client";
import { useEffect } from "react";

function useRemoveBodyStyle() {
  useEffect(() => {
    const removeBodyStyle = () => {
      if (document.body.hasAttribute("style")) {
        document.body.removeAttribute("style");
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          removeBodyStyle();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Initial check
    removeBodyStyle();

    // Cleanup
    return () => observer.disconnect();
  }, []);
}

export default useRemoveBodyStyle;
