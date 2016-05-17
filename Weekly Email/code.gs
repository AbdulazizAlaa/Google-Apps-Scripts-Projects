/**
 * Serves HTML of the application for HTTP GET requests.
 * If folderId is provided as a URL parameter, the web app will list
 * the contents of that folder (if permissions allow). Otherwise
 * the web app will list the contents of the root folder.
 *
 * @param {Object} e event parameter that can contain information
 *     about any URL parameters provided.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');

  // Retrieve and process any URL parameters, as necessary.
  if (e.parameter.folderId) {
    template.folderId = e.parameter.folderId;
  } else {
    template.folderId = 'root';
  }

  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
      .setTitle('Weekly Report Web App')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function remove_trigger(cell){

  var filename = "Weekly_report_schedule";
  var files = DriveApp.searchFiles(" title contains '"+filename+"' ")
  var schedule;

  if(files.hasNext()){
    schedule = SpreadsheetApp.open(files.next());
  }else{
    return;
  }

  var row = schedule.getLastRow();
  var col = schedule.getLastColumn();
  var range = schedule.getActiveSheet().getRange(1, 1, row+2, 9);
  var cell_value;

  var docName;

  range.getCell(cell.row, cell.col).clear();

  for(var j=cell.row+1 ; j<=row+1 ; j++){
    cell_value = range.getCell(j, cell.col).getValue();
    //if(cell_value === '')
      //return;
    range.getCell(j-1, cell.col).clear();
    range.getCell(j-1, cell.col).setValue(cell_value);

  }

}

function get_triggers(){
  var filename = "Weekly_report_schedule";
  var files = DriveApp.searchFiles(" title contains '"+filename+"' ")
  var schedule;

  if(files.hasNext()){
    schedule = SpreadsheetApp.open(files.next());
  }else{
    schedule = SpreadsheetApp.create(filename);
  }

  var row = schedule.getLastRow();
  var col = schedule.getLastColumn();
  var range = schedule.getActiveSheet().getRange(1, 1, row+2, 9);
  var triggers = [];
  var weekday;
  var cell;

  for(var i=2 ; i<=col ; i++){
    switch(i){
      case 2:
        weekday = 'Sunday';
        break;
      case 3:
        weekday = 'Monday';
        break;
      case 4:
        weekday = 'Tuesday';
        break;
      case 5:
        weekday = 'Wednesday';
        break;
      case 6:
        weekday = 'Thursday';
        break;
      case 7:
        weekday = 'Friday';
        break;
      case 8:
        weekday = 'Saturday';
        break;
    }
    var docName;
    for(var j=2 ; j<=row ; j++){
      cell = range.getCell(j, i).getValue();
      if(cell === '')
        continue;
      var items = cell.split(',');
      if(items[2] === 'sheet'){
        try{
          docName = SpreadsheetApp.openByUrl(items[1]).getName();
        }catch(e){
          docName = "Error opening File";
        }
      }else if(items[2] === 'slide'){
        var slideID = items[1].split('/')[5];
        try{
          docName = DriveApp.getFileById(slideID).getName();
        }catch(e){
          docName = "Error opening File";
        }
      }

      triggers.push({name:docName, url:items[1], email:items[0], type:items[2], day: weekday, cell: {row: j, col: i}});
    }
  }

  return triggers;
}

function auth(){
  var service = getService();
  if(!service.hasAccess()){
    var authUrl = service.getAuthorizationUrl();
    return authUrl;
  }else{
    return "You already has access!!";
  }
}

function add_trigger(email, link, day, type){

  var weekday = ScriptApp.WeekDay.SATURDAY;
  var filename = "Weekly_report_schedule";
  var files = DriveApp.searchFiles(" title contains '"+filename+"' ")
  var schedule;
  var makeTrigger = false;

  if(files.hasNext()){
    schedule = SpreadsheetApp.open(files.next());
  }else{
    schedule = SpreadsheetApp.create(filename);
  }
  var row = schedule.getLastRow();
  var col = schedule.getLastColumn();
  var range = schedule.getActiveSheet().getRange(1, 1, row+2, 9);
  if(range.getCell(1, 1).getValue() !== "Days")
    range.getCell(1, 1).setValue("Days");

  var cRow;
  var cCol;
  var item = email+","+link+","+type;

  switch(day){
    case 'sun':
      cCol = 2;
      for(var i=2 ; i<=row+1 ; i++){
        if(range.getCell(i, cCol).getValue() === ""){
          cRow = i;
          break;
        }
      }
      if(range.getCell(1, cCol).getValue() === "Sunday"){
        range.getCell(cRow, cCol).setValue(item);
      }else{
        range.getCell(1, cCol).setValue("Sunday");
        range.getCell(cRow, cCol).setValue(item);
        makeTrigger = true;
        weekday = ScriptApp.WeekDay.SUNDAY;
      }
      break;
    case 'mon':
      cCol = 3;
      for(var i=2 ; i<=row+1 ; i++){
        if(range.getCell(i, cCol).getValue() === ""){
          cRow = i;
          break;
        }
      }
      if(range.getCell(1, cCol).getValue() === "Monday"){
        range.getCell(cRow, cCol).setValue(item);
      }else{
        range.getCell(1, cCol).setValue("Monday");
        range.getCell(cRow, cCol).setValue(item);
        makeTrigger = true;
        weekday = ScriptApp.WeekDay.MONDAY;
      }
      break;
    case 'tue':
      cCol = 4;
      for(var i=2 ; i<=row+1 ; i++){
        if(range.getCell(i, cCol).getValue() === ""){
          cRow = i;
          break;
        }
      }
      if(range.getCell(1, cCol).getValue() === "Tuesday"){
        range.getCell(cRow, cCol).setValue(item);
      }else{
        range.getCell(1, cCol).setValue("Tuesday");
        range.getCell(cRow, cCol).setValue(item);
        makeTrigger = true;
        weekday = ScriptApp.WeekDay.TUESDAY;
      }
      break;
    case 'wed':
      cCol = 5;
      for(var i=2 ; i<=row+1 ; i++){
        if(range.getCell(i, cCol).getValue() === ""){
          cRow = i;
          break;
        }
      }
      if(range.getCell(1, cCol).getValue() === "Wednesday"){
        range.getCell(cRow, cCol).setValue(item);
      }else{
        range.getCell(1, cCol).setValue("Wednesday");
        range.getCell(cRow, cCol).setValue(item);
        makeTrigger = true;
        weekday = ScriptApp.WeekDay.WEDNESDAY;
      }
      break;
    case 'thr':
      cCol = 6;
      for(var i=2 ; i<=row+1 ; i++){
        if(range.getCell(i, cCol).getValue() === ""){
          cRow = i;
          break;
        }
      }
      if(range.getCell(1, cCol).getValue() === "Thursday"){
        range.getCell(cRow, cCol).setValue(item);
      }else{
        range.getCell(1, cCol).setValue("Thursday");
        range.getCell(cRow, cCol).setValue(item);
        makeTrigger = true;
        weekday = ScriptApp.WeekDay.THURSDAY;
      }
      break;
    case 'fri':
      cCol = 7;
      for(var i=2 ; i<=row+1 ; i++){
        if(range.getCell(i, cCol).getValue() === ""){
          cRow = i;
          break;
        }
      }
      if(range.getCell(1, cCol).getValue() === "Friday"){
        range.getCell(cRow, cCol).setValue(item);
      }else{
        range.getCell(1, cCol).setValue("Friday");
        range.getCell(cRow, cCol).setValue(item);
        makeTrigger = true;
        weekday = ScriptApp.WeekDay.FRIDAY;
      }
      break;
    case 'sat':
      cCol = 8;
      for(var i=2 ; i<=row+1 ; i++){
        if(range.getCell(i, cCol).getValue()===''){
          cRow = i;
          break;
        }
      }
      if(range.getCell(1, cCol).getValue() === "Saturday"){
        range.getCell(cRow, cCol).setValue(item);
      }else{
        range.getCell(1, cCol).setValue("Saturday");
        range.getCell(cRow, cCol).setValue(item);
        makeTrigger = true;
        weekday = ScriptApp.WeekDay.SATURDAY;
      }
      break;
  }

  if(makeTrigger){
    ScriptApp.newTrigger("task_manager")
    .timeBased()
    .onWeekDay(weekday)
    .atHour(12)
    .nearMinute(40)
    .create();
  }
}

function task_manager(){

  var date = new Date();
  var dayOfWeek = date.getDay();
  var col = dayOfWeek+2;

  var filename = "Weekly_report_schedule";
  var files = DriveApp.searchFiles(" title contains '"+filename+"' ")
  var schedule;

  if(files.hasNext()){
    schedule = SpreadsheetApp.open(files.next());
  }else{
    schedule = SpreadsheetApp.create(filename);
  }
  var row = schedule.getLastRow();
  var range = schedule.getActiveSheet().getRange(1, 1, row+2, 9);
  var cell;
  var items;

  for(var i=2 ; i<=row ; i++){
    cell = range.getCell(i, col).getValue();
    items = cell.split(",");

    if(items[2] === "sheet"){
      task_send_sheet(items[0], items[1]);
    }else if(items[2] === "slide"){
      task_send_slide(items[0], items[1]);
    }
  }
}

function task_send_slide(email, link){
  var service = getService();

  var slideID = link.split('/')[5];

  var date = getCurrentDate();
  var fileName = date.file+"_";
  var subject = date.subject+" Report";
  var content = "Here is your Weekly report.";

  var AUTH_TOKEN = "anonymous";
  AUTH_TOKEN = service.getAccessToken();

  var url_pptx = "https://docs.google.com/presentation/d/"+slideID+"/export/pptx?id="+slideID;
  var url_pdf = "https://docs.google.com/presentation/d/"+slideID+"/export/pdf?id="+slideID;
  var auth = "AuthSub token=\"" + AUTH_TOKEN + "\"";
  var res_pptx = UrlFetchApp.fetch(url_pptx, {headers: {Authorization: auth}});
  var res_pdf = UrlFetchApp.fetch(url_pdf, {headers: {Authorization: auth}});

  var slide_name = "";
  try{
    slide_name = DriveApp.getFileById(slideID).getName();
  }catch(e){
    slide_name = "Error opening File";
  }
  fileName += slide_name;

  var attachments = [
    {fileName:fileName+".pdf", content: res_pdf.getContent(),mimeType:MimeType.PDF},
    {fileName:fileName+".pptx", content: res_pptx.getContent(),mimeType:MimeType.GOOGLE_SLIDES}
    //{fileName:fileName+".pptx", content: res_pptx.getContent(),mimeType:"application/vnd.openxmlformats-officedocument.presentationml.presentation"}
  ];

  MailApp.sendEmail(email, subject, content, {attachments: attachments});

}


function task_send_sheet(email, link){
  var service = getService();

  var ss = SpreadsheetApp.openByUrl(link);

  var date = getCurrentDate();
  var fileName = date.file+"_"+ss.getName();
  var sheets = ss.getSheets();
  var subject = date.subject+" Report";
  var content = "Here is your Weekly report.";

  var AUTH_TOKEN = "anonymous";
  AUTH_TOKEN = service.getAccessToken();

  var ssID = ss.getId();
  var url_xlsx = "https://docs.google.com/spreadsheets/d/"+ssID+"/export?format=xlsx&id="+ssID;
  var url_pdf = "https://docs.google.com/spreadsheets/d/"+ssID+"/export?format=pdf&id="+ssID;

  var auth = "AuthSub token=\"" + AUTH_TOKEN + "\"";
  var res_xlsx = UrlFetchApp.fetch(url_xlsx, {headers: {Authorization: auth}});
  var res_pdf = UrlFetchApp.fetch(url_pdf, {headers: {Authorization: auth}});
  var attachments = [
    {fileName:fileName+".xlsx", content: res_xlsx.getContent(), mimeType:MimeType.MICROSOFT_EXCEL},
    {fileName:fileName+".pdf", content: res_pdf.getContent(), mimeType:MimeType.PDF}
  ];

  MailApp.sendEmail(email, subject, content, {attachments: attachments});

}

function getService(){

  return OAuth2.createService("auth-service")

  .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
  .setTokenUrl('https://accounts.google.com/o/oauth2/token')

  .setClientId("945477984863-uv9j645a9vra59phsjs3di05qdvh67f3.apps.googleusercontent.com")
  .setClientSecret("c05PhwHNmUDxDO2pEXwsuRW-")

  .setPropertyStore(PropertiesService.getUserProperties())

  .setCallbackFunction('authCallback')

  .setScope("https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets")

  .setParam('login_hint', Session.getActiveUser().getEmail())

  .setParam('access_type', 'offline');

}

function authCallback(req){
  var service = getService();
  var isAuthorized = service.handleCallback(req);
  if(isAuthorized){
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

function getCurrentDate(){
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear()+"";

  var obj = {subject: year+"_"+month+"_"+day};

  year = year.substring(2);

  if(day < 10)
    day = "0"+day;

  if(month < 10)
    month = "0"+month;

  obj.file = year+""+month+""+day;

  return obj;
}
