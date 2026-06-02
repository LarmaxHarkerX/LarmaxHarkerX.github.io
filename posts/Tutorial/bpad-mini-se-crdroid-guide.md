---
title: BNCF BPad Mini SE 刷入 crDroid GSI 记录
date: 2026-05-27
description: 从贴牌平板到可用小板 - Unisoc UMS9230 UFS 机型的 BootROM 漏洞解锁和 GSI 刷入完整记录
tags: [刷机, Android, GSI, crDroid, Unisoc, 平板]
---

# BNCF BPad Mini SE 刷入 crDroid GSI 记录：从贴牌平板到可用小板

这篇是我自己折腾一台 Philips 牌平板的完整记录。它名义上是 Philips，实际更像一台贴牌机，系统里能看到的真实身份是 **BNCF BPad Mini SE**。我爸当时只是想要一块屏幕大一点的平板，买回来以后才发现，这类机器硬件不算差，但原厂系统和 Google 套件这件事会让人很头疼。

我最后走的是 Unisoc UMS9230 UFS 机型的 BootROM 漏洞解锁路线，完整备份后刷入 Doze-off 的 crDroid 11.6 Android 15 GSI。现在 Wi-Fi、蓝牙、触摸、相机预览、麦克风输入、Play 商店登录页这些基础项目都能工作，但这不是万能教程，也不是保砖教程。

如果你手里不是 **BNCF BPad Mini SE，Unisoc T615 / UMS9230，UFS 存储，动态分区，virtual A/B** 这一路设备，请不要照抄。

## 先把风险说清楚

刷这台机之前，我建议先读完全文，再决定要不要动手。

这篇文章只是我的个人经验记录，不是官方教程，也不对任何结果承担法律责任。包括但不限于系统破解、解锁、修改带来的风险，设备变砖、功能异常、保修问题，以及数据丢失，都需要你自己判断和承担。

**这些操作有真实风险：**

1. 解锁、刷 GSI、`fastboot -w` 都会清数据。
2. 写错 FDL、写错分区、用错镜像，有可能直接不开机。
3. 这台是 **UFS**，不是 EMMC。不要把 EMMC 包拿来用在这台 UFS 设备上。
4. 本文只针对我这台 BNCF BPad Mini SE 和同类 UMS9230 UFS 变体，不保证别的 Unisoc 设备可用。
5. 我有完整只读备份，所以敢继续。没有备份就刷，出事只能靠运气。
6. 回滚不是万能的。特别是 NV、persist、modem、miscdata、super、boot 链相关分区，如果你之前没备份，后面很难凭空恢复。
7. GSI 下某些属性或界面可能显示 green、locked 之类状态，这不一定等同于真实 BootROM 或 fastbootd 解锁状态。我的解锁验证以 fastbootd 和原厂系统阶段的启动属性为准。

## 这台机器的基本情况

我手上这台的关键信息如下：

| 项目 | 信息 |
| --- | --- |
| 外壳品牌 | Philips |
| 实际设备 | BNCF BPad Mini SE |
| 原厂系统 | Android 15 |
| SoC | Unisoc T615 / UMS9230 |
| ABI | arm64-v8a |
| Treble | 已启用 |
| 分区 | dynamic partitions |
| A/B | virtual A/B |
| 当前槽位 | `_b` |
| 存储 | UFS |
| 下载模式识别 | `SPRD U2S Diag (COM3)` |
| VID/PID | `VID_1782&PID_4D00` |

我后来在解锁日志里也看到过这些确认信息：

```text
Storage is ufs
Device is using slot b
Total number of partitions: 75
userdata 112202MB
```

## 为什么我没有继续折腾原厂 ROM

原厂 Android 15 看起来有点像准 AOSP，但实际体验很别扭。

预装应用不少，权限提示也比较绕。系统没有干净的 Google 套件，想自己补 GMS、Play Services、Play Store，结果一直不顺。更麻烦的是，开发者选项里的 OEM unlock 被厂商和 `OemLock HAL` 相关行为压住了，开关处于强制关闭状态。

我还试过以前 Android 12 那类 Google Account Manager 强行注入账号的旧思路，但 Android 15 已经挡住了这条路。最后我的判断是，继续在原厂 ROM 上补 Google 套件不划算。它不干净，不稳定，也不好复现给别人。

