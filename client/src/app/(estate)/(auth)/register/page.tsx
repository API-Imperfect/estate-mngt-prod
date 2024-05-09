import { AuthFormHeader } from "@/components/forms/auth";

export default function RegisterPage() {
	return (
		<div>
			<AuthFormHeader
				title="Sign up for an account"
				staticText="Already have an account?"
				linkText="Login Here"
				linkHref="/login"
			/>
		</div>
	);
}
