import "../../css/board.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { red, grey } from "@mui/material/colors";

export default function PostOutline({ post }) {
  return (
    <div className="post_outline">
      <span className="post_outline_top_box">
        <span className="post_outline_title">{post.title.length >= 40 ? post.title.slice(0, 35) + "..." : post.title}</span>
        <span className="post_outline_date">{post.createdAt.slice(2, 10)}</span>
      </span>
      <div className="post_outline_writer">{post.writer}</div>
      <div className="post_outline_botright_box">
        <span className="post_outline_likes">{post.likes}</span>
        <FavoriteIcon sx={{ fontSize: 14, color: red[500] }} />
        <span className="post_outline_comments">{post.commentscount}</span>
        <ChatBubbleIcon sx={{ fontSize: 14, color: grey[700] }} />
      </div>
    </div>
  );
}