所以我改走另一条路：先完整备份，再通过 UMS9230 UFS 解锁包打开 bootloader，然后刷 Treble GSI。

## 先确认你的设备是不是同一路

不要只看外壳品牌。贴牌机最怕同名不同料。

我会先确认这些点：

```bat
adb shell getprop ro.product.cpu.abi
adb shell getprop ro.treble.enabled
adb shell getprop ro.boot.slot_suffix
adb shell getprop ro.boot.dynamic_partitions
adb shell getprop ro.virtual_ab.enabled
adb shell getprop ro.boot.hardware
adb reboot fastboot
fastboot getvar current-slot
fastboot getvar is-userspace
```

我这台应该对应：

```text
arm64-v8a
Treble enabled
slot _b / current-slot: b
dynamic partitions
virtual A/B
fastbootd userspace mode 可用
UFS storage
```

UFS 这一点尤其重要。TomKing062 的包里有 UFS 和 EMMC 差异，**我用的是 `ums9230_universal_unlock_UFS.dangerous.zip`，不是 EMMC 包**。

## 我准备的目录和文件

我的工具目录是：

```text
F:\project\pad\unisoc_unlock\ums9230_universal_unlock_UFS.dangerous
```

用到的正确包是：

```text
ums9230_universal_unlock_UFS.dangerous.zip
```

备份输出目录是：

```text
E:\ufs\backup-full-readonly-20260527-202422
```

这个目录里包含 75 个分区信息和关键文件。对我来说，最重要的是这些：

```text
super.bin
splloader.bin
uboot_a.bin
uboot_b.bin
boot_a.bin
boot_b.bin
init_boot_a.bin
init_boot_b.bin
vendor_boot_a.bin
vendor_boot_b.bin
dtb_a.bin
dtb_b.bin
dtbo_a.bin
dtbo_b.bin
vbmeta_a.bin
vbmeta_b.bin
vbmeta_system_a.bin
vbmeta_system_b.bin
vbmeta_vendor_a.bin
vbmeta_vendor_b.bin
vbmeta_system_ext_a.bin
vbmeta_system_ext_b.bin
vbmeta_product_a.bin
vbmeta_product_b.bin
vbmeta_odm_a.bin
vbmeta_odm_b.bin
prodnv
persist
misc
miscdata
modem / NV 相关分区
```

几个我实际记录下来的文件大小：

```text
super.bin       5,872,025,600 bytes
splloader.bin   262,144 bytes
uboot_b.bin     3,145,728 bytes
```

我尝试过完整 `userdata` 备份，但它很大，日志里显示 `userdata 112202MB`。这次最终回滚并不依赖完整 userdata，所以我不建议普通读者为了保险无脑长时间 dump userdata。你如果有非常重要的个人数据，应该先在 Android 里用正常方式导出。分区级 userdata dump 又慢又占空间，而且恢复时还可能碰上加密问题。

## 下载模式和驱动识别

设备进下载模式后，Windows 这边识别为：

```text
SPRD U2S Diag (COM3)
VID_1782&PID_4D00
```

这里还有个容易忽略的点：这台机的 EDL / SPRD 下载模式有超时机制。如果进模式以后一直不操作，过一会儿它可能会自己退出下载模式，然后直接开机进系统。遇到这种情况不用慌，重新按住 **Power + 音量下** 不放，直到电脑这边再次断开又重新识别到设备，再继续后面的步骤。

备份脚本里就是靠这个 VID/PID 等设备出现。我的脚本常量是：

```text
VID/PID:   VID_1782&PID_4D00
exec addr: 0x65015f08
FDL1 addr: 0x65000800
FDL2 addr: 0x9efffe00
```

## 第一步，只读完整备份

我先做的是只读备份。这个阶段不写、不擦、不解锁，只用 `spd_dump` 读取分区，最后 reset。

下面是我使用的 `backup_full_readonly_wait_sprd.ps1`。路径在工具目录下：

```text
F:\project\pad\unisoc_unlock\ums9230_universal_unlock_UFS.dangerous\backup_full_readonly_wait_sprd.ps1
```

脚本内容如下：

