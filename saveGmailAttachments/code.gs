function saveGmailAttachments() {
  var filename = "Pattern Recognition Sheet - Class Work.csv";
  var ext = "csv";
  var isUnread = true;
  // Log the subject lines of your Inbox
  var threads = GmailApp.getInboxThreads();
  for (var i = 0; i < threads.length; i++) {
    var isMessageUnread = threads[i].isUnread();
    if(isMessageUnread != isUnread){
      continue;
    }
    var messages = threads[i].getMessages();
    var attachments  = [];
    for(var j = 0;j<messages.length;j++){
      var temp_attach = messages[j].getAttachments();
      if(temp_attach.length>0){
        for(var k =0;k<temp_attach.length;k++){
          if (temp_attach[k].getContentType() === "text/csv"){
            attachments.push(temp_attach[k]);
          }
        }
      }
    }

    for(var j=0 ; j<attachments.length ; j++){
      var attachment = attachments[j];
      var files = DriveApp.getFilesByName("gmail_csv");
      var sheet = null;
      if(!files.hasNext()){
        sheet = SpreadsheetApp.create("gmail_csv").getActiveSheet();
      }else{
        sheet = SpreadsheetApp.open(files.next()).getActiveSheet();
      }
      var csvData = Utilities.parseCsv(attachment.getDataAsString(), ",");

      // Remember to clear the content of the sheet before importing new data
      sheet.clearContents().clearFormats();
      sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
    }
  }
}
