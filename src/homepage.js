// Handle dropped files
document.getElementById("upload-box").addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
        console.log('File Path of dragged files: ', f.path)
    }
});


// Handle uploaded files    
document.getElementById('upload-box').addEventListener('click', async () => {
    const result = await window.api.openDialog();
    return result;
});