```powershell
param(
    [int]$TimeoutSeconds = 900,
    [string]$OutputRoot = 'E:\ufs',
    [int]$SpdWaitSeconds = 300,
    [int]$MinimumFreeGB = 140,
    [switch]$NoHash
)

$ErrorActionPreference = 'Stop'

$ToolDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$VidPidPattern = 'VID_1782&PID_4D00'
$ExecAddr = '0x65015f08'
$Fdl1Addr = '0x65000800'
$Fdl2Addr = '0x9efffe00'

# Full partition list captured from this BPad Mini SE / UMS9230 UFS device.
# READ ONLY: this script uses only spd_dump 'r <partition>' commands plus final reset.
$Partitions = @(
    'splloader',
    'prodnv','items','miscdata','misc',
    'trustos_a','trustos_b','sml_a','sml_b','uboot_a','uboot_b','uboot_log',
    'logo','fbootlogo',
    'l_fixnv1_a','l_fixnv2_a','l_fixnv1_b','l_fixnv2_b','l_runtimenv1','l_runtimenv2','persist',
    'l_modem_a','l_modem_b','l_deltanv_a','l_deltanv_b','l_gdsp_a','l_gdsp_b','l_ldsp_a','l_ldsp_b','l_agdsp_a','l_agdsp_b',
    'pm_sys_a','pm_sys_b','teecfg_a','teecfg_b','hypervsior_a','hypervsior_b',
    'boot_a','boot_b','vendor_boot_a','vendor_boot_b','init_boot_a','init_boot_b','dtb_a','dtb_b','dtbo_a','dtbo_b',
    'super','cache','blackbox','vbmeta_a','vbmeta_b','metadata','sysdumpdb',
    'vbmeta_system_a','vbmeta_system_b','vbmeta_vendor_a','vbmeta_vendor_b','vbmeta_system_ext_a','vbmeta_system_ext_b','vbmeta_product_a','vbmeta_product_b','vbmeta_odm_a','vbmeta_odm_b',
    'avbmeta_rs_a','avbmeta_rs_b','common_rs1_a','common_rs1_b','common_rs2_a','common_rs2_b','common_rs3_a','common_rs3_b',
    'reserve1','reserve2','calinv','userdata'
)

function Get-SprdDiagDevice {
    Get-CimInstance Win32_PnPEntity |
        Where-Object { $_.DeviceID -like "*$VidPidPattern*" -and $_.Status -eq 'OK' }
}

function Get-DriveFreeGB([string]$Path) {
    $item = Get-Item -LiteralPath $Path
    $driveName = $item.PSDrive.Name
    $drive = Get-PSDrive -Name $driveName
    [math]::Round($drive.Free / 1GB, 2)
}

foreach ($required in @('spd_dump.exe','Channel.ini','Channel9.dll','custom_exec_no_verify_65015f08.bin','fdl1-dl.bin','fdl2-dl.bin')) {
    if (-not (Test-Path -LiteralPath (Join-Path $ToolDir $required))) {
        throw "Missing required file in tool directory: $required"
    }
}

if (-not (Test-Path -LiteralPath $OutputRoot)) {
    New-Item -ItemType Directory -Path $OutputRoot | Out-Null
}

$freeGB = Get-DriveFreeGB $OutputRoot
Write-Host "Output root: $OutputRoot"
Write-Host "Free space on output drive: $freeGB GB"
if ($freeGB -lt $MinimumFreeGB) {
    throw "Not enough free space. Need at least $MinimumFreeGB GB for full backup with userdata."
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$BackupDir = Join-Path $OutputRoot "backup-full-readonly-$stamp"
New-Item -ItemType Directory -Path $BackupDir | Out-Null

foreach ($required in @('spd_dump.exe','Channel.ini','Channel9.dll','custom_exec_no_verify_65015f08.bin','fdl1-dl.bin','fdl2-dl.bin')) {
    Copy-Item -LiteralPath (Join-Path $ToolDir $required) -Destination (Join-Path $BackupDir $required) -Force
}

$partListPath = Join-Path $BackupDir 'PARTITIONS_REQUESTED.txt'
$Partitions | Set-Content -LiteralPath $partListPath -Encoding ASCII
$LogPath = Join-Path $BackupDir 'spd_dump-full-readonly.log'

Write-Host "Waiting for SPRD U2S Diag ($VidPidPattern) for up to $TimeoutSeconds seconds..."
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
$device = $null
while ((Get-Date) -lt $deadline) {
    $device = Get-SprdDiagDevice | Select-Object -First 1
    if ($device) { break }
    Start-Sleep -Seconds 1
}
if (-not $device) {
    throw "SPRD U2S Diag device not found. Re-enter download mode and retry."
}
Write-Host "Found: $($device.Name) [$($device.DeviceID)]"
Write-Host "Backup directory: $BackupDir"
Write-Host "Partitions to read: $($Partitions.Count)"
Write-Host "This is READ ONLY: no erase/write/unlock payload commands are used."

$argsList = @(
    '--wait', "$SpdWaitSeconds",
    'exec_addr', $ExecAddr,
    'fdl', 'fdl1-dl.bin', $Fdl1Addr,
    'fdl', 'fdl2-dl.bin', $Fdl2Addr,
    'exec'
)
foreach ($partition in $Partitions) {
    if ($partition -match '^(e|w|write|erase|reset|exec|fdl)$') {
        throw "Refusing suspicious partition token: $partition"
    }
    $argsList += @('r', $partition)
}
$argsList += 'reset'

Push-Location $BackupDir
try {
    & .\spd_dump.exe @argsList 2>&1 | Tee-Object -FilePath $LogPath
} finally {
    Pop-Location
}

Get-ChildItem -LiteralPath $BackupDir -File |
    Where-Object { $_.Name -notin @('spd_dump.exe','Channel.ini','Channel9.dll','custom_exec_no_verify_65015f08.bin','fdl1-dl.bin','fdl2-dl.bin') } |
    Select-Object Name,Length,LastWriteTime |
    Format-Table -AutoSize |
    Out-String |
    Set-Content -LiteralPath (Join-Path $BackupDir 'FILES.txt') -Encoding ASCII

if (-not $NoHash) {
    Write-Host "Computing SHA256 manifest. This can take a long time for userdata..."
    $hashLines = foreach ($file in Get-ChildItem -LiteralPath $BackupDir -File | Where-Object { $_.Name -notin @('spd_dump.exe','Channel.ini','Channel9.dll','custom_exec_no_verify_65015f08.bin','fdl1-dl.bin','fdl2-dl.bin') }) {
        $h = Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName
        "$($h.Hash)  $($file.Name)"
    }
    $hashLines | Set-Content -LiteralPath (Join-Path $BackupDir 'SHA256SUMS.txt') -Encoding ASCII
}

Write-Host "Full read-only backup complete."
Write-Host "Backup directory: $BackupDir"
Get-Content -LiteralPath (Join-Path $BackupDir 'FILES.txt')
```

