#include "lcd-interface.h"

int lcdColumns = 20;
int lcdRows = 4;
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

void lcdSetup() {
  // initialize LCD
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();
}

void scrollTextV(int rowStart, int rowEnd, String messages[], int messagesLength, int delayTime) {
  int pos = 0;
  
  while (pos < messagesLength) {
    for (int row = rowStart; row <= rowEnd; row++) {
      // Serial.println(pos+row-rowStart);
      Serial.println(messages[pos+row]);
      int index = pos+(row-rowStart);
      lcd.setCursor(0, row);
      
      if (index < messagesLength) {
        lcd.print(messages[index]);
      } else {
        lcd.print("                    ");
      }
    }
    
    int rowsCount = rowEnd - rowStart + 1;
    pos += rowsCount;
    delay(delayTime);
  }
}

               //12345678912345678912 
String header = "TIME  BUS_STOP  B_ID";

void displayBusStopData(String data[], int dataLength) {
  lcd.setCursor(0, 0);
  lcd.print(header);

  scrollTextV(1, 3, data, dataLength, 2000);
}

String formatLCDBusRow(String time, String stop, String busId) {
  String row = time + " ";

  int stopMaxLen = 20 - (time.length() + 2 + busId.length());
  if (stop.length() > stopMaxLen) {
    row += stop.substring(0, stopMaxLen);
  } else {
    row += stop;

    // pad with spaces
    for (int i = 0; i < stopMaxLen - stop.length(); i++) {
      row += " ";
    }
  }

  row += " " + busId;
  return row;
}