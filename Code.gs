// ==========================================
// 1. TETAPAN ASAS
// ==========================================
function getSpreadsheetId() {
  return PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '1WaWs5VAWN-PHqdAEivqXYU88SFj04HunDGfcV-Uds3U';
}

function getSheetName() {
  return PropertiesService.getScriptProperties().getProperty('SHEET_NAME') || 'Konvo2026';
}

// ==========================================
// 2. WEB APP SERVING
// ==========================================
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index');
}

// ==========================================
// 3. PANGKALAN DATA ADMIN
// ==========================================
function getAdminList() {
  try {
    const ssId = getSpreadsheetId();
    const ss = SpreadsheetApp.openById(ssId);
    let sheet = ss.getSheetByName("Senarai Admin");
    
    if (!sheet) {
      try {
        sheet = ss.insertSheet("Senarai Admin");
        sheet.appendRow(["Email Pentadbir"]);
        sheet.getRange("A1").setFontWeight("bold").setBackground("#dbeafe");
        const currentUser = Session.getEffectiveUser().getEmail();
        if (currentUser) sheet.appendRow([currentUser]);
      } catch(e) {
        // Abaikan
      }
    }
    
    const data = sheet ? sheet.getDataRange().getDisplayValues() : [];
    const admins = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) admins.push(data[i][0].toString().trim().toLowerCase());
    }
    return admins;
  } catch(err) {
    return [];
  }
}

// ==========================================
// 4. VERIFIKASI IDENTITI
// ==========================================
function verifyUserAccess() {
  try {
    const email = Session.getActiveUser().getEmail();
    if (!email) {
      return { success: false, email: "", role: 'guest', message: 'Sila log masuk ke Google.' };
    }
    
    const allowedAdmins = getAdminList();
    const isAdmin = allowedAdmins.indexOf(email.toLowerCase().trim()) > -1;
    
    return {
      success: true,
      email: email,
      role: isAdmin ? 'admin' : 'staff'
    };
  } catch (e) {
    return { success: false, email: "", role: 'guest', message: "Ralat Pelayan: " + e.toString() };
  }
}

function isCurrentUserAdmin() {
  try {
    const email = Session.getActiveUser().getEmail();
    if (!email) return false;
    const allowedAdmins = getAdminList();
    return allowedAdmins.indexOf(email.toLowerCase().trim()) > -1;
  } catch (e) {
    return false;
  }
}

// ==========================================
// 5. PENARIKAN DATA
// ==========================================
function getPostgraduateData() {
  let userEmail = "Tidak Diketahui";
  try {
    userEmail = Session.getActiveUser().getEmail();
    const spreadsheetId = getSpreadsheetId();
    const sheetName = getSheetName();
    
    const ss = SpreadsheetApp.openById(spreadsheetId);
    if (!ss) throw new Error("Gagal membuka fail Sheets");
    
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error("Helaian '" + sheetName + "' tidak wujud.");
    
    const rawData = sheet.getDataRange().getDisplayValues();
    const calcRange = sheet.getRange("L10:N26").getDisplayValues();
    
    return {
      success: true,
      email: userEmail,
      isAdmin: isCurrentUserAdmin(),
      data: rawData,
      calculated: calcRange,
      spreadsheetId: spreadsheetId
    };
  } catch (error) {
    return { success: false, email: userEmail, isAdmin: false, message: error.toString() };
  }
}

// ==========================================
// 6. FUNGSI ADMIN
// ==========================================
function getAdminsWeb() {
  if (!isCurrentUserAdmin()) throw new Error("Akses dinafikan.");
  return getAdminList();
}

function addAdminWeb(newEmail) {
  if (!isCurrentUserAdmin()) throw new Error("Akses dinafikan.");
  newEmail = newEmail.toString().trim().toLowerCase();
  
  const ss = SpreadsheetApp.openById(getSpreadsheetId());
  const sheet = ss.getSheetByName("Senarai Admin");
  sheet.appendRow([newEmail]);
  return getAdminList();
}

function removeAdminWeb(emailToRemove) {
  if (!isCurrentUserAdmin()) throw new Error("Akses dinafikan.");
  emailToRemove = emailToRemove.toString().trim().toLowerCase();
  
  const ss = SpreadsheetApp.openById(getSpreadsheetId());
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
