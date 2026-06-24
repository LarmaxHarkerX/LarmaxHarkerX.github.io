---
title: AE 2026 + Red Giant Universe 中文参数乱码的修复记录
date: 2026-06-24
description: 修复Maxon系列插件在AE2026的乱码问题
tags: [AE, ADOBE, AFTER_EFFECTS, UNIVERSE, FIX, TUT]
---

我原本只是开开心心重装了一下系统。

系统干净了，软件重新装一遍，Adobe After Effects 2026 装上，Maxon App 装上，Red Giant / Universe 插件也重新装上。按理说这就是一套很常规的流程，没什么好写的。 

结果 AE 一打开，给我拉了一坨大的。 Red Giant Universe 的参数面板里，中文不是乱码，就是缺字，有些地方干脆只剩几个奇怪的符号。尤其是效果控件里的参数名，基本属于“看了也不知道自己在调什么”的状态。 

一开始我还以为是字体缺失、系统语言没装全、或者 AE 2026 哪个缓存坏了。后来才发现，Maxon 现在确实给 Red Giant / Universe 做了官方中文本地化，而且它会根据系统语言自动加载中文翻译文件。问题是，在 AE 这边，某些中文参数字符串会出现乱码、缺字或者显示异常。 

严格说，这件事不一定能完全甩锅给 Maxon。网上也有人反馈 AE 26.2 之后，第三方插件的非英文 UI 文本出现乱码，讨论里提到过 AE 对第三方插件字符串编码的处理变得更严格，可能导致旧编码、本地化文件、系统代码页之间互相打架。总之最后表现出来就是：官方中文是有了，但在我这里还不如纯英文能用。 

下面是我这次排查和修复的完整过程。 

--- 
## 先尝试：开启 Windows 的 UTF-8 Beta 支持 

我最先想到的是 Windows 的编码设置。 

Windows 里有一个选项叫： 

> Beta 版：使用 Unicode UTF-8 提供全球语言支持 

这个选项以前主要是给一些非 Unicode 程序用的。既然现在的问题看起来像是中文编码炸了，那我就先试了一下。 

具体路径如下： 
1. 按 Win + R
2. 输入：intl.cpl
3. 回车，打开“区域”窗口
4. 切到“管理”选项卡
5. 点击：  `更改系统区域设置(C)...`
6. 在弹出的窗口里勾选：`Beta 版：使用 Unicode UTF-8 提供全球语言支持`
7. 确定，然后重启电脑  

注意，这里不是把系统区域改成英文，也不是把 Windows 显示语言改成英文。当前系统区域仍然可以保持：  
`简体中文（中国大陆）`  

只是额外勾选 UTF-8 支持。  

但是实际测试下来，这个办法只恢复了一部分显示。比如某些按钮、某些插件面板看起来正常了一点，但 AE 效果控件里的参数名还是会乱码、缺字或者显示不完整。  

也就是说，UTF-8 这个开关在我的环境里不是最终解法。  


## **真正的思路：让 Universe 找不到中文翻译文件，自动回退英文**  

继续查资料后，我发现 Maxon 的 Red Giant 插件本地化并不是写死在插件本体里，而是通过一堆 JSON 翻译文件来加载的。  

也就是说，插件启动时会根据当前语言环境去找对应语言文件。例如简体中文就是：  
`zh-CN.json`  

如果这个文件不存在，插件就会回退到英文。  

这就简单了：不用改系统语言，不用重装 AE，不用卸载 Red Giant，也不用动插件本体。只要把中文翻译 JSON 改名，让 Universe 找不到它，就能让参数面板回到英文。  

这里的关键是：不要乱删文件，直接改名就行。这样以后想恢复中文，也可以改回来。  

## **先定位 Red Giant / Universe 的翻译文件**  

我先用 PowerShell 查了一下 Maxon 的翻译目录。  

打开管理员 PowerShell，执行：  

``Get-ChildItem "C:\ProgramData\Maxon" -Recurse -Directory -Filter "translations" | ForEach-Object { "`n==== $($_.FullName) ====" Get-ChildItem $_.FullName -File | Select-Object Name }``  

一开始我看到：  

`C:\ProgramData\Maxon\Universe\translations`  

这个目录表面上是空的。  

但这其实有点误导，因为 Universe 的翻译文件不是直接放在这个根目录里，而是藏在更深的子目录里。  

于是我继续递归搜索，最后发现 Universe 的每个插件都有自己的翻译文件。以我出问题的 VHS 插件为例，它的路径是：  

`C:\ProgramData\Maxon\Universe\translations\plugins\Universe_Stylize_VHS\ecw\zh-CN.json`  

