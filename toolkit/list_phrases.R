# install.packages("here")
# install.packages("yaml")
# install.packages("jsonlite")

files = list.files(path = here::here("phrases"), "^[a-zA-Z].*\\.yml")
out = as.data.frame(t(vapply(files, function(f) {
  file = yaml::read_yaml(here::here("phrases", f))
}, vector("list", 9L))))
rownames(out) = NULL
# clean up status
out$status = lapply(out$status, function(x) {
  if (grepl("(?i)(orange|amber)", x)) {
    "amber"
  } else if (grepl("(?i)(green)", x)) {
    "green"
  } else if (grepl("(?i)(red)", x)) {
    "red"
  } else if (grepl("(?i)(grey|Gray)", x)) {
    "grey"
  } else {
    stop(sprintf("Status value '%s' unknown.", x))
  }
})

tmp_file <- here::here("phrases/all.txt")

jsonlite::write_json(
  x = out,
  path = tmp_file,
  pretty = TRUE
)

# add function
x <- readLines(tmp_file)
x[2] <- "return [{"
x[1] <- "loadPhrases = function () {"
x[length(x) + 1] <- "}"
# fix unicode expressions and save
write(gsub("\\\\", "\\", x, fixed = TRUE),
      here::here("toolkit/src/phrases.js"))

# remove txt save js
file.remove(tmp_file)
