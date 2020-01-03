import React, {Component} from "react";
import {CommentModel} from "../../api/models/MeetingModels";
import "./CommentItem.css"
import TimeUtils from "../../utils/TimeUtils";

export default class CommentItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {show_reply_box: false, reply_content: "CONTENT"}
  }

  show_reply_box() {
    return <div className={"reply-text-container"}>
    <textarea disabled={!this.state.show_reply_box}
              className="form-control"
              id="inputCommentContent"
              placeholder="متن"
              value={this.state.reply_content}/>
      <button className="btn btn-info"><i className="fa fa-paper-plane" aria-hidden="true"/></button>
    </div>
  }

  toggle_show_reply_box() {
    this.setState({show_reply_box: !this.state.show_reply_box})
  }


  render() {
    let comment = this.props.comment;
    return <div className="list-group-item list-group-item-dark">
      <div className="panel panel-default">
        <div className="row">
          <strong className="col">{comment.owner}</strong>
          <span className="col-auto text-muted">{TimeUtils.getFromNowDuration(comment.creationDate)}</span>
          <button onClick={() => this.toggle_show_reply_box()} className="btn btn-info"><i className="fas fa-reply"/>
          </button>
          {/*<button className="btn btn-info"><i className="fas fa-edit"/></button>*/}
          {/*<button className="btn btn-info"><i className="fas fa-trash"/></button>*/}
        </div>
        <div className="panel-body">
          {comment.content}
        </div>
        {this.state.show_reply_box && this.show_reply_box()}
        {this.props.comment.replies.map((reply: CommentModel, index: number) =>
          <CommentItem key={index} parentComment={this.props.parentComment} comment={reply}/>
        )}
      </div>
    </div>;
  }
}

interface State {
  show_reply_box: boolean
  reply_content: string
}

interface Props {
  parentComment: CommentModel
  comment: CommentModel
}