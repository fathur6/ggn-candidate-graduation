// ==========================================
// SCRIPT PROPERTIES KEYS
// SPREADSHEET_ID = ID Google Sheets
// SHEET_NAME     = Nama sheet data graduan
// ==========================================
function getSpreadsheetId() {
  return PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '';
}

function getSheetName() {
  return PropertiesService.getScriptProperties().getProperty('SHEET_NAME') || 'Konvo2026';
}

// ==========================================
// SENARAI ADMIN DIBACA DARI SHEET "Senarai Admin"
// ==========================================
function getAdminList() {
  const ssId = getSpreadsheetId();
  if (!ssId) throw new Error("SPREADSHEET_ID tiada dalam Script Properties!");
  const ss = SpreadsheetApp.openById(ssId);
  let sheet = ss.getSheetByName("Senarai Admin");
  if (!sheet) {
    sheet = ss.insertSheet("Senarai Admin");
    sheet.appendRow(["Email Pentadbir"]);
    sheet.getRange("A1").setFontWeight("bold").setBackground("#dbeafe");
    const currentUser = Session.getEffectiveUser().getEmail();
    if (currentUser) sheet.appendRow([currentUser]);
  }
  const data = sheet.getDataRange().getValues();
  const admins = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) admins.push(data[i][0].toString().trim().toLowerCase());
  }
  return admins;
}

// ==========================================
// VERIFIKASI IDENTITI GOOGLE
// ==========================================
function verifyUserAccess() {
  const email = Session.getActiveUser().getEmail();
  if (!email) {
    return { success: false, email: "", role: 'guest', message: 'Tidak dapat mengesahkan identiti Google. Sila log masuk.' };
  }
  try {
    const admins = getAdminList();
    const isAdmin = admins.includes(email.toLowerCase().trim());
    return { success: true, email: email, role: isAdmin ? 'admin' : 'staff' };
  } catch (e) {
    return { success: false, email: email, role: 'guest', message: e.toString() };
  }
}

function isCurrentUserAdmin() {
  const email = Session.getActiveUser().getEmail();
  if (!email) return false;
  try {
    const admins = getAdminList();
    return admins.includes(email.toLowerCase().trim());
  } catch (e) {
    return false;
  }
}

// ==========================================
// WEB APP SERVING
// ==========================================
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Modul Graduasi Siswazah')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ==========================================
// DATA GRADUAN
// ==========================================
function getPostgraduateData() {
  const userEmail = Session.getActiveUser().getEmail();
  try {
    const spreadsheetId = getSpreadsheetId();
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(getSheetName());
    const rawData = sheet.getDataRange().getValues();
    const admins = getAdminList();
    const isAdmin = admins.includes(userEmail.toLowerCase());
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
      isAdmin: false,
      message: "Ralat Pangkalan Data: Sila pastikan akaun anda mempunyai akses ke Sheets tersebut. " + error.toString()
    };
  }
}

// ==========================================
// URUS ADMIN - gated by backend admin check
// ==========================================
function getAdminsWeb() {
  if (!isCurrentUserAdmin()) throw new Error("Akses dinafikan. Hanya pentadbir dibenarkan.");
  return getAdminList();
}

function addAdminWeb(newEmail) {
  if (!isCurrentUserAdmin()) throw new Error("Akses dinafikan. Hanya pentadbir dibenarkan.");
  newEmail = newEmail.toString().trim().toLowerCase();
  if (!newEmail || !newEmail.includes('@')) throw new Error("Format emel tidak sah.");
  const ssId = getSpreadsheetId();
  const ss = SpreadsheetApp.openById(ssId);
  const sheet = ss.getSheetByName("Senarai Admin");
  const currentAdmins = getAdminList();
  if (currentAdmins.includes(newEmail)) throw new Error("Emel sudah wujud dalam senarai.");
  sheet.appendRow([newEmail]);
  return getAdminList();
}

function removeAdminWeb(emailToRemove) {
  if (!isCurrentUserAdmin()) throw new Error("Akses dinafikan. Hanya pentadbir dibenarkan.");
  emailToRemove = emailToRemove.toString().trim().toLowerCase();
  const currentUser = Session.getActiveUser().getEmail().toLowerCase().trim();
  if (emailToRemove === currentUser) throw new Error("Tidak boleh buang diri sendiri.");
  const ssId = getSpreadsheetId();
  const ss = SpreadsheetApp.openById(ssId);
  const sheet = ss.getSheetByName("Senarai Admin");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().trim().toLowerCase() === emailToRemove) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  return getAdminList();
}
