import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function useBoardForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const loading = useSelector((state) => {
    state.board.loading;
  });
  const error = useSelector((state) => {
    state.board.error;
  });
  const success = useSelector((state) => {
    state.board.success;
  });

  const [isEdit, setIsEdit] = useState(false);
  const [boardId, setBoardId] = useState(null);

  const [boardCategory, setBoardCategoty] = useState("FREE");
  const [boardSubCategory, setBoardSubCategory] = useState("TALK");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardStars, setBoardStars] = useState(5);

  // 수정데이터 감지하는 거
  useEffect(() => {
    dispatch(resetStatus());
    if (location.state.board) {
    }
  });
}
