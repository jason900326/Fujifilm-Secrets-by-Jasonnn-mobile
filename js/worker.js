self.addEventListener('message', function(event) {
    const { imageData, settings } = event.data;

    // 在這裡處理圖像濾鏡效果
    // 根據接收到的imageData和settings應用濾鏡效果
    // 然後將處理完的圖像數據發送回主線程

    // 處理濾鏡效果
    const data = imageData.data;
    const { brightness, contrast, saturate } = settings;
    const strength = 1; // 設定一個初始強度，您可以根據需要調整

    for (let i = 0; i < data.length; i += 4) {
        // 處理每個像素的 RGB 色值
        data[i] = Math.min(255, data[i] * brightness * strength); // R
        data[i + 1] = Math.min(255, data[i + 1] * contrast * strength); // G
        data[i + 2] = Math.min(255, data[i + 2] * saturate * strength); // B
    }

    // 將處理後的圖像數據發送回主線程
    self.postMessage(imageData);
});