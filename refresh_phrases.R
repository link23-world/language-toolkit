require(yaml)
require(jsonlite)

files = list.files(path = "phrases", "^[a-zA-Z].*\\.yml")
out = as.data.frame(t(vapply(files, function(f) {
  file = yaml::read_yaml(file.path("phrases", f))
}, vector("list", 9L))))
rownames(out) = NULL

if( !identical(colnames(out), c("name", "status", "definition", "related", "why_we_care", "alternatives", "context", "debate", "resources"))) {
  stop("yml fields mismatch")
}

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

jsonlite::write_json(
  x = out,
  path = file.path("phrases", "all_phrases.json"),
  pretty = TRUE
)

tmp_file <- file.path("phrases", "all.txt")

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
      file.path("tool", "src", "loadphrases.js"))

# remove txt save js
file.remove(tmp_file)