运行方式大概是这样：

```powershell
cd F:\project\pad\unisoc_unlock\ums9230_universal_unlock_UFS.dangerous
powershell -ExecutionPolicy Bypass -File .\backup_full_readonly_wait_sprd.ps1
```

如果你不想等超大的 userdata 算 SHA256，可以自己评估是否加 `-NoHash`。我仍然建议至少把关键启动链、super、NV、persist、misc、miscdata 相关分区保存好，并把 `FILES.txt`、`SHA256SUMS.txt`、日志一起留着。

## 第二步，分阶段解锁

这里开始就是危险区了。

**再次提醒：这一步不是只读。它会擦写 `splloader`、`splloader_bak`、临时写入 active `uboot`，运行 unlock payload，然后恢复 `splloader` 和 `uboot` 并 wipe `misc`。如果你的设备不是同款 UFS 变体，或者包不是 UFS 包，不要继续。**

我用到的脚本路径是：

```text
F:\project\pad\unisoc_unlock\ums9230_universal_unlock_UFS.dangerous\unlock_staged_no_pause.bat
```

这次脚本中生成或使用过的文件包括：

```text
spl-unlock.bin
u-boot-spl-16k-sign.bin
uboot_bak.bin
fdl2-cboot.bin
misc-wipe.bin
```

`unlock_staged_no_pause.bat` 内容如下：

