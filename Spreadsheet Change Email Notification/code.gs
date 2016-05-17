function main() {
  files = DriveApp.getFilesByName("Temp sheet");
  
  if(files.hasNext()){
    f = files.next();
    ss = SpreadsheetApp.open(f);
    ScriptApp.newTrigger("emailNotification")
             .forSpreadsheet(ss)
             .onChange()
             .create();
    Logger.log(f);
  }
}


function emailNotification(){
  Logger.log("send email"); 
  MailApp.sendEmail({
     to: "abdulazizalaa@ymail.com",
     subject: "Spreadsheet edited",
     htmlBody: "spreadsheet was edited"
   });
}
