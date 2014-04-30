/* From http://stackoverflow.com/questions/2901102/how-to-print-number-with-commas-as-thousands-separators-in-javascript */
(function() {
  var gData = null;
  var gSortBy = "count";

  $(document).ready(function() {
    $.getJSON("http://park-warden-production.herokuapp.com/api/referrers", function(data) {
      var iData = data.reduce(function(prev, curr) {
        if (!prev[curr.referrer]) {
          prev[curr.referrer] = 0;
        }
        prev[curr.referrer]++;
        return prev;
      }, {});

      gData = Object.keys(iData).map(function(k) {
        return { referrerid: k, count: iData[k] };
      });

      updateScores();
      setTimeout(splashScreen, 20000);
    });
  });

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function updateScores() {
    var table = $("#scores");
    table.empty();

    table.append("<tr><th id=\"referrerheader\">Referrer ID</th><th id=\"countheader\">Count</th></tr>");
    $("#referrerheader").bind("click", function() { gSortBy = "referrerid"; updateScores(); });
    $("#countheader").bind("click", function() { gSortBy = "count"; updateScores(); });

    var max_rid_len = 0;
    /* Sort our data */
    if (gSortBy == "count") {
      gData.sort(function(one, two) { return two.count - one.count; });
    } else if (gSortBy == "referrerid") {
      gData.sort(function(one, two) { return two.referrerid.localeCompare(one.referrerid); });
    }

    /* Figure out how big our fields should be */
    $.each(gData, function(index, value) {
      var referrerid = value.referrerid;
      if (referrerid.length > max_rid_len) {
          max_rid_len = referrerid.length;
      }
    });
    max_rid_len += 4;

    $.each(gData, function(index, value) {
      var count = numberWithCommas(value.count);
      var referrerid = value.referrerid;
      var row = "<tr><td class=\"referrerid\">" + referrerid;
      /* Pad with .... */
      for (var i=0; i<(max_rid_len - referrerid.length); ++i) {
          row += ".";
      }
      row += "</td><td class=\"count\">" + count;
      row += "</td></tr>";
      row = $(row);
      table.append(row);
    });
  }

  function splashScreen() {
    $("body").css("visibility", "hidden");
    $("html").addClass("splash");
    setTimeout(function() {
      $("html").removeClass("splash");
      $("body").css("visibility", "visible");
      setTimeout(splashScreen, 20000);
    }, 5000);
  }
})();
