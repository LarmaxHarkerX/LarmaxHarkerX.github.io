---
title: 华为平板 M3 刷机记录：扩容 System、刷第三方系统与 Google 服务
date: 2026-05-15
description: 以 BTV-DL09 64GB 为例，整理一次华为平板 M3 的刷机记录，并明确区分官方恢复路径与社区方案
tags: [刷机, Android, 华为, 平板, Google, 教程]
---

# 华为平板 M3 刷机记录：扩容 System、刷第三方系统与 Google 服务

这篇文章不是“包你一次成功”的万能教程，而是我自己折腾 **华为平板 M3（BTV-DL09 64GB）** 的一次整理版记录。之所以重写，是因为这类老设备现在已经不在官方支持周期内，很多资料散落在论坛、旧帖子和镜像包说明里。如果把“官方还支持什么”和“社区现在只能怎么凑合”混在一起写，很容易把读者带沟里。

我下面会把三件事分清楚：

1. **Huawei 现在仍然承认的官方恢复路径** 是什么；
2. **Bootloader 解锁、TWRP、第三方系统、Google 服务** 哪些属于社区方案；
3. 我这台机器上哪些步骤是我实际做过、确认过的。

如果你手上的不是 **MediaPad M3 / BTV 系列**，或者容量、地区版本、系统版本不一致，请不要直接照抄分区参数。

---

## 先把边界说清楚

### 1. 华为官方现在能提供的，主要是恢复，不是解锁

Huawei 目前公开还能查到的资料，主要集中在 `HiSuite`、`eRecovery`、系统修复和更新失败处理上。例如：

- rooted 设备如何通过 `HiSuite` / `eRecovery` 恢复系统；
- 更新失败后如何进入恢复；
- 进入 Fastboot / eRecovery 的按键方式；
- `eRecovery` 需要 Wi‑Fi，电量最好高于 30%。

这部分能作为**官方恢复依据**，但它不等于“华为仍然支持 Bootloader 解锁”。

### 2. Bootloader 官方通道已经停了，但老设备还有第三方算号路线

华为在 2018 年停止了官方 Bootloader 解锁码服务。对今天还在折腾 MediaPad M3 这种老设备的人来说，真正常见的现实不是“去华为官网申请”，而是去 **某宝 / 某鱼** 找还在做老华为解锁的人。

他们通常会给你两样东西：

- 一个专用的解锁程序；
- 一个远程 USB 软件或加密狗式的授权环境。

说白了，本质就是：**对方通过老设备还能用的第三方算号方式，给你算出这台机器的解锁码，然后你自己在本地完成解锁。**

这条路有几个边界必须说清楚：

1. 只适用于一部分 **老华为 / 老荣耀设备**，不是所有 Huawei 机器都还能这么做；
2. 不同卖家的工具、驱动、远控方式可能不一样；
3. 这完全不是 Huawei 官方支持路径；
4. 你买到的是“算号和授权能力”，不是一份对所有机型通用的公开方法。

我这台 M3 走的就是这类路子，不是自己凭空把 Bootloader 解开的。

所以这篇文章里只要提到：

- `fastboot oem unlock`；
- TWRP；
- 分区调整；
- 刷第三方 ROM；
- 手动装 Google 服务；

都应该理解为 **社区方案**。

### 3. 这台设备官方支持也已经结束

MediaPad M3 的官方支持页已经显示支持结束，而且公开页面上也没有继续提供完整固件下载。换句话说，折腾这台设备本来就是“旧设备维护”，不要再把它当成还在主线支持里的产品。

---

## 风险提示

这部分不写成模板化“免责声明”，只说实际风险：

- **会清数据。** 进 Fastboot、刷 TWRP、格式化 Data、改分区、刷第三方系统，都可能让数据直接归零。
- **分区步骤最危险。** `parted` 这一段不是“高级一点的普通操作”，而是真正会把 GPT 改掉的步骤。数字抄错一位就可能把机器送进救砖流程。
- **官方恢复不等于第三方刷机兜底。** `eRecovery` 和 `HiSuite` 能救一部分系统问题，但不保证你改过分区以后还能轻松回到原厂状态。
- **Google 服务不是官方支持功能。** 这部分更多是兼容性折腾，不是 Huawei 给旧平板留下的标准安装路线。

如果你只是想要一台“稳定可用的老平板”，最稳妥的做法并不是刷最狠，而是先评估：你到底是为了完整 GMS、为了更大的 System 分区，还是只是为了把机器救活。

---

## 我的设备信息

我这次记录对应的是下面这台机器：

