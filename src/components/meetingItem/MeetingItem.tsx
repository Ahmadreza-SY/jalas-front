import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class MeetingItem extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			id: "",
			title: "",
			state: ""
		};
	}

	render() {
		return (
			<Link
				to={"/meeting/" + this.props.id}
				style={{ color: "inherit", textDecoration: "inherit" }}>
				<div className="row">
					<label className="col-md-12">
						Title: {this.props.title}
					</label>
					<label className="col-md-12">
						State: {this.props.state}
					</label>
				</div>
			</Link>
		);
	}
}

interface Props {
	id: string;
	title: string;
	state: string;
}

interface State {}
