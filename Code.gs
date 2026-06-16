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
  "pps_tdakademik@unisza.edu.my"
];

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Modul Graduasi Siswazah')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

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
      message: "Ralat Pangkalan Data: Sila pastikan akaun anda mempunyai akses ke Sheets tersebut. " + error.toString()
    };
  }
}