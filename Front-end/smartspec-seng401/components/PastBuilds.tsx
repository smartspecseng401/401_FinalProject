"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import BuildCard from "@/components/PastBuildCard";
import { Subtitle } from "@/components/ui/subtitle";
import { Spinner } from "@heroui/spinner";
import { BuildData, BuildString } from "@/types";
import { useLoginContext } from "@/context/loginContext";
import { NEXT_PUBLIC_API_GATEWAY_URL } from "@/constants";

interface fetchedBuild {
	buildid: string;
	buildjson: BuildData;
	created_at?: string;
}

const PastBuilds = () => {
	const router = useRouter();
	const [builds, setBuilds] = useState<fetchedBuild[]>([]);
	const [loading, setLoading] = useState(true);

	const { isAuthenticated, user } = useLoginContext();

	useEffect(() => {
		async function checkSessionAndFetchBuilds() {
			setLoading(true);

			if (isAuthenticated) {
				// user isn't null if isAuthenticated is true
				try {
					const apiUrl = `${NEXT_PUBLIC_API_GATEWAY_URL}/past_builds/${user?.id}`;
					const response = await axios.get(apiUrl);
					if (response.data.length > 0) {
						setBuilds(response.data);
					} else {
						setBuilds([]);
					}
				} catch (error) {
					console.error("Error fetching builds:", error);
					setBuilds([]);
				}
			}
			setLoading(false);
		}

		checkSessionAndFetchBuilds();
	}, [isAuthenticated, user?.id]);

	// Format build data for display - computed on demand
	const getFormattedBuild = (
		build: fetchedBuild,
		index: number
	): BuildString => {
		const buildData = build.buildjson;
		const buildid = Number(build.buildid);
		return {
			build_id: buildid,
			name: `Build ${index + 1}`,
			cpu: buildData.CPUs?.name || "Unknown CPU",
			gpu: buildData.GPUs?.name || "Unknown GPU",
			ram: buildData.RAM?.name || "Unknown RAM",
			date:
				build.created_at?.split("T")[0] ||
				new Date().toISOString().split("T")[0],
			games: buildData.input.gamesList || [],
		};
	};

	const handleViewBuild = (buildIndex: number) => {
		localStorage.setItem("selectedBuild", JSON.stringify(builds[buildIndex]));

		// Navigate to the detail page with the actual build ID
		router.push(`/history/${buildIndex + 1}`);
	};

	if (loading) {
		return (
			<Spinner className="flex justify-center items-center mt-10" size="lg" />
		);
	}

	if (!isAuthenticated) {
		return (
			<Subtitle className="flex justify-center items-center mt-10 text-center text-red-400">
				Please Login before viewing past builds.
			</Subtitle>
		);
	}

	return (
		<div className="flex flex-col gap-y-5 mt-5 mb-10 items-center">
			{builds.length === 0 ? (
				<Subtitle>❌ No build history found.</Subtitle>
			) : (
				builds.map((build, index) => (
					<BuildCard
						build={getFormattedBuild(build, index)}
						key={index + 1}
						onViewBuild={() => handleViewBuild(index)}
					/>
				))
			)}
		</div>
	);
};

export default PastBuilds;