这个文件就是 VHS 在 AE 效果控件里显示中文参数名的来源。  

## **单独修复 VHS 插件**  

为了避免误伤，我没有一上来就批量改所有文件，而是先只改 VHS 这一个插件。  

管理员 PowerShell 执行：  

`$dir = "C:\ProgramData\Maxon\Universe\translations\plugins\Universe_Stylize_VHS\ecw" Get-ChildItem $dir -File | Sort-Object Name`  

正常情况下，里面会看到类似这些文件：  

`de-DE.json en-US.json ja-JP.json ko-KR.json pt-BR.json zh-CN.json`  

其中：  

`zh-CN.json`  

就是简体中文翻译文件。  

正式修改前，我先用 -WhatIf 预览了一下，确认它只会改这一个文件：  

``Rename-Item ` -LiteralPath "C:\ProgramData\Maxon\Universe\translations\plugins\Universe_Stylize_VHS\ecw\zh-CN.json" ` -NewName "zh-CN.json.disabled" ` -WhatIf``  

确认没问题后，执行正式改名：  

``Rename-Item ` -LiteralPath "C:\ProgramData\Maxon\Universe\translations\plugins\Universe_Stylize_VHS\ecw\zh-CN.json" ` -NewName "zh-CN.json.disabled"``  

再检查一下目录：  

`Get-ChildItem "C:\ProgramData\Maxon\Universe\translations\plugins\Universe_Stylize_VHS\ecw" -File | Sort-Object Name`  

修改后应该能看到：  

`zh-CN.json.disabled`  

然后完全退出 AE，重新打开 AE，新建一个合成，重新给图层添加 uni.VHS。  

注意，最好不要只看旧工程里的旧效果实例。AE 有时候会缓存当前效果实例的状态，所以测试时最好新建合成、重新添加插件。  

这一步做完之后，我这里 VHS 的参数名就正常回到英文了。  

虽然最上面的“打开仪表板...”按钮仍然是中文，但下面真正影响使用的参数项，比如：  

`Choose a Preset... Save Preset... Enable Color Controls Color Controls Channel Controls Enable Tape Damage Tape Damage Enable Text Text Generator Frame Style Image Offset Tape Style (LUT) Post Noise Render Alpha Random Seed`  

这些都恢复成英文了。  

这说明问题确实出在 Universe 插件自己的中文翻译 JSON 上。  

## **批量修复整个 Universe**  

确认单个插件修复有效后，就可以把整个 Universe 的简体中文翻译都禁用掉。  

这里一定要注意范围。  

我只处理这个目录：  

`C:\ProgramData\Maxon\Universe\translations`  

不要碰这些目录：  
`C:\ProgramData\Maxon\App Manager C:\ProgramData\Maxon\net.maxon.rg_common C:\Program Files`  

尤其不要用特别宽泛的关键词去批量匹配，比如：  

`cn`  

因为 cn 太容易误伤，很多无关文件名里也可能刚好出现这两个字母。  

我这里采用最保守的方式：只匹配文件名完全等于：  

`zh-CN.json ccui_zh-CN.json`  

先预览目标文件：  

`$root = "C:\ProgramData\Maxon\Universe\translations" $targets = Get-ChildItem $root -Recurse -File | Where-Object { $_.Name -eq "zh-CN.json" -or $_.Name -eq "ccui_zh-CN.json" } $targets | Sort-Object FullName | Select-Object FullName "Total targets: $($targets.Count)"`

看输出时，路径应该都在：  

`C:\ProgramData\Maxon\Universe\translations`  

下面，例如：  

`C:\ProgramData\Maxon\Universe\translations\customUI\zh-CN.json C:\ProgramData\Maxon\Universe\translations\dashboard\zh-CN.json C:\ProgramData\Maxon\Universe\translations\framework\zh-CN.json C:\ProgramData\Maxon\Universe\translations\ccui\ccui_zh-CN.json C:\ProgramData\Maxon\Universe\translations\plugins\某个插件\ecw\zh-CN.json`  

如果输出里出现了 App Manager、Program Files 或者其他非 Universe 路径，就不要继续执行。  
## **修改前保存一份清单**  

我建议正式改名前先导出一份清单到桌面，方便以后回看自己到底改过哪些文件。  

`$stamp = Get-Date -Format "yyyyMMdd-HHmmss" $report = "$env:USERPROFILE\Desktop\Universe-zh-CN-disabled-$stamp.csv" $targets | Sort-Object FullName | Select-Object FullName, Length, LastWriteTime | Export-Csv $report -NoTypeInformation -Encoding UTF8 "Backup list saved to: $report"`  

这一步不是备份文件本体，只是保存一个修改清单。因为我们只是重命名文件，不是删除文件，所以一般已经足够安全。  

## **正式禁用 Universe 中文翻译**  

先用 -WhatIf 预演：  

`$targets | Rename-Item -NewName { $_.Name + ".disabled" } -WhatIf`  

确认输出全部都是 Universe 目录下的 zh-CN.json 或 ccui_zh-CN.json 后，再执行正式命令：  

`$targets | Rename-Item -NewName { $_.Name + ".disabled" }`  

完成后，关闭 AE，重新打开 AE，新建合成，重新添加 Universe 插件。  

如果一切正常，Universe 的参数名应该会回退到英文。  

## **如何恢复中文**  

如果以后 Maxon 或 Adobe 修好了这个问题，想恢复中文，也很简单，把 .disabled 去掉即可。  
先预览：  

`$root = "C:\ProgramData\Maxon\Universe\translations" Get-ChildItem $root -Recurse -File | Where-Object { $_.Name -eq "zh-CN.json.disabled" -or $_.Name -eq "ccui_zh-CN.json.disabled" } | Rename-Item -NewName { $_.Name -replace "\.disabled$","" } -WhatIf`  

确认无误后，执行正式恢复：  

`$root = "C:\ProgramData\Maxon\Universe\translations" Get-ChildItem $root -Recurse -File | Where-Object { $_.Name -eq "zh-CN.json.disabled" -or $_.Name -eq "ccui_zh-CN.json.disabled" } | Rename-Item -NewName { $_.Name -replace "\.disabled$","" }`  

**如果只想修某一个插件**  

如果不想让整个 Universe 都变英文，也可以只修出问题的插件。  

以 VHS 为例，只改：  

`C:\ProgramData\Maxon\Universe\translations\plugins\Universe_Stylize_VHS\ecw\zh-CN.json`  

改成：  

`zh-CN.json.disabled`  

这样只有 VHS 回退英文，其他 Universe 插件仍然保持中文。  

## **总结**  

这次问题本质上不是 AE 没装好，也不是系统语言没设对，而是 Red Giant / Universe 的官方中文本地化在 AE 里出现了显示兼容问题。  

我试过 Windows 的 UTF-8 Beta 开关，它能改善一部分显示，但没有彻底解决参数乱码和缺字。  
最后真正有效的办法是：  

找到 Universe 的中文翻译 JSON；  

不删除，只重命名；  

让插件找不到中文翻译文件；  

Universe 自动回退英文；  

AE 里的参数名恢复正常可读。  

最关键的目录是：  

`C:\ProgramData\Maxon\Universe\translations`  

最关键的文件名是：  

`zh-CN.json ccui_zh-CN.json`  

最关键的原则是：  

`只改 Universe 的翻译文件，不碰 App Manager，不碰 Program Files，不用模糊关键词乱匹配。`  

目前对我来说，这个方案比改系统语言、重装插件、重装 AE 都靠谱。  

## **参考来源**  
Maxon 官方支持：After Effects 日文版中让 Red Giant 插件以英文版使用的方法  
https://support.maxon.net/hc/ja-jp/articles/26087213462300-After-Effects%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%89%88%E3%81%A7Red-Giant%E3%81%AE%E3%83%97%E3%83%A9%E3%82%B0%E3%82%A4%E3%83%B3%E3%82%92%E8%8B%B1%E8%AA%9E%E7%89%88%E3%81%A8%E3%81%97%E3%81%A6%E4%BD%BF%E3%81%86%E6%96%B9%E6%B3%95  

Maxon Note：How to use Red Giant plugins in English in the Japanese version of After Effects  
https://note.com/maxonjapan/n/nb15318937ed1?hl=en  

Maxon Red Giant 2026.4.0 发行说明：提到 localized languages 下 Unicode error，以及 Studio 中 UTF-8 转换错误导致下拉菜单乱码或空白的问题  
https://support.maxon.net/hc/en-us/articles/13764887933596-Red-Giant-2026-4-0-April-15-2026  

Adobe Community：After Effects 26.2 后第三方插件非英文 UI 文本乱码反馈  
https://community.adobe.com/bug-reports-528/some-third-party-plug-ins-show-garbled-non-english-ui-text-in-after-effects-26-2-1557834  

Windows 11 UTF-8 设置说明：Enable or Disable Unicode UTF-8 for Worldwide Language Support in Windows 11  
https://www.elevenforum.com/t/enable-or-disable-unicode-utf-8-for-worldwide-language-support-in-windows-11.38649/