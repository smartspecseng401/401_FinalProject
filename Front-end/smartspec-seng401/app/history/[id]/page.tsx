import { Title } from "@/components/ui/title";
import BuildDetailsComponent from "@/components/BuildDetailsComponent";
import { JSX } from "react";
import { ArrowLeft } from "lucide-react";

export default async function ViewBuildPage({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
	const { id } = await params;

	if (!id) {
		return <div>Error: Missing build ID</div>;
	}

	return (
		<div className="flex flex-col items-center space-y-major">
			<div className="flex items-center space-x-4">
				<a
					href="/history"
					className="w-12 h-12 bg-primaryColor text-white rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-all"
					aria-label="Go back to history"
				>
					<ArrowLeft size={24} />
				</a>
				<Title className="text-secondaryColor">{`Build ${id}`}</Title>
			</div>
			<BuildDetailsComponent buildId={id} />
		</div>
	);
}