| 项目 | 信息 |
| --- | --- |
| 型号 | BTV-DL09 |
| 容量 | 64GB |
| 芯片 | 麒麟 950 |
| 目标 | 刷入第三方系统并给 System 留出更大的空间 |
| 重点问题 | 原厂系统老旧、Google 服务不完整、System 空间不够 |

这也是为什么本文会出现“扩容 System 分区”这一步。对同系列但不同容量的设备来说，**分区终点值不能照搬**。

---

## 开始前我准备了什么

我实际准备的是这几类东西：

1. **确认 Bootloader 已经处于可解锁/已解锁状态**
   我这里不是走官方申请通道，而是找第三方远程算号解锁。对方会让你装驱动、远程 USB 软件或者配套程序，最后给出这台机器对应的解锁码。做完以后，我会进 Fastboot 看底部状态，确认不是完全锁死状态。没有这个前提，后面步骤都没法谈。

2. **ADB / Fastboot 工具**
   我最后用的是较老版本的 platform-tools。原因不是“网上都说旧版神”，而是我在这台设备上碰到过新版工具写 recovery 后仍然表现异常的情况，回退工具版本后反而稳定了。

3. **TWRP 镜像**
   这里最重要的不是“找个 TWRP 就行”，而是确认它确实对应 M3 / BTV 这一路机器。

4. **底层分区工具**
   我准备了 `parted`、`mkfs.ext4`、`e2fsck`、`resize2fs`。后面会通过 `adb push` 临时送进恢复环境使用。

5. **ROM 和 GApps**
   这部分我直接放在 MicroSD 卡里，而不是指望改完分区以后再慢慢往平板内部传。对老设备来说，外置卡能省很多麻烦。

---

## 先说官方可接受的退路

即使你最终要刷第三方系统，也建议先知道官方还能提供什么恢复路径：

- `HiSuite`：适合系统层面的修复和回刷；
- `eRecovery`：适合系统损坏或升级失败后从网络恢复；
- 进入恢复前先保证电量和网络条件；
- rooted / 改过系统的设备也不代表完全没有恢复路径，但官方只会支持它自己的恢复方式。

我之所以把这个提前讲，是因为很多教程一上来就进入刷机命令，却不告诉你：**一旦改了分区，官方工具未必还能像原机那样顺手兜底。**

---

## 实际操作记录

下面这一段是我的真实流程，但我会尽量写成“你需要确认什么”，而不是“照着抄就一定行”。

### 第一步：先把“解锁这件事”说明白

这一步我不想继续写得很含蓄，因为现实里很多人就是卡在这里。

像 MediaPad M3 这种老华为设备，现在常见做法就是：

1. 去某宝或某鱼找还在做老设备解锁的人；
2. 对方发你一个解锁程序，以及配套的远程 USB 软件 / 加密狗环境；
3. 你把平板接到电脑，对方远程跑一遍识别和算号流程；
4. 算出解锁码后，再由你自己本地执行解锁。

这个流程我没有办法写成“所有人都能直接离线复现”的公开教程，因为第三方工具链和授权本身就不公开。但有一点我可以明确说：

> **如果你的设备还在这条老华为算号支持范围里，解锁不是玄学，更多是有没有对应渠道和工具。**

我建议你至少确认两件事：

- 卖家明确说支持 **MediaPad M3 / BTV 系列**；
- 解锁完成后，Fastboot 里能看到已解锁状态，而不是只听卖家说“已经好了”。

### 第二步：刷入 TWRP，但不要把 Fastboot 的“成功”提示当作全部真相

我做法很简单：

1. 关机；
2. 按住音量下接 USB，进 Fastboot；
3. 执行：

```bash
fastboot flash recovery twrp.img
```

真正要注意的是：

- 命令返回 `OKAY` 不代表后续一定能正常进恢复；
- 如果工具链或镜像不匹配，Fastboot 的提示有时会过于乐观；
- 我这台机器上，刷完以后**不要直接 `fastboot reboot`**，而是拔线、长按电源彻底关机，再手动按 **音量上 + 电源** 进入恢复。

这是我自己踩过坑以后留下来的操作习惯，不是华为官方步骤。

### 第三步：把底层工具推到 `/sbin`

进入 TWRP 后，我没有往 `/data` 或其他分区里塞这些工具，而是直接推到内存中的 `/sbin`：

```bash
adb push parted /sbin/
adb push mkfs.ext4 /sbin/
adb push e2fsck /sbin/
adb push resize2fs /sbin/

adb shell
chmod 0777 /sbin/parted
chmod 0777 /sbin/mkfs.ext4
chmod 0777 /sbin/e2fsck
chmod 0777 /sbin/resize2fs
```

