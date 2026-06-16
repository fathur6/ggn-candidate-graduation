// ==========================================
// SENARAI EMAIL ADMIN YANG DIBENARKAN (PPS)
// ==========================================
const ADMIN_EMAILS = [
  "mutiasobihah@unisza.edu.my", 
  "whishamudin@unisza.edu.my",
  "fathurrahman@unisza.edu.my",
  "fairuznasir@unisza.edu.my",
  "yusnitayusof@unisza.edu.my",
  "fatinhannani@unisza.edu.my",
  "ariffahimi@unisza.edu.my",
  "azuhazana@unisza.edu.my",
  "shuhadaaziz@unisza.edu.my",
  "afiqahnorozi@unisza.edu.my",
  "muhammadhamizan@unisza.edu.my",
  "normala@unisza.edu.my",
  "wannorakmal@unisza.edu.my", 
  "zailawati@unisza.edu.my",
  "roshazilahruslee@unisza.edu.my",
  "shahirahmansor@unisza.edu.my",
  "nasarudinsalleh@unisza.edu.my",
  "nadhirahrashid@unisza.edu.my",
  "pps_tdakademik@unisza.edu.my" // Pastikan email anda ada di sini untuk testing lokal
];

/**
 * Melancarkan fail index.html sebagai Web App.
 * XFrameOptionsMode.ALLOWALL membenarkan ia dipaparkan di dalam Google Sites.
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Modul Graduasi Siswazah')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Membaca data Google Sheets secara selamat menggunakan Google OAuth pengguna semasa.
 * Fungsi ini juga menyemak status peranan (Role) pengguna secara automatik.
 */
function getPostgraduateData() {
  const userEmail = Session.getActiveUser().getEmail();
  const isAdmin = ADMIN_EMAILS.includes(userEmail);
  
  try {
    const spreadsheetId = '1WaWs5VAWN-PHqdAEivqXYU88SFj04HunDGfcV-Uds3U';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Konvo2026');
    const rawData = sheet.getDataRange().getValues();
    
    return {
      success: true,
      email: userEmail,
      isAdmin: isAdmin,
      data: rawData
    };
  } catch (error) {
    return {
      success: false,
      email: userEmail,
      isAdmin: isAdmin,
      message: "Akses Pangkalan Data Gagal. Sila pastikan akaun Google UniSZA anda mempunyai kebenaran akses ke fail Google Sheet tersebut. Ralat: " + error.toString()
    };
  }
}

/**
 * Fungsi sekunder untuk pengesahan akses pentadbir secara pantas.
 */
function checkAdminAccess() {
  const userEmail = Session.getActiveUser().getEmail();
  return {
    authorized: ADMIN_EMAILS.includes(userEmail),
    email: userEmail
  };
}