// ==========================================
// SEMUA KONFIGURASI DISIMPAN DI SCRIPT PROPERTIES
// Key: ADMIN_EMAILS | Value: email1,email2,...
// Key: SPREADSHEET_ID | Value: ID sheets
// Key: SHEET_NAME     | Value: nama sheet
// ==========================================
function getAdminEmails() {
  const prop = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS');
  return prop ? prop.split(',').map(e => e.trim().toLowerCase()) : [];
}

function getSpreadsheetId() {
  return PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '';
}

function getSheetName() {
  return PropertiesService.getScriptProperties().getProperty('SHEET_NAME') || 'Konvo2026';
}

function getAdminsWeb() {
  return getAdminEmails();
}

function addAdminWeb(newEmail) {
  const userEmail = Session.getActiveUser().getEmail();
  const admins = getAdminEmails();
  if (!admins.includes(userEmail.toLowerCase())) throw new Error('Hanya pentadbir boleh menambah admin.');
  const clean = newEmail.trim().toLowerCase();
  if (!clean || !clean.includes('@')) throw new Error('Emel tidak sah.');
  if (admins.includes(clean)) throw new Error('Emel sudah wujud dalam senarai.');
  admins.push(clean);
  PropertiesService.getScriptProperties().setProperty('ADMIN_EMAILS', admins.join(','));
  return admins;
}

function removeAdminWeb(email) {
  const userEmail = Session.getActiveUser().getEmail();
  const admins = getAdminEmails();
  if (!admins.includes(userEmail.toLowerCase())) throw new Error('Hanya pentadbir boleh membuang admin.');
  const clean = email.trim().toLowerCase();
  const filtered = admins.filter(e => e !== clean);
  if (filtered.length === admins.length) throw new Error('Emel tidak dijumpai dalam senarai.');
  PropertiesService.getScriptProperties().setProperty('ADMIN_EMAILS', filtered.join(','));
  return filtered;
}

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Modul Graduasi Siswazah')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getPostgraduateData() {
  const userEmail = Session.getActiveUser().getEmail();
  const adminEmails = getAdminEmails();
  const isAdmin = adminEmails.includes(userEmail.toLowerCase());
  
  try {
    const spreadsheetId = getSpreadsheetId();
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(getSheetName());
    const rawData = sheet.getDataRange().getValues();
    
    return {
      success: true,
      email: userEmail,
      isAdmin: isAdmin,
      data: rawData,
      spreadsheetId: spreadsheetId
    };
  } catch (error) {
    return {
      success: false,
      email: userEmail,
      isAdmin: isAdmin,
      message: "Ralat Pangkalan Data: Sila pastikan akaun anda mempunyai akses ke Sheets tersebut. " + error.toString()
    };
  }
}