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
    return <div className="col-sm-8 col-sm-offset-2">
      <div className="panel panel-default">
        <div className="panel-heading">
          <strong>{comment.owner}</strong>
          <span className="text-muted">{TimeUtils.getFromNowDuration(comment.creationDate)}</span>
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