这么做的好处是简单直接，坏处也很明显：你已经彻底进入“恢复环境里的手工操作”了，后面没有任何图形向导会替你检查参数。

### 第四步：调整分区

这是最不适合写成“傻瓜照抄”的一段。

我在 `parted /dev/block/mmcblk0` 里确认过当前分区表，并且**先看序号，再决定是否动手**。本文里那组 `43-49` 的分区操作，是我这台 **64GB BTV-DL09** 上的记录，不应该被理解成“所有 MediaPad M3 都是这样”。

我实际遵循的是这个原则：

- 先 `print` 确认分区表；
- 确认 `system`、`cust`、`vendor`、`userdata` 的位置和顺序；
- 只在明确知道自己要扩大 `system` 并且知道后续要如何重建其他分区时才继续；
- 退出前再次确认新分区表没有把后面的链条打乱。

如果你对 GPT 和分区边界没有把握，**到这里就应该停下**，而不是继续跟着敲命令。

下面这组命令，是我这台 **BTV-DL09 64GB** 机器上实际执行过的记录，我把它完整放回来，方便以后自己查，也方便同机型的人核对。再说一遍：**只能拿来参考，不能默认适用于所有 M3。**

先进入分区工具：

```bash
/sbin/parted /dev/block/mmcblk0
```

然后在 `(parted)` 里先 `print` 看当前分区，再确认：

- `43` 是 `system`
- `49` 是 `userdata`

我当时实际删掉旧分区的命令是：

```bash
rm 49
rm 48
rm 47
rm 46
rm 45
rm 44
rm 43
```

接着重建分区，我这台 **64GB** 机器当时用的是下面这一组：

```bash
mkpart system ext2 1174 6501
name 43 system
set 43 msftdata on

mkpart cust ext4 6501 6702
name 44 cust
set 44 msftdata on

mkpart version ext4 6702 6736
name 45 version
set 45 msftdata on

mkpart vendor ext2 6736 7374
name 46 vendor
set 46 msftdata on

mkpart product ext4 7374 7575
name 47 product
set 47 msftdata on

mkpart hisitest2 7575 7579
name 48 hisitest2
set 48 msftdata on

mkpart userdata 7579 62.5GB
name 49 userdata
set 49 msftdata on
```

如果你不是 64GB 版本，尤其是 32GB / 16GB，就不要直接照搬最后这个容量终点值，而是先看 `print` 里磁盘总容量是多少。

最后退出：

```bash
quit
```

### 第五步：格式化并让 TWRP 重新识别新分区

分区表改完不等于系统已经会用。我的做法是：

1. 用 `mkfs.ext4` 格式化新建分区；
2. 完全重启一次 TWRP，让内核重新读取分区表；
3. 在 TWRP 里对 `Data`、`System`、`Vendor` 做文件系统修复或重新指定为 `ext4`；
4. 去挂载菜单确认这些分区可以正常挂载。

我当时 shell 里实际跑过的基础格式化命令是：

```bash
/sbin/mkfs.ext4 /dev/block/mmcblk0p43
/sbin/mkfs.ext4 /dev/block/mmcblk0p44
/sbin/mkfs.ext4 /dev/block/mmcblk0p45
/sbin/mkfs.ext4 /dev/block/mmcblk0p46
/sbin/mkfs.ext4 /dev/block/mmcblk0p47
/sbin/mkfs.ext4 /dev/block/mmcblk0p49
exit
```

这一步做完以后，我是 **彻底断开 USB，长按电源关机，再重新按音量上 + 电源回到 TWRP**，不是在原地图方便点个重启系统。

这一步的重要性比很多教程写得高。因为分区表刚变更时，恢复环境里的挂载状态经常还停留在旧认知上。

### 第六步：刷 ROM 后把 System 真正“撑开”

扩完 System 分区以后，ROM 自己的镜像大小未必会自动占满新空间。这也是我保留 `e2fsck` 和 `resize2fs` 的原因。

我的做法是：

1. 在 TWRP 里先刷目标 ROM；
2. **不要急着重启系统**；
3. 重新连电脑后执行：

```bash
adb shell
/sbin/e2fsck -f /dev/block/mmcblk0p43
/sbin/resize2fs /dev/block/mmcblk0p43
```

如果 `resize2fs` 能顺利把文件系统扩到新的上限，这一步才算完整闭环。

至于 GApps，我当时的思路也很直白：既然都把 System 分区扩出来了，那就别再装最瘦的包，而是直接刷自己需要的完整包。刷完以后再顺手 `Wipe Cache/Dalvik`。

### 第七步：第一次开机要有耐心

这一步没什么技术含量，但很容易被误判：

