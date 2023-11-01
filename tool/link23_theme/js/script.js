// ---------
// Variables
// ---------
const version = "0.1.8";
const fullName = "Lost in Translation: Language Toolkit for Genomics Data Diversity";
const shortName = "Lost in Translation Toolkit";
const repo = "language-toolkit";
const zenodo = "10.5281/zenodo.10013320";

// ----------------
// Populate fields
// ----------------

$(function () {
  const today = new Date();
  const year = today.getFullYear();

  $(".fullname").text(fullName);
  $(".navbar-brand").text(shortName);
  $(".navbar-brand").attr("href", `/tool/index.html`);
  $(".btn-version").text("v" + version);
  $(".btn-version").attr("href", `https://github.com/link23-world/${repo}/blob/main/NEWS.md`);
  $(".repo").attr("href", `https://github.com/link23-world/${repo}`);
  $(".news").attr("href", `https://github.com/link23-world/${repo}/blob/main/NEWS.md`);
  $(".contributors").attr("href", `https://github.com/link23-world/${repo}#contributors`);
  $(".license").attr("href", `https://github.com/link23-world/${repo}/blob/main/LICENSE.md`);
  $(".issue").attr("href", `https://github.com/link23-world/${repo}/issues`);
  $(".discussion").attr("href", `https://github.com/link23-world/${repo}/discussions`);
  $(".citation").text(`The link23 Community. (${year}). ${fullName} (Version ${version}) [Computer software]. https://doi.org/${zenodo}.`);
});
