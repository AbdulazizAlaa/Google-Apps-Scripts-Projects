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
      .setTitle('Web App Window Title')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function add_dumb_data(){
  scriptProp = PropertiesService.getScriptProperties();
  files = ["0B7X2LLMp6gDTcV9BbGRUTnhVdzQ", "0B7X2LLMp6gDTejF4UF9jT0g3aDQ", "0B7X2LLMp6gDTaE5NdlhNMHk3TWM", "0B7X2LLMp6gDTOW5iSERVT0FBRGM", "0B7X2LLMp6gDTdUdqYzBUajNXd1E", "0B7X2LLMp6gDTRDlCclFNSE9wc1U", "0B7X2LLMp6gDTc1Qxa2VwX1VkZmc", "0B7X2LLMp6gDTZkJrc1hRUkZjTDQ", "5.0"];
  data = {};
  for(i=0 ; i<files.length ; i++){
    data[i+""] = files[i];
    Logger.log(data[i+""]);
  }
  scriptProp.setProperties(data);
}

function delete_data(){
  scriptProp = PropertiesService.getScriptProperties();
  target = 192;
  length = scriptProp.getProperty("count");
  Logger.log(length);
  for(var i=length ; i>=target ; i--){
     scriptProp.deleteProperty(""+i);
     length--;
     Utilities.sleep(1000);
  }
  scriptProp.setProperty("count", length);
  Logger.log(scriptProp.getProperty("count"));
}

function temp(){
  scriptProp = PropertiesService.getScriptProperties();

  var files = getfoldernames("Circle-of-Care Images");
Logger.log(files[99]);
  //  var count = 0;
//  for(var i=0; i<files.length ; i++){
//    for(var j=0; j<files.length ; j++){
//      if(i!=j && files[i] == files[j]){
//        count++;
//      }
//    }
//  }
//  Logger.log(count);
  //  doOCR(files, 0, 10, []);
}

function save_properties(files){
  scriptProp = PropertiesService.getScriptProperties();
  count = files.length;
  data = {};
  for(i=0 ; i<count ; i++){
    data[i+""] = files[i];
    Logger.log(data[i+""]);
  }
  data["count"] = count;
  scriptProp.setProperties(data);
}

function load_properties(){
  scriptProp = PropertiesService.getScriptProperties();
  prop = scriptProp.getProperties();
  if(scriptProp.getProperty("count") === null)
    return {count: undefined, files: undefined};
  count = parseInt(scriptProp.getProperty("count"));
  files = [];
  for(p in prop){
    files.push(scriptProp.getProperty(p));
    Utilities.sleep(100);
  }
  return {count: count, files: files};
}

function empty_property(){
  scriptProp = PropertiesService.getScriptProperties();
//  scriptProp.deleteProperty("5");
//  scriptProp.deleteAllProperties();
  scriptProp.setProperty("count", 4);
  return "DONE";
}

function empty_properties(){
  scriptProp = PropertiesService.getScriptProperties();
  scriptProp.deleteAllProperties();
  return "DONE";
}

function getfoldernames(foldername){
  scriptProp = PropertiesService.getScriptProperties();
  data = load_properties();
  if(data.count !== undefined){
    count = data.count;
    files = data.files;
    Logger.log(count);
    return files;
  }

  files = [];
  mainfolder = DriveApp.getFoldersByName(foldername);
  while(mainfolder.hasNext()){
    folders = mainfolder.next();
    if(!folders.getFolders().hasNext()){
      folderfiles = folders.getFiles();
      while(folderfiles.hasNext()){
        file = folderfiles.next();
        files.push(file.getId());
      }
    }else{
      folders = folders.getFolders();
      while(folders.hasNext()){
        folder = folders.next();
        folderfiles = folder.getFiles();
        while(folderfiles.hasNext()){
          file = folderfiles.next();
          files.push(file.getId());
        }
      }
    }

  }
  save_properties(files);
  return files;
}

function doOCR(id, i, length, imagedetails) {
  var image = DriveApp.getFileById(id[i]);
  var file = {
    title: image.getName(),
    mimeType: 'image/png'
  };

  // OCR is supported for PDF and image formats
  file = Drive.Files.insert(file, image.getBlob(), {ocr: true});

  doc = DocumentApp.openById(file.id);

  scriptProp = PropertiesService.getScriptProperties();
  scriptProp.deleteProperty(i+"");
  scriptProp.setProperty("count", scriptProp.getProperty("count")-1)

  data = {text: doc.getBody().getText(), name: image.getName(), imageId:id[i] , id: id, i: i-=1, length: length, image: imagedetails};

  Drive.Files.remove(file.id);

  add_data_sheet("OCR Images Text", data);
  Utilities.sleep(1000);
  return data;
}

function rename_files(dest){

  destfolder = DriveApp.getFoldersByName(dest);
  files = "";
  if(destfolder.hasNext())
    destfolder = destfolder.next();
  else
    return "NO Dest Folder Found";

  if(destfolder.getFiles().hasNext())
    files = destfolder.getFiles();
  else
    return "NO Files Found";

  while(files.hasNext()){
    file = files.next();
    name = file.getName();
    name = name.substring(8, name.length);
    file.setName(name);
  }

  return "DONE";
}

function make_a_copy(dest, source_folder){
  files = [];
  count = 0;
  destfolder = DriveApp.getFoldersByName(dest);
  if(destfolder.hasNext())
    destfolder = destfolder.next();
  else
    return "NO Dest Folder Found :: "+count;

  mainfolder = DriveApp.getFoldersByName(source_folder);
  while(mainfolder.hasNext()){
    folders = mainfolder.next();
    if(!folders.getFolders().hasNext()){
      folderfiles = folders.getFiles();
      while(folderfiles.hasNext()){
        file = folderfiles.next();
        destfolder.addFile(file);
        count++;
      }
    }else{
      folders = folders.getFolders();
      while(folders.hasNext()){
        folder = folders.next();
        folderfiles = folder.getFiles();
        while(folderfiles.hasNext()){
          file = folderfiles.next();
          destfolder.addFile(file);
          count++;
        }
      }
    }

  }

  return "DONE :: "+count;

}

function add_data_sheet(filename, image){
  file = DriveApp.getFilesByName(filename);
  if(!file.hasNext())
    sheet = SpreadsheetApp.create(filename, image.length, 3);
  else{
    file = file.next();
    sheet = SpreadsheetApp.openById(file.getId());
  }
  sheet = sheet.getActiveSheet();
  sheet.activate();


  sheet.appendRow([image.name,image.text, image.imageId]);

  return image;
}
