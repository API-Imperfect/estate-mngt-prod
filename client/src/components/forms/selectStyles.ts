const customStyles = {
	control: (provided: any, state: any) => ({
		...provided,
		backgroundColor: "var(--select-background-color)",
		borderColor: "var(--select-border-color)",
		color: "var(--select-text-color)",
		"&:hover": {
			borderColor: "var(--select-border-hover-color)",
		},
	}),
	option: (provided: any, state: any) => ({
		...provided,
		backgroundColor: state.isSelected
			? "var(--select-option-selected-background-color)"
			: "var(--select-option-background-color)",
		color: "var(--select-option-text-color)",
		"&:hover": {
			backgroundColor: "var(--select-option-hover-background-color)",
		},
	}),

	singleValue: (provided: any) => ({
		...provided,
		color: "var(--select-value-text-color)",
	}),
	menu: (provided: any) => ({
		...provided,
		backgroundColor: "var(--select-menu-background-color)",
	}),
};

export default customStyles;
