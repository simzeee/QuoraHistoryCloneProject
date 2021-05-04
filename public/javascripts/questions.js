window.addEventListener("DOMContentLoaded", (event) => {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', async (e) => {
            e.preventDefault();

            // pull SQL serial id from the element ID
            const questionId = editButton.id.split('-')[1];

            window.location.href = `/questions/${questionId}/edit`;
        })
    });

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', async (e) => {
            e.preventDefault();

            // pull SQL serial id from the element ID
            const questionId = deleteButton.id.split('-')[1];

            window.location.href = `/questions/${questionId}/delete`;
        })
    });
})
