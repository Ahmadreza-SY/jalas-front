import React, { Component } from "react";
import { Link } from "react-router-dom";
import MeetingItem from "../meetingItem/MeetingItem";
import { Meeting } from "../../api/models/MeetingModels";
import Api from "../../api/Api";

export default class MeetingList extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			meetings: []
		};
	}

	componentDidMount(): void {
		this.getMeetings();
	}

	getMeetings() {
		Api.getMeetings().then(response => {
			this.setState({
				...this.state,
				meetings: response.data
			});
		});
	}

	render() {
		return (
			<div>
				<Link to="/meeting/new">
					<button>Create New Poll</button>
				</Link>
				<hr />
				<ul>
					{this.state.meetings.map(
						(meeting: Meeting, index: number) => (
							<li key={index}>
								<MeetingItem
									id={meeting.id}
									title={meeting.title}
									state={meeting.status}
								/>
								<hr />
							</li>
						)
					)}
				</ul>
			</div>
		);
	}
}

interface Props {}

interface State {
	meetings: Meeting[];
}