- 第一次开机时间会明显变长；
- 改过分区和 Data 以后，系统重建缓存就是会慢；
- 没必要在第一次 logo 多转几分钟时就立刻判断“变砖”。

我自己的经验是，先给它足够时间，再判断是不是卡死。

---

## Google 服务这件事，最好说人话

这部分最容易被写成“刷完 ROM 一切顺利，尽享全量 GApps”，但真实情况没有这么干脆。

### 1. 官方并没有给这台设备留下标准的 GMS 安装路线

尤其是中国市场机器，Google 服务本来就不是 Huawei 给出的官方预期路径。

### 2. M3 上能找到的方案，本质上还是社区 workaround

社区常见思路有两类：

- 直接刷 OpenGApps / MindTheGapps 这类包；
- 对部分版本使用 `gsminstaller`、手动装 Play Services / Play Store。

这两条路都不是 Huawei 文档会教你的做法，也都不保证“以后重置、换版本、换系统以后还一样稳定”。

### 3. 我的建议比“装什么包”更重要

如果你的目标是给老设备补上基础 Google 服务，优先级应该是：

1. 先让系统稳定启动；
2. 先确认 System 和 Data 都正常；
3. 再决定是刷完整 GApps 还是只补必须组件；
4. 遇到认证或兼容性问题，按 ROM 社区的实际反馈处理，而不是把责任推给 Huawei 官方。

---

## Wi‑Fi 显示“已连接但网络受限”时，我是怎么处理的

这部分我保留，因为它确实是老设备刷第三方系统以后很常见的问题。

原因通常不是 Wi‑Fi 真坏了，而是系统默认拿 Google 的探测地址去做 captive portal 验证，国内环境下容易超时，于是图标上出现 `×` 或“网络受限”提示。

我最后是用 ADB 改掉验证地址，比如：

```bash
adb shell settings put global captive_portal_http_url http://connect.rom.miui.com/generate_204
adb shell settings put global captive_portal_https_url https://connect.rom.miui.com/generate_204
```

如果你不想用小米的地址，也可以换成别的可达 `generate_204` 目标，例如 Cloudflare 的 `https://cp.cloudflare.com/generate_204`。核心思路不是“某家服务器最神”，而是：**让系统别再去访问当前环境下不可达的默认探测地址。**

---

## 这篇记录真正能帮你的地方

如果只看一句话，我希望你记住的是：

> **这台设备现在还能折腾，但“官方支持的恢复路径”和“社区自己拼出来的刷机路径”已经不是一回事了。**

把这件事看明白，后面的决策才不会乱。

对我来说，这次折腾最大的经验不是“命令怎么敲”，而是三点：

1. 先确认这台机器现在还有没有官方兜底；
2. 再确认社区方法到底适配哪一批机型；
3. 最后才是你要不要真的去动分区。

如果这三点没搞清楚，写得再像“终极教程”，也只是把风险包装得更好看。

---

## 参考依据

### 官方资料

1. Huawei：rooted 设备的系统恢复说明  
   <https://consumer.huawei.com/ca/support/content/en-us00406898/>
2. Huawei：系统更新失败后的恢复说明  
   <https://consumer.huawei.com/ca/support/content/en-us00416970/>
3. Huawei：HiSuite / 恢复相关 FAQ  
   <https://consumer.huawei.com/ca/support/content/en-us00698630/>
4. Huawei eRecovery 说明页  
   <https://consumer-tkbdownload.huawei.com/ctkbfm/applet/simulator/en-gb00739873/erecovery.html>
5. MediaPad M3 官方支持页（可见支持结束状态）  
   <https://consumer.huawei.com/jp/support/tablets/mediapad-m3-8/>

### 政策与社区资料

6. Huawei 社区：Bootloader 解锁政策停止说明  
   <https://consumer.huawei.com/en/community/details/topicId-41529/>
7. Android Police：Huawei 停止官方 Bootloader 解锁计划  
   <https://www.androidpolice.com/2018/05/24/huawei-halts-bootloader-unlock-program-indefinitely/>
8. XDA：MediaPad M3 解锁 / TWRP / root 讨论  
   <https://xdaforums.com/t/guide-unlock-bootloader-twrp-root-huawei-mediapad-m3-8-4-btv-w09-btv-dl09.4085383/>
9. XDA：MediaPad M3 添加 Google 服务讨论  
   <https://xdaforums.com/t/media-pad-m3-8-add-google-services-install-core-gsm-core-package-solved.3768089/>
10. XDA：M3 BTV 机型 unbrick / rollback / rescue 讨论  
    <https://xdaforums.com/t/mediapad-m3-un-brick-restore-rollback-and-rescue-for-btv-variants.4212953/>
