"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";

const UsersSearch = () => {
	return (
		<div className="bg-gray dark:bg-eerieBlack mb-3 flex min-h-[56px] w-full grow rounded-full">
			<Image
				src="/assets/icons/search.svg"
				alt="Search"
				width={24}
				height={24}
				className="mx-3"
			/>
			<Input
				placeholder="Search....."
				type="text"
				className="search-text no-focus dark:text-babyPowder border-none bg-transparent shadow-none outline-none"
			/>
		</div>
	);
};

export default UsersSearch;
