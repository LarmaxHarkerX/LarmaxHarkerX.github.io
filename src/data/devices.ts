/**
 * 个人设备清单。电脑规格来自本机只读硬件查询，不包含设备名、序列号或磁盘标识。
 */
import type { DeviceItem } from "@/types/devicesConfig";

export const devicesData: DeviceItem[] = [
	{
		id: "omen-16",
		name: "OMEN by HP Laptop 16",
		brand: "HP",
		category: "desk",
		status: "active",
		specs: "Intel Core i7-11800H / RTX 3070 Laptop / 64 GB",
		description: "用来做视频、音频、三维创作，也用它搭建和维护这个博客。",
		specDetails: [
			{ key: "model", label: "机型", value: "OMEN by HP Laptop 16-b0xxx" },
			{
				key: "cpu",
				label: "处理器",
				value: "Intel Core i7-11800H，8 核 16 线程",
			},
			{
				key: "gpu",
				label: "显卡",
				value: "NVIDIA GeForce RTX 3070 Laptop GPU / Intel UHD Graphics",
			},
			{ key: "memory", label: "内存", value: "64 GB（32 GB × 2，3200 MT/s）" },
			{
				key: "storage",
				label: "存储",
				value: "Samsung 1 TB NVMe SSD + Kingston 1 TB NVMe SSD",
			},
			{ key: "os", label: "系统", value: "Windows 11，64 位" },
		],
		icon: "material-symbols:laptop-windows-rounded",
		featured: true,
	},
	{
		id: "redmi-k30-pro",
		name: "Redmi K30 Pro",
		brand: "Redmi",
		category: "mobile",
		status: "active",
		specs: "Redmi K30 Pro / 256 GB / 5G",
		description: "我的手机之一，256 GB 存储版本。",
		icon: "material-symbols:phone-android-rounded",
		link: "https://www.mi.com/redmik30pro/specs",
	},
	{
		id: "huawei-mate-x2",
		name: "HUAWEI Mate X2",
		brand: "HUAWEI",
		category: "mobile",
		status: "active",
		specs: "Mate X2 / 512 GB / 折叠屏",
		description: "我的另一部手机，512 GB 存储版本。",
		icon: "material-symbols:phone-android-rounded",
	},
];

export function getDevicesList(): DeviceItem[] {
	return devicesData;
}