```bat
@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo === STAGED UMS9230 UFS UNLOCK START ===
echo This script uses pre-generated backup-derived files.
echo It WILL erase splloader/splloader_bak, write temporary uboot, run unlock payload, then restore splloader/uboot and wipe misc.
echo.

echo [1/5] Erase splloader and splloader_bak for fallback path
spd_dump --wait 300 exec_addr 0x65015f08 fdl fdl1-dl.bin 0x65000800 fdl fdl2-dl.bin 0x9efffe00 exec e splloader e splloader_bak reset
if errorlevel 1 goto fail

timeout /t 10 /nobreak

echo [2/5] Write temporary fdl2-cboot into active uboot
spd_dump --wait 300 exec_addr 0x65015f08 fdl fdl1-dl.bin 0x65000800 fdl fdl2-dl.bin 0x9efffe00 exec w uboot fdl2-cboot.bin reset
if errorlevel 1 goto fail

timeout /t 10 /nobreak

echo [3/5] Run unlock payload, may need twice on some devices
spd_dump --wait 300 exec_addr 0x65015f08 fdl spl-unlock.bin 0x65000800
if errorlevel 1 echo unlock payload returned non-zero; continuing to check/restore

timeout /t 10 /nobreak

echo [4/5] Check unlock data in miscdata. Locked: 64 zeros. Unlocked: 32 string + 16 hash + 16 hash.
spd_dump --wait 300 exec_addr 0x65015f08 fdl fdl1-dl.bin 0x65000800 fdl fdl2-dl.bin 0x9efffe00 exec verbose 2 read_part miscdata 8192 64 m.bin reset
if errorlevel 1 echo miscdata check failed; continuing to restore

timeout /t 10 /nobreak

echo [5/5] Restore splloader and active uboot, wipe misc, reset
spd_dump --wait 300 exec_addr 0x65015f08 fdl fdl1-dl.bin 0x65000800 fdl fdl2-dl.bin 0x9efffe00 exec r boot w splloader u-boot-spl-16k-sign.bin w uboot uboot_bak.bin w misc misc-wipe.bin reset
if errorlevel 1 goto restore_fail

echo === STAGED UMS9230 UFS UNLOCK COMPLETE ===
exit /b 0

:restore_fail
echo === RESTORE FAILED. DO NOT PANIC, KEEP DEVICE CONNECTED/IN DIAG IF POSSIBLE. ===
exit /b 2

:fail
echo === UNLOCK SCRIPT FAILED BEFORE RESTORE STAGE ===
exit /b 1
```

运行前，我会确认当前目录里这些文件都在，尤其是 `spd_dump.exe`、`fdl1-dl.bin`、`fdl2-dl.bin`、`spl-unlock.bin`、`fdl2-cboot.bin`、`u-boot-spl-16k-sign.bin`、`uboot_bak.bin`、`misc-wipe.bin`。

运行方式：

```bat
cd /d F:\project\pad\unisoc_unlock\ums9230_universal_unlock_UFS.dangerous
unlock_staged_no_pause.bat
```

我的成功验证不是只看脚本最后一句，而是后面进 fastbootd 看状态。

```bat
adb reboot fastboot
fastboot getvar is-userspace
fastboot getvar current-slot
fastboot getvar unlocked
```

我看到的关键信息是：

```text
is-userspace: yes
current-slot: b
unlocked: yes
```

在原厂系统阶段，也出现过这些属性：

```text
ro.boot.flash.locked=0
ro.boot.vbmeta.device_state=unlocked
ro.boot.verifiedbootstate=orange
```

刷入 GSI 之后，用户空间里有时会出现 green 或 locked 的显示和叠层提示。我把它当作 GSI 属性映射或显示层面的 caveat，没有拿它推翻 fastbootd 的 `unlocked: yes`。

## 第三步，选择 crDroid GSI

我选的是 Doze-off 的 crDroid 11.6 Android 15 QPR2 Treble GSI：

```text
E:\ufs\gsi\crDroid-11.6_treble_arm64_bgN-ab.img.xz
```

文件信息：

```text
压缩包大小: 1,213,953,860 bytes
SHA256: 0DC22B143F4390BE8D44FC5641FA42DEE1A2935DF21C13521F3D34A68D5EE24D
```

解压后镜像：

```text
E:\ufs\gsi\crDroid-11.6_treble_arm64_bgN-ab.img
大小: 3,730,255,872 bytes
```

这个文件名里的几个点很关键：

```text
arm64
bgN
ab
```

我的理解是：

1. `arm64` 对应这台机的 `arm64-v8a`。
2. `ab` 对应 A/B 或 virtual A/B 设备。
3. `bgN` 是带 GApps、无 root 风格的构建。
4. 这是 Doze-off 的 crDroid 11.6，基于 Android 15 QPR2。

