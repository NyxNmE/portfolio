console.log("IT'S ALIVE!");

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");

const pages = [
  { url: "",            title: "Home" },
  { url: "projects/",   title: "Projects" },
  { url: "contact/",    title: "Contact" },
  { url: "resume/",     title: "Resume" },
  { url: "https://github.com/NyxNmE", title: "GitHub" }
];

const nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let a = document.createElement("a");

  let finalURL = p.url;
  if (!ARE_WE_HOME && !finalURL.startsWith("http")) {
    finalURL = "../" + finalURL;
  }

  a.href = finalURL;
  a.textContent = p.title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}