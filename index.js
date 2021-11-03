module.exports = function({ file, maxSize, type }) {
    return new Promise(function (resolve, reject) {
        let allow = ['jpg', 'gif', 'bmp', 'png', 'jpeg', 'svg'];
        try {
            if (file.name && file.name.split(".").reverse()[0] && allow.includes(file.name.split(".").reverse()[0].toLowerCase()) && file.size && file.type) {
                let imageType = type ? type : 'jpeg';
                // const imgWidth = width ? width : 500;
                // const imgHeight = height ? height : 300;
                const max_size = maxSize ? maxSize : 1024
                const fileName = file.name;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = event => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const elem = document.createElement('canvas'), width = img.width, height = img.height;

                        if (width > height) {
                            if (width > max_size) {
                                height *= max_size / width;
                                width = max_size;
                            }
                        } else {
                            if (height > max_size) {
                                width *= max_size / height;
                                height = max_size;
                            }
                        }

                        elem.width = width
                        elem.height = height

                        // elem.width = imgWidth;
                        // elem.height = imgHeight;
                        const ctx = elem.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        ctx.canvas.toBlob((blob) => {
                            const file = new File([blob], fileName, {
                                type: imageType.toLowerCase(),
                                lastModified: Date.now()
                            });
                            resolve(file)
                        }, 'image/jpeg', 1);
                    }, reader.onerror = error => reject(error);
                };
            } else reject('File not supported!')
        } catch (error) {
            console.log("Error while image resize: ", error);
            reject(error)
        }
    })
}
