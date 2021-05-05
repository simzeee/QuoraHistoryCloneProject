window.addEventListener("DOMContentLoaded", (event) => {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', (e) => {
            e.preventDefault();

            // pull SQL serial id from the element ID
            const questionId = editButton.id.split('-')[1];

            window.location.href = `/questions/${questionId}/edit`;
        })
    });

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();

            // pull SQL serial id from the element ID
            const questionId = deleteButton.id.split('-')[1];

            window.location.href = `/questions/${questionId}/delete`;
        })
    });

    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(answerButton => {
        answerButton.addEventListener('click', (e) => {
            e.preventDefault();

            // pull SQL serial id from the element ID
            const questionId = answerButton.id.split('-')[1];
            window.location.href = `answers/${questionId}`;
        })
    });
})
