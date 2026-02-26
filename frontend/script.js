document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const scanBtn = document.getElementById('scanBtn');
    const trainBtn = document.getElementById('trainBtn');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const confidenceFill = document.getElementById('confidenceFill');
    const terminalLog = document.getElementById('terminalLog');

    let selectedFile = null;

    // --- Helper Functions ---
    const addLog = (message) => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `> ${message}`;
        terminalLog.appendChild(entry);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    };

    const setStatus = (type, text) => {
        statusIndicator.className = 'indicator ' + type;
        statusText.textContent = text;
    };

    // --- Event Listeners ---
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewContainer.style.display = 'block';
            dropZone.style.display = 'none';
            addLog(`Image loaded: ${file.name}`);
        };
        reader.readAsDataURL(file);
    };

    // --- API Calls ---
    scanBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        setStatus('processing', 'Analyzing...');
        addLog('Initiating Neural Scan...');
        scanBtn.disabled = true;
        confidenceFill.style.width = '0%';

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.status === 'success') {
                const isAccepted = data.decision === 'ACCEPTED';
                setStatus(isAccepted ? 'success' : 'error', data.decision);
                addLog(`Result: ${data.decision}`);
                addLog(data.message);

                // Simulate confidence bar based on decision
                confidenceFill.style.width = isAccepted ? '85%' : '15%';
            } else {
                throw new Error(data.detail || 'Analysis failed');
            }
        } catch (error) {
            setStatus('error', 'Error');
            addLog(`Error: ${error.message}`);
        } finally {
            scanBtn.disabled = false;
        }
    });

    trainBtn.addEventListener('click', async () => {
        addLog('Requesting background training...');
        try {
            const response = await fetch('/api/train', { method: 'POST' });
            const data = await response.json();
            addLog(data.message);
        } catch (error) {
            addLog(`Training Error: ${error.message}`);
        }
    });
});