我没有选 root 版，也没有自己补 Google 套件，因为这次目标就是让它变成一台能正常登录 Play 的轻度可用平板。crDroid 本来就是从 LineageOS / AOSP 这一路延伸出来的系统，很多日常会用到的功能已经集成好了，对我来说，比从一个很裸的 GSI 开始重新搭一遍更省事，也更容易复现。

## 第四步，通过 fastbootd 刷 system

这里刷的是动态分区里的 `system`，所以要进 userspace fastboot，也就是 fastbootd。

```bat
adb reboot fastboot
fastboot getvar is-userspace
fastboot getvar current-slot
fastboot getvar unlocked
```

确认：

```text
is-userspace: yes
current-slot: b
unlocked: yes
```

然后刷入 GSI：

```bat
fastboot flash system E:\ufs\gsi\crDroid-11.6_treble_arm64_bgN-ab.img
fastboot -w
fastboot reboot
```

我这里 `fastboot -w` 擦 userdata 成功，擦 cache 报错失败，但最后系统还是正常启动了。这个现象我只按实记录，不把它当成所有设备都可以忽略的通用结论。

启动以后，我确认到的 crDroid 信息包括：

```text
ro.crdroid.build.version=11.6
ro.crdroid.display.version=v11.6-20250618
ro.crdroid.device=tdgsi_arm64_ab
Android 15
```

GApps 相关包存在：

```text
com.google.android.gms
com.google.android.gsf
com.android.vending
```

Play 商店能打开到登录页。这一点对我来说已经比原厂 ROM 上硬补 GMS 干净很多。

## Wi-Fi 网络验证和 captive portal 修复

刷完后，我遇到过网络验证相关问题。最后用 Android 全局设置把 captive portal 检测地址换成国内可访问地址，Wi-Fi 验证恢复正常。

我用的命令如下：

```bat
adb shell settings put global captive_portal_mode 1
adb shell settings put global captive_portal_http_url http://connect.rom.miui.com/generate_204
adb shell settings put global captive_portal_https_url https://connect.rom.miui.com/generate_204
adb shell settings put global captive_portal_fallback_url http://connectivitycheck.platform.hicloud.com/generate_204
adb shell settings put global captive_portal_other_fallback_urls http://www.google.cn/generate_204
adb shell settings put global captive_portal_use_https 1
adb shell svc wifi disable
adb shell svc wifi enable
```

执行后网络状态验证通过。

如果你用的是代理工具，比如 Clash 一类，只需要按自己的网络环境配置。这里我不会放任何订阅链接、token、账号或密钥。公开教程里不要贴这些东西。

## 相机方向修复：前摄 270°、后摄 90°

GSI 刷完后，前后摄像头预览方向都是反的，而且画面有明显拉伸。用 `dumpsys media.camera` 一看，前后摄都报 `Orientation: 0`，这显然不对。

PHH/Treble 设置里没有现成的相机方向修复开关。我又去翻了 vendor 底层配置 `/vendor/odm/etc/sensor_config.xml`，发现传感器配置本身是对的：前摄 `Orientation=270`，后摄 `Orientation=90`。问题不在配置文件。

顺着线索查下去，定位到 Unisoc 的 camera HAL（`camera.unisoc.so`）。这个 HAL 在往 framework 上报 `android.sensor.orientation` 静态元数据的时候，把方向值统一抹成了 0。不管底层配置写的是什么，HAL 传上去的永远是 0。

试过一堆常规手段：`persist.vendor.camera.HAL3.enabled=0`、`vendor.camera.hal1.packagelist`、`OVERRIDE_CAMERA_LANDSCAPE_TO_PORTRAIT` compat change、`device_config camera enable_landscape_to_portrait=true`，全没用。这些开关要么不被这台机子的 HAL 读取，要么只对特定 fixed-orientation app 生效，解决不了根本问题。

最终走的是二进制级 patch。定位到 `camera.unisoc.so` 里的 `SprdCamera3Setting::initStaticMetadataforSensorInfo()` 函数。该函数在写入 `android.sensor.orientation`（tag `0xE000E`）时，从结构体偏移 `+0x5528` 读取一个值，但该值始终为 0。

