import React, {Component} from "react";
import {CommentModel} from "../../api/models/MeetingModels";
import "./CommentItem.css"
import TimeUtils from "../../utils/TimeUtils";

export default class CommentItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    let comment = this.props.comment;
    return <div className="list-group-item list-group-item-dark">
      <div className="panel panel-default">
        <div className="row">
          <strong className="col">{comment.owner}</strong>
          <span className="col-auto text-muted">{TimeUtils.getFromNowDuration(comment.creationDate)}</span>
        </div>
        <div className="panel-body">
          {comment.content}
        </div>
      </div>
    </div>;
  }
}

interface State {
}

interface Props {
  comment: CommentModel
}