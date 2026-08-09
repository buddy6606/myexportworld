/**
 * MY EXPORT WORLD - Google Apps Script Web App (Code.gs)
 * Logs inquiries to Google Sheets and dispatches Telegram notification with Date & Time.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 1. Log Inquiry Row to Google Sheet
    sheet.appendRow([
      data.timestamp || new Date(),
      data.companyName || '',
      data.buyerName || '',
      data.contactNo || '',
      data.buyerEmail || '',
      data.buyerAddress || '',
      data.productSelected || '',
      data.buyerQuestion || ''
    ]);

    // 2. Dispatch Single Telegram Notification with Date & Time
    var telegramToken = "8892460990:AAHeJ16iPlXBaSAkpiji2H-Thn8CeKgadlE";
    var telegramChatId = "8825936223";

    var message = "🤖 New Sourcing Inquiry - MY EXPORT WORLD\n" +
      "---------------------------------------\n" +
      "Company: " + (data.companyName || 'N/A') + "\n" +
      "Buyer Name: " + (data.buyerName || 'N/A') + "\n" +
      "Phone/Contact: " + (data.contactNo || 'N/A') + "\n" +
      "Email: " + (data.buyerEmail || 'N/A') + "\n" +
      "Location: " + (data.buyerAddress || 'N/A') + "\n" +
      "Product: " + (data.productSelected || 'N/A') + "\n" +
      "Requirements: " + (data.buyerQuestion || 'N/A') + "\n" +
      "Date & Time: " + (data.timestamp || new Date().toLocaleString()) + "\n" +
      "---------------------------------------\n" +
      "Submitted via myexportworld.com";

    UrlFetchApp.fetch("https://api.telegram.org/bot" + telegramToken + "/sendMessage", {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: telegramChatId,
        text: message
      }),
      muteHttpExceptions: true
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
