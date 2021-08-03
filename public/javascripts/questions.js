window.addEventListener("DOMContentLoaded", (event) => {
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((editButton) => {
    editButton.addEventListener("click", (e) => {
      e.preventDefault();

      // pull SQL serial id from the element ID
      const questionId = editButton.id.split("-")[1];

      window.location.href = `/questions/${questionId}/edit`;
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();

      // pull SQL serial id from the element ID
      const questionId = deleteButton.id.split("-")[1];

      window.location.href = `/questions/${questionId}/delete`;
    });
  });

  const answerButtons = document.querySelectorAll(".answer-button");
  answerButtons.forEach((answerButton) => {
    answerButton.addEventListener("click", (e) => {
      e.preventDefault();

      // pull SQL serial id from the element ID
      const questionId = answerButton.id.split("-")[1];
      window.location.href = `answers/${questionId}`;
    });
  });

  const showCommentsButtons = document.querySelectorAll(".showComment-button");
  showCommentsButtons.forEach(async (showCommentsButton) => {
    showCommentsButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const answerId = showCommentsButton.id.split("-")[1];
      const commentsContent = document.getElementById(`${answerId}`)
      const postComment = document.querySelector(`.new-comment-container-${answerId}`)

      if (e.target.innerHTML === "Show Comments") {
        e.target.innerHTML = "Hide Comments";
        commentsContent.classList.remove('--hidden')
        postComment.classList.remove('--hidden')
       
      } else {
        e.target.innerHTML = "Show Comments";
        commentsContent.classList.add('--hidden')
        postComment.classList.add('--hidden')
      }
    });
  });
});
