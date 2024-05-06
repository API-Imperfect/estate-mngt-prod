import { HomeModernIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="flex-between bg-baby_rich border-b-platinum shadow-platinum fixed z-50 w-full gap-5 border-b-2 p-4 sm:p-6 lg:px-12 dark:border-b-0 dark:shadow-none">
			<Link href="/" className="flex items-center">
				<HomeModernIcon className="mr-2 size-11 text-lime-500" />
				<p className="h2-bold font-robotoSlab text-veryBlack dark:text-babyPowder hidden sm:block">
					Alpha <span className="text-lime-500"> Apartments</span>
				</p>
			</Link>

			<div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
				{/* placeholder theme switcher component */}
				<div className="dark:text-pumpkin hidden text-lg sm:block sm:text-xl">
					Theme Switcher
				</div>
				{/* placeholder theme switcher component */}
				<div className="dark:text-pumpkin text-lg sm:text-xl">MobileNavbar</div>
			</div>
		</nav>
	);
}
