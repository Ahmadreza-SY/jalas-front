import React, {Component} from "react";
import {CommentModel} from "../../api/models/MeetingModels";
import "./CommentItem.css"
import TimeUtils from "../../utils/TimeUtils";
import Api from '../../api/Api';

export default class CommentItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {showReplyBox: false, replyContent: "", isEditing: false}
  }

  showReplyBox() {
    return <div className={"reply-text-container"}>
    <textarea disabled={!this.state.showReplyBox && !this.state.isEditing}
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

  getUser() {
    return JSON.parse(localStorage.getItem("user")!!);
  }

  updateCommentContent(currentComment: CommentModel) {
    currentComment.content = this.state.replyContent;
  }

  deleteReply(reply: CommentModel, currentComment: CommentModel) {
    const foundReply = currentComment.replies.find(r => r.id === reply.id);
    if (foundReply) {
      currentComment.replies = currentComment.replies.filter(r => r.id !== reply.id)
      this.updateComment(this.props.parentComment)
    } else {
      currentComment.replies.forEach(r => this.deleteReply(reply, r))
    }

  }

  addReply() {
    let user = this.getUser();
    if (this.state.isEditing) {
      this.updateCommentContent(this.props.comment)
    } else {
      this.addReplyToParent(
        this.props.comment.id!!,
        new CommentModel(undefined, user.email, this.state.replyContent, new Date().getTime(), [], this.props.parentComment.meetingId),
        this.props.parentComment
      );
    }
    this.updateComment(this.props.parentComment);
    this.setState({showReplyBox: false, isEditing: false, replyContent: ''})
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

  editComment() {
    this.setState({
      isEditing: !this.state.isEditing,
      replyContent: this.props.comment.content
    })
  }

  deleteComment() {
    if (this.props.comment.id === this.props.parentComment.id) {
      Api.deleteComment(this.props.comment.id!!).then(
        response => {
          if (this.props.deleteCallback)
            this.props.deleteCallback()
        }
      )

    } else {
      this.deleteReply(this.props.comment, this.props.parentComment)
    }
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
          {(this.props.comment.owner === this.getUser().email) &&
          <button onClick={() => this.editComment()} className="btn btn-info"><i className="fas fa-edit"/></button>}
          {(this.props.isMeetingOwner || this.props.comment.owner === this.getUser().email) &&
          <button onClick={() => this.deleteComment()} className="btn btn-danger"><i className="fas fa-trash"/>
          </button>}
        </div>
        {!this.state.isEditing &&
        <div className="panel-body">
          {comment.content}
        </div>
        }
        {(this.state.showReplyBox || this.state.isEditing) && this.showReplyBox()}
        {this.props.comment.replies.map((reply: CommentModel, index: number) =>
          <CommentItem updateCallback={this.props.updateCallback} key={reply.id}
                       parentComment={this.props.parentComment} comment={reply}
                       deleteCallback={null}
                       isMeetingOwner={this.props.isMeetingOwner}
          />
        )}
      </div>
    </div>;
  }
}

interface State {
  showReplyBox: boolean
  replyContent: string
  isEditing: boolean
}

interface Props {
  parentComment: CommentModel
  comment: CommentModel,
  updateCallback: (cm: CommentModel) => void
  deleteCallback: (() => void) | null
  isMeetingOwner: boolean
}