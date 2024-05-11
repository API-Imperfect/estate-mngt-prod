import { AuthFormHeader, RegisterForm } from "@/components/forms/auth";

export default function RegisterPage() {
	return (
		<div>
			<AuthFormHeader
				title="Sign up for an account"
				staticText="Already have an account?"
				linkText="Login Here"
				linkHref="/login"
			/>
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<RegisterForm />
				</div>
			</div>
		</div>
	);
}