通过反汇编（pyelftools + capstone）找到了写入点的精确指令窗口，地址 `0x643dc`。用 keystone-engine 生成了一个 32 字节的 ARM64 trampoline，放在函数体内的一个 UDF 代码洞（地址 `0x80030`）。trampoline 逻辑很简单：根据 camera ID（`w19`）计算 `90 + 180 × camera_id`，即 camera 0 → 90，camera 1 → 270，然后写入正确的元数据槽位。原始写入点改为跳转指令 `b #0x80030`，跳到 trampoline 执行完再跳回原函数继续。

patch 好的 `camera.unisoc.so` 通过 Magisk 模块做 systemless 覆盖，路径 `/system/vendor/lib64/hw/camera.unisoc.so`。重启后 `dumpsys media.camera` 确认：Back Orientation = 90，Front Orientation = 270。前后摄预览方向和拉伸问题都修复了，对所有 app 生效。

Magisk 模块结构：

```
/data/adb/modules/camera_orientation_patch/
├── module.prop
└── system/
    └── vendor/
        └── lib64/
            └── hw/
                └── camera.unisoc.so
```

回退方法：删除 `/data/adb/modules/camera_orientation_patch` 目录并重启即可恢复原始 HAL。

## 我做过的基础静默 QA

这台机刷完 crDroid 后，我做了一轮基础检查。结果如下：

| 项目 | 结果 |
| --- | --- |
| Wi-Fi | 可用，captive portal 修复后网络验证通过 |
| VPN / Clash 类工具 | 可安装并运行，不包含任何订阅信息 |
| 蓝牙 | 可打开 |
| 屏幕 | 800x1340，164dpi，支持 90Hz / 60Hz |
| 触摸 | `himax-touchscreen` 可用 |
| 传感器 | 有 accelerometer / device orientation |
| 相机 | camera service 看到 2 个摄像头，预览能打开 |
| 麦克风 | 输入设备存在 |
| Play Store | 能打开到登录页 |

也有一些我没有充分测试的地方：

1. 扬声器没有完整测试。
2. GPS 没有完整测试。
3. SIM 或蜂窝网络没有完整测试。
4. 长待机、深睡、耗电没有长期观察。

### YouTube 闪退和替代方案

YouTube 在这台 4GB 内存的板子上会闪退。我抓过 crash log，原因是 Glide 图片库的 Bitmap 被系统提前回收：

```
FATAL EXCEPTION: glide-active-resources
Process: com.google.android.youtube
java.lang.IllegalStateException: Cannot obtain size for recycled Bitmap
```

这是 YouTube 自身的 bug，在低内存设备上更容易触发。我试过开 `ro.config.low_ram=true`，没用。降级 YouTube 版本也没用，因为 Play 会自动更新回来。

最后我换成了 **SmartTube**，不需要 GMS，自带广告过滤，对低内存设备也更友好。直接从 GitHub 下载 arm64-v8a 的 APK 安装就行：<https://github.com/yuliskov/SmartTube>

所以我不会说它已经完美，也不会说它适合所有人当主力机。对我来说，它已经从一台原厂系统很别扭的贴牌平板，变成了一台基本可用的 Android 15 crDroid 小板。

## 回滚策略

我做完整备份的最大意义，就是保留回滚路径。

如果只是 GSI 不合适，优先考虑回 fastbootd，用原备份里的 `super.bin` 恢复动态分区内容。因为我当前槽位是 `b`，所以启动链相关文件也要按槽位匹配，不要把 a、b 混着写。

我会重点保留这些文件：

```text
super.bin
boot_b.bin
vendor_boot_b.bin
init_boot_b.bin
dtb_b.bin
dtbo_b.bin
vbmeta_b.bin
vbmeta_system_b.bin
vbmeta_vendor_b.bin
vbmeta_system_ext_b.bin
vbmeta_product_b.bin
vbmeta_odm_b.bin
uboot_b.bin
splloader.bin
prodnv
persist
misc
miscdata
modem / NV 相关分区
```

如果当前槽位变成 a，就要换成对应的 `_a` 文件。不要在没确认槽位时乱刷。

概念上，fastbootd 回滚 `super` 会像这样：

```bat
adb reboot fastboot
fastboot getvar is-userspace
fastboot getvar current-slot
fastboot flash super E:\ufs\backup-full-readonly-20260527-202422\super.bin
fastboot -w
fastboot reboot
```

