import React, {Component} from "react";
import {Link} from "react-router-dom";
import {User} from "../../api/models/UserModels";
import {MeetingStatus} from "../../api/models/MeetingModels";

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
        to={"/meeting/" + this.props.id + ((this.props.user && !this.props.p && this.props.state === MeetingStatus.ELECTING) ? ("/vote/" + this.props.user!!.email) : "")}
        style={{color: "inherit", textDecoration: "inherit"}}>
        <li className="list-group-item list-group-item-dark">
          <div>
					<span className="">
						{this.props.title}
					</span>
            <span className="badge badge-dark ml-3">
						{this.props.state}
					</span>
          </div>
        </li>
      </Link>
    );
  }
}

interface Props {
  id: string;
  title: string;
  state: string;
  p: boolean;
  user: User | undefined;
}

interface State {
}
