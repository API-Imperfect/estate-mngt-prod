import React from "react";

interface ProfileItemProps {
	icon: React.ReactNode;
	label: string;
	value: string;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
	icon,
	label,
	value,
}) => (
	<div className="flex items-center space-x-2">
		{icon}
		<span className="font-semibold">
			<span className="tab-font">{label}:</span>
			<span className="dark:text-babyPowder">{value}</span>
		</span>
	</div>
);