启动链回滚要更谨慎。比如槽位 b 对应的是：

```bat
fastboot flash boot_b E:\ufs\backup-full-readonly-20260527-202422\boot_b.bin
fastboot flash vendor_boot_b E:\ufs\backup-full-readonly-20260527-202422\vendor_boot_b.bin
fastboot flash init_boot_b E:\ufs\backup-full-readonly-20260527-202422\init_boot_b.bin
fastboot flash dtb_b E:\ufs\backup-full-readonly-20260527-202422\dtb_b.bin
fastboot flash dtbo_b E:\ufs\backup-full-readonly-20260527-202422\dtbo_b.bin
fastboot flash vbmeta_b E:\ufs\backup-full-readonly-20260527-202422\vbmeta_b.bin
```

是否能直接用 fastboot 写某个分区，取决于设备当前能进入的模式、分区暴露情况和 fastbootd 支持情况。进不了 fastbootd 时，就可能要回到 Unisoc 下载模式和 `spd_dump` 这条线。那时更不能乱试，应该先确认分区名、槽位、镜像来源和命令含义。

**我不会承诺一定能 unbrick。** 我能做的是把备份、槽位、分区文件、日志都留好，让自己在出问题时有东西可回。

## 常见坑和我的建议

1. 不要用 EMMC 包刷 UFS 设备。这是本文最重要的警告之一。
2. 不要跳过备份。至少把 `super`、启动链、vbmeta、NV、persist、miscdata 留好。
3. 不要只看品牌名。Philips 外壳不代表内部方案一致。
4. 不要在 GSI 里看到 locked 字样就立刻慌。先回 fastbootd 看 `fastboot getvar unlocked`。
5. 不要把自己的代理订阅、账号、token 写进教程、截图或日志。
6. 不要在没确认当前槽位时刷 `_a` 或 `_b` 镜像。
7. 不要把 `userdata` 当作最可靠的个人数据备份方式。能在系统里导出的，先用正常方法导出。

## 参考和致谢

这次能完成，主要靠这些项目和资料：

1. TomKing062 的 Unisoc CVE 解锁项目：<https://github.com/TomKing062/CVE-2022-38694_unlock_bootloader>
2. TomKing062 的 spreadtrum_flash releases：<https://github.com/TomKing062/spreadtrum_flash/releases/latest>
3. NCC Group 关于 Unisoc ROM 漏洞的文章：<https://www.nccgroup.com/research/there-s-another-hole-in-your-soc-unisoc-rom-vulnerabilities/>
4. Doze-off crDroid GSI 2025-06-18 发布页：<https://github.com/Doze-off/android_crdroid/releases/tag/2025-06-18>
5. Doze-off crDroid GSI 仓库和 releases：<https://github.com/Doze-off/android_crdroid>，<https://github.com/Doze-off/crdroid_gsi_treble/releases>
6. crDroid 官方网站和源码组织：<https://crdroid.net>，<https://github.com/crdroidandroid>
7. TrebleDroid：<https://github.com/TrebleDroid/treble_experimentations>
8. Android GSI 官方文档：<https://developer.android.google.cn/topic/generic-system-image>，<https://source.android.com/docs/core/tests/vts/gsi?hl=en>
9. OpenCode：<https://opencode.ai>，<https://github.com/anomalyco/opencode>
10. LineageOS：<https://lineageos.org>，<https://github.com/LineageOS/android>
11. SmartTube：<https://github.com/yuliskov/SmartTube>
12. pyelftools：<https://github.com/eliben/pyelftools>
13. capstone：<https://github.com/capstone-engine/capstone>
14. keystone-engine：<https://github.com/keystone-engine/keystone>
15. AOSP CameraUtils 源码（sensor_orientation 用法参考）：<https://android.googlesource.com/platform/frameworks/av/+/69e86ab47181f93fce4c119d0f293a147c2e687f/camera/CameraUtils.cpp>
16. ChatGPT 5.5，协助整理步骤、风险提示和文章结构。

最后再重复一次：这是一篇我自己的 BNCF BPad Mini SE / UMS9230 UFS 折腾记录，不是通用刷机包说明书。你可以参考我的路径，但每一步都要先确认自己的设备、槽位、存储类型和备份是否可靠。
