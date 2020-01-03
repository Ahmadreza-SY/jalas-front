import React, {Component} from "react";
import {CommentModel} from "../../api/models/MeetingModels";
import "./CommentItem.css"
import TimeUtils from "../../utils/TimeUtils";
import Api from '../../api/Api';

export default class CommentItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {showReplyBox: false, replyContent: ""}
  }

  showReplyBox() {
    return <div className={"reply-text-container"}>
    <textarea disabled={!this.state.showReplyBox}
              className="form-control"
              id="inputCommentContent"
              placeholder="متن"
              value={this.state.replyContent}
              onChange={(e) => this.handleCommentChange(e)}/>
      <button onClick={() => this.addReply()} className="btn btn-info"><i className="fa fa-paper-plane"
                                                                          aria-hidden="true"/></button>
    </div>
  }

  handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({...this.state, replyContent: e.target.value});
  }

  addReplyToParent(replyParentId: string, reply: CommentModel, currentComment: CommentModel) {
    if (currentComment.id === replyParentId) {
      currentComment.replies.push(reply);
      return
    }
    currentComment.replies.forEach(r => {
      this.addReplyToParent(replyParentId, reply, r)
    })
  }

  addReply() {
    let user = JSON.parse(localStorage.getItem("user")!!);
    this.addReplyToParent(
      this.props.comment.id!!,
      new CommentModel(undefined, user.email, this.state.replyContent, new Date().getTime(), [], this.props.parentComment.meetingId),
      this.props.parentComment
    );
    this.updateComment(this.props.parentComment);
    this.setState({showReplyBox: false, replyContent: ''})
  }

  updateComment(parentComment: CommentModel) {
    Api
      .updateCommentForMeeting(this.props.parentComment.meetingId, parentComment)
      .then(response => {
        this.props.updateCallback(response.data)
      })
  }


  toggleShowReplyBox() {
    this.setState({showReplyBox: !this.state.showReplyBox})
  }


  render() {
    let comment = this.props.comment;
    return <div className="list-group-item list-group-item-dark">
      <div className="panel panel-default">
        <div className="row">
          <strong className="col">{comment.owner}</strong>
          <span className="col-auto text-muted">{TimeUtils.getFromNowDuration(comment.creationDate)}</span>
          <button onClick={() => this.toggleShowReplyBox()} className="btn btn-info"><i className="fas fa-reply"/>
          </button>
          {/*<button className="btn btn-info"><i className="fas fa-edit"/></button>*/}
          {/*<button className="btn btn-info"><i className="fas fa-trash"/></button>*/}
        </div>
        <div className="panel-body">
          {comment.content}
        </div>
        {this.state.showReplyBox && this.showReplyBox()}
        {this.props.comment.replies.map((reply: CommentModel, index: number) =>
          <CommentItem updateCallback={this.props.updateCallback} key={reply.id}
                       parentComment={this.props.parentComment} comment={reply}/>
        )}
      </div>
    </div>;
  }
}

interface State {
  showReplyBox: boolean
  replyContent: string
}

interface Props {
  parentComment: CommentModel
  comment: CommentModel,
  updateCallback: (cm: CommentModel) => void
}