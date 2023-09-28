// $(document).ready( function () {
//     $('#toolkitTable').DataTable();
// });

$(".phrase-card").css("background-color", "gray");
const phrases = loadPhrases();

d3.select("#toolkitTable").select("tbody")
  .data(phrases)
  .enter()
  .append("tr");

var table = new Tabulator("#toolkitTable", {
  data: phrases,
  maxHeight: "43vh",
  layout: "fitDataStretch",
  headerFilter:"input",
  columns: [
    { title: "Name", field: "name" },
    {
      title: "Status", field: "status", formatter: function (cell, formatterParams) {
        return (getStatus(cell.getValue()[0], false, cell, false));
      }
    }
  ]});

table.on("rowClick", function(e, row){
  printPhrase(row.getData());
});

printPhrase = function (phrase) {

  d3.selectAll(".definition").remove();
  if (phrase === undefined) {
    $("#phrase_name")
      .append("<h2 class='definition phrase-title'>Phrase not found</h2>");
    $(".phrase-card").css("background-color", "gray");
    return null;
  }

  for (key in phrase) {
    let content = phrase[key];
    if (key == "status") {
      content = [getStatus(content[0])];
    }
    $("#phrase_" + key).css("display", "inline");

    if (key == "name") {
        var field = d3.selectAll("#phrase_name").selectAll("div")
          .data(content)
          .enter()
          .append('h2').attr("class", "definition phrase-title")
          .html(function (d) { return (d); });
        continue;
    } else if (content.length == 1) {
      if (content[0] == "") {
        $("#phrase_" + key).css("display", "none");
        continue;
      }
      var field = d3.selectAll("#phrase_" + key).selectAll("div")
        .data(content)
        .enter()
        .append('p').attr("class", "definition");
    } else {
      $("#phrase_" + key).append("<ul class = 'definition'></ul>")
      var field = d3.selectAll("#phrase_" + key).selectAll("ul").selectAll("div")
        .data(content)
        .enter()
        .append('li')
        .attr("class", "phrase-li")
        .append('p')
    }

    if (key == "related") {
        field.html(function (d) { return d; })
          .on("click", function (d) {
            const related = phrases.filter(x => x.name == this.innerText)[0]
            if (related !== undefined) {
              printPhrase(related);
            }
          })
          .attr("class", function (d) {
            const related = phrases.filter(x => x.name == d)[0]
            if (related !== undefined) {
              switch (getStatus(related.status[0], false, null, false)) {
                case "Generally accepted":
                  return ("definition related green");
                case "Be aware of context":
                  return ("definition related amber");
                case "Avoid this term":
                  return ("definition related red");
                default:
                  return ("definition related gray");
              }
            } else {
              return ("definition");
            }
          });
    } else if (key == "resources") {
      let converter = new showdown.Converter({simplifiedAutoLink: true});
        field.html(function (d) {
            return converter.makeHtml(d);
          });
      } else {
      let converter = new showdown.Converter({ simpleLineBreaks: true });
        field.html(function (d) {
          return converter.makeHtml(d);
        });
      }
  }
}

getStatus = function (col, longForm = true, cell = null, colPhrase = true) {
  switch (col) {
    case "green":
      if (cell !== null) {
        cell.getElement().style.backgroundColor = "#3cb371";
      }
      colPhrase && $(".phrase-card").css("background-color", "#3cb371");
      return longForm ? "✅ Generally accepted for use in the context defined" :
        "Generally accepted";
    case "amber":
      if (cell !== null) {
        cell.getElement().style.backgroundColor = "#ffa500";
      }
      colPhrase && $(".phrase-card").css("background-color", "#ffa500");
      return longForm ? "⚠️ Be aware that there are multiple definitions based on different contexts" :
        "Be aware of context";
    case "red":
      if (cell !== null) {
        cell.getElement().style.backgroundColor = "#ff0547";
        cell.getElement().style.color = "white";
      }
      colPhrase && $(".phrase-card").css("background-color", "#ff0547");
      return longForm ? "❌ This term should be avoided and there are better alternatives" :
        "Avoid this term";
    case "grey":
      if (cell !== null) {
        cell.getElement().style.backgroundColor = "gray";
      }
      colPhrase && $(".phrase-card").css("background-color", "gray");
      return longForm ? "❓ This entry is unfinished and is still pending classification" :
        "Pending classification";
    default:
      break;
  }
}

$(function () {
  $('select').selectpicker();
    var filtCond = $("#filter-cond");
    var filtStatus = $("#filter-status");

    //Trigger setFilter function with correct parameters
  function updateFilter() {
    var valCond = filtCond.val();
    var valStatus = filtStatus.val();
    table.setFilter(customFilter, {cond: valCond, status : valStatus});
    }

  //Update filters on value change
  filtCond.on("change", updateFilter);
  filtStatus.on("change", updateFilter);

  function customFilter(data, filterParams){
    if (filterParams.cond === "in") {
      return filterParams.status.includes(data.status[0]);
    } else {
      return !filterParams.status.includes(data.status[0]);
    }
  }

  //Clear filters on "Clear Filters" button click
  $("#filter-clear").on("click", function () {
    $('.selectpicker').selectpicker('deselectAll')

    table.clearFilter();
  });
});
