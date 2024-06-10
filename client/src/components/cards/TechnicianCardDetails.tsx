import { capitalizeFirstLetter, formatDate } from "@/utils";
import { Briefcase, CalendarDays, Map, Star } from "lucide-react";

interface TechnicianDetailsProps {
	country_of_origin: string;
	occupation: string;
	date_joined: string;
	average_rating: number;
}

export default function TechnicianCardDetails({
	country_of_origin,
	occupation,
	date_joined,
	average_rating,
}: TechnicianDetailsProps) {
	return (
		<div className="space-y-2">
			<p className="flex items-center space-x-2">
				<Map className="card-icon" />
				<span className="tab-font">Country of Origin: </span>
				<span className="tab-font">{country_of_origin}</span>
			</p>
			<p className="flex items-center space-x-2">
				<Briefcase className="card-icon" />
				<span className="tab-font">Occupation: </span>
				<span className="tab-font">{capitalizeFirstLetter(occupation)}</span>
			</p>
			<p className="flex items-center space-x-2">
				<Star className="card-icon" />
				<span className="tab-font">Average rating: </span>
				<span className="flex items-center space-x-0">
					{[...Array(5)].map((_, index) => {
						const ratingValue = index + 0.5;
						return (
							<span key={index}>
								{average_rating >= index + 1 ? (
									<Star className="text-pumpkin fill-current" />
								) : average_rating >= ratingValue ? (
									<Star
										className="text-pumpkin fill-current"
										fillOpacity={0.5}
									/>
								) : (
									<Star className="text-gray fill-current" />
								)}
							</span>
						);
					})}
				</span>
			</p>
			<p className="flex items-center space-x-2">
				<CalendarDays className="card-icon" />
				<span className="tab-font">Date Joined: </span>
				<span className="tab-font">{formatDate(date_joined).toString()}</span>
			</p>
		</div>
	);
}
