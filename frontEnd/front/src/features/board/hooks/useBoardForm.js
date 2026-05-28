import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { writeBoardApi, updateBoardApi } from "../api/boardApi";
import {
  setLoading,
  setError,
  setSuccess,
  resetStatus,
} from "../store/boardSlice";

export default function useBoardForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.board.loading);
  const error = useSelector((state) => state.board.error);
  const success = useSelector((state) => state.board.success);

  // 수정 모드 상태 관리
  const [isEdit, setIsEdit] = useState(false);
  const [boardId, setBoardId] = useState(null);

  // 폼 상태 관리
  const [boardCategory, setBoardCategory] = useState("FREE");
  const [boardSubCategory, setBoardSubCategory] = useState("잡담");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardStars, setBoardStars] = useState(5);

  // 수정 데이터 감지 및 세팅
  useEffect(() => {
    dispatch(resetStatus());
    if (location.state?.board) {
      const { id, title, content, category, subCategory, stars } =
        location.state.board;
      setIsEdit(true);
      setBoardId(id);
      setTitle(title || "");
      setContent(content || "");
      setBoardCategory(category || "FREE");
      setBoardSubCategory(subCategory || "잡담");
      setBoardStars(stars || 5);
    }
  }, [location.state, dispatch]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setBoardCategory(newCategory);
    if (newCategory !== "PRODUCT_REVIEW" && newCategory !== "FAC_REVIEW") {
      setBoardStars(5);
    }
  };

  const handleSubCategoryChange = (e) => {
    setBoardSubCategory(e.target.value);
  };

  const handleStarClick = (score) => {
    setBoardStars(score);
  };

  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      alert("내용을 입력해주세요.");
      return;
    }

    const boardData = {
      title,
      content,
      boardStars:
        boardCategory === "PRODUCT_REVIEW" || boardCategory === "FAC_REVIEW"
          ? boardStars
          : 5,
      boardCategory,
      boardSubCategory: boardCategory === "FREE" ? boardSubCategory : null,
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(boardData)], { type: "application/json" }),
    );

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      if (isEdit) {
        await updateBoardApi(boardId, formData);
        alert("게시글이 성공적으로 수정되었습니다!");
      } else {
        await writeBoardApi(formData);
        alert("게시글이 성공적으로 등록되었습니다!");
      }
      dispatch(setSuccess(true));
      navigate(-1);
    } catch (err) {
      console.error(isEdit ? "게시글 수정 실패:" : "게시글 등록 실패:", err);
      const errMsg =
        err.response?.data?.message ||
        (isEdit
          ? "게시글 수정에 실패했습니다."
          : "게시글 등록에 실패했습니다.");
      dispatch(setError(errMsg));
      alert(errMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    navigate,
    isEdit,
    boardId,
    boardCategory,
    boardSubCategory,
    title,
    setTitle,
    content,
    setContent,
    boardStars,
    loading,
    error,
    success,
    handleCategoryChange,
    handleSubCategoryChange,
    handleStarClick,
    handleEditorChange,
    handleSubmit,
  };
}
