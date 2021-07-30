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

      if (e.target.innerHTML === "Show Comments") {
        e.target.innerHTML = "Hide Comments";

        // pull SQL serial id from the element ID

        try {
          const answerComments = await fetch(
            `http://localhost:8080/answers/${answerId}/comments`
          );

          if (!answerComments.ok) {
            throw answerComments;
          }

          const json = await answerComments.json();

          if (json.length) {
            const commentsDiv = document.querySelector(
              `.current-comment-container-${answerId}`
            );
            json.forEach((comment) => {
              const commentDiv = document.createElement("div");
              commentDiv.classList.add("commentContent");
              const usernameDiv = document.createElement("div");
              usernameDiv.classList.add("username");
              const contentDiv = document.createElement("div");
              contentDiv.classList.add("content");
              usernameDiv.innerHTML = comment.User.username;
              contentDiv.innerHTML = comment.content;

              commentDiv.appendChild(contentDiv);
              commentDiv.appendChild(usernameDiv);
              commentsDiv.appendChild(commentDiv);
            });
          }

          // add a textbox where user can add a comment
          const newCommentForm = document.createElement("form");
          newCommentForm.setAttribute("method", "post");
          newCommentForm.setAttribute(
            "action",
            `/answers/${answerId}/comments`
          );

          const newCommentBox = document.createElement("textarea");
          newCommentBox.setAttribute("name", "content");

          const newCommentToken = document.createElement("input");
          newCommentToken.setAttribute("type", "hidden");

          const newCommentButton = document.createElement("button");
          newCommentButton.setAttribute("type", "submit");
          newCommentButton.innerHTML = "Post Comment";

          newCommentForm.appendChild(newCommentBox);
          newCommentForm.appendChild(newCommentToken);
          newCommentForm.appendChild(newCommentButton);

          const newCommentContainer = document.querySelector(
            `.new-comment-container-${answerId}`
          );
          newCommentContainer.appendChild(newCommentForm);

          // const hideCommentsButton = document.createElement('button');
          // hideCommentsButton.setAttribute('class', 'hideComment-button');
          // hideCommentsButton.setAttribute('id', `hideComments-${answerId}`);
          // hideCommentsButton.innerHTML = 'Hide Comments';

          // const commentsButton = showCommentsButton.parentNode;
          // commentsButton.removeChild(showCommentsButton);
          // commentsButton.appendChild(hideCommentsButton);
        } catch (err) {
          if (err.status >= 400 && err.status < 600) {
            const errorJSON = await err.json();
            const errorsContainer = document.querySelector(".errors-container");
            const { errors } = errorJSON;
            const errorsHTML = errors.map(
              (error) =>
                `
                        <div class="alert alert-danger">
                            ${error.message}
                        </div>
                        `
            );
            errorsContainer.innerHTML = errorsHTML.join("");
          } else {
            console.log(err);
          }
        }
      } else {
        e.target.innerHTML = "Show Comments";
        const commentsDiv = document.querySelector(
          `.current-comment-container-${answerId}`
        );
        const newCommentContainer = document.querySelector(
          `.new-comment-container-${answerId}`
        );
        removeAllChildNodes(commentsDiv);
        removeAllChildNodes(newCommentContainer);
      }
    });
  });
});
