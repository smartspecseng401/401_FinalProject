"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/utils/supabaseClient";
import axios from "axios";
import BuildCard from "@/components/PastBuildCard";
import { Subtitle } from "@/components/ui/subtitle";
import { Spinner } from "@heroui/spinner";
import { useBuildResultContext } from "@/context/buildResultContext";

interface Build {
	build_id: number;
	name: string;
	cpu: string;
	gpu: string;
	ram: string;
	date: string;
	games: string[];
}

interface buildAPIResponse {
	buildjson: {
		CPUs: {
			name: string;
			price_CAD: string;
			Justification: string;
		};
		GPUs: {
			name: string;
			price_CAD: string;
			Justification: string;
		};
		RAM: {
			name: string;
			price_CAD: string;
			Justification: string;
		};
		Motherboards: {
			name: string;
			price_CAD: string;
			Justification: string;
		};
		Storage: {
			name: string;
			price_CAD: string;
			Justification: string;
		};
		Power_Supply: {
			name: string;
			price_CAD: string;
			Justification: string;
		};
		Case: {
			name: string;
			price_CAD: string;
			Justification: string;
		};
		Cooling: {
			name: string;
			price_CAD: string;
			Justification: string;
		};
		input: {
			budget: number;
			minFps: number;
			gamesList: string[];
			displayResolution: string;
			graphicalQuality: string;
			preOwnedHardware: string[];
		};
	};
}

const PastBuilds = () => {
	const router = useRouter();
	const [builds, setBuilds] = useState<Build[]>([]);
	const [rawBuilds, setRawBuilds] = useState<buildAPIResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState<string | null>(null);
	const { loadBuildResult, loadSummary } = useBuildResultContext();

	useEffect(() => {
		async function checkSessionAndFetchBuilds() {
			setLoading(true);
			const session: { user: { id: string } } | null = await checkSession();

			if (session) {
				const requestUserId = session.user.id; // Use local variable instead of state since state updates are async
				setUserId(requestUserId); // Still update state for other parts of component to use to update UI

				try {
					const postURL = `https://smartspec-backend.vy7t9a9crqmrp.us-west-2.cs.amazonlightsail.com/past_builds/${requestUserId}`;
					const response = await axios.get(postURL);

					if (response.data.length > 0) {
						const formattedBuilds = response.data.map(
							(item: buildAPIResponse, index: number) => {
								const build = item.buildjson;

								return {
									build_id: index + 1,
									name: `Build ${index + 1}`,
									cpu: build.CPUs?.name || "Unknown CPU",
									gpu: build.GPUs?.name || "Unknown GPU",
									ram: build.RAM?.name || "Unknown RAM",
									date: new Date().toISOString().split("T")[0],
									games: build.input.gamesList || [],
								};
							}
						);

						setBuilds(formattedBuilds);
						setRawBuilds(response.data);
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
	}, []);

	if (loading) {
		return (
			<Spinner className="flex justify-center items-center mt-10" size="lg" />
		);
	}

	if (!userId) {
		return (
			<Subtitle className="flex justify-center items-center mt-10">
				Please Login before viewing past builds.
			</Subtitle>
		);
	}

	return (
		<div className="flex flex-col gap-y-5 mt-5 mb-10 items-center">
			{builds.length === 0 ? (
				<Subtitle>❌ No build history found.</Subtitle>
			) : (
				builds.map((build: Build) => (
					<BuildCard
						build={build}
						key={build.build_id}
						onViewBuild={(id) => {
							const selectedBuild: buildAPIResponse = rawBuilds[id - 1];
							const {
								CPUs,
								GPUs,
								RAM,
								Motherboards,
								Storage,
								Power_Supply,
								Case,
								Cooling,
								input,
							} = selectedBuild.buildjson;

							loadBuildResult({
								CPUs,
								GPUs,
								RAM,
								Motherboards,
								Storage,
								Power_Supply,
								Case,
								Cooling,
							});

							loadSummary({
								...input,
								preOwnedHardware: input.preOwnedHardware.map((hardware) => ({
									name: hardware,
									type: "Unknown", // FIGURE THIS OUT!!!
								})),
							});

							router.push(`/history/${id}`);
						}}
					/>
				))
			)}
		</div>
	);
};

export default PastBuilds;
