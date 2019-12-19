//Project's Property
var SLACK_FOOK_URL = PropertiesService.getScriptProperties().getProperty("SLACK_FOOK_URL");
var SEET_ID = PropertiesService.getScriptProperties().getProperty("SEET_ID");

function getDueDates() {
  var obj = SpreadsheetApp.openById(SEET_ID),
    scheduleSheet = obj.getSheetByName("日程"),
    sheetdate = scheduleSheet.getRange("D3:D12").getValues(),
    dueDate = [];

  for (i = 0; i < sheetdate.length; i++) {
    var dateFormated = Utilities.formatDate(new Date(sheetdate[i]), "JST", "yyyy年M月d日");
    dueDate.push(dateFormated);
  }
  Logger.log("[getDueDates]");
  Logger.log(dueDate);
  return dueDate;
}


function calcDiffDays() {
  var dueDates = getDueDates(),
    difDays = [],
    today = new Moment.moment(),
    yesterday = today.subtract(1, "days");
  Logger.log("[calcDiffDays]");
  for (i = 0; i < dueDates.length; i++) {
    var dueDate = new Moment.moment(dueDates[i], "YYYY年M月D日");
    //var dif = yesterday.diff(dueDate, "days");
    var dif = today.diff(dueDate, "days");
    difDays.push(dif);
  }
  return difDays;
}


function postUrl() {
  var obj = SpreadsheetApp.openById(SEET_ID),
    scheduleSheet = obj.getSheetByName("日程"),
    diffDays = calcDiffDays();
  Logger.log("postURL:" + diffDays);
  for (i = 0; i < diffDays.length; i++) {
    if (diffDays[i] == 0) {
      getData(i);
    }
  }

  function getData() {
    var cell = String("A" + Number(i + 3));
    Logger.log(cell);
    var sheetNum = "0" + Number(scheduleSheet.getRange(cell).getValue());
    sheetNum = sheetNum.slice(-2);
    Logger.log(sheetNum);
    var sheet = obj.getSheetByName(sheetNum);
    var ss_url = obj.getUrl(),
      sh_id = sheet.getSheetId(),
      kadaiUrl = ss_url + "#gid=" + sh_id;
    //Logger.log(kadaiUrl);
    var data = sheet.getRange("J3:N12").getValues();
    Logger.log(data);
    fetch(getValuesFromSheet, data, kadaiUrl);
  }

  function getValuesFromSheet(data, link) {
    message = data.map(function (array) {
      text = array.pop() + " : " + array.shift() + "\n";
      return text.replace(/- : #N\/A/g, "");
    });
    //Logger.log(message);
    return message;
  }

  function fetch(getValuesFromSheet, data, link) {
    var message = getValuesFromSheet(data, link);
    Logger.log(message);

    var payload = {
      "text": String("<!channel>\n:bug: 課題が提出されたよー！！Checkしてね:wink::bug::bug:\n今回の課題URL :point_right:" + link + "\n" + message).replace(/,/g, ""),
      "username": "チュー太くん",  //botの名前
      "channel": "チュー太くんテスト運用中",   //投稿するチャンネル名
    };

    // Slackに送信
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload), // jsの値をJSON文字列に変換
    };
    UrlFetchApp.fetch(SLACK_FOOK_URL, options);
  }
}

function checkRemindar() {
  var diffDays = calcDiffDays();
  Logger.log("checkRemindar:" + diffDays);
  for (i = 0; i < diffDays.length; i++) {
    if (diffDays[i] == 1) {
      var payload = {
        "text": "<!channel>\n:smiling_imp: 課題のチェック終わってますか？！もうすぐ授業です！！！:man-running::woman-running:\n今回の課題URL :point_up:\n",
        "username": "チュー太くん",      //botの名前
        "channel": "チュー太くんテスト運用中",   //投稿するチャンネル名
        "icon_emoji": ":smiling_imp:",
      };
      // Slackに送信
      var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload), // jsの値をJSON文字列に変換
      };
      var url = SLACK_FOOK_URL;
      UrlFetchApp.fetch(SLACK_FOOK_URL, options);
    }
  }
}

function commentRemindar() {
  var diffDays = calcDiffDays();
  Logger.log("commentRemindar:" + diffDays);
  for (i = 0; i < diffDays.length; i++) {
    if (diffDays[i] == 2) {
      var payload = {
        "text": "<!channel>\n:dizzy_face: コメントの記入終わってますか？！締め切りは日曜日中です:disappointed:\n今回の課題URL :point_up::point_up:\n",
        "username": "チュー太くん",      //botの名前
        "channel": "チュー太くんテスト運用中",   //投稿するチャンネル名
        "icon_emoji": ":dizzy_face:",
      };
      // Slackに送信
      var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload), // jsの値をJSON文字列に変換
      };
      var url = SLACK_FOOK_URL;
      UrlFetchApp.fetch(SLACK_FOOK_URL, options);
    }
  }
}