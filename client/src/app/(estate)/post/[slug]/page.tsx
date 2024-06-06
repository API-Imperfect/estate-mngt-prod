import PostDetails from "@/components/post/PostDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Post Details",
	description: "Authenticated users can see the details of a post",
};

interface ParamsProps {
	params: {
		slug: string;
	};
}

export default function PostDetailPage({ params }: ParamsProps) {
	return (
		<>
			<PostDetails params={params} />
		</>
	);
}
