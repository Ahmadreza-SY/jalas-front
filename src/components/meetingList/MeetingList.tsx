import React, { Component } from "react";
import { Link } from "react-router-dom";
import MeetingItem from "./MeetingItem";
import { Meeting } from "../../api/models/MeetingModels";
import Api from "../../api/Api";
import Header from "../common/Header";
import {User} from "../../api/models/UserModels";

export default class MeetingList extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			meetings: [],
			user: undefined
		};
	}

	componentDidMount(): void {
		this.getMeetings();
		Api.profile().then(response => this.setState({user: response.data}))
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
				<Header user={this.state.user}/>
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
	meetings: Meeting[]
	user: User | undefined
}
