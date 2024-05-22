interface TenantInfoProps {
	label: string;
	value: string | number;
	icon: any;
}

function TenantInfo({ label, value, icon: Icon }: TenantInfoProps) {
	return (
		<p className="flex items-center space-x-2 space-y-1">
			<Icon className="card-icon" />
			<span className="tab-font">{label}:</span>
			<span className="tab-font">{value}</span>
		</p>
	);
}

export default TenantInfo;
