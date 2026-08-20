import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // A tiny timeout ensures React finishes loading the new page's HTML
    // BEFORE we tell the browser to jump to the top.
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" // This overrides your CSS smooth scrolling to prevent getting stuck
      });
    }, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;