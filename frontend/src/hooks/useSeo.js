import { useEffect } from "react";

const setNamed = (name, content) => {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setProp = (prop, content) => {
  if (!content) return;
  let el = document.querySelector(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href) => {
  if (!href) return;
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export function useSeo({ title, description, image, url, type = "website", jsonLd } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    setNamed("description", description);
    setProp("og:title", title);
    setProp("og:description", description);
    setProp("og:type", type);
    setProp("og:image", image);
    setProp("og:url", url);
    setProp("og:site_name", "ViceHub");
    setNamed("twitter:card", "summary_large_image");
    setNamed("twitter:title", title);
    setNamed("twitter:description", description);
    setNamed("twitter:image", image);
    setCanonical(url);

    const id = "ld-json-article";
    let script = document.getElementById(id);
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = id;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
    return () => {
      const s = document.getElementById(id);
      if (s) s.remove();
    };
  }, [title, description, image, url, type, JSON.stringify(jsonLd)]);
}
