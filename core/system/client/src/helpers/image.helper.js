const imageHelper = {
    toBase64: (file) => {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (event) {
                    resolve(event.target.result);
                }
                reader.onerror = (error) => reject(error);
            } catch (err) {
                console.warn(err.message);
            }

        });
    }
}

export default imageHelper;