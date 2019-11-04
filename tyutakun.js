function postUrl() {
  var obj = SpreadsheetApp.openById("スプレッドシートのID");
  var scheduleSheet = obj.getSheetByName("日程");
  var today = new Moment.moment();
  var yesterday = today.subtract(1, "days"),
  var sheetdate = scheduleSheet.getRange("D3:D12").getValues();
  var message = "";
  var text = "";

  for (i = 0; i < sheetdate.length; i++) {
    var dateFormated = Utilities.formatDate(new Date(sheetdate[i]), "JST", "yyyy年M月d日");
    var deadend = new Moment.moment(dateFormated, "YYYY年M月D日");
    var dif = yesterday.diff(deadend, "days");
    //Logger.log(dif);
    if (dif == 0) {
      getData(i);
    }
  }

  function getData() {
    var cell = String("A" + Number(i + 3));
    //Logger.log(cell);  //A12
    var sheetNum = scheduleSheet.getRange(cell).getValue();
    var sheet = obj.getSheetByName(sheetNum);
    var ss_url = obj.getUrl(),
      sh_id = sheet.getSheetId(),
      kadaiUrl = ss_url + "#gid=" + sh_id;
    //Logger.log(kadaiUrl);
    var data = sheet.getRange("J3:N23").getValues();
    //Logger.log(data);
    fetch(getValuesFromSheet, data, kadaiUrl);
  }

  function getValuesFromSheet(data, link) {
    message = data.map(function(array) {
      text = array.pop() + " : " + array.shift() + "\n";
      return text.replace(/- : #N\/A/g, "");
    });
    //Logger.log(message);
    return message;
  }

  function fetch(getValuesFromSheet, data, link) {
    var message = getValuesFromSheet(data, link);
    //Logger.log(message);

    var payload = {
      text: String(
        "<!channel>\n:bug: 課題が提出されたよー！！Checkしてね:wink::bug::bug:\n今回の課題URL :point_right:" + link + "\n" + message
      ).replace(/,/g, ""),
      username: "チュー太くん", //botの名前
      channel: "チュー太くん" //投稿するチャンネル名
    };

    // Slackに送信
    var options = {
        method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload) // jsの値をJSON文字列に変換
    };

    var url = "WebhookのURL";
    UrlFetchApp.fetch(url, options);
  }
}

function checkRemindar() {
  var payload = {
    text:
      "<!channel>\n:smiling_imp: 課題のチェック終わってますか？！もうすぐ授業です！！！:man-running::woman-running:\n今回の課題URL :point_up:\n",
    username: "チュー太くん", //botの名前
    channel: "チュー太くん", //投稿するチャンネル名
    icon_emoji: ":smiling_imp:"
  };
  // Slackに送信
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload) // jsの値をJSON文字列に変換
  };
  var url = "WebhookのURL";
  UrlFetchApp.fetch(url, options);
}

function commentRemindar() {
  var payload = {
    text:
      "<!channel>\n:dizzy_face: コメントの記入終わってますか？！締め切りは日曜日中です:disappointed:\n今回の課題URL :point_up::point_up:\n",
    username: "チュー太くん", //botの名前
    channel: "チュー太くん", //投稿するチャンネル名
    icon_emoji: ":dizzy_face:"
  };
  // Slackに送信
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload) // jsの値をJSON文字列に変換
  };
    var url = "WebhookのURL";
  UrlFetchApp.fetch(url, options);
